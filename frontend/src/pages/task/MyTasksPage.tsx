import React, { useState, useEffect, useMemo } from 'react';
import { taskService, type Task, type CreateTaskInput } from '../../services/taskService';
import { projectService, type Project } from '../../services/projectService';
import { tagService } from '../../services/tagService';
import type { Tag as TagType } from '../../types';
import { Sidebar } from '../../components/layout/Sidebar';
import { TaskDetailModal } from './TaskDetailModal';
import dayjs from 'dayjs';
import {
    Layout,
    Card,
    Row,
    Col,
    Typography,
    Space,
    Tag,
    Checkbox,
    Badge,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Dropdown,
    message,
    Spin,
    Segmented,
    Table,
    Avatar,
    Tooltip,
} from 'antd';
import type { MenuProps, TableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    CalendarOutlined,
    FolderOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    PauseCircleOutlined,
    StopOutlined,
    PlusOutlined,
    DownloadOutlined,
    FilePdfOutlined,
    MoreOutlined,
    EyeOutlined,
    DeleteOutlined,
    WarningOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    FilterOutlined,
    ClearOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useCountUp } from '../../hooks/useCountUp';
import { DndContext, DragOverlay, useDroppable, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core';
import { kanbanCollision } from '../../utils/kanbanCollision';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { exportTasks } from '../../utils/exportExcel';
import { exportTasksPDF } from '../../utils/exportPDF';
import { STATUS_CONFIG, STATUS_COLUMN_ORDER, PRIORITY_CONFIG } from '../../constants';
import './MyTasksPage.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Derive STATUS_COLUMNS from centralized config
const STATUS_COLUMNS = STATUS_COLUMN_ORDER.map(key => ({
    key,
    label: STATUS_CONFIG[key].label,
    color: STATUS_CONFIG[key].dotColor,
    dotColor: STATUS_CONFIG[key].dotColor,
}));

// --- Stat Card with count-up animation + gradient ---
const StatCardItem = ({ title, value, icon, iconClass, gradientFrom }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconClass: string;
    gradientFrom?: string;
}) => {
    const animatedValue = useCountUp(value, 1000);
    return (
        <Card
            className="stat-card"
            variant="borderless"
            style={gradientFrom ? { background: `linear-gradient(135deg, ${gradientFrom} 0%, #ffffff 100%)` } : undefined}
        >
            <div className="stat-card-inner">
                <div>
                    <div className="stat-label">{title}</div>
                    <div className="stat-value">{animatedValue}</div>
                </div>
                <div className={`stat-icon-box ${iconClass}`}>
                    {icon}
                </div>
            </div>
        </Card>
    );
};

function MyTasksDroppableColumn({ id, className, children }: { id: string; className: string; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={`${className} ${isOver ? 'mytasks-column-over' : ''}`}>
            {children}
        </div>
    );
}

function SortableMyTaskCard({ id, children, onClick, className: extraClass }: { id: string; children: React.ReactNode; onClick: () => void; className?: string }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };
    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className={`mytasks-card ${isDragging ? 'mytasks-card-dragging' : ''} ${extraClass || ''}`}
            onClick={() => !isDragging && onClick()}
        >
            {children}
        </div>
    );
}

