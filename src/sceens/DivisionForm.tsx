import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Grid,
    Box,
} from '@mui/material';
import {CreateDivisionDto, UpdateDivisionDto, Division, DivisionType, DivisionStatus} from '../types/division.types';

interface DivisionFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateDivisionDto | UpdateDivisionDto) => Promise<void>;
    division?: Division;
    loading?: boolean;
}

const DivisionForm: React.FC<DivisionFormProps> = ({
                                                       open,
                                                       onClose,
                                                       onSubmit,
                                                       division,
                                                       loading = false,
                                                   }) => {
    const isEdit = !!division;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateDivisionDto | UpdateDivisionDto>({
        defaultValues: division ? {
            name: division.name,
            type: division.type,
            status: division.status,
            mountain_group: division.mountain_group,
            dls_id: division.dls_id,
            dls_verified: division.dls_verified,
        } : {
            name: '',
            type: DivisionType.HOSPITAL,
            status: DivisionStatus.ACTIVE,
            mountain_group: false,
            dls_id: '',
            dls_verified: false,
        },
    });

    React.useEffect(() => {
        if (open && division) {
            reset({
                name: division.name,
                type: division.type,
                status: division.status,
                mountain_group: division.mountain_group,
                dls_id: division.dls_id,
                dls_verified: division.dls_verified,
            });
        } else if (open && !division) {
            reset({
                name: '',
                type: DivisionType.HOSPITAL,
                status: DivisionStatus.ACTIVE,
                mountain_group: false,
                dls_id: '',
                dls_verified: false,
            });
        }
    }, [open, division, reset]);

    const handleFormSubmit = async (data: CreateDivisionDto | UpdateDivisionDto) => {
        await onSubmit(data);
        reset();
        onClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {isEdit ? 'Редагувати дивізію' : 'Створити дивізію'}
            </DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: "Назва є обов'язковою" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Назва дивізії"
                                            error={!!errors.name}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="dls_id"
                                    control={control}
                                    rules={{ required: "DLS ID є обов'язковим" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="DLS ID"
                                            error={!!errors.dls_id}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="type"
                                    control={control}
                                    rules={{ required: "Тип є обов'язковим" }}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.type}>
                                            <InputLabel>Тип дивізії</InputLabel>
                                            <Select {...field} label="Тип дивізії">
                                                <MenuItem value={DivisionType.CLINIC}>Клініка</MenuItem>
                                                <MenuItem value={DivisionType.AMBULATORY}>Амбулаторія</MenuItem>
                                                <MenuItem value={DivisionType.PHARMACY}>Pharmacy</MenuItem>
                                                <MenuItem value={DivisionType.HOSPITAL}>Госпіталь</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{ required: "Статус є обов'язковим" }}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.status}>
                                            <InputLabel>Статус</InputLabel>
                                            <Select {...field} label="Статус">
                                                <MenuItem value={DivisionStatus.ACTIVE}>Активна</MenuItem>
                                                <MenuItem value={DivisionStatus.INACTIVE}>Неактивна</MenuItem>
                                                <MenuItem value={DivisionStatus.PENDING}>В очікуванні</MenuItem>
                                                <MenuItem value={DivisionStatus.SUSPENDED}>Призупинена</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="mountain_group"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={value}
                                                    onChange={(e) => onChange(e.target.checked)}
                                                />
                                            }
                                            label="Гірська група"
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="dls_verified"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={value}
                                                    onChange={(e) => onChange(e.target.checked)}
                                                />
                                            }
                                            label="DLS верифікована"
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        Скасувати
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {isEdit ? 'Оновити' : 'Створити'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default DivisionForm;