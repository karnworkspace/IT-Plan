import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Avatar, Button, Typography, Tooltip } from 'antd';
import {
    FolderOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    DashboardOutlined,
    AppstoreOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { NotificationPopover } from '../notification/NotificationPopover';
import SenaDlogo from '../../assets/SenaDlogo.png';
import './Sidebar.css';

const { Sider } = Layout;
const { Title, Text } = Typography;

export const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
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
        <Sider width={collapsed ? 64 : 260} className={`app-sider ${collapsed ? 'collapsed' : ''}`}>
            <div className="logo">
                <img src={SenaDlogo} alt="SENA" style={{ height: 36, objectFit: 'contain' }} />
                {!collapsed && <Title level={4} style={{ margin: 0, color: 'white', letterSpacing: '0.5px' }}>SENA</Title>}
            </div>

            <div className="sidebar-menu">
                {menuItems.map((item) => {
                    const menuEl = (
                        <div
                            key={item.path}
                            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            {item.icon}
                            {!collapsed && <span className="menu-label">{item.label}</span>}
                        </div>
                    );
                    return collapsed ? (
                        <Tooltip key={item.path} title={item.label} placement="right">
                            {menuEl}
                        </Tooltip>
                    ) : (
                        <React.Fragment key={item.path}>{menuEl}</React.Fragment>
                    );
                })}
            </div>

            <div className="sidebar-toggle">
                <button
                    className="toggle-btn"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </button>
            </div>

            <div className="sidebar-user">
                <div style={{ display: 'flex', justifyContent: collapsed ? 'center' : 'space-between', alignItems: 'center', width: '100%', marginBottom: collapsed ? 0 : 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar style={{ backgroundColor: '#3B82F6' }}>{user?.name?.charAt(0) || 'U'}</Avatar>
                        {!collapsed && <Text style={{ color: 'white', maxWidth: 120 }} ellipsis>{user?.name || 'User'}</Text>}
                    </div>
                    {!collapsed && <NotificationPopover />}
                </div>
                {!collapsed && (
                    <Button
                        type="default"
                        ghost
                        block
                        onClick={handleLogout}
                        style={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.15)' }}
                    >
                        Logout
                    </Button>
                )}
            </div>
        </Sider>
    );
};
