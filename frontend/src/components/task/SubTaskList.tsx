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
    Modal,
    DatePicker,
} from 'antd';
import {
    PlusOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    UserOutlined,
    DeleteOutlined,
    SyncOutlined,
    SwapOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { taskService, type Task } from '../../services/taskService';
import { STATUS_CONFIG } from '../../constants';

const { Text } = Typography;
const { Option } = Select;

interface SubTaskListProps {
    parentTask: Task;
    subTasks: Task[];
    onRefresh: () => void;
    projectMembers?: { id: string; name: string }[];
}

export const SubTaskList: React.FC<SubTaskListProps> = ({ parentTask, subTasks, onRefresh, projectMembers }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newStartDate, setNewStartDate] = useState<Dayjs | null>(null);
    const [newDueDate, setNewDueDate] = useState<Dayjs | null>(null);
    const [newAssigneeId, setNewAssigneeId] = useState<string | undefined>(undefined);
    const [submitting, setSubmitting] = useState(false);

    // Status change modal state
    const [statusChangeModal, setStatusChangeModal] = useState<{
        visible: boolean;
        subTaskId: string;
        fromStatus: string;
        toStatus: string;
    }>({ visible: false, subTaskId: '', fromStatus: '', toStatus: '' });
    const [statusChangeNote, setStatusChangeNote] = useState('');
    const [statusChangeLoading, setStatusChangeLoading] = useState(false);

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
                startDate: newStartDate ? newStartDate.toISOString() : undefined,
                dueDate: newDueDate ? newDueDate.toISOString() : undefined,
                assigneeIds: newAssigneeId ? [newAssigneeId] : undefined,
            });
            setNewTitle('');
            setNewStartDate(null);
            setNewDueDate(null);
            setNewAssigneeId(undefined);
            setShowAddForm(false);
            message.success('Sub-task added');
            onRefresh();
        } catch (error) {
            message.error('Failed to add sub-task');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = (subTaskId: string, newStatus: string) => {
        const subTask = subTasks.find(t => t.id === subTaskId);
        if (!subTask || subTask.status === newStatus) return;
        setStatusChangeNote('');
        setStatusChangeModal({
            visible: true,
            subTaskId,
            fromStatus: subTask.status,
            toStatus: newStatus,
        });
    };

    const handleStatusChangeConfirm = async () => {
        if (!statusChangeNote.trim()) {
            message.warning('กรุณากรอกเหตุผลที่เปลี่ยนสถานะ');
            return;
        }
        const { subTaskId, toStatus } = statusChangeModal;
        const progress = toStatus === 'DONE' ? 100 : toStatus === 'IN_PROGRESS' ? 50 : 0;
        setStatusChangeLoading(true);
        try {
            await taskService.updateTaskStatus(subTaskId, { status: toStatus, progress, note: statusChangeNote.trim() });
            message.success('Status updated');
            setStatusChangeModal(prev => ({ ...prev, visible: false }));
            onRefresh();
        } catch (error) {
            message.error('Failed to update status');
        } finally {
            setStatusChangeLoading(false);
        }
    };

    const handleStatusChangeCancel = () => {
        setStatusChangeModal(prev => ({ ...prev, visible: false }));
        setStatusChangeNote('');
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

    const handleConvertToTask = async (subTaskId: string) => {
        try {
            await taskService.convertToTask(subTaskId);
            message.success('Converted to independent task');
            onRefresh();
        } catch {
            message.error('Convert failed');
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
                                <Tooltip key="convert" title="Convert to Task">
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<SwapOutlined />}
                                        onClick={() => handleConvertToTask(subTask.id)}
                                    />
                                </Tooltip>,
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
                                    <Space size={8} wrap>
                                        {subTask.assignee && (
                                            <Space size={4}>
                                                <Avatar size={16} icon={<UserOutlined />} />
                                                <Text type="secondary" style={{ fontSize: 12 }}>{subTask.assignee.name}</Text>
                                            </Space>
                                        )}
                                        {subTask.startDate && (
                                            <Text type="secondary" style={{ fontSize: 11 }}>
                                                <CalendarOutlined style={{ marginRight: 2 }} />
                                                {dayjs(subTask.startDate).format('DD MMM')}
                                            </Text>
                                        )}
                                        {subTask.dueDate && (
                                            <Text
                                                type={!isDone && dayjs(subTask.dueDate).isBefore(dayjs(), 'day') ? 'danger' : 'secondary'}
                                                style={{ fontSize: 11 }}
                                            >
                                                <CalendarOutlined style={{ marginRight: 2 }} />
                                                Due {dayjs(subTask.dueDate).format('DD MMM')}
                                                {!isDone && dayjs(subTask.dueDate).isBefore(dayjs(), 'day') && ' (overdue)'}
                                            </Text>
                                        )}
                                    </Space>
                                }
                            />
                        </List.Item>
                    );
                }}
            />

            {showAddForm ? (
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Input
                        placeholder="Sub-task title..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onPressEnter={handleAddSubTask}
                        autoFocus
                    />
                    <Space wrap size={8}>
                        <DatePicker
                            placeholder="Start Date"
                            value={newStartDate}
                            onChange={(date) => setNewStartDate(date)}
                            size="small"
                            style={{ width: 140 }}
                        />
                        <DatePicker
                            placeholder="Due Date"
                            value={newDueDate}
                            onChange={(date) => setNewDueDate(date)}
                            size="small"
                            style={{ width: 140 }}
                        />
                        {projectMembers && projectMembers.length > 0 && (
                            <Select
                                placeholder="Assignee"
                                value={newAssigneeId}
                                onChange={(v) => setNewAssigneeId(v)}
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                size="small"
                                style={{ width: 160 }}
                            >
                                {projectMembers.map(m => (
                                    <Option key={m.id} value={m.id}>{m.name}</Option>
                                ))}
                            </Select>
                        )}
                    </Space>
                    <Space>
                        <Button type="primary" loading={submitting} onClick={handleAddSubTask}>
                            Add
                        </Button>
                        <Button onClick={() => { setShowAddForm(false); setNewTitle(''); setNewStartDate(null); setNewDueDate(null); setNewAssigneeId(undefined); }}>
                            Cancel
                        </Button>
                    </Space>
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
        </div>
    );
};
