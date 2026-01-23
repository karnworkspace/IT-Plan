import React, { useState, useEffect } from 'react';
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
    Input,
    Select,
    Modal,
    Form,
    message,
    Spin,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    FolderOutlined,
    UserOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import './ProjectsPage.css';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export const ProjectsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
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
            setProjects(response.projects);
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
        setIsModalVisible(true);
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        form.setFieldsValue({
            name: project.name,
            description: project.description,
            color: project.color,
            status: project.status,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (projectId: string) => {
        Modal.confirm({
            title: 'Delete Project',
            content: 'Are you sure you want to delete this project? This action cannot be undone.',
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

    const handleSubmit = async () => {
        try {
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
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'ARCHIVED':
                return 'default';
            case 'COMPLETED':
                return 'processing';
            default:
                return 'default';
        }
    };

    return (
        <Layout className="projects-layout">
            <Sider width={250} className="projects-sider">
                <div className="logo">
                    <FolderOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0, color: 'white' }}>Projects</Title>
                </div>

                <div className="sidebar-menu">
                    <div className="menu-item">
                        <FolderOutlined /> Dashboard
                    </div>
                    <div className="menu-item active">
                        <FolderOutlined /> Projects
                    </div>
                    <div className="menu-item">
                        <FolderOutlined /> My Tasks
                    </div>
                    <div className="menu-item">
                        <CalendarOutlined /> Calendar
                    </div>
                </div>
            </Sider>

            <Layout>
                <Header className="projects-header">
                    <Title level={3}>All Projects</Title>
                    <Space>
                        <Input
                            placeholder="Search projects..."
                            prefix={<FolderOutlined />}
                            style={{ width: 300 }}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                        <Select
                            placeholder="Filter by status"
                            style={{ width: 150 }}
                            allowClear
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Option value="ACTIVE">Active</Option>
                            <Option value="ARCHIVED">Archived</Option>
                            <Option value="COMPLETED">Completed</Option>
                        </Select>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                            New Project
                        </Button>
                    </Space>
                </Header>

                <Content className="projects-content">
                    <Spin spinning={loading}>
                        {filteredProjects.length === 0 ? (
                            <Card className="empty-state">
                                <FolderOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
                                <Title level={4} style={{ marginTop: 16 }}>No Projects Found</Title>
                                <Text type="secondary">
                                    {searchText || statusFilter
                                        ? 'Try adjusting your search or filters'
                                        : 'Create your first project to get started'}
                                </Text>
                                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} style={{ marginTop: 16 }}>
                                    Create Project
                                </Button>
                            </Card>
                        ) : (
                            <Row gutter={[16, 16]}>
                                {filteredProjects.map((project) => (
                                    <Col xs={24} sm={12} md={12} lg={8} xl={6} key={project.id}>
                                        <Card
                                            className="project-card"
                                            hoverable
                                            actions={[
                                                <Button
                                                    key="edit"
                                                    type="text"
                                                    icon={<EditOutlined />}
                                                    onClick={() => handleEdit(project)}
                                                >
                                                    Edit
                                                </Button>,
                                                <Button
                                                    key="delete"
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleDelete(project.id)}
                                                >
                                                    Delete
                                                </Button>,
                                            ]}
                                        >
                                            <div className="project-card-header">
                                                <Tag color={getStatusColor(project.status)}>
                                                    {project.status.replace('_', ' ')}
                                                </Tag>
                                                <div
                                                    className="project-color-indicator"
                                                    style={{ backgroundColor: project.color }}
                                                />
                                            </div>

                                            <Title level={4} ellipsis>
                                                {project.name}
                                            </Title>

                                            {project.description && (
                                                <Text type="secondary" ellipsis>
                                                    {project.description}
                                                </Text>
                                            )}

                                            <div className="project-meta">
                                                <Space size="large">
                                                    <Text>
                                                        <FolderOutlined /> Created: {new Date(project.createdAt).toLocaleDateString()}
                                                    </Text>
                                                    <Text>
                                                        <CalendarOutlined /> Updated: {new Date(project.updatedAt).toLocaleDateString()}
                                                    </Text>
                                                </Space>
                                            </div>

                                            {project._count && (
                                                <Progress
                                                    percent={50}
                                                    size="small"
                                                    showInfo={false}
                                                    style={{ marginTop: 16 }}
                                                />
                                            )}
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Spin>
                </Content>
            </Layout>

            <Modal
                title={editingProject ? 'Edit Project' : 'Create New Project'}
                open={isModalVisible}
                onOk={handleSubmit}
                onCancel={() => setIsModalVisible(false)}
                width={600}
                okText="Save"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Project Name"
                        rules={[{ required: true, message: 'Please enter project name' }]}
                    >
                        <Input placeholder="Enter project name" />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} placeholder="Enter project description" />
                    </Form.Item>

                    <Form.Item
                        name="color"
                        label="Color"
                        rules={[{ required: true, message: 'Please select a color' }]}
                    >
                        <Select placeholder="Select project color">
                            <Option value="#1890ff">Blue</Option>
                            <Option value="#52c41a">Green</Option>
                            <Option value="#f5222d">Red</Option>
                            <Option value="#fa8c16">Orange</Option>
                            <Option value="#722ed1">Purple</Option>
                            <Option value="#13c2c2">Cyan</Option>
                            <Option value="#eb2f96">Pink</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select status' }]}
                    >
                        <Select placeholder="Select status">
                            <Option value="ACTIVE">Active</Option>
                            <Option value="ARCHIVED">Archived</Option>
                            <Option value="COMPLETED">Completed</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};
