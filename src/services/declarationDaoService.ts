import { CreateDeclarationData } from "../types/declaration.types";
import {BASE_URL} from "../constants/urls";
import api from "../constants/axiosInterceptor";

export const declarationDaoService = {
    async getAll(page = 1, limit = 10) {
        const response = await fetch(`${BASE_URL}/declarations?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch declarations');
        return response.json();
    },

    async getById(id: string) {
        const response = await fetch(`${BASE_URL}/declarations/${id}`);
        if (!response.ok) throw new Error('Declaration not found');
        return response.json();
    },

    async create(data: CreateDeclarationData) {
        const response = await fetch(`${BASE_URL}/declarations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create declaration');
        return response.json();
    },

    async update(id: string, data: Partial<CreateDeclarationData>) {
        const response = await fetch(`${BASE_URL}/declarations/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update declaration');
        return response.json();
    },

    async delete(id: string) {
        const response = await fetch(`${BASE_URL}/declarations/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete declaration');
        return response.json();
    },

    async terminate(id: string, reason: string) {
        const response = await fetch(`${BASE_URL}/declarations/${id}/terminate`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
        });
        if (!response.ok) throw new Error('Failed to terminate declaration');
        return response.json();
    },

    async getPatientDeclarations() {
        const response = await api.get('/declarations/patient/my');
        if (!response.data) throw new Error('Failed to fetch patient declarations');
        return response.data;
    },
};

export const downloadDeclarationPdf = async (declarationId: string) => {
    try {
        const response = await api.get(`/declarations/${declarationId}/pdf`, {
            responseType: 'blob',
        });
        console.log('Response headers:', response.headers);
        console.log('Response data type:', typeof response.data);
        console.log('Response data size:', response.data.size);
        console.log('Content-Type:', response.headers['content-type']);
        const blob = new Blob([response.data], {
            type: 'application/pdf'
        });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `declaration-${declarationId}.pdf`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Помилка завантаження PDF:', error);
        throw error;
    }
};
export const previewDeclarationPdf = async (declarationId: string) => {
    try {
        const response = await api.get(`/declarations/${declarationId}/pdf/preview`, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

        window.open(url, '_blank');

        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
        console.error('Помилка перегляду PDF:', error);
        throw error;
    }
};