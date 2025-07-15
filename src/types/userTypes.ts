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

    isAdmin: boolean;

    connection: UserType[] | null;

    password: string;

    refreshToken: string;

}