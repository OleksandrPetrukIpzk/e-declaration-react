import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../constants/axiosInterceptor";
import {AxiosError} from "axios";


export const loginUser = createAsyncThunk('auth/login', async (credentials: {email: string, password: string}, thunkAPI) => {
    console.log('pre');
    try {
        console.log('try');
        console.log(credentials);
        const response = await api.post('/user/login', credentials);
        console.log(response);
        const { accessToken, refreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        return { accessToken, refreshToken };
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
        return thunkAPI.rejectWithValue('Unknown error occurred');
    }
});

export const refreshAccessToken = createAsyncThunk('auth/refreshToken', async (_, thunkAPI) => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('refresh');
        const response = await api.post('/user/refresh', { refreshToken });
        const { accessToken } = response.data;

        // Оновлюємо токен
        localStorage.setItem('accessToken', accessToken);
        return { accessToken };
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
        return thunkAPI.rejectWithValue('Unknown error occurred');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState:{
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
            });
    },
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;