import {useEffect, useState} from "react";
import {ClinicType} from "../types/clinic.types";
import {ClinicDaoService} from "../services/clinicDaoService";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    Grid,
    Typography,
    Alert,
    Snackbar,
} from "@mui/material";
import {LandingScreenHeader} from "../components/LandingScreenHeader";
import {useUserData} from "../hooks/useUserData";
import {UserType} from "../constants/userConsts";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import InfoIcon from '@mui/icons-material/Info';


export const ActiveClinicList = () => {
    const [clinicList, setClinicList] = useState<ClinicType[] | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const {user} = useUserData();
    const isDoctor = user?.role === UserType.Hospital;

    useEffect(() => {
        const getMyClinic = async () => {
            const res = await ClinicDaoService.getActiveClinics();
            setClinicList(res)
        }
        getMyClinic();
    }, []);

    const handleInviteToClinic = async (clinicId: number) => {
        const response = isDoctor
            ? await ClinicDaoService.joinToClinicAsWorker(clinicId)
            : await ClinicDaoService.invite(clinicId);

        setSnackbarMessage(isDoctor
            ? 'Запит на приєднання відправлено!'
            : 'Запрошення надіслано!');
        setSnackbarOpen(true);
    }

    const isUserInClinic = (clinic: ClinicType) => {
        return clinic?.clinicAdmins?.some((clinicUser) => clinicUser.id === user?.id) ||
               clinic?.clinicWorkers?.some((clinicUser) => clinicUser.id === user?.id);
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <LandingScreenHeader />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                        Активні клініки
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Перегляньте доступні клініки та надішліть запит на приєднання
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {clinicList?.map((clinic) => {
                        const isMember = isUserInClinic(clinic);

                        return (
                            <Grid item xs={12} sm={6} md={4} key={clinic.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: isMember ? 'none' : 'translateY(-4px)',
                                            boxShadow: isMember ? 1 : 6,
                                        },
                                        opacity: isMember ? 0.7 : 1,
                                    }}
                                >
                                    {isMember && (
                                        <Chip
                                            icon={<CheckCircleIcon />}
                                            label="Ви вже в цій клініці"
                                            color="success"
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                zIndex: 1,
                                            }}
                                        />
                                    )}

                                    <CardContent sx={{ flexGrow: 1, pt: isMember ? 5 : 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <MedicalServicesIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                                            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                                                {clinic.clinicName}
                                            </Typography>
                                        </Box>

                                        {clinic.clinicBio ? (
                                            <Box sx={{ display: 'flex', mb: 2 }}>
                                                <InfoIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary', mt: 0.2 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {clinic.clinicBio}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                                                Опис відсутній
                                            </Typography>
                                        )}

                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {clinic.clinicAdmins && clinic.clinicAdmins.length > 0 && (
                                                <Chip
                                                    label={`Адміністраторів: ${clinic.clinicAdmins.length}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}
                                            {clinic.clinicWorkers && clinic.clinicWorkers.length > 0 && (
                                                <Chip
                                                    label={`Працівників: ${clinic.clinicWorkers.length}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                    </CardContent>

                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            fullWidth
                                            variant={isMember ? "outlined" : "contained"}
                                            disabled={isMember}
                                            startIcon={<PersonAddIcon />}
                                            onClick={() => handleInviteToClinic(clinic.id)}
                                        >
                                            {isMember ? 'Вже є членом' : 'Доєднатися'}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                {(!clinicList || clinicList.length === 0) && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <MedicalServicesIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            Наразі немає активних клінік
                        </Typography>
                    </Box>
                )}
            </Container>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}