import React, { useState, useEffect } from 'react';
import {
    Layout,
    Card,
    Row,
    Col,
    Typography,
    Space,
    List,
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
import { useCountUp } from '../hooks/useCountUp';
import './DashboardPage.css';

dayjs.extend(relativeTime);

const { Content } = Layout;
const { Title, Text } = Typography;

// --- Stat Card with count-up animation + gradient ---
const StatCardItem = ({ title, value, icon, iconClass, suffix, onClick, gradientFrom }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconClass: string;
    suffix?: string;
    onClick?: () => void;
    gradientFrom?: string;
}) => {
    const animatedValue = useCountUp(value, 1000);

    return (
        <Card
            className="stat-card"
            bordered={false}
            onClick={onClick}
            style={gradientFrom ? { background: `linear-gradient(135deg, ${gradientFrom} 0%, #ffffff 100%)` } : undefined}
        >
            <div className="stat-card-inner">
                <div>
                    <div className="stat-label">{title}</div>
                    <div className="stat-value">
                        {animatedValue}{suffix}
                    </div>
                </div>
                <div className={`stat-icon-box ${iconClass}`}>
                    {icon}
                </div>
            </div>
        </Card>
    );
};

// --- Status helpers ---
const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'ACTIVE': return 'badge-active';
        case 'DELAY': return 'badge-delay';
        case 'COMPLETED': return 'badge-completed';
        case 'HOLD': return 'badge-hold';
        case 'CANCELLED': return 'badge-cancelled';
        default: return 'badge-active';
    }
};

const getStatusProgressColor = (status: string) => {
    switch (status) {
        case 'ACTIVE': return '#10B981';
        case 'DELAY': return '#EF4444';
        case 'COMPLETED': return '#3B82F6';
        case 'HOLD': return '#F59E0B';
        default: return '#6B7280';
    }
};

const getStatusIconBg = (status: string) => {
    switch (status) {
        case 'ACTIVE': return '#D1FAE5';
        case 'DELAY': return '#FEE2E2';
        case 'COMPLETED': return '#DBEAFE';
        case 'HOLD': return '#FEF3C7';
        default: return '#F1F5F9';
    }
};

const getStatusIconColor = (status: string) => {
    switch (status) {
        case 'ACTIVE': return '#10B981';
        case 'DELAY': return '#EF4444';
        case 'COMPLETED': return '#3B82F6';
        case 'HOLD': return '#F59E0B';
        default: return '#6B7280';
    }
};

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
        completionRate: 0,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [myTasks, setMyTasks] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

            const [projectsRes, tasksRes, activitiesRes] = await Promise.all([
                projectService.getProjects({ pageSize: 5 }),
                taskService.getMyTasks({ pageSize: 5, status: 'IN_PROGRESS' }),
                activityLogService.getUserActivities(user.id, 10)
            ]);

            const totalProjects = projectsRes.total || projectsRes.projects.length;
            const activeProjects = projectsRes.projects.filter((p) => p.status === 'ACTIVE').length;
            const myTotalTasks = tasksRes.total || 0;

            setStats({
                totalProjects,
                activeProjects,
                totalTasks: myTotalTasks,
                completedTasks: 0,
                pendingTasks: myTotalTasks,
                overdueTasks: 0,
                completionRate: 65,
            });

            setRecentProjects(projectsRes.projects.slice(0, 4));
            setMyTasks(tasksRes.tasks.slice(0, 5));
            setRecentActivities(activitiesRes?.data?.activities || []);
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout className="dashboard-layout">
            <Sidebar />

            <Layout className="dashboard-main">
                <Content className="dashboard-content">
                    <div className="dashboard-header-section">
                        <div>
                            <Title level={2} style={{ margin: 0, color: '#1E293B', fontSize: 48 }}>
                                Welcome back, {user?.name?.split(' ')[0]}! 👋
                            </Title>
                            <Text style={{ color: '#64748B', fontSize: 30 }}>Here's what's happening with your projects today.</Text>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => navigate('/projects')}
                            style={{ background: '#3B82F6', borderColor: '#3B82F6' }}
                            icon={<ArrowRightOutlined />}
                        >
                            View All Projects
                        </Button>
                    </div>

                    <Spin spinning={loading}>
                        {/* Stats Row */}
                        <Row gutter={[16, 16]} className="stats-row">
                            <Col xs={24} sm={12} lg={6}>
                                <StatCardItem
                                    title="Active Projects"
                                    value={stats.activeProjects}
                                    icon={<ProjectOutlined />}
                                    iconClass="icon-blue"
                                    gradientFrom="#DBEAFE"
                                    onClick={() => navigate('/projects')}
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <StatCardItem
                                    title="My Pending Tasks"
                                    value={stats.pendingTasks}
                                    icon={<ClockCircleOutlined />}
                                    iconClass="icon-amber"
                                    gradientFrom="#FEF3C7"
                                    onClick={() => navigate('/my-tasks')}
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <StatCardItem
                                    title="Team Members"
                                    value={8}
                                    icon={<TeamOutlined />}
                                    iconClass="icon-emerald"
                                    gradientFrom="#D1FAE5"
                                    onClick={() => navigate('/projects')}
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <StatCardItem
                                    title="Completion Rate"
                                    value={stats.completionRate}
                                    suffix="%"
                                    icon={<RocketOutlined />}
                                    iconClass="icon-purple"
                                    gradientFrom="#EDE9FE"
                                    onClick={() => navigate('/projects')}
                                />
                            </Col>
                        </Row>

                        <div className="dashboard-grid">
                            {/* Left Column */}
                            <div className="main-col">
                                {/* Recent Projects */}
                                <div className="section-header">
                                    <Title level={4} style={{ color: '#1E293B', margin: 0 }}>Recent Projects</Title>
                                    <button className="view-all-link" onClick={() => navigate('/projects')}>View all</button>
                                </div>
                                <Row gutter={[16, 16]}>
                                    {recentProjects.map(project => (
                                        <Col xs={24} md={12} key={project.id}>
                                            <div
                                                className="project-card-v2"
                                                onClick={() => navigate(`/projects/${project.id}`)}
                                            >
                                                <div className="card-header">
                                                    <div className="project-icon-v2" style={{ backgroundColor: getStatusIconBg(project.status) }}>
                                                        <FolderOutlined style={{ color: getStatusIconColor(project.status), fontSize: 18 }} />
                                                    </div>
                                                    <span className={`status-badge ${getStatusBadgeClass(project.status)}`}>
                                                        {project.status}
                                                    </span>
                                                </div>
                                                <h3 className="project-card-title">{project.name}</h3>
                                                <p className="project-card-id">{project.description || 'No description'}</p>
                                                <div className="project-card-progress">
                                                    <div className="progress-header">
                                                        <span className="progress-label">Progress</span>
                                                        <span className="progress-value">65%</span>
                                                    </div>
                                                    <div className="progress-bar-track">
                                                        <div
                                                            className="progress-bar-fill"
                                                            style={{ width: '65%', background: getStatusProgressColor(project.status) }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>

                                {/* My Tasks */}
                                <div className="section-header" style={{ marginTop: 32 }}>
                                    <Title level={4} style={{ color: '#1E293B', margin: 0 }}>My Active Tasks</Title>
                                    <button className="view-all-link" onClick={() => navigate('/my-tasks')}>View all</button>
                                </div>
                                <Card className="tasks-list-card" bordered={false}>
                                    {myTasks.length > 0 ? (
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
                                                            <div className={`task-priority-icon ${task.priority === 'URGENT' ? 'priority-urgent' : 'priority-normal'}`}>
                                                                <CheckCircleOutlined />
                                                            </div>
                                                        }
                                                        title={<Text strong style={{ color: '#1E293B' }}>{task.title}</Text>}
                                                        description={
                                                            <Space split={<span style={{ color: '#CBD5E1' }}>·</span>}>
                                                                <Text style={{ color: '#64748B', fontSize: 13 }}>{task.project?.name}</Text>
                                                                <Text style={{ color: '#64748B', fontSize: 13 }}>
                                                                    Due {task.dueDate ? dayjs(task.dueDate).format('MMM D') : 'No date'}
                                                                </Text>
                                                            </Space>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    ) : (
                                        <div className="empty-state">No active tasks</div>
                                    )}
                                </Card>
                            </div>

                            {/* Right Column: Activity Feed */}
                            <div className="side-col">
                                <div className="section-header">
                                    <Title level={4} style={{ color: '#1E293B', margin: 0 }}>Recent Activity</Title>
                                </div>
                                <div className="activity-feed">
                                    {recentActivities.length > 0 ? recentActivities.map((log, index) => (
                                        <div key={log.id} className="activity-item">
                                            {index < recentActivities.length - 1 && (
                                                <div className="activity-line" />
                                            )}
                                            <div className="activity-dot" />
                                            <div className="activity-content">
                                                <p className="activity-text">
                                                    <span className="activity-action">{log.action?.toLowerCase()}</span>{' '}
                                                    <span className="activity-entity">
                                                        {log.task?.title || log.project?.name || log.entityType}
                                                    </span>
                                                </p>
                                                <span className="activity-time">{dayjs(log.createdAt).fromNow()}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="empty-state">No recent activities</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Spin>
                </Content>
            </Layout>
        </Layout>
    );
};
