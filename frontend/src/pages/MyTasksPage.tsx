import React, { useState, useEffect } from 'react';
import { taskService, type Task, type CreateTaskInput } from '../services/taskService';
import { projectService, type Project } from '../services/projectService';
import { Sidebar } from '../components/Sidebar';
import dayjs from 'dayjs';
import {
    Layout,
    Card,
    Row,
    Col,
    Typography,
    Space,
    Tag,
    Progress,
    Checkbox,
    Badge,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Statistic,
    message,
    Spin,
} from 'antd';
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
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { exportTasks } from '../utils/exportExcel';
import { exportTasksPDF } from '../utils/exportPDF';
import { STATUS_CONFIG, STATUS_COLUMN_ORDER, PRIORITY_CONFIG } from '../constants';
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

export const MyTasksPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        loadMyTasks();
    }, []);

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

    const handlePriorityFilter = (checkedValues: string[]) => {
        setPriorityFilter(checkedValues);
    };

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        if (priorityFilter.length > 0 && !priorityFilter.includes(task.priority)) {
            return false;
        }
        return true;
    });

    // Stats counts
    const todoCount = filteredTasks.filter(t => t.status === 'TODO').length;
    const inProgressCount = filteredTasks.filter(t => t.status === 'IN_PROGRESS').length;
    const doneCount = filteredTasks.filter(t => t.status === 'DONE').length;
    const holdCount = filteredTasks.filter(t => t.status === 'HOLD').length;
    const cancelledCount = filteredTasks.filter(t => t.status === 'CANCELLED').length;

    // Sort within each column by priority (URGENT first)
    const priorityOrder = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
    const sortByPriority = (a: Task, b: Task) => {
        const aIdx = priorityOrder.indexOf(a.priority);
        const bIdx = priorityOrder.indexOf(b.priority);
        if (aIdx !== bIdx) return aIdx - bIdx;
        if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
    };

    // Group tasks by status
    const getTasksByStatus = (status: string) =>
        filteredTasks.filter(t => t.status === status).sort(sortByPriority);

    // Drag and drop handler
    const handleDragEnd = async (result: DropResult) => {
        const { draggableId, destination } = result;
        if (!destination) return;

        const newStatus = destination.droppableId;
        const task = tasks.find(t => t.id === draggableId);
        if (!task || task.status === newStatus) return;

        // Optimistic update
        const oldTasks = [...tasks];
        setTasks(prev => prev.map(t =>
            t.id === draggableId
                ? { ...t, status: newStatus as Task['status'], progress: newStatus === 'DONE' ? 100 : t.progress }
                : t
        ));

        try {
            await taskService.updateTaskStatus(draggableId, {
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
                            <Title level={3} style={{ margin: 0 }}>My Tasks</Title>
                            <Text type="secondary">Tasks assigned to or created by you</Text>
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
                            <Col xs={12} sm={4}>
                                <Card className="stat-card stat-total">
                                    <Statistic
                                        title="Total"
                                        value={filteredTasks.length}
                                        valueStyle={{ color: '#1a1a2e' }}
                                        prefix={<FolderOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={12} sm={4}>
                                <Card className="stat-card stat-todo">
                                    <Statistic
                                        title="To Do"
                                        value={todoCount}
                                        valueStyle={{ color: '#1a1a2e' }}
                                        prefix={<CheckCircleOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={12} sm={4}>
                                <Card className="stat-card stat-inprogress">
                                    <Statistic
                                        title="In Progress"
                                        value={inProgressCount}
                                        valueStyle={{ color: '#1890ff' }}
                                        prefix={<SyncOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={12} sm={4}>
                                <Card className="stat-card stat-done">
                                    <Statistic
                                        title="Done"
                                        value={doneCount}
                                        valueStyle={{ color: '#1a1a2e' }}
                                        prefix={<CheckCircleOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={12} sm={4}>
                                <Card className="stat-card stat-hold">
                                    <Statistic
                                        title="Hold"
                                        value={holdCount}
                                        valueStyle={{ color: '#1a1a2e' }}
                                        prefix={<PauseCircleOutlined />}
                                    />
                                </Card>
                            </Col>
                            <Col xs={12} sm={4}>
                                <Card className="stat-card stat-cancelled">
                                    <Statistic
                                        title="Cancelled"
                                        value={cancelledCount}
                                        valueStyle={{ color: '#1a1a2e' }}
                                        prefix={<StopOutlined />}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        {/* Priority Filter */}
                        <Card className="filters-card" style={{ marginBottom: 16 }}>
                            <Space size="large" wrap>
                                <div>
                                    <Text strong style={{ marginBottom: 8, display: 'block' }}>Priority</Text>
                                    <Checkbox.Group
                                        value={priorityFilter}
                                        onChange={handlePriorityFilter}
                                    >
                                        <Checkbox value="URGENT">Urgent</Checkbox>
                                        <Checkbox value="HIGH">High</Checkbox>
                                        <Checkbox value="MEDIUM">Medium</Checkbox>
                                        <Checkbox value="LOW">Low</Checkbox>
                                    </Checkbox.Group>
                                </div>
                            </Space>
                        </Card>

                        {/* Kanban Board */}
                        <DragDropContext onDragEnd={handleDragEnd}>
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
                                            <Droppable droppableId={col.key}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                        className={`mytasks-column-content ${snapshot.isDraggingOver ? 'mytasks-column-over' : ''}`}
                                                    >
                                                        {columnTasks.length === 0 && (
                                                            <div className="mytasks-empty">No tasks</div>
                                                        )}
                                                        {columnTasks.map((task, index) => {
                                                            const pConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
                                                            return (
                                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                                    {(dragProvided, dragSnapshot) => (
                                                                        <div
                                                                            ref={dragProvided.innerRef}
                                                                            {...dragProvided.draggableProps}
                                                                            {...dragProvided.dragHandleProps}
                                                                            className={`mytasks-card ${dragSnapshot.isDragging ? 'mytasks-card-dragging' : ''}`}
                                                                            onClick={() => !dragSnapshot.isDragging && navigate(`/projects/${task.projectId}`)}
                                                                        >
                                                                            {/* Project Color Bar */}
                                                                            <div className="mytasks-card-color" style={{ background: task.project?.color || '#1890ff' }} />

                                                                            <div className="mytasks-card-body">
                                                                                {/* Project Name */}
                                                                                <div className="mytasks-card-project">
                                                                                    <FolderOutlined />
                                                                                    <span>{task.project?.name || 'Unknown'}</span>
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
                                                                                    <Progress
                                                                                        percent={task.progress}
                                                                                        size="small"
                                                                                        showInfo={false}
                                                                                        strokeColor={task.project?.color || '#1890ff'}
                                                                                    />
                                                                                </div>
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
        </Layout>
    );
};
