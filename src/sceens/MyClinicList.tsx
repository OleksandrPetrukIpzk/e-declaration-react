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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import {LandingScreenHeader} from "../components/LandingScreenHeader";
import {useNavigate} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import GroupIcon from '@mui/icons-material/Group';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

export const MyClinicList = () => {
    const [clinicList, setClinicList] = useState<ClinicType[] | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedClinicId, setSelectedClinicId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getMyClinic = async () => {
            const res = await ClinicDaoService.getClinics();
            setClinicList(res)
        }
        getMyClinic();
    }, []);

    const handleLeaveClinic = async () => {
        if (selectedClinicId) {
            await ClinicDaoService.leaveClinic(selectedClinicId);
            setClinicList(clinicList?.filter(clinic => clinic.id !== selectedClinicId) || null);
            setOpenDialog(false);
            setSelectedClinicId(null);
        }
    };

    const handleOpenDialog = (clinicId: number) => {
        setSelectedClinicId(clinicId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedClinicId(null);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <LandingScreenHeader />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                    Мої клініки
                </Typography>
                <Grid container spacing={3}>
                    {clinicList?.map((clinic) => (
                        <Grid item xs={12} md={6} lg={4} key={clinic.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6,
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <MedicalServicesIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                                            {clinic.clinicName}
                                        </Typography>
                                    </Box>

                                    {clinic.clinicBio && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {clinic.clinicBio}
                                        </Typography>
                                    )}

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <CalendarMonthIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(clinic.dateOfCreate).toLocaleDateString('uk-UA', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </Typography>
                                    </Box>

                                    {clinic.invites && clinic.invites.length > 0 && (
                                        <Chip
                                            icon={<GroupIcon />}
                                            label={`Запитів: ${clinic.invites.length}`}
                                            color="primary"
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    )}
                                </CardContent>

                                <CardActions sx={{ p: 2, pt: 0, gap: 1, flexWrap: 'wrap' }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<EditIcon />}
                                        onClick={() => navigate(`/edit-clinic/${clinic.id}`)}
                                        sx={{ flex: 1, minWidth: '120px' }}
                                    >
                                        Редагувати
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<GroupIcon />}
                                        onClick={() => navigate(`/invite-clinic/${clinic.id}`)}
                                        disabled={!clinic.invites?.length}
                                        sx={{ flex: 1, minWidth: '120px' }}
                                    >
                                        Запити ({clinic.invites?.length || 0})
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        startIcon={<ExitToAppIcon />}
                                        onClick={() => handleOpenDialog(clinic.id)}
                                        sx={{ flex: 1, minWidth: '120px' }}
                                    >
                                        Вийти
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {(!clinicList || clinicList.length === 0) && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <MedicalServicesIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            У вас поки немає клінік
                        </Typography>
                    </Box>
                )}
            </Container>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>Підтвердження виходу</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ви впевнені, що хочете вийти з клініки? Цю дію не можна буде скасувати.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Скасувати
                    </Button>
                    <Button onClick={handleLeaveClinic} color="error" variant="contained">
                        Вийти
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}