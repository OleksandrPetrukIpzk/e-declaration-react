import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Grid,
    Alert,
    Snackbar,
    Divider,
    Card,
    CardContent,
    CircularProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    IconButton,
    InputAdornment,
    Autocomplete,
} from '@mui/material';
import {
    CheckCircle,
    Cancel,
    Edit,
    Search,
    Phone,
    Person,
    Business,
    LocationOn,
    Add,
    Delete,
    Refresh,
    Warning,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { uk } from 'date-fns/locale';
import { format } from 'date-fns';
import api from "../constants/axiosInterceptor";
import {LandingScreenHeader} from "../components/LandingScreenHeader";
import {downloadDeclarationPdf} from "../services/declarationDaoService";
import { isDeclarationExpired } from "../constants/declaration-color.constant";

enum DeclarationStatus {
    PENDING_DOCTOR_REVIEW = 'pending_doctor_review',
    PENDING_DOCTOR_SIGN = 'pending_doctor_sign',
    ACTIVE = 'active',
    TERMINATED = 'terminated',
    REJECTED = 'rejected',
}

enum EmployeeStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}


const StatusChip = ({ status, endDate }: any) => {
    const expired = isDeclarationExpired(endDate, status);

    const getStatusConfig = (status: any, expired: boolean) => {
        if (expired) {
            return { color: '#d32f2f', label: 'Прострочена' };
        }

        switch (status) {
            case DeclarationStatus.PENDING_DOCTOR_REVIEW:
                return { color: '#ff9800', label: 'На розгляді' };
            case DeclarationStatus.PENDING_DOCTOR_SIGN:
                return { color: '#2196f3', label: 'До підписання' };
            case DeclarationStatus.ACTIVE:
                return { color: '#4caf50', label: 'Активна' };
            case DeclarationStatus.TERMINATED:
                return { color: '#ff9800', label: 'Завершена' };
            case DeclarationStatus.REJECTED:
                return { color: '#f44336', label: 'Відхилена' };
            default:
                return { color: '#757575', label: status };
        }
    };

    const config = getStatusConfig(status, expired);
    return (
        <Chip
            size="small"
            label={config.label}
            sx={{
                backgroundColor: config.color,
                color: 'white',
                fontWeight: 'bold'
            }}
        />
    );
};

