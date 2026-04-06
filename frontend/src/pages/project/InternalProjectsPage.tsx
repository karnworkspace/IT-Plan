import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Layout,
    Card,
    Row,
    Col,
    Typography,
    Tag,
    Spin,
    Modal,
    Form,
    Input,
    message,
    Checkbox,
    Table,
    Button,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {
    FolderOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    PauseCircleOutlined,
    ProjectOutlined,
    AppstoreOutlined,
    BarsOutlined,
    FileTextOutlined,
    ExperimentOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { Sidebar } from '../../components/layout/Sidebar';
import { projectService } from '../../services/projectService';
import { useCountUp } from '../../hooks/useCountUp';
import { PROJECT_STATUS_GRADIENT, PROJECT_STATUS_LABELS } from '../../constants';
import type { Project, ProjectStatus } from '../../types';
import './MyProjectsPage.css';
import './ProjectsPage.css';

const { Content } = Layout;
const { Title, Text } = Typography;

// --- Stat Card ---
const StatCardItem = ({ title, value, icon, iconClass, borderClass }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconClass: string;
    borderClass?: string;
}) => {
    const animatedValue = useCountUp(value, 1000);
    return (
        <Card className={`stat-card ${borderClass || ''}`} variant="borderless">
            <div className="stat-card-inner">
                <div>
                    <div className="stat-label">{title}</div>
                    <div className="stat-value">{animatedValue}</div>
                </div>
                <div className={`stat-icon-box ${iconClass}`}>
                    {icon}
                </div>
            </div>
        </Card>
    );
};

// --- Status filter options ---
const STATUS_OPTIONS: { value: ProjectStatus; label: string; color: string }[] = [
    { value: 'ACTIVE', label: 'Active', color: '#32BCAD' },
    { value: 'DELAY', label: 'Delay', color: '#D94F4F' },
    { value: 'COMPLETED', label: 'Completed', color: '#32BCAD' },
    { value: 'HOLD', label: 'Hold', color: '#E8A838' },
    { value: 'CANCELLED', label: 'Cancelled', color: '#77787B' },
];

