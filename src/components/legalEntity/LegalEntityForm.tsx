import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Alert,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
    ExpandMore as ExpandMoreIcon,
    Business as BusinessIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

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

interface LegalEntityFormData {
    name: string;
    short_name: string;
    legal_form: string;
    public_name: string;
    edrpou: string;
    status: string;
    email: string;
    phones: Phone[];
    addresses: Address[];
}

interface LegalEntity extends LegalEntityFormData {
    id: string;
    created_at: string;
    updated_at: string;
}

const phoneTypes = [
    { value: 'mobile', label: 'Мобільний' },
    { value: 'landline', label: 'Стаціонарний' },
];

const addressTypes = [
    { value: 'REGISTRATION', label: 'Реєстрація' },
    { value: 'RESIDENCE', label: 'Фактична адреса' },
    { value: 'POSTAL', label: 'Поштова' },
];

const legalForms = [
    'ТОВ', 'ПАТ', 'ПрАТ', 'КТ', 'ПП', 'ФОП', 'НП', 'БФ'
];

const statuses = [
    'active', 'inactive', 'pending', 'suspended', 'new'
];

const settlementTypes = [
    'місто', 'село', 'селище', 'смт'
];

const streetTypes = [
    'вул.', 'пр.', 'бул.', 'пров.', 'площа', 'наб.'
];

interface LegalEntityFormProps {
    entity?: LegalEntity;
    onSubmit: (data: LegalEntityFormData) => Promise<void>;
    onCancel: () => void;
}

const LegalEntityForm: React.FC<LegalEntityFormProps> = ({ entity, onSubmit, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const defaultValues: LegalEntityFormData = {
        name: '',
        short_name: '',
        legal_form: '',
        public_name: '',
        edrpou: '',
        status: 'new',
        email: '',
        phones: [{ type: 'mobile', number: '' }],
        addresses: [{
            type: 'REGISTRATION',
            country: 'UA',
            area: '',
            region: '',
            settlement: '',
            settlement_type: 'місто',
            settlement_id: '',
            street_type: 'вул.',
            street: '',
            building: '',
            apartment: '',
            zip: ''
        }]
    };

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<LegalEntityFormData>({
        defaultValues: entity || defaultValues
    });

    const {
        fields: phoneFields,
        append: appendPhone,
        remove: removePhone
    } = useFieldArray({
        control,
        name: 'phones'
    });

    const {
        fields: addressFields,
        append: appendAddress,
        remove: removeAddress
    } = useFieldArray({
        control,
        name: 'addresses'
    });

    const watchedName = watch('name');
    useEffect(() => {
        if (watchedName && !entity) {
            setValue('public_name', watchedName);
        }
    }, [watchedName, setValue, entity]);

    const handleFormSubmit = async (data: LegalEntityFormData) => {
        try {
            setLoading(true);
            setError(null);
            await onSubmit(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Помилка збереження');
        } finally {
            setLoading(false);
        }
    };

    const addPhone = () => {
        appendPhone({ type: 'MOBILE', number: '' });
    };

    const addAddress = () => {
        appendAddress({
            type: 'RESIDENCE',
            country: 'UA',
            area: '',
            region: '',
            settlement: '',
            settlement_type: 'місто',
            settlement_id: '',
            street_type: 'вул.',
            street: '',
            building: '',
            apartment: '',
            zip: ''
        });
    };

    return (
        <Box>
            {/* Заголовок */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <IconButton onClick={onCancel} color="primary">
                    <ArrowBackIcon />
                </IconButton>
                <BusinessIcon color="primary" />
                <Typography variant="h4" component="h1">
                    {entity ? 'Редагування організації' : 'Нова організація'}
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid container spacing={3}>
                    {/* Основна інформація */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Основна інформація
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Повна назва організації *"
                                        {...register('name', { required: 'Поле обов\'язкове' })}
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Скорочена назва *"
                                        {...register('short_name', { required: 'Поле обов\'язкове' })}
                                        error={!!errors.short_name}
                                        helperText={errors.short_name?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth error={!!errors.legal_form}>
                                        <InputLabel>Організаційно-правова форма *</InputLabel>
                                        <Controller
                                            name="legal_form"
                                            control={control}
                                            rules={{ required: 'Поле обов\'язкове' }}
                                            render={({ field }) => (
                                                <Select {...field} label="Організаційно-правова форма *">
                                                    {legalForms.map(form => (
                                                        <MenuItem key={form} value={form}>
                                                            {form}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Публічна назва"
                                        {...register('public_name')}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="ЄДРПОУ *"
                                        {...register('edrpou', {
                                            required: 'Поле обов\'язкове',
                                            pattern: {
                                                value: /^\d{8}$/,
                                                message: 'ЄДРПОУ повинен містити 8 цифр'
                                            }
                                        })}
                                        error={!!errors.edrpou}
                                        helperText={errors.edrpou?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Статус *</InputLabel>
                                        <Controller
                                            name="status"
                                            control={control}
                                            render={({ field }) => (
                                                <Select {...field} label="Статус *">
                                                    {statuses.map(status => (
                                                        <MenuItem key={status} value={status}>
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Email *"
                                        type="email"
                                        {...register('email', {
                                            required: 'Поле обов\'язкове',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Невірний формат email'
                                            }
                                        })}
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Телефони */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <PhoneIcon color="primary" />
                                    <Typography variant="h6">Телефони</Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={addPhone}
                                    size="small"
                                >
                                    Додати телефон
                                </Button>
                            </Box>

                            {phoneFields.map((field, index) => (
                                <Box key={field.id} mb={2}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>Тип телефону</InputLabel>
                                                <Controller
                                                    name={`phones.${index}.type`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select {...field} label="Тип телефону">
                                                            {phoneTypes.map(type => (
                                                                <MenuItem key={type.value} value={type.value}>
                                                                    {type.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Номер телефону"
                                                {...register(`phones.${index}.number`, {
                                                    required: 'Поле обов\'язкове'
                                                })}
                                                error={!!errors.phones?.[index]?.number}
                                                helperText={errors.phones?.[index]?.number?.message}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            {phoneFields.length > 1 && (
                                                <IconButton
                                                    onClick={() => removePhone(index)}
                                                    color="error"
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Paper>
                    </Grid>

                    {/* Адреси */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <LocationIcon color="primary" />
                                    <Typography variant="h6">Адреси</Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={addAddress}
                                    size="small"
                                >
                                    Додати адресу
                                </Button>
                            </Box>

                            {addressFields.map((field, index) => (
                                <Accordion key={field.id} defaultExpanded={addressFields.length === 1}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                                            <Typography>
                                                Адреса {index + 1} ({addressTypes.find(t => t.value === watch(`addresses.${index}.type`))?.label})
                                            </Typography>
                                            {addressFields.length > 1 && (
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeAddress(index);
                                                    }}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Тип адреси</InputLabel>
                                                    <Controller
                                                        name={`addresses.${index}.type`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select {...field} label="Тип адреси">
                                                                {addressTypes.map(type => (
                                                                    <MenuItem key={type.value} value={type.value}>
                                                                        {type.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Країна"
                                                    {...register(`addresses.${index}.country`)}
                                                    defaultValue="UA"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Область *"
                                                    {...register(`addresses.${index}.area`, {
                                                        required: 'Поле обов\'язкове'
                                                    })}
                                                    error={!!errors.addresses?.[index]?.area}
                                                    helperText={errors.addresses?.[index]?.area?.message}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Район *"
                                                    {...register(`addresses.${index}.region`, {
                                                        required: 'Поле обов\'язкове'
                                                    })}
                                                    error={!!errors.addresses?.[index]?.region}
                                                    helperText={errors.addresses?.[index]?.region?.message}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Тип населеного пункту</InputLabel>
                                                    <Controller
                                                        name={`addresses.${index}.settlement_type`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select {...field} label="Тип населеного пункту">
                                                                {settlementTypes.map(type => (
                                                                    <MenuItem key={type} value={type}>
                                                                        {type}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Населений пункт *"
                                                    {...register(`addresses.${index}.settlement`, {
                                                        required: 'Поле обов\'язкове'
                                                    })}
                                                    error={!!errors.addresses?.[index]?.settlement}
                                                    helperText={errors.addresses?.[index]?.settlement?.message}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <TextField
                                                    fullWidth
                                                    label="ID населеного пункту"
                                                    {...register(`addresses.${index}.settlement_id`)}
                                                    placeholder="КОАТУУ код"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Тип вулиці</InputLabel>
                                                    <Controller
                                                        name={`addresses.${index}.street_type`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select {...field} label="Тип вулиці">
                                                                {streetTypes.map(type => (
                                                                    <MenuItem key={type} value={type}>
                                                                        {type}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} md={5}>
                                                <TextField
                                                    fullWidth
                                                    label="Назва вулиці *"
                                                    {...register(`addresses.${index}.street`, {
                                                        required: 'Поле обов\'язкове'
                                                    })}
                                                    error={!!errors.addresses?.[index]?.street}
                                                    helperText={errors.addresses?.[index]?.street?.message}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                                <TextField
                                                    fullWidth
                                                    label="Будинок *"
                                                    {...register(`addresses.${index}.building`, {
                                                        required: 'Поле обов\'язкове'
                                                    })}
                                                    error={!!errors.addresses?.[index]?.building}
                                                    helperText={errors.addresses?.[index]?.building?.message}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                                <TextField
                                                    fullWidth
                                                    label="Квартира/Офіс"
                                                    {...register(`addresses.${index}.apartment`)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Поштовий індекс *"
                                                    {...register(`addresses.${index}.zip`, {
                                                        required: 'Поле обов\'язкове',
                                                        pattern: {
                                                            value: /^\d{5}$/,
                                                            message: 'Введіть 5 цифр'
                                                        }
                                                    })}
                                                    error={!!errors.addresses?.[index]?.zip}
                                                    helperText={errors.addresses?.[index]?.zip?.message}
                                                />
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Paper>
                    </Grid>

                    {/* Кнопки дій */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Button
                                    variant="outlined"
                                    onClick={onCancel}
                                    disabled={loading}
                                    size="large"
                                >
                                    Скасувати
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                    disabled={loading}
                                    size="large"
                                >
                                    {loading ? 'Збереження...' : 'Зберегти'}
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default LegalEntityForm;