import React, { useState, useEffect, useMemo } from 'react';
import {
    Layout,
    Typography,
    Spin,
    Select,
    Tooltip,
    Progress,
    Tag,
    message,
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    Row,
    Col,
} from 'antd';
import dayjs from 'dayjs';
import {
    FieldTimeOutlined,
    CaretRightOutlined,
    CaretDownOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { TaskDetailModal } from './TaskDetailModal';
import api from '../../services/api';
import { tagService } from '../../services/tagService';
import { projectService } from '../../services/projectService';
import { useAuthStore } from '../../store/authStore';
import { PROJECT_COLORS } from '../../constants';
import type { Tag as TagType } from '../../types';
import './TimelinePage.css';

const { Content } = Layout;
const { Title } = Typography;

// Types
interface TimelineTask {
    id: string;
    title: string;
    status: string;
    priority: string;
    progress: number;
    startDate?: string | null;
    dueDate?: string | null;
    assignee?: { id: string; name: string };
    taskTags?: { id: string; tag: { id: string; name: string; color: string } }[];
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
    startDate: string | null;
    endDate: string | null;
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
    INFRASTRUCTURE_NETWORK: { label: 'INFRASTRUCTURE & NETWORK', color: '#6366F1' },
};

// Month labels
const MONTH_FULL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const QUARTERS = [
    { label: 'Q1', months: [0, 1, 2] },
    { label: 'Q2', months: [3, 4, 5] },
    { label: 'Q3', months: [6, 7, 8] },
    { label: 'Q4', months: [9, 10, 11] },
];

// Helper: get month index (0-based) from date string, only if year is 2026
const getMonthOf = (dateStr: string | null | undefined): number | null => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (d.getFullYear() !== 2026) return null;
    return d.getMonth();
};

// Status color map for timeline bars
const STATUS_BAR_COLORS: Record<string, string> = {
    PLAN: '#89D0C8',       // SENA Light Green
    PENDING: '#89D0C8',    // SENA Light Green
    ACTIVE: '#32BCAD',     // SENA Green
    DELAY: '#D94F4F',      // Status Red
    COMPLETED: '#2E7D9B',  // Status Blue
    HOLD: '#E8A838',       // Status Amber
    CANCELLED: '#77787B',  // SENA Gray
};

// Get bar color for PROJECT row — only show bars within startDate..endDate
const getMonthBarColor = (project: TimelineProject, monthIndex: number): string | null => {
    // Clamp to project date range
    const startMonth = getMonthOf(project.startDate) ?? 0;
    const endMonth = getMonthOf(project.endDate);
    if (endMonth !== null && monthIndex > endMonth) return null;
    if (monthIndex < startMonth) return null;

    // If 100% done → completed color (น้ำเงิน)
    if (project.progress === 100) return STATUS_BAR_COLORS.COMPLETED;

    // Fall back to timeline JSON
    const year = '2026';
    const monthKey = String(monthIndex + 1);
    const timeline = project.timeline as Record<string, Record<string, string>> | null;
    const planType = timeline?.[year]?.[monthKey];

    if (!planType) return null; // ไม่มี data → ไม่แสดงแถบ

    // ถ้ามีค่าชัดเจน (actual/delayed) → ใช้ตามนั้น
    if (planType === 'actual') return STATUS_BAR_COLORS.ACTIVE;
    if (planType === 'delayed') return STATUS_BAR_COLORS.DELAY;

    // "planned" → แยกตามช่วงเวลา
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-based (0=Jan)
    const currentYear = now.getFullYear();
    const isCurrentYear = String(currentYear) === year;

    if (isCurrentYear && monthIndex < currentMonth) {
        // เดือนที่ผ่านมาแล้ว → ใช้สี project status
        return STATUS_BAR_COLORS[project.status] || STATUS_BAR_COLORS.ACTIVE;
    } else if (isCurrentYear && monthIndex === currentMonth) {
        // เดือนปัจจุบัน → ใช้สี project status
        return STATUS_BAR_COLORS[project.status] || STATUS_BAR_COLORS.ACTIVE;
    } else {
        // เดือนอนาคต → ฟ้า (แผน)
        return STATUS_BAR_COLORS.PLAN;
    }
};

