import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Avatar, Button, Typography } from 'antd';
import {
    FolderOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    TeamOutlined,
    DashboardOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { NotificationPopover } from './NotificationPopover';
import './Sidebar.css';

const { Sider } = Layout;
const { Title, Text } = Typography;

export const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
        { path: '/projects', label: 'Projects', icon: <FolderOutlined /> },
        { path: '/my-tasks', label: 'My Tasks', icon: <CheckCircleOutlined /> },
        { path: '/calendar', label: 'Calendar', icon: <CalendarOutlined /> },
    ];

    return (
        <Sider width={250} className="app-sider">
            <div className="logo">
                <TeamOutlined style={{ fontSize: 24 }} />
                <Title level={4} style={{ margin: 0, color: 'white' }}>TaskFlow</Title>
            </div>

            <div className="sidebar-menu">
                {menuItems.map((item) => (
                    <div
                        key={item.path}
                        className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        {item.icon} {item.label}
                    </div>
                ))}
            </div>

            <div className="sidebar-user">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar style={{ backgroundColor: '#1890ff' }}>{user?.name?.charAt(0) || 'U'}</Avatar>
                        <Text style={{ color: 'white', maxWidth: 120 }} ellipsis>{user?.name || 'User'}</Text>
                    </div>
                    <NotificationPopover />
                </div>
                <Button
                    type="default"
                    ghost
                    block
                    onClick={handleLogout}
                    style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.4)' }}
                >
                    Logout
                </Button>
            </div>
        </Sider>
    );
};
