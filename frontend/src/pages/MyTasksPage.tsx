import React, { useState, useEffect } from 'react';
import { taskService, type Task } from '../services/taskService';
import { projectService, type Project } from '../services/projectService';
import {
    Layout,
    Card,
    Row,
    Col,
    Button,
    Typography,
    Space,
    Tag,
    Progress,
    Avatar,
    Select,
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
import './MyTasksPage.css';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export const MyTasksPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
    const [myOnly, setMyOnly] = useState(true);

    useEffect(() => {
        loadData();
    }, [selectedProject, statusFilter, priorityFilter, myOnly]);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Load projects first if not loaded
            if (projects.length === 0) {
                const projectsResponse = await projectService.getProjects({ pageSize: 100 });
                setProjects(projectsResponse.projects);
            }

            // Load tasks
            const tasksResponse = await taskService.getTasks(
                selectedProject || projects[0]?.id || '',
                { pageSize: 100 }
            );
            setTasks(tasksResponse.tasks);
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

    const handleProjectChange = (value: string) => {
        setSelectedProject(value);
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
        // Filter by assignee (my tasks only)
        if (myOnly) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return task.assigneeId === user.id || task.createdById === user.id;
        }
        return true;
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
            <Sider width={250} className="my-tasks-sider">
                <div className="logo">
                    <CheckCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0, color: 'white' }}>My Tasks</Title>
                </div>

                <div className="sidebar-menu">
                    <div className="menu-item">
                        <FolderOutlined /> Dashboard
                    </div>
                    <div className="menu-item">
                        <FolderOutlined /> Projects
                    </div>
                    <div className="menu-item active">
                        <CheckCircleOutlined /> My Tasks
                    </div>
                    <div className="menu-item">
                        <CalendarOutlined /> Calendar
                    </div>
                </div>
            </Sider>

            <Layout>
                <Header className="my-tasks-header">
                    <Title level={3}>My Tasks</Title>
                    <Space size="large">
                        <Select
                            placeholder="Select Project"
                            style={{ width: 200 }}
                            allowClear
                            value={selectedProject}
                            onChange={handleProjectChange}
                        >
                            {projects.map(project => (
                                <Option key={project.id} value={project.id}>
                                    {project.name}
                                </Option>
                            ))}
                        </Select>
                        <Checkbox checked={myOnly} onChange={(e) => setMyOnly(e.target.checked)}>
                            My Tasks Only
                        </Checkbox>
                    </Space>
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
                            <Row gutter={[16, 16]}>
                                {Object.entries(taskGroups).map(([status, tasks]) => (
                                    tasks.length > 0 && (
                                        <Col xs={24} sm={12} md={12} lg={8} xl={6} key={status}>
                                            <Card
                                                title={
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        {getStatusIcon(status)}
                                                        <span>{status.replace(/_/g, ' ')}</span>
                                                        <Tag>{tasks.length}</Tag>
                                                    </div>
                                                }
                                                className="task-group-card"
                                            >
                                                <Space direction="vertical" style={{ width: '100%' }} size="small">
                                                    {tasks.slice(0, 5).map(task => (
                                                        <Card key={task.id} size="small" className="task-item">
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                <div style={{ flex: 1 }}>
                                                                    <Text strong style={{ display: 'block' }}>{task.title}</Text>
                                                                    {task.dueDate && (
                                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                                            <CalendarOutlined /> Due: {new Date(task.dueDate).toLocaleDateString()}
                                                                        </Text>
                                                                    )}
                                                                </div>
                                                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                                    <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>
                                                                    <Progress
                                                                        type="circle"
                                                                        width={40}
                                                                        percent={task.progress}
                                                                        strokeWidth={6}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    ))}
                                                    {tasks.length > 5 && (
                                                        <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                                                            +{tasks.length - 5} more tasks
                                                        </Text>
                                                    )}
                                                </Space>
                                            </Card>
                                        </Col>
                                    )
                                ))}
                            </Row>
                        )}
                    </Spin>
                </Content>
            </Layout>
        </Layout>
    );
};