// Get bar color for TASK row — only show bars within task's date range
const getTaskBarColor = (project: TimelineProject, task: TimelineTask, monthIndex: number): string | null => {
    const taskStart = getMonthOf(task.startDate) ?? getMonthOf(project.startDate) ?? 0;
    const taskEnd = getMonthOf(task.dueDate) ?? getMonthOf(project.endDate);
    if (taskEnd !== null && monthIndex > taskEnd) return null;
    if (monthIndex < taskStart) return null;

    // Map task status to colors
    if (task.status === 'DONE') return STATUS_BAR_COLORS.COMPLETED;
    if (task.status === 'CANCELLED') return STATUS_BAR_COLORS.CANCELLED;
    if (task.status === 'IN_PROGRESS') return STATUS_BAR_COLORS.ACTIVE;
    if (task.status === 'BLOCKED') return STATUS_BAR_COLORS.DELAY;
    if (task.status === 'HOLD') return STATUS_BAR_COLORS.HOLD;

    return STATUS_BAR_COLORS.PLAN; // TODO / planned → ฟ้า
};

// Current month indicator
const currentMonth = new Date().getMonth(); // 0-indexed

export const TimelinePage: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = useAuthStore(s => s.user);
    const canCreateProject = currentUser?.role === 'ADMIN';

    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<TimelineProject[]>([]);
    const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
    const [filterCategory, setFilterCategory] = useState<string>('ALL');
    const [filterTags, setFilterTags] = useState<string[]>([]);
    const [allTags, setAllTags] = useState<TagType[]>([]);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createForm] = Form.useForm();

    useEffect(() => { document.title = 'Annual Plan — IT Project System'; }, []);

    useEffect(() => {
        loadTimeline();
        tagService.getAllTags().then(setAllTags).catch(() => {});
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
        let filtered = filterCategory === 'ALL'
            ? projects
            : projects.filter(p => p.category === filterCategory);

        // Tag filter: only show projects that have tasks matching selected tags
        if (filterTags.length > 0) {
            filtered = filtered.map(p => ({
                ...p,
                tasks: p.tasks.filter(t =>
                    t.taskTags?.some(tt => filterTags.includes(tt.tag.id))
                ),
            })).filter(p => p.tasks.length > 0);
        }

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
    }, [projects, filterCategory, filterTags]);

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

    const openCreateModal = () => {
        createForm.resetFields();
        createForm.setFieldsValue({
            status: 'ACTIVE',
            color: '#32BCAD',
            category: filterCategory !== 'ALL' ? filterCategory : undefined,
            startDate: dayjs('2026-01-01'),
            endDate: dayjs('2026-12-31'),
        });
        setCreateModalVisible(true);
    };

    const handleCreateProject = async () => {
        try {
            const values = await createForm.validateFields();
            setCreating(true);
            await projectService.createProject({
                name: values.name.trim(),
                projectCode: values.projectCode?.trim() || undefined,
                category: values.category,
                businessOwner: values.businessOwner?.trim() || undefined,
                status: values.status,
                color: values.color,
                projectType: 'PROJECT',
                startDate: values.startDate ? values.startDate.toISOString() : undefined,
                endDate: values.endDate ? values.endDate.toISOString() : undefined,
                description: values.description?.trim() || undefined,
            });
            message.success('สร้าง Project สำเร็จ');
            setCreateModalVisible(false);
            createForm.resetFields();
            await loadTimeline();
        } catch (err: any) {
            if (err?.errorFields) return; // validation error — Antd shows inline
            const msg = err?.response?.data?.error || 'สร้าง Project ไม่สำเร็จ';
            message.error(msg);
        } finally {
            setCreating(false);
        }
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
                            <Title level={3} className="timeline-title">
                                <FieldTimeOutlined style={{ marginRight: 8 }} />
                                IT Project Tracking 2026
                            </Title>
                            <div className="timeline-stats">
                                <div className="timeline-stat-badge">
                                    <span className="timeline-stat-number">{totalProjects}</span>
                                    <span className="timeline-stat-label">Projects</span>
                                </div>
                                <div className="timeline-stat-badge">
                                    <span className="timeline-stat-number">{totalTasks}</span>
                                    <span className="timeline-stat-label">Tasks</span>
                                </div>
                                <div className="timeline-stat-badge stat-accent">
                                    <span className="timeline-stat-number">{avgProgress}%</span>
                                    <span className="timeline-stat-label">Avg Progress</span>
                                </div>
                            </div>
                        </div>
                        <div className="timeline-header-filters">
                            <div className="shared-legend">
                                <div className="shared-legend-item"><div className="shared-legend-bar" style={{ backgroundColor: '#89D0C8' }} /><span>Plan</span></div>
                                <div className="shared-legend-item"><div className="shared-legend-bar" style={{ backgroundColor: '#32BCAD' }} /><span>Active</span></div>
                                <div className="shared-legend-item"><div className="shared-legend-bar" style={{ backgroundColor: '#D94F4F' }} /><span>Delay</span></div>
                                <div className="shared-legend-item"><div className="shared-legend-bar" style={{ backgroundColor: '#2E7D9B' }} /><span>Complete</span></div>
                                <div className="shared-legend-item"><div className="shared-legend-bar" style={{ backgroundColor: '#E8A838' }} /><span>Hold</span></div>
                                <div className="shared-legend-item"><div className="shared-legend-bar" style={{ backgroundColor: '#77787B' }} /><span>Cancel</span></div>
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
                            {allTags.length > 0 && (
                                <Select
                                    mode="multiple"
                                    value={filterTags}
                                    onChange={setFilterTags}
                                    placeholder="Filter by Tags"
                                    allowClear
                                    style={{ minWidth: 200 }}
                                    size="middle"
                                    maxTagCount={2}
                                >
                                    {allTags.map(tag => (
                                        <Select.Option key={tag.id} value={tag.id}>
                                            <Tag color={tag.color} style={{ margin: 0 }}>{tag.name}</Tag>
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                            {canCreateProject && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={openCreateModal}
                                    style={{ background: '#32BCAD', borderColor: '#32BCAD' }}
                                >
                                    เพิ่ม Project
                                </Button>
                            )}
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
                                        <div className="ap-category-row" style={{ borderLeftColor: CATEGORY_CONFIG[category]?.color || '#77787B' }}>
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
                                                            <span className={`ap-no-badge badge-${project.status.toLowerCase()}`}>{projectNumber}</span>
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
                                                            <Tooltip title={project.status}>
                                                                <span className={`ap-status-dot ap-status-${project.status.toLowerCase()}`} />
                                                            </Tooltip>
                                                        </div>
                                                        <div className="ap-col-team ap-cell">
                                                            <Tooltip title={project.members.map(m => m.name).join(', ')} placement="topLeft">
                                                                <span className="ap-team-text">
                                                                    {project.members.slice(0, 3).map(m => {
                                                                        const parts = m.name.split(' ');
                                                                        return parts[0].length > 8 ? parts[0].substring(0, 8) : parts[0];
                                                                    }).join(', ')}
                                                                    {project.members.length > 3 && ` +${project.members.length - 3}`}
                                                                </span>
                                                            </Tooltip>
                                                        </div>
                                                        <div className="ap-col-progress ap-cell">
                                                            <div className="ap-progress-wrapper">
                                                                <Progress
                                                                    percent={project.progress}
                                                                    size="small"
                                                                    strokeColor={project.progress >= 100 ? '#2E7D9B' : project.progress > 0 ? '#32BCAD' : '#E2E8F0'}
                                                                    railColor="#F1F5F9"
                                                                    format={p => <span className={`ap-progress-text ${p === 0 ? 'ap-progress-zero' : ''}`}>{p}%</span>}
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
                                                                                        className={`ap-month-bar ${i > currentMonth ? 'future-bar' : ''}`}
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
                                                                <span
                                                                    className="ap-task-name ap-clickable"
                                                                    onClick={() => { setSelectedTaskId(task.id); setDetailModalVisible(true); }}
                                                                >
                                                                    {task.title}
                                                                </span>
                                                                <span className={`ap-task-status ap-task-status-${task.status.toLowerCase()}`}>
                                                                    {task.status.replace('_', ' ')}
                                                                </span>
                                                                {task.taskTags?.map(tt => (
                                                                    <Tag
                                                                        key={tt.id}
                                                                        color={tt.tag.color}
                                                                        style={{ fontSize: 10, lineHeight: '16px', padding: '0 4px', margin: 0, cursor: 'pointer' }}
                                                                        onClick={(e) => { e.stopPropagation(); navigate(`/tags/${tt.tag.id}`); }}
                                                                    >
                                                                        {tt.tag.name}
                                                                    </Tag>
                                                                ))}
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
                                                                    strokeColor={task.status === 'DONE' ? '#32BCAD' : '#32BCAD'}
                                                                    railColor="#F1F5F9"
                                                                    format={p => <span className="ap-progress-text">{p}%</span>}
                                                                />
                                                            </div>
                                                            <div className="ap-col-timeline ap-cell">
                                                                <div className="ap-month-bars ap-task-bars">
                                                                    {Array.from({ length: 12 }, (_, i) => {
                                                                        const color = getTaskBarColor(project, task, i);
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

            <Modal
                title={<span><PlusOutlined style={{ marginRight: 8 }} />เพิ่ม Project ใหม่</span>}
                open={createModalVisible}
                onOk={handleCreateProject}
                onCancel={() => setCreateModalVisible(false)}
                okText="สร้าง Project"
                cancelText="ยกเลิก"
                confirmLoading={creating}
                width={640}
            >
                <Form form={createForm} layout="vertical" size="middle">
                    <Form.Item
                        name="name"
                        label="ชื่อ Project"
                        rules={[
                            { required: true, message: 'กรุณากรอกชื่อ Project' },
                            { max: 100, message: 'ชื่อ Project ต้องไม่เกิน 100 ตัวอักษร' },
                        ]}
                    >
                        <Input placeholder="เช่น SENA SiteMaps (Masterplan) 2026" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="projectCode"
                                label="Project ID"
                                tooltip="รหัสตามรูปแบบ เช่น PP26000-XX-00"
                            >
                                <Input placeholder="PP26000-XX-00" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="category"
                                label="หมวดหมู่"
                                rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่' }]}
                            >
                                <Select placeholder="เลือกหมวดหมู่">
                                    {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                                        <Select.Option key={key} value={key}>{cfg.label}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="สถานะ"
                                rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]}
                            >
                                <Select>
                                    <Select.Option value="ACTIVE">Active</Select.Option>
                                    <Select.Option value="DELAY">Delay</Select.Option>
                                    <Select.Option value="COMPLETED">Completed</Select.Option>
                                    <Select.Option value="HOLD">Hold</Select.Option>
                                    <Select.Option value="CANCELLED">Cancelled</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="businessOwner" label="Business Owner">
                                <Input placeholder="เช่น ฝ่ายขาย / IT" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="startDate" label="วันที่เริ่มต้น">
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="endDate" label="วันที่สิ้นสุด">
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="color"
                        label="สีของ Project"
                        rules={[{ required: true, message: 'กรุณาเลือกสี' }]}
                    >
                        <Select>
                            {PROJECT_COLORS.map(c => (
                                <Select.Option key={c.value} value={c.value}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 3, backgroundColor: c.value }} />
                                        {c.label}
                                    </span>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="description" label="รายละเอียด (Optional)">
                        <Input.TextArea rows={3} maxLength={500} showCount placeholder="คำอธิบาย Project" />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};