export const MyTasksPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [form] = Form.useForm();
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    // View mode: Board or List
    const [viewMode, setViewMode] = useState<string>(() =>
        localStorage.getItem('myTasksViewMode') || 'board'
    );

    // Multi-filter state
    const [statusFilters, setStatusFilters] = useState<string[]>([]);
    const [tagFilters, setTagFilters] = useState<string[]>([]);
    const [allTags, setAllTags] = useState<TagType[]>([]);

    // DnD State
    const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);
    const dndSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    // Status change modal state
    const [statusChangeModal, setStatusChangeModal] = useState<{
        visible: boolean;
        taskId: string;
        fromStatus: string;
        toStatus: string;
        progress: number;
    }>({ visible: false, taskId: '', fromStatus: '', toStatus: '', progress: 0 });
    const [statusChangeNote, setStatusChangeNote] = useState('');
    const [statusChangeLoading, setStatusChangeLoading] = useState(false);

    const getTaskMenuItems = (task: Task): MenuProps['items'] => [
        {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'View / Edit',
            onClick: (info) => {
                info.domEvent.stopPropagation();
                setSelectedTaskId(task.id);
                setDetailModalVisible(true);
            },
        },
        { type: 'divider' },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete Task',
            danger: true,
            onClick: (info) => {
                info.domEvent.stopPropagation();
                Modal.confirm({
                    title: 'Delete Task',
                    content: `Delete "${task.title}"? This cannot be undone.`,
                    okText: 'Delete',
                    okType: 'danger',
                    onOk: async () => {
                        try {
                            await taskService.deleteTask(task.id);
                            message.success('Task deleted');
                            loadMyTasks();
                        } catch {
                            message.error('Failed to delete task');
                        }
                    },
                });
            },
        },
    ];

    useEffect(() => {
        loadMyTasks();
        loadTags();
    }, []);

    // Persist view mode
    const handleViewModeChange = (value: string | number) => {
        const mode = String(value);
        setViewMode(mode);
        localStorage.setItem('myTasksViewMode', mode);
    };

    const loadTags = async () => {
        try {
            const tags = await tagService.getAllTags();
            setAllTags(tags);
        } catch {
            // silently fail — tags filter just won't show options
        }
    };

    const loadMyTasks = async () => {
        try {
            setLoading(true);
            const response = await taskService.getMyTasks({ pageSize: 200 });
            setTasks(response.tasks || []);
        } catch (error) {
            message.error('Failed to load tasks');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    // Filter tasks with multi-filter
    const filteredTasks = useMemo(() => tasks.filter(task => {
        if (priorityFilter.length > 0 && !priorityFilter.includes(task.priority)) {
            return false;
        }
        if (statusFilters.length > 0 && !statusFilters.includes(task.status)) {
            return false;
        }
        if (tagFilters.length > 0) {
            const taskTagIds = (task.taskTags || []).map(tt => tt.tagId || tt.tag?.id);
            if (!tagFilters.some(tf => taskTagIds.includes(tf))) {
                return false;
            }
        }
        return true;
    }), [tasks, priorityFilter, statusFilters, tagFilters]);

    // Active filter count
    const activeFilterCount = (priorityFilter.length > 0 ? 1 : 0) + (statusFilters.length > 0 ? 1 : 0) + (tagFilters.length > 0 ? 1 : 0);

    const clearAllFilters = () => {
        setPriorityFilter([]);
        setStatusFilters([]);
        setTagFilters([]);
    };

    // Overdue check helper
    const isOverdue = (task: Task) =>
        task.dueDate &&
        task.status !== 'DONE' &&
        task.status !== 'CANCELLED' &&
        dayjs(task.dueDate).isBefore(dayjs(), 'day');

    // Stats counts
    const todoCount = filteredTasks.filter(t => t.status === 'TODO').length;
    const inProgressCount = filteredTasks.filter(t => t.status === 'IN_PROGRESS').length;
    const doneCount = filteredTasks.filter(t => t.status === 'DONE').length;
    const holdCount = filteredTasks.filter(t => t.status === 'HOLD').length;
    const cancelledCount = filteredTasks.filter(t => t.status === 'CANCELLED').length;
    const overdueCount = filteredTasks.filter(t => isOverdue(t)).length;

    // Group tasks by status (order from backend: sortOrder → dueDate → priority)
    const getTasksByStatus = (status: string) =>
        filteredTasks.filter(t => t.status === status);

    // Drag and drop handlers
    const handleDragStart = (event: DragStartEvent) => {
        const task = tasks.find(t => t.id === event.active.id);
        setActiveDragTask(task || null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragTask(null);
        if (!over) return;

        const taskId = active.id as string;
        let newStatus = over.id as string;
        const overTask = tasks.find(t => t.id === newStatus);
        if (overTask) newStatus = overTask.status;
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        // Same column — reorder and persist
        if (task.status === newStatus) {
            if (overTask && active.id !== over.id) {
                setTasks(prev => {
                    const updated = [...prev];
                    const oldIdx = updated.findIndex(t => t.id === active.id);
                    const newIdx = updated.findIndex(t => t.id === over.id);
                    const [moved] = updated.splice(oldIdx, 1);
                    updated.splice(newIdx, 0, moved);
                    // Persist new order
                    const columnIds = updated.filter(t => t.status === newStatus).map(t => t.id);
                    taskService.reorderTasks(columnIds).catch(() => {});
                    return updated;
                });
            }
            return;
        }

        // Cross-column — show modal for note
        setStatusChangeNote('');
        setStatusChangeModal({
            visible: true,
            taskId,
            fromStatus: task.status,
            toStatus: newStatus,
            progress: newStatus === 'DONE' ? 100 : task.progress,
        });
    };

    const handleStatusChangeConfirm = async () => {
        if (!statusChangeNote.trim()) {
            message.warning('กรุณากรอกเหตุผลที่เปลี่ยนสถานะ');
            return;
        }
        const { taskId, toStatus, progress } = statusChangeModal;
        setStatusChangeLoading(true);

        // Optimistic update
        const oldTasks = [...tasks];
        setTasks(prev => prev.map(t =>
            t.id === taskId
                ? { ...t, status: toStatus as Task['status'], progress }
                : t
        ));

        try {
            await taskService.updateTaskStatus(taskId, {
                status: toStatus,
                progress,
                note: statusChangeNote.trim(),
            });
            message.success(`Task moved to ${toStatus.replace(/_/g, ' ')}`);
            setStatusChangeModal(prev => ({ ...prev, visible: false }));
        } catch (error) {
            setTasks(oldTasks);
            message.error('Failed to update task status');
            console.error(error);
        } finally {
            setStatusChangeLoading(false);
        }
    };

    const handleStatusChangeCancel = () => {
        setStatusChangeModal(prev => ({ ...prev, visible: false }));
        setStatusChangeNote('');
    };

    // New Task handlers
    const handleNewTask = async () => {
        try {
            const res = await projectService.getProjects({ pageSize: 100 });
            setProjects(res.projects || []);
        } catch {
            message.error('Failed to load projects');
        }
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleCreateTask = async () => {
        try {
            const values = await form.validateFields();
            const payload: CreateTaskInput = {
                title: values.title,
                description: values.description,
                priority: values.priority || 'MEDIUM',
                status: values.status || 'TODO',
                dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
            };
            await taskService.createTask(values.projectId, payload);
            message.success('Task created');
            setIsModalVisible(false);
            loadMyTasks();
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'errorFields' in error) return; // form validation
            message.error('Failed to create task');
            console.error(error);
        }
    };

    return (
        <Layout className="my-tasks-layout">
            <Sidebar />

            <Layout>
                <Header className="my-tasks-header">
                    <div className="my-tasks-header-content">
                        <div>
                            <Title level={2} style={{ margin: 0, fontSize: 48 }}>My Tasks</Title>
                            <Text type="secondary" style={{ fontSize: 30 }}>Tasks assigned to or created by you</Text>
                        </div>
                        <Space>
                            <Button
                                size="large"
                                icon={<DownloadOutlined />}
                                onClick={() => exportTasks(filteredTasks, 'MyTasks')}
                                style={{ borderRadius: 12 }}
                            >
                                Export Excel
                            </Button>
                            <Button
                                size="large"
                                icon={<FilePdfOutlined />}
                                onClick={() => exportTasksPDF(filteredTasks, 'MyTasks')}
                                style={{ borderRadius: 12 }}
                            >
                                Save PDF
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                onClick={handleNewTask}
                                className="create-task-btn"
                            >
                                New Task
                            </Button>
                        </Space>
                    </div>
                </Header>

                <Content className="my-tasks-content">
                    <Spin spinning={loading}>
                        {/* Stats Cards */}
                        <Row gutter={16} className="stats-row">
                            <Col xs={12} sm={3}>
                                <StatCardItem title="Total" value={filteredTasks.length} icon={<FolderOutlined />} iconClass="icon-slate" gradientFrom="#F1F5F9" />
                            </Col>
                            <Col xs={12} sm={3}>
                                <StatCardItem title="To Do" value={todoCount} icon={<CheckCircleOutlined />} iconClass="icon-purple" gradientFrom="#EDE9FE" />
                            </Col>
                            <Col xs={12} sm={3}>
                                <StatCardItem title="In Progress" value={inProgressCount} icon={<SyncOutlined />} iconClass="icon-blue" gradientFrom="#DBEAFE" />
                            </Col>
                            <Col xs={12} sm={3}>
                                <StatCardItem title="Done" value={doneCount} icon={<CheckCircleOutlined />} iconClass="icon-emerald" gradientFrom="#D1FAE5" />
                            </Col>
                            <Col xs={12} sm={3}>
                                <StatCardItem title="Hold" value={holdCount} icon={<PauseCircleOutlined />} iconClass="icon-amber" gradientFrom="#FEF3C7" />
                            </Col>
                            <Col xs={12} sm={3}>
                                <StatCardItem title="Cancelled" value={cancelledCount} icon={<StopOutlined />} iconClass="icon-slate" gradientFrom="#F1F5F9" />
                            </Col>
                            <Col xs={12} sm={3}>
                                <StatCardItem title="Overdue" value={overdueCount} icon={<WarningOutlined />} iconClass="icon-red" gradientFrom="#FEE2E2" />
                            </Col>
                        </Row>

                        {/* View Toggle + Filters */}
                        <Card className="filters-card" style={{ marginBottom: 16 }}>
                            <div className="mytasks-filters-header">
                                <Space align="center">
                                    <FilterOutlined style={{ color: '#64748B' }} />
                                    <Text strong>Filters</Text>
                                    {activeFilterCount > 0 && (
                                        <Badge count={activeFilterCount} size="small" style={{ backgroundColor: '#3B82F6' }} />
                                    )}
                                </Space>
                                <Space>
                                    {activeFilterCount > 0 && (
                                        <Button
                                            size="small"
                                            icon={<ClearOutlined />}
                                            onClick={clearAllFilters}
                                            type="link"
                                        >
                                            Clear Filters
                                        </Button>
                                    )}
                                    <Segmented
                                        value={viewMode}
                                        onChange={handleViewModeChange}
                                        options={[
                                            { value: 'board', icon: <AppstoreOutlined />, label: 'Board' },
                                            { value: 'list', icon: <UnorderedListOutlined />, label: 'List' },
                                        ]}
                                    />
                                </Space>
                            </div>
                            <div className="mytasks-filters-body">
                                <div className="mytasks-filter-group">
                                    <Text type="secondary" className="mytasks-filter-label">Status</Text>
                                    <Checkbox.Group
                                        value={statusFilters}
                                        onChange={(values) => setStatusFilters(values as string[])}
                                    >
                                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                            <Checkbox key={key} value={key}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dotColor, display: 'inline-block' }} />
                                                    {cfg.label}
                                                </span>
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                </div>
                                <div className="mytasks-filter-group">
                                    <Text type="secondary" className="mytasks-filter-label">Priority</Text>
                                    <Checkbox.Group
                                        value={priorityFilter}
                                        onChange={(values) => setPriorityFilter(values as string[])}
                                    >
                                        {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                                            <Checkbox key={key} value={key}>
                                                <span style={{ color: cfg.color, fontWeight: 500 }}>
                                                    {cfg.label}
                                                </span>
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                </div>
                                {allTags.length > 0 && (
                                    <div className="mytasks-filter-group">
                                        <Text type="secondary" className="mytasks-filter-label">Tags</Text>
                                        <Select
                                            mode="multiple"
                                            placeholder="Select tags..."
                                            value={tagFilters}
                                            onChange={setTagFilters}
                                            style={{ minWidth: 200 }}
                                            maxTagCount={3}
                                            allowClear
                                            size="small"
                                        >
                                            {allTags.map(tag => (
                                                <Select.Option key={tag.id} value={tag.id}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                        <span style={{ width: 8, height: 8, borderRadius: 2, background: tag.color || '#8c8c8c', display: 'inline-block' }} />
                                                        {tag.name}
                                                    </span>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* List View Table */}
                        {viewMode === 'list' && (
                            <Card className="mytasks-list-card" style={{ marginBottom: 16 }}>
                                <Table<Task>
                                    dataSource={filteredTasks}
                                    rowKey="id"
                                    size="middle"
                                    pagination={{ pageSize: 20, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'], showTotal: (total) => `${total} tasks` }}
                                    onRow={(record) => ({
                                        onClick: () => { setSelectedTaskId(record.id); setDetailModalVisible(true); },
                                        className: isOverdue(record) ? 'mytasks-row-overdue' : '',
                                        style: { cursor: 'pointer' },
                                    })}
                                    columns={[
                                        {
                                            title: 'Task',
                                            dataIndex: 'title',
                                            key: 'title',
                                            sorter: (a, b) => a.title.localeCompare(b.title),
                                            render: (title: string, record: Task) => {
                                                const sCfg = STATUS_CONFIG[record.status];
                                                return (
                                                    <Space>
                                                        <span className="mytasks-list-dot" style={{ background: sCfg?.dotColor || '#6B7280' }} />
                                                        <span className="mytasks-list-task-title">{title}</span>
                                                    </Space>
                                                );
                                            },
                                            ellipsis: true,
                                            width: '25%',
                                        },
                                        {
                                            title: 'Project',
                                            dataIndex: ['project', 'name'],
                                            key: 'project',
                                            sorter: (a, b) => (a.project?.name || '').localeCompare(b.project?.name || ''),
                                            render: (_: unknown, record: Task) => (
                                                <Tag
                                                    style={{
                                                        borderColor: record.project?.color || '#d9d9d9',
                                                        color: record.project?.color || '#666',
                                                        background: `${record.project?.color || '#666'}10`,
                                                    }}
                                                >
                                                    {record.project?.name || 'Unknown'}
                                                </Tag>
                                            ),
                                            ellipsis: true,
                                            width: '15%',
                                        },
                                        {
                                            title: 'Assignees',
                                            key: 'assignees',
                                            width: '10%',
                                            render: (_: unknown, record: Task) => {
                                                const assignees = record.taskAssignees || [];
                                                if (assignees.length === 0 && record.assignee) {
                                                    return (
                                                        <Tooltip title={record.assignee.name}>
                                                            <Avatar size="small" style={{ backgroundColor: '#3B82F6' }}>
                                                                {record.assignee.name?.charAt(0)?.toUpperCase()}
                                                            </Avatar>
                                                        </Tooltip>
                                                    );
                                                }
                                                return (
                                                    <Avatar.Group maxCount={3} size="small">
                                                        {assignees.map(a => (
                                                            <Tooltip key={a.id} title={a.user?.name}>
                                                                <Avatar size="small" style={{ backgroundColor: '#3B82F6' }}>
                                                                    {a.user?.name?.charAt(0)?.toUpperCase() || <UserOutlined />}
                                                                </Avatar>
                                                            </Tooltip>
                                                        ))}
                                                    </Avatar.Group>
                                                );
                                            },
                                        },
                                        {
                                            title: 'Start Date',
                                            dataIndex: 'startDate',
                                            key: 'startDate',
                                            sorter: (a, b) => (a.startDate || '').localeCompare(b.startDate || ''),
                                            render: (date: string) => date ? dayjs(date).format('DD MMM YY') : '-',
                                            width: '10%',
                                        },
                                        {
                                            title: 'Due Date',
                                            dataIndex: 'dueDate',
                                            key: 'dueDate',
                                            sorter: (a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''),
                                            render: (date: string, record: Task) => {
                                                if (!date) return '-';
                                                const overdue = isOverdue(record);
                                                return (
                                                    <span style={{ color: overdue ? '#EF4444' : undefined, fontWeight: overdue ? 600 : undefined }}>
                                                        {dayjs(date).format('DD MMM YY')}
                                                        {overdue && <WarningOutlined style={{ marginLeft: 4, color: '#EF4444' }} />}
                                                    </span>
                                                );
                                            },
                                            width: '10%',
                                        },
                                        {
                                            title: 'Priority',
                                            dataIndex: 'priority',
                                            key: 'priority',
                                            sorter: (a, b) => {
                                                const order = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
                                                return order.indexOf(a.priority) - order.indexOf(b.priority);
                                            },
                                            render: (priority: string) => {
                                                const pCfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;
                                                return (
                                                    <Tag style={{ color: pCfg.color, background: pCfg.bg, borderColor: pCfg.color, fontWeight: 600, fontSize: 11 }}>
                                                        {pCfg.label}
                                                    </Tag>
                                                );
                                            },
                                            width: '10%',
                                            filters: Object.entries(PRIORITY_CONFIG).map(([k, v]) => ({ text: v.label, value: k })),
                                            onFilter: (value, record) => record.priority === value,
                                        },
                                        {
                                            title: 'Status',
                                            dataIndex: 'status',
                                            key: 'status',
                                            sorter: (a, b) => {
                                                const order = STATUS_COLUMN_ORDER as readonly string[];
                                                return order.indexOf(a.status) - order.indexOf(b.status);
                                            },
                                            render: (status: string) => {
                                                const sCfg = STATUS_CONFIG[status];
                                                return <Tag color={sCfg?.tagColor || 'default'}>{sCfg?.label || status}</Tag>;
                                            },
                                            width: '10%',
                                            filters: Object.entries(STATUS_CONFIG).map(([k, v]) => ({ text: v.label, value: k })),
                                            onFilter: (value, record) => record.status === value,
                                        },
                                    ] as ColumnsType<Task>}
                                />
                            </Card>
                        )}

                        {/* Kanban Board */}
                        {viewMode === 'board' && (
                        <DndContext sensors={dndSensors} collisionDetection={kanbanCollision} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                            <div className="mytasks-board">
                                {STATUS_COLUMNS.map(col => {
                                    const columnTasks = getTasksByStatus(col.key);
                                    return (
                                        <div key={col.key} className="mytasks-column">
                                            {/* Column Header */}
                                            <div className="mytasks-column-header">
                                                <span className="mytasks-column-dot" style={{ background: col.dotColor }} />
                                                <span className="mytasks-column-title">{col.label}</span>
                                                <Badge
                                                    count={columnTasks.length}
                                                    showZero
                                                    style={{ backgroundColor: col.color }}
                                                />
                                            </div>

                                            {/* Droppable Area */}
                                            <MyTasksDroppableColumn id={col.key} className="mytasks-column-content">
                                                <SortableContext items={columnTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                                                {columnTasks.length === 0 && (
                                                    <div className="mytasks-empty">No tasks</div>
                                                )}
                                                {columnTasks.map((task) => {
                                                    const pConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
                                                    return (
                                                        <SortableMyTaskCard key={task.id} id={task.id} className={isOverdue(task) ? 'mytasks-card-overdue' : ''} onClick={() => { setSelectedTaskId(task.id); setDetailModalVisible(true); }}>
                                                            {/* Project Color Bar */}
                                                            <div className="mytasks-card-color" style={{ background: isOverdue(task) ? '#EF4444' : (task.project?.color || '#1890ff') }} />

                                                            <div className="mytasks-card-body">
                                                                {/* Project Name + Menu */}
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <div className="mytasks-card-project">
                                                                        <FolderOutlined />
                                                                        <span>{task.project?.name || 'Unknown'}</span>
                                                                    </div>
                                                                    <Dropdown menu={{ items: getTaskMenuItems(task) }} trigger={['click']}>
                                                                        <Button
                                                                            type="text"
                                                                            size="small"
                                                                            icon={<MoreOutlined />}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            style={{ flexShrink: 0, color: '#94A3B8' }}
                                                                        />
                                                                    </Dropdown>
                                                                </div>

                                                                {/* Task Title */}
                                                                <div className="mytasks-card-title">
                                                                    {task.title}
                                                                </div>

                                                                {/* Priority Badge */}
                                                                <span
                                                                    className="mytasks-priority-badge"
                                                                    style={{ color: pConfig.color, background: pConfig.bg, borderColor: pConfig.color }}
                                                                >
                                                                    {pConfig.label}
                                                                </span>

                                                                {/* Due Date */}
                                                                {task.dueDate && (
                                                                    <div className="mytasks-card-due">
                                                                        <CalendarOutlined />
                                                                        <span>{dayjs(task.dueDate).format('DD MMM YYYY')}</span>
                                                                        {task.status !== 'DONE' && task.status !== 'CANCELLED' && (() => {
                                                                            const daysLeft = dayjs(task.dueDate).diff(dayjs(), 'day');
                                                                            if (daysLeft < 0) return <Tag color="red" style={{ fontSize: 10, lineHeight: '16px', padding: '0 4px', margin: 0 }}>Delay {Math.abs(daysLeft)}d</Tag>;
                                                                            if (daysLeft <= 3) return <Tag color="orange" style={{ fontSize: 10, lineHeight: '16px', padding: '0 4px', margin: 0 }}>Due soon</Tag>;
                                                                            return null;
                                                                        })()}
                                                                    </div>
                                                                )}

                                                                {/* Progress */}
                                                                <div className="mytasks-card-progress">
                                                                    <div className="progress-bar-track">
                                                                        <div
                                                                            className="progress-bar-fill"
                                                                            style={{ width: `${task.progress}%`, background: task.project?.color || '#3B82F6' }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </SortableMyTaskCard>
                                                    );
                                                })}
                                                </SortableContext>
                                            </MyTasksDroppableColumn>
                                        </div>
                                    );
                                })}
                            </div>
                            <DragOverlay>
                                {activeDragTask && (
                                    <div className="mytasks-card mytasks-card-dragging">
                                        <div className="mytasks-card-color" style={{ background: activeDragTask.project?.color || '#1890ff' }} />
                                        <div className="mytasks-card-body">
                                            <div className="mytasks-card-title">{activeDragTask.title}</div>
                                        </div>
                                    </div>
                                )}
                            </DragOverlay>
                        </DndContext>
                        )}
                    </Spin>
                </Content>
            </Layout>

            {/* New Task Modal */}
            <Modal
                title={<Space><PlusOutlined /> Create New Task</Space>}
                open={isModalVisible}
                onOk={handleCreateTask}
                onCancel={() => setIsModalVisible(false)}
                okText="Create"
                cancelText="Cancel"
                width={520}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        name="projectId"
                        label="Project"
                        rules={[{ required: true, message: 'Please select a project' }]}
                    >
                        <Select placeholder="Select project" showSearch optionFilterProp="children">
                            {projects.map((p: Project) => (
                                <Select.Option key={p.id} value={p.id}>
                                    {p.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="title"
                        label="Task Title"
                        rules={[{ required: true, message: 'Please enter task title' }]}
                    >
                        <Input placeholder="Enter task title" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} placeholder="Description (optional)" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="priority" label="Priority" initialValue="MEDIUM">
                                <Select>
                                    <Select.Option value="URGENT">Urgent</Select.Option>
                                    <Select.Option value="HIGH">High</Select.Option>
                                    <Select.Option value="MEDIUM">Medium</Select.Option>
                                    <Select.Option value="LOW">Low</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="status" label="Status" initialValue="TODO">
                                <Select>
                                    <Select.Option value="TODO">To Do</Select.Option>
                                    <Select.Option value="IN_PROGRESS">In Progress</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="dueDate" label="Due Date">
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Status Change Note Modal */}
            <Modal
                title="เหตุผลที่เปลี่ยนสถานะ"
                open={statusChangeModal.visible}
                onOk={handleStatusChangeConfirm}
                onCancel={handleStatusChangeCancel}
                okText="Confirm"
                cancelText="Cancel"
                confirmLoading={statusChangeLoading}
                okButtonProps={{ disabled: !statusChangeNote.trim() }}
                maskClosable={false}
            >
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Tag color={STATUS_CONFIG[statusChangeModal.fromStatus]?.color}>
                            {STATUS_CONFIG[statusChangeModal.fromStatus]?.label || statusChangeModal.fromStatus}
                        </Tag>
                        <span style={{ fontSize: 16 }}>→</span>
                        <Tag color={STATUS_CONFIG[statusChangeModal.toStatus]?.color}>
                            {STATUS_CONFIG[statusChangeModal.toStatus]?.label || statusChangeModal.toStatus}
                        </Tag>
                    </Space>
                </div>
                <Input.TextArea
                    rows={3}
                    placeholder="กรุณาระบุเหตุผลที่เปลี่ยนสถานะ..."
                    value={statusChangeNote}
                    onChange={(e) => setStatusChangeNote(e.target.value)}
                    autoFocus
                />
            </Modal>

            <TaskDetailModal
                visible={detailModalVisible}
                taskId={selectedTaskId}
                onClose={() => { setDetailModalVisible(false); setSelectedTaskId(null); }}
                onUpdate={loadMyTasks}
            />
        </Layout>
    );
};
