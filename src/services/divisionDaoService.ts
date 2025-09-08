
import { Division } from '../types/declaration.types';
import {CreateDivisionDto, DivisionSearchDto, UpdateDivisionDto} from "../types/division.types";
import api from "../constants/axiosInterceptor";

    const getAll = async (): Promise<Division[]> => {
        const { data } = await api.get<Division[]>('/divisions');
        return data;
    };

    const getById = async (id: string): Promise<Division> => {
        const { data } = await api.get<Division>(`/divisions/${id}`);
        return data;
    };

    const search = async (params: DivisionSearchDto): Promise<Division[]> => {
        const { data } = await api.get<Division[]>('/divisions/search', { params });
        return data;
    };

    const create = async (payload: CreateDivisionDto): Promise<Division> => {
        const { data } = await api.post<Division>('/divisions', payload);
        return data;
    };

    const update = async (id: string, payload: UpdateDivisionDto): Promise<Division> => {
        const { data } = await api.patch<Division>(`/divisions/${id}`, payload);
        return data;
    };

    const remove = async (id: string): Promise<void> => {
        await api.delete(`/divisions/${id}`);
    };

    const bulkCreate = async (payload: CreateDivisionDto[]): Promise<Division[]> => {
        const { data } = await api.post<Division[]>('/divisions/bulk', payload);
        return data;
    };

    export const DivisionDaoService = { getAll, search, create, update, remove, bulkCreate };

