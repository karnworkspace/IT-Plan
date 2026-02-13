import React, { useState, useEffect } from 'react';
import {
    Layout,
    Card,
    Row,
    Col,
    Button,
    Typography,
    Space,
    Tag,
    Avatar,
    Input,
    Select,
    Modal,
    Form,
    message,
    Spin,
    Tooltip,
    Empty,
    Tabs,
    List,
    Popconfirm,
} from 'antd';
import {
    PlusOutlined,
    TeamOutlined,
    FolderOutlined,
    EditOutlined,
    DeleteOutlined,
    UserAddOutlined,
    AppstoreAddOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { Sidebar } from '../components/Sidebar';
import { groupService, type Group } from '../services/groupService';
import { projectService, type Project } from '../services/projectService';
import './GroupsPage.css';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Colors for groups
const GROUP_COLORS = [
    '#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96',
    '#13c2c2', '#2f54eb', '#faad14', '#f5222d', '#a0d911',
];

export const GroupsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState<Group[]>([]);
    const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
    const [searchText, setSearchText] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    // Detail modal
    const [detailGroup, setDetailGroup] = useState<Group | null>(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [allUsers, setAllUsers] = useState<{ id: string; name: string; email: string }[]>([]);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [addMemberUserId, setAddMemberUserId] = useState<string | undefined>();
    const [addProjectId, setAddProjectId] = useState<string | undefined>();

    useEffect(() => {
        loadGroups();
        loadUsersAndProjects();
    }, []);

    useEffect(() => {
        let filtered = groups;
        if (searchText) {
            filtered = filtered.filter(g =>
                g.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        if (typeFilter) {
            filtered = filtered.filter(g => g.type === typeFilter);
        }
        setFilteredGroups(filtered);
    }, [groups, searchText, typeFilter]);

    const loadGroups = async () => {
        try {
            setLoading(true);
            const data = await groupService.getGroups();
            setGroups(data);
        } catch (error) {
            message.error('Failed to load groups');
        } finally {
            setLoading(false);
        }
    };

    const loadUsersAndProjects = async () => {
        try {
            const projectsRes = await projectService.getProjects({ pageSize: 100 });
            setAllProjects(projectsRes.projects || []);

            // Gather unique users from project members
            const userMap = new Map<string, { id: string; name: string; email: string }>();
            (projectsRes.projects || []).forEach(p => {
                p.members?.forEach(m => {
                    if (!userMap.has(m.user.id)) {
                        userMap.set(m.user.id, m.user);
                    }
                });
            });
            setAllUsers(Array.from(userMap.values()));
        } catch { /* silent */ }
    };

    const handleCreate = () => {
        setEditingGroup(null);
        form.resetFields();
        form.setFieldsValue({ type: 'USER_GROUP', color: '#1890ff' });
        setModalVisible(true);
    };

    const handleEdit = (group: Group) => {
        setEditingGroup(group);
        form.setFieldsValue({
            name: group.name,
            description: group.description,
            type: group.type,
            color: group.color,
        });
        setModalVisible(true);
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const values = await form.validateFields();

            if (editingGroup) {
                await groupService.updateGroup(editingGroup.id, values);
                message.success('Group updated');
            } else {
                await groupService.createGroup(values);
                message.success('Group created');
            }

            setModalVisible(false);
            form.resetFields();
            await loadGroups();
        } catch (error) {
            message.error('Failed to save group');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await groupService.deleteGroup(id);
            message.success('Group deleted');
            await loadGroups();
        } catch (error) {
            message.error('Failed to delete group');
        }
    };

    const openDetail = async (group: Group) => {
        try {
            const fullGroup = await groupService.getGroup(group.id);
            setDetailGroup(fullGroup);
            setDetailVisible(true);
        } catch (error) {
            message.error('Failed to load group details');
        }
    };

    const handleAddMember = async () => {
        if (!detailGroup || !addMemberUserId) return;
        try {
            await groupService.addMember(detailGroup.id, addMemberUserId);
            message.success('Member added');
            const updated = await groupService.getGroup(detailGroup.id);
            setDetailGroup(updated);
            setAddMemberUserId(undefined);
            await loadGroups();
        } catch (error: any) {
            message.error(error.response?.data?.error || 'Failed to add member');
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!detailGroup) return;
        try {
            await groupService.removeMember(detailGroup.id, userId);
            message.success('Member removed');
            const updated = await groupService.getGroup(detailGroup.id);
            setDetailGroup(updated);
            await loadGroups();
        } catch (error) {
            message.error('Failed to remove member');
        }
    };

    const handleAddProject = async () => {
        if (!detailGroup || !addProjectId) return;
        try {
            await groupService.addProject(detailGroup.id, addProjectId);
            message.success('Project added');
            const updated = await groupService.getGroup(detailGroup.id);
            setDetailGroup(updated);
            setAddProjectId(undefined);
            await loadGroups();
        } catch (error: any) {
            message.error(error.response?.data?.error || 'Failed to add project');
        }
    };

    const handleRemoveProject = async (projectId: string) => {
        if (!detailGroup) return;
        try {
            await groupService.removeProject(detailGroup.id, projectId);
            message.success('Project removed');
            const updated = await groupService.getGroup(detailGroup.id);
            setDetailGroup(updated);
            await loadGroups();
        } catch (error) {
            message.error('Failed to remove project');
        }
    };

    return (
        <Layout className="groups-layout">
            <Sidebar />

            <Layout className="groups-main">
                {/* Header */}
                <div className="groups-page-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <Title level={2} style={{ color: '#1a1a2e', margin: 0 }}>
                                <TeamOutlined style={{ marginRight: 12 }} />
                                Groups
                            </Title>
                            <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                                Manage user groups and project groups
                            </Text>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={handleCreate}
                            className="create-btn"
                        >
                            New Group
                        </Button>
                    </div>

                    <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                        <Input
                            placeholder="Search groups..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            allowClear
                            size="large"
                            style={{ width: 300 }}
                        />
                        <Select
                            placeholder="All Types"
                            allowClear
                            size="large"
                            value={typeFilter}
                            onChange={setTypeFilter}
                            style={{ width: 180 }}
                        >
                            <Option value="USER_GROUP">User Groups</Option>
                            <Option value="PROJECT_GROUP">Project Groups</Option>
                        </Select>
                    </div>
                </div>

                <Content className="groups-content">
                    <Spin spinning={loading}>
                        {filteredGroups.length === 0 ? (
                            <Card style={{ textAlign: 'center', padding: 60 }}>
                                <Empty description="No groups found" />
                                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} style={{ marginTop: 16 }}>
                                    Create First Group
                                </Button>
                            </Card>
                        ) : (
                            <Row gutter={[20, 20]}>
                                {filteredGroups.map(group => (
                                    <Col xs={24} sm={12} lg={8} key={group.id}>
                                        <Card
                                            hoverable
                                            onClick={() => openDetail(group)}
                                            style={{ borderRadius: 16, overflow: 'hidden' }}
                                        >
                                            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                                <div style={{
                                                    width: 48, height: 48, borderRadius: 12,
                                                    backgroundColor: group.color,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}>
                                                    {group.type === 'USER_GROUP'
                                                        ? <TeamOutlined style={{ fontSize: 22, color: 'white' }} />
                                                        : <FolderOutlined style={{ fontSize: 22, color: 'white' }} />
                                                    }
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text strong style={{ fontSize: 16 }} ellipsis>{group.name}</Text>
                                                        <Space size={4}>
                                                            <Tooltip title="Edit">
                                                                <Button
                                                                    type="text" size="small" icon={<EditOutlined />}
                                                                    onClick={(e) => { e.stopPropagation(); handleEdit(group); }}
                                                                />
                                                            </Tooltip>
                                                            <Popconfirm
                                                                title="Are you sure to delete this group?"
                                                                onConfirm={(e) => {
                                                                    e?.stopPropagation();
                                                                    handleDelete(group.id);
                                                                }}
                                                                onCancel={(e) => e?.stopPropagation()}
                                                                okText="Delete"
                                                                cancelText="Cancel"
                                                            >
                                                                <Button
                                                                    type="text"
                                                                    size="small"
                                                                    danger
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </Popconfirm>
                                                        </Space>
                                                    </div>
                                                    {group.description && (
                                                        <Text type="secondary" style={{ fontSize: 13 }} ellipsis>
                                                            {group.description}
                                                        </Text>
                                                    )}
                                                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                                                        <Tag color={group.type === 'USER_GROUP' ? 'blue' : 'green'}>
                                                            {group.type === 'USER_GROUP' ? 'User Group' : 'Project Group'}
                                                        </Tag>
                                                        <Tag icon={<TeamOutlined />}>{group._count?.members || 0} members</Tag>
                                                        <Tag icon={<FolderOutlined />}>{group._count?.projects || 0} projects</Tag>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Spin>
                </Content>
            </Layout>

            {/* Create/Edit Modal */}
            <Modal
                title={editingGroup ? 'Edit Group' : 'Create New Group'}
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => setModalVisible(false)}
                confirmLoading={submitting}
                okText={editingGroup ? 'Save' : 'Create'}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Group Name" rules={[{ required: true }]}>
                        <Input placeholder="Enter group name" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={2} placeholder="Description (optional)" />
                    </Form.Item>
                    <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                        <Select>
                            <Option value="USER_GROUP">User Group</Option>
                            <Option value="PROJECT_GROUP">Project Group</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="color" label="Color">
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {GROUP_COLORS.map(color => (
                                <div
                                    key={color}
                                    onClick={() => form.setFieldsValue({ color })}
                                    style={{
                                        width: 32, height: 32, borderRadius: 8,
                                        backgroundColor: color, cursor: 'pointer',
                                        border: form.getFieldValue('color') === color ? '3px solid #1a1a2e' : '3px solid transparent',
                                        transition: 'all 0.2s',
                                    }}
                                />
                            ))}
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Detail Modal */}
            <Modal
                title={detailGroup?.name || 'Group Detail'}
                open={detailVisible}
                onCancel={() => { setDetailVisible(false); setDetailGroup(null); }}
                footer={null}
                width={700}
            >
                {detailGroup && (
                    <Tabs defaultActiveKey="members">
                        <TabPane tab={<Space><TeamOutlined />Members ({detailGroup.members?.length || 0})</Space>} key="members">
                            <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                                <Select
                                    placeholder="Select user to add..."
                                    value={addMemberUserId}
                                    onChange={setAddMemberUserId}
                                    style={{ flex: 1 }}
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
                                >
                                    {allUsers
                                        .filter(u => !detailGroup.members?.some(m => m.user.id === u.id))
                                        .map(u => (
                                            <Option key={u.id} value={u.id}>{u.name} ({u.email})</Option>
                                        ))}
                                </Select>
                                <Button type="primary" icon={<UserAddOutlined />} onClick={handleAddMember} disabled={!addMemberUserId}>
                                    Add
                                </Button>
                            </div>

                            <List
                                dataSource={detailGroup.members || []}
                                renderItem={member => (
                                    <List.Item
                                        actions={[
                                            <Popconfirm
                                                key="remove"
                                                title="Are you sure to remove this member?"
                                                onConfirm={(e) => {
                                                    e?.stopPropagation();
                                                    handleRemoveMember(member.user.id);
                                                }}
                                                onCancel={(e) => e?.stopPropagation()}
                                                okText="Remove"
                                                cancelText="Cancel"
                                            >
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </Popconfirm>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{member.user.name?.[0]}</Avatar>}
                                            title={member.user.name}
                                            description={member.user.email}
                                        />
                                    </List.Item>
                                )}
                                locale={{ emptyText: <Empty description="No members" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
                            />
                        </TabPane>

                        <TabPane tab={<Space><FolderOutlined />Projects ({detailGroup.projects?.length || 0})</Space>} key="projects">
                            <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                                <Select
                                    placeholder="Select project to add..."
                                    value={addProjectId}
                                    onChange={setAddProjectId}
                                    style={{ flex: 1 }}
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
                                >
                                    {allProjects
                                        .filter(p => !detailGroup.projects?.some(gp => gp.project.id === p.id))
                                        .map(p => (
                                            <Option key={p.id} value={p.id}>
                                                <Space>
                                                    <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: p.color, display: 'inline-block' }} />
                                                    {p.name}
                                                </Space>
                                            </Option>
                                        ))}
                                </Select>
                                <Button type="primary" icon={<AppstoreAddOutlined />} onClick={handleAddProject} disabled={!addProjectId}>
                                    Add
                                </Button>
                            </div>

                            <List
                                dataSource={detailGroup.projects || []}
                                renderItem={gp => (
                                    <List.Item
                                        actions={[
                                            <Popconfirm key="remove" title="Remove project?" onConfirm={() => handleRemoveProject(gp.project.id)}>
                                                <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                                            </Popconfirm>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: 8,
                                                    backgroundColor: gp.project.color,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <FolderOutlined style={{ color: 'white' }} />
                                                </div>
                                            }
                                            title={gp.project.name}
                                            description={<Tag>{gp.project.status}</Tag>}
                                        />
                                    </List.Item>
                                )}
                                locale={{ emptyText: <Empty description="No projects" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
                            />
                        </TabPane>
                    </Tabs>
                )}
            </Modal>
        </Layout>
    );
};
