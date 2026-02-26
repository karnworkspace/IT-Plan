import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService, type Task } from '../services/taskService';
import api from '../services/api';
import { Sidebar } from '../components/Sidebar';
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
    Dropdown,
    Modal,
    message,
    Spin,
} from 'antd';
import type { MenuProps } from 'antd';
import {
    CalendarOutlined,
    FolderOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    PauseCircleOutlined,
    StopOutlined,
    TagOutlined,
    ArrowLeftOutlined,
    MoreOutlined,
    EyeOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { useCountUp } from '../hooks/useCountUp';
import { DndContext, DragOverlay, useDroppable, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core';
import { kanbanCollision } from '../utils/kanbanCollision';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { STATUS_CONFIG, STATUS_COLUMN_ORDER, PRIORITY_CONFIG } from '../constants';
import './MyTasksPage.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const STATUS_COLUMNS = STATUS_COLUMN_ORDER.map(key => ({
    key,
    label: STATUS_CONFIG[key].label,
    color: STATUS_CONFIG[key].dotColor,
    dotColor: STATUS_CONFIG[key].dotColor,
}));

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

function DroppableColumn({ id, className, children }: { id: string; className: string; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={`${className} ${isOver ? 'mytasks-column-over' : ''}`}>
            {children}
        </div>
    );
}

function SortableTaskCard({ id, children, onClick }: { id: string; children: React.ReactNode; onClick: () => void }) {
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
            className={`mytasks-card ${isDragging ? 'mytasks-card-dragging' : ''}`}
            onClick={() => !isDragging && onClick()}
        >
            {children}
        </div>
    );
}

export const TagTasksPage: React.FC = () => {
    const { tagId } = useParams<{ tagId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tagInfo, setTagInfo] = useState<{ id: string; name: string; color: string } | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    // DnD State
    const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);
    const dndSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

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
                            loadTasks();
                        } catch {
                            message.error('Failed to delete task');
                        }
                    },
                });
            },
        },
    ];

    useEffect(() => {
        if (tagId) loadTasks();
    }, [tagId]);

    const loadTasks = async () => {
        if (!tagId) return;
        try {
            setLoading(true);
            const response = await taskService.getTasksByTag(tagId, { pageSize: 200 });
            const taskList = response.tasks || [];
            setTasks(taskList);

            // Extract tag info from first task that has it
            if (!tagInfo && taskList.length > 0) {
                for (const t of taskList) {
                    const tt = t.taskTags?.find((x: { tag: { id: string } }) => x.tag.id === tagId);
                    if (tt) {
                        setTagInfo(tt.tag);
                        break;
                    }
                }
            }

            // If no tasks, fetch tag info directly
            if (taskList.length === 0 && !tagInfo) {
                try {
                    const res = await api.get(`/tags/${tagId}`);
                    const tag = res.data?.data?.tag;
                    if (tag) setTagInfo({ id: tag.id, name: tag.name, color: tag.color });
                } catch { /* ignore */ }
            }
        } catch (error) {
            message.error('Failed to load tasks');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        if (priorityFilter.length > 0 && !priorityFilter.includes(task.priority)) return false;
        return true;
    });

    // Stats
    const todoCount = filteredTasks.filter(t => t.status === 'TODO').length;
    const inProgressCount = filteredTasks.filter(t => t.status === 'IN_PROGRESS').length;
    const doneCount = filteredTasks.filter(t => t.status === 'DONE').length;
    const holdCount = filteredTasks.filter(t => t.status === 'HOLD').length;
    const cancelledCount = filteredTasks.filter(t => t.status === 'CANCELLED').length;

    const getTasksByStatus = (status: string) => filteredTasks.filter(t => t.status === status);

    // DnD handlers
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

        if (task.status === newStatus) {
            if (overTask && active.id !== over.id) {
                setTasks(prev => {
                    const updated = [...prev];
                    const oldIdx = updated.findIndex(t => t.id === active.id);
                    const newIdx = updated.findIndex(t => t.id === over.id);
                    const [moved] = updated.splice(oldIdx, 1);
                    updated.splice(newIdx, 0, moved);
                    const columnIds = updated.filter(t => t.status === newStatus).map(t => t.id);
                    taskService.reorderTasks(columnIds).catch(() => {});
                    return updated;
                });
            }
            return;
        }

        // Cross-column — optimistic update
        const oldTasks = [...tasks];
        setTasks(prev => prev.map(t =>
            t.id === taskId
                ? { ...t, status: newStatus as Task['status'], progress: newStatus === 'DONE' ? 100 : t.progress }
                : t
        ));

        try {
            await taskService.updateTaskStatus(taskId, {
                status: newStatus,
                progress: newStatus === 'DONE' ? 100 : task.progress,
            });
            message.success(`Task moved to ${newStatus.replace(/_/g, ' ')}`);
        } catch (error) {
            setTasks(oldTasks);
            message.error('Failed to update task status');
            console.error(error);
        }
    };

    return (
        <Layout className="my-tasks-layout">
            <Sidebar />

            <Layout>
                <Header className="my-tasks-header">
                    <div className="my-tasks-header-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Button
                                type="text"
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate(-1)}
                                style={{ fontSize: 18 }}
                            />
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <TagOutlined style={{ fontSize: 28, color: tagInfo?.color || '#1890ff' }} />
                                    <Title level={2} style={{ margin: 0, fontSize: 48 }}>
                                        {tagInfo ? (
                                            <Tag color={tagInfo.color} style={{ fontSize: 28, padding: '4px 16px', lineHeight: '36px' }}>
                                                {tagInfo.name}
                                            </Tag>
                                        ) : 'Tag Tasks'}
                                    </Title>
                                </div>
                                <Text type="secondary" style={{ fontSize: 30 }}>
                                    {filteredTasks.length} tasks across all projects
                                </Text>
                            </div>
                        </div>
                    </div>
                </Header>

                <Content className="my-tasks-content">
                    <Spin spinning={loading}>
                        {/* Stats Cards */}
                        <Row gutter={16} className="stats-row">
                            <Col xs={12} sm={4}>
                                <StatCardItem title="Total" value={filteredTasks.length} icon={<FolderOutlined />} iconClass="icon-slate" gradientFrom="#F1F5F9" />
                            </Col>
                            <Col xs={12} sm={4}>
                                <StatCardItem title="To Do" value={todoCount} icon={<CheckCircleOutlined />} iconClass="icon-purple" gradientFrom="#EDE9FE" />
                            </Col>
                            <Col xs={12} sm={4}>
                                <StatCardItem title="In Progress" value={inProgressCount} icon={<SyncOutlined />} iconClass="icon-blue" gradientFrom="#DBEAFE" />
                            </Col>
                            <Col xs={12} sm={4}>
                                <StatCardItem title="Done" value={doneCount} icon={<CheckCircleOutlined />} iconClass="icon-emerald" gradientFrom="#D1FAE5" />
                            </Col>
                            <Col xs={12} sm={4}>
                                <StatCardItem title="Hold" value={holdCount} icon={<PauseCircleOutlined />} iconClass="icon-amber" gradientFrom="#FEF3C7" />
                            </Col>
                            <Col xs={12} sm={4}>
                                <StatCardItem title="Cancelled" value={cancelledCount} icon={<StopOutlined />} iconClass="icon-slate" gradientFrom="#F1F5F9" />
                            </Col>
                        </Row>

                        {/* Priority Filter */}
                        <Card className="filters-card" style={{ marginBottom: 16 }}>
                            <Space size="large" wrap>
                                <div>
                                    <Text strong style={{ marginBottom: 8, display: 'block' }}>Priority</Text>
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
                            </Space>
                        </Card>

                        {/* Kanban Board */}
                        <DndContext sensors={dndSensors} collisionDetection={kanbanCollision} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                            <div className="mytasks-board">
                                {STATUS_COLUMNS.map(col => {
                                    const columnTasks = getTasksByStatus(col.key);
                                    return (
                                        <div key={col.key} className="mytasks-column">
                                            <div className="mytasks-column-header">
                                                <span className="mytasks-column-dot" style={{ background: col.dotColor }} />
                                                <span className="mytasks-column-title">{col.label}</span>
                                                <Badge count={columnTasks.length} showZero style={{ backgroundColor: col.color }} />
                                            </div>

                                            <DroppableColumn id={col.key} className="mytasks-column-content">
                                                <SortableContext items={columnTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                                                {columnTasks.length === 0 && (
                                                    <div className="mytasks-empty">No tasks</div>
                                                )}
                                                {columnTasks.map((task) => {
                                                    const pConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
                                                    return (
                                                        <SortableTaskCard key={task.id} id={task.id} onClick={() => { setSelectedTaskId(task.id); setDetailModalVisible(true); }}>
                                                            <div className="mytasks-card-color" style={{ background: task.project?.color || '#1890ff' }} />
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
                                                                <div className="mytasks-card-title">{task.title}</div>

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
                                                        </SortableTaskCard>
                                                    );
                                                })}
                                                </SortableContext>
                                            </DroppableColumn>
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
                    </Spin>
                </Content>
            </Layout>

            <TaskDetailModal
                visible={detailModalVisible}
                taskId={selectedTaskId}
                onClose={() => { setDetailModalVisible(false); setSelectedTaskId(null); }}
                onUpdate={loadTasks}
            />
        </Layout>
    );
};
