import React, { useState, useEffect } from 'react';
import {
    Layout,
    Card,
    Row,
    Col,
    Progress,
    Avatar,
    Typography,
    Space,
    Statistic,
    List,
    Timeline,
    Tag,
    Spin,
    Button,
} from 'antd';
import {
    ProjectOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    RocketOutlined,
    ArrowRightOutlined,
    FolderOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Sidebar } from '../components/Sidebar';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { activityLogService } from '../services/activityLogService';
import { useAuthStore } from '../store/authStore';
import './DashboardPage.css';

dayjs.extend(relativeTime);

const { Content } = Layout;
const { Title, Text } = Typography;

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);

    // Stats State
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
        completionRate: 0,
    });

    // Data State
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    const [myTasks, setMyTasks] = useState<any[]>([]);
    const [recentActivities, setRecentActivities] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Parallel data loading
            const [
                projectsRes,
                tasksRes,
                activitiesRes
            ] = await Promise.all([
                projectService.getProjects({ pageSize: 5 }), // Get recent 5 projects
                taskService.getMyTasks({ pageSize: 5, status: 'IN_PROGRESS' }), // Get my top 5 tasks
                activityLogService.getUserActivities(user.id, 10) // Get recent 10 activities
            ]);

            // Calculate aggregated stats (In real app, backend should provide a stats endpoint)
            const totalProjects = projectsRes.total || projectsRes.projects.length;
            const activeProjects = projectsRes.projects.filter((p: any) => p.status === 'ACTIVE').length;

            const myTotalTasks = tasksRes.total || 0;

            setStats({
                totalProjects,
                activeProjects,
                totalTasks: myTotalTasks,
                completedTasks: 0, // Placeholder
                pendingTasks: myTotalTasks,
                overdueTasks: 0, // Placeholder
                completionRate: 65, // Mock for visual
            });

            setRecentProjects(projectsRes.projects.slice(0, 4));
            setMyTasks(tasksRes.tasks.slice(0, 5));
            setRecentActivities(activitiesRes?.data?.activities || []); // Handle response structure
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const StatusCard = ({ title, value, icon, color, suffix, onClick }: any) => (
        <Card
            className="stat-card"
            bordered={false}
            hoverable={!!onClick}
            onClick={onClick}
            style={onClick ? { cursor: 'pointer' } : undefined}
        >
            <Statistic
                title={<Text type="secondary">{title}</Text>}
                value={value}
                valueStyle={{ color: '#1f2937', fontWeight: 600 }}
                prefix={<span style={{ color, marginRight: 8, fontSize: 20 }}>{icon}</span>}
                suffix={suffix}
            />
        </Card>
    );

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATED': return 'green';
            case 'UPDATED': return 'blue';
            case 'DELETED': return 'red';
            case 'COMPLETED': return 'purple';
            default: return 'gray';
        }
    };

    return (
        <Layout className="dashboard-layout">
            <Sidebar />

            <Layout className="dashboard-main">
                <Content className="dashboard-content">
                    <div className="dashboard-header-section">
                        <div>
                            <Title level={2} style={{ margin: 0 }}>
                                Welcome back, {user?.name?.split(' ')[0]}! 👋
                            </Title>
                            <Text type="secondary">Here's what's happening with your projects today.</Text>
                        </div>
                        <Button type="primary" size="large" onClick={() => navigate('/projects')}>
                            View All Projects
                        </Button>
                    </div>

                    <Spin spinning={loading}>
                        {/* Stats Row */}
                        <Row gutter={[20, 20]} className="stats-row">
                            <Col xs={24} sm={12} lg={6}>
                                <StatusCard
                                    title="Active Projects"
                                    value={stats.activeProjects}
                                    icon={<ProjectOutlined />}
                                    color="#1890ff"
                                    onClick={() => navigate('/projects')}
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <StatusCard
                                    title="My Pending Tasks"
                                    value={stats.pendingTasks}
                                    icon={<ClockCircleOutlined />}
                                    color="#fa8c16"
                                    onClick={() => navigate('/my-tasks')}
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <StatusCard
                                    title="Team Members"
                                    value={8} // Mock for demo
                                    icon={<TeamOutlined />}
                                    color="#52c41a"
                                    onClick={() => navigate('/projects')}
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <StatusCard
                                    title="Completion Rate"
                                    value={stats.completionRate}
                                    suffix="%"
                                    icon={<RocketOutlined />}
                                    color="#722ed1"
                                    onClick={() => navigate('/projects')}
                                />
                            </Col>
                        </Row>

                        <div className="dashboard-grid">
                            {/* Left Column: Recent Projects & My Tasks */}
                            <div className="main-col">
                                {/* Recent Projects */}
                                <div className="section-header">
                                    <Title level={4}>Recent Projects</Title>
                                    <Button type="link" onClick={() => navigate('/projects')}>View all</Button>
                                </div>
                                <Row gutter={[16, 16]}>
                                    {recentProjects.map(project => (
                                        <Col xs={24} md={12} key={project.id}>
                                            <Card
                                                hoverable
                                                className="project-summary-card"
                                                onClick={() => navigate(`/projects/${project.id}`)}
                                            >
                                                <div className="card-header">
                                                    <div className="project-icon" style={{ backgroundColor: project.color }}>
                                                        <FolderOutlined />
                                                    </div>
                                                    <Tag color={
                                                        project.status === 'ACTIVE' ? 'success' :
                                                        project.status === 'DELAY' ? 'error' :
                                                        project.status === 'COMPLETED' ? 'processing' :
                                                        project.status === 'HOLD' ? 'orange' :
                                                        project.status === 'POSTPONE' ? 'warning' :
                                                        'default'
                                                    }>
                                                        {project.status}
                                                    </Tag>
                                                </div>
                                                <Title level={5} ellipsis className="mt-4 mb-2">
                                                    {project.name}
                                                </Title>
                                                <Text type="secondary" ellipsis>
                                                    {project.description || 'No description'}
                                                </Text>
                                                <div className="mt-4">
                                                    <div className="flex justify-between mb-1">
                                                        <Text type="secondary" style={{ fontSize: 12 }}>Progress</Text>
                                                        <Text strong style={{ fontSize: 12 }}>65%</Text>
                                                    </div>
                                                    <Progress percent={65} showInfo={false} strokeColor={project.color} />
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                                {/* My Tasks */}
                                <div className="section-header mt-8">
                                    <Title level={4}>My Active Tasks</Title>
                                    <Button type="link" onClick={() => navigate('/my-tasks')}>View all</Button>
                                </div>
                                <Card className="tasks-list-card" bordered={false}>
                                    <List
                                        dataSource={myTasks}
                                        renderItem={task => (
                                            <List.Item
                                                actions={[
                                                    <Button
                                                        type="text"
                                                        icon={<ArrowRightOutlined />}
                                                        onClick={() => navigate(`/projects/${task.projectId}?taskId=${task.id}`)}
                                                    />
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={
                                                        <Avatar
                                                            style={{
                                                                backgroundColor: task.priority === 'URGENT' ? '#ff4d4f' : '#e6f4ff',
                                                                color: task.priority === 'URGENT' ? 'white' : '#1677ff'
                                                            }}
                                                            icon={<CheckCircleOutlined />}
                                                        />
                                                    }
                                                    title={<Text strong>{task.title}</Text>}
                                                    description={
                                                        <Space split={<div className="divider-dot" />}>
                                                            <Text type="secondary">{task.project?.name}</Text>
                                                            <Text type="secondary">
                                                                Due {task.dueDate ? dayjs(task.dueDate).format('MMM D') : 'No date'}
                                                            </Text>
                                                        </Space>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </div>

                            {/* Right Column: Activity Feed */}
                            <div className="side-col">
                                <div className="section-header">
                                    <Title level={4}>Recent Activity</Title>
                                </div>
                                <Card className="activity-card" bordered={false}>
                                    <Timeline>
                                        {recentActivities.length > 0 ? recentActivities.map(log => (
                                            <Timeline.Item
                                                key={log.id}
                                                color={getActionColor(log.action)}
                                            >
                                                <Text strong>{log.user?.name}</Text>
                                                <Text type="secondary"> {log.action.toLowerCase()} </Text>
                                                <Text strong>{log.entityType}</Text>
                                                <br />
                                                <Text style={{ fontSize: 13 }}>
                                                    {log.task?.title || log.project?.name || 'an item'}
                                                </Text>
                                                <div className="time-caption">
                                                    {dayjs(log.createdAt).fromNow()}
                                                </div>
                                            </Timeline.Item>
                                        )) : <Text type="secondary">No recent activities</Text>}
                                    </Timeline>
                                </Card>
                            </div>
                        </div>
                    </Spin>
                </Content>
            </Layout>
        </Layout>
    );
};
