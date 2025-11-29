import React, { useState, useEffect, useRef } from 'react';
import {
    IconButton,
    Badge,
    Tooltip,
    Fab,
    Box,
    Typography,
    Snackbar,
    Alert,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Chip
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    NotificationsActive as NotificationsActiveIcon,
    MarkEmailRead as ReadIcon,
    NotificationsOff as NotificationsOffIcon
} from '@mui/icons-material';
import io from 'socket.io-client';
import api from '../../constants/axiosInterceptor';
import {useNavigate} from "react-router-dom";

interface Notification {
    id: number;
    sender: { firstName?: string; lastName?: string; email: string };
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationIndicatorProps {
    userId: number;
    variant?: 'icon' | 'fab' | 'minimal';
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    showPreview?: boolean;
    maxPreviewItems?: number;
    onNotificationClick?: (notification: Notification) => void;
    onViewAllClick?: () => void;
}

const notificationAPI = {
    async getUnreadCount() {
        const response = await api.get('/notifications/unread');
        return response.data.length || 0;
    },

    async getRecentUnread(limit = 5) {
        const response = await api.get(`/notifications/unread?limit=${limit}`);
        return response.data || [];
    },

    async markAsRead(notificationId: number) {
        const response = await api.put(`/notifications/${notificationId}/read`);
        return response.data;
    },

    async markAllAsRead() {
        const response = await api.put('/notifications/mark-all-read');
        return response.data;
    }
};

function useWebSocket(userId: number) {
    const socketRef = useRef<any>(null);
    const [isConnected, setIsConnected] = useState(false);

    const connect = () => {
        if (!socketRef.current) {
            socketRef.current = io('http://localhost:3005', {
                query: { userId },
                transports: ['websocket', 'polling'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            socketRef.current.on('connect', () => {
                setIsConnected(true);
                console.log('WebSocket connected for user:', userId);
            });

            socketRef.current.on('disconnect', () => {
                setIsConnected(false);
                console.log('WebSocket disconnected');
            });

            socketRef.current.on('connected', (data: any) => {
                console.log('Server confirmed connection:', data);
            });

            socketRef.current.on('connect_error', (error: any) => {
                console.error('WebSocket connection error:', error);
                setIsConnected(false);
            });
        }
    };

    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    };

    useEffect(() => {
        return () => disconnect();
    }, []);

    const on = (event: string, callback: (data: any) => void) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    };

    const off = (event: string) => {
        if (socketRef.current) {
            socketRef.current.off(event);
        }
    };

    return { connect, disconnect, on, off, isConnected };
}

function NotificationPreview({
                                 notifications,
                                 anchorEl,
                                 open,
                                 onClose,
                                 onMarkAsRead,
                                 onMarkAllAsRead,
                                 onViewAll,
                                 onNotificationClick
                             }: {
    notifications: Notification[];
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    onMarkAsRead: (id: number) => void;
    onMarkAllAsRead: () => void;
    onViewAll: () => void;
    onNotificationClick?: (notification: Notification) => void;
}) {
    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'щойно';
        if (diffMins < 60) return `${diffMins} хв тому`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} год тому`;
        return `${Math.floor(diffMins / 1440)} дн тому`;
    };

    return (
        <Menu
            anchorEl={anchorEl}
    open={open}
    onClose={onClose}
    PaperProps={{
        sx: { width: 320, maxHeight: 400 }
    }}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
>
    <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
    <Typography variant="h6">Нотифікації</Typography>
        </Box>

    {notifications.length === 0 ? (
        <MenuItem disabled>
        <NotificationsOffIcon sx={{ mr: 2 }} />
    <Typography>Немає нових нотифікацій</Typography>
    </MenuItem>
    ) : (
        notifications.map((notification) => (
            <MenuItem
                key={notification.id}
        onClick={() => {
        if (onNotificationClick) {
            onNotificationClick(notification);
        }
        onClose();
    }}
        sx={{
        whiteSpace: 'normal',
            maxWidth: '100%',
            backgroundColor: 'action.hover'
    }}
    >
        <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
        <Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ maxWidth: '70%' }}>
        {notification.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
        {formatTimeAgo(notification.createdAt)}
        </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{
        overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 0.5
    }}>
        {notification.message}
        </Typography>
        <Typography variant="caption" color="text.secondary">
        від {notification.sender.firstName || notification.sender.email}
        </Typography>
        </Box>
        </MenuItem>
    ))
    )}

    {notifications.length > 0 && (
        <>
            <Divider />
        <MenuItem onClick={() => { onMarkAllAsRead(); onClose(); }}>
        <ListItemIcon>
            <ReadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Позначити всі як прочитані</ListItemText>
    </MenuItem>
    </>
    )}

    <Divider />
    <MenuItem onClick={() => { onViewAll(); onClose(); }}>
    <ListItemIcon>
        <NotificationsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Переглянути всі</ListItemText>
    </MenuItem>
    </Menu>
);
}

export default function NotificationIndicator({
                                                  userId,
                                                  variant = 'icon',
                                                  position = 'top-right',
                                                  showPreview = true,
                                                  maxPreviewItems = 5,
                                                  onNotificationClick,
                                                  onViewAllClick
                                              }: NotificationIndicatorProps) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info' as 'info' | 'success' | 'error'
    });

    const { connect, disconnect, on, off, isConnected } = useWebSocket(userId);

    useEffect(() => {
        loadUnreadCount();
        loadRecentNotifications();
        connect();

        return () => {
            disconnect();
        };
    }, [userId]);

    useEffect(() => {
        if (isConnected) {
            on('new_notification', (notification: Notification) => {
                setUnreadCount(prev => prev + 1);
                setRecentNotifications(prev => [notification, ...prev.slice(0, maxPreviewItems - 1)]);

                showSnackbar(`${notification.title}`, 'info');
            });

            on('notification_read', (data: { notificationId: number }) => {
                setUnreadCount(prev => Math.max(0, prev - 1));
                setRecentNotifications(prev =>
                    prev.filter(n => n.id !== data.notificationId)
                );
            });

            on('all_notifications_read', () => {
                setUnreadCount(0);
                setRecentNotifications([]);
            });
        }

        return () => {
            off('new_notification');
            off('notification_read');
            off('all_notifications_read');
        };
    }, [isConnected, maxPreviewItems]);

    const loadUnreadCount = async () => {
        try {
            const count = await notificationAPI.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Error loading unread count:', error);
        }
    };

    const loadRecentNotifications = async () => {
        if (!showPreview) return;

        try {
            const notifications = await notificationAPI.getRecentUnread(maxPreviewItems);
            setRecentNotifications(notifications);
        } catch (error) {
            console.error('Error loading recent notifications:', error);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (showPreview && unreadCount > 0) {
            setAnchorEl(event.currentTarget);
        } else if (onViewAllClick) {
            onViewAllClick();
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await notificationAPI.markAsRead(notificationId);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setRecentNotifications(prev =>
                prev.filter(n => n.id !== notificationId)
            );
        } catch (error) {
            showSnackbar('Помилка позначення як прочитане', 'error');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setUnreadCount(0);
            setRecentNotifications([]);
            showSnackbar('Всі нотифікації позначені як прочитані', 'success');
        } catch (error) {
            showSnackbar('Помилка позначення як прочитані', 'error');
        }
    };

    const showSnackbar = (message: string, severity: 'info' | 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const getPositionStyle = () => {
        const positions = {
            'top-right': { position: 'fixed' as const, top: 20, right: 20, zIndex: 1000 },
            'top-left': { position: 'fixed' as const, top: 20, left: 20, zIndex: 1000 },
            'bottom-right': { position: 'fixed' as const, bottom: 20, right: 20, zIndex: 1000 },
            'bottom-left': { position: 'fixed' as const, bottom: 20, left: 20, zIndex: 1000 }
        };
        return positions[position];
    };

    const renderIndicator = () => {
        const badge = (
            <Badge
                badgeContent={unreadCount}
        color="error"
        max={99}
        invisible={unreadCount === 0}
    >
        <NotificationsIcon />
        </Badge>
    );

        switch (variant) {
            case 'fab':
                return (
                    <Fab
                        color={unreadCount > 0 ? "secondary" : "default"}
        onClick={handleClick}
        sx={getPositionStyle()}
            >
            {badge}
            </Fab>
    );

    case 'minimal':
        return (
            <Box
                onClick={handleClick}
        sx={{
            cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1
        }}
    >
        {unreadCount > 0 ? (
            <Chip
                icon={<NotificationsActiveIcon />}
            label={unreadCount}
            color="error"
            size="small"
            variant={isConnected ? "filled" : "outlined"}
            />
        ) : (
            <NotificationsIcon
                color={isConnected ? "primary" : "disabled"}
            />
        )}
        </Box>
    );

    case 'icon':
    default:
        return (
            <Tooltip title={`${unreadCount} нових нотифікацій`}>
        <IconButton
            onClick={handleClick}
        color={unreadCount > 0 ? "secondary" : "default"}
    >
        {badge}
        </IconButton>
        </Tooltip>
    );
    }
    };

    return (
        <>
            {renderIndicator()}

    {/* Превью нотифікацій */}
    {showPreview && (
        <NotificationPreview
            notifications={recentNotifications}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onViewAll={() => onViewAllClick?.()}
        onNotificationClick={onNotificationClick}
        />
    )}

    {/* Snackbar для сповіщень */}
    <Snackbar
        open={snackbar.open}
    autoHideDuration={4000}
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
    <Alert
        severity={snackbar.severity}
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    variant="filled"
        >
        {snackbar.message}
        </Alert>
        </Snackbar>
        </>
);
}

export function HeaderNotificationIndicator({ userId, onViewAllClick }: {
    userId: number;
    onViewAllClick?: () => void;
}) {
    const navigate = useNavigate();
    return (
        <NotificationIndicator
            userId={userId}
    variant="icon"
    showPreview={true}
    maxPreviewItems={3}
    onViewAllClick={() => navigate('/notifications')}
    />
);
}

export function FloatingNotificationIndicator({
                                                  userId,
                                                  position = 'bottom-right',
                                                  onViewAllClick
                                              }: {
    userId: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    onViewAllClick?: () => void;
}) {
    return (
        <NotificationIndicator
            userId={userId}
    variant="fab"
    position={position}
    showPreview={true}
    maxPreviewItems={5}
    onViewAllClick={onViewAllClick}
    />
);
}

export function MinimalNotificationIndicator({ userId, onViewAllClick }: {
    userId: number;
    onViewAllClick?: () => void;
}) {
    return (
        <NotificationIndicator
            userId={userId}
    variant="minimal"
    showPreview={false}
    onViewAllClick={onViewAllClick}
    />
);
}

