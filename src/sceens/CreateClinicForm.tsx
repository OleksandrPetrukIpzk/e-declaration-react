import {Controller, useForm} from "react-hook-form";
import {Box, Button, TextField} from "@mui/material";
import {CreateClinicDTO} from "../types/clinic.types";
import {ClinicDaoService} from "../services/clinicDaoService";
import {LandingScreenHeader} from "../components/LandingScreenHeader";

export const CreateClinicForm = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CreateClinicDTO>({
        defaultValues: {
            clinicName: '',
            clinicAddress: '',
            clinicBio: '',
        },
    });

    const onSubmit = async (data: CreateClinicDTO) => {
        const response = ClinicDaoService.create(data);
        console.log(response);
    };

    return (
        <>
            <LandingScreenHeader />
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ maxWidth: 400, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}
            noValidate
        >
            <Controller
                name="clinicName"
                control={control}
                rules={{ required: 'Clinic name is required' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Clinic Name"
                        error={!!errors.clinicName}
                        helperText={errors.clinicName?.message}
                        fullWidth
                    />
                )}
            />

            <Controller
                name="clinicAddress"
                control={control}
                rules={{ required: 'Clinic address is required' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Clinic Address"
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
                        label="Clinic Bio (optional)"
                        multiline
                        rows={4}
                        fullWidth
                    />
                )}
            />

            <Button type="submit" variant="contained" color="primary">
                Create Clinic
            </Button>
        </Box>
        </>
    );
};