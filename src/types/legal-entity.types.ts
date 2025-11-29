export enum PhoneType {
    MOBILE = 'mobile',
    LAND_LINE = 'landline',
    FAX = 'fax',
}

export enum AddressType {
    REGISTRATION = 'REGISTRATION',
    RESIDENCE = 'RESIDENCE',
    POSTAL = 'POSTAL',
}

export enum EntityStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
    SUSPENDED = 'suspended',
    NEW = 'new',
}

export enum LegalForm {
    TOV = 'ТОВ',
    PAT = 'ПАТ',
    PRAT = 'ПрАТ',
    KT = 'КТ',
    PP = 'ПП',
    FOP = 'ФОП',
    NP = 'НП',
    BF = 'БФ',
}

export interface Phone {
    type: PhoneType | string;
    number: string;
}

export interface Address {
    type: AddressType | string;
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

export interface LegalEntity {
    id: string;
    name: string;
    short_name: string;
    legal_form: string;
    public_name: string;
    edrpou: string;
    status: EntityStatus | string;
    email: string;
    phones: Phone[];
    addresses: Address[];
    created_at: string;
    updated_at: string;
}

export interface CreateLegalEntityDto {
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

export interface UpdateLegalEntityDto {
    name?: string;
    short_name?: string;
    legal_form?: string;
    public_name?: string;
    edrpou?: string;
    status?: string;
    email?: string;
    phones?: Phone[];
    addresses?: Address[];
}

export interface LegalEntitySearchDto {
    name?: string;
    edrpou?: string;
    email?: string;
    status?: string;
    legal_form?: string;
}

export interface LegalEntityFormData {
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

export interface ValidationErrors {
    [key: string]: string | ValidationErrors;
}

export interface PhoneValidationRule {
    type: PhoneType;
    pattern: RegExp;
    message: string;
}

export interface AddressValidationRule {
    field: keyof Address;
    required: boolean;
    pattern?: RegExp;
    message: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
    details?: ValidationErrors;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface LegalEntityListProps {
    onEdit: (entity: LegalEntity) => void;
    onCreate: () => void;
    onView?: (entity: LegalEntity) => void;
}

export interface LegalEntityFormProps {
    entity?: LegalEntity;
    onSubmit: (data: LegalEntityFormData) => Promise<void>;
    onCancel: () => void;
}

export interface LegalEntityViewProps {
    entity: LegalEntity;
    onEdit: () => void;
    onDelete: () => void;
    onBack: () => void;
}

export type ViewMode = 'list' | 'create' | 'edit' | 'view';

export interface NotificationState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
}

export interface DeleteDialogState {
    open: boolean;
    entity: LegalEntity | null;
}

export interface FilterState {
    search: string;
    status: EntityStatus | '';
    legal_form: string;
    dateRange: {
        start?: Date;
        end?: Date;
    };
}

export type SortField = 'name' | 'edrpou' | 'status' | 'created_at' | 'updated_at';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
    field: SortField;
    direction: SortDirection;
}

export interface LegalEntityConfig {
    apiBaseUrl: string;
    itemsPerPage: number;
    supportedCountries: string[];
    defaultCountry: string;
    phoneFormats: Record<string, RegExp>;
    addressFormats: Record<string, string[]>;
}

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface HealthcareProvider extends LegalEntity {
    license_number?: string;
    license_expiry?: string;
    specializations?: string[];
    accreditation_level?: string;
}

export interface MedicalFacility extends LegalEntity {
    facility_type: 'hospital' | 'clinic' | 'pharmacy' | 'laboratory' | 'rehabilitation';
    bed_count?: number;
    emergency_services?: boolean;
    laboratory_services?: boolean;
    imaging_services?: boolean;
}

export const PHONE_TYPE_LABELS: Record<PhoneType, string> = {
    [PhoneType.MOBILE]: 'Мобільний',
    [PhoneType.LAND_LINE]: 'Стаціонарний',
    [PhoneType.FAX]: 'Факс',
};

export const ADDRESS_TYPE_LABELS: Record<AddressType, string> = {
    [AddressType.REGISTRATION]: 'Реєстрація',
    [AddressType.RESIDENCE]: 'Фактична адреса',
    [AddressType.POSTAL]: 'Поштова',
};

export const STATUS_LABELS: Record<EntityStatus, string> = {
    [EntityStatus.ACTIVE]: 'Активна',
    [EntityStatus.INACTIVE]: 'Неактивна',
    [EntityStatus.PENDING]: 'Очікує',
    [EntityStatus.SUSPENDED]: 'Призупинена',
    [EntityStatus.NEW]: 'Нова',
};

export const STATUS_COLORS: Record<EntityStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    [EntityStatus.ACTIVE]: 'success',
    [EntityStatus.INACTIVE]: 'error',
    [EntityStatus.PENDING]: 'warning',
    [EntityStatus.SUSPENDED]: 'error',
    [EntityStatus.NEW]: 'info',
};

export const VALIDATION_RULES = {
    edrpou: {
        pattern: /^\d{8}$/,
        message: 'ЄДРПОУ повинен містити рівно 8 цифр',
    },
    email: {
        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Невірний формат email адреси',
    },
    phone: {
        pattern: /^(\+38)?[0-9]{10}$/,
        message: 'Невірний формат номера телефону',
    },
    zipCode: {
        pattern: /^\d{5}$/,
        message: 'Поштовий індекс повинен містити 5 цифр',
    },
} as const;
