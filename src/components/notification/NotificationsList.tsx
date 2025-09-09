import {
    Notifications as NotificationsIcon,
    Send as SendIcon,
    MarkEmailRead as ReadIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Message as MessageIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import {Avatar, Box, Button, Chip, CircularProgress,
    Divider,
    IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Paper, Typography } from '@mui/material';
import React from 'react';
import {Notification} from '../../types/notification.types'
export const NotificationsList = ({
                                      notifications,
                                      onMarkAsRead,
                                      onMarkAllAsRead,
                                      loading
                                  }: {
    notifications: Notification[];
    onMarkAsRead: (id: number) => void;
    onMarkAllAsRead: () => void;
    loading: boolean;
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('uk-UA');
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'connection_request':
            case 'connection_accepted':
                return <PersonIcon />;
            case 'clinic_invite':
            case 'clinic_update':
                return <BusinessIcon />;
            default:
                return <MessageIcon />;
        }
    };

    const getTypeColor = (type: string): 'primary' | 'success' | 'info' | 'warning' | 'default' => {
        switch (type) {
            case 'connection_request':
                return 'primary';
            case 'connection_accepted':
                return 'success';
            case 'clinic_invite':
                return 'info';
            case 'clinic_update':
                return 'warning';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Нотифікації</Typography>
                <Button
                    onClick={onMarkAllAsRead}
                    startIcon={<ReadIcon />}
                    size="small"
                    disabled={notifications.filter(n => !n.isRead).length === 0}
                >
                    Позначити всі як прочитані
                </Button>
            </Box>

            <List>
                {notifications.map((notification) => (
                    <React.Fragment key={notification.id}>
                        <ListItem
                            sx={{
                                backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                                borderRadius: 1,
                                mb: 1,
                                border: notification.isRead ? '1px solid #e0e0e0' : '2px solid #1976d2'
                            }}
                        >
                            <Avatar sx={{ mr: 2, bgcolor: notification.isRead ? 'grey.400' : 'primary.main' }}>
                                {getTypeIcon(notification.type)}
                            </Avatar>

                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={notification.isRead ? 'normal' : 'bold'}
                                        >
                                            {notification.title}
                                        </Typography>
                                        <Chip
                                            label={notification.type.replace('_', ' ')}
                                            size="small"
                                            color={getTypeColor(notification.type)}
                                            variant="outlined"
                                        />
                                    </Box>
                                }
                                secondary={
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                            {notification.message}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Від: {notification.sender.firstName} {notification.sender.lastName} ({notification.sender.email})
                                        </Typography>
                                        {notification.relatedClinic && (
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Клініка: {notification.relatedClinic.clinicName}
                                            </Typography>
                                        )}
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {formatDate(notification.createdAt)}
                                        </Typography>
                                    </Box>
                                }
                            />

                            <ListItemSecondaryAction>
                                {!notification.isRead && (
                                    <IconButton
                                        edge="end"
                                        onClick={() => onMarkAsRead(notification.id)}
                                        title="Позначити як прочитане"
                                        color="primary"
                                    >
                                        <ReadIcon />
                                    </IconButton>
                                )}
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}

                {notifications.length === 0 && (
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            Немає нотифікацій
                        </Typography>
                    </Paper>
                )}
            </List>
        </Box>
    );
}