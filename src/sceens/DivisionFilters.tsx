import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Card,
    CardContent,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Box,
    Typography,
} from '@mui/material';
import { DivisionSearchDto, DivisionType, DivisionStatus } from '../types/division.types';

interface DivisionFiltersProps {
    onFilter: (filters: DivisionSearchDto) => void;
    onClear: () => void;
}

const DivisionFilters: React.FC<DivisionFiltersProps> = ({ onFilter, onClear }) => {
    const { control, handleSubmit, reset, watch } = useForm<DivisionSearchDto>({
        defaultValues: {
            name: '',
            type: undefined,
            status: undefined,
            mountain_group: undefined,
            dls_verified: undefined,
        },
    });

    const watchedValues = watch();

    const hasActiveFilters = Object.values(watchedValues).some(
        value => value !== undefined && value !== ''
    );

    const handleFilter = (data: DivisionSearchDto) => {
        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined && value !== '')
        );
        onFilter(cleanedData);
    };

    const handleClear = () => {
        reset({
            name: '',
            type: undefined,
            status: undefined,
            mountain_group: undefined,
            dls_verified: undefined,
        });
        onClear();
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Фільтри пошуку
                </Typography>
                <form onSubmit={handleSubmit(handleFilter)}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Пошук за назвою"
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Тип</InputLabel>
                                        <Select {...field} label="Тип" value={field.value || ''}>
                                            <MenuItem value="">Всі типи</MenuItem>
                                            <MenuItem value={DivisionType.CLINIC}>Клініка</MenuItem>
                                            <MenuItem value={DivisionType.AMBULATORY}>Амбулаторія</MenuItem>
                                            <MenuItem value={DivisionType.PHARMACY}>Pharmacy</MenuItem>
                                            <MenuItem value={DivisionType.HOSPITAL}>Госпіталь</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Статус</InputLabel>
                                        <Select {...field} label="Статус" value={field.value || ''}>
                                            <MenuItem value="">Всі статуси</MenuItem>
                                            <MenuItem value={DivisionStatus.ACTIVE}>Активна</MenuItem>
                                            <MenuItem value={DivisionStatus.INACTIVE}>Неактивна</MenuItem>
                                            <MenuItem value={DivisionStatus.PENDING}>В очікуванні</MenuItem>
                                            <MenuItem value={DivisionStatus.SUSPENDED}>Призупинена</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Controller
                                name="mountain_group"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Гірська група</InputLabel>
                                        <Select
                                            value={value === undefined ? '' : value}
                                            label="Гірська група"
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                onChange(val === '' ? undefined : val === 'true');
                                            }}
                                        >
                                            <MenuItem value="">Всі</MenuItem>
                                            <MenuItem value="true">Так</MenuItem>
                                            <MenuItem value="false">Ні</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Controller
                                name="dls_verified"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <FormControl fullWidth size="small">
                                        <InputLabel>DLS верифікована</InputLabel>
                                        <Select
                                            value={value === undefined ? '' : value}
                                            label="DLS верифікована"
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                onChange(val === '' ? undefined : val === 'true');
                                            }}
                                        >
                                            <MenuItem value="">Всі</MenuItem>
                                            <MenuItem value="true">Так</MenuItem>
                                            <MenuItem value="false">Ні</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={1}>
                            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="small"
                                    fullWidth
                                >
                                    Фільтр
                                </Button>
                                {hasActiveFilters && (
                                    <Button
                                        onClick={handleClear}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    >
                                        Очистити
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default DivisionFilters;