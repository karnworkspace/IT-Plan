import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Typography } from 'antd';
import {
    SettingOutlined,
    UserOutlined,
    LayoutOutlined,
} from '@ant-design/icons';
import { Sidebar } from '../components/Sidebar';
import './ConfigurationPage.css';

const { Content } = Layout;
const { Title, Text } = Typography;

const configMenus = [
    {
        key: 'user',
        icon: <UserOutlined />,
        title: 'User',
        description: 'Manage users, roles and permissions',
        color: '#3B82F6',
        path: '/configuration/users',
    },
    {
        key: 'mockup-1',
        icon: <LayoutOutlined />,
        title: 'Mockup',
        description: 'Frame placeholder',
        color: '#8B5CF6',
        path: null,
    },
    {
        key: 'mockup-2',
        icon: <LayoutOutlined />,
        title: 'Mockup',
        description: 'Frame placeholder',
        color: '#10B981',
        path: null,
    },
];

export const ConfigurationPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout>
                <Content className="config-content">
                    <div className="config-page-header">
                        <Title level={2} style={{ margin: 0, fontSize: 48 }}>
                            <SettingOutlined style={{ marginRight: 10 }} />
                            Configuration
                        </Title>
                        <Text type="secondary" style={{ fontSize: 30 }}>System settings — Admin only</Text>
                    </div>

                    <div className="config-grid">
                        {configMenus.map(item => (
                            <div
                                key={item.key}
                                className={`config-card ${item.path ? '' : 'config-card-disabled'}`}
                                onClick={() => item.path && navigate(item.path)}
                            >
                                <div className="config-card-icon" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                                    {item.icon}
                                </div>
                                <div className="config-card-title">{item.title}</div>
                                <div className="config-card-desc">{item.description}</div>
                            </div>
                        ))}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};
