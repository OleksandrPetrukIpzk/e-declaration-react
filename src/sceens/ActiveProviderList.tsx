import {LandingScreenHeader} from "../components/LandingScreenHeader";
import {useEffect, useState} from "react";
import {UserType} from "../types/userTypes";
import {UserDaoService} from "../services/userDaoService";
import {
    Box,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    Chip,
    TextField,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import {AvatarIcon} from "../components/AvatarIcon";
import SearchIcon from '@mui/icons-material/Search';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const ActiveProviderList = () => {
    const [usersList, setUsersList] = useState<UserType[] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleFetchData = async () => {
            setLoading(true);
            const data = await UserDaoService.getActiveProviderList();
            setUsersList(data);
            setLoading(false);
        }
        handleFetchData();
    },[]);

    const filteredUsers = usersList?.filter(user => {
        const searchLower = searchQuery.toLowerCase();
        return (
            user.firstName?.toLowerCase().includes(searchLower) ||
            user.lastName?.toLowerCase().includes(searchLower) ||
            user.profession?.toLowerCase().includes(searchLower) ||
            user.region?.toLowerCase().includes(searchLower) ||
            user.address?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <LandingScreenHeader />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocalHospitalIcon sx={{ fontSize: 36, mr: 2, color: 'success.main' }} />
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                            Активні лікарі
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Список активних лікарів у системі
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder="Пошук за іменем, спеціалізацією, регіоном або адресою..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 1,
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                    />
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {filteredUsers?.map((user) => (
                                <Grid item xs={12} sm={6} md={4} key={user.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            position: 'relative',
                                            borderTop: '3px solid',
                                            borderTopColor: 'success.main',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 6,
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                            }}
                                        >
                                            <Chip
                                                icon={<CheckCircleIcon />}
                                                label="Активний"
                                                color="success"
                                                size="small"
                                            />
                                        </Box>

                                        <CardContent sx={{ pt: 6 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <AvatarIcon
                                                    firstName={user.firstName}
                                                    lastName={user.lastName}
                                                    size={60}
                                                />
                                                <Box sx={{ ml: 2, flex: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                        {user.firstName} {user.lastName}
                                                    </Typography>
                                                    <Chip
                                                        icon={<LocalHospitalIcon />}
                                                        label="Лікар"
                                                        color="info"
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                {user.profession && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <WorkIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {user.profession}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {user.region && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {user.region}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {user.address && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <HomeIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {user.address}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {(!filteredUsers || filteredUsers.length === 0) && (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <LocalHospitalIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    {searchQuery ? 'Лікарів не знайдено' : 'Немає активних лікарів'}
                                </Typography>
                                {searchQuery && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Спробуйте змінити параметри пошуку
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {filteredUsers && filteredUsers.length > 0 && (
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Знайдено активних лікарів: {filteredUsers.length}
                                    {usersList && searchQuery && ` з ${usersList.length}`}
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    )
};