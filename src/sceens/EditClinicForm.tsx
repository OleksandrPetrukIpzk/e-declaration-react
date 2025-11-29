import { UpdateClinicDto } from "../types/clinic.types";
import {Controller, useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {Box, Button, CircularProgress, FormControlLabel, Switch, TextField, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import {ClinicDaoService} from "../services/clinicDaoService";
import {LandingScreenHeader} from "../components/LandingScreenHeader";


export const EditClinicForm = () => {
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<UpdateClinicDto>();
    const [loading, setLoading] = useState(true);
    const { id } = useParams<{ id: string }>();

    const onSubmit = async (data: UpdateClinicDto) => {
        await ClinicDaoService.editClinic(data, id || '');
    }

    useEffect(() => {
        ClinicDaoService.getClinicById(id ?? '').then((res) => {
                reset(res);
            })
            .finally(() => setLoading(false));
    }, [id, reset]);

    if (loading) {
        return (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <LandingScreenHeader />
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ maxWidth: 500, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <Typography variant="h5">Редагувати клініку</Typography>

            <Controller
                name="clinicName"
                control={control}
                rules={{ required: 'Назва клініки обов\'язкова' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Назва клініки"
                        error={!!errors.clinicName}
                        helperText={errors.clinicName?.message}
                        fullWidth
                    />
                )}
            />

            <Controller
                name="clinicAddress"
                control={control}
                rules={{ required: 'Адреса клініки обов\'язкова' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Адреса клініки"
                        error={!!errors.clinicAddress}
                        helperText={errors.clinicAddress?.message}
                        fullWidth
                    />
                )}
            />

            <Controller
                name="clinicBio"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Опис клініки"
                        multiline
                        rows={4}
                        fullWidth
                    />
                )}
            />

            <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                    <FormControlLabel
                        control={<Switch {...field} checked={field.value ?? false} />}
                        label="Активна"
                    />
                )}
            />

            <Button type="submit" variant="contained" color="primary">
                Зберегти зміни
            </Button>
        </Box>
        </>
    );
};