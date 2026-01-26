import React, { useState, useEffect } from 'react';
import {
    Modal,
    Typography,
    Tag,
    Space,
    Button,
    Divider,
    Avatar,
    Input,
    List,
    Timeline,
    Select,
    DatePicker,
    Empty,
    message,
    Tooltip,
    Tabs,
    Form,
    Card,
    Popconfirm,
    Slider,
} from 'antd';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ExclamationCircleOutlined,
    UserOutlined,
    CalendarOutlined,
    EditOutlined,
    DeleteOutlined,
    SendOutlined,
    PlusOutlined,
    MessageOutlined,
    HistoryOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { taskService, type Task } from '../services/taskService';
import { commentService, type Comment } from '../services/commentService';
import { dailyUpdateService, type DailyUpdate } from '../services/dailyUpdateService';
import { useAuthStore } from '../store/authStore';
import './TaskDetailModal.css';

// Extend dayjs
dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface TaskDetailModalProps {
    visible: boolean;
    taskId: string | null;
    onClose: () => void;
    onUpdate: () => void;
}

// Configs
const PRIORITY_CONFIG: Record<string, { color: string; label: string }> = {
    URGENT: { color: '#ff4d4f', label: 'Urgent' },
    HIGH: { color: '#fa8c16', label: 'High' },
    MEDIUM: { color: '#fadb14', label: 'Medium' },
    LOW: { color: '#52c41a', label: 'Low' },
};

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
    TODO: { color: 'default', label: 'To Do', icon: <ClockCircleOutlined /> },
    IN_PROGRESS: { color: 'processing', label: 'In Progress', icon: <SyncOutlined spin /> },
    IN_REVIEW: { color: 'warning', label: 'In Review', icon: <ExclamationCircleOutlined /> },
    DONE: { color: 'success', label: 'Done', icon: <CheckCircleOutlined /> },
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
    visible,
    taskId,
    onClose,
    onUpdate,
}) => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState<Task | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [updates, setUpdates] = useState<DailyUpdate[]>([]);

    // Edit mode states
    const [isEditing, setIsEditing] = useState(false);
    const [editForm] = Form.useForm();

    // New comment state
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // New update state
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateForm] = Form.useForm();
    const [submittingUpdate, setSubmittingUpdate] = useState(false);

    useEffect(() => {
        if (visible && taskId) {
            loadTaskData(taskId);
        } else {
            setTask(null);
            setComments([]);
            setUpdates([]);
            setIsEditing(false);
            setShowUpdateForm(false);
        }
    }, [visible, taskId]);

    const loadTaskData = async (id: string) => {
        try {
            setLoading(true);
            const [taskData, commentsData, updatesData] = await Promise.all([
                taskService.getTask(id),
                commentService.getTaskComments(id),
                dailyUpdateService.getTaskUpdates(id),
            ]);

            setTask(taskData);
            setComments(commentsData);
            setUpdates(updatesData);

            // Setup edit form
            editForm.setFieldsValue({
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                priority: taskData.priority,
                dueDate: taskData.dueDate ? dayjs(taskData.dueDate) : null,
            });
        } catch (error) {
            message.error('Failed to load task details');
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTask = async () => {
        if (!task) return;

        try {
            const values = await editForm.validateFields();
            const updatedTask = await taskService.updateTask(task.id, {
                ...values,
                dueDate: values.dueDate ? values.dueDate.toISOString() : null,
            });

            setTask(updatedTask);
            setIsEditing(false);
            message.success('Task updated');
            onUpdate();
        } catch (error) {
            message.error('Failed to update task');
        }
    };

    const handleAddComment = async () => {
        if (!task || !newComment.trim()) return;

        try {
            setSubmittingComment(true);
            const comment = await commentService.createComment(task.id, { content: newComment });
            setComments([comment, ...comments]);
            setNewComment('');
            message.success('Comment added');
        } catch (error) {
            message.error('Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await commentService.deleteComment(commentId);
            setComments(comments.filter(c => c.id !== commentId));
            message.success('Comment deleted');
        } catch (error) {
            message.error('Failed to delete comment');
        }
    };

    const handleAddUpdate = async () => {
        if (!task) return;

        try {
            setSubmittingUpdate(true);
            const values = await updateForm.validateFields();
            const update = await dailyUpdateService.createUpdate(task.id, {
                notes: values.notes,
                progress: values.progress,
                status: values.status,
            });

            setUpdates([update, ...updates]);

            // If status changed in update, reflect in task
            if (values.status !== task.status) {
                setTask({ ...task, status: values.status });
                onUpdate();
            }

            setShowUpdateForm(false);
            updateForm.resetFields();
            message.success('Update added');
        } catch (error) {
            message.error('Failed to add update');
        } finally {
            setSubmittingUpdate(false);
        }
    };

    if (!task && loading) {
        return (
            <Modal visible={visible} footer={null} closable={false} width={800}>
                <div className="loading-container" style={{ minHeight: 300 }}>
                    Loadind...
                </div>
            </Modal>
        );
    }

    if (!task) return null;

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            width={900}
            footer={null}
            className="task-detail-modal"
            centered
        >
            <div className="task-detail-container">
                {/* Header */}
                <div className="task-detail-header">
                    <div className="header-main">
                        {!isEditing ? (
                            <>
                                <div className="title-row">
                                    <Tag color={PRIORITY_CONFIG[task.priority]?.color}>
                                        {PRIORITY_CONFIG[task.priority]?.label} Priority
                                    </Tag>
                                    <Tag color={STATUS_CONFIG[task.status]?.color} icon={STATUS_CONFIG[task.status]?.icon}>
                                        {STATUS_CONFIG[task.status]?.label}
                                    </Tag>
                                </div>
                                <Title level={3} style={{ marginTop: 12, marginBottom: 8 }}>
                                    {task.title}
                                </Title>
                            </>
                        ) : (
                            <Form form={editForm} layout="vertical">
                                <Form.Item name="title" style={{ marginBottom: 12 }}>
                                    <Input size="large" />
                                </Form.Item>
                                <Space>
                                    <Form.Item name="priority" style={{ marginBottom: 0, width: 120 }}>
                                        <Select>
                                            {Object.keys(PRIORITY_CONFIG).map(key => (
                                                <Option key={key} value={key}>{PRIORITY_CONFIG[key].label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="status" style={{ marginBottom: 0, width: 140 }}>
                                        <Select>
                                            {Object.keys(STATUS_CONFIG).map(key => (
                                                <Option key={key} value={key}>{STATUS_CONFIG[key].label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Space>
                            </Form>
                        )}

                        {!isEditing ? (
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </Button>
                        ) : (
                            <Space>
                                <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="primary" onClick={handleSaveTask}>Save</Button>
                            </Space>
                        )}
                    </div>
                </div>

                <div className="task-detail-content">
                    <div className="main-column">
                        {/* Description */}
                        <div className="section">
                            <Title level={5}>Description</Title>
                            {!isEditing ? (
                                <Paragraph type="secondary" style={{ whiteSpace: 'pre-wrap' }}>
                                    {task.description || 'No description provided.'}
                                </Paragraph>
                            ) : (
                                <Form form={editForm}>
                                    <Form.Item name="description">
                                        <TextArea rows={4} />
                                    </Form.Item>
                                </Form>
                            )}
                        </div>

                        {/* Metadata Grid */}
                        {!isEditing && (
                            <div className="metadata-grid">
                                <div className="meta-item">
                                    <Text type="secondary">Assignee</Text>
                                    <Space style={{ marginTop: 4 }}>
                                        <Avatar size="small" icon={<UserOutlined />} />
                                        <Text>{task.assignee?.name || 'Unassigned'}</Text>
                                    </Space>
                                </div>
                                <div className="meta-item">
                                    <Text type="secondary">Due Date</Text>
                                    <Space style={{ marginTop: 4 }}>
                                        <CalendarOutlined />
                                        <Text>
                                            {task.dueDate
                                                ? dayjs(task.dueDate).format('MMM D, YYYY')
                                                : 'No due date'}
                                        </Text>
                                    </Space>
                                </div>
                                <div className="meta-item">
                                    <Text type="secondary">Created</Text>
                                    <Text style={{ display: 'block', marginTop: 4 }}>
                                        {dayjs(task.createdAt).format('MMM D, YYYY')}
                                    </Text>
                                </div>
                            </div>
                        )}

                        <Divider />

                        {/* Tabs: Updates & Comments */}
                        <Tabs defaultActiveKey="updates">
                            {/* Daily Updates Tab */}
                            <TabPane
                                tab={
                                    <Space>
                                        <HistoryOutlined />
                                        Daily Updates ({updates.length})
                                    </Space>
                                }
                                key="updates"
                            >
                                {!showUpdateForm ? (
                                    <Button
                                        type="dashed"
                                        block
                                        icon={<PlusOutlined />}
                                        onClick={() => setShowUpdateForm(true)}
                                        style={{ marginBottom: 24 }}
                                    >
                                        Add Daily Update
                                    </Button>
                                ) : (
                                    <Card className="update-form-card" title="New Daily Update">
                                        <Form form={updateForm} layout="vertical">
                                            <Form.Item name="status" label="Current Status" initialValue={task.status}>
                                                <Select>
                                                    {Object.keys(STATUS_CONFIG).map(key => (
                                                        <Option key={key} value={key}>{STATUS_CONFIG[key].label}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item name="progress" label="Progress (%)" initialValue={50}>
                                                <Slider marks={{ 0: '0', 50: '50', 100: '100' }} />
                                            </Form.Item>
                                            <Form.Item name="notes" label="Notes" rules={[{ required: true }]}>
                                                <TextArea rows={3} placeholder="What did you accomplish today?" />
                                            </Form.Item>
                                            <Space>
                                                <Button onClick={() => setShowUpdateForm(false)}>Cancel</Button>
                                                <Button
                                                    type="primary"
                                                    loading={submittingUpdate}
                                                    onClick={handleAddUpdate}
                                                >
                                                    Submit Update
                                                </Button>
                                            </Space>
                                        </Form>
                                    </Card>
                                )}

                                <Timeline mode="left">
                                    {updates.map(update => (
                                        <Timeline.Item
                                            key={update.id}
                                            color={STATUS_CONFIG[update.status || 'TODO']?.color as string}
                                            label={dayjs(update.date).format('MMM D, HH:mm')}
                                        >
                                            <Card size="small" className="update-card">
                                                <div className="update-header">
                                                    <Space>
                                                        <Tag>{update.status?.replace('_', ' ')}</Tag>
                                                        <Text type="secondary">{update.progress}% Complete</Text>
                                                    </Space>
                                                </div>
                                                <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                                                    {update.notes}
                                                </Paragraph>
                                            </Card>
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            </TabPane>

                            {/* Comments Tab */}
                            <TabPane
                                tab={
                                    <Space>
                                        <MessageOutlined />
                                        Comments ({comments.length})
                                    </Space>
                                }
                                key="comments"
                            >
                                <div className="comments-list">
                                    {comments.length === 0 ? (
                                        <Empty description="No comments yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    ) : (
                                        <List
                                            dataSource={comments}
                                            renderItem={comment => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Avatar style={{ backgroundColor: '#1890ff' }}>
                                                                {comment.user?.name?.[0] || 'U'}
                                                            </Avatar>
                                                        }
                                                        title={
                                                            <div className="comment-header">
                                                                <Text strong>{comment.user?.name}</Text>
                                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                                    {dayjs(comment.createdAt).fromNow()}
                                                                </Text>
                                                            </div>
                                                        }
                                                        description={
                                                            <div className="comment-content">
                                                                <Text>{comment.content}</Text>
                                                                {user && user.id === comment.userId && (
                                                                    <Popconfirm
                                                                        title="Delete comment?"
                                                                        onConfirm={() => handleDeleteComment(comment.id)}
                                                                    >
                                                                        <Button
                                                                            type="text"
                                                                            size="small"
                                                                            danger
                                                                            className="delete-comment-btn"
                                                                            icon={<DeleteOutlined />}
                                                                        />
                                                                    </Popconfirm>
                                                                )}
                                                            </div>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    )}
                                </div>

                                <div className="comment-input-area">
                                    <TextArea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        rows={2}
                                        style={{ marginBottom: 12 }}
                                    />
                                    <Button
                                        type="primary"
                                        icon={<SendOutlined />}
                                        onClick={handleAddComment}
                                        loading={submittingComment}
                                        disabled={!newComment.trim()}
                                    >
                                        Post Comment
                                    </Button>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
