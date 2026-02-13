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
import './CalendarPage.css';

const { Content } = Layout;
const { Title, Text } = Typography;

// Status config (consistent with other pages)
const STATUS_CONFIG: Record<string, { color: string; label: string; tagColor: string }> = {
    TODO: { color: '#8c8c8c', label: 'To Do', tagColor: 'default' },
    IN_PROGRESS: { color: '#1890ff', label: 'In Progress', tagColor: 'processing' },
    DONE: { color: '#52c41a', label: 'Done', tagColor: 'success' },
    HOLD: { color: '#fa8c16', label: 'Hold', tagColor: 'warning' },
    CANCELLED: { color: '#595959', label: 'Cancelled', tagColor: 'error' },
};

const PRIORITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
    URGENT: { color: '#cf1322', bg: '#fff1f0', label: 'Urgent' },
    HIGH: { color: '#d4380d', bg: '#fff2e8', label: 'High' },
    MEDIUM: { color: '#d48806', bg: '#fffbe6', label: 'Medium' },
    LOW: { color: '#389e0d', bg: '#f6ffed', label: 'Low' },
};

export const CalendarPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

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

    const dateCellRender = (date: Dayjs) => {
        const dateStr = date.format('YYYY-MM-DD');
        const tasksForDate = tasksByDate[dateStr] || [];
        if (tasksForDate.length === 0) return null;

        return (
            <div className="cal-cell-tasks">
                {tasksForDate.slice(0, 3).map(task => {
                    const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.TODO;
                    return (
                        <Tooltip key={task.id} title={`${task.title} (${statusCfg.label})`}>
                            <div
                                className="cal-task-bar"
                                style={{ borderLeftColor: statusCfg.color }}
                            >
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

    return (
        <Layout className="calendar-layout">
            <Sidebar />

            <Layout>
                <Content className="calendar-content">
                    <div className="calendar-page-header">
                        <div>
                            <Title level={3} style={{ margin: 0 }}>Calendar</Title>
                            <Text type="secondary">Tasks from all your projects</Text>
                        </div>
                        <Space size="middle">
                            <div className="cal-legend-item">
                                <span className="cal-legend-dot" style={{ background: '#8c8c8c' }} />
                                <span>To Do</span>
                            </div>
                            <div className="cal-legend-item">
                                <span className="cal-legend-dot" style={{ background: '#1890ff' }} />
                                <span>In Progress</span>
                            </div>
                            <div className="cal-legend-item">
                                <span className="cal-legend-dot" style={{ background: '#52c41a' }} />
                                <span>Done</span>
                            </div>
                            <div className="cal-legend-item">
                                <span className="cal-legend-dot" style={{ background: '#fa8c16' }} />
                                <span>Hold</span>
                            </div>
                        </Space>
                    </div>

                    {/* Stats summary */}
                    <div className="cal-stats-row">
                        <div className="cal-stat-item">
                            <CalendarOutlined style={{ fontSize: 18, color: '#667eea' }} />
                            <div>
                                <div className="cal-stat-value">{totalWithDue}</div>
                                <div className="cal-stat-label">Tasks with due date</div>
                            </div>
                        </div>
                        <div className="cal-stat-item cal-stat-overdue">
                            <CalendarOutlined style={{ fontSize: 18, color: '#cf1322' }} />
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
                            <div key={task.id} className="cal-modal-task-card">
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
        </Layout>
    );
};
