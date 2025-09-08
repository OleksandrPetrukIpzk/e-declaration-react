import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    IconButton,
    Chip,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
    Business as BusinessIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import {legalEntityDaoService, LegalEntitySearchParams} from "../../services/legalEntityDaoService";

// Типи для TypeScript
interface Phone {
    type: string;
    number: string;
}

interface Address {
    type: string;
    country: string;
    area: string;
    region: string;
    settlement: string;
    settlement_type: string;
    settlement_id: string;
    street_type: string;
    street: string;
    building: string;
    apartment?: string;
    zip: string;
}

interface LegalEntity {
    id: string;
    name: string;
    short_name: string;
    legal_form: string;
    public_name: string;
    edrpou: string;
    status: string;
    email: string;
    phones: Phone[];
    addresses: Address[];
    created_at: string;
    updated_at: string;
}

interface SearchFormData {
    name: string;
    edrpou: string;
    email: string;
    status: string;
    legal_form: string;
}

const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    'active': 'success',
    'inactive': 'error',
    'pending': 'warning',
    'suspended': 'error',
    'new': 'info',
};

const legalForms = [
    'ТОВ', 'ПАТ', 'ПрАТ', 'КТ', 'ПП', 'ФОП', 'НП', 'БФ'
];

const statuses = [
    'active', 'inactive', 'pending', 'suspended', 'new'
];

interface LegalEntityListProps {
    onEdit: (entity: LegalEntity) => void;
    onCreate: () => void;
    onView?: (entity: LegalEntity) => void;
}

const LegalEntityList: React.FC<LegalEntityListProps> = ({ onEdit, onCreate, onView }) => {
    const [entities, setEntities] = useState<LegalEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{open: boolean; entity: LegalEntity | null}>({
        open: false,
        entity: null
    });
    const [searchExpanded, setSearchExpanded] = useState(false);

    const { register, handleSubmit, reset, watch } = useForm<SearchFormData>({
        defaultValues: {
            name: '',
            edrpou: '',
            email: '',
            status: '',
            legal_form: ''
        }
    });

    // Завантаження даних
    const fetchEntities = async (searchParams?: SearchFormData) => {
        try {
            setLoading(true);
            setError(null);

            let data: LegalEntity[];

            if (searchParams && Object.values(searchParams).some(val => val)) {
                // Фільтруємо порожні значення для пошуку
                const filteredParams: LegalEntitySearchParams = {};
                Object.entries(searchParams).forEach(([key, value]) => {
                    if (value) {
                        filteredParams[key as keyof LegalEntitySearchParams] = value;
                    }
                });

                data = await legalEntityDaoService.search(filteredParams);
            } else {
                data = await legalEntityDaoService.getAll();
            }

            setEntities(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Невідома помилка');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntities();
    }, []);

    // Пошук
    const onSearch = (data: SearchFormData) => {
        fetchEntities(data);
    };

    const onClearSearch = () => {
        reset();
        fetchEntities();
    };

    // Видалення
    const handleDelete = async () => {
        if (!deleteDialog.entity) return;

        try {
            const response = await fetch(`/api/legal-entities/${deleteDialog.entity.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Помилка видалення');
            }

            await fetchEntities();
            setDeleteDialog({ open: false, entity: null });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Помилка видалення');
        }
    };

    // Форматування дати
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Форматування телефонів
    const formatPhones = (phones: Phone[]) => {
        return phones.map(phone => `${phone.type}: ${phone.number}`).join(', ');
    };

    // Основна адреса
    const getPrimaryAddress = (addresses: Address[]) => {
        const primary = addresses.find(addr => addr.type === 'RESIDENCE') || addresses[0];
        if (!primary) return 'Не вказано';

        return `${primary.settlement}, ${primary.street} ${primary.building}${primary.apartment ? `/${primary.apartment}` : ''}`;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Заголовок */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                    <BusinessIcon color="primary" />
                    <Typography variant="h4" component="h1">
                        Юридичні особи
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onCreate}
                    size="large"
                >
                    Додати організацію
                </Button>
            </Box>

            {/* Форма пошуку */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Пошук та фільтрація</Typography>
                    <Button
                        variant="outlined"
                        onClick={() => setSearchExpanded(!searchExpanded)}
                        startIcon={<SearchIcon />}
                    >
                        {searchExpanded ? 'Згорнути' : 'Розширений пошук'}
                    </Button>
                </Box>

                <form onSubmit={handleSubmit(onSearch)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Назва організації"
                                {...register('name')}
                                placeholder="Введіть назву..."
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="ЄДРПОУ"
                                {...register('edrpou')}
                                placeholder="Введіть код ЄДРПОУ..."
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Статус</InputLabel>
                                <Select {...register('status')} label="Статус">
                                    <MenuItem value="">Всі статуси</MenuItem>
                                    {statuses.map(status => (
                                        <MenuItem key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Box display="flex" gap={1} height="100%">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<SearchIcon />}
                                    fullWidth
                                >
                                    Пошук
                                </Button>
                            </Box>
                        </Grid>

                        {searchExpanded && (
                            <>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        {...register('email')}
                                        placeholder="example@healthcare.ua"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Організаційно-правова форма</InputLabel>
                                        <Select {...register('legal_form')} label="Організаційно-правова форма">
                                            <MenuItem value="">Всі форми</MenuItem>
                                            {legalForms.map(form => (
                                                <MenuItem key={form} value={form}>
                                                    {form}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<ClearIcon />}
                                        onClick={onClearSearch}
                                        fullWidth
                                        sx={{ height: '56px' }}
                                    >
                                        Очистити фільтри
                                    </Button>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </form>
            </Paper>

            {/* Повідомлення про помилку */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Таблиця */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Організація</TableCell>
                            <TableCell>ЄДРПОУ</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Контактна інформація</TableCell>
                            <TableCell>Адреса</TableCell>
                            <TableCell>Дата створення</TableCell>
                            <TableCell align="center">Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body1" color="text.secondary" py={4}>
                                        Не знайдено жодної організації
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            entities.map((entity) => (
                                <TableRow key={entity.id} hover>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {entity.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {entity.short_name}
                                            </Typography>
                                            <Typography variant="caption" color="primary">
                                                {entity.legal_form}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontFamily="monospace">
                                            {entity.edrpou}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={entity.status}
                                            color={statusColors[entity.status] || 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                                                <EmailIcon fontSize="small" color="action" />
                                                <Typography variant="body2">{entity.email}</Typography>
                                            </Box>
                                            {entity.phones.length > 0 && (
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <PhoneIcon fontSize="small" color="action" />
                                                    <Typography variant="body2">
                                                        {formatPhones(entity.phones)}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <LocationIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {getPrimaryAddress(entity.addresses)}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formatDate(entity.created_at)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        {onView && (
                                            <Tooltip title="Переглянути">
                                                <IconButton
                                                    onClick={() => onView(entity)}
                                                    color="info"
                                                    size="small"
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title="Редагувати">
                                            <IconButton
                                                onClick={() => onEdit(entity)}
                                                color="primary"
                                                size="small"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Видалити">
                                            <IconButton
                                                onClick={() => setDeleteDialog({ open: true, entity })}
                                                color="error"
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Діалог видалення */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, entity: null })}>
                <DialogTitle>Підтвердження видалення</DialogTitle>
                <DialogContent>
                    <Typography>
                        Ви впевнені, що хочете видалити організацію "{deleteDialog.entity?.name}"?
                        Цю дію неможливо буде скасувати.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, entity: null })}>
                        Скасувати
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LegalEntityList;