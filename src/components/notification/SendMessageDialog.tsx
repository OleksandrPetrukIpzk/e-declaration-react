import {
    Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel,
    MenuItem, Select, Stack, Tab, Tabs, TextField
} from "@mui/material";
import { useState } from "react";
import { ClinicType } from "../../types/clinic.types";
import { UserType } from "../../types/userTypes";
import {
    Notifications as NotificationsIcon,
    Send as SendIcon,
    MarkEmailRead as ReadIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Message as MessageIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';

export const SendMessageDialog = ({open,
                                      onClose,
                                      connections,
                                      clinics,
                                      onSend }: {open: boolean;
    onClose: () => void;
    connections: UserType[];
    clinics: ClinicType[];
    onSend: (data: any) => Promise<void>;}) => {
    const [messageType, setMessageType] = useState('connections');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
    const [selectedClinic, setSelectedClinic] = useState<number | ''>('');
    const [clinicTarget, setClinicTarget] = useState<'admins' | 'workers' | 'all'>('all');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) return;

        setLoading(true);
        try {
            if (messageType === 'connections') {
                if (selectedUsers.length === 0) return;
                await onSend({
                    type: 'connections',
                    recipientIds: selectedUsers.map(u => u.id),
                    title,
                    message
                });
            } else if (messageType === 'clinic') {
                if (!selectedClinic) return;
                await onSend({
                    type: 'clinic',
                    clinicId: selectedClinic,
                    title,
                    message,
                    target: clinicTarget
                });
            }

            setTitle('');
            setMessage('');
            setSelectedUsers([]);
            setSelectedClinic('');
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Відправити повідомлення</DialogTitle>
            <DialogContent>
                <Tabs
                    value={messageType}
                    onChange={(e, v) => setMessageType(v)}
                    sx={{ mb: 2 }}
                >
                    <Tab value="connections" label="З'єднанням" icon={<PersonIcon />} iconPosition="start" />
                    <Tab value="clinic" label="Клініці" icon={<BusinessIcon />} iconPosition="start" />
                </Tabs>

                {messageType === 'connections' && (
                    <Autocomplete
                        multiple
                        options={connections}
                        getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''} (${option.email})`}
                        value={selectedUsers}
                        onChange={(e, newValue) => setSelectedUsers(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} label="Вибрати отримувачів" margin="normal" fullWidth />
                        )}
                        sx={{ mb: 2 }}
                    />
                )}

                {messageType === 'clinic' && (
                    <Stack spacing={2} sx={{ mb: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Вибрати клініку</InputLabel>
                            <Select
                                value={selectedClinic}
                                label="Вибрати клініку"
                                onChange={(e) => setSelectedClinic(e.target.value as number)}
                            >
                                {clinics.map((clinic) => (
                                    <MenuItem key={clinic.id} value={clinic.id}>
                                        {clinic.clinicName} - {clinic.clinicAddress}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Кому відправити</InputLabel>
                            <Select
                                value={clinicTarget}
                                label="Кому відправити"
                                onChange={(e) => setClinicTarget(e.target.value as 'admins' | 'workers' | 'all')}
                            >
                                <MenuItem value="admins">Тільки адмінам</MenuItem>
                                <MenuItem value="workers">Тільки працівникам</MenuItem>
                                <MenuItem value="all">Всім (адміни + працівники)</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                )}

                <TextField
                    fullWidth
                    label="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    required
                />

                <TextField
                    fullWidth
                    label="Повідомлення"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    margin="normal"
                    multiline
                    rows={4}
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Скасувати</Button>
                <Button
                    onClick={handleSend}
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                    disabled={loading}
                >
                    Відправити
                </Button>
            </DialogActions>
        </Dialog>
    );
}
