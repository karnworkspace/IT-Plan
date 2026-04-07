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
    Timeline,
    Select,
    Empty,
    message,
    Form,
    Card,
    Popconfirm,
    Upload,
    Image,
    Mentions,
    Tooltip,
} from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    SendOutlined,
    PlusOutlined,
    MessageOutlined,
    HistoryOutlined,
    PaperClipOutlined,
    PictureOutlined,
    TagOutlined,
    SwapOutlined,
    EditOutlined,
    DeleteOutlined,
    FilePdfOutlined,
    FileExcelOutlined,
    VideoCameraOutlined,
    FileOutlined,
    DownloadOutlined,
} from '@ant-design/icons';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { taskService, type Task, type StatusChangeLog } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { commentService, type Comment, type Attachment } from '../../services/commentService';
import { dailyUpdateService, type DailyUpdate } from '../../services/dailyUpdateService';
import { tagService } from '../../services/tagService';
import type { Tag as TagType } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { SubTaskList } from '../../components/task/SubTaskList';
import './TaskDetailModal.css';

// Extend dayjs
dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
interface TaskDetailModalProps {
    visible: boolean;
    taskId: string | null;
    onClose: () => void;
    onUpdate: () => void;
}

import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../constants';
import { STATUS_ICONS } from '../../constants/statusIcons';

