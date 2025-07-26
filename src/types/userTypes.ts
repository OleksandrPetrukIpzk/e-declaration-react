import {ClinicType} from "./clinic.types";

export type UserType = {
    id: number;

    email: string;

    firstName: string | null;

    lastName: string | null;

    phone?: number | null;

    bio?: string | null;

    address?: string | null;

    region?: string | null;

    clinic?: ClinicType | null;

    role: number | null;

    profession?: string | null;

    isActive: boolean;

    connection: UserType[] | null;

    password: string;

    refreshToken: string;
}

export type UserFormData = {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: number;
    bio?: string;
    address?: string;
    region?: string;
    profession?: string;
    isActive?: boolean;
};