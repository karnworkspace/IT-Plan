import React, { useState } from 'react';
import {
    List,
    Tag,
    Button,
    Input,
    Space,
    Avatar,
    Typography,
    Progress,
    message,
    Select,
    Tooltip,
    Empty,
} from 'antd';
import {
    PlusOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    UserOutlined,
    DeleteOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { taskService, type Task } from '../services/taskService';

const { Text } = Typography;
const { Option } = Select;

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
    TODO: { color: 'default', label: 'To Do' },
    IN_PROGRESS: { color: 'processing', label: 'In Progress' },
    DONE: { color: 'success', label: 'Done' },
    HOLD: { color: 'orange', label: 'Hold' },
    CANCELLED: { color: 'error', label: 'Cancelled' },
};

interface SubTaskListProps {
    parentTask: Task;
    subTasks: Task[];
    onRefresh: () => void;
}

export const SubTaskList: React.FC<SubTaskListProps> = ({ parentTask, subTasks, onRefresh }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const completedCount = subTasks.filter(t => t.status === 'DONE').length;
    const progressPercent = subTasks.length > 0 ? Math.round((completedCount / subTasks.length) * 100) : 0;

    const handleAddSubTask = async () => {
        if (!newTitle.trim()) return;

        try {
            setSubmitting(true);
            await taskService.createTask(parentTask.projectId, {
                title: newTitle.trim(),
                parentTaskId: parentTask.id,
                priority: 'MEDIUM',
                status: 'TODO',
            });
            setNewTitle('');
            setShowAddForm(false);
            message.success('Sub-task added');
            onRefresh();
        } catch (error) {
            message.error('Failed to add sub-task');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (subTaskId: string, newStatus: string) => {
        try {
            const progress = newStatus === 'DONE' ? 100 : newStatus === 'IN_PROGRESS' ? 50 : 0;
            await taskService.updateTaskStatus(subTaskId, { status: newStatus, progress });
            message.success('Status updated');
            onRefresh();
        } catch (error) {
            message.error('Failed to update status');
        }
    };

    const handleDeleteSubTask = async (subTaskId: string) => {
        try {
            await taskService.deleteTask(subTaskId);
            message.success('Sub-task deleted');
            onRefresh();
        } catch (error) {
            message.error('Failed to delete sub-task');
        }
    };

    return (
        <div className="subtask-list">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Space>
                    <Text strong>Sub-tasks</Text>
                    <Tag>{completedCount}/{subTasks.length}</Tag>
                </Space>
                {subTasks.length > 0 && (
                    <Progress
                        percent={progressPercent}
                        size="small"
                        style={{ width: 120 }}
                        strokeColor={progressPercent === 100 ? '#52c41a' : '#1890ff'}
                    />
                )}
            </div>

            {subTasks.length === 0 && !showAddForm && (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No sub-tasks yet"
                    style={{ margin: '8px 0' }}
                />
            )}

            <List
                size="small"
                dataSource={subTasks}
                renderItem={(subTask) => {
                    const isDone = subTask.status === 'DONE';
                    return (
                        <List.Item
                            style={{
                                padding: '8px 12px',
                                background: isDone ? '#f6ffed' : '#fafafa',
                                borderRadius: 8,
                                marginBottom: 6,
                                border: '1px solid #f0f0f0',
                            }}
                            actions={[
                                <Select
                                    key="status"
                                    value={subTask.status}
                                    onChange={(v) => handleStatusChange(subTask.id, v)}
                                    size="small"
                                    style={{ width: 120 }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                        <Option key={key} value={key}>
                                            <Tag color={config.color} style={{ margin: 0 }}>{config.label}</Tag>
                                        </Option>
                                    ))}
                                </Select>,
                                <Tooltip key="delete" title="Delete sub-task">
                                    <Button
                                        type="text"
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDeleteSubTask(subTask.id)}
                                    />
                                </Tooltip>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    isDone
                                        ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                                        : subTask.status === 'IN_PROGRESS'
                                            ? <SyncOutlined spin style={{ color: '#1890ff', fontSize: 18 }} />
                                            : <ClockCircleOutlined style={{ color: '#d9d9d9', fontSize: 18 }} />
                                }
                                title={
                                    <Text
                                        style={{
                                            textDecoration: isDone ? 'line-through' : 'none',
                                            color: isDone ? '#8c8c8c' : '#262626',
                                        }}
                                    >
                                        {subTask.title}
                                    </Text>
                                }
                                description={
                                    subTask.assignee && (
                                        <Space size={4}>
                                            <Avatar size={16} icon={<UserOutlined />} />
                                            <Text type="secondary" style={{ fontSize: 12 }}>{subTask.assignee.name}</Text>
                                        </Space>
                                    )
                                }
                            />
                        </List.Item>
                    );
                }}
            />

            {showAddForm ? (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Input
                        placeholder="Sub-task title..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onPressEnter={handleAddSubTask}
                        autoFocus
                    />
                    <Button type="primary" loading={submitting} onClick={handleAddSubTask}>
                        Add
                    </Button>
                    <Button onClick={() => { setShowAddForm(false); setNewTitle(''); }}>
                        Cancel
                    </Button>
                </div>
            ) : (
                <Button
                    type="dashed"
                    block
                    icon={<PlusOutlined />}
                    onClick={() => setShowAddForm(true)}
                    style={{ marginTop: 8 }}
                >
                    Add Sub-task
                </Button>
            )}
        </div>
    );
};