// --- ClickableTag: คลิก tag badge → navigate ไปหน้า TagTasksPage + edit/delete ---
const ClickableTag: React.FC<{
    tag: { id: string; name: string; color: string };
    onNavigate: (tagId: string) => void;
    onEdit?: (tag: { id: string; name: string; color: string }) => void;
    onDelete?: (tagId: string) => void;
}> = ({ tag, onNavigate, onEdit, onDelete }) => (
    <Tag
        color={tag.color}
        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
        onClick={() => onNavigate(tag.id)}
    >
        {tag.name}
        {onEdit && (
            <EditOutlined
                style={{ fontSize: 10, marginLeft: 2, opacity: 0.7 }}
                onClick={(e) => { e.stopPropagation(); onEdit(tag); }}
            />
        )}
        {onDelete && (
            <DeleteOutlined
                style={{ fontSize: 10, opacity: 0.7, color: '#ff4d4f' }}
                onClick={(e) => { e.stopPropagation(); onDelete(tag.id); }}
            />
        )}
    </Tag>
);

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
    visible,
    taskId,
    onClose,
    onUpdate,
}) => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState<Task | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [updates, setUpdates] = useState<DailyUpdate[]>([]);
    const [projectMembers, setProjectMembers] = useState<{ id: string; name: string; email: string }[]>([]);
    const [allTags, setAllTags] = useState<TagType[]>([]);
    const [tagSearch, setTagSearch] = useState('');
    const [convertModalVisible, setConvertModalVisible] = useState(false);
    const [parentTaskOptions, setParentTaskOptions] = useState<{ id: string; title: string }[]>([]);

    // Edit mode states
    const [isEditing, setIsEditing] = useState(false);
    const [editForm] = Form.useForm();

    // New comment state
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    // New update state
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateForm] = Form.useForm();
    const [submittingUpdate, setSubmittingUpdate] = useState(false);

    // Status change modal + logs
    const [statusChangeLogs, setStatusChangeLogs] = useState<StatusChangeLog[]>([]);
    const [statusChangeModal, setStatusChangeModal] = useState<{
        visible: boolean;
        fromStatus: string;
        toStatus: string;
    }>({ visible: false, fromStatus: '', toStatus: '' });
    const [statusChangeNote, setStatusChangeNote] = useState('');
    const [statusChangeLoading, setStatusChangeLoading] = useState(false);

    // Tag edit/delete state
    const [editingTag, setEditingTag] = useState<{ id: string; name: string; color: string } | null>(null);
    const [editTagName, setEditTagName] = useState('');
    const [editTagColor, setEditTagColor] = useState('');

    const TAG_COLORS = ['blue', 'green', 'red', 'orange', 'purple', 'cyan', 'magenta', 'gold', 'lime', 'volcano'];

    const handleEditTag = (tag: { id: string; name: string; color: string }) => {
        setEditingTag(tag);
        setEditTagName(tag.name);
        setEditTagColor(tag.color);
    };

    const handleSaveTag = async () => {
        if (!editingTag || !editTagName.trim()) return;
        try {
            const updated = await tagService.updateTag(editingTag.id, { name: editTagName.trim(), color: editTagColor });
            setAllTags(prev => prev.map(t => t.id === updated.id ? updated : t));
            if (task && taskId) await loadTaskData(taskId);
            setEditingTag(null);
            message.success('Tag updated');
        } catch {
            message.error('Failed to update tag');
        }
    };

    const handleDeleteTag = async (tagId: string) => {
        try {
            await tagService.deleteTag(tagId);
            setAllTags(prev => prev.filter(t => t.id !== tagId));
            if (task && taskId) await loadTaskData(taskId);
            message.success('Tag deleted');
        } catch {
            message.error('Failed to delete tag');
        }
    };

    useEffect(() => {
        if (visible) {
            tagService.getAllTags().then(setAllTags).catch(() => {});
        }
    }, [visible]);

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
            const [taskData, commentsData, updatesData, logsData] = await Promise.all([
                taskService.getTask(id),
                commentService.getTaskComments(id),
                dailyUpdateService.getTaskUpdates(id),
                taskService.getStatusChangeLogs(id).catch(() => []),
            ]);

            setTask(taskData);
            setComments(commentsData);
            setUpdates(updatesData);
            setStatusChangeLogs(logsData);

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
                tagIds: taskData.taskTags?.map((tt: { tag: { id: string } }) => tt.tag.id) || [],
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
            onClose();
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

    const handleReply = async (parentCommentId: string) => {
        if (!task || !replyText.trim()) return;
        try {
            const reply = await commentService.createComment(task.id, {
                content: replyText.trim(),
                parentCommentId,
            });
            // Add reply under parent comment in state
            setComments(prev =>
                prev.map(c =>
                    c.id === parentCommentId
                        ? { ...c, replies: [...(c.replies || []), reply] }
                        : c
                )
            );
            setReplyText('');
            setReplyingTo(null);
            message.success('Reply added');
        } catch {
            message.error('Failed to reply');
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

    const handleStatusChangeConfirm = async () => {
        if (!task || !statusChangeNote.trim()) {
            message.warning('กรุณากรอกเหตุผลที่เปลี่ยนสถานะ');
            return;
        }
        const { toStatus } = statusChangeModal;
        const progress = toStatus === 'DONE' ? 100 : task.progress;
        setStatusChangeLoading(true);
        try {
            await taskService.updateTaskStatus(task.id, {
                status: toStatus,
                progress,
                note: statusChangeNote.trim(),
            });
            // Update local task state and form
            setTask({ ...task, status: toStatus as Task['status'], progress });
            editForm.setFieldsValue({ status: toStatus });
            setStatusChangeModal(prev => ({ ...prev, visible: false }));
            message.success('Status updated');
            onUpdate();
            // Refresh logs
            taskService.getStatusChangeLogs(task.id).then(setStatusChangeLogs).catch(() => {});
        } catch {
            message.error('Failed to update status');
        } finally {
            setStatusChangeLoading(false);
        }
    };

    const handleStatusChangeCancel = () => {
        setStatusChangeModal(prev => ({ ...prev, visible: false }));
        setStatusChangeNote('');
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
        <>
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
                                        <Select
                                            onChange={(newStatus: string) => {
                                                if (task && newStatus !== task.status) {
                                                    // Revert the form value, show modal instead
                                                    editForm.setFieldsValue({ status: task.status });
                                                    setStatusChangeNote('');
                                                    setStatusChangeModal({
                                                        visible: true,
                                                        fromStatus: task.status,
                                                        toStatus: newStatus,
                                                    });
                                                }
                                            }}
                                        >
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
                                    <Form.Item name="tagIds" style={{ marginBottom: 0, minWidth: 200 }}>
                                        <Select
                                            mode="multiple"
                                            placeholder="Tags"
                                            allowClear
                                            maxTagCount={3}
                                            showSearch
                                            searchValue={tagSearch}
                                            onSearch={setTagSearch}
                                            filterOption={(input, option) => {
                                                if (option?.value === '__create_new__') return true;
                                                const tag = allTags.find(t => t.id === option?.value);
                                                return tag?.name.toLowerCase().includes(input.toLowerCase()) ?? false;
                                            }}
                                            onSelect={async (value: string) => {
                                                if (value === '__create_new__') {
                                                    const name = tagSearch.trim();
                                                    setTagSearch('');
                                                    if (!name) return;
                                                    try {
                                                        const newTag = await tagService.createTag({ name });
                                                        setAllTags(prev => [...prev, newTag]);
                                                        const current: string[] = editForm.getFieldValue('tagIds') || [];
                                                        editForm.setFieldsValue({ tagIds: current.filter(v => v !== '__create_new__').concat(newTag.id) });
                                                    } catch {
                                                        message.error('Failed to create tag');
                                                        const current: string[] = editForm.getFieldValue('tagIds') || [];
                                                        editForm.setFieldsValue({ tagIds: current.filter(v => v !== '__create_new__') });
                                                    }
                                                } else {
                                                    setTagSearch('');
                                                }
                                            }}
                                        >
                                            {allTags.map(tag => (
                                                <Option key={tag.id} value={tag.id}>
                                                    <Tag color={tag.color} style={{ marginRight: 4 }}>{tag.name}</Tag>
                                                </Option>
                                            ))}
                                            {tagSearch.trim() && !allTags.some(t => t.name.toLowerCase() === tagSearch.trim().toLowerCase()) && (
                                                <Option key="__create_new__" value="__create_new__">
                                                    <PlusOutlined style={{ marginRight: 4 }} />Create: "{tagSearch.trim()}"
                                                </Option>
                                            )}
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
                                <div className="meta-item">
                                    <Text type="secondary"><TagOutlined style={{ marginRight: 4 }} />Tags</Text>
                                    <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                        {task.taskTags && task.taskTags.length > 0 ? (
                                            task.taskTags.map((tt: { id: string; tag: { id: string; name: string; color: string } }) => (
                                                <ClickableTag
                                                    key={tt.id}
                                                    tag={tt.tag}
                                                    onNavigate={(tagId) => { onClose(); navigate(`/tags/${tagId}`); }}
                                                    onEdit={handleEditTag}
                                                    onDelete={handleDeleteTag}
                                                />
                                            ))
                                        ) : (
                                            <Text type="secondary">No tags</Text>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Convert Task Button */}
                        {!isEditing && (
                            <div style={{ marginTop: 12 }}>
                                {!task.parentTaskId ? (
                                    <Button
                                        size="small"
                                        icon={<SwapOutlined />}
                                        onClick={async () => {
                                            if (!task.projectId) return;
                                            try {
                                                const res = await taskService.getTasks(task.projectId, { pageSize: 100 });
                                                setParentTaskOptions(
                                                    (res.tasks || [])
                                                        .filter((t: Task) => t.id !== task.id && !t.parentTaskId)
                                                        .map((t: Task) => ({ id: t.id, title: t.title }))
                                                );
                                                setConvertModalVisible(true);
                                            } catch {
                                                message.error('Failed to load tasks');
                                            }
                                        }}
                                        disabled={(task._count?.subTasks || 0) > 0}
                                    >
                                        Convert to Subtask
                                    </Button>
                                ) : (
                                    <Button
                                        size="small"
                                        icon={<SwapOutlined />}
                                        onClick={async () => {
                                            try {
                                                await taskService.convertToTask(task.id);
                                                message.success('Converted to independent task');
                                                if (taskId) loadTaskData(taskId);
                                                onUpdate();
                                            } catch {
                                                message.error('Convert failed');
                                            }
                                        }}
                                    >
                                        Move to task
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Status Change History */}
                        {statusChangeLogs.length > 0 && (
                            <>
                                <Divider />
                                <div className="section">
                                    <Title level={5}><HistoryOutlined style={{ marginRight: 8 }} />Status Change History ({statusChangeLogs.length})</Title>
                                    <Timeline mode="left">
                                        {statusChangeLogs.map(log => (
                                            <Timeline.Item
                                                key={log.id}
                                                color={STATUS_CONFIG[log.toStatus]?.dotColor || '#77787B'}
                                                label={dayjs(log.createdAt).format('MMM D, HH:mm')}
                                            >
                                                <Card size="small" className="update-card">
                                                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                                        <Space>
                                                            <Avatar size={20} style={{ backgroundColor: '#32BCAD', fontSize: 11 }}>
                                                                {log.user?.name?.[0] || 'U'}
                                                            </Avatar>
                                                            <Text strong style={{ fontSize: 12 }}>{log.user?.name || 'Unknown'}</Text>
                                                        </Space>
                                                        <Space>
                                                            <Tag color={STATUS_CONFIG[log.fromStatus]?.color}>
                                                                {STATUS_CONFIG[log.fromStatus]?.label || log.fromStatus}
                                                            </Tag>
                                                            <span>→</span>
                                                            <Tag color={STATUS_CONFIG[log.toStatus]?.color}>
                                                                {STATUS_CONFIG[log.toStatus]?.label || log.toStatus}
                                                            </Tag>
                                                        </Space>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>{log.note}</Text>
                                                    </Space>
                                                </Card>
                                            </Timeline.Item>
                                        ))}
                                    </Timeline>
                                </div>
                            </>
                        )}

                        <Divider />

                        {/* Daily Updates Section */}
                        <div className="section">
                            <Title level={5}><HistoryOutlined style={{ marginRight: 8 }} />Daily Updates ({updates.length})</Title>
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
                                        <Form.Item name="notes" label={<span>Notes <span style={{ color: '#ff4d4f' }}>*</span></span>} rules={[{ required: true, message: 'กรุณากรอก Notes' }]}>
                                            <TextArea rows={3} placeholder="What did you accomplish today?" />
                                        </Form.Item>
                                        <Space>
                                            <Button onClick={() => setShowUpdateForm(false)}>Cancel</Button>
                                            <Button
                                                type="primary"
                                                loading={submittingUpdate}
                                                onClick={handleAddUpdate}
                                            >
                                                Update
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
                        </div>

                        <Divider />

                        {/* Sub-tasks Section */}
                        <div className="section">
                            <SubTaskList
                                parentTask={task}
                                subTasks={task.subTasks || []}
                                onRefresh={() => taskId && loadTaskData(taskId)}
                                projectMembers={projectMembers}
                            />
                        </div>

                        <Divider />

                        {/* Comments Section */}
                        <div className="section">
                            <Title level={5}><MessageOutlined style={{ marginRight: 8 }} />Comments ({comments.length})</Title>
                            <div className="chat-comments-list">
                                {comments.length === 0 ? (
                                    <Empty description="No comments yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                ) : (
                                    comments.map(comment => {
                                        const isOwn = user?.id === comment.userId;
                                        return (
                                            <div key={comment.id}>
                                                {/* Parent comment bubble */}
                                                <div className={`chat-bubble-row ${isOwn ? 'own' : ''}`}>
                                                    {!isOwn && (
                                                        <Avatar size={32} style={{ backgroundColor: '#32BCAD', flexShrink: 0 }}>
                                                            {comment.user?.name?.[0] || 'U'}
                                                        </Avatar>
                                                    )}
                                                    <div className={`chat-bubble ${isOwn ? 'own' : ''}`}>
                                                        <div className="chat-bubble-header">
                                                            <Text strong style={{ fontSize: 12 }}>{comment.user?.name}</Text>
                                                            <Text type="secondary" style={{ fontSize: 11 }}>{dayjs(comment.createdAt).fromNow()}</Text>
                                                        </div>
                                                        <div className="chat-bubble-body">
                                                            <Text>{comment.content}</Text>
                                                        </div>
                                                        {comment.attachments && comment.attachments.length > 0 && (
                                                            <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                                {/* Image attachments — preview group */}
                                                                {comment.attachments.some(att => att.mimetype?.startsWith('image/')) && (
                                                                    <Image.PreviewGroup>
                                                                        {comment.attachments.filter(att => att.mimetype?.startsWith('image/')).map(att => (
                                                                            <Image
                                                                                key={att.id}
                                                                                src={getImageUrl(att)}
                                                                                alt={att.filename}
                                                                                width={100}
                                                                                height={75}
                                                                                style={{ objectFit: 'cover', borderRadius: 6, border: '1px solid #e8e8e8' }}
                                                                                fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iOTAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI2MCIgeT0iNDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNhYWEiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="
                                                                            />
                                                                        ))}
                                                                    </Image.PreviewGroup>
                                                                )}
                                                                {/* Non-image attachments — file cards */}
                                                                {comment.attachments.filter(att => !att.mimetype?.startsWith('image/')).map(att => {
                                                                    const isPdf = att.mimetype === 'application/pdf';
                                                                    const isExcel = att.mimetype?.includes('spreadsheet') || att.mimetype?.includes('excel');
                                                                    const isVideo = att.mimetype?.startsWith('video/');
                                                                    const icon = isPdf ? <FilePdfOutlined style={{ color: '#D94F4F', fontSize: 20 }} />
                                                                        : isExcel ? <FileExcelOutlined style={{ color: '#32BCAD', fontSize: 20 }} />
                                                                        : isVideo ? <VideoCameraOutlined style={{ color: '#2E7D9B', fontSize: 20 }} />
                                                                        : <FileOutlined style={{ color: '#77787B', fontSize: 20 }} />;
                                                                    return (
                                                                        <a
                                                                            key={att.id}
                                                                            href={getImageUrl(att)}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            style={{
                                                                                display: 'flex', alignItems: 'center', gap: 8,
                                                                                padding: '8px 12px', background: '#F8FAFC',
                                                                                border: '1px solid #E2E8F0', borderRadius: 8,
                                                                                textDecoration: 'none', color: '#0F172A',
                                                                                fontSize: 12, maxWidth: 200, transition: 'all 0.2s',
                                                                            }}
                                                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#32BCAD'; (e.currentTarget as HTMLElement).style.background = '#F0FDF9'; }}
                                                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.background = '#F8FAFC'; }}
                                                                        >
                                                                            {icon}
                                                                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                                                                                {att.filename}
                                                                            </span>
                                                                            <DownloadOutlined style={{ color: '#94A3B8', fontSize: 12, flexShrink: 0 }} />
                                                                        </a>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                        <div className="chat-bubble-actions">
                                                            <Button type="link" size="small" onClick={() => { setReplyingTo(comment.id); setReplyText(''); }}>
                                                                Reply
                                                            </Button>
                                                            {isOwn && (
                                                                <Popconfirm title="Delete comment?" onConfirm={() => handleDeleteComment(comment.id)}>
                                                                    <Button type="link" size="small" danger>Delete</Button>
                                                                </Popconfirm>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isOwn && (
                                                        <Avatar size={32} style={{ backgroundColor: '#32BCAD', flexShrink: 0 }}>
                                                            {comment.user?.name?.[0] || 'U'}
                                                        </Avatar>
                                                    )}
                                                </div>

                                                {/* Replies */}
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div className="chat-replies">
                                                        {comment.replies.map(reply => {
                                                            const isReplyOwn = user?.id === reply.userId;
                                                            return (
                                                                <div key={reply.id} className={`chat-bubble-row reply ${isReplyOwn ? 'own' : ''}`}>
                                                                    {!isReplyOwn && (
                                                                        <Avatar size={24} style={{ backgroundColor: '#722ED1', flexShrink: 0 }}>
                                                                            {reply.user?.name?.[0] || 'U'}
                                                                        </Avatar>
                                                                    )}
                                                                    <div className={`chat-bubble reply ${isReplyOwn ? 'own' : ''}`}>
                                                                        <div className="chat-bubble-header">
                                                                            <Text strong style={{ fontSize: 11 }}>{reply.user?.name}</Text>
                                                                            <Text type="secondary" style={{ fontSize: 10 }}>{dayjs(reply.createdAt).fromNow()}</Text>
                                                                        </div>
                                                                        <div className="chat-bubble-body">
                                                                            <Text style={{ fontSize: 13 }}>{reply.content}</Text>
                                                                        </div>
                                                                    </div>
                                                                    {isReplyOwn && (
                                                                        <Avatar size={24} style={{ backgroundColor: '#722ED1', flexShrink: 0 }}>
                                                                            {reply.user?.name?.[0] || 'U'}
                                                                        </Avatar>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                {/* Reply input */}
                                                {replyingTo === comment.id && (
                                                    <div className="chat-reply-input">
                                                        <Input
                                                            size="small"
                                                            placeholder={`Reply to ${comment.user?.name}...`}
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            onPressEnter={() => handleReply(comment.id)}
                                                            autoFocus
                                                            suffix={
                                                                <Space size={4}>
                                                                    <Button
                                                                        type="text"
                                                                        size="small"
                                                                        icon={<SendOutlined />}
                                                                        onClick={() => handleReply(comment.id)}
                                                                        disabled={!replyText.trim()}
                                                                    />
                                                                    <Button
                                                                        type="text"
                                                                        size="small"
                                                                        onClick={() => setReplyingTo(null)}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                </Space>
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="comment-input-area">
                                <Mentions
                                    value={newComment}
                                    onChange={(val) => setNewComment(val)}
                                    placeholder="Write a comment... Use @ to mention"
                                    rows={2}
                                    style={{ marginBottom: 8 }}
                                    options={projectMembers.map(m => ({
                                        value: m.name,
                                        label: m.name,
                                    }))}
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
                                            const maxSize = 20 * 1024 * 1024; // 20MB
                                            if (file.size > maxSize) {
                                                message.error(`ไฟล์ ${file.name} มีขนาดเกิน 20MB`);
                                                return Upload.LIST_IGNORE;
                                            }
                                            setPendingFiles(prev => [...prev, file]);
                                            return false;
                                        }}
                                        showUploadList={false}
                                        accept="image/jpeg,image/png,image/gif,image/webp,.pdf,.xlsx,.xls,video/mp4,video/quicktime"
                                        multiple
                                    >
                                        <Tooltip title="รองรับ: รูปภาพ, PDF, Excel, วิดีโอ (สูงสุด 20MB/ไฟล์)">
                                            <Button icon={<PaperClipOutlined />}>
                                                แนบไฟล์
                                            </Button>
                                        </Tooltip>
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
                        </div>
                    </div>
                </div>
            </div>
        </Modal>

        {/* Status Change Note Modal */}
        <Modal
            title="เหตุผลที่เปลี่ยนสถานะ"
            open={statusChangeModal.visible}
            onOk={handleStatusChangeConfirm}
            onCancel={handleStatusChangeCancel}
            okText="Confirm"
            cancelText="Cancel"
            confirmLoading={statusChangeLoading}
            okButtonProps={{ disabled: !statusChangeNote.trim() }}
            maskClosable={false}
            zIndex={1100}
        >
            <div style={{ marginBottom: 16 }}>
                <Space>
                    <Tag color={STATUS_CONFIG[statusChangeModal.fromStatus]?.color}>
                        {STATUS_CONFIG[statusChangeModal.fromStatus]?.label || statusChangeModal.fromStatus}
                    </Tag>
                    <span style={{ fontSize: 16 }}>→</span>
                    <Tag color={STATUS_CONFIG[statusChangeModal.toStatus]?.color}>
                        {STATUS_CONFIG[statusChangeModal.toStatus]?.label || statusChangeModal.toStatus}
                    </Tag>
                </Space>
            </div>
            <Input.TextArea
                rows={3}
                placeholder="กรุณาระบุเหตุผลที่เปลี่ยนสถานะ..."
                value={statusChangeNote}
                onChange={(e) => setStatusChangeNote(e.target.value)}
                autoFocus
            />
        </Modal>

        {/* Convert to Subtask Modal */}
        <Modal
            title="Convert to Subtask — Select Parent Task"
            open={convertModalVisible}
            onCancel={() => setConvertModalVisible(false)}
            footer={null}
            width={500}
        >
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {parentTaskOptions.length === 0 ? (
                    <Empty description="No available parent tasks" />
                ) : (
                    parentTaskOptions.map(opt => (
                        <div
                            key={opt.id}
                            style={{
                                padding: '10px 12px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0',
                                borderRadius: 6,
                            }}
                            className="convert-option-item"
                            onClick={async () => {
                                try {
                                    await taskService.convertToSubtask(task.id, opt.id);
                                    message.success(`Converted to subtask under "${opt.title}"`);
                                    setConvertModalVisible(false);
                                    if (taskId) loadTaskData(taskId);
                                    onUpdate();
                                } catch {
                                    message.error('Convert failed');
                                }
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                            <Text strong>{opt.title}</Text>
                        </div>
                    ))
                )}
            </div>
        </Modal>

        {/* Tag Edit Modal */}
        <Modal
            title="Edit Tag"
            open={!!editingTag}
            onCancel={() => setEditingTag(null)}
            onOk={handleSaveTag}
            okText="Save"
            width={360}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>Tag Name</Text>
                    <Input
                        value={editTagName}
                        onChange={e => setEditTagName(e.target.value)}
                        placeholder="Tag name"
                        style={{ marginTop: 4 }}
                    />
                </div>
                <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>Color</Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                        {TAG_COLORS.map(c => (
                            <Tag
                                key={c}
                                color={c}
                                style={{
                                    cursor: 'pointer',
                                    border: editTagColor === c ? '2px solid #1677ff' : '2px solid transparent',
                                    borderRadius: 4,
                                }}
                                onClick={() => setEditTagColor(c)}
                            >
                                {c}
                            </Tag>
                        ))}
                    </div>
                </div>
                <div style={{ marginTop: 4 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Preview: </Text>
                    <Tag color={editTagColor}>{editTagName || 'Tag'}</Tag>
                </div>
            </div>
        </Modal>
        </>
    );
};
