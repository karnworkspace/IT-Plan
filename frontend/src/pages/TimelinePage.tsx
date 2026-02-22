import React, { useState, useEffect, useMemo } from 'react';
import {
    Layout,
    Typography,
    Spin,
    Select,
    Tooltip,
    Progress,
    message,
} from 'antd';
import {
    FieldTimeOutlined,
    CaretRightOutlined,
    CaretDownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { TaskDetailModal } from './TaskDetailModal';
import api from '../services/api';
import './TimelinePage.css';

const { Content } = Layout;
const { Title, Text } = Typography;

// Types
interface TimelineTask {
    id: string;
    title: string;
    status: string;
    priority: string;
    progress: number;
    assignee?: { id: string; name: string };
}

interface TimelineProject {
    id: string;
    name: string;
    projectCode: string | null;
    category: string | null;
    status: string;
    color: string;
    businessOwner: string | null;
    sortOrder: number;
    timeline: Record<string, Record<string, string>> | null;
    progress: number;
    totalTasks: number;
    doneTasks: number;
    owner: { id: string; name: string };
    members: { id: string; name: string; role: string }[];
    tasks: TimelineTask[];
}

// Category labels + colors
const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
    CONSTRUCTION_OPERATION: { label: 'CONSTRUCTION OPERATION SUPPORT', color: '#0F172A' },
    SALES_MARKETING: { label: 'SALES & MARKETING', color: '#1E40AF' },
    CORPORATE: { label: 'CORPORATE', color: '#7C3AED' },
    PRODUCT: { label: 'PRODUCT DEVELOPMENT', color: '#059669' },
    CUSTOMER_SERVICE: { label: 'CUSTOMER SERVICE & AUTOMATION', color: '#DC2626' },
};

// Month labels
const MONTH_FULL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const QUARTERS = [
    { label: 'Q1', months: [0, 1, 2] },
    { label: 'Q2', months: [3, 4, 5] },
    { label: 'Q3', months: [6, 7, 8] },
    { label: 'Q4', months: [9, 10, 11] },
];

// Get bar color for a month cell — uses timeline JSON only (not project.status)
const getMonthBarColor = (project: TimelineProject, monthIndex: number): string | null => {
    const year = '2026';
    const monthKey = String(monthIndex + 1);
    const timeline = project.timeline as Record<string, Record<string, string>> | null;

    if (!timeline || !timeline[year] || !timeline[year][monthKey]) return null;

    const planType = timeline[year][monthKey];
    if (planType === 'actual') return '#10B981';    // Green — completed
    if (planType === 'delayed') return '#F59E0B';   // Orange — delayed
    return '#EF4444';                                // Red — planned (default)
};

// Current month indicator
const currentMonth = new Date().getMonth(); // 0-indexed

