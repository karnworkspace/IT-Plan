import React, { useState, useEffect } from 'react';
import { taskService, type Task } from '../services/taskService';
import { Sidebar } from '../components/Sidebar';
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
    message,
    Spin,
} from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    ExclamationCircleOutlined,
    FolderOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './MyTasksPage.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export const MyTasksPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);

    // Load my tasks on mount
    useEffect(() => {
        loadMyTasks();
    }, []);

    const loadMyTasks = async () => {
        try {
            setLoading(true);
            const response = await taskService.getMyTasks({ pageSize: 100 });
            setTasks(response.tasks || []);
        } catch (error) {
            message.error('Failed to load tasks');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusFilter = (checkedValues: string[]) => {
        setStatusFilter(checkedValues);
    };

    const handlePriorityFilter = (checkedValues: string[]) => {
        setPriorityFilter(checkedValues);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH':
            case 'URGENT':
                return 'red';
            case 'MEDIUM':
                return 'orange';
            case 'LOW':
                return 'green';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'TODO':
                return <CheckCircleOutlined style={{ color: '#8c8c8c' }} />;
            case 'IN_PROGRESS':
                return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
            case 'IN_REVIEW':
                return <ClockCircleOutlined style={{ color: '#fa8c16' }} />;
            case 'DONE':
                return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
            case 'BLOCKED':
                return <ExclamationCircleOutlined style={{ color: '#f5222d' }} />;
            default:
                return <CheckCircleOutlined />;
        }
    };

    const filteredTasks = tasks.filter(task => {
        // Filter by status
        if (statusFilter.length > 0 && !statusFilter.includes(task.status)) {
            return false;
        }
        // Filter by priority
        if (priorityFilter.length > 0 && !priorityFilter.includes(task.priority)) {
            return false;
        }
        return true;
    });

    // Sort by priority first: URGENT > HIGH > MEDIUM > LOW
    // Then by due date (closest due date first)
    const priorityOrder = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a.priority);
        const bIndex = priorityOrder.indexOf(b.priority);

        // First sort by priority
        if (aIndex !== bIndex) {
            return aIndex - bIndex;
        }

        // If priority is same, sort by due date (closest first)
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }

        // If one has due date and other doesn't, the one with due date comes first
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;

        return 0;
    });

    const taskGroups = {
        TODO: filteredTasks.filter(t => t.status === 'TODO'),
        IN_PROGRESS: filteredTasks.filter(t => t.status === 'IN_PROGRESS'),
        IN_REVIEW: filteredTasks.filter(t => t.status === 'IN_REVIEW'),
        DONE: filteredTasks.filter(t => t.status === 'DONE'),
        BLOCKED: filteredTasks.filter(t => t.status === 'BLOCKED'),
    };

    return (
        <Layout className="my-tasks-layout">
            <Sidebar />

            <Layout>
                <Header className="my-tasks-header">
                    <Title level={3}>My Tasks</Title>
                    <Text type="secondary">Tasks assigned to or created by you</Text>
                </Header>

                <Content className="my-tasks-content">
                    <Spin spinning={loading}>
                        <Card className="filters-card" style={{ marginBottom: 16 }}>
                            <Space size="large" wrap>
                                <div>
                                    <Text strong style={{ marginBottom: 8, display: 'block' }}>Status</Text>
                                    <Checkbox.Group
                                        value={statusFilter}
                                        onChange={handleStatusFilter}
                                    >
                                        <Checkbox value="TODO">To Do</Checkbox>
                                        <Checkbox value="IN_PROGRESS">In Progress</Checkbox>
                                        <Checkbox value="IN_REVIEW">In Review</Checkbox>
                                        <Checkbox value="DONE">Done</Checkbox>
                                        <Checkbox value="BLOCKED">Blocked</Checkbox>
                                    </Checkbox.Group>
                                </div>

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

                        {filteredTasks.length === 0 ? (
                            <Card className="empty-state">
                                <CheckCircleOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
                                <Title level={4} style={{ marginTop: 16 }}>No Tasks Found</Title>
                                <Text type="secondary">
                                    {statusFilter.length > 0 || priorityFilter.length > 0
                                        ? 'Try adjusting your filters'
                                        : 'Create your first task to get started'}
                                </Text>
                            </Card>
                        ) : (
                            <div style={{ marginTop: 24 }}>
                                {/* Status Header */}
                                <Row gutter={[16, 16]}>
                                    {Object.entries(taskGroups).map(([status, tasks]) =>
                                        tasks.length > 0 ? (
                                            <Col key={status} span={24}>
                                                <Card
                                                    className="status-header-card"
                                                    style={{ marginBottom: 16 }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        {getStatusIcon(status)}
                                                        <Title level={4} style={{ margin: 0 }}>
                                                            {status.replace(/_/g, ' ')}
                                                        </Title>
                                                        <Tag>{tasks.length} tasks</Tag>
                                                    </div>
                                                </Card>
                                            </Col>
                                        ) : null
                                    )}
                                </Row>

                                {/* Tasks Grid - Sorted by Priority */}
                                <Row gutter={[16, 16]}>
                                    {sortedTasks.map(task => (
                                        <Col xs={24} sm={12} md={8} lg={6} xl={4} key={task.id}>
                                            <Card
                                                className="task-card"
                                                hoverable
                                                style={{ overflow: 'hidden' }}
                                                bodyStyle={{ padding: 0 }}
                                                onClick={() => navigate(`/projects/${task.projectId}`)}
                                            >
                                                {/* Project Header */}
                                                <div style={{
                                                    padding: '8px 12px',
                                                    background: task.project?.color || '#1890ff',
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}>
                                                    <FolderOutlined />
                                                    <span style={{
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>
                                                        {task.project?.name || 'Unknown Project'}
                                                    </span>
                                                </div>

                                                {/* Card Content */}
                                                <div style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                                            <Text strong style={{ display: 'block', fontSize: 14, marginBottom: 4 }} ellipsis={{ tooltip: true }}>
                                                                {task.title}
                                                            </Text>
                                                            {task.dueDate && (
                                                                <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                                                                    <CalendarOutlined /> Due: {new Date(task.dueDate).toLocaleDateString()}
                                                                </Text>
                                                            )}
                                                        </div>
                                                        <Tag color={getPriorityColor(task.priority)} style={{ marginLeft: 8 }}>
                                                            {task.priority}
                                                        </Tag>
                                                    </div>

                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Space size="small">
                                                            <Tag color="blue" style={{ margin: 0 }}>
                                                                {getStatusIcon(task.status)} {task.status.replace(/_/g, ' ')}
                                                            </Tag>
                                                        </Space>
                                                        <Progress
                                                            percent={task.progress}
                                                            size="small"
                                                            style={{ width: 60 }}
                                                            showInfo={false}
                                                            strokeColor={task.project?.color}
                                                        />
                                                    </div>
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}
                    </Spin>
                </Content>
            </Layout>
        </Layout>
    );
};
