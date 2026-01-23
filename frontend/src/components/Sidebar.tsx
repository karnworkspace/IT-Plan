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
                <Avatar>{user?.name?.charAt(0) || 'U'}</Avatar>
                <Text style={{ color: 'white' }}>{user?.name || 'User'}</Text>
                <Button
                    type="text"
                    onClick={handleLogout}
                    style={{ color: 'white', marginTop: 8 }}
                >
                    Logout
                </Button>
            </div>
        </Sider>
    );
};