export const TimelinePage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<TimelineProject[]>([]);
    const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
    const [filterCategory, setFilterCategory] = useState<string>('ALL');
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    useEffect(() => {
        loadTimeline();
    }, []);

    const loadTimeline = async () => {
        try {
            setLoading(true);
            const response = await api.get('/projects/timeline');
            setProjects(response.data.data.projects || []);
        } catch (error) {
            message.error('Failed to load timeline data');
        } finally {
            setLoading(false);
        }
    };

    // Group projects by category
    const groupedProjects = useMemo(() => {
        const groups: Record<string, TimelineProject[]> = {};
        const filtered = filterCategory === 'ALL'
            ? projects
            : projects.filter(p => p.category === filterCategory);

        filtered.forEach(p => {
            const cat = p.category || 'OTHER';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(p);
        });

        const order = Object.keys(CATEGORY_CONFIG);
        const sorted: [string, TimelineProject[]][] = [];
        order.forEach(cat => {
            if (groups[cat]) sorted.push([cat, groups[cat]]);
        });
        Object.keys(groups).forEach(cat => {
            if (!order.includes(cat)) sorted.push([cat, groups[cat]]);
        });

        return sorted;
    }, [projects, filterCategory]);

    // Stats
    const totalProjects = projects.length;
    const totalTasks = projects.reduce((sum, p) => sum + p.totalTasks, 0);
    const avgProgress = totalProjects > 0
        ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects)
        : 0;

    const toggleExpand = (projectId: string) => {
        setExpandedProjects(prev => {
            const next = new Set(prev);
            if (next.has(projectId)) next.delete(projectId);
            else next.add(projectId);
            return next;
        });
    };

    // Running project number
    let projectNumber = 0;

    return (
        <Layout className="timeline-layout">
            <Sidebar />
            <Layout className="timeline-main">
                {/* Header */}
                <div className="timeline-page-header">
                    <div className="timeline-header-top">
                        <div>
                            <Title level={2} style={{ color: '#0F172A', margin: 0, fontSize: 48 }}>
                                <FieldTimeOutlined style={{ marginRight: 10 }} />
                                IT Project Tracking 2026
                            </Title>
                            <Text type="secondary" style={{ fontSize: 30 }}>
                                Annual Plan View — {totalProjects} projects, {totalTasks} tasks, avg {avgProgress}% progress
                            </Text>
                        </div>
                        <div className="timeline-header-filters">
                            <div className="shared-legend">
                                <div className="shared-legend-item"><div className="shared-legend-bar" style={{ backgroundColor: '#EF4444' }} /><span>Planned</span></div>
                                <div className="shared-legend-item"><div className="shared-legend-bar" style={{ backgroundColor: '#10B981' }} /><span>Completed</span></div>
                                <div className="shared-legend-item"><div className="shared-legend-bar" style={{ backgroundColor: '#F59E0B' }} /><span>Delayed</span></div>
                                <div className="shared-legend-item"><div className="shared-legend-current" /><span>Current</span></div>
                            </div>
                            <Select
                                value={filterCategory}
                                onChange={setFilterCategory}
                                style={{ width: 260 }}
                                size="middle"
                            >
                                <Select.Option value="ALL">All Categories</Select.Option>
                                {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                                    <Select.Option key={key} value={key}>{cfg.label}</Select.Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>

                <Content className="timeline-content">
                    <Spin spinning={loading}>
                        <div className="annual-plan-wrapper">
                            <div className="annual-plan-table">
                                {/* Table Header */}
                                <div className="ap-header-row">
                                    <div className="ap-col-no">NO</div>
                                    <div className="ap-col-code">PROJECT ID</div>
                                    <div className="ap-col-name">IT PROJECT — 2026</div>
                                    <div className="ap-col-team">IT TEAM</div>
                                    <div className="ap-col-progress">% PROGRESS</div>
                                    <div className="ap-col-timeline">
                                        <div className="ap-quarters">
                                            {QUARTERS.map(q => (
                                                <div key={q.label} className="ap-quarter">
                                                    <div className="ap-quarter-label">{q.label}</div>
                                                    <div className="ap-months">
                                                        {q.months.map(m => (
                                                            <div
                                                                key={m}
                                                                className={`ap-month-header ${m === currentMonth ? 'ap-current-month' : ''}`}
                                                            >
                                                                {MONTH_FULL[m]}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Data Rows */}
                                {groupedProjects.map(([category, catProjects]) => (
                                    <React.Fragment key={category}>
                                        {/* Category Header */}
                                        <div className="ap-category-row" style={{ borderLeftColor: CATEGORY_CONFIG[category]?.color || '#64748B' }}>
                                            <div className="ap-category-label">
                                                {CATEGORY_CONFIG[category]?.label || category}
                                            </div>
                                            <div className="ap-category-count">
                                                {catProjects.length} projects
                                            </div>
                                        </div>

                                        {/* Project Rows */}
                                        {catProjects.map(project => {
                                            projectNumber++;
                                            const isExpanded = expandedProjects.has(project.id);
                                            const hasTasks = project.tasks.length > 0;

                                            return (
                                                <React.Fragment key={project.id}>
                                                    <div
                                                        className={`ap-project-row ${isExpanded ? 'ap-expanded' : ''}`}
                                                        onClick={() => hasTasks && toggleExpand(project.id)}
                                                        style={{ cursor: hasTasks ? 'pointer' : 'default' }}
                                                    >
                                                        <div className="ap-col-no ap-cell">
                                                            <span className="ap-no-badge">{projectNumber}</span>
                                                        </div>
                                                        <div className="ap-col-code ap-cell">
                                                            <span className="ap-code">{project.projectCode || '-'}</span>
                                                        </div>
                                                        <div className="ap-col-name ap-cell ap-project-name-cell">
                                                            {hasTasks && (
                                                                <span className="ap-expand-icon">
                                                                    {isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
                                                                </span>
                                                            )}
                                                            <Tooltip title={project.name} placement="topLeft">
                                                                <span
                                                                    className="ap-project-name ap-clickable"
                                                                    onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}
                                                                >
                                                                    {project.name}
                                                                </span>
                                                            </Tooltip>
                                                            <span className={`ap-status-dot ap-status-${project.status.toLowerCase()}`} />
                                                        </div>
                                                        <div className="ap-col-team ap-cell">
                                                            <span className="ap-team-text">
                                                                {project.members.slice(0, 3).map(m => {
                                                                    const parts = m.name.split(' ');
                                                                    return parts[0].length > 8 ? parts[0].substring(0, 8) : parts[0];
                                                                }).join(', ')}
                                                                {project.members.length > 3 && ` +${project.members.length - 3}`}
                                                            </span>
                                                        </div>
                                                        <div className="ap-col-progress ap-cell">
                                                            <div className="ap-progress-wrapper">
                                                                <Progress
                                                                    percent={project.progress}
                                                                    size="small"
                                                                    strokeColor={project.progress >= 100 ? '#10B981' : project.progress > 0 ? '#3B82F6' : '#E2E8F0'}
                                                                    railColor="#F1F5F9"
                                                                    format={p => <span className="ap-progress-text">{p}%</span>}
                                                                />
                                                                <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 2, display: 'block' }}>
                                                                    {project.doneTasks}/{project.totalTasks} done
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ap-col-timeline ap-cell">
                                                            <div className="ap-month-bars">
                                                                {Array.from({ length: 12 }, (_, i) => {
                                                                    const color = getMonthBarColor(project, i);
                                                                    return (
                                                                        <Tooltip
                                                                            key={i}
                                                                            title={`${MONTH_FULL[i]} 2026${color ? ' — Planned' : ''}`}
                                                                        >
                                                                            <div className={`ap-month-cell ${i === currentMonth ? 'ap-current-month-cell' : ''}`}>
                                                                                {color && (
                                                                                    <div
                                                                                        className="ap-month-bar"
                                                                                        style={{ backgroundColor: color }}
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        </Tooltip>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Task Rows (expanded) */}
                                                    {isExpanded && project.tasks.map(task => (
                                                        <div key={task.id} className="ap-task-row">
                                                            <div className="ap-col-no ap-cell" />
                                                            <div className="ap-col-code ap-cell" />
                                                            <div className="ap-col-name ap-cell ap-task-name-cell">
                                                                <Tooltip title={task.title} placement="topLeft">
                                                                    <span
                                                                        className="ap-task-name ap-clickable"
                                                                        onClick={() => { setSelectedTaskId(task.id); setDetailModalVisible(true); }}
                                                                    >
                                                                        {task.title}
                                                                    </span>
                                                                </Tooltip>
                                                                <span className={`ap-task-status ap-task-status-${task.status.toLowerCase()}`}>
                                                                    {task.status.replace('_', ' ')}
                                                                </span>
                                                            </div>
                                                            <div className="ap-col-team ap-cell">
                                                                <span className="ap-task-assignee">
                                                                    {task.assignee?.name || '-'}
                                                                </span>
                                                            </div>
                                                            <div className="ap-col-progress ap-cell">
                                                                <Progress
                                                                    percent={task.progress}
                                                                    size="small"
                                                                    strokeColor={task.status === 'DONE' ? '#10B981' : '#3B82F6'}
                                                                    railColor="#F1F5F9"
                                                                    format={p => <span className="ap-progress-text">{p}%</span>}
                                                                />
                                                            </div>
                                                            <div className="ap-col-timeline ap-cell">
                                                                <div className="ap-month-bars ap-task-bars">
                                                                    {Array.from({ length: 12 }, (_, i) => {
                                                                        const color = getMonthBarColor(project, i);
                                                                        return (
                                                                            <div key={i} className={`ap-month-cell ${i === currentMonth ? 'ap-current-month-cell' : ''}`}>
                                                                                {color && (
                                                                                    <div
                                                                                        className="ap-month-bar ap-task-month-bar"
                                                                                        style={{ backgroundColor: `${color}50` }}
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </React.Fragment>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}

                            </div>
                        </div>
                    </Spin>
                </Content>
            </Layout>

            <TaskDetailModal
                visible={detailModalVisible}
                taskId={selectedTaskId}
                onClose={() => { setDetailModalVisible(false); setSelectedTaskId(null); }}
                onUpdate={loadTimeline}
            />
        </Layout>
    );
};
