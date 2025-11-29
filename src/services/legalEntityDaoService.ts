import api from '../constants/axiosInterceptor';

interface Phone {
    type: string;
    number: string;
}

interface Address {
    type: string;
    country: string;
    area: string;
    region: string;
    settlement: string;
    settlement_type: string;
    settlement_id: string;
    street_type: string;
    street: string;
    building: string;
    apartment?: string;
    zip: string;
}

interface LegalEntityFormData {
    name: string;
    short_name: string;
    legal_form: string;
    public_name: string;
    edrpou: string;
    status: string;
    email: string;
    phones: Phone[];
    addresses: Address[];
}

interface LegalEntity extends LegalEntityFormData {
    id: string;
    created_at: string;
    updated_at: string;
}

interface LegalEntitySearchParams {
    name?: string;
    edrpou?: string;
    email?: string;
    status?: string;
    legal_form?: string;
}

interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}

export type {
    LegalEntity,
    LegalEntityFormData,
    LegalEntitySearchParams,
    Phone,
    Address,
    ApiError
};

export const PHONE_TYPES = [
    { value: 'MOBILE', label: 'Мобільний' },
    { value: 'LAND_LINE', label: 'Стаціонарний' },
    { value: 'FAX', label: 'Факс' },
] as const;

export const ADDRESS_TYPES = [
    { value: 'REGISTRATION', label: 'Реєстрація' },
    { value: 'RESIDENCE', label: 'Фактична адреса' },
    { value: 'POSTAL', label: 'Поштова' },
] as const;

export const LEGAL_FORMS = [
    'ТОВ', 'ПАТ', 'ПрАТ', 'КТ', 'ПП', 'ФОП', 'НП', 'БФ'
] as const;

export const ENTITY_STATUSES = [
    { value: 'active', label: 'Активна', color: 'success' },
    { value: 'inactive', label: 'Неактивна', color: 'error' },
    { value: 'pending', label: 'Очікує', color: 'warning' },
    { value: 'suspended', label: 'Призупинена', color: 'error' },
    { value: 'new', label: 'Нова', color: 'info' },
] as const;

export const SETTLEMENT_TYPES = [
    'місто', 'село', 'селище', 'смт'
] as const;

export const STREET_TYPES = [
    'вул.', 'пр.', 'бул.', 'пров.', 'площа', 'наб.'
] as const;

export const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('380') && cleaned.length === 12) {
        return `+${cleaned.slice(0, 3)} (${cleaned.slice(3, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8, 10)}-${cleaned.slice(10)}`;
    }

    if (cleaned.startsWith('0') && cleaned.length === 10) {
        return `+380 (${cleaned.slice(1, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`;
    }

    return phone;
};

export const validateEdrpou = (edrpou: string): boolean => {
    return /^\d{8}$/.test(edrpou);
};

export const validateZipCode = (zip: string): boolean => {
    return /^\d{5}$/.test(zip);
};

export const formatAddress = (address: Address): string => {
    const parts = [
        address.settlement_type,
        address.settlement,
        address.street_type,
        address.street,
        address.building,
        address.apartment ? `кв. ${address.apartment}` : null,
        address.zip
    ].filter(Boolean);

    return parts.join(', ');
};

export const formatFullAddress = (address: Address): string => {
    const country = address.country === 'UA' ? 'Україна' : address.country;
    return `${country}, ${address.area} обл., ${address.region} р-н, ${formatAddress(address)}`;
};


    const getAll = async (): Promise<LegalEntity[]> => {
        const { data } = await api.get<LegalEntity[]>('/legal-entities');
        return data;
    };

    const getById = async (id: string): Promise<LegalEntity> => {
        const { data } = await api.get<LegalEntity>(`/legal-entities/${id}`);
        return data;
    };

    const getByEdrpou = async (edrpou: string): Promise<LegalEntity> => {
        const { data } = await api.get<LegalEntity>(`/legal-entities/edrpou/${edrpou}`);
        return data;
    };

    const search = async (params: LegalEntitySearchParams): Promise<LegalEntity[]> => {
        const { data } = await api.get<LegalEntity[]>('/legal-entities/search', {
            params,
        });
        return data;
    };

    const create = async (payload: LegalEntityFormData): Promise<LegalEntity> => {
        const { data } = await api.post<LegalEntity>('/legal-entities', payload);
        return data;
    };

    const update = async (
        id: string,
        payload: Partial<LegalEntityFormData>
    ): Promise<LegalEntity> => {
        const { data } = await api.patch<LegalEntity>(`/legal-entities/${id}`, payload);
        return data;
    };

    const remove = async (id: string): Promise<void> => {
        await api.delete(`/legal-entities/${id}`);
    };

    const bulkCreate = async (
        payload: LegalEntityFormData[]
    ): Promise<LegalEntity[]> => {
        const { data } = await api.post<LegalEntity[]>('/legal-entities/bulk', payload);
        return data;
    };

    const checkEdrpouExists = async (
        edrpou: string,
        excludeId?: string
    ): Promise<boolean> => {
        try {
            const entity = await getByEdrpou(edrpou);
            return excludeId ? entity.id !== excludeId : true;
        } catch {
            return false;
        }
    };

    export const legalEntityDaoService = {
        getAll,
        getById,
        getByEdrpou,
        search,
        create,
        update,
        remove,
        bulkCreate,
        checkEdrpouExists,
    };