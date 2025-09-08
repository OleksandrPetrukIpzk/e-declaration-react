// types.ts
export enum DivisionType {
    CLINIC = 'clinic',
    HOSPITAL = 'hospital',
    AMBULATORY = 'ambulatory',
    PHARMACY = 'pharmacy',
}

export enum DivisionStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
    SUSPENDED = 'suspended'
}

export interface Division {
    id: string;
    name: string;
    type: DivisionType;
    status: DivisionStatus;
    mountain_group: boolean;
    dls_id: string;
    dls_verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateDivisionDto {
    name: string;
    type: DivisionType;
    status: DivisionStatus;
    mountain_group?: boolean;
    dls_id: string;
    dls_verified?: boolean;
}

export interface UpdateDivisionDto {
    name?: string;
    type?: DivisionType;
    status?: DivisionStatus;
    mountain_group?: boolean;
    dls_id?: string;
    dls_verified?: boolean;
}

export interface DivisionSearchDto {
    name?: string;
    type?: DivisionType;
    status?: DivisionStatus;
    mountain_group?: boolean;
    dls_verified?: boolean;
}