import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
    Progress,
    AutoComplete,
    Input,
} from 'antd';
import {
    ProjectOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    RocketOutlined,
    ArrowRightOutlined,
    FolderOutlined,
    UserOutlined,
    ThunderboltOutlined,
    PieChartOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Sidebar } from '../../components/layout/Sidebar';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { activityLogService } from '../../services/activityLogService';
import { useAuthStore } from '../../store/authStore';
import { useCountUp } from '../../hooks/useCountUp';
import './DashboardPage.css';

dayjs.extend(relativeTime);

const { Content } = Layout;
const { Title, Text } = Typography;

// --- Stat Card with count-up animation + gradient ---
const StatCardItem = ({ title, value, icon, iconClass, suffix, onClick, gradientFrom, description }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconClass: string;
    suffix?: string;
    onClick?: () => void;
    gradientFrom?: string;
    description?: string;
}) => {
    const animatedValue = useCountUp(value, 1000);

    return (
        <Card
            className="stat-card"
            variant="borderless"
            onClick={onClick}
            style={gradientFrom ? { background: `linear-gradient(135deg, ${gradientFrom} 0%, #ffffff 100%)` } : undefined}
        >
            <div className="stat-card-inner">
                <div>
                    <div className="stat-label">{title}</div>
                    <div className="stat-value">
                        {animatedValue}{suffix}
                    </div>
                    {description && (
                        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{description}</div>
                    )}
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
        case 'ACTIVE': return '#32BCAD';
        case 'DELAY': return '#D94F4F';
        case 'COMPLETED': return '#2E7D9B';
        case 'HOLD': return '#E8A838';
        default: return '#77787B';
    }
};

const getStatusIconBg = (status: string) => {
    switch (status) {
        case 'ACTIVE': return 'rgba(50,188,173,0.12)';
        case 'DELAY': return 'rgba(217,79,79,0.10)';
        case 'COMPLETED': return 'rgba(46,125,155,0.08)';
        case 'HOLD': return '#FFF3DC';
        default: return '#F1F5F9';
    }
};

const getStatusIconColor = (status: string) => {
    switch (status) {
        case 'ACTIVE': return '#32BCAD';
        case 'DELAY': return '#D94F4F';
        case 'COMPLETED': return '#2E7D9B';
        case 'HOLD': return '#E8A838';
        default: return '#77787B';
    }
};

// --- Activity action labels ---
const ACTION_LABELS: Record<string, string> = {
    CREATED: 'created',
    UPDATED: 'updated',
    DELETED: 'deleted',
    ASSIGNED: 'assigned',
    COMPLETED: 'completed',
    COMMENTED: 'commented on',
};

const ACTION_COLORS: Record<string, string> = {
    CREATED: '#32BCAD',
    UPDATED: '#2E7D9B',
    DELETED: '#D94F4F',
    ASSIGNED: '#8B5CF6',
    COMPLETED: '#32BCAD',
    COMMENTED: '#E8A838',
};

const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();
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
        teamMembers: 0,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [myTasks, setMyTasks] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [allTasksList, setAllTasksList] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        if (!user) return;

        try {
            setLoading(true);

            const [projectsRes, allTasksRes, activitiesRes] = await Promise.all([
                projectService.getProjects({ pageSize: 500 }),
                taskService.getMyTasks({ pageSize: 500 }),
                activityLogService.getRecentActivities(15)
            ]);

            const totalProjects = projectsRes.total || projectsRes.projects.length;
            const activeProjects = projectsRes.projects.filter((p: any) => p.status === 'ACTIVE').length;
            const allTasks = allTasksRes.tasks || [];
            const doneTasks = allTasks.filter((t: any) => t.status === 'DONE').length;
            const pendingTasks = allTasks.filter((t: any) => t.status !== 'DONE' && t.status !== 'CANCELLED').length;
            const completionRate = allTasks.length > 0 ? Math.round((doneTasks / allTasks.length) * 100) : 0;

            // Unique team members across all projects
            const memberSet = new Set<string>();
            projectsRes.projects.forEach((p: any) => {
                if (p.members) p.members.forEach((m: any) => memberSet.add(m.userId || m.user?.id));
                if (p.owner) memberSet.add(p.owner.id);
            });

            setStats({
                totalProjects,
                activeProjects,
                totalTasks: allTasks.length,
                completedTasks: doneTasks,
                pendingTasks,
                overdueTasks: 0,
                completionRate,
                teamMembers: memberSet.size || totalProjects,
            });

            setRecentProjects(projectsRes.projects);
            setAllTasksList(allTasks);
            setMyTasks(allTasks.filter((t: any) => t.status === 'IN_PROGRESS').slice(0, 5));
            setRecentActivities(activitiesRes?.data?.activities || []);
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Project status distribution for summary chart ---
    const projectStatusCounts = useMemo(() => {
        const counts: Record<string, number> = { ACTIVE: 0, DELAY: 0, COMPLETED: 0, HOLD: 0, CANCELLED: 0 };
        recentProjects.forEach((p: any) => {
            if (counts[p.status] !== undefined) counts[p.status]++;
            else counts[p.status] = 1;
        });
        return counts;
    }, [recentProjects]);

    // --- Global search: client-side search over loaded projects + tasks ---
    const searchOptions = useMemo(() => {
        if (!searchValue.trim()) return [];
        const q = searchValue.toLowerCase();
        const projectResults = recentProjects
            .filter((p: any) => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
            .slice(0, 5)
            .map((p: any) => ({
                value: `project-${p.id}`,
                label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FolderOutlined style={{ color: '#32BCAD' }} />
                        <div>
                            <div style={{ fontWeight: 500, fontSize: 13 }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: '#94A3B8' }}>Project</div>
                        </div>
                    </div>
                ),
            }));
        const taskResults = allTasksList
            .filter((t: any) => t.title?.toLowerCase().includes(q))
            .slice(0, 5)
            .map((t: any) => ({
                value: `task-${t.projectId}-${t.id}`,
                label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircleOutlined style={{ color: '#32BCAD' }} />
                        <div>
                            <div style={{ fontWeight: 500, fontSize: 13 }}>{t.title}</div>
                            <div style={{ fontSize: 11, color: '#94A3B8' }}>Task - {t.project?.name || 'Unknown'}</div>
                        </div>
                    </div>
                ),
            }));

        const options: any[] = [];
        if (projectResults.length > 0) {
            options.push({ label: <span style={{ fontWeight: 600, color: '#77787B', fontSize: 11, textTransform: 'uppercase' as const }}>Projects</span>, options: projectResults });
        }
        if (taskResults.length > 0) {
            options.push({ label: <span style={{ fontWeight: 600, color: '#77787B', fontSize: 11, textTransform: 'uppercase' as const }}>Tasks</span>, options: taskResults });
        }
        if (options.length === 0) {
            options.push({ label: <span style={{ color: '#94A3B8', fontSize: 12 }}>No results found</span>, options: [{ value: '__empty__', label: <span style={{ color: '#94A3B8' }}>Try a different search term</span>, disabled: true }] });
        }
        return options;
    }, [searchValue, recentProjects, allTasksList]);

    const handleSearchSelect = useCallback((value: string) => {
        if (value.startsWith('project-')) {
            const projectId = value.replace('project-', '');
            navigate(`/projects/${projectId}`);
        } else if (value.startsWith('task-')) {
            const parts = value.split('-');
            const projectId = parts[1];
            const taskId = parts.slice(2).join('-');
            navigate(`/projects/${projectId}?taskId=${taskId}`);
        }
        setSearchValue('');
    }, [navigate]);

    return (
        <Layout className="dashboard-layout">
            <Sidebar />

            <Layout className="dashboard-main">
                <Content className="dashboard-content">
                    <div className="dashboard-header-section">
                        <div>
                            <Title level={2} style={{ margin: 0, color: '#000000', fontSize: 48 }}>
                                Dashboard
                            </Title>
                            <Text style={{ color: '#77787B', fontSize: 30 }}>IT Overall</Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <AutoComplete
                                value={searchValue}
                                options={searchOptions}
                                onSelect={handleSearchSelect}
                                onSearch={setSearchValue}
                                style={{ width: 300 }}
                                popupMatchSelectWidth={360}
                            >
                                <Input
                                    prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
                                    placeholder="Search projects & tasks..."
                                    allowClear
                                    size="large"
                                    style={{ borderRadius: 10 }}
                                />
                            </AutoComplete>
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => navigate('/projects')}
                                style={{ background: '#32BCAD', borderColor: '#32BCAD' }}
                                icon={<ArrowRightOutlined />}
                            >
                                View My Projects
                            </Button>
                        </div>
                    </div>

                    <Spin spinning={loading}>
                        {/* Stats Row */}
                        <div className="stats-row" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 180px', minWidth: 180 }}>
                                <StatCardItem
                                    title="Total Projects"
                                    value={stats.totalProjects}
                                    icon={<FolderOutlined />}
                                    iconClass="icon-slate"
                                    onClick={() => navigate('/projects')}
                                />
                            </div>
                            <div style={{ flex: '1 1 180px', minWidth: 180 }}>
                                <StatCardItem
                                    title="Active Projects"
                                    value={stats.activeProjects}
                                    icon={<ProjectOutlined />}
                                    iconClass="icon-blue"
                                    onClick={() => navigate('/projects')}
                                />
                            </div>
                            <div style={{ flex: '1 1 180px', minWidth: 180 }}>
                                <StatCardItem
                                    title="My Pending Tasks"
                                    value={stats.pendingTasks}
                                    icon={<ClockCircleOutlined />}
                                    iconClass="icon-amber"
                                    onClick={() => navigate('/my-tasks')}
                                />
                            </div>
                            <div style={{ flex: '1 1 180px', minWidth: 180 }}>
                                <StatCardItem
                                    title="Team Members"
                                    value={stats.teamMembers}
                                    icon={<TeamOutlined />}
                                    iconClass="icon-emerald"
                                    onClick={() => navigate('/projects')}
                                />
                            </div>
                            <div style={{ flex: '1 1 180px', minWidth: 180 }}>
                                <StatCardItem
                                    title="Completion Rate"
                                    value={stats.completionRate}
                                    suffix="%"
                                    icon={<RocketOutlined />}
                                    iconClass="icon-purple"
                                    description="DONE tasks / total tasks x 100"
                                    onClick={() => navigate('/projects')}
                                />
                            </div>
                        </div>

                        {/* Summary Chart Section */}
                        <Row gutter={[16, 16]} style={{ marginTop: 20, marginBottom: 8 }}>
                            <Col xs={24} md={16}>
                                <Card
                                    variant="borderless"
                                    style={{ borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', height: '100%' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                        <PieChartOutlined style={{ fontSize: 16, color: '#32BCAD' }} />
                                        <Text strong style={{ fontSize: 15, color: '#000000' }}>Project Status Distribution</Text>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {[
                                            { key: 'ACTIVE', label: 'Active', color: '#32BCAD' },
                                            { key: 'DELAY', label: 'Delay', color: '#D94F4F' },
                                            { key: 'COMPLETED', label: 'Completed', color: '#2E7D9B' },
                                            { key: 'HOLD', label: 'Hold', color: '#E8A838' },
                                            { key: 'CANCELLED', label: 'Cancelled', color: '#77787B' },
                                        ].map(s => {
                                            const count = projectStatusCounts[s.key] || 0;
                                            const total = recentProjects.length || 1;
                                            const pct = Math.round((count / total) * 100);
                                            return (
                                                <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <span style={{
                                                        width: 80, fontSize: 13, fontWeight: 500, color: '#475569',
                                                        display: 'flex', alignItems: 'center', gap: 6,
                                                    }}>
                                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                                                        {s.label}
                                                    </span>
                                                    <div style={{ flex: 1 }}>
                                                        <Progress
                                                            percent={pct}
                                                            strokeColor={s.color}
                                                            trailColor="#F1F5F9"
                                                            showInfo={false}
                                                            size="small"
                                                        />
                                                    </div>
                                                    <span style={{ width: 56, textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#000000' }}>
                                                        {count} <span style={{ color: '#94A3B8', fontWeight: 400 }}>({pct}%)</span>
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={24} md={8}>
                                <Card
                                    variant="borderless"
                                    style={{
                                        borderRadius: 12, border: '1px solid #E2E8F0',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <Text strong style={{ fontSize: 15, color: '#000000', display: 'block', marginBottom: 16 }}>
                                            Task Completion
                                        </Text>
                                        <Progress
                                            type="circle"
                                            percent={stats.completionRate}
                                            size={140}
                                            strokeColor={{
                                                '0%': '#2E7D9B',
                                                '100%': '#32BCAD',
                                            }}
                                            trailColor="#F1F5F9"
                                            strokeWidth={10}
                                            format={(pct) => (
                                                <div>
                                                    <div style={{ fontSize: 28, fontWeight: 700, color: '#000000' }}>{pct}%</div>
                                                    <div style={{ fontSize: 11, color: '#94A3B8' }}>Complete</div>
                                                </div>
                                            )}
                                        />
                                        <div style={{ marginTop: 12, fontSize: 12, color: '#77787B' }}>
                                            {stats.completedTasks} of {stats.totalTasks} tasks done
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        <div className="dashboard-sections">
                            {/* Recent Projects */}
                            <div className="section-header">
                                <Title level={4} style={{ color: '#000000', margin: 0 }}>Recent Projects</Title>
                                <button className="view-all-link" onClick={() => navigate('/projects')}>View all</button>
                            </div>
                            <Row gutter={[16, 16]}>
                                {recentProjects.slice(0, 4).map(project => (
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

                            {/* Quick Access Panel */}
                            <div className="section-header" style={{ marginTop: 32 }}>
                                <Title level={4} style={{ color: '#000000', margin: 0 }}>
                                    <ThunderboltOutlined style={{ marginRight: 8, color: '#E8A838' }} />
                                    Quick Access
                                </Title>
                            </div>
                            <div className="quick-access-panel">
                                {/* Active Projects Shortcuts */}
                                {recentProjects
                                    .filter(p => p.status === 'ACTIVE')
                                    .slice(0, 5)
                                    .map(project => (
                                        <div
                                            key={project.id}
                                            className="quick-access-item"
                                            onClick={() => navigate(`/projects/${project.id}`)}
                                        >
                                            <div className="qa-icon" style={{ background: getStatusIconBg(project.status) }}>
                                                <FolderOutlined style={{ color: getStatusIconColor(project.status), fontSize: 14 }} />
                                            </div>
                                            <div className="qa-info">
                                                <span className="qa-name">{project.name}</span>
                                                <span className="qa-meta">{project._count?.tasks || 0} tasks</span>
                                            </div>
                                            <ArrowRightOutlined style={{ color: '#CBD5E1', fontSize: 12 }} />
                                        </div>
                                    ))
                                }
                                {/* My Tasks Summary */}
                                <div
                                    className="quick-access-item qa-highlight"
                                    onClick={() => navigate('/my-tasks')}
                                >
                                    <div className="qa-icon" style={{ background: 'rgba(50,188,173,0.12)' }}>
                                        <CheckCircleOutlined style={{ color: '#32BCAD', fontSize: 14 }} />
                                    </div>
                                    <div className="qa-info">
                                        <span className="qa-name">My Tasks</span>
                                        <span className="qa-meta">
                                            {stats.pendingTasks} pending · {stats.completedTasks} done
                                        </span>
                                    </div>
                                    <ArrowRightOutlined style={{ color: '#CBD5E1', fontSize: 12 }} />
                                </div>
                            </div>

                            {/* My Active Tasks */}
                            <div className="section-header" style={{ marginTop: 32 }}>
                                <Title level={4} style={{ color: '#000000', margin: 0 }}>My Active Tasks</Title>
                                <button className="view-all-link" onClick={() => navigate('/my-tasks')}>View all</button>
                            </div>
                            <Card className="tasks-list-card" variant="borderless">
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
                                                    title={<Text strong style={{ color: '#000000' }}>{task.title}</Text>}
                                                    description={
                                                        <Space split={<span style={{ color: '#CBD5E1' }}>·</span>}>
                                                            <Text style={{ color: '#77787B', fontSize: 13 }}>{task.project?.name}</Text>
                                                            <Text style={{ color: '#77787B', fontSize: 13 }}>
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

                            {/* Team Activity */}
                            <div className="section-header" style={{ marginTop: 32 }}>
                                <Title level={4} style={{ color: '#000000', margin: 0 }}>Team Activity</Title>
                            </div>
                            <div className="activity-feed">
                                {recentActivities.length > 0 ? recentActivities.map((log, index) => {
                                    const targetUrl = log.taskId && log.projectId
                                        ? `/projects/${log.projectId}?taskId=${log.taskId}`
                                        : log.projectId
                                            ? `/projects/${log.projectId}`
                                            : undefined;
                                    return (
                                        <div
                                            key={log.id}
                                            className={`activity-item ${targetUrl ? 'clickable' : ''}`}
                                            onClick={() => targetUrl && navigate(targetUrl)}
                                        >
                                            {index < recentActivities.length - 1 && (
                                                <div className="activity-line" />
                                            )}
                                            <div
                                                className="activity-avatar"
                                                style={{ background: ACTION_COLORS[log.action] || '#77787B' }}
                                                title={log.user?.name || 'Unknown'}
                                            >
                                                {log.user ? getInitials(log.user.name) : <UserOutlined />}
                                            </div>
                                            <div className="activity-content">
                                                <p className="activity-text">
                                                    <span className="activity-user">{log.user?.name || 'Someone'}</span>{' '}
                                                    <span className="activity-action">
                                                        {ACTION_LABELS[log.action] || log.action?.toLowerCase()}
                                                    </span>{' '}
                                                    <span className="activity-entity">
                                                        {log.task?.title || log.project?.name || log.entityType}
                                                    </span>
                                                </p>
                                                <span className="activity-time">{dayjs(log.createdAt).fromNow()}</span>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="empty-state">No recent activities</div>
                                )}
                            </div>

                            {/* Total IT Project (Annual Plan) */}
                            <div className="section-header" style={{ marginTop: 32 }}>
                                <Title level={4} style={{ color: '#000000', margin: 0, fontWeight: 700 }}>Total IT Project</Title>
                                <button className="view-all-link" onClick={() => navigate('/timeline')}>View Annual Plan →</button>
                            </div>
                            <Card
                                className="annual-plan-card"
                                variant="borderless"
                                style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #f0f5ff 0%, #ffffff 100%)' }}
                                onClick={() => navigate('/timeline')}
                            >
                                <Space>
                                    <ClockCircleOutlined style={{ fontSize: 24, color: '#667eea' }} />
                                    <div>
                                        <Text strong>Annual Plan View — Timeline</Text>
                                        <br />
                                        <Text type="secondary" style={{ fontSize: 12 }}>ดูภาพรวมโปรเจกต์ทั้งหมดในรูปแบบ Gantt Chart</Text>
                                    </div>
                                    <ArrowRightOutlined style={{ fontSize: 16, color: '#667eea' }} />
                                </Space>
                            </Card>
                        </div>
                    </Spin>
                </Content>
            </Layout>
        </Layout>
    );
};
