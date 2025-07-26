import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    FormControlLabel,
    TextField,
    Typography
} from "@mui/material";
import {useForm} from "react-hook-form";
import {UserFormData} from "../types/userTypes";
import {UserDaoService} from "../services/userDaoService";
import {useUserData} from "../hooks/useUserData";
import {setUser} from "../redux/userSlice";
import {store} from "../redux/store";
import {LandingScreenHeader} from "../components/LandingScreenHeader";

export const EditProfile = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { isSubmitting, errors },
    } = useForm<UserFormData>();
    const {user} = useUserData()
    const onSubmit = async (data: UserFormData) => {
        try {
            const response = await UserDaoService.handleEditProfile(user ? user.id : 0, data);
            console.log(response)
            console.log(response.data);
            store.dispatch(setUser(response.data));
        } catch (error) {
            console.error(error);
            alert('Помилка при оновленні профілю');
        }
    };
    return (
        <div>
            <LandingScreenHeader />
        <Container maxWidth="sm">
            <Box mt={4}>
                <Typography variant="h5" mb={3}>
                    Редагування профілю
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Ім'я"
                        fullWidth
                        margin="normal"
                        defaultValue={user ? user.firstName : ''}
                        {...register('firstName')}
                    />
                    <TextField
                        label="Прізвище"
                        fullWidth
                        defaultValue={user ? user.lastName : ''}
                        margin="normal"
                        {...register('lastName')}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        defaultValue={user ? user.email : ''}
                        fullWidth
                        margin="normal"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email && 'Невалідна адреса'}
                    />
                    <TextField
                        label="Телефон"
                        fullWidth
                        defaultValue={user ? user.phone : ''}
                        margin="normal"
                        {...register('phone')}
                    />
                    <TextField
                        label="Професія"
                        fullWidth
                        defaultValue={user ? user.profession : ''}
                        margin="normal"
                        {...register('profession')}
                    />
                    <TextField
                        label="Область"
                        fullWidth
                        defaultValue={user ? user.region : ''}
                        margin="normal"
                        {...register('region')}
                    />
                    <TextField
                        label="Адреса"
                        fullWidth
                        margin="normal"
                        defaultValue={user ? user.address : ''}
                        {...register('address')}
                    />
                    <TextField
                        label="Біографія"
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        defaultValue={user ? user.bio : ''}
                        {...register('bio')}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                {...register('isActive')}
                                defaultChecked={user ? user.isActive : false}
                            />
                        }
                        label="Активний акаунт"
                    />
                    <Box mt={3}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={isSubmitting}
                            startIcon={isSubmitting && <CircularProgress size={20} />}
                        >
                            Зберегти
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
        </div>
    );
}