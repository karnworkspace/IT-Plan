import React, { useState, useEffect } from 'react';
import {
    Layout,
    Typography,
    Select,
    Spin,
    Card,
    Space,
    Tag,
    Empty,
    message,
} from 'antd';
import {
    FieldTimeOutlined,
    FolderOutlined,
} from '@ant-design/icons';
import { Sidebar } from '../components/Sidebar';
import { projectService, type Project } from '../services/projectService';
import { taskService, type Task } from '../services/taskService';
import { GanttChart } from '../components/GanttChart';
import './TimelinePage.css';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export const TimelinePage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        if (selectedProjectIds.length > 0) {
            loadTasksForProjects(selectedProjectIds);
        } else {
            setAllTasks([]);
        }
    }, [selectedProjectIds]);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const response = await projectService.getProjects({ pageSize: 100 });
            setProjects(response.projects || []);
            // Select all active projects by default
            const activeIds = (response.projects || [])
                .filter(p => p.status === 'ACTIVE')
                .map(p => p.id);
            setSelectedProjectIds(activeIds);
        } catch (error) {
            message.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const loadTasksForProjects = async (projectIds: string[]) => {
        try {
            setLoadingTasks(true);
            const results = await Promise.all(
                projectIds.map(id => taskService.getTasks(id, { pageSize: 200 }))
            );

            const tasks: Task[] = [];
            results.forEach((result, idx) => {
                const projectId = projectIds[idx];
                const project = projects.find(p => p.id === projectId);
                (result.tasks || []).forEach(task => {
                    tasks.push({
                        ...task,
                        project: task.project || (project ? { id: project.id, name: project.name, color: project.color } : undefined),
                    });
                });
            });

            setAllTasks(tasks);
        } catch (error) {
            message.error('Failed to load tasks');
        } finally {
            setLoadingTasks(false);
        }
    };

    // Calculate combined date range
    const selectedProjects = projects.filter(p => selectedProjectIds.includes(p.id));
    const earliestStart = selectedProjects
        .filter(p => p.startDate)
        .map(p => p.startDate!)
        .sort()[0];
    const latestEnd = selectedProjects
        .filter(p => p.endDate)
        .map(p => p.endDate!)
        .sort()
        .reverse()[0];

    return (
        <Layout className="timeline-layout">
            <Sidebar />

            <Layout className="timeline-main">
                <div className="timeline-page-header">
                    <div className="header-content">
                        <div>
                            <Title level={2} style={{ color: '#1a1a2e', margin: 0 }}>
                                <FieldTimeOutlined style={{ marginRight: 12 }} />
                                Timeline View
                            </Title>
                            <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                                View tasks across multiple projects on a timeline
                            </Text>
                        </div>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
                            Select Projects:
                        </Text>
                        <Select
                            mode="multiple"
                            placeholder="Select projects to display..."
                            value={selectedProjectIds}
                            onChange={setSelectedProjectIds}
                            style={{ width: '100%', maxWidth: 800 }}
                            size="large"
                            maxTagCount={5}
                            optionFilterProp="children"
                        >
                            {projects.map(project => (
                                <Option key={project.id} value={project.id}>
                                    <Space>
                                        <div style={{
                                            width: 12, height: 12, borderRadius: 3,
                                            backgroundColor: project.color, display: 'inline-block'
                                        }} />
                                        {project.name}
                                        <Tag color={project.status === 'ACTIVE' ? 'success' : 'default'}>
                                            {project.status}
                                        </Tag>
                                    </Space>
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {/* Selected project summary */}
                    {selectedProjectIds.length > 0 && (
                        <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <Tag color="blue">{selectedProjectIds.length} projects selected</Tag>
                            <Tag color="cyan">{allTasks.length} total tasks</Tag>
                            <Tag color="green">{allTasks.filter(t => t.status === 'DONE').length} completed</Tag>
                            <Tag color="orange">{allTasks.filter(t => t.startDate || t.dueDate).length} with dates</Tag>
                        </div>
                    )}
                </div>

                <Content className="timeline-content">
                    <Spin spinning={loading || loadingTasks}>
                        {selectedProjectIds.length === 0 ? (
                            <Card style={{ textAlign: 'center', padding: 60 }}>
                                <Empty
                                    image={<FolderOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                                    description="Select one or more projects to view their timeline"
                                />
                            </Card>
                        ) : allTasks.length === 0 ? (
                            <Card style={{ textAlign: 'center', padding: 60 }}>
                                <Empty description="No tasks found in selected projects" />
                            </Card>
                        ) : (
                            <div>
                                {/* Project color legend */}
                                <div style={{
                                    marginBottom: 16, padding: '12px 16px',
                                    background: '#fff', borderRadius: 8,
                                    border: '1px solid #f0f0f0',
                                    display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center'
                                }}>
                                    <Text strong style={{ fontSize: 13 }}>Projects:</Text>
                                    {selectedProjects.map(p => (
                                        <Space key={p.id} size={4}>
                                            <div style={{
                                                width: 14, height: 14, borderRadius: 4,
                                                backgroundColor: p.color
                                            }} />
                                            <Text style={{ fontSize: 13 }}>{p.name}</Text>
                                        </Space>
                                    ))}
                                </div>

                                <GanttChart
                                    tasks={allTasks}
                                    projectStartDate={earliestStart}
                                    projectEndDate={latestEnd}
                                />
                            </div>
                        )}
                    </Spin>
                </Content>
            </Layout>
        </Layout>
    );
};
