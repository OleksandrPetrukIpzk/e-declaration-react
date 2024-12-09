import axios from 'axios';
import { store } from '../redux/store';
import { refreshAccessToken, logout } from '../redux/userSlice'
import {BASE_URL} from "./urls";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.error('401 error intercepted. Retrying with refreshed token...');
            try {
                await store.dispatch(refreshAccessToken()).unwrap();
                const state = store.getState();
                originalRequest.headers.Authorization = `Bearer ${state.auth.accessToken}`;
                return api(originalRequest);
            } catch (err) {
                console.error('Failed to refresh token:', err);
                store.dispatch(logout());
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
