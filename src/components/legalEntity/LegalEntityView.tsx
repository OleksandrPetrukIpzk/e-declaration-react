import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Chip,
    IconButton,
    Divider,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Business as BusinessIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    CalendarToday as CalendarIcon,
    Assignment as AssignmentIcon,
    Public as PublicIcon,
    AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';

// Типи
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

const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    'active': 'success',
    'inactive': 'error',
    'pending': 'warning',
    'suspended': 'error',
    'new': 'info',
};

const statusLabels: Record<string, string> = {
    'active': 'Активна',
    'inactive': 'Неактивна',
    'pending': 'Очікує',
    'suspended': 'Призупинена',
    'new': 'Нова',
};

const phoneTypeLabels: Record<string, string> = {
    'MOBILE': 'Мобільний',
    'LAND_LINE': 'Стаціонарний',
    'FAX': 'Факс',
};

const addressTypeLabels: Record<string, string> = {
    'REGISTRATION': 'Реєстрація',
    'RESIDENCE': 'Фактична адреса',
    'POSTAL': 'Поштова',
};

interface LegalEntityViewProps {
    entity: LegalEntity;
    onEdit: () => void;
    onDelete: () => void;
    onBack: () => void;
}

const LegalEntityView: React.FC<LegalEntityViewProps> = ({
                                                             entity,
                                                             onEdit,
                                                             onDelete,
                                                             onBack
                                                         }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAddress = (address: Address) => {
        return `${address.settlement_type} ${address.settlement}, ${address.street_type} ${address.street}, ${address.building}${address.apartment ? `/${address.apartment}` : ''}, ${address.zip}`;
    };

    const formatFullAddress = (address: Address) => {
        return `${address.country === 'UA' ? 'Україна' : address.country}, ${address.area} область, ${address.region} район, ${formatAddress(address)}`;
    };

    return (
        <Box>
            {/* Заголовок з діями */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                    <IconButton onClick={onBack} color="primary">
                        <ArrowBackIcon />
                    </IconButton>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <BusinessIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" component="h1">
                            {entity.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {entity.short_name}
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" gap={1}>
                    <IconButton onClick={onEdit} color="primary" size="large">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={onDelete} color="error" size="large">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Основна інформація */}
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                            <AssignmentIcon color="primary" />
                            Основні відомості
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Повна назва
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {entity.name}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Скорочена назва
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {entity.short_name}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Організаційно-правова форма
                                    </Typography>
                                    <Chip
                                        label={entity.legal_form}
                                        color="primary"
                                        variant="outlined"
                                        icon={<AccountBalanceIcon />}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Публічна назва
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" display="flex" alignItems="center" gap={1}>
                                        <PublicIcon fontSize="small" color="action" />
                                        {entity.public_name}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        ЄДРПОУ
                                    </Typography>
                                    <Typography variant="h6" fontFamily="monospace" color="primary">
                                        {entity.edrpou}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Статус
                                    </Typography>
                                    <Chip
                                        label={statusLabels[entity.status] || entity.status}
                                        color={statusColors[entity.status] || 'default'}
                                        size="medium"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Контактна інформація */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                            <PhoneIcon color="primary" />
                            Контактна інформація
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Email
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" display="flex" alignItems="center" gap={1}>
                                        <EmailIcon fontSize="small" color="action" />
                                        {entity.email}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Телефони
                                    </Typography>
                                    <List dense>
                                        {entity.phones.map((phone, index) => (
                                            <ListItem key={index} sx={{ pl: 0 }}>
                                                <ListItemIcon>
                                                    <PhoneIcon color="action" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={phone.number}
                                                    secondary={phoneTypeLabels[phone.type] || phone.type}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Адреси */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                            <LocationIcon color="primary" />
                            Адреси
                        </Typography>

                        {entity.addresses.map((address, index) => (
                            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="subtitle1" fontWeight="medium">
                                            {addressTypeLabels[address.type] || address.type}
                                        </Typography>
                                        <Chip
                                            label={address.country === 'UA' ? 'Україна' : address.country}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>

                                    <Typography variant="body1" gutterBottom>
                                        {formatFullAddress(address)}
                                    </Typography>

                                    <Divider sx={{ my: 1 }} />

                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid item xs={6} md={3}>
                                            <Typography variant="caption" color="text.secondary">
                                                Область
                                            </Typography>
                                            <Typography variant="body2">
                                                {address.area}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Typography variant="caption" color="text.secondary">
                                                Район
                                            </Typography>
                                            <Typography variant="body2">
                                                {address.region}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Typography variant="caption" color="text.secondary">
                                                Населений пункт
                                            </Typography>
                                            <Typography variant="body2">
                                                {address.settlement_type} {address.settlement}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Typography variant="caption" color="text.secondary">
                                                Поштовий індекс
                                            </Typography>
                                            <Typography variant="body2" fontFamily="monospace">
                                                {address.zip}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>
                </Grid>

                {/* Бічна панель */}
                <Grid item xs={12} lg={4}>
                    {/* Системна інформація */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                            <CalendarIcon color="primary" />
                            Системна інформація
                        </Typography>

                        <Box mb={2}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Дата створення
                            </Typography>
                            <Typography variant="body1">
                                {formatDate(entity.created_at)}
                            </Typography>
                        </Box>

                        <Box mb={2}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Остання зміна
                            </Typography>
                            <Typography variant="body1">
                                {formatDate(entity.updated_at)}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                ID в системі
                            </Typography>
                            <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                                {entity.id}
                            </Typography>
                        </Box>
                    </Paper>

                    {/* Швидкі дії */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Швидкі дії
                        </Typography>

                        <Box display="flex" flexDirection="column" gap={2}>
                            <Chip
                                label="Редагувати інформацію"
                                clickable
                                onClick={onEdit}
                                icon={<EditIcon />}
                                color="primary"
                            />

                            <Chip
                                label="Видалити організацію"
                                clickable
                                onClick={onDelete}
                                icon={<DeleteIcon />}
                                color="error"
                                variant="outlined"
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LegalEntityView;