import {useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import {ClinicType} from "../types/clinic.types";
import { UserType } from "../types/userTypes";
import {useUserData} from "../hooks/useUserData";
import {Notification} from '../types/notification.types'
import { notificationAPI } from "../services/notificationDaoService";
import {
    Alert,
    AppBar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    Snackbar,
    Tab,
    Tabs,
    Toolbar,
    Typography
} from "@mui/material";
import {
    Notifications as NotificationsIcon,
    Send as SendIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import {NotificationsList} from "../components/notification/NotificationsList";
import {SendMessageDialog} from "../components/notification/SendMessageDialog";
import {HeaderUserInfo} from "../features/HeaderUserInfo";
import {LandingScreenHeader} from "../components/LandingScreenHeader";
export const NotificationSystem = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [connections, setConnections] = useState<UserType[]>([]);
    const [clinics, setClinics] = useState<ClinicType[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [currentTab, setCurrentTab] = useState(0);
    const [userNotificationsLoading, setUserNotificationsLoading] = useState(false);
    const [userNotificationsPage, setUserNotificationsPage] = useState(0);
    const [userNotificationsHasMore, setUserNotificationsHasMore] = useState(true);
    const [userNotificationsLoadingMore, setUserNotificationsLoadingMore] = useState(false);
    const ITEMS_PER_PAGE = 20;
    const {user} = useUserData();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const { connect, disconnect, on, off, isConnected } = useWebSocket(user?.id ?? 0);

    // Завантажити дані при запуску
    useEffect(() => {
        loadNotifications();
        loadUserNotifications();
        loadConnections();
        loadClinics();

        // Підключення до WebSocket
        connect();

        return () => {
            disconnect();
        };
    }, []);

    // WebSocket слухачі
    useEffect(() => {
        if (isConnected) {
            on('new_notification', (notification: Notification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
                showSnackbar(`Нове повідомлення: ${notification.title}`, 'info');
            });

            on('notification_read', (data: { notificationId: number }) => {
                setNotifications(prev =>
                    prev.map(n => n.id === data.notificationId ? { ...n, isRead: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            });
        }

        return () => {
            off('new_notification');
            off('notification_read');
        };
    }, [isConnected]);

    const loadNotifications = async (reset = true) => {
        if (reset) {
            setLoading(true);
            setPage(0);
        } else {
            setLoadingMore(true);
        }

        try {
            const currentPage = reset ? 0 : page;
            const result = await notificationAPI.getNotifications(ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
            
            if (reset) {
                setNotifications(result.notifications || []);
            } else {
                setNotifications(prev => [...prev, ...(result.notifications || [])]);
            }

            setHasMore(result.notifications && result.notifications.length === ITEMS_PER_PAGE);
            
            if (!reset) {
                setPage(prev => prev + 1);
            }

            const unread = await notificationAPI.getUnreadNotifications();
            setUnreadCount(unread.length || 0);
        } catch (error) {
            showSnackbar('Помилка завантаження нотифікацій', 'error');
        } finally {
            if (reset) {
                setLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    };

    const loadMoreNotifications = () => {
        if (!loadingMore && hasMore) {
            loadNotifications(false);
        }
    };

    const loadUserNotifications = async (reset = true) => {
        if (reset) {
            setUserNotificationsLoading(true);
            setUserNotificationsPage(0);
        } else {
            setUserNotificationsLoadingMore(true);
        }

        try {
            const currentPage = reset ? 0 : userNotificationsPage;
            const result = await notificationAPI.getAllMyNotifications(ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
            let notificationsArray: Notification[] = [];
            if (result?.sent?.notifications) {
                notificationsArray = result.sent.notifications;
            } else if (Array.isArray(result)) {
                notificationsArray = result;
            } else {
                notificationsArray = result?.notifications || result?.data || [];
            }
            notificationsArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
            if (reset) {
                setUserNotifications(notificationsArray);
            } else {
                setUserNotifications(prev => [...prev, ...notificationsArray]);
            }

            setUserNotificationsHasMore(notificationsArray && notificationsArray.length === ITEMS_PER_PAGE);
            
            if (!reset) {
                setUserNotificationsPage(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error loading user notifications:', error);
            showSnackbar('Помилка завантаження нотифікацій користувача', 'error');
        } finally {
            if (reset) {
                setUserNotificationsLoading(false);
            } else {
                setUserNotificationsLoadingMore(false);
            }
        }
    };

    const loadMoreUserNotifications = () => {
        if (!userNotificationsLoadingMore && userNotificationsHasMore) {
            loadUserNotifications(false);
        }
    };

    const loadConnections = async () => {
        try {
            console.log(user?.connections);
            setConnections(user?.connections ?? []);
        } catch (error) {
            console.error('Error loading connections:', error);
        }
    };

    const loadClinics = async () => {
        try {
            console.log(user);
            setClinics(user?.clinic || []);
        } catch (error) {
            console.error('Error loading clinics:', error);
        }
    };

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await notificationAPI.markAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
            showSnackbar('Позначено як прочитане', 'success');
        } catch (error) {
            showSnackbar('Помилка оновлення', 'error');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            showSnackbar('Всі нотифікації позначені як прочитані', 'success');
        } catch (error) {
            showSnackbar('Помилка оновлення', 'error');
        }
    };

    const handleSendMessage = async (data: any) => {
        try {
            if (data.type === 'connections') {
                await notificationAPI.sendToConnections({
                    recipientIds: data.recipientIds,
                    title: data.title,
                    message: data.message
                });
            } else if (data.type === 'clinic') {
                await notificationAPI.sendToClinic({
                    clinicId: data.clinicId,
                    title: data.title,
                    message: data.message,
                    target: data.target
                });
            }

            showSnackbar('Повідомлення відправлено!', 'success');
        } catch (error) {
            showSnackbar('Помилка відправки повідомлення', 'error');
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
        setSnackbar({ open: true, message, severity: severity as 'success' | 'error' });
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const handleRefresh = () => {
        if (currentTab === 0) {
            loadNotifications();
        } else {
            loadUserNotifications();
        }
    };

    return (
        <>
            <LandingScreenHeader />
        <Box sx={{ mx: 'auto', p: 2 }}>

            {/* App Bar з нотифікаціями */}
            <AppBar position="static" sx={{ mb: 3, borderRadius: 1 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Система нотифікацій
                    </Typography>

                    {/* Індикатор WebSocket підключення */}
                    <Chip
                        label={isConnected ? 'Online' : 'Offline'}
                        color={isConnected ? 'success' : 'error'}
                        size="small"
                        sx={{ mr: 2 }}
                    />

                    <Button
                        color="inherit"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                        sx={{ mr: 2 }}
                    >
                        Оновити
                    </Button>

                    <Button
                        color="inherit"
                        startIcon={<SendIcon />}
                        onClick={() => setShowSendDialog(true)}
                        sx={{ mr: 2 }}
                    >
                        Відправити
                    </Button>

                    <IconButton
                        color="inherit"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Панель нотифікацій (коротка версія для AppBar) */}
            {showNotifications && (
                <Card sx={{ mb: 3, maxHeight: '400px', overflow: 'auto' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Останні нотифікації
                        </Typography>
                        <NotificationsList
                            notifications={notifications.slice(0, 5)}
                            onMarkAsRead={handleMarkAsRead}
                            onMarkAllAsRead={handleMarkAllAsRead}
                            loading={loading}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Табована структура */}
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={currentTab} onChange={handleTabChange}>
                        <Tab label="Системні нотифікації" />
                        <Tab label="Відправлені мною" />
                    </Tabs>
                </Box>

                <CardContent>
                    {/* Таб 0 - Системні нотифікації */}
                    {currentTab === 0 && (
                        <>
                            <NotificationsList
                                notifications={notifications}
                                onMarkAsRead={handleMarkAsRead}
                                onMarkAllAsRead={handleMarkAllAsRead}
                                loading={loading}
                            />
                            
                            {/* Кнопка завантажити більше для системних нотифікацій */}
                            {hasMore && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={loadMoreNotifications}
                                        disabled={loadingMore}
                                        size="large"
                                    >
                                        {loadingMore ? 'Завантаження...' : 'Завантажити більше'}
                                    </Button>
                                </Box>
                            )}
                        </>
                    )}

                    {/* Таб 1 - Нотифікації користувача */}
                    {currentTab === 1 && (
                        <>
                            <NotificationsList
                                notifications={userNotifications}
                                onMarkAsRead={handleMarkAsRead}
                                onMarkAllAsRead={handleMarkAllAsRead}
                                loading={userNotificationsLoading}
                            />
                            
                            {/* Кнопка завантажити більше для нотифікацій користувача */}
                            {userNotificationsHasMore && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={loadMoreUserNotifications}
                                        disabled={userNotificationsLoadingMore}
                                        size="large"
                                    >
                                        {userNotificationsLoadingMore ? 'Завантаження...' : 'Завантажити більше'}
                                    </Button>
                                </Box>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Діалог відправки повідомлень */}
            <SendMessageDialog
                open={showSendDialog}
                onClose={() => setShowSendDialog(false)}
                connections={connections}
                clinics={clinics}
                onSend={handleSendMessage}
            />

            {/* Snackbar для повідомлень */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
        </>
    );
}