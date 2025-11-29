import {
    Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel,
    MenuItem, Select, Stack, Tab, Tabs, TextField
} from "@mui/material";
import React, { useState } from "react";
import { ClinicType } from "../../types/clinic.types";
import { UserType } from "../../types/userTypes";
import {
    Send as SendIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    LocalHospital as DoctorIcon,
} from '@mui/icons-material';

export const SendMessageDialog = ({open,
                                      onClose,
                                      connections,
                                      clinics,
                                      doctors = [],
                                      onSend }: {open: boolean;
    onClose: () => void;
    connections: UserType[];
    clinics: ClinicType[];
    doctors?: UserType[];
    onSend: (data: any) => Promise<void>;}) => {
    const [messageType, setMessageType] = useState('connections');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
    const [selectedDoctors, setSelectedDoctors] = useState<UserType[]>([]);
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
            } else if (messageType === 'doctors') {
                if (selectedDoctors.length === 0) return;
                await onSend({
                    type: 'connections',
                    recipientIds: selectedDoctors.map(u => u.id),
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
            setSelectedDoctors([]);
            setSelectedClinic('');
            onClose();
        } finally {
            setLoading(false);
        }
    };
    
    const hasConnections = connections && connections.length > 0;
    const hasClinics = clinics && clinics.length > 0;
    const hasDoctors = doctors && doctors.length > 0;
    
    React.useEffect(() => {
        if (hasDoctors && !hasConnections && !hasClinics) {
            setMessageType('doctors');
        } else if (hasConnections && !hasDoctors && !hasClinics) {
            setMessageType('connections');
        } else if (hasClinics && !hasConnections && !hasDoctors) {
            setMessageType('clinic');
        }
    }, [hasConnections, hasClinics, hasDoctors]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Відправити повідомлення</DialogTitle>
            <DialogContent>
                <Tabs
                    value={messageType}
                    onChange={(e, v) => setMessageType(v)}
                    sx={{ mb: 2 }}
                >
                    {hasConnections && (
                        <Tab value="connections" label="З'єднанням" icon={<PersonIcon />} iconPosition="start" />
                    )}
                    {hasDoctors && (
                        <Tab value="doctors" label="Лікарям" icon={<DoctorIcon />} iconPosition="start" />
                    )}
                    {hasClinics && (
                        <Tab value="clinic" label="Клініці" icon={<BusinessIcon />} iconPosition="start" />
                    )}
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

                {messageType === 'doctors' && (
                    <Autocomplete
                        multiple
                        options={doctors}
                        getOptionLabel={(option) => `Лікар: ${option.firstName || ''} ${option.lastName || ''} (${option.email})`}
                        value={selectedDoctors}
                        onChange={(e, newValue) => setSelectedDoctors(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} label="Вибрати лікарів" margin="normal" fullWidth />
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
