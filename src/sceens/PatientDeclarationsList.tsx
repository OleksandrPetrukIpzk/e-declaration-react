import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Alert,
    Snackbar,
    CircularProgress,
    Card,
    CardContent,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Divider,
} from '@mui/material';
import {
    Assignment,
    Cancel,
    Add,
    LocalHospital,
    Person,
    Download,
    Refresh,
    Warning,
    Send as SendIcon,
} from '@mui/icons-material';
import { LandingScreenHeader } from "../components/LandingScreenHeader";
import { declarationDaoService, downloadDeclarationPdf } from "../services/declarationDaoService";
import { getStatusColor, getStatusText, getScopeText, formatDate, isDeclarationExpired } from "../constants/declaration-color.constant";
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from "../services/notificationDaoService";

interface PatientDeclaration {
    id: string;
    declaration_number: string;
    declaration_request_id: string;
    start_date?: string;
    end_date?: string;
    signed_at?: string;
    status: string;
    scope: string;
    reason?: string;
    reason_description?: string;
    inserted_at: string;
    updated_at: string;
    doctor?: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
    };
    patient?: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
    };
    employee_data?: {
        position: string;
        employee_type: string;
        status: string;
    };
    division_data?: {
        name: string;
        type: string;
        status: string;
        mountain_group: boolean;
        dls_id: string;
        dls_verified: boolean;
    };
    legal_entity_data?: {
        name: string;
        short_name: string;
        legal_form: string;
        public_name: string;
        edrpou: string;
        status: string;
        email: string;
    };
    person_data?: any;
    doctor_data?: any;
}

