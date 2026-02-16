import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, type Project } from '../services/projectService';
import { taskService, type Task } from '../services/taskService';
import type { ProjectMember } from '../types';
import { Sidebar } from '../components/Sidebar';
import {
    Layout,
    Card,
    Row,
    Col,
    Button,
    Typography,
    Space,
    Tag,
    Avatar,
    Input,
    Select,
    Modal,
    Form,
    message,
    Spin,
    Tooltip,
    Statistic,
    Breadcrumb,
    Tabs,
    Empty,
    Badge,
    Dropdown,
    DatePicker,
    Progress,
} from 'antd';
import type { MenuProps } from 'antd';
import {
    ArrowLeftOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    MoreOutlined,
    FolderOutlined,
    ExclamationCircleOutlined,
    SyncOutlined,
    UserOutlined,
    PauseCircleOutlined,
    StopOutlined,
    DownloadOutlined,
    FilePdfOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { exportTasks } from '../utils/exportExcel';
import { exportTasksPDF } from '../utils/exportPDF';
import { STATUS_CONFIG, PRIORITY_CONFIG, PROJECT_STATUS_GRADIENT } from '../constants';
import { STATUS_ICONS } from '../constants/statusIcons';
import './ProjectDetailPage.css';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// PRIORITY_BADGE uses same values as centralized PRIORITY_CONFIG (color + bg + label)
const PRIORITY_BADGE = PRIORITY_CONFIG;

import { TaskDetailModal } from './TaskDetailModal';
import { GanttChart } from '../components/GanttChart';

export const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [form] = Form.useForm();

    // Task Detail Modal State
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    useEffect(() => {
        if (projectId) {
            loadProjectData();
        }
    }, [projectId]);

    const loadProjectData = async () => {
        if (!projectId) return;

        try {
            setLoading(true);

            const [projectData, statsData, tasksData] = await Promise.all([
                projectService.getProject(projectId),
                projectService.getProjectStats(projectId),
                taskService.getTasks(projectId, { pageSize: 100 }),
            ]);

            setProject(projectData);
            setStats(statsData);
            setTasks(tasksData.tasks || []);
        } catch (error) {
            message.error('Failed to load project data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        form.resetFields();
        form.setFieldsValue({ priority: 'MEDIUM', status: 'TODO' });
        setTaskModalVisible(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        const assigneeIds = task.taskAssignees?.length
            ? task.taskAssignees.map(ta => ta.user.id)
            : (task.assigneeId ? [task.assigneeId] : []);
        form.setFieldsValue({
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            assigneeIds,
            startDate: task.startDate ? dayjs(task.startDate) : null,
            dueDate: task.dueDate ? dayjs(task.dueDate) : null,
        });
        setTaskModalVisible(true);
    };

    const handleDeleteTask = async (taskId: string) => {
        Modal.confirm({
            title: 'Delete Task',
            content: 'Are you sure you want to delete this task?',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await taskService.deleteTask(taskId);
                    message.success('Task deleted successfully');
                    await loadProjectData();
                } catch (error) {
                    message.error('Failed to delete task');
                }
            },
        });
    };

    const handleTaskSubmit = async () => {
        if (!projectId) return;

        try {
            setSubmitting(true);
            const values = await form.validateFields();

            const taskData = {
                ...values,
                startDate: values.startDate ? values.startDate.toISOString() : null,
                dueDate: values.dueDate ? values.dueDate.toISOString() : null,
            };

            if (editingTask) {
                await taskService.updateTask(editingTask.id, taskData);
                message.success('Task updated successfully');
            } else {
                await taskService.createTask(projectId, taskData);
                message.success('Task created successfully');
            }

            setTaskModalVisible(false);
            form.resetFields();
            await loadProjectData();
        } catch (error) {
            message.error('Failed to save task');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            await taskService.updateTaskStatus(taskId, { status: newStatus });
            message.success('Status updated');
            await loadProjectData();
        } catch (error) {
            message.error('Failed to update status');
        }
    };

    const handleTaskDragEnd = async (result: DropResult) => {
        const { draggableId, destination } = result;
        if (!destination) return;
        const newStatus = destination.droppableId;
        const task = tasks.find(t => t.id === draggableId);
        if (!task || task.status === newStatus) return;

        // Optimistic update
        setTasks(prev => prev.map(t => t.id === draggableId ? { ...t, status: newStatus as any } : t));
        try {
            await taskService.updateTaskStatus(draggableId, { status: newStatus });
            message.success(`Moved "${task.title}" to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
        } catch {
            setTasks(prev => prev.map(t => t.id === draggableId ? { ...t, status: task.status } : t));
            message.error('Failed to update task status');
        }
    };

    const handleTaskClick = (taskId: string) => {
        setSelectedTaskId(taskId);
        setDetailModalVisible(true);
    };

    const handleDetailClose = () => {
        setDetailModalVisible(false);
        setSelectedTaskId(null);
    };

    const handleDetailUpdate = async () => {
        await loadProjectData();
    };

    const getTaskMenuItems = (task: Task): MenuProps['items'] => [
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit Task',
            onClick: () => handleEditTask(task),
        },
        { type: 'divider' },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete Task',
            danger: true,
            onClick: () => handleDeleteTask(task.id),
        },
    ];

    // Filter tasks
    const filteredTasks = statusFilter
        ? tasks.filter(t => t.status === statusFilter)
        : tasks;

    // Group tasks by status for board view
    const tasksByStatus = {
        TODO: tasks.filter(t => t.status === 'TODO'),
        IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
        DONE: tasks.filter(t => t.status === 'DONE'),
        HOLD: tasks.filter(t => t.status === 'HOLD'),
        CANCELLED: tasks.filter(t => t.status === 'CANCELLED'),
    };

    if (loading) {
        return (
            <Layout className="project-detail-layout">
                <Sidebar />
                <Layout className="project-detail-main">
                    <div className="loading-container">
                        <Spin size="large" />
                    </div>
                </Layout>
            </Layout>
        );
    }

    if (!project) {
        return (
            <Layout className="project-detail-layout">
                <Sidebar />
                <Layout className="project-detail-main">
                    <Empty description="Project not found" />
                </Layout>
            </Layout>
        );
    }

    return (
        <Layout className="project-detail-layout">
            <Sidebar />

            <Layout className="project-detail-main">
                {/* Header */}
                <div className="project-detail-header" style={{ borderTop: `4px solid ${(PROJECT_STATUS_GRADIENT[project.status] || PROJECT_STATUS_GRADIENT.ACTIVE).accentColor}` }}>
                    <div className="header-top">
                        <Breadcrumb
                            items={[
                                { title: <a onClick={() => navigate('/projects')}><FolderOutlined /> Projects</a> },
                                { title: project.name },
                            ]}
                        />
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/projects')}
                        >
                            Back to Projects
                        </Button>
                    </div>

                    <div className="header-content">
                        <div className="project-title-section">
                            <Title level={2} className="project-title">
                                <span className="color-dot" style={{ backgroundColor: project.color }} />
                                {project.name}
                            </Title>
                            {project.description && (
                                <Paragraph type="secondary" className="project-desc">
                                    {project.description}
                                </Paragraph>
                            )}
                            {project.members && project.members.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' }}>
                                    <span style={{ fontSize: 13, color: '#8c8c8c', marginRight: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <TeamOutlined /> Members:
                                    </span>
                                    {project.members.map((m: ProjectMember) => (
                                        <span key={m.id} style={{
                                            display: 'inline-block',
                                            padding: '2px 10px',
                                            fontSize: 12,
                                            color: '#595959',
                                            background: '#f0f0f0',
                                            borderRadius: 6,
                                        }}>
                                            {m.user?.name || 'Unknown'}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Space>
                            <Button
                                size="large"
                                icon={<DownloadOutlined />}
                                onClick={() => exportTasks(filteredTasks, project.name)}
                                style={{ borderRadius: 12 }}
                            >
                                Export Excel
                            </Button>
                            <Button
                                size="large"
                                icon={<FilePdfOutlined />}
                                onClick={() => exportTasksPDF(filteredTasks, project.name)}
                                style={{ borderRadius: 12 }}
                            >
                                Save PDF
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                onClick={handleCreateTask}
                                className="create-task-btn"
                            >
                                New Task
                            </Button>
                        </Space>
                    </div>

                    {/* Timeline & Countdown Section */}
                    {(project.startDate || tasks.length > 0 || project.endDate) && (() => {
                        const sg = PROJECT_STATUS_GRADIENT[project.status] || PROJECT_STATUS_GRADIENT.ACTIVE;
                        return (
                        <div style={{ marginTop: 24, marginBottom: 8 }}>
                            <Row gutter={[16, 16]}>
                                {/* Start Date */}
                                {project.startDate && (
                                    <Col xs={24} sm={8}>
                                        <Card variant="borderless" className="timeline-card" style={{ background: sg.lightBg, border: `1px solid ${sg.lightBorder}` }}>
                                            <Statistic
                                                title={<span style={{ color: sg.textColor, fontWeight: 600 }}><CalendarOutlined /> Project Start</span>}
                                                value={dayjs(project.startDate).format('DD MMM YYYY')}
                                                valueStyle={{ color: sg.textColor, fontSize: '1.2rem', fontWeight: 'bold' }}
                                            />
                                        </Card>
                                    </Col>
                                )}

                                {/* Due Date */}
                                <Col xs={24} sm={8}>
                                    <Card variant="borderless" className="timeline-card" style={{ background: sg.lightBg, border: `1px solid ${sg.lightBorder}` }}>
                                        <Statistic
                                            title={<span style={{ color: sg.textColor, fontWeight: 600 }}><ClockCircleOutlined /> Target Finish</span>}
                                            value={
                                                project.endDate
                                                    ? dayjs(project.endDate).format('DD MMM YYYY')
                                                    : (tasks.some(t => t.dueDate)
                                                        ? dayjs(Math.max(...tasks.filter(t => t.dueDate).map(t => new Date(t.dueDate!).getTime()))).format('DD MMM YYYY')
                                                        : 'No finish date set')
                                            }
                                            valueStyle={{ color: sg.textColor, fontSize: '1.2rem', fontWeight: 'bold' }}
                                        />
                                    </Card>
                                </Col>

                                {/* Days Remaining */}
                                <Col xs={24} sm={8}>
                                    <Card variant="borderless" className="timeline-card" style={{ background: sg.lightBg, border: `1px solid ${sg.lightBorder}` }}>
                                        <Statistic
                                            title={<span style={{ color: sg.textColor, fontWeight: 600 }}><SyncOutlined spin /> Time Remaining</span>}
                                            value={
                                                (() => {
                                                    const targetDate = project.endDate
                                                        ? new Date(project.endDate).getTime()
                                                        : (tasks.some(t => t.dueDate) ? Math.max(...tasks.filter(t => t.dueDate).map(t => new Date(t.dueDate!).getTime())) : null);

                                                    if (!targetDate) return '-';
                                                    return Math.ceil((targetDate - Date.now()) / (1000 * 60 * 60 * 24));
                                                })()
                                            }
                                            suffix={<span style={{ fontSize: '1rem', color: sg.textColor }}>days left</span>}
                                            valueStyle={{ color: sg.textColor, fontSize: '1.5rem', fontWeight: 'bold' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        );
                    })()}

                    {/* Stats */}
                    <Row gutter={16} className="project-stats">
                        <Col xs={6}>
                            <Card className="stat-card stat-total">
                                <Statistic
                                    title="Total Tasks"
                                    value={stats?.total_tasks || tasks.length}
                                    prefix={<FolderOutlined style={{ color: '#64748B' }} />}
                                />
                            </Card>
                        </Col>
                        <Col xs={6}>
                            <Card className="stat-card stat-completed">
                                <Statistic
                                    title="Completed"
                                    value={stats?.completed_tasks || tasksByStatus.DONE.length}
                                    valueStyle={{ color: '#065F46' }}
                                    prefix={<CheckCircleOutlined style={{ color: '#10B981' }} />}
                                />
                            </Card>
                        </Col>
                        <Col xs={6}>
                            <Card className="stat-card stat-inprogress">
                                <Statistic
                                    title="In Progress"
                                    value={stats?.in_progress_tasks || tasksByStatus.IN_PROGRESS.length}
                                    valueStyle={{ color: '#1E40AF' }}
                                    prefix={<SyncOutlined style={{ color: '#3B82F6' }} />}
                                />
                            </Card>
                        </Col>
                        <Col xs={6}>
                            <Card className="stat-card stat-progress">
                                <Statistic
                                    title="Progress"
                                    value={stats?.progress || 0}
                                    suffix="%"
                                    valueStyle={{ color: '#92400E' }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Content */}
                <Content className="project-detail-content">
                    <Tabs defaultActiveKey="board" size="large">
                        {/* Board View */}
                        <TabPane tab="Board View" key="board">
                            <DragDropContext onDragEnd={handleTaskDragEnd}>
                                <div className="task-board">
                                    {Object.entries(tasksByStatus).map(([status, statusTasks]) => {
                                        const config = STATUS_CONFIG[status];
                                        return (
                                            <div key={status} className="board-column">
                                                <div className="column-header">
                                                    <span className="column-dot" style={{ background: config.dotColor }} />
                                                    <span className="column-title">{config.label}</span>
                                                    <Badge count={statusTasks.length} showZero style={{ backgroundColor: config.badgeColor }} />
                                                </div>
                                                <Droppable droppableId={status}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className={`column-content ${snapshot.isDraggingOver ? 'column-content-over' : ''}`}
                                                            ref={provided.innerRef}
                                                            {...provided.droppableProps}
                                                        >
                                                            {statusTasks.length === 0 && !snapshot.isDraggingOver && (
                                                                <div className="column-empty">No tasks</div>
                                                            )}
                                                            {statusTasks.map((task, index) => {
                                                                const pBadge = PRIORITY_BADGE[task.priority] || PRIORITY_BADGE.MEDIUM;
                                                                return (
                                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                                        {(dragProvided, dragSnapshot) => (
                                                                            <div
                                                                                ref={dragProvided.innerRef}
                                                                                {...dragProvided.draggableProps}
                                                                                {...dragProvided.dragHandleProps}
                                                                                className={`task-card ${dragSnapshot.isDragging ? 'task-card-dragging' : ''}`}
                                                                                onClick={() => !dragSnapshot.isDragging && handleTaskClick(task.id)}
                                                                            >
                                                                                {/* Color bar */}
                                                                                <div className="task-card-color" style={{ background: project?.color || '#1890ff' }} />
                                                                                <div className="task-card-body">
                                                                                    {/* Title */}
                                                                                    <div className="task-card-title">{task.title}</div>

                                                                                    {/* Priority Badge */}
                                                                                    <span
                                                                                        className="task-priority-badge"
                                                                                        style={{ color: pBadge.color, background: pBadge.bg, borderColor: pBadge.color }}
                                                                                    >
                                                                                        {pBadge.label}
                                                                                    </span>

                                                                                    {/* Due Date */}
                                                                                    {task.dueDate && (
                                                                                        <div className="task-card-due">
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

                                                                                    {/* Footer: Assignees + Menu */}
                                                                                    <div className="task-card-footer">
                                                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, flex: 1 }}>
                                                                                            {task.taskAssignees && task.taskAssignees.length > 0 ? (
                                                                                                task.taskAssignees.map(ta => (
                                                                                                    <Tooltip key={ta.id} title={ta.user.name}>
                                                                                                        <Tag style={{ fontSize: 11, margin: 0, padding: '0 4px' }}>
                                                                                                            <UserOutlined /> {ta.user.name}
                                                                                                        </Tag>
                                                                                                    </Tooltip>
                                                                                                ))
                                                                                            ) : task.assignee ? (
                                                                                                <Tooltip title={task.assignee.name}>
                                                                                                    <span className="task-card-assignee">
                                                                                                        <UserOutlined /> {task.assignee.name}
                                                                                                    </span>
                                                                                                </Tooltip>
                                                                                            ) : null}
                                                                                        </div>
                                                                                        <Dropdown
                                                                                            menu={{ items: getTaskMenuItems(task) }}
                                                                                            trigger={['click']}
                                                                                        >
                                                                                            <Button
                                                                                                type="text"
                                                                                                size="small"
                                                                                                icon={<MoreOutlined />}
                                                                                                onClick={(e) => e.stopPropagation()}
                                                                                            />
                                                                                        </Dropdown>
                                                                                    </div>

                                                                                    {/* Progress */}
                                                                                    <Progress
                                                                                        percent={task.progress}
                                                                                        size="small"
                                                                                        showInfo={false}
                                                                                        strokeColor={project?.color || '#1890ff'}
                                                                                        style={{ marginBottom: 0 }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                );
                                                            })}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </div>
                                        );
                                    })}
                                </div>
                            </DragDropContext>
                        </TabPane>

                        {/* List View */}
                        <TabPane tab="List View" key="list">
                            <div className="task-list-header">
                                <Select
                                    placeholder="Filter by status"
                                    allowClear
                                    style={{ width: 200 }}
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                >
                                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                        <Option key={key} value={key}>{config.label}</Option>
                                    ))}
                                </Select>
                            </div>

                            <div className="task-list">
                                {filteredTasks.length === 0 ? (
                                    <Empty description="No tasks found" />
                                ) : (
                                    filteredTasks.map(task => (
                                        <Card
                                            key={task.id}
                                            className="task-list-item"
                                            hoverable
                                            onClick={() => handleTaskClick(task.id)}
                                        >
                                            <div className="task-list-content">
                                                <div className="task-main-info">
                                                    <Tag color={PRIORITY_CONFIG[task.priority]?.color}>
                                                        {PRIORITY_CONFIG[task.priority]?.label}
                                                    </Tag>
                                                    <Title level={5} style={{ margin: 0 }}>{task.title}</Title>
                                                </div>
                                                <div className="task-meta">
                                                    <Select
                                                        value={task.status}
                                                        onChange={(value) => handleStatusChange(task.id, value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{ width: 140 }}
                                                        size="small"
                                                    >
                                                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                                            <Option key={key} value={key}>
                                                                <Tag color={config.color}>{config.label}</Tag>
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                    {task.dueDate && (
                                                        <Space size={4}>
                                                            <Text type="secondary">
                                                                <CalendarOutlined /> {dayjs(task.dueDate).format('MMM D, YYYY')}
                                                            </Text>
                                                            {task.status !== 'DONE' && task.status !== 'CANCELLED' && (() => {
                                                                const daysLeft = dayjs(task.dueDate).diff(dayjs(), 'day');
                                                                if (daysLeft < 0) return <Tag color="red">Delay {Math.abs(daysLeft)}d</Tag>;
                                                                if (daysLeft <= 3) return <Tag color="orange">Due soon</Tag>;
                                                                return <Tag color="green">Ahead</Tag>;
                                                            })()}
                                                        </Space>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </TabPane>

                        {/* Gantt View */}
                        <TabPane tab="Gantt View" key="gantt">
                            <div style={{ padding: '16px 0' }}>
                                <GanttChart
                                    tasks={tasks}
                                    projectStartDate={project?.startDate}
                                    projectEndDate={project?.endDate}
                                />
                            </div>
                        </TabPane>
                    </Tabs>
                </Content>
            </Layout>

            {/* Task Modal */}
            <Modal
                title={editingTask ? 'Edit Task' : 'Create New Task'}
                open={taskModalVisible}
                onOk={handleTaskSubmit}
                onCancel={() => setTaskModalVisible(false)}
                width={600}
                okText={editingTask ? 'Save Changes' : 'Create Task'}
                confirmLoading={submitting}
            >
                <Form form={form} layout="vertical" size="large">
                    <Form.Item
                        name="title"
                        label="Task Title"
                        rules={[{ required: true, message: 'Please enter task title' }]}
                    >
                        <Input placeholder="Enter task title" />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} placeholder="Enter description (optional)" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="priority"
                                label="Priority"
                                rules={[{ required: true }]}
                            >
                                <Select placeholder="Select priority">
                                    {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                                        <Option key={key} value={key}>
                                            <Tag color={config.color}>{config.label}</Tag>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true }]}
                            >
                                <Select placeholder="Select status">
                                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                        <Option key={key} value={key}>
                                            <Tag color={config.color}>{config.label}</Tag>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="assigneeIds" label="Assignees">
                        <Select mode="multiple" placeholder="Select assignees" allowClear showSearch optionFilterProp="children">
                            {project?.members?.map(member => (
                                <Option key={member.user.id} value={member.user.id}>
                                    <Space>
                                        <Avatar size="small" icon={<UserOutlined />}>{member.user.name?.[0]}</Avatar>
                                        {member.user.name}
                                    </Space>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="startDate" label="Start Date">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="dueDate" label="Finish Date">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* Task Detail Modal */}
            <TaskDetailModal
                visible={detailModalVisible}
                taskId={selectedTaskId}
                onClose={handleDetailClose}
                onUpdate={handleDetailUpdate}
            />
        </Layout>
    );
};
