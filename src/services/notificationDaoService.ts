import api from "../constants/axiosInterceptor";

export const notificationAPI = {
    async getNotifications(limit = 20, offset = 0) {
        // Замініть на ваш api instance
        const response = await api.get(`/notifications?limit=${limit}&offset=${offset}`);
        return response.data;
    },

    async getUnreadNotifications() {
        const response = await api.get('/notifications/unread');
        return response.data;
    },

    async markAsRead(notificationId: number) {
        const response = await api.put(`/notifications/${notificationId}/read`);
        return response.data;
    },

    async markAllAsRead() {
        const response = await api.put('/notifications/mark-all-read');
        return response.data;
    },

    async sendToConnections(data: {
        recipientIds: number[];
        title: string;
        message: string;
        metadata?: any;
    }) {
        const response = await api.post('/notifications/send-to-connections', data);
        return response.data;
    },

    async sendToClinic(data: {
        clinicId: number;
        title: string;
        message: string;
        target: 'admins' | 'workers' | 'all';
        metadata?: any;
    }) {
        const response = await api.post('/notifications/send-to-clinic', data);
        return response.data;
    },

    async getAllMyNotifications(limit?: number, offset?: number) {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit.toString());
        if (offset) params.append('offset', offset.toString());
        
        const response = await api.get(`/notifications/all?${params.toString()}`);
        return response.data;
    },

};