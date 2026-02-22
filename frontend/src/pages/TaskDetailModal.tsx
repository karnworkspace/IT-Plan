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
    Empty,
    message,
    Tabs,
    Form,
    Card,
    Popconfirm,
    Slider,
    Upload,
    Image,
} from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    EditOutlined,
    DeleteOutlined,
    SendOutlined,
    PlusOutlined,
    MessageOutlined,
    HistoryOutlined,
    PaperClipOutlined,
    PictureOutlined,
} from '@ant-design/icons';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { taskService, type Task } from '../services/taskService';
import { projectService } from '../services/projectService';
import { commentService, type Comment, type Attachment } from '../services/commentService';
import { dailyUpdateService, type DailyUpdate } from '../services/dailyUpdateService';
import { useAuthStore } from '../store/authStore';
import { SubTaskList } from '../components/SubTaskList';
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

import { STATUS_CONFIG, PRIORITY_CONFIG } from '../constants';
import { STATUS_ICONS } from '../constants/statusIcons';

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
    const [projectMembers, setProjectMembers] = useState<{ id: string; name: string; email: string }[]>([]);

    // Edit mode states
    const [isEditing, setIsEditing] = useState(false);
    const [editForm] = Form.useForm();

    // New comment state
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);

    // New update state
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateForm] = Form.useForm();
    const [submittingUpdate, setSubmittingUpdate] = useState(false);

    useEffect(() => {
        if (visible && taskId) {
            loadTaskData(taskId);
            setIsEditing(true);
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

            // Load project members for assignee dropdown
            if (taskData.projectId) {
                try {
                    const projectData = await projectService.getProject(taskData.projectId);
                    if (projectData.members) {
                        setProjectMembers(projectData.members.map(m => m.user));
                    }
                } catch { /* ignore member load failure */ }
            }

            // Setup edit form
            editForm.setFieldsValue({
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                priority: taskData.priority,
                assigneeIds: taskData.taskAssignees?.map((ta: { user: { id: string } }) => ta.user.id) || (taskData.assigneeId ? [taskData.assigneeId] : []),
                startDate: taskData.startDate ? dayjs(taskData.startDate) : null,
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
                startDate: values.startDate ? values.startDate.toISOString() : null,
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
        if (!task || (!newComment.trim() && pendingFiles.length === 0)) return;

        try {
            setSubmittingComment(true);
            const content = newComment.trim() || (pendingFiles.length > 0 ? '(image)' : '');
            const comment = await commentService.createComment(task.id, { content });

            // Upload images if any
            if (pendingFiles.length > 0) {
                const attachments = await commentService.uploadImages(comment.id, pendingFiles);
                comment.attachments = attachments;
            }

            setComments(prev => [comment, ...prev]);
            setNewComment('');
            setPendingFiles([]);
            message.success('Comment added');
        } catch (error) {
            console.error('Comment error:', error);
            message.error('Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const getImageUrl = (att: Attachment) => {
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';
        const filename = att.path.split('/').pop() || att.path.split('\\').pop();
        return `${baseUrl}/uploads/${filename}`;
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

            setUpdates(prev => [update, ...prev]);

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
                                    <Tag color={STATUS_CONFIG[task.status]?.color} icon={STATUS_ICONS[task.status]}>
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
                                <Space wrap>
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
                                    <Form.Item name="assigneeIds" style={{ marginBottom: 0, minWidth: 200 }}>
                                        <Select mode="multiple" placeholder="Assignees" allowClear showSearch optionFilterProp="children" maxTagCount={2}>
                                            {projectMembers.map(member => (
                                                <Option key={member.id} value={member.id}>{member.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Space>
                                <Space style={{ marginTop: 12 }}>
                                    <Form.Item name="startDate" style={{ marginBottom: 0 }}>
                                        <DatePicker placeholder="Start Date" />
                                    </Form.Item>
                                    <Form.Item name="dueDate" style={{ marginBottom: 0 }}>
                                        <DatePicker placeholder="Finish Date" />
                                    </Form.Item>
                                </Space>
                            </Form>
                        )}

                        <Button type="primary" onClick={handleSaveTask}>Save</Button>
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
                                    <Text type="secondary">Assignees</Text>
                                    <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                        {task.taskAssignees && task.taskAssignees.length > 0 ? (
                                            task.taskAssignees.map(ta => (
                                                <Tag key={ta.id} icon={<UserOutlined />}>{ta.user.name}</Tag>
                                            ))
                                        ) : task.assignee ? (
                                            <Tag icon={<UserOutlined />}>{task.assignee.name}</Tag>
                                        ) : (
                                            <Text type="secondary">Unassigned</Text>
                                        )}
                                    </div>
                                </div>
                                <div className="meta-item">
                                    <Text type="secondary">Start Date</Text>
                                    <Space style={{ marginTop: 4 }}>
                                        <CalendarOutlined />
                                        <Text>
                                            {task.startDate
                                                ? dayjs(task.startDate).format('MMM D, YYYY')
                                                : 'Not set'}
                                        </Text>
                                    </Space>
                                </div>
                                <div className="meta-item">
                                    <Text type="secondary">Finish Date</Text>
                                    <Space style={{ marginTop: 4 }}>
                                        <CalendarOutlined />
                                        <Text>
                                            {task.dueDate
                                                ? dayjs(task.dueDate).format('MMM D, YYYY')
                                                : 'Not set'}
                                        </Text>
                                        {task.dueDate && task.status !== 'DONE' && task.status !== 'CANCELLED' && (() => {
                                            const daysLeft = dayjs(task.dueDate).diff(dayjs(), 'day');
                                            if (daysLeft < 0) return <Tag color="red">Delay {Math.abs(daysLeft)}d</Tag>;
                                            if (daysLeft <= 3) return <Tag color="orange">Due soon</Tag>;
                                            return <Tag color="green">Ahead</Tag>;
                                        })()}
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

                        {/* Sub-tasks Section */}
                        {!isEditing && (
                            <div className="section" style={{ marginTop: 16 }}>
                                <SubTaskList
                                    parentTask={task}
                                    subTasks={task.subTasks || []}
                                    onRefresh={() => taskId && loadTaskData(taskId)}
                                />
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
                                                                {comment.attachments && comment.attachments.length > 0 && (
                                                                    <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                                        <Image.PreviewGroup>
                                                                            {comment.attachments.map(att => (
                                                                                <Image
                                                                                    key={att.id}
                                                                                    src={getImageUrl(att)}
                                                                                    alt={att.filename}
                                                                                    width={120}
                                                                                    height={90}
                                                                                    style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }}
                                                                                    fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iOTAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI2MCIgeT0iNDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNhYWEiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="
                                                                                />
                                                                            ))}
                                                                        </Image.PreviewGroup>
                                                                    </div>
                                                                )}
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
                                        style={{ marginBottom: 8 }}
                                    />
                                    {pendingFiles.length > 0 && (
                                        <div style={{ marginBottom: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            {pendingFiles.map((file, idx) => (
                                                <Tag
                                                    key={idx}
                                                    closable
                                                    onClose={() => setPendingFiles(prev => prev.filter((_, i) => i !== idx))}
                                                    icon={<PictureOutlined />}
                                                >
                                                    {file.name.length > 20 ? file.name.slice(0, 17) + '...' : file.name}
                                                </Tag>
                                            ))}
                                        </div>
                                    )}
                                    <Space>
                                        <Upload
                                            beforeUpload={(file) => {
                                                setPendingFiles(prev => [...prev, file]);
                                                return false;
                                            }}
                                            showUploadList={false}
                                            accept="image/jpeg,image/png,image/gif,image/webp"
                                            multiple
                                        >
                                            <Button icon={<PaperClipOutlined />}>
                                                Attach Image
                                            </Button>
                                        </Upload>
                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            onClick={handleAddComment}
                                            loading={submittingComment}
                                            disabled={!newComment.trim() && pendingFiles.length === 0}
                                        >
                                            Post Comment
                                        </Button>
                                    </Space>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
