import React, { useState, useEffect, useMemo } from 'react';
import { taskService, type Task } from '../services/taskService';
import { Sidebar } from '../components/Sidebar';
import {
    Layout,
    Card,
    Calendar,
    Typography,
    Space,
    Tag,
    Badge,
    Modal,
    message,
    Spin,
    Progress,
    Tooltip,
} from 'antd';
import {
    CalendarOutlined,
    FolderOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../constants';
import { TaskDetailModal } from './TaskDetailModal';
import './CalendarPage.css';

const { Content } = Layout;
const { Title, Text } = Typography;

export const CalendarPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [statModalType, setStatModalType] = useState<'due' | 'overdue' | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [taskDetailVisible, setTaskDetailVisible] = useState(false);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const response = await taskService.getMyTasks({ pageSize: 500 });
            setTasks(response.tasks);
        } catch (error) {
            message.error('Failed to load tasks');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Build a map: dateStr -> Task[]
    const tasksByDate = useMemo(() => {
        const map: Record<string, Task[]> = {};
        tasks.forEach(task => {
            if (task.dueDate) {
                const d = new Date(task.dueDate);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                if (!map[key]) map[key] = [];
                map[key].push(task);
            }
        });
        return map;
    }, [tasks]);

    // Stats
    const totalWithDue = tasks.filter(t => t.dueDate).length;
    const overdueCount = tasks.filter(t => {
        if (!t.dueDate || t.status === 'DONE' || t.status === 'CANCELLED') return false;
        return new Date(t.dueDate) < new Date(new Date().toDateString());
    }).length;

    const handleDateSelect = (date: Dayjs) => {
        const dateStr = date.format('YYYY-MM-DD');
        const tasksForDate = tasksByDate[dateStr];
        if (tasksForDate && tasksForDate.length > 0) {
            setSelectedDate(dateStr);
            setIsModalVisible(true);
        }
    };

    const isOverdue = (task: Task) => {
        if (!task.dueDate || task.status === 'DONE' || task.status === 'CANCELLED') return false;
        return new Date(task.dueDate) < new Date(new Date().toDateString());
    };

    const dateCellRender = (date: Dayjs) => {
        const dateStr = date.format('YYYY-MM-DD');
        const tasksForDate = tasksByDate[dateStr] || [];
        if (tasksForDate.length === 0) return null;

        return (
            <div className="cal-cell-tasks">
                {tasksForDate.slice(0, 3).map(task => {
                    const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.TODO;
                    const overdue = isOverdue(task);
                    return (
                        <Tooltip
                            key={task.id}
                            title={
                                <div>
                                    <div style={{ fontWeight: 600 }}>{task.title}</div>
                                    {task.project && <div style={{ fontSize: 11, opacity: 0.8 }}>{task.project.name}</div>}
                                    <div style={{ fontSize: 11 }}>{statusCfg.label}{overdue ? ' — Overdue' : ''}</div>
                                </div>
                            }
                        >
                            <div
                                className={`cal-task-bar ${overdue ? 'cal-task-overdue' : ''}`}
                                style={{
                                    borderLeftColor: overdue ? '#EF4444' : statusCfg.dotColor,
                                    backgroundColor: overdue ? '#FEF2F2' : `${statusCfg.dotColor}12`,
                                }}
                            >
                                {task.project && (
                                    <span className="cal-task-bar-project">{task.project.name}</span>
                                )}
                                <span className="cal-task-bar-title">{task.title}</span>
                            </div>
                        </Tooltip>
                    );
                })}
                {tasksForDate.length > 3 && (
                    <div className="cal-task-more">+{tasksForDate.length - 3} more</div>
                )}
            </div>
        );
    };

    const selectedTasks = selectedDate ? (tasksByDate[selectedDate] || []) : [];

    // Tasks for stat modals
    const tasksWithDue = useMemo(() => tasks.filter(t => t.dueDate), [tasks]);
    const overdueTasks = useMemo(() => tasks.filter(t => {
        if (!t.dueDate || t.status === 'DONE' || t.status === 'CANCELLED') return false;
        return new Date(t.dueDate) < new Date(new Date().toDateString());
    }), [tasks]);
    const statModalTasks = statModalType === 'due' ? tasksWithDue : statModalType === 'overdue' ? overdueTasks : [];

    return (
        <Layout className="calendar-layout">
            <Sidebar />

            <Layout>
                <Content className="calendar-content">
                    <div className="calendar-page-header">
                        <div>
                            <Title level={2} style={{ margin: 0, fontSize: 48 }}>Calendar</Title>
                            <Text type="secondary" style={{ fontSize: 30 }}>Tasks from all your projects</Text>
                        </div>
                        <div className="shared-legend">
                            <div className="shared-legend-item"><div className="shared-legend-bar" style={{ backgroundColor: STATUS_CONFIG.TODO.dotColor }} /><span>To Do</span></div>
                            <div className="shared-legend-item"><div className="shared-legend-bar" style={{ backgroundColor: STATUS_CONFIG.IN_PROGRESS.dotColor }} /><span>In Progress</span></div>
                            <div className="shared-legend-item"><div className="shared-legend-bar" style={{ backgroundColor: STATUS_CONFIG.DONE.dotColor }} /><span>Done</span></div>
                            <div className="shared-legend-item"><div className="shared-legend-bar" style={{ backgroundColor: STATUS_CONFIG.HOLD.dotColor }} /><span>Hold</span></div>
                            <div className="shared-legend-item"><div className="shared-legend-bar" style={{ backgroundColor: '#EF4444' }} /><span>Overdue</span></div>
                        </div>
                    </div>

                    {/* Stats summary */}
                    <div className="cal-stats-row">
                        <div className="cal-stat-item cal-stat-clickable" onClick={() => setStatModalType('due')}>
                            <CalendarOutlined style={{ fontSize: 24, color: '#667eea' }} />
                            <div>
                                <div className="cal-stat-value">{totalWithDue}</div>
                                <div className="cal-stat-label">Tasks with due date</div>
                            </div>
                        </div>
                        <div className="cal-stat-item cal-stat-overdue cal-stat-clickable" onClick={() => setStatModalType('overdue')}>
                            <CalendarOutlined style={{ fontSize: 24, color: '#cf1322' }} />
                            <div>
                                <div className="cal-stat-value" style={{ color: overdueCount > 0 ? '#cf1322' : undefined }}>{overdueCount}</div>
                                <div className="cal-stat-label">Overdue</div>
                            </div>
                        </div>
                    </div>

                    <Spin spinning={loading}>
                        <Card className="calendar-card">
                            <Calendar
                                cellRender={dateCellRender}
                                onSelect={handleDateSelect}
                            />
                        </Card>
                    </Spin>
                </Content>
            </Layout>

            {/* Stat tasks modal (due / overdue) */}
            <Modal
                title={
                    <Space>
                        <CalendarOutlined />
                        <span>{statModalType === 'overdue' ? 'Overdue Tasks' : 'Tasks with Due Date'}</span>
                        <Badge count={statModalTasks.length} style={{ backgroundColor: statModalType === 'overdue' ? '#cf1322' : '#667eea' }} />
                    </Space>
                }
                open={statModalType !== null}
                onCancel={() => setStatModalType(null)}
                footer={null}
                width={560}
            >
                <div className="cal-modal-tasks">
                    {statModalTasks.length === 0 ? (
                        <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: 24 }}>No tasks</Text>
                    ) : (
                        statModalTasks.map(task => {
                            const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.TODO;
                            const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
                            const overdue = isOverdue(task);
                            return (
                                <div key={task.id} className="cal-modal-task-card cal-modal-task-clickable" onClick={() => { setStatModalType(null); setSelectedTaskId(task.id); setTaskDetailVisible(true); }}>
                                    <div className="cal-modal-task-color" style={{ background: overdue ? '#EF4444' : statusCfg.color }} />
                                    <div className="cal-modal-task-body">
                                        {task.project && (
                                            <div className="cal-modal-task-project">
                                                <FolderOutlined />
                                                <span>{task.project.name}</span>
                                            </div>
                                        )}
                                        <div className="cal-modal-task-title">{task.title}</div>
                                        <div className="cal-modal-task-meta">
                                            <Tag color={overdue ? 'red' : statusCfg.tagColor}>
                                                {overdue ? 'Overdue' : statusCfg.label}
                                            </Tag>
                                            <span
                                                className="cal-modal-priority-badge"
                                                style={{
                                                    color: priorityCfg.color,
                                                    background: priorityCfg.bg,
                                                    border: `1px solid ${priorityCfg.color}30`,
                                                }}
                                            >
                                                {priorityCfg.label}
                                            </span>
                                            {task.assignee && (
                                                <span className="cal-modal-task-assignee">
                                                    <UserOutlined /> {task.assignee.name}
                                                </span>
                                            )}
                                        </div>
                                        {task.dueDate && (
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                Due: {new Date(task.dueDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </Text>
                                        )}
                                        {task.progress > 0 && (
                                            <Progress percent={task.progress} size="small" strokeColor={overdue ? '#EF4444' : statusCfg.color} />
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </Modal>

            {/* Tasks for selected date modal */}
            <Modal
                title={
                    <Space>
                        <CalendarOutlined />
                        <span>Tasks on {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
                        <Badge count={selectedTasks.length} style={{ backgroundColor: '#667eea' }} />
                    </Space>
                }
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={560}
            >
                <div className="cal-modal-tasks">
                    {selectedTasks.map(task => {
                        const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.TODO;
                        const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
                        return (
                            <div key={task.id} className="cal-modal-task-card cal-modal-task-clickable" onClick={() => { setIsModalVisible(false); setSelectedTaskId(task.id); setTaskDetailVisible(true); }}>
                                <div className="cal-modal-task-color" style={{ background: statusCfg.color }} />
                                <div className="cal-modal-task-body">
                                    {task.project && (
                                        <div className="cal-modal-task-project">
                                            <FolderOutlined />
                                            <span>{task.project.name}</span>
                                        </div>
                                    )}
                                    <div className="cal-modal-task-title">{task.title}</div>
                                    <div className="cal-modal-task-meta">
                                        <Tag color={statusCfg.tagColor}>{statusCfg.label}</Tag>
                                        <span
                                            className="cal-modal-priority-badge"
                                            style={{
                                                color: priorityCfg.color,
                                                background: priorityCfg.bg,
                                                border: `1px solid ${priorityCfg.color}30`,
                                            }}
                                        >
                                            {priorityCfg.label}
                                        </span>
                                        {task.assignee && (
                                            <span className="cal-modal-task-assignee">
                                                <UserOutlined /> {task.assignee.name}
                                            </span>
                                        )}
                                    </div>
                                    {task.progress > 0 && (
                                        <Progress percent={task.progress} size="small" strokeColor={statusCfg.color} />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Modal>

            <TaskDetailModal
                visible={taskDetailVisible}
                taskId={selectedTaskId}
                onClose={() => { setTaskDetailVisible(false); setSelectedTaskId(null); }}
                onUpdate={loadTasks}
            />
        </Layout>
    );
};
