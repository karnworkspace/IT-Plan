// Dashboard Page with Project Selector
import React, { useState, useEffect } from 'react';
import type { Project, ProjectStats } from '../services/projectService';
import type { Task, TaskStats } from '../services/taskService';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { useAuthStore } from '../store/authStore';
import {
    Layout,
    Card,
    Row,
    Col,
    Progress,
    Avatar,
    Tag,
    Button,
    Statistic,
    Typography,
    Dropdown,
    Space,
    Badge,
    Spin,
    message,
} from 'antd';
import {
    FolderOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    EditOutlined,
    ShareAltOutlined,
    DownOutlined,
    TeamOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import './DashboardPage.css';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

export const DashboardPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const { logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projectStats, setProjectStats] = useState<TaskStats | null>(null);

    // Load projects on mount
    useEffect(() => {
        loadProjects();
    }, []);

    // Load tasks when project selected
    useEffect(() => {
        if (selectedProject) {
            loadTasksAndStats(selectedProject.id);
        }
    }, [selectedProject]);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const response = await projectService.getProjects({ status: 'ACTIVE', pageSize: 50 });
            setProjects(response.projects);
            if (response.projects.length > 0 && !selectedProject) {
                setSelectedProject(response.projects[0]);
            }
        } catch (error) {
            message.error('Failed to load projects');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadTasksAndStats = async (projectId: string) => {
        try {
            const [tasksResponse, statsResponse] = await Promise.all([
                taskService.getTasks(projectId, { pageSize: 20 }),
                taskService.getTaskStats(projectId)
            ]);
            setTasks(tasksResponse.tasks);
            setProjectStats(statsResponse);
        } catch (error) {
            message.error('Failed to load project data');
            console.error(error);
        }
    };

    const handleProjectChange = (projectId: string) => {
        const project = projects.find((p) => p.id === projectId);
        if (project) {
            setSelectedProject(project);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'planning':
                return 'warning';
            case 'on_hold':
                return 'default';
            case 'ACTIVE':
                return 'success';
            case 'ARCHIVED':
                return 'default';
            case 'COMPLETED':
                return 'success';
            default:
                return 'default';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
            case 'URGENT':
                return 'red';
            case 'medium':
                return 'orange';
            case 'low':
            case 'LOW':
                return 'green';
            default:
                return 'default';
        }
    };

    const projectMenuItems = projects.map((project) => ({
        key: project.id,
        label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FolderOutlined />
                <span>{project.name}</span>
                {selectedProject?.id === project.id && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
            </div>
        ),
        onClick: () => handleProjectChange(project.id),
    }));

    return (
        <Layout className="dashboard-layout">
            {/* Sidebar */}
            <Sider width={250} className="dashboard-sider">
                <div className="logo">
                    <TeamOutlined style={{ fontSize: 24 }} />
                    <Title level={4} style={{ margin: 0, color: 'white' }}>TaskFlow</Title>
                </div>

                <div className="sidebar-menu">
                    <div className="menu-item active">
                        <FolderOutlined /> Dashboard
                    </div>
                    <div className="menu-item">
                        <FolderOutlined /> Projects
                    </div>
                    <div className="menu-item">
                        <CheckCircleOutlined /> My Tasks
                    </div>
                    <div className="menu-item">
                        <CalendarOutlined /> Calendar
                    </div>
                </div>

                <div className="sidebar-user">
                    <Avatar>K</Avatar>
                    <Text style={{ color: 'white' }}>KARN</Text>
                    <Button 
                        type="text" 
                        onClick={handleLogout}
                        style={{ color: 'white', marginTop: 8 }}
                    >
                        Logout
                    </Button>
                </div>
            </Sider>

            <Layout>
                {/* Header */}
                <Header className="dashboard-header">
                    <Text type="secondary">Dashboard</Text>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <Badge count={0}>
                            <Button type="text" icon={<ExclamationCircleOutlined />} />
                        </Badge>
                        <Avatar>K</Avatar>
                    </div>
                </Header>

                {/* Content */}
                <Content className="dashboard-content">
                    {/* Project Selector */}
                    <Card className="project-selector-card">
                        <Dropdown menu={{ items: projectMenuItems }} trigger={['click']}>
                            <div className="project-selector">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <FolderOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>{selectedProject?.name || 'Select a project'}</Title>
                                        {selectedProject && (
                                            <Tag color={getStatusColor(selectedProject.status)}>
                                                {selectedProject.status.replace('_', ' ').toUpperCase()}
                                            </Tag>
                                        )}
                                    </div>
                                    <DownOutlined />
                                </div>
                            </div>
                        </Dropdown>
                    </Card>

                    {/* Project Overview */}
                    <Card className="project-overview-card">
                        <Spin spinning={loading}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <Title level={4}>{selectedProject?.name}</Title>
                                <Space>
                                    <Button icon={<EditOutlined />}>Edit</Button>
                                    <Button icon={<ShareAltOutlined />}>Share</Button>
                                </Space>
                            </div>

                            <Row gutter={16}>
                                <Col span={6}>
                                    <Statistic
                                        title="Total Tasks"
                                        value={projectStats?.total || 0}
                                        prefix={<FolderOutlined />}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="Completed"
                                        value={projectStats?.done || 0}
                                        prefix={<CheckCircleOutlined />}
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="In Progress"
                                        value={projectStats?.inProgress || 0}
                                        prefix={<ClockCircleOutlined />}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="Overdue"
                                        value={projectStats?.overdue || 0}
                                        prefix={<ExclamationCircleOutlined />}
                                        valueStyle={{ color: '#f5222d' }}
                                    />
                                </Col>
                            </Row>

                            {selectedProject && projectStats && (
                                <div style={{ marginTop: 24 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text strong>{Math.round((projectStats.done / (projectStats.total || 1)) * 100)}% Complete</Text>
                                        <Text type="secondary">
                                            {new Date(selectedProject.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - Present
                                        </Text>
                                    </div>
                                    <Progress 
                                        percent={Math.round((projectStats.done / (projectStats.total || 1)) * 100)} 
                                        status="active" 
                                    />
                                </div>
                            )}
                        </Spin>
                    </Card>

                    {/* My Projects Overview */}
                    <Spin spinning={loading}>
                        <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>MY PROJECTS OVERVIEW</Title>
                        <Row gutter={16}>
                            {projects.slice(0, 4).map((project) => (
                                <Col span={12} key={project.id}>
                                    <Card className="mini-project-card" hoverable>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <Text strong>{project.name}</Text>
                                                <Tag color={getStatusColor(project.status)} style={{ marginLeft: 8 }}>
                                                    {project.status}
                                                </Tag>
                                            </div>
                                        </div>
                                        {project._count && (
                                            <>
                                                <Progress percent={50} size="small" style={{ marginTop: 12 }} />
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                                                    <Text type="secondary">Tasks: {project._count?.tasks || 0}</Text>
                                                    <Text type="secondary">Members: {project._count?.members || 0}</Text>
                                                </div>
                                            </>
                                        )}
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Spin>

                    {/* Task Board Section */}
                    <Spin spinning={loading}>
                        <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>TASK BOARD SECTION</Title>
                        <Row gutter={16}>
                            {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map((status) => {
                                const statusTasks = tasks.filter(t => t.status === status).slice(0, 2);
                                const statusLabel = status.replace(/_/g, ' ');
                                return (
                                    <Col span={6} key={status}>
                                        <Card
                                            title={
                                                <span>
                                                    {statusLabel} ({statusTasks.length})
                                                </span>
                                            }
                                            className="task-column-card"
                                        >
                                            {statusTasks.map((task) => (
                                                <Card key={task.id} size="small" className="task-card">
                                                    <Text strong>{task.title}</Text>
                                                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Avatar size="small">{task.assignee?.name?.charAt(0) || '?'}</Avatar>
                                                        <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>
                                                    </div>
                                                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                                                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                                                    </Text>
                                                    <Progress percent={task.progress} size="small" style={{ marginTop: 8 }} />
                                                </Card>
                                            ))}
                                            {statusTasks.length === 0 && (
                                                <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: 16 }}>
                                                    No tasks
                                                </Text>
                                            )}
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Spin>
                </Content>
            </Layout>
        </Layout>
    );
};
