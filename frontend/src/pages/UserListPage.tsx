import React, { useState, useEffect } from 'react';
import { Layout, Typography, Table, Tag, message, Spin, Button, Modal, Input, Select, Form } from 'antd';
import { UserOutlined, ArrowLeftOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import api from '../services/api';
import type { ColumnsType } from 'antd/es/table';

const { Content } = Layout;
const { Title, Text } = Typography;

const PROTECTED_EMAILS = ['monchiant@sena.co.th', 'adinuna@sena.co.th'];

interface UserRow {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    lastLoginAt: string | null;
}

export const UserListPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserRow[]>([]);

    // Edit modal
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<UserRow | null>(null);
    const [editForm] = Form.useForm();
    const [saving, setSaving] = useState(false);

    // Reset password modal
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [resetting, setResetting] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            setUsers(res.data.data.users || []);
        } catch (error: unknown) {
            console.error('Load users error:', error);
            const err = error as { response?: { status?: number; data?: { error?: string } } };
            message.error(err.response?.data?.error || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const isProtected = (email: string) => PROTECTED_EMAILS.includes(email);

    const openEditModal = (user: UserRow) => {
        setEditUser(user);
        editForm.setFieldsValue({ name: user.name, email: user.email, role: user.role });
        setEditModalOpen(true);
    };

    const handleSaveUser = async () => {
        if (!editUser) return;
        try {
            setSaving(true);
            const values = await editForm.validateFields();
            await api.put(`/users/${editUser.id}`, values);
            message.success('User updated');
            setEditModalOpen(false);
            loadUsers();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            if (err.response?.data?.error) {
                message.error(err.response.data.error);
            }
        } finally {
            setSaving(false);
        }
    };

    const openResetModal = () => {
        setNewPassword('');
        setResetModalOpen(true);
    };

    const handleResetPassword = async () => {
        if (!editUser) return;
        if (!newPassword || newPassword.length < 6) {
            message.warning('Password must be at least 6 characters');
            return;
        }
        try {
            setResetting(true);
            await api.post(`/users/${editUser.id}/reset-password`, { newPassword });
            message.success('Password reset successfully');
            setResetModalOpen(false);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            message.error(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setResetting(false);
        }
    };

    const columns: ColumnsType<UserRow> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <span style={{ fontWeight: 600 }}>{name}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email: string) => <span style={{ color: '#64748B' }}>{email}</span>,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: 120,
            render: (role: string) => (
                <Tag color={role === 'ADMIN' ? 'blue' : role === 'OWNER' ? 'gold' : 'default'}>{role}</Tag>
            ),
        },
        {
            title: 'Date Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 160,
            render: (date: string) =>
                new Date(date).toLocaleDateString('th-TH', {
                    year: 'numeric', month: 'short', day: 'numeric',
                }),
        },
        {
            title: 'Last Login',
            dataIndex: 'lastLoginAt',
            key: 'lastLoginAt',
            width: 180,
            render: (date: string | null) =>
                date
                    ? new Date(date).toLocaleString('th-TH', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                    })
                    : <span style={{ color: '#CBD5E1' }}>Never</span>,
        },
        {
            title: '',
            key: 'actions',
            width: 80,
            render: (_: unknown, record: UserRow) => {
                const locked = isProtected(record.email);
                return locked ? (
                    <LockOutlined style={{ color: '#CBD5E1', fontSize: 16 }} />
                ) : (
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                        style={{ color: '#3B82F6' }}
                    />
                );
            },
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout>
                <Content style={{ padding: 24, background: '#F8FAFC' }}>
                    <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/configuration')}
                            style={{ color: '#64748B' }}
                        />
                        <div>
                            <Title level={3} style={{ margin: 0 }}>
                                <UserOutlined style={{ marginRight: 10 }} />
                                Users
                            </Title>
                            <Text type="secondary">{users.length} users total</Text>
                        </div>
                    </div>

                    <Spin spinning={loading}>
                        <div style={{
                            background: '#fff',
                            borderRadius: 12,
                            border: '1px solid #E2E8F0',
                            overflow: 'hidden',
                        }}>
                            <Table
                                dataSource={users}
                                columns={columns}
                                rowKey="id"
                                pagination={{ pageSize: 20 }}
                                size="middle"
                            />
                        </div>
                    </Spin>
                </Content>
            </Layout>

            {/* Edit User Modal */}
            <Modal
                title={`Edit User — ${editUser?.name || ''}`}
                open={editModalOpen}
                onCancel={() => setEditModalOpen(false)}
                footer={[
                    <Button key="reset" danger onClick={openResetModal} icon={<LockOutlined />}>
                        Reset Password
                    </Button>,
                    <Button key="cancel" onClick={() => setEditModalOpen(false)}>
                        Cancel
                    </Button>,
                    <Button key="save" type="primary" loading={saving} onClick={handleSaveUser}>
                        Save
                    </Button>,
                ]}
            >
                <Form form={editForm} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Required' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Required' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Role" name="role" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { value: 'ADMIN', label: 'ADMIN' },
                                { value: 'OWNER', label: 'OWNER' },
                                { value: 'MEMBER', label: 'MEMBER' },
                                { value: 'USER', label: 'USER' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Reset Password Modal */}
            <Modal
                title="Reset Password"
                open={resetModalOpen}
                onCancel={() => setResetModalOpen(false)}
                onOk={handleResetPassword}
                okText="Reset"
                okButtonProps={{ danger: true, loading: resetting }}
            >
                <div style={{ marginTop: 12 }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                        Set new password for <strong>{editUser?.name}</strong> ({editUser?.email})
                    </Text>
                    <Input.Password
                        placeholder="New password (min 6 characters)"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        onPressEnter={handleResetPassword}
                    />
                </div>
            </Modal>
        </Layout>
    );
};
