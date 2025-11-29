import React, {useEffect, useState} from 'react';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Divider,
    Stepper,
    Step,
    StepLabel,
    IconButton,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    Chip,
    Autocomplete,
    InputAdornment,
} from '@mui/material';
import {
    PersonOutline,
    LocalHospital,
    CheckCircle,
    Send,
    Add,
    Delete,
    Phone,
    Home,
    ContactEmergency,
    Description,
    ChevronRight,
    ChevronLeft,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { uk } from 'date-fns/locale';
import api from "../constants/axiosInterceptor";

enum DeclarationScope {
    family_doctor = 'Сімейний лікар',
    pediatrician = 'Педіатр',
    therapist = 'Терапевт',
}

enum GenderEnum {
    male = 'Чоловіча',
    female = 'Жіноча',
}

enum PhoneType {
    mobile = 'Мобільний',
    landline = 'Стаціонарний',
    work = 'Робочий'
}

enum DocumentType {
    PASSPORT = 'Паспорт',
    NATIONAL_ID = 'ID-картка',
    BIRTH_CERTIFICATE = 'Свідоцтво про народження',
    TEMPORARY_PASSPORT = 'Тимчасовий паспорт',
}

enum AddressType {
    RESIDENCE = 'Проживання',
    REGISTRATION = 'Реєстрації',
}

enum SettlementType {
    CITY = 'Місто',
    VILLAGE = 'Село',
    TOWNSHIP = 'Селище',
}

enum StreetType {
    STREET = 'Вулиця',
    AVENUE = 'Проспект',
    BOULEVARD = 'Бульвар',
    LANE = 'Провулок',
    SQUARE = 'Площа',
}

const mockDoctors = [
    {
        email: 'doctor1@clinic.com',
        name: 'Іванов Іван Іванович',
        specialty: 'Сімейний лікар',
        division: 'Поліклініка №1',
        available_slots: 150,
    },
    {
        email: 'doctor2@clinic.com',
        name: 'Петренко Петро Петрович',
        specialty: 'Терапевт',
        division: 'Поліклініка №2',
        available_slots: 80,
    },
    {
        email: 'doctor3@clinic.com',
        name: 'Сидоренко Марія Олександрівна',
        specialty: 'Сімейний лікар',
        division: 'Амбулаторія №3',
        available_slots: 120,
    },
];

const PatientDeclarationForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ open: false, type: 'success', message: '' });
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const fetchDoctors = async () => {
        setLoadingDoctors(true);
        try {
            const response = await fetch('http://localhost:3005/declarations/doctors/available', {
            });

            if (!response.ok) {
                throw new Error('Failed to fetch doctors');
            }

            const doctorsData = await response.json();
            setDoctors(doctorsData);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoadingDoctors(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);
    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        getValues,
        watch,
    } = useForm({
        defaultValues: {
            doctor_email: '',
            scope: 'family_doctor',
            declaration_request_id: '',

            person_data: {
                first_name: '',
                last_name: '',
                second_name: '',
                birth_date: '',
                gender: 'male',
                tax_id: '',
                birth_settlement: '',
                birth_country: 'Україна',
                verification_status: 'not_verified',
                phones: [{ type: 'mobile', number: '' }],
                emergency_contact: {
                    first_name: '',
                    last_name: '',
                    second_name: '',
                    phones: [{ type: 'mobile', number: '' }]
                },
                confidant_person: [],
                addresses: [{
                    type: 'RESIDENCE',
                    country: 'Україна',
                    area: '',
                    region: '',
                    settlement: '',
                    settlement_type: 'CITY',
                    settlement_id: '',
                    street_type: 'STREET',
                    street: '',
                    building: '',
                    apartment: '',
                    zip: ''
                }],
                documents: [{
                    type: 'PASSPORT',
                    number: '',
                    expiration_date: '',
                    issued_by: '',
                    issued_at: ''
                }]
            }
        },
    });

    const steps = [
        'Персональні дані',
        'Документи',
        'Адреса проживання',
        'Контактні дані',
        'Вибір лікаря',
        'Підтвердження'
    ];

    const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
        control,
        name: "person_data.phones"
    });

    const { fields: emergencyPhoneFields, append: appendEmergencyPhone, remove: removeEmergencyPhone } = useFieldArray({
        control,
        name: "person_data.emergency_contact.phones"
    });

    const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({
        control,
        name: "person_data.addresses"
    });

    const { fields: documentFields, append: appendDocument, remove: removeDocument } = useFieldArray({
        control,
        name: "person_data.documents"
    });

    const handleNext = async () => {
        let fieldsToValidate: any = [];

        switch (activeStep) {
            case 0:
                fieldsToValidate = [
                    'person_data.first_name',
                    'person_data.last_name',
                    'person_data.second_name',
                    'person_data.birth_date',
                    'person_data.gender',
                    'person_data.tax_id',
                    'person_data.birth_settlement',
                    'person_data.birth_country'
                ];
                break;
            case 1:
                fieldsToValidate = ['person_data.documents'];
                break;
            case 2:
                fieldsToValidate = ['person_data.addresses'];
                break;
            case 3:
                fieldsToValidate = [
                    'person_data.phones',
                    'person_data.emergency_contact.first_name',
                    'person_data.emergency_contact.last_name',
                    'person_data.emergency_contact.phones'
                ];
                break;
            case 4:
                fieldsToValidate = [
                    'doctor_email',
                    'scope'
                ];
                break;
        }

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);

        try {
            data.declaration_request_id = crypto.randomUUID();

            console.log('Submitting patient declaration:', data);
            const result = await api.post('declarations/patient/create', data).then(result => result.data);


            setSubmitStatus({
                open: true,
                type: 'success',
                message: `Декларацію успішно створено! Номер декларації: ${result.declaration_number}. Очікуйте на розгляд та доповнення лікарем.`,
            });

        } catch (error) {
            console.error('Error submitting declaration:', error);
            setSubmitStatus({
                open: true,
                type: 'error',
                message: 'Помилка при створенні декларації. Спробуйте ще раз.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = (step: any) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                <PersonOutline sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Особисті дані пацієнта
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="person_data.last_name"
                                control={control}
                                rules={{ required: "Прізвище обов'язкове" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Прізвище"
                                        fullWidth
                                        error={!!errors.person_data?.last_name}
                                        helperText={errors.person_data?.last_name?.message}
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="person_data.first_name"
                                control={control}
                                rules={{ required: "Ім'я обов'язкове" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Ім'я"
                                        fullWidth
                                        error={!!errors.person_data?.first_name}
                                        helperText={errors.person_data?.first_name?.message}
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="person_data.second_name"
                                control={control}
                                rules={{ required: "По батькові обов'язкове" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="По батькові"
                                        fullWidth
                                        error={!!errors.person_data?.second_name}
                                        helperText={errors.person_data?.second_name?.message}
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="person_data.birth_date"
                                control={control}
                                rules={{ required: "Дата народження обов'язкова" }}
                                render={({ field }) => (
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                                        <DatePicker
                                            {...field}
                                            label="Дата народження"
                                            format="dd.MM.yyyy"
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!errors.person_data?.birth_date,
                                                    helperText: errors.person_data?.birth_date?.message,
                                                },
                                            }}
                                            value={field.value ? new Date(field.value) : null}
                                            onChange={(date) => field.onChange(date)}
                                        />
                                    </LocalizationProvider>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="person_data.gender"
                                control={control}
                                rules={{ required: "Стать обов'язкова" }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.person_data?.gender}>
                                        <InputLabel>Стать</InputLabel>
                                        <Select {...field} label="Стать">
                                            {Object.entries(GenderEnum).map(([key, value]) => (
                                                <MenuItem key={key} value={key}>{value}</MenuItem>
                                            ))}
                                        </Select>
                                        {errors.person_data?.gender && (
                                            <FormHelperText>{errors.person_data.gender.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="person_data.tax_id"
                                control={control}
                                rules={{
                                    required: "РНОКПП обов'язковий",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: 'РНОКПП має містити 10 цифр'
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="РНОКПП (ІПН)"
                                        fullWidth
                                        error={!!errors.person_data?.tax_id}
                                        helperText={errors.person_data?.tax_id?.message}
                                        variant="outlined"
                                        inputProps={{ maxLength: 10 }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="person_data.birth_settlement"
                                control={control}
                                rules={{ required: "Місце народження обов'язкове" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Місце народження (населений пункт)"
                                        fullWidth
                                        error={!!errors.person_data?.birth_settlement}
                                        helperText={errors.person_data?.birth_settlement?.message}
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="person_data.birth_country"
                                control={control}
                                rules={{ required: "Країна народження обов'язкова" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Країна народження"
                                        fullWidth
                                        error={!!errors.person_data?.birth_country}
                                        helperText={errors.person_data?.birth_country?.message}
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                );

            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">
                                    <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Документи, що посвідчують особу
                                </Typography>
                                <Button
                                    startIcon={<Add />}
                                    onClick={() => appendDocument({
                                        type: 'PASSPORT',
                                        number: '',
                                        expiration_date: '',
                                        issued_by: '',
                                        issued_at: ''
                                    })}
                                    variant="outlined"
                                    size="small"
                                >
                                    Додати документ
                                </Button>
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        {documentFields.map((field, index) => (
                            <Grid item xs={12} key={field.id}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                Документ {index + 1}
                                            </Typography>
                                            {documentFields.length > 1 && (
                                                <IconButton
                                                    onClick={() => removeDocument(index)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            )}
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={4}>
                                                <Controller
                                                    name={`person_data.documents.${index}.type`}
                                                    control={control}
                                                    rules={{ required: "Тип документа обов'язковий" }}
                                                    render={({ field }) => (
                                                        <FormControl fullWidth error={!!errors.person_data?.documents?.[index]?.type}>
                                                            <InputLabel>Тип документа</InputLabel>
                                                            <Select {...field} label="Тип документа">
                                                                {Object.entries(DocumentType).map(([key, value]) => (
                                                                    <MenuItem key={key} value={key}>{value}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={4}>
                                                <Controller
                                                    name={`person_data.documents.${index}.number`}
                                                    control={control}
                                                    rules={{ required: "Номер документа обов'язковий" }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Серія та номер"
                                                            fullWidth
                                                            error={!!errors.person_data?.documents?.[index]?.number}
                                                            helperText={errors.person_data?.documents?.[index]?.number?.message}
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={4}>
                                                <Controller
                                                    name={`person_data.documents.${index}.expiration_date`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                                                            <DatePicker
                                                                {...field}
                                                                label="Дійсний до"
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
                                                    name={`person_data.documents.${index}.issued_by`}
                                                    control={control}
                                                    rules={{ required: "Ким виданий обов'язково" }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Ким виданий"
                                                            fullWidth
                                                            error={!!errors.person_data?.documents?.[index]?.issued_by}
                                                            helperText={errors.person_data?.documents?.[index]?.issued_by?.message}
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Controller
                                                    name={`person_data.documents.${index}.issued_at`}
                                                    control={control}
                                                    rules={{ required: "Дата видачі обов'язкова" }}
                                                    render={({ field }) => (
                                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                                                            <DatePicker
                                                                {...field}
                                                                label="Дата видачі"
                                                                format="dd.MM.yyyy"
                                                                slotProps={{
                                                                    textField: {
                                                                        fullWidth: true,
                                                                        error: !!errors.person_data?.documents?.[index]?.issued_at,
                                                                        helperText: errors.person_data?.documents?.[index]?.issued_at?.message,
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
                            </Grid>
                        ))}
                    </Grid>
                );

            case 2:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">
                                    <Home sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Адреси
                                </Typography>
                                <Button
                                    startIcon={<Add />}
                                    onClick={() => appendAddress({
                                        type: 'RESIDENCE',
                                        country: 'Україна',
                                        area: '',
                                        region: '',
                                        settlement: '',
                                        settlement_type: 'CITY',
                                        settlement_id: '',
                                        street_type: 'STREET',
                                        street: '',
                                        building: '',
                                        apartment: '',
                                        zip: ''
                                    })}
                                    variant="outlined"
                                    size="small"
                                >
                                    Додати адресу
                                </Button>
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        {addressFields.map((field, index) => (
                            <Grid item xs={12} key={field.id}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                Адреса {index + 1}
                                            </Typography>
                                            {addressFields.length > 1 && (
                                                <IconButton
                                                    onClick={() => removeAddress(index)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            )}
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={4}>
                                                <Controller
                                                    name={`person_data.addresses.${index}.type`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormControl fullWidth>
                                                            <InputLabel>Тип адреси</InputLabel>
                                                            <Select {...field} label="Тип адреси">
                                                                {Object.entries(AddressType).map(([key, value]) => (
                                                                    <MenuItem key={key} value={key}>{value}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={4}>
                                                <Controller
                                                    name={`person_data.addresses.${index}.country`}
                                                    control={control}
                                                    rules={{ required: "Країна обов'язкова" }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Країна"
                                                            fullWidth
                                                            error={!!errors.person_data?.addresses?.[index]?.country}
                                                            helperText={errors.person_data?.addresses?.[index]?.country?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={4}>
                                                <Controller
                                                    name={`person_data.addresses.${index}.zip`}
                                                    control={control}
                                                    rules={{ required: "Поштовий індекс обов'язковий" }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Поштовий індекс"
                                                            fullWidth
                                                            error={!!errors.person_data?.addresses?.[index]?.zip}
                                                            helperText={errors.person_data?.addresses?.[index]?.zip?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={4}>
                                                <Controller
                                                    name={`person_data.addresses.${index}.area`}
                                                    control={control}
                                                    rules={{ required: "Область обов'язкова" }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Область"
                                                            fullWidth
                                                            error={!!errors.person_data?.addresses?.[index]?.area}
                                                            helperText={errors.person_data?.addresses?.[index]?.area?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={4}>
                                                <Controller
                                                    name={`person_data.addresses.${index}.region`}
                                                    control={control}
                                                    rules={{ required: "Район обов'язковий" }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Район"
                                                            fullWidth
                                                            error={!!errors.person_data?.addresses?.[index]?.region}
                                                            helperText={errors.person_data?.addresses?.[index]?.region?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={4}>
                                                <Controller
                                                    name={`person_data.addresses.${index}.settlement_type`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormControl fullWidth>
                                                            <InputLabel>Тип населеного пункту</InputLabel>
                                                            <Select {...field} label="Тип населеного пункту">
                                                                {Object.entries(SettlementType).map(([key, value]) => (
                                                                    <MenuItem key={key} value={key}>{value}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Controller
                                                    name={`person_data.addresses.${index}.settlement`}
                                                    control={control}
                                                    rules={{ required: "Населений пункт обов'язковий" }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Населений пункт"
                                                            fullWidth
                                                            error={!!errors.person_data?.addresses?.[index]?.settlement}
                                                            helperText={errors.person_data?.addresses?.[index]?.settlement?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Controller
                                                    name={`person_data.addresses.${index}.settlement_id`}
                                                    control={control}
                                                    rules={{ required: "ID населеного пункту обов'язковий" }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Код населеного пункту (КОАТУУ)"
                                                            fullWidth
                                                            error={!!errors.person_data?.addresses?.[index]?.settlement_id}
                                                            helperText={errors.person_data?.addresses?.[index]?.settlement_id?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={3}>
                                                <Controller
                                                    name={`person_data.addresses.${index}.street_type`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormControl fullWidth>
                                                            <InputLabel>Тип вулиці</InputLabel>
                                                            <Select {...field} label="Тип вулиці">
                                                                {Object.entries(StreetType).map(([key, value]) => (
                                                                    <MenuItem key={key} value={key}>{value}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={5}>
                                                <Controller
                                                    name={`person_data.addresses.${index}.street`}
                                                    control={control}
                                                    rules={{ required: "Вулиця обов'язкова" }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Назва вулиці"
                                                            fullWidth
                                                            error={!!errors.person_data?.addresses?.[index]?.street}
                                                            helperText={errors.person_data?.addresses?.[index]?.street?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={2}>
                                                <Controller
                                                    name={`person_data.addresses.${index}.building`}
                                                    control={control}
                                                    rules={{ required: "Будинок обов'язковий" }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Будинок"
                                                            fullWidth
                                                            error={!!errors.person_data?.addresses?.[index]?.building}
                                                            helperText={errors.person_data?.addresses?.[index]?.building?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={2}>
                                                <Controller
                                                    name={`person_data.addresses.${index}.apartment`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Квартира"
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                );

            case 3:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                <Phone sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Контактні дані
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        {/* Patient phones */}
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle1">Телефони пацієнта</Typography>
                                <Button
                                    startIcon={<Add />}
                                    onClick={() => appendPhone({ type: 'mobile', number: '' })}
                                    variant="outlined"
                                    size="small"
                                >
                                    Додати телефон
                                </Button>
                            </Box>

                            {phoneFields.map((field, index) => (
                                <Box key={field.id} mb={2}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={3}>
                                            <Controller
                                                name={`person_data.phones.${index}.type`}
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControl fullWidth>
                                                        <InputLabel>Тип телефону</InputLabel>
                                                        <Select {...field} label="Тип телефону">
                                                            {Object.entries(PhoneType).map(([key, value]) => (
                                                                <MenuItem key={key} value={key}>{value}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={8}>
                                            <Controller
                                                name={`person_data.phones.${index}.number`}
                                                control={control}
                                                rules={{
                                                    required: "Номер телефону обов'язковий",
                                                    pattern: {
                                                        value: /^\+380\d{9}$/,
                                                        message: 'Формат: +380XXXXXXXXX'
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Номер телефону"
                                                        placeholder="+380XXXXXXXXX"
                                                        fullWidth
                                                        error={!!errors.person_data?.phones?.[index]?.number}
                                                        helperText={errors.person_data?.phones?.[index]?.number?.message}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start"><Phone /></InputAdornment>,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={1}>
                                            {phoneFields.length > 1 && (
                                                <IconButton
                                                    onClick={() => removePhone(index)}
                                                    color="error"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Grid>

                        {/* Emergency contact */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                <ContactEmergency sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Контактна особа для екстрених випадків
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="person_data.emergency_contact.last_name"
                                control={control}
                                rules={{ required: "Прізвище контактної особи обов'язкове" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Прізвище"
                                        fullWidth
                                        error={!!errors.person_data?.emergency_contact?.last_name}
                                        helperText={errors.person_data?.emergency_contact?.last_name?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="person_data.emergency_contact.first_name"
                                control={control}
                                rules={{ required: "Ім'я контактної особи обов'язкове" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Ім'я"
                                        fullWidth
                                        error={!!errors.person_data?.emergency_contact?.first_name}
                                        helperText={errors.person_data?.emergency_contact?.first_name?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="person_data.emergency_contact.second_name"
                                control={control}
                                rules={{ required: "По батькові контактної особи обов'язкове" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="По батькові"
                                        fullWidth
                                        error={!!errors.person_data?.emergency_contact?.second_name}
                                        helperText={errors.person_data?.emergency_contact?.second_name?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
                                <Typography variant="subtitle1">Телефони контактної особи</Typography>
                                <Button
                                    startIcon={<Add />}
                                    onClick={() => appendEmergencyPhone({ type: 'mobile', number: '' })}
                                    variant="outlined"
                                    size="small"
                                >
                                    Додати телефон
                                </Button>
                            </Box>

                            {emergencyPhoneFields.map((field, index) => (
                                <Box key={field.id} mb={2}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={3}>
                                            <Controller
                                                name={`person_data.emergency_contact.phones.${index}.type`}
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControl fullWidth>
                                                        <InputLabel>Тип телефону</InputLabel>
                                                        <Select {...field} label="Тип телефону">
                                                            {Object.entries(PhoneType).map(([key, value]) => (
                                                                <MenuItem key={key} value={key}>{value}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={8}>
                                            <Controller
                                                name={`person_data.emergency_contact.phones.${index}.number`}
                                                control={control}
                                                rules={{
                                                    required: "Номер телефону обов'язковий",
                                                    pattern: {
                                                        value: /^\+380\d{9}$/,
                                                        message: 'Формат: +380XXXXXXXXX'
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Номер телефону"
                                                        placeholder="+380XXXXXXXXX"
                                                        fullWidth
                                                        error={!!errors.person_data?.emergency_contact?.phones?.[index]?.number}
                                                        helperText={errors.person_data?.emergency_contact?.phones?.[index]?.number?.message}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start"><Phone /></InputAdornment>,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={1}>
                                            {emergencyPhoneFields.length > 1 && (
                                                <IconButton
                                                    onClick={() => removeEmergencyPhone(index)}
                                                    color="error"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Grid>
                    </Grid>
                );

            case 4:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                <LocalHospital sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Вибір лікаря
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        <Grid item xs={12}>
                            <Alert severity="info" sx={{ mb: 3 }}>
                                Оберіть лікаря, який буде обслуговувати вас за цією декларацією.
                                Лікар доповнить професійні дані після розгляду вашої заявки.
                            </Alert>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="scope"
                                control={control}
                                rules={{ required: "Оберіть тип лікаря" }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.scope}>
                                        <InputLabel>Тип лікаря</InputLabel>
                                        <Select {...field} label="Тип лікаря">
                                            {Object.entries(DeclarationScope).map(([key, value]) => (
                                                <MenuItem key={key} value={key}>{value}</MenuItem>
                                            ))}
                                        </Select>
                                        {errors.scope && (
                                            <FormHelperText>{errors.scope.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="doctor_email"
                                control={control}
                                rules={{ required: "Оберіть лікаря" }}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        options={doctors}
                                        loading={loadingDoctors}
                                        getOptionLabel={(option: any) =>
                                            typeof option === 'string'
                                                ? option
                                                : `${option.name} - ${option.specialty}`
                                        }
                                        onChange={(_, value) => field.onChange(value?.email || '')}
                                        value={doctors.find((d: any) => d.email === field.value) || null}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Оберіть лікаря"
                                                error={!!errors.doctor_email}
                                                helperText={errors.doctor_email?.message}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {loadingDoctors ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LocalHospital />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                        renderOption={(props, option: any) => (
                                            <Box component="li" {...props}>
                                                <Box sx={{ width: '100%' }}>
                                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="body1">{option.name}</Typography>
                                                        <Chip
                                                            label={`${option.available_slots} місць`}
                                                            size="small"
                                                            color={option.available_slots > 100 ? 'success' :
                                                                option.available_slots > 20 ? 'warning' : 'error'}
                                                        />
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {option.specialty}
                                                    </Typography>
                                                    <Typography variant="caption" display="block" color="text.secondary">
                                                        {option.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}
                                        noOptionsText={loadingDoctors ? "Завантаження..." : "Лікарі не знайдені"}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                );

            case 5:
                const formData = getValues();
                const selectedDoctor = mockDoctors.find(d => d.email === formData.doctor_email);

                return (

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                <CheckCircle sx={{ mr: 1, verticalAlign: 'middle', color: 'success.main' }} />
                                Підтвердження даних декларації
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                        </Grid>

                        <Grid item xs={12}>
                            <Alert severity="info" sx={{ mb: 3 }}>
                                Будь ласка, перевірте всі дані перед відправкою декларації.
                                Після подання декларація буде направлена на розгляд та доповнення обраному лікарю.
                            </Alert>
                        </Grid>

                        {/* Personal data summary */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                                        Персональні дані
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>ПІБ:</strong> {formData.person_data.last_name} {formData.person_data.first_name} {formData.person_data.second_name}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Дата народження:</strong> {formData.person_data.birth_date?.toString()}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Стать:</strong> {GenderEnum[formData.person_data.gender as keyof typeof GenderEnum]}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>РНОКПП:</strong> {formData.person_data.tax_id}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Місце народження:</strong> {formData.person_data.birth_settlement}, {formData.person_data.birth_country}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Doctor info */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                                        Обраний лікар
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Лікар:</strong> {selectedDoctor?.name}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Спеціальність:</strong> {selectedDoctor?.specialty}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Заклад:</strong> {selectedDoctor?.division}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Тип декларації:</strong> {DeclarationScope[formData.scope as keyof typeof DeclarationScope]}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Contact summary */}
                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                                        Контактні дані
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Телефони:</strong>
                                    </Typography>
                                    {formData.person_data.phones.map((phone, index) => (
                                        <Typography key={index} variant="body2" gutterBottom ml={2}>
                                            {PhoneType[phone.type as keyof typeof PhoneType]}: {phone.number}
                                        </Typography>
                                    ))}
                                    <Typography variant="body2" gutterBottom mt={1}>
                                        <strong>Контактна особа:</strong> {formData.person_data.emergency_contact.last_name} {formData.person_data.emergency_contact.first_name}
                                    </Typography>
                                    {formData.person_data.emergency_contact.phones.map((phone, index) => (
                                        <Typography key={index} variant="body2" gutterBottom ml={2}>
                                            {PhoneType[phone.type as keyof typeof PhoneType]}: {phone.number}
                                        </Typography>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Consents */}
                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                                        Згоди та підтвердження
                                    </Typography>

                                    <FormControlLabel
                                        control={<Checkbox required color="primary" />}
                                        label="Я даю згоду на обробку моїх персональних даних відповідно до Закону України «Про захист персональних даних»"
                                    />

                                    <FormControlLabel
                                        control={<Checkbox required color="primary" />}
                                        label="Я підтверджую, що всі надані мною дані є достовірними та актуальними"
                                    />

                                    <FormControlLabel
                                        control={<Checkbox required color="primary" />}
                                        label="Я ознайомлений(а) з правами та обов'язками пацієнта згідно чинного законодавства"
                                    />

                                    <FormControlLabel
                                        control={<Checkbox required color="primary" />}
                                        label="Я даю згоду на медичне обслуговування обраним лікарем"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Alert severity="warning">
                                <strong>Увага!</strong> Після підтвердження декларація буде передана лікарю для доповнення професійної інформації
                                (дати початку/закінчення, причина, відомості про медичний заклад тощо).
                                Ви отримаєте повідомлення про статус розгляду.
                            </Alert>
                        </Grid>
                    </Grid>
                );

            default:
                return 'Невідомий крок';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom align="center" color="primary">
                    Подання декларації про вибір лікаря
                </Typography>

                <Stepper activeStep={activeStep} sx={{ my: 4 }} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ minHeight: 400, mb: 4 }}>
                        {renderStepContent(activeStep)}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            size="large"
                            startIcon={<ChevronLeft />}
                        >
                            Назад
                        </Button>

                        <Box>
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}
                                    size="large"
                                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                                >
                                    {isSubmitting ? 'Відправка...' : 'Подати декларацію'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    size="large"
                                    endIcon={<ChevronRight />}
                                >
                                    Далі
                                </Button>
                            )}
                        </Box>
                    </Box>
                </form>
            </Paper>

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
        </Container>
    );
};

export default PatientDeclarationForm;