import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Statistic,
    Dropdown,
} from 'antd';
import type { MenuProps } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    FolderOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    MoreOutlined,
    EyeOutlined,
    ProjectOutlined,
} from '@ant-design/icons';
import './ProjectsPage.css';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Color options for projects
const PROJECT_COLORS = [
    { value: '#3B82F6', label: 'Blue', class: 'blue' },
    { value: '#10B981', label: 'Green', class: 'green' },
    { value: '#EF4444', label: 'Red', class: 'red' },
    { value: '#F59E0B', label: 'Orange', class: 'orange' },
    { value: '#8B5CF6', label: 'Purple', class: 'purple' },
    { value: '#06B6D4', label: 'Cyan', class: 'cyan' },
    { value: '#EC4899', label: 'Pink', class: 'pink' },
    { value: '#6366F1', label: 'Indigo', class: 'indigo' },
];

interface ProjectWithStats extends Project {
    stats?: {
        total_tasks: number;
        completed_tasks: number;
        in_progress_tasks: number;
        progress: number;
    };
}

export const ProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<ProjectWithStats[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectWithStats[]>([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [submitting, setSubmitting] = useState(false);
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

        if (statusFilter) {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        setFilteredProjects(filtered);
    }, [projects, searchText, statusFilter]);

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
            case 'ARCHIVED':
                return { color: 'default', icon: <ClockCircleOutlined />, label: 'Archived' };
            case 'COMPLETED':
                return { color: 'processing', icon: <CheckCircleOutlined />, label: 'Completed' };
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

    // Calculate stats
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;

    return (
        <Layout className="projects-layout">
            <Sidebar />

            <Layout className="projects-main-layout">
                {/* Header Section */}
                <div className="projects-page-header">
                    <div className="header-content">
                        <div className="header-title-section">
                            <Title level={2} className="page-title">
                                <ProjectOutlined /> Projects
                            </Title>
                            <Text type="secondary" className="page-subtitle">
                                Manage and track all your projects
                            </Text>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={handleCreate}
                            className="create-btn"
                        >
                            New Project
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <Row gutter={16} className="stats-row">
                        <Col xs={8}>
                            <Card className="stat-card">
                                <Statistic
                                    title="Total Projects"
                                    value={totalProjects}
                                    prefix={<FolderOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={8}>
                            <Card className="stat-card active">
                                <Statistic
                                    title="Active"
                                    value={activeProjects}
                                    valueStyle={{ color: '#10B981' }}
                                    prefix={<CheckCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={8}>
                            <Card className="stat-card completed">
                                <Statistic
                                    title="Completed"
                                    value={completedProjects}
                                    valueStyle={{ color: '#3B82F6' }}
                                    prefix={<CheckCircleOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Filters */}
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
                        <Select
                            placeholder="All Status"
                            style={{ width: 150 }}
                            allowClear
                            value={statusFilter}
                            onChange={setStatusFilter}
                            size="large"
                        >
                            <Option value="ACTIVE">Active</Option>
                            <Option value="ARCHIVED">Archived</Option>
                            <Option value="COMPLETED">Completed</Option>
                        </Select>
                    </div>
                </div>

                <Content className="projects-content">
                    <Spin spinning={loading}>
                        {filteredProjects.length === 0 ? (
                            <Card className="empty-state">
                                <FolderOutlined style={{ fontSize: 80, color: '#d9d9d9' }} />
                                <Title level={3} style={{ marginTop: 24, color: '#595959' }}>
                                    {searchText || statusFilter ? 'No Matching Projects' : 'No Projects Yet'}
                                </Title>
                                <Paragraph type="secondary" style={{ fontSize: 16 }}>
                                    {searchText || statusFilter
                                        ? 'Try adjusting your search or filters'
                                        : 'Create your first project to start organizing your tasks'}
                                </Paragraph>
                                {!searchText && !statusFilter && (
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
                        ) : (
                            <Row gutter={[20, 20]}>
                                {filteredProjects.map((project) => {
                                    const statusConfig = getStatusConfig(project.status);
                                    const progress = project.stats?.progress || 0;
                                    const totalTasks = project.stats?.total_tasks || project._count?.tasks || 0;
                                    const completedTasks = project.stats?.completed_tasks || 0;
                                    const memberCount = project._count?.members || 1;

                                    return (
                                        <Col xs={24} sm={12} lg={8} xl={6} key={project.id}>
                                            <Card
                                                className="project-card"
                                                hoverable
                                                onClick={() => handleViewProject(project.id)}
                                            >
                                                {/* Color Bar */}
                                                <div
                                                    className="project-color-bar"
                                                    style={{ backgroundColor: project.color }}
                                                />

                                                {/* Card Header */}
                                                <div className="project-card-header">
                                                    <Tag
                                                        icon={statusConfig.icon}
                                                        color={statusConfig.color as string}
                                                    >
                                                        {statusConfig.label}
                                                    </Tag>
                                                    <Dropdown
                                                        menu={{ items: getProjectMenuItems(project) }}
                                                        trigger={['click']}
                                                        placement="bottomRight"
                                                    >
                                                        <Button
                                                            type="text"
                                                            icon={<MoreOutlined />}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="more-btn"
                                                        />
                                                    </Dropdown>
                                                </div>

                                                {/* Project Info */}
                                                <div className="project-info">
                                                    <Title level={4} ellipsis={{ rows: 1 }} className="project-name">
                                                        {project.name}
                                                    </Title>

                                                    {project.description && (
                                                        <Paragraph
                                                            type="secondary"
                                                            ellipsis={{ rows: 2 }}
                                                            className="project-description"
                                                        >
                                                            {project.description}
                                                        </Paragraph>
                                                    )}
                                                </div>

                                                {/* Progress Section */}
                                                <div className="project-progress">
                                                    <div className="progress-header">
                                                        <Text type="secondary">Progress</Text>
                                                        <Text strong>{progress}%</Text>
                                                    </div>
                                                    <Progress
                                                        percent={progress}
                                                        showInfo={false}
                                                        strokeColor={{
                                                            '0%': project.color,
                                                            '100%': project.color,
                                                        }}
                                                        trailColor="#f0f0f0"
                                                    />
                                                </div>

                                                {/* Stats Footer */}
                                                <div className="project-footer">
                                                    <Tooltip title={`${completedTasks} of ${totalTasks} tasks completed`}>
                                                        <Space className="footer-stat">
                                                            <CheckCircleOutlined />
                                                            <Text>{completedTasks}/{totalTasks}</Text>
                                                        </Space>
                                                    </Tooltip>

                                                    <Tooltip title={`${memberCount} team member${memberCount > 1 ? 's' : ''}`}>
                                                        <Space className="footer-stat">
                                                            <TeamOutlined />
                                                            <Text>{memberCount}</Text>
                                                        </Space>
                                                    </Tooltip>

                                                    <Avatar.Group maxCount={3} size="small">
                                                        {Array(Math.min(memberCount, 3)).fill(0).map((_, i) => (
                                                            <Avatar
                                                                key={i}
                                                                style={{
                                                                    backgroundColor: project.color,
                                                                    opacity: 0.8 + i * 0.1
                                                                }}
                                                            >
                                                                {String.fromCharCode(65 + i)}
                                                            </Avatar>
                                                        ))}
                                                    </Avatar.Group>
                                                </div>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
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
                            <Option value="ARCHIVED">
                                <Space>
                                    <Badge status="default" />
                                    Archived
                                </Space>
                            </Option>
                            <Option value="COMPLETED">
                                <Space>
                                    <Badge status="processing" />
                                    Completed
                                </Space>
                            </Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};
