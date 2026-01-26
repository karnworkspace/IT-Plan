import React, { useState, useEffect } from 'react';
import {
    Popover,
    Badge,
    Button,
    List,
    Avatar,
    Typography,
    Tabs,
    Empty,
    Spin,
    message,
    Tooltip,
} from 'antd';
import {
    BellOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    MessageOutlined,
    TeamOutlined,
    FileTextOutlined,
    DeleteOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';
import { notificationService, type Notification } from '../services/notificationService';
import './NotificationPopover.css';

dayjs.extend(relativeTime);

const { Text, Title } = Typography;
const { TabPane } = Tabs;

export const NotificationPopover: React.FC = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadUnreadCount, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (visible) {
            loadNotifications();
            markVisibleAsRead(); // Optional: Auto mark read when opened
        }
    }, [visible]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getNotifications({ limit: 20 });
            setNotifications(data.notifications);

            // Update unread count
            const unreadData = await notificationService.getUnreadCount();
            setUnreadCount(unreadData.count);
        } catch (error) {
            console.error('Failed to load notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const data = await notificationService.getUnreadCount();
            setUnreadCount(data.count);
        } catch (error) {
            console.error('Failed to load unread count', error);
        }
    };

    const markVisibleAsRead = async () => {
        // Implement logic to mark displayed notifications as read if needed
        // For now we use manual "Mark as read"
    };

    const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            message.error('Failed to mark as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            message.success('All marked as read');
        } catch (error) {
            message.error('Failed to mark all as read');
        }
    };

    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (notifications.find(n => n.id === id)?.isRead === false) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            message.error('Failed to delete notification');
        }
    };

    const handleItemClick = (notification: Notification) => {
        // Mark as read first
        if (!notification.isRead) {
            handleMarkAsRead(notification.id);
        }

        // Navigate
        setVisible(false);
        if (notification.projectId && !notification.taskId) {
            navigate(`/projects/${notification.projectId}`);
        } else if (notification.projectId && notification.taskId) {
            // TaskDetailModal logic handles opening by ID ideally, 
            // but currently we need to navigate to project page
            // Ideally we pass state or query param
            navigate(`/projects/${notification.projectId}?taskId=${notification.taskId}`);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'TASK_ASSIGNED':
                return <FileTextOutlined style={{ color: '#1890ff' }} />;
            case 'TASK_COMPLETED':
                return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
            case 'TASK_DUE_SOON':
                return <ClockCircleOutlined style={{ color: '#fa8c16' }} />;
            case 'TASK_OVERDUE':
                return <ClockCircleOutlined style={{ color: '#ff4d4f' }} />;
            case 'COMMENT_ADDED':
                return <MessageOutlined style={{ color: '#722ed1' }} />;
            case 'PROJECT_INVITE':
                return <TeamOutlined style={{ color: '#13c2c2' }} />;
            default:
                return <BellOutlined />;
        }
    };

    const renderNotificationItem = (item: Notification) => (
        <List.Item
            className={`notification-item ${!item.isRead ? 'unread' : ''}`}
            onClick={() => handleItemClick(item)}
            actions={[
                !item.isRead && (
                    <Tooltip title="Mark as read">
                        <Button
                            type="text"
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={(e) => handleMarkAsRead(item.id, e)}
                        />
                    </Tooltip>
                ),
                <Tooltip title="Delete">
                    <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => handleDelete(item.id, e)}
                    />
                </Tooltip>
            ]}
        >
            <List.Item.Meta
                avatar={
                    <Avatar
                        icon={getIcon(item.type)}
                        style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'inherit' }}
                    />
                }
                title={
                    <div className="notification-title">
                        <Text strong={!item.isRead}>{item.title}</Text>
                        <Text type="secondary" className="notification-time">
                            {dayjs(item.createdAt).fromNow()}
                        </Text>
                    </div>
                }
                description={
                    <div className="notification-desc">
                        <Text type="secondary" ellipsis={{ tooltip: item.message }}>
                            {item.message}
                        </Text>
                    </div>
                }
            />
        </List.Item>
    );

    const content = (
        <div className="notification-popover-content">
            <div className="notification-header">
                <Title level={5} style={{ margin: 0 }}>Notifications</Title>
                {unreadCount > 0 && (
                    <Button type="link" size="small" onClick={handleMarkAllAsRead}>
                        Mark all as read
                    </Button>
                )}
            </div>

            <Tabs defaultActiveKey="all" size="small">
                <TabPane tab="All" key="all">
                    {loading && notifications.length === 0 ? (
                        <div className="loading-state"><Spin /></div>
                    ) : notifications.length > 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={notifications}
                            renderItem={renderNotificationItem}
                            className="notification-list"
                        />
                    ) : (
                        <Empty description="No notifications" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                </TabPane>
                <TabPane tab={`Unread (${unreadCount})`} key="unread">
                    {notifications.filter(n => !n.isRead).length > 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={notifications.filter(n => !n.isRead)}
                            renderItem={renderNotificationItem}
                            className="notification-list"
                        />
                    ) : (
                        <Empty description="No unread notifications" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                </TabPane>
            </Tabs>
        </div>
    );

    return (
        <Popover
            content={content}
            trigger="click"
            open={visible}
            onOpenChange={setVisible}
            placement="bottomRight"
            overlayClassName="notification-popover"
        >
            <Badge count={unreadCount} overflowCount={99}>
                <Button
                    type="text"
                    icon={<BellOutlined style={{ fontSize: 20, color: 'white' }} />}
                    className="notification-btn"
                />
            </Badge>
        </Popover>
    );
};