const PatientDeclarationsList = () => {
    const navigate = useNavigate();
    const [declarations, setDeclarations] = useState<PatientDeclaration[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ open: false, type: 'success', message: '' });
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedDeclaration, setSelectedDeclaration] = useState<PatientDeclaration | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [messageDialogOpen, setMessageDialogOpen] = useState(false);
    const [messageTitle, setMessageTitle] = useState('');
    const [messageText, setMessageText] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);

    useEffect(() => {
        fetchDeclarations();
    }, []);

    const fetchDeclarations = async () => {
        setLoading(true);
        try {
            const data = await declarationDaoService.getPatientDeclarations();
            setDeclarations(data);
        } catch (error) {
            console.error('Error fetching declarations:', error);
            setSubmitStatus({
                open: true,
                type: 'error',
                message: 'Помилка завантаження декларацій',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelDeclaration = (declaration: PatientDeclaration) => {
        setSelectedDeclaration(declaration);
        setCancelDialogOpen(true);
    };

    const onCancelSubmit = async () => {
        if (!selectedDeclaration) return;

        try {
            await declarationDaoService.terminate(selectedDeclaration.id, cancelReason);

            setSubmitStatus({
                open: true,
                type: 'success',
                message: 'Декларацію успішно скасовано',
            });

            setCancelDialogOpen(false);
            setCancelReason('');
            setSelectedDeclaration(null);
            fetchDeclarations();
        } catch (error) {
            console.error('Error canceling declaration:', error);
            setSubmitStatus({
                open: true,
                type: 'error',
                message: 'Помилка при скасуванні декларації',
            });
        }
    };

    const handleDownloadPdf = async (declarationId: string) => {
        try {
            await downloadDeclarationPdf(declarationId);
        } catch (error) {
            setSubmitStatus({
                open: true,
                type: 'error',
                message: 'Помилка завантаження PDF',
            });
        }
    };

    const handleMessageDoctor = (declaration: PatientDeclaration) => {
        setSelectedDeclaration(declaration);
        setMessageDialogOpen(true);
    };

    const handleSendMessage = async () => {
        if (!selectedDeclaration?.doctor || !messageTitle.trim() || !messageText.trim()) return;

        setSendingMessage(true);
        try {
            await notificationAPI.sendToConnections({
                recipientIds: [selectedDeclaration.doctor.id],
                title: messageTitle,
                message: messageText,
                metadata: {
                    declarationId: selectedDeclaration.id,
                    declarationNumber: selectedDeclaration.declaration_number,
                }
            });

            setSubmitStatus({
                open: true,
                type: 'success',
                message: 'Повідомлення успішно відправлено',
            });

            setMessageDialogOpen(false);
            setMessageTitle('');
            setMessageText('');
            setSelectedDeclaration(null);
        } catch (error) {
            console.error('Error sending message:', error);
            setSubmitStatus({
                open: true,
                type: 'error',
                message: 'Помилка при відправці повідомлення',
            });
        } finally {
            setSendingMessage(false);
        }
    };

    const hasActiveOrPendingDeclarations = declarations.some(
        declaration => declaration.status === 'active' || declaration.status === 'inactive'
    );

    const getStatusChip = (status: string, endDate?: string) => {
        const expired = isDeclarationExpired(endDate, status);
        const color = getStatusColor(status, expired);
        const text = getStatusText(status, expired);
        return (
            <Chip
                label={text}
                size="small"
                sx={{
                    backgroundColor: color,
                    color: 'white',
                    fontWeight: 'bold'
                }}
            />
        );
    };

    return (
        <>
            <LandingScreenHeader />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" gutterBottom>
                        <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Мої декларації
                    </Typography>
                    <Button
                        startIcon={<Refresh />}
                        onClick={fetchDeclarations}
                        disabled={loading}
                        variant="outlined"
                    >
                        Оновити
                    </Button>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {declarations.length === 0 ? (
                            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                                <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    У вас поки немає декларацій
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Створіть свою першу декларацію про вибір лікаря
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={() => navigate('/patient-create-declaration')}
                                    size="large"
                                >
                                    Створити декларацію
                                </Button>
                            </Paper>
                        ) : (
                            <>
                                {!hasActiveOrPendingDeclarations && (
                                    <Alert severity="info" sx={{ mb: 3 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography>
                                                У вас немає активних декларацій. Ви можете створити нову декларацію.
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<Add />}
                                                onClick={() => navigate('/patient-create-declaration')}
                                                sx={{ ml: 2 }}
                                            >
                                                Створити декларацію
                                            </Button>
                                        </Box>
                                    </Alert>
                                )}

                                <Grid container spacing={3}>
                                    {declarations.map((declaration) => {
                                        const expired = isDeclarationExpired(declaration.end_date, declaration.status);
                                        return (
                                            <Grid item xs={12} md={6} lg={4} key={declaration.id}>
                                                <Card
                                                    elevation={3}
                                                    sx={{
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        ...(expired && {
                                                            border: '2px solid #d32f2f',
                                                            backgroundColor: 'rgba(211, 47, 47, 0.04)'
                                                        })
                                                    }}
                                                >
                                                    <CardContent sx={{ flexGrow: 1 }}>
                                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                {expired && <Warning sx={{ color: '#d32f2f', fontSize: 20 }} />}
                                                                <Typography variant="h6" component="div">
                                                                    {getScopeText(declaration.scope)}
                                                                </Typography>
                                                            </Box>
                                                            {getStatusChip(declaration.status, declaration.end_date)}
                                                        </Box>

                                                    <Divider sx={{ mb: 2 }} />

                                                    {declaration.doctor && (
                                                        <Box display="flex" alignItems="center" mb={1}>
                                                            <LocalHospital sx={{ mr: 1, color: 'text.secondary' }} />
                                                            <Typography variant="body2">
                                                                <strong>Лікар:</strong> {declaration.doctor.lastName} {declaration.doctor.firstName}
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                    {declaration.employee_data?.position && (
                                                        <Box display="flex" alignItems="center" mb={1}>
                                                            <Person sx={{ mr: 1, color: 'text.secondary' }} />
                                                            <Typography variant="body2">
                                                                <strong>Позиція:</strong> {declaration.employee_data.position}
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                    {declaration.division_data?.name && (
                                                        <Box display="flex" alignItems="center" mb={1}>
                                                            <Typography variant="body2">
                                                                <strong>Заклад:</strong> {declaration.division_data.name}
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                    {declaration.legal_entity_data?.name && (
                                                        <Box display="flex" alignItems="center" mb={1}>
                                                            <Typography variant="body2">
                                                                <strong>Організація:</strong> {declaration.legal_entity_data.name}
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                                        <strong>Створено:</strong> {formatDate(declaration.inserted_at)}
                                                    </Typography>

                                                    {declaration.start_date && declaration.end_date && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            <strong>Період дії:</strong> {formatDate(declaration.start_date)} - {formatDate(declaration.end_date)}
                                                        </Typography>
                                                    )}
                                                </CardContent>

                                                <Box p={2} pt={0}>
                                                    <Box display="flex" gap={1} flexWrap="wrap">
                                                        <Button
                                                            size="small"
                                                            startIcon={<Download />}
                                                            onClick={() => handleDownloadPdf(declaration.id)}
                                                            variant="outlined"
                                                        >
                                                            Завантажити
                                                        </Button>

                                                        {declaration.doctor && (declaration.status === 'active' || declaration.status === 'inactive') && (
                                                            <Button
                                                                size="small"
                                                                startIcon={<SendIcon />}
                                                                onClick={() => handleMessageDoctor(declaration)}
                                                                variant="outlined"
                                                                color="primary"
                                                            >
                                                                Написати лікарю
                                                            </Button>
                                                        )}

                                                        {declaration.status === 'active' && (
                                                            <Button
                                                                size="small"
                                                                startIcon={<Cancel />}
                                                                onClick={() => handleCancelDeclaration(declaration)}
                                                                variant="outlined"
                                                                color="warning"
                                                            >
                                                                Скасувати
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </Box>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </>
                        )}
                    </>
                )}

                {/* Cancel Declaration Dialog */}
                <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Скасування декларації</DialogTitle>
                    <DialogContent>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Ви скасовуєте декларацію з лікарем{' '}
                            <strong>
                                {selectedDeclaration?.doctor &&
                                    `${selectedDeclaration.doctor.lastName} ${selectedDeclaration.doctor.firstName}`}
                            </strong>
                        </Alert>
                        <TextField
                            label="Причина скасування"
                            multiline
                            rows={4}
                            fullWidth
                            required
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            sx={{ mt: 2 }}
                            placeholder="Вкажіть причину скасування декларації..."
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setCancelDialogOpen(false);
                            setCancelReason('');
                            setSelectedDeclaration(null);
                        }}>
                            Скасувати
                        </Button>
                        <Button
                            onClick={onCancelSubmit}
                            variant="contained"
                            color="warning"
                            disabled={!cancelReason.trim()}
                        >
                            Скасувати декларацію
                        </Button>
                    </DialogActions>
                </Dialog>
                
                <Dialog open={messageDialogOpen} onClose={() => {
                    setMessageDialogOpen(false);
                    setMessageTitle('');
                    setMessageText('');
                    setSelectedDeclaration(null);
                }} maxWidth="sm" fullWidth>
                    <DialogTitle>Написати лікарю</DialogTitle>
                    <DialogContent>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Відправити повідомлення лікарю{' '}
                            <strong>
                                {selectedDeclaration?.doctor &&
                                    `${selectedDeclaration.doctor.lastName} ${selectedDeclaration.doctor.firstName}`}
                            </strong>
                        </Alert>
                        <TextField
                            label="Тема повідомлення"
                            fullWidth
                            required
                            value={messageTitle}
                            onChange={(e) => setMessageTitle(e.target.value)}
                            sx={{ mt: 2, mb: 2 }}
                            placeholder="Наприклад: Запитання щодо декларації"
                        />
                        <TextField
                            label="Повідомлення"
                            multiline
                            rows={6}
                            fullWidth
                            required
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Введіть ваше повідомлення..."
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setMessageDialogOpen(false);
                            setMessageTitle('');
                            setMessageText('');
                            setSelectedDeclaration(null);
                        }}>
                            Скасувати
                        </Button>
                        <Button
                            onClick={handleSendMessage}
                            variant="contained"
                            color="primary"
                            disabled={!messageTitle.trim() || !messageText.trim() || sendingMessage}
                            startIcon={sendingMessage ? <CircularProgress size={20} /> : <SendIcon />}
                        >
                            {sendingMessage ? 'Відправлення...' : 'Відправити'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={submitStatus.open}
                    autoHideDuration={6000}
                    onClose={() => setSubmitStatus({ ...submitStatus, open: false })}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setSubmitStatus({ ...submitStatus, open: false })}
                        severity={submitStatus.type as any}
                        sx={{ width: '100%' }}
                        variant="filled"
                    >
                        {submitStatus.message}
                    </Alert>
                </Snackbar>
            </Container>
        </>
    );
};

export default PatientDeclarationsList;