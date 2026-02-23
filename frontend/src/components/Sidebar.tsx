import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Avatar, Button, Typography } from 'antd';
import {
    FolderOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    DashboardOutlined,
    AppstoreOutlined,
    SettingOutlined,
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

    const isAdmin = user?.role === 'ADMIN';

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
        { path: '/timeline', label: 'Projects', icon: <FolderOutlined /> },
        { path: '/my-tasks', label: 'My Tasks', icon: <CheckCircleOutlined /> },
        { path: '/calendar', label: 'Calendar', icon: <CalendarOutlined /> },
        ...(isAdmin ? [
            { path: '/configuration', label: 'Configuration', icon: <SettingOutlined /> },
        ] : []),
    ];

    return (
        <Sider width={260} className="app-sider">
            <div className="logo">
                <div className="logo-icon">
                    <AppstoreOutlined />
                </div>
                <Title level={4} style={{ margin: 0, color: 'white', letterSpacing: '0.5px' }}>SENA</Title>
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
                        <Avatar style={{ backgroundColor: '#3B82F6' }}>{user?.name?.charAt(0) || 'U'}</Avatar>
                        <Text style={{ color: 'white', maxWidth: 120 }} ellipsis>{user?.name || 'User'}</Text>
                    </div>
                    <NotificationPopover />
                </div>
                <Button
                    type="default"
                    ghost
                    block
                    onClick={handleLogout}
                    style={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.15)' }}
                >
                    Logout
                </Button>
            </div>
        </Sider>
    );
};