export const InternalProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();
    const [viewMode, setViewMode] = useState<'card' | 'list'>(() => {
        return (localStorage.getItem('internalProjectsViewMode') as 'card' | 'list') || 'card';
    });

    // --- Fetch INTERNAL projects ---
    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await projectService.getMyProjects({ projectType: 'INTERNAL' });
            setProjects(data.projects || data || []);
        } catch (err) {
            console.error('Failed to fetch internal projects:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    // --- Create internal project ---
    const handleCreate = async () => {
        try {
            setSubmitting(true);
            const values = await form.validateFields();
            await projectService.createProject({ ...values, projectType: 'INTERNAL' });
            message.success('สร้าง Internal Project สำเร็จ');
            setIsModalVisible(false);
            form.resetFields();
            await fetchProjects();
        } catch (error) {
            message.error('ไม่สามารถสร้าง Internal Project ได้');
        } finally {
            setSubmitting(false);
        }
    };

    // --- Filtered projects ---
    const filteredProjects = useMemo(() => {
        if (statusFilter.length === 0) return projects;
        return projects.filter(p => statusFilter.includes(p.status));
    }, [projects, statusFilter]);

    // --- Stat counts ---
    const stats = useMemo(() => ({
        total: projects.length,
        active: projects.filter(p => p.status === 'ACTIVE').length,
        completed: projects.filter(p => p.status === 'COMPLETED').length,
        hold: projects.filter(p => p.status === 'HOLD').length,
    }), [projects]);

    // --- View mode toggle ---
    const handleViewChange = (mode: 'card' | 'list') => {
        setViewMode(mode);
        localStorage.setItem('internalProjectsViewMode', mode);
    };

    // --- Table columns for list view ---
    const columns: ColumnsType<Project> = [
        {
            title: 'Project Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: Project) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                        className="project-list-status-bar"
                        style={{ backgroundColor: PROJECT_STATUS_GRADIENT[record.status]?.accentColor || '#77787B' }}
                    />
                    <div>
                        <Text strong>{name}</Text>
                        {record.description && (
                            <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {record.description.length > 60
                                        ? `${record.description.slice(0, 60)}...`
                                        : record.description}
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => {
                const gradient = PROJECT_STATUS_GRADIENT[status];
                return (
                    <Tag
                        color={gradient?.accentColor || '#77787B'}
                        style={{ borderRadius: 6, fontWeight: 500 }}
                    >
                        {PROJECT_STATUS_LABELS[status] || status}
                    </Tag>
                );
            },
        },
        {
            title: 'Tasks',
            key: 'tasks',
            width: 80,
            align: 'center' as const,
            render: (_: unknown, record: Project) => (
                <Text type="secondary">{record._count?.tasks ?? 0}</Text>
            ),
        },
        {
            title: 'Members',
            key: 'members',
            width: 80,
            align: 'center' as const,
            render: (_: unknown, record: Project) => (
                <Text type="secondary">{record._count?.members ?? 0}</Text>
            ),
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            width: 120,
            render: (date: string) => date ? dayjs(date).format('DD MMM YYYY') : '-',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            width: 120,
            render: (date: string) => date ? dayjs(date).format('DD MMM YYYY') : '-',
        },
    ];

    return (
        <Layout className="projects-layout">
            <Sidebar />
            <Layout className="projects-main-layout">
                <Content>
                    {/* Header */}
                    <div className="projects-page-header">
                        <div className="header-content">
                            <div className="header-title-section">
                                <Title level={3} className="page-title">
                                    <ExperimentOutlined /> Internal Projects
                                </Title>
                                <Text className="page-subtitle">
                                    งานภายในที่ได้รับมอบหมายอื่นๆ และงาน Support ผู้ใช้งานระบบ IT SENA Development
                                </Text>
                            </div>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                className="create-btn"
                                onClick={() => setIsModalVisible(true)}
                            >
                                New Internal Project
                            </Button>
                        </div>

                        {/* Stat Cards */}
                        <Row gutter={[16, 16]}>
                            <Col xs={12} sm={6}>
                                <StatCardItem
                                    title="Total"
                                    value={stats.total}
                                    icon={<ProjectOutlined />}
                                    iconClass="stat-icon-total"
                                    borderClass="stat-border-gray"
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <StatCardItem
                                    title="Active"
                                    value={stats.active}
                                    icon={<FolderOutlined />}
                                    iconClass="stat-icon-active"
                                    borderClass="stat-border-green"
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <StatCardItem
                                    title="Completed"
                                    value={stats.completed}
                                    icon={<CheckCircleOutlined />}
                                    iconClass="stat-icon-completed"
                                    borderClass="stat-border-blue"
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <StatCardItem
                                    title="Hold"
                                    value={stats.hold}
                                    icon={<PauseCircleOutlined />}
                                    iconClass="stat-icon-hold"
                                    borderClass="stat-border-amber"
                                />
                            </Col>
                        </Row>
                    </div>

                    {/* Filter & View Toggle */}
                    <div className="projects-content">
                        <div className="filter-card" style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                                <div className="my-projects-status-filter">
                                    <Text strong style={{ marginRight: 12, color: '#475569' }}>
                                        Project Status :
                                    </Text>
                                    <Checkbox.Group
                                        value={statusFilter}
                                        onChange={(values) => setStatusFilter(values as string[])}
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <Checkbox key={opt.value} value={opt.value}>
                                                <span style={{ color: opt.color, fontWeight: 500 }}>
                                                    {opt.label}
                                                </span>
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                </div>
                                <Button.Group>
                                    <Button
                                        icon={<AppstoreOutlined />}
                                        type={viewMode === 'card' ? 'primary' : 'default'}
                                        onClick={() => handleViewChange('card')}
                                    >
                                        Card
                                    </Button>
                                    <Button
                                        icon={<BarsOutlined />}
                                        type={viewMode === 'list' ? 'primary' : 'default'}
                                        onClick={() => handleViewChange('list')}
                                    >
                                        List
                                    </Button>
                                </Button.Group>
                            </div>
                        </div>

                        {/* Loading */}
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: 80 }}>
                                <Spin size="large" />
                            </div>
                        ) : filteredProjects.length === 0 ? (
                            /* Empty State */
                            <div className="empty-state">
                                <ExperimentOutlined style={{ fontSize: 48, color: '#94A3B8', marginBottom: 16 }} />
                                <Title level={4} style={{ color: '#77787B' }}>No internal projects</Title>
                                <Text type="secondary">
                                    {statusFilter.length > 0
                                        ? 'Try changing the status filter'
                                        : 'ยังไม่มีงานภายในที่ได้รับมอบหมาย'}
                                </Text>
                            </div>
                        ) : viewMode === 'card' ? (
                            /* Card View */
                            <Row gutter={[16, 16]}>
                                {filteredProjects.map((project) => {
                                    const gradient = PROJECT_STATUS_GRADIENT[project.status];
                                    const accentColor = gradient?.accentColor || '#77787B';
                                    return (
                                        <Col key={project.id} xs={24} sm={12} lg={8} xl={6}>
                                            <div
                                                className="project-card-v2"
                                                style={{ borderLeft: `3px solid ${accentColor}` }}
                                                onClick={() => navigate(`/projects/${project.id}`)}
                                            >
                                                <div className="card-header">
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div className="project-card-title">{project.name}</div>
                                                        <div className="project-card-id">
                                                            {project.description
                                                                ? project.description.length > 50
                                                                    ? `${project.description.slice(0, 50)}...`
                                                                    : project.description
                                                                : 'Project ID: ' + (project.projectCode || '-')}
                                                        </div>
                                                    </div>
                                                    <Tag
                                                        color={accentColor}
                                                        style={{ borderRadius: 6, fontWeight: 500, flexShrink: 0 }}
                                                    >
                                                        {PROJECT_STATUS_LABELS[project.status] || project.status}
                                                    </Tag>
                                                </div>

                                                <div className="project-card-footer-v2">
                                                    <FileTextOutlined style={{ color: '#94A3B8', fontSize: 13 }} />
                                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                                        {project._count?.tasks ?? 0} tasks
                                                    </Text>
                                                    <span style={{ margin: '0 4px', color: '#E2E8F0' }}>|</span>
                                                    <TeamOutlined style={{ color: '#94A3B8', fontSize: 13 }} />
                                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                                        {project._count?.members ?? 0} members
                                                    </Text>
                                                </div>
                                            </div>
                                        </Col>
                                    );
                                })}
                            </Row>
                        ) : (
                            /* List View */
                            <Card
                                variant="borderless"
                                style={{ borderRadius: 12, border: '1px solid #E2E8F0' }}
                                styles={{ body: { padding: 0 } }}
                            >
                                <Table
                                    dataSource={filteredProjects}
                                    columns={columns}
                                    rowKey="id"
                                    pagination={false}
                                    onRow={(record) => ({
                                        onClick: () => navigate(`/projects/${record.id}`),
                                        style: { cursor: 'pointer' },
                                    })}
                                    size="middle"
                                />
                            </Card>
                        )}
                    </div>
                </Content>
            </Layout>

            {/* Create Internal Project Modal */}
            <Modal
                title={<span><ExperimentOutlined style={{ marginRight: 8 }} />New Internal Project</span>}
                open={isModalVisible}
                onOk={handleCreate}
                onCancel={() => setIsModalVisible(false)}
                width={480}
                okText="Create"
                confirmLoading={submitting}
            >
                <Form form={form} layout="vertical" size="large">
                    <Form.Item
                        name="name"
                        label="Project Name"
                        rules={[{ required: true, message: 'กรุณาใส่ชื่อ project' }]}
                    >
                        <Input placeholder="ชื่อ Internal Project" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} placeholder="รายละเอียด (optional)" maxLength={500} showCount />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};