const DoctorDashboard = () => {
    const [rejectReason, setRejectReason] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [declarations, setDeclarations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDeclaration, setSelectedDeclaration] = useState<any>(null);
    const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
    const [signDialogOpen, setSignDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [divisions, setDivisions] = useState<any>([]);
    const [legalEntities, setLegalEntities] = useState<any>([]);
    const [submitStatus, setSubmitStatus] = useState({ open: false, type: 'success', message: '' });

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({
        defaultValues: {
            start_date: '',
            end_date: '',
            reason: '',
            reason_description: '',
            employee_data: {
                position: '',
                employee_type: 'doctor',
                status: EmployeeStatus.ACTIVE,
                start_date: '',
                end_date: '',
                party: {
                    id: '',
                    first_name: '',
                    last_name: '',
                    second_name: ''
                }
            },
            division_data: {
                name: '',
                type: '',
                status: '',
                mountain_group: false,
                dls_id: '',
                dls_verified: false
            },
            legal_entity_data: {
                name: '',
                short_name: '',
                legal_form: '',
                public_name: '',
                edrpou: '',
                status: '',
                email: '',
                phones: [],
                addresses: []
            },
            doctor_data: {
                educations: [] as any,
                qualifications: [],
                specialities: [],
                science_degree: null
            } as any
        }
    });

    const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
        control,
        name: "doctor_data.educations"
    });

    const { fields: specialityFields, append: appendSpeciality, remove: removeSpeciality } = useFieldArray({
        control,
        name: "doctor_data.specialities"
    });

    const tabs = [
        { label: 'На розгляді', status: DeclarationStatus.PENDING_DOCTOR_REVIEW },
        { label: 'До підписання', status: DeclarationStatus.PENDING_DOCTOR_SIGN },
        { label: 'Всі декларації', status: null },
    ];

    useEffect(() => {
        fetchDeclarations();
        fetchDictionaries();
    }, [activeTab]);

    const fetchDeclarations = async () => {
        setLoading(true);
        try {
            let endpoint = 'declarations/doctor/my';

            if (activeTab === 0) {
                endpoint = 'declarations/doctor/pending-review';
            } else if (activeTab === 1) {
                endpoint = 'declarations/doctor/pending-sign';
            }

            const data: any = await api.get(endpoint).then(res => res.data);

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

    const fetchDictionaries = async () => {
        try {
            const [divisionsRes, entitiesRes] = await Promise.all([
                fetch('http://localhost:3005/declarations/dictionaries/divisions'),
                fetch('http://localhost:3005/declarations/dictionaries/legal-entities')
            ]);

            const [divisionsData, entitiesData] = await Promise.all([
                divisionsRes.json(),
                entitiesRes.json()
            ]);

            setDivisions(divisionsData);
            setLegalEntities(entitiesData);
        } catch (error) {
            console.error('Error fetching dictionaries:', error);
        }
    };

    const handleCompleteDeclaration = (declaration: any) => {
        setSelectedDeclaration(declaration);
        setCompleteDialogOpen(true);

        setValue('employee_data.party.first_name', '');
        setValue('employee_data.party.last_name', '');
        setValue('employee_data.party.second_name', '');
        setValue('employee_data.party.id', crypto.randomUUID());
    };

    const handleSignDeclaration = (declaration: any) => {
        setSelectedDeclaration(declaration);
        setSignDialogOpen(true);
    };

    const handleRejectDeclaration = (declaration: any) => {
        setSelectedDeclaration(declaration);
        setRejectDialogOpen(true);
    };

    const onCompleteSubmit = async (data: any) => {
        try {
            await api.patch(
                `/declarations/doctor/${selectedDeclaration.id}/complete`,
                data,
            );

            setSubmitStatus({
                open: true,
                type: 'success',
                message: 'Декларацію успішно доповнено',
            });

            setCompleteDialogOpen(false);
            fetchDeclarations();
            reset();
        } catch (error) {
            console.error('Error completing declaration:', error);
            setSubmitStatus({
                open: true,
                type: 'error',
                message: 'Помилка при доповненні декларації',
            });
        }
    };

    const onSignSubmit = async () => {
        try {
            await api.patch(
                `/declarations/doctor/${selectedDeclaration.id}/sign`,
                { reason_description: 'Підписано' },
            );
            setSubmitStatus({
                open: true,
                type: 'success',
                message: 'Декларацію успішно підписано',
            });

            setSignDialogOpen(false);
            fetchDeclarations();
        } catch (error) {
            console.error('Error signing declaration:', error);
            setSubmitStatus({
                open: true,
                type: 'error',
                message: 'Помилка при підписанні декларації',
            });
        }
    };

    const onRejectSubmit = async (reason: any) => {
        try {
            await api.patch(
                `/declarations/doctor/${selectedDeclaration.id}/reject`,
                { reason }
            );

            setSubmitStatus({
                open: true,
                type: 'success',
                message: 'Декларацію відхилено',
            });

            setRejectDialogOpen(false);
            fetchDeclarations();
        } catch (error) {
            console.error('Error rejecting declaration:', error);
            setSubmitStatus({
                open: true,
                type: 'error',
                message: 'Помилка при відхиленні декларації',
            });
        }
    };

    const filteredDeclarations = declarations.filter((declaration: any) =>
        declaration?.person_data?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        declaration?.person_data?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        declaration?.person_data?.phones?.[0]?.number?.includes(searchTerm)
    );

    const handleDivisionSelect = (selectedDivision: any) => {
        if (selectedDivision) {
            setValue('division_data.name', selectedDivision.name);
            setValue('division_data.type', selectedDivision.type);
            setValue('division_data.status', selectedDivision.status);
            setValue('division_data.mountain_group', selectedDivision.mountain_group);
            setValue('division_data.dls_id', selectedDivision.dls_id);
            setValue('division_data.dls_verified', selectedDivision.dls_verified);
        }
    };

    const handleLegalEntitySelect = (selectedEntity: any) => {
        if (selectedEntity) {
            setValue('legal_entity_data.name', selectedEntity.name);
            setValue('legal_entity_data.short_name', selectedEntity.short_name);
            setValue('legal_entity_data.legal_form', selectedEntity.legal_form);
            setValue('legal_entity_data.public_name', selectedEntity.public_name);
            setValue('legal_entity_data.edrpou', selectedEntity.edrpou);
            setValue('legal_entity_data.status', selectedEntity.status);
            setValue('legal_entity_data.email', selectedEntity.email);
            setValue('legal_entity_data.phones', selectedEntity.phones);
            setValue('legal_entity_data.addresses', selectedEntity.addresses);
        }
    };
    const [terminateDialogOpen, setTerminateDialogOpen] = useState(false);
    const [terminateReason, setTerminateReason] = useState('');
    const handleTerminateDeclaration = (declaration: any) => {
        setSelectedDeclaration(declaration);
        setTerminateDialogOpen(true);
    };
    const onTerminateSubmit = async () => {
        try {
            await api.patch(
                `/declarations/${selectedDeclaration.id}/terminate`,
                { reason: terminateReason }
            );

            setSubmitStatus({
                open: true,
                type: 'success',
                message: 'Декларацію успішно завершено',
            });

            setTerminateDialogOpen(false);
            setTerminateReason('');
            fetchDeclarations();
        } catch (error) {
            console.error('Error terminating declaration:', error);
            setSubmitStatus({
                open: true,
                type: 'error',
                message: 'Помилка при завершенні декларації',
            });
        }
    };
    return (
        <>
            <LandingScreenHeader />
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Панель лікаря - Декларації
            </Typography>

            <Paper elevation={3} sx={{ mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                    {tabs.map((tab, index) => (
                        <Tab key={index} label={tab.label} />
                    ))}
                </Tabs>
            </Paper>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        placeholder="Пошук за ПІБ або телефоном"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            startIcon={<Refresh />}
                            onClick={fetchDeclarations}
                            disabled={loading}
                        >
                            Оновити
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ПІБ пацієнта</TableCell>
                                <TableCell>Телефон</TableCell>
                                <TableCell>Дата створення</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Дії</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDeclarations.map((declaration: any) => {
                                const expired = isDeclarationExpired(declaration.end_date, declaration.status);
                                return (
                                    <TableRow
                                        key={declaration.id}
                                        sx={{
                                            ...(expired && {
                                                backgroundColor: 'rgba(211, 47, 47, 0.04)',
                                                borderLeft: '4px solid #d32f2f'
                                            })
                                        }}
                                    >
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                {expired && <Warning sx={{ mr: 1, color: '#d32f2f', fontSize: 20 }} />}
                                                <Person sx={{ mr: 1, color: 'text.secondary' }} />
                                                {`${declaration.person_data.last_name} ${declaration.person_data.first_name} ${declaration.person_data.second_name}`}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                                                {declaration.person_data.phones?.[0]?.number || 'Не вказано'}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(declaration.inserted_at), 'dd.MM.yyyy HH:mm')}
                                        </TableCell>
                                        <TableCell>
                                            <StatusChip status={declaration.status} endDate={declaration.end_date} />
                                        </TableCell>
                                        <TableCell>
                                        <Box display="flex" gap={1}>
                                            <Button
                                                size="small"
                                                onClick={() => downloadDeclarationPdf(declaration.id)}
                                                variant="outlined"
                                            >
                                                Завантажити
                                            </Button>
                                            {declaration.status === DeclarationStatus.ACTIVE && (
                                                <Button
                                                    size="small"
                                                    startIcon={<Cancel />}
                                                    onClick={() => handleTerminateDeclaration(declaration)}
                                                    variant="outlined"
                                                    color="warning"
                                                >
                                                    Завершити
                                                </Button>
                                            )}
                                            {declaration.status === DeclarationStatus.PENDING_DOCTOR_REVIEW && (
                                                <>
                                                    <Button
                                                        size="small"
                                                        startIcon={<Edit />}
                                                        onClick={() => handleCompleteDeclaration(declaration)}
                                                        variant="outlined"
                                                        color="primary"
                                                    >
                                                        Доповнити
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        startIcon={<Cancel />}
                                                        onClick={() => handleRejectDeclaration(declaration)}
                                                        variant="outlined"
                                                        color="error"
                                                    >
                                                        Відхилити
                                                    </Button>
                                                </>
                                            )}
                                            {declaration.status === DeclarationStatus.PENDING_DOCTOR_SIGN && (
                                                <>
                                                    <Button
                                                        size="small"
                                                        startIcon={<CheckCircle />}
                                                        onClick={() => handleSignDeclaration(declaration)}
                                                        variant="contained"
                                                        color="success"
                                                    >
                                                        Підписати
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        startIcon={<Cancel />}
                                                        onClick={() => handleRejectDeclaration(declaration)}
                                                        variant="outlined"
                                                        color="error"
                                                    >
                                                        Відхилити
                                                    </Button>
                                                </>
                                            )}
                                        </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredDeclarations.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography color="text.secondary">
                                            {searchTerm ? 'Декларацій не знайдено' : 'Немає декларацій'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Complete Declaration Dialog */}
            <Dialog open={completeDialogOpen} onClose={() => setCompleteDialogOpen(false)} maxWidth="lg" fullWidth>
                <form onSubmit={handleSubmit(onCompleteSubmit)}>
                    <DialogTitle>Доповнення декларації</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            {/* Basic Info */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Основна інформація
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="start_date"
                                    control={control}
                                    rules={{ required: "Дата початку обов'язкова" }}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                                            <DatePicker
                                                {...field}
                                                label="Дата початку дії"
                                                format="dd.MM.yyyy"
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: !!errors.start_date,
                                                        helperText: errors.start_date?.message,
                                                    },
                                                }}
                                                value={field.value ? new Date(field.value) : null}
                                                onChange={(date) => field.onChange(date)}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="end_date"
                                    control={control}
                                    rules={{ required: "Дата закінчення обов'язкова" }}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                                            <DatePicker
                                                {...field}
                                                label="Дата закінчення дії"
                                                format="dd.MM.yyyy"
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: !!errors.end_date,
                                                        helperText: errors.end_date?.message,
                                                    },
                                                }}
                                                value={field.value ? new Date(field.value) : null}
                                                onChange={(date) => field.onChange(date)}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="reason"
                                    control={control}
                                    rules={{ required: "Причина обов'язкова" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Причина"
                                            fullWidth
                                            error={!!errors.reason}
                                            helperText={errors.reason?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="reason_description"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Опис причини"
                                            fullWidth
                                            multiline
                                            rows={2}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Division Selection */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                    <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Підрозділ
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid item xs={12}>
                                <Autocomplete
                                    options={divisions}
                                    getOptionLabel={(option: any) => `${option.name} (${option.type})`}
                                    onChange={(_, value) => handleDivisionSelect(value)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Оберіть підрозділ"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Business />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Legal Entity Selection */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                    <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Юридична особа
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid item xs={12}>
                                <Autocomplete
                                    options={legalEntities}
                                    getOptionLabel={(option: any) => `${option.name} (${option.edrpou})`}
                                    onChange={(_, value) => handleLegalEntitySelect(value)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Оберіть юридичну особу"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Business />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Employee Data */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                    <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Дані про співробітника (лікаря)
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="employee_data.position"
                                    control={control}
                                    rules={{ required: "Посада обов'язкова" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Посада"
                                            fullWidth
                                            error={!!errors.employee_data?.position}
                                            helperText={errors.employee_data?.position?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="employee_data.party.last_name"
                                    control={control}
                                    rules={{ required: "Прізвище лікаря обов'язкове" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Прізвище лікаря"
                                            fullWidth
                                            error={!!errors.employee_data?.party?.last_name}
                                            helperText={errors.employee_data?.party?.last_name?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="employee_data.party.first_name"
                                    control={control}
                                    rules={{ required: "Ім'я лікаря обов'язкове" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Ім'я лікаря"
                                            fullWidth
                                            error={!!errors.employee_data?.party?.first_name}
                                            helperText={errors.employee_data?.party?.first_name?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="employee_data.party.second_name"
                                    control={control}
                                    rules={{ required: "По батькові лікаря обов'язкове" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="По батькові лікаря"
                                            fullWidth
                                            error={!!errors.employee_data?.party?.second_name}
                                            helperText={errors.employee_data?.party?.second_name?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="employee_data.start_date"
                                    control={control}
                                    rules={{ required: "Дата початку роботи обов'язкова" }}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                                            <DatePicker
                                                {...field}
                                                label="Дата початку роботи"
                                                format="dd.MM.yyyy"
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: !!errors.employee_data?.start_date,
                                                        helperText: errors.employee_data?.start_date?.message,
                                                    },
                                                }}
                                                value={field.value ? new Date(field.value) : null}
                                                onChange={(date) => field.onChange(date)}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="employee_data.end_date"
                                    control={control}
                                    rules={{ required: "Дата закінчення роботи обов'язкова" }}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                                            <DatePicker
                                                {...field}
                                                label="Дата закінчення роботи"
                                                format="dd.MM.yyyy"
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: !!errors.employee_data?.end_date,
                                                        helperText: errors.employee_data?.end_date?.message,
                                                    },
                                                }}
                                                value={field.value ? new Date(field.value) : null}
                                                onChange={(date) => field.onChange(date)}
                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                            </Grid>

                            {/* Doctor Data */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                    Освіта та кваліфікація лікаря
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            {/* Educations */}
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle1">Освіта</Typography>
                                    <Button
                                        startIcon={<Add />}
                                        onClick={() => appendEducation({
                                            country: 'Україна',
                                            city: '',
                                            institution_name: '',
                                            issued_date: '',
                                            diploma_number: '',
                                            degree: '',
                                            speciality: ''
                                        })}
                                        variant="outlined"
                                        size="small"
                                    >
                                        Додати освіту
                                    </Button>
                                </Box>

                                {educationFields.map((field, index) => (
                                    <Card key={field.id} variant="outlined" sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                <Typography variant="subtitle2">Освіта {index + 1}</Typography>
                                                <IconButton
                                                    onClick={() => removeEducation(index)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Box>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <Controller
                                                        name={`doctor_data.educations.${index.toString()}.institution_name`}
                                                        control={control}
                                                        rules={{ required: "Назва закладу обов'язкова" }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Навчальний заклад"
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Controller
                                                        name={`doctor_data.educations.${index.toString()}.city`}
                                                        control={control}
                                                        rules={{ required: "Місто обов'язкове" }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Місто"
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Controller
                                                        name={`doctor_data.educations.${index.toString()}.speciality`}
                                                        control={control}
                                                        rules={{ required: "Спеціальність обов'язкова" }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Спеціальність"
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Controller
                                                        name={`doctor_data.educations.${index.toString()}.degree`}
                                                        control={control}
                                                        rules={{ required: "Ступінь обов'язковий" }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Ступінь"
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Controller
                                                        name={`doctor_data.educations.${index}.diploma_number`}
                                                        control={control}
                                                        rules={{ required: "Номер диплому обов'язковий" }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Номер диплому"
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Controller
                                                        name={`doctor_data.educations.${index}.issued_date`}
                                                        control={control}
                                                        rules={{ required: "Дата видачі диплому обов'язкова" }}
                                                        render={({ field }) => (
                                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                                                                <DatePicker
                                                                    {...field}
                                                                    label="Дата видачі диплому"
                                                                    format="dd.MM.yyyy"
                                                                    slotProps={{
                                                                        textField: {
                                                                            fullWidth: true,
                                                                        },
                                                                    }}
                                                                    value={field.value ? new Date(field.value) : null}
                                                                    onChange={(date) => field.onChange(date)}
                                                                />
                                                            </LocalizationProvider>
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Grid>

                            {/* Specialities */}
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle1">Спеціалізації</Typography>
                                    <Button
                                        startIcon={<Add />}
                                        onClick={() => appendSpeciality({
                                            speciality: '',
                                            speciality_officio: false,
                                            level: '',
                                            qualification_type: '',
                                            attestation_name: '',
                                            attestation_date: '',
                                            valid_to_date: '',
                                            certificate_number: ''
                                        })}
                                        variant="outlined"
                                        size="small"
                                    >
                                        Додати спеціалізацію
                                    </Button>
                                </Box>

                                {specialityFields.map((field, index) => (
                                    <Card key={field.id} variant="outlined" sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                <Typography variant="subtitle2">Спеціалізація {index + 1}</Typography>
                                                <IconButton
                                                    onClick={() => removeSpeciality(index)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Box>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <Controller
                                                        name={`doctor_data.specialities.${index}.speciality`}
                                                        control={control}
                                                        rules={{ required: "Спеціальність обов'язкова" }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Спеціальність"
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Controller
                                                        name={`doctor_data.specialities.${index}.level`}
                                                        control={control}
                                                        rules={{ required: "Рівень обов'язковий" }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Рівень"
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Controller
                                                        name={`doctor_data.specialities.${index}.qualification_type`}
                                                        control={control}
                                                        rules={{ required: "Тип кваліфікації обов'язковий" }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Тип кваліфікації"
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Controller
                                                        name={`doctor_data.specialities.${index}.attestation_name`}
                                                        control={control}
                                                        rules={{ required: "Назва атестації обов'язкова" }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Назва атестації"
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Controller
                                                        name={`doctor_data.specialities.${index}.certificate_number`}
                                                        control={control}
                                                        rules={{ required: "Номер сертифікату обов'язковий" }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Номер сертифікату"
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Controller
                                                        name={`doctor_data.specialities.${index}.attestation_date`}
                                                        control={control}
                                                        rules={{ required: "Дата атестації обов'язкова" }}
                                                        render={({ field }) => (
                                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                                                                <DatePicker
                                                                    {...field}
                                                                    label="Дата атестації"
                                                                    format="dd.MM.yyyy"
                                                                    slotProps={{
                                                                        textField: {
                                                                            fullWidth: true,
                                                                        },
                                                                    }}
                                                                    value={field.value ? new Date(field.value) : null}
                                                                    onChange={(date) => field.onChange(date)}
                                                                />
                                                            </LocalizationProvider>
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Controller
                                                        name={`doctor_data.specialities.${index}.valid_to_date`}
                                                        control={control}
                                                        rules={{ required: "Дата дії до обов'язкова" }}
                                                        render={({ field }) => (
                                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                                                                <DatePicker
                                                                    {...field}
                                                                    label="Дійсно до"
                                                                    format="dd.MM.yyyy"
                                                                    slotProps={{
                                                                        textField: {
                                                                            fullWidth: true,
                                                                        },
                                                                    }}
                                                                    value={field.value ? new Date(field.value) : null}
                                                                    onChange={(date) => field.onChange(date)}
                                                                />
                                                            </LocalizationProvider>
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCompleteDialogOpen(false)}>
                            Скасувати
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            Доповнити декларацію
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Sign Declaration Dialog */}
            <Dialog open={signDialogOpen} onClose={() => setSignDialogOpen(false)}>
                <DialogTitle>Підписання декларації</DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Ви підтверджуете підписання декларації для пацієнта{' '}
                        <strong>
                            {selectedDeclaration &&
                                `${selectedDeclaration.person_data.last_name} ${selectedDeclaration.person_data.first_name}`}
                        </strong>
                        ?
                    </Alert>
                    <Typography variant="body2">
                        Після підписання декларація стане активною і буде діяти протягом зазначеного періоду.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSignDialogOpen(false)}>
                        Скасувати
                    </Button>
                    <Button onClick={onSignSubmit} variant="contained" color="success">
                        Підписати
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reject Declaration Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
                <DialogTitle>Відхилення декларації</DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Ви відхиляєте декларацію для пацієнта{' '}
                        <strong>
                            {selectedDeclaration &&
                                `${selectedDeclaration.person_data.last_name} ${selectedDeclaration.person_data.first_name}`}
                        </strong>
                    </Alert>
                    <TextField
                        label="Причина відхилення"
                        multiline
                        rows={4}
                        fullWidth
                        required
                        onChange={(e) => setRejectReason(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)}>
                        Скасувати
                    </Button>
                    <Button
                        onClick={() => onRejectSubmit(rejectReason)}
                        variant="contained"
                        color="error"
                        disabled={!rejectReason}
                    >
                        Відхилити
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
                    severity={'success'}
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    {submitStatus.message}
                </Alert>
            </Snackbar>
            <Dialog open={terminateDialogOpen} onClose={() => setTerminateDialogOpen(false)}>
                <DialogTitle>Завершення декларації</DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Ви завершуєте декларацію для пацієнта{' '}
                        <strong>
                            {selectedDeclaration &&
                                `${selectedDeclaration.person_data.last_name} ${selectedDeclaration.person_data.first_name}`}
                        </strong>
                    </Alert>
                    <TextField
                        label="Причина завершення"
                        multiline
                        rows={4}
                        fullWidth
                        required
                        value={terminateReason}
                        onChange={(e) => setTerminateReason(e.target.value)}
                        sx={{ mt: 2 }}
                        placeholder="Вкажіть причину завершення декларації..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setTerminateDialogOpen(false);
                        setTerminateReason('');
                    }}>
                        Скасувати
                    </Button>
                    <Button
                        onClick={onTerminateSubmit}
                        variant="contained"
                        color="warning"
                        disabled={!terminateReason.trim()}
                    >
                        Завершити декларацію
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
        </>
    );
};

const DoctorDashboardWithState = () => {


    return <DoctorDashboard />;
};

export default DoctorDashboardWithState;