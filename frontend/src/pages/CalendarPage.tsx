import React, { useState, useEffect } from 'react';
import { taskService, type Task } from '../services/taskService';
import { projectService, type Project } from '../services/projectService';
import {
    Layout,
    Card,
    Calendar,
    Typography,
    Space,
    Tag,
    Button,
    Select,
    Modal,
    message,
    Spin,
} from 'antd';
import {
    CalendarOutlined,
    FolderOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import './CalendarPage.css';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export const CalendarPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | undefined>(undefined);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        loadData();
    }, [selectedProject]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Load projects if not loaded
            if (projects.length === 0) {
                const projectsResponse = await projectService.getProjects({ pageSize: 100 });
                setProjects(projectsResponse.projects);
            }

            // Load tasks
            const tasksResponse = await taskService.getTasks(
                selectedProject || projects[0]?.id || '',
                { pageSize: 100 }
            );
            setTasks(tasksResponse.tasks);
        } catch (error) {
            message.error('Failed to load tasks');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectChange = (value: string) => {
        setSelectedProject(value);
    };

    const handleTaskClick = (date: Dayjs) => {
        const dateStr = date.format('YYYY-MM-DD');
        const tasksForDate = tasks.filter(task => {
            if (task.dueDate) {
                const taskDate = new Date(task.dueDate);
                const formattedTaskDate = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}-${String(taskDate.getDate()).padStart(2, '0')}`;
                return formattedTaskDate === dateStr;
            }
            return false;
        });

        if (tasksForDate.length === 1) {
            setSelectedTask(tasksForDate[0]);
            setIsModalVisible(true);
        } else if (tasksForDate.length > 1) {
            message.info(`Found ${tasksForDate.length} tasks on this date`);
        }
    };

    const dateCellRender = (date: Dayjs) => {
        const dateStr = date.format('YYYY-MM-DD');
        const tasksForDate = tasks.filter(task => {
            if (task.dueDate) {
                const taskDate = new Date(task.dueDate);
                const formattedTaskDate = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}-${String(taskDate.getDate()).padStart(2, '0')}`;
                return formattedTaskDate === dateStr;
            }
            return false;
        });

        return (
            <div className="calendar-date-cell">
                {tasksForDate.slice(0, 2).map(task => (
                    <div key={task.id} className="task-dot" style={{ backgroundColor: getTaskColor(task.status) }} />
                ))}
                {tasksForDate.length > 2 && (
                    <div className="task-count">+{tasksForDate.length - 2}</div>
                )}
            </div>
        );
    };

    const getTaskColor = (status: string) => {
        switch (status) {
            case 'TODO':
                return '#8c8c8c';
            case 'IN_PROGRESS':
                return '#1890ff';
            case 'IN_REVIEW':
                return '#fa8c16';
            case 'DONE':
                return '#52c41a';
            case 'BLOCKED':
                return '#f5222d';
            default:
                return '#d9d9d9';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'TODO':
                return <ClockCircleOutlined style={{ color: '#8c8c8c' }} />;
            case 'IN_PROGRESS':
                return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
            case 'IN_REVIEW':
                return <ClockCircleOutlined style={{ color: '#fa8c16' }} />;
            case 'DONE':
                return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
            case 'BLOCKED':
                return <ClockCircleOutlined style={{ color: '#f5222d' }} />;
            default:
                return <ClockCircleOutlined />;
        }
    };

    return (
        <Layout className="calendar-layout">
            <Sider width={250} className="calendar-sider">
                <div className="logo">
                    <CalendarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0, color: 'white' }}>Calendar</Title>
                </div>

                <div className="sidebar-menu">
                    <div className="menu-item">
                        <FolderOutlined /> Dashboard
                    </div>
                    <div className="menu-item">
                        <FolderOutlined /> Projects
                    </div>
                    <div className="menu-item">
                        <CheckCircleOutlined /> My Tasks
                    </div>
                    <div className="menu-item active">
                        <CalendarOutlined /> Calendar
                    </div>
                </div>
            </Sider>

            <Layout>
                <Header className="calendar-header">
                    <Title level={3}>Calendar</Title>
                    <Space>
                        <Select
                            placeholder="Select Project"
                            style={{ width: 200 }}
                            allowClear
                            value={selectedProject}
                            onChange={handleProjectChange}
                        >
                            {projects.map(project => (
                                <Option key={project.id} value={project.id}>
                                    {project.name}
                                </Option>
                            ))}
                        </Select>
                    </Space>
                </Header>

                <Content className="calendar-content">
                    <Spin spinning={loading}>
                        <Card className="calendar-card">
                            <Calendar
                                cellRender={dateCellRender}
                                onSelect={handleTaskClick}
                            />
                        </Card>
                    </Spin>
                </Content>
            </Layout>

            <Modal
                title="Task Details"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>
                        Close
                    </Button>,
                ]}
            >
                {selectedTask && (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: 8 }}>
                                {selectedTask.title}
                            </Text>
                            <Space>
                                {getStatusIcon(selectedTask.status)}
                                <Tag>{selectedTask.status.replace(/_/g, ' ')}</Tag>
                            </Space>
                        </div>

                        {selectedTask.description && (
                            <div>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                                    Description
                                </Text>
                                <Text>{selectedTask.description}</Text>
                            </div>
                        )}

                        {selectedTask.dueDate && (
                            <div>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                                    Due Date
                                </Text>
                                <Text>
                                    <CalendarOutlined /> {new Date(selectedTask.dueDate).toLocaleDateString()}
                                </Text>
                            </div>
                        )}

                        {selectedTask.assignee && (
                            <div>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                                    Assignee
                                </Text>
                                <Text>{selectedTask.assignee.name}</Text>
                            </div>
                        )}
                    </Space>
                )}
            </Modal>
        </Layout>
    );
};
