import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { projectService, type Project } from '../services/projectService';
import { Sidebar } from '../components/Sidebar';
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
    Input,
    Select,
    Modal,
    Form,
    message,
    Spin,
    Tooltip,
    Badge,
    Dropdown,
    DatePicker,
    Checkbox,
    Pagination,
} from 'antd';
import dayjs from 'dayjs';
import type { MenuProps } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    FolderOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    MoreOutlined,
    EyeOutlined,
    ProjectOutlined,
    PauseCircleOutlined,
    StopOutlined,
    WarningOutlined,
    AppstoreOutlined,
    BarsOutlined,
    InsertRowLeftOutlined,
    SortAscendingOutlined,
    DownloadOutlined,
    FilePdfOutlined,
} from '@ant-design/icons';
import { exportProjects } from '../utils/exportExcel';
import { exportProjectsPDF } from '../utils/exportPDF';
import './ProjectsPage.css';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

import { PROJECT_COLORS } from '../constants';
import { useCountUp } from '../hooks/useCountUp';

interface ProjectWithStats extends Project {
    stats?: {
        total: number;
        completed: number;
        inProgress: number;
        overdue: number;
        // Keep these for safety/fallback if needed, or mapped
        progress?: number;
    };
}

// --- Stat Card with count-up animation ---
const StatCardItem = ({ title, value, icon, iconClass, gradientFrom }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconClass: string;
    gradientFrom?: string;
}) => {
    const animatedValue = useCountUp(value, 1000);
    return (
        <Card
            className="stat-card"
            variant="borderless"
            style={gradientFrom ? { background: `linear-gradient(135deg, ${gradientFrom} 0%, #ffffff 100%)` } : undefined}
        >
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

const STATUS_FILTER_COLORS: Record<string, string> = {
    ACTIVE: '#10B981',
    DELAY: '#EF4444',
    COMPLETED: '#3B82F6',
    HOLD: '#F59E0B',
    CANCELLED: '#6B7280',
};

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

export const ProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<ProjectWithStats[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectWithStats[]>([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [isMembersModalVisible, _setIsMembersModalVisible] = useState(false);
    const [selectedProjectForMembers, _setSelectedProjectForMembers] = useState<ProjectWithStats | null>(null);
    const [viewMode, setViewMode] = useState<'card' | 'list' | 'board'>(() => {
        return (localStorage.getItem('projectsViewMode') as 'card' | 'list' | 'board') || 'card';
    });
    const [sortBy, setSortBy] = useState<string>('name-asc');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;
    const [form] = Form.useForm();

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        let filtered = projects;

        if (searchText) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchText.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (statusFilter.length > 0) {
            filtered = filtered.filter(p => statusFilter.includes(p.status));
        }

        // Sorting
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'date-newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'date-oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'status':
                    return a.status.localeCompare(b.status);
                default:
                    return 0;
            }
        });

        setFilteredProjects(filtered);
        setCurrentPage(1);
    }, [projects, searchText, statusFilter, sortBy]);

    const handleViewModeChange = (mode: 'card' | 'list' | 'board') => {
        setViewMode(mode);
        localStorage.setItem('projectsViewMode', mode);
    };

    const loadProjects = async () => {
        try {
            setLoading(true);
            const response = await projectService.getProjects({ pageSize: 100 });

            // Load stats for each project
            const projectsWithStats = await Promise.all(
                (response.projects || []).map(async (project) => {
                    try {
                        const stats = await projectService.getProjectStats(project.id);
                        return { ...project, stats };
                    } catch {
                        return { ...project, stats: undefined };
                    }
                })
            );

            setProjects(projectsWithStats);
        } catch (error) {
            message.error('Failed to load projects');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingProject(null);
        form.resetFields();
        form.setFieldsValue({ color: '#3B82F6', status: 'ACTIVE' });
        setIsModalVisible(true);
    };

    const handleEdit = (project: Project, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setEditingProject(project);
        form.setFieldsValue({
            name: project.name,
            description: project.description,
            color: project.color,
            status: project.status,
            startDate: project.startDate ? dayjs(project.startDate) : null,
            endDate: project.endDate ? dayjs(project.endDate) : null,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (projectId: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        Modal.confirm({
            title: 'Delete Project',
            content: 'Are you sure you want to delete this project? All tasks and data will be permanently removed.',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await projectService.deleteProject(projectId);
                    message.success('Project deleted successfully');
                    await loadProjects();
                } catch (error) {
                    message.error('Failed to delete project');
                    console.error(error);
                }
            },
        });
    };

    const handleViewProject = (projectId: string) => {
        navigate(`/projects/${projectId}`);
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const values = await form.validateFields();

            if (editingProject) {
                await projectService.updateProject(editingProject.id, values);
                message.success('Project updated successfully');
            } else {
                await projectService.createProject(values);
                message.success('Project created successfully');
            }

            setIsModalVisible(false);
            form.resetFields();
            await loadProjects();
        } catch (error) {
            message.error(editingProject ? 'Failed to update project' : 'Failed to create project');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return { color: 'success', icon: <CheckCircleOutlined />, label: 'Active' };
            case 'DELAY':
                return { color: 'error', icon: <WarningOutlined />, label: 'Delay' };
            case 'COMPLETED':
                return { color: 'processing', icon: <CheckCircleOutlined />, label: 'Completed' };
            case 'HOLD':
                return { color: 'orange', icon: <PauseCircleOutlined />, label: 'Hold' };
            case 'CANCELLED':
                return { color: 'default', icon: <StopOutlined />, label: 'Cancelled' };
            default:
                return { color: 'default', icon: null, label: status };
        }
    };

    const getProjectMenuItems = (project: Project): MenuProps['items'] => [
        {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'View Project',
            onClick: () => handleViewProject(project.id),
        },
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit Project',
            onClick: (info) => {
                info.domEvent.stopPropagation();
                handleEdit(project);
            },
        },
        { type: 'divider' },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete Project',
            danger: true,
            onClick: (info) => {
                info.domEvent.stopPropagation();
                handleDelete(project.id);
            },
        },
    ];

    const BOARD_COLUMNS = [
        { status: 'ACTIVE', label: 'Active', dotColor: '#10B981' },
        { status: 'DELAY', label: 'Delay', dotColor: '#EF4444' },
        { status: 'COMPLETED', label: 'Completed', dotColor: '#3B82F6' },
        { status: 'HOLD', label: 'Hold', dotColor: '#F59E0B' },
        { status: 'CANCELLED', label: 'Cancelled', dotColor: '#6B7280' },
    ];

    const handleDragEnd = async (result: DropResult) => {
        const { draggableId, destination } = result;
        if (!destination) return;
        const newStatus = destination.droppableId as Project['status'];
        const project = projects.find(p => p.id === draggableId);
        if (!project || project.status === newStatus) return;

        // Optimistic update
        setProjects(prev => prev.map(p => p.id === draggableId ? { ...p, status: newStatus } : p));
        try {
            await projectService.updateProject(draggableId, { status: newStatus });
            message.success(`Moved "${project.name}" to ${newStatus}`);
        } catch {
            // Revert on error
            setProjects(prev => prev.map(p => p.id === draggableId ? { ...p, status: project.status } : p));
            message.error('Failed to update project status');
        }
    };

    // Calculate stats
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const delayProjects = projects.filter(p => p.status === 'DELAY').length;
    const holdProjects = projects.filter(p => p.status === 'HOLD').length;
    const cancelledProjects = projects.filter(p => p.status === 'CANCELLED').length;

    return (
        <Layout className="projects-layout">
            <Sidebar />

            <Layout className="projects-main-layout">
                {/* Header Section */}
                <div className="projects-page-header">
                    <div className="header-content">
                        <div className="header-title-section">
                            <Title level={2} className="page-title" style={{ fontSize: 48, margin: 0 }}>
                                <ProjectOutlined /> Projects
                            </Title>
                            <Text type="secondary" className="page-subtitle" style={{ fontSize: 30 }}>
                                Manage and track all your projects
                            </Text>
                        </div>

                        <Space>
                            <Button
                                size="large"
                                icon={<DownloadOutlined />}
                                onClick={() => exportProjects(filteredProjects)}
                                style={{ borderRadius: 12 }}
                            >
                                Export Excel
                            </Button>
                            <Button
                                size="large"
                                icon={<FilePdfOutlined />}
                                onClick={() => exportProjectsPDF(filteredProjects)}
                                style={{ borderRadius: 12 }}
                            >
                                Save PDF
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                onClick={handleCreate}
                                className="create-btn"
                            >
                                New Project
                            </Button>
                        </Space>
                    </div>

                    {/* Stats Cards */}
                    <Row gutter={16} className="stats-row">
                        <Col xs={12} sm={4}>
                            <StatCardItem title="Total" value={totalProjects} icon={<FolderOutlined />} iconClass="icon-slate" gradientFrom="#F1F5F9" />
                        </Col>
                        <Col xs={12} sm={4}>
                            <StatCardItem title="Active" value={activeProjects} icon={<CheckCircleOutlined />} iconClass="icon-emerald" gradientFrom="#D1FAE5" />
                        </Col>
                        <Col xs={12} sm={4}>
                            <StatCardItem title="Delay" value={delayProjects} icon={<WarningOutlined />} iconClass="icon-red" gradientFrom="#FEE2E2" />
                        </Col>
                        <Col xs={12} sm={4}>
                            <StatCardItem title="Completed" value={completedProjects} icon={<CheckCircleOutlined />} iconClass="icon-blue" gradientFrom="#DBEAFE" />
                        </Col>
                        <Col xs={12} sm={4}>
                            <StatCardItem title="Hold" value={holdProjects} icon={<PauseCircleOutlined />} iconClass="icon-amber" gradientFrom="#FEF3C7" />
                        </Col>
                        <Col xs={12} sm={4}>
                            <StatCardItem title="Cancelled" value={cancelledProjects} icon={<StopOutlined />} iconClass="icon-slate" gradientFrom="#F1F5F9" />
                        </Col>
                    </Row>

                    {/* Filters */}
                    <div className="filter-card">
                        <div className="filters-section">
                            <Input
                                placeholder="Search projects..."
                                prefix={<FolderOutlined />}
                                style={{ width: 300 }}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                allowClear
                                size="large"
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
                                <Select
                                    value={sortBy}
                                    onChange={setSortBy}
                                    style={{ width: 180 }}
                                    size="large"
                                    suffixIcon={<SortAscendingOutlined />}
                                >
                                    <Option value="name-asc">Name (A → Z)</Option>
                                    <Option value="name-desc">Name (Z → A)</Option>
                                    <Option value="date-newest">Newest First</Option>
                                    <Option value="date-oldest">Oldest First</Option>
                                    <Option value="status">Status</Option>
                                </Select>
                                <Button.Group size="large">
                                    <Tooltip title="Card View">
                                        <Button
                                            type={viewMode === 'card' ? 'primary' : 'default'}
                                            icon={<AppstoreOutlined />}
                                            onClick={() => handleViewModeChange('card')}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Board View">
                                        <Button
                                            type={viewMode === 'board' ? 'primary' : 'default'}
                                            icon={<InsertRowLeftOutlined />}
                                            onClick={() => handleViewModeChange('board')}
                                        />
                                    </Tooltip>
                                    <Tooltip title="List View">
                                        <Button
                                            type={viewMode === 'list' ? 'primary' : 'default'}
                                            icon={<BarsOutlined />}
                                            onClick={() => handleViewModeChange('list')}
                                        />
                                    </Tooltip>
                                </Button.Group>
                            </div>
                        </div>
                        <div className="filter-divider" />
                        <div className="status-filter-row">
                            <Checkbox.Group
                                value={statusFilter}
                                onChange={(values) => setStatusFilter(values as string[])}
                            >
                                {(['ACTIVE', 'DELAY', 'COMPLETED', 'HOLD', 'CANCELLED'] as const).map(status => (
                                    <Checkbox key={status} value={status}>
                                        <span style={{ color: STATUS_FILTER_COLORS[status], fontWeight: 500 }}>
                                            {status.charAt(0) + status.slice(1).toLowerCase()}
                                        </span>
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </div>
                    </div>
                </div>

                <Content className="projects-content">
                    <Spin spinning={loading}>
                        {filteredProjects.length === 0 ? (
                            <Card className="empty-state">
                                <FolderOutlined style={{ fontSize: 80, color: '#d9d9d9' }} />
                                <Title level={3} style={{ marginTop: 24, color: '#595959' }}>
                                    {searchText || statusFilter.length > 0 ? 'No Matching Projects' : 'No Projects Yet'}
                                </Title>
                                <Paragraph type="secondary" style={{ fontSize: 16 }}>
                                    {searchText || statusFilter.length > 0
                                        ? 'Try adjusting your search or filters'
                                        : 'Create your first project to start organizing your tasks'}
                                </Paragraph>
                                {!searchText && statusFilter.length === 0 && (
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<PlusOutlined />}
                                        onClick={handleCreate}
                                    >
                                        Create Your First Project
                                    </Button>
                                )}
                            </Card>
                        ) : viewMode === 'card' ? (
                            <>
                                <Row gutter={[16, 16]}>
                                    {filteredProjects
                                        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                                        .map((project) => {
                                        const statusConfig = getStatusConfig(project.status);
                                        const totalTasks = project.stats?.total || project._count?.tasks || 0;
                                        const completedTasks = project.stats?.completed || 0;
                                        const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                                        const progress = project.stats?.progress ?? calculatedProgress;

                                        return (
                                            <Col xs={24} sm={12} md={8} lg={8} xl={8} key={project.id}>
                                                <div
                                                    className="project-card-v2"
                                                    onClick={() => handleViewProject(project.id)}
                                                >
                                                    <div className="card-header">
                                                        <div className="project-icon-v2" style={{ backgroundColor: getStatusIconBg(project.status) }}>
                                                            <FolderOutlined style={{ color: getStatusIconColor(project.status), fontSize: 18 }} />
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <span className={`status-badge ${getStatusBadgeClass(project.status)}`}>
                                                                {statusConfig.label}
                                                            </span>
                                                            <Dropdown
                                                                menu={{ items: getProjectMenuItems(project) }}
                                                                trigger={['click']}
                                                                placement="bottomRight"
                                                            >
                                                                <Button
                                                                    type="text"
                                                                    size="small"
                                                                    icon={<MoreOutlined />}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="more-btn"
                                                                />
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                    <h3 className="project-card-title">{project.name}</h3>
                                                    <p className="project-card-id">{project.description || 'No description'}</p>
                                                    <div className="project-card-progress">
                                                        <div className="progress-header">
                                                            <span className="progress-label">Progress</span>
                                                            <span className="progress-value">{progress}% · {completedTasks}/{totalTasks}</span>
                                                        </div>
                                                        <div className="progress-bar-track">
                                                            <div
                                                                className="progress-bar-fill"
                                                                style={{ width: `${progress}%`, background: getStatusProgressColor(project.status) }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="project-card-footer-v2">
                                                        <TeamOutlined style={{ color: '#94A3B8', fontSize: 14 }} />
                                                        <span style={{ color: '#64748B', fontSize: 13 }}>{project.members?.length || 0} members</span>
                                                    </div>
                                                </div>
                                            </Col>
                                        );
                                    })}
                                </Row>
                                {filteredProjects.length > pageSize && (
                                    <div className="projects-pagination">
                                        <Pagination
                                            current={currentPage}
                                            total={filteredProjects.length}
                                            pageSize={pageSize}
                                            onChange={(page) => setCurrentPage(page)}
                                            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} projects`}
                                            showSizeChanger={false}
                                        />
                                    </div>
                                )}
                            </>
                        ) : viewMode === 'board' ? (
                            /* Board View (Kanban) with Drag & Drop */
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <div className="projects-board">
                                    {BOARD_COLUMNS.map(col => {
                                        const columnProjects = filteredProjects.filter(p => p.status === col.status);
                                        return (
                                            <div className="board-column" key={col.status}>
                                                <div className="board-column-header">
                                                    <span className="board-dot" style={{ backgroundColor: col.dotColor }} />
                                                    <span className="board-column-title">{col.label}</span>
                                                    <Badge count={columnProjects.length} showZero style={{ backgroundColor: col.dotColor }} />
                                                </div>
                                                <Droppable droppableId={col.status}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className={`board-column-content ${snapshot.isDraggingOver ? 'board-column-over' : ''}`}
                                                            ref={provided.innerRef}
                                                            {...provided.droppableProps}
                                                        >
                                                            {columnProjects.length === 0 && !snapshot.isDraggingOver && (
                                                                <div className="board-empty">No projects</div>
                                                            )}
                                                            {columnProjects.map((project, index) => {
                                                                const totalTasks = project.stats?.total || project._count?.tasks || 0;
                                                                const completedTasks = project.stats?.completed || 0;
                                                                const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                                                                const progress = project.stats?.progress ?? calculatedProgress;

                                                                return (
                                                                    <Draggable key={project.id} draggableId={project.id} index={index}>
                                                                        {(provided, snapshot) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                className={`board-project-card ${snapshot.isDragging ? 'board-card-dragging' : ''}`}
                                                                                onClick={() => handleViewProject(project.id)}
                                                                            >
                                                                                <div className="board-card-color" style={{ backgroundColor: getStatusProgressColor(project.status) }} />
                                                                                <div className="board-card-body">
                                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                                        <div className="board-card-title" style={{ flex: 1 }}>{project.name}</div>
                                                                                        <Dropdown menu={{ items: getProjectMenuItems(project) }} trigger={['click']}>
                                                                                            <Button
                                                                                                type="text"
                                                                                                size="small"
                                                                                                icon={<MoreOutlined />}
                                                                                                onClick={(e) => e.stopPropagation()}
                                                                                                style={{ flexShrink: 0, color: '#94A3B8' }}
                                                                                            />
                                                                                        </Dropdown>
                                                                                    </div>
                                                                                    <div className="board-card-progress">
                                                                                        <div className="progress-header">
                                                                                            <span className="progress-label">Progress</span>
                                                                                            <span className="progress-value">{progress}%</span>
                                                                                        </div>
                                                                                        <div className="progress-bar-track">
                                                                                            <div
                                                                                                className="progress-bar-fill"
                                                                                                style={{ width: `${progress}%`, background: getStatusProgressColor(project.status) }}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="board-card-members">
                                                                                        {project.members?.slice(0, 3).map((m: { user: { name: string; email: string } }, idx: number) => (
                                                                                            <span key={idx} className="board-member-tag">
                                                                                                {m.user?.name || 'Unknown'}
                                                                                            </span>
                                                                                        ))}
                                                                                        {(project.members?.length || 0) > 3 && (
                                                                                            <span className="board-member-tag board-member-more">
                                                                                                +{(project.members?.length || 0) - 3}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="board-card-footer">
                                                                                        <span className="board-card-stat">
                                                                                            {completedTasks}/{totalTasks} tasks
                                                                                        </span>
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
                        ) : (
                            /* List View */
                            <div className="project-list-view">
                                {filteredProjects.map((project) => {
                                    const statusConfig = getStatusConfig(project.status);
                                    const totalTasks = project.stats?.total || project._count?.tasks || 0;
                                    const completedTasks = project.stats?.completed || 0;
                                    const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                                    const progress = project.stats?.progress ?? calculatedProgress;

                                    return (
                                        <Card
                                            key={project.id}
                                            className="project-list-item"
                                            hoverable
                                            onClick={() => handleViewProject(project.id)}
                                            style={{ marginBottom: 12, borderRadius: 12, overflow: 'hidden' }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                <div
                                                    style={{
                                                        width: 6,
                                                        height: 56,
                                                        borderRadius: 3,
                                                        backgroundColor: project.color,
                                                        flexShrink: 0,
                                                    }}
                                                />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                        <Text strong style={{ fontSize: 15 }} ellipsis>{project.name}</Text>
                                                        <Tag icon={statusConfig.icon} color={statusConfig.color as string} style={{ marginRight: 0 }}>
                                                            {statusConfig.label}
                                                        </Tag>
                                                    </div>
                                                    <Text type="secondary" style={{ fontSize: 13 }} ellipsis>
                                                        {project.description || 'No description'}
                                                    </Text>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
                                                    <Progress
                                                        type="circle"
                                                        percent={progress}
                                                        size={40}
                                                        strokeColor={project.color}
                                                    />
                                                    <Tooltip title={`${completedTasks}/${totalTasks} tasks`}>
                                                        <Space style={{ color: '#666', fontSize: 13 }}>
                                                            <CheckCircleOutlined />
                                                            <span>{completedTasks}/{totalTasks}</span>
                                                        </Space>
                                                    </Tooltip>
                                                    <Tooltip title={`${project.members?.length || 0} members`}>
                                                        <Space style={{ color: '#666', fontSize: 13 }}>
                                                            <TeamOutlined />
                                                            <span>{project.members?.length || 0}</span>
                                                        </Space>
                                                    </Tooltip>
                                                    <Dropdown
                                                        menu={{ items: getProjectMenuItems(project) }}
                                                        trigger={['click']}
                                                        placement="bottomRight"
                                                    >
                                                        <Button
                                                            type="text"
                                                            icon={<MoreOutlined />}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </Spin>
                </Content>
            </Layout>

            {/* Create/Edit Modal */}
            <Modal
                title={
                    <Space>
                        <FolderOutlined />
                        {editingProject ? 'Edit Project' : 'Create New Project'}
                    </Space>
                }
                open={isModalVisible}
                onOk={handleSubmit}
                onCancel={() => setIsModalVisible(false)}
                width={560}
                okText={editingProject ? 'Save Changes' : 'Create Project'}
                confirmLoading={submitting}
                className="project-modal"
            >
                <Form form={form} layout="vertical" size="large">
                    <Form.Item
                        name="name"
                        label="Project Name"
                        rules={[
                            { required: true, message: 'Please enter project name' },
                            { max: 100, message: 'Project name must be less than 100 characters' }
                        ]}
                    >
                        <Input placeholder="Enter project name" />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea
                            rows={4}
                            placeholder="Enter project description (optional)"
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        name="color"
                        label="Project Color"
                        rules={[{ required: true, message: 'Please select a color' }]}
                    >
                        <div className="color-picker">
                            {PROJECT_COLORS.map((color) => (
                                <Tooltip key={color.value} title={color.label}>
                                    <div
                                        className={`color-option ${form.getFieldValue('color') === color.value ? 'selected' : ''}`}
                                        style={{ backgroundColor: color.value }}
                                        onClick={() => form.setFieldsValue({ color: color.value })}
                                    />
                                </Tooltip>
                            ))}
                        </div>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select status' }]}
                    >
                        <Select placeholder="Select status">
                            <Option value="ACTIVE">
                                <Space>
                                    <Badge status="success" />
                                    Active
                                </Space>
                            </Option>
                            <Option value="DELAY">
                                <Space>
                                    <Badge status="error" />
                                    Delay
                                </Space>
                            </Option>
                            <Option value="COMPLETED">
                                <Space>
                                    <Badge status="processing" />
                                    Completed
                                </Space>
                            </Option>
                            <Option value="HOLD">
                                <Space>
                                    <Badge color="orange" />
                                    Hold
                                </Space>
                            </Option>
                            <Option value="CANCELLED">
                                <Space>
                                    <Badge status="default" />
                                    Cancelled
                                </Space>
                            </Option>
                        </Select>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="startDate" label="Start Date">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="endDate" label="End Date">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* Members View Modal */}
            <Modal
                title={
                    <Space>
                        <TeamOutlined />
                        <Typography.Text strong>Project Members</Typography.Text>
                        {selectedProjectForMembers && <Tag color={selectedProjectForMembers.color}>{selectedProjectForMembers.name}</Tag>}
                    </Space>
                }
                open={isMembersModalVisible}
                onCancel={() => _setIsMembersModalVisible(false)}
                footer={null}
                width={500}
            >
                {selectedProjectForMembers?.members && selectedProjectForMembers.members.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                        {selectedProjectForMembers.members.map(member => (
                            <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                                <Space>
                                    <Avatar style={{ backgroundColor: '#87d068' }} size="large">
                                        {member.user.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography.Text strong>{member.user.name}</Typography.Text>
                                        <Typography.Text type="secondary" style={{ fontSize: '12px' }}>{member.user.email}</Typography.Text>
                                    </div>
                                </Space>
                                <Tag color={member.role === 'OWNER' ? 'gold' : 'blue'}>{member.role}</Tag>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
                        <TeamOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                        <div>No additional members found.</div>
                    </div>
                )}
            </Modal>
        </Layout>
    );
};
