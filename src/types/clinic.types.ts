import {UserType} from "./userTypes";

export type ClinicType = {
    id: number;

    isActive: boolean;

    clinicName: string;

    clinicAddress: string;

    createdBy: UserType;

    clinicBio: string | null;

    dateOfCreate: string;

    clinicAdmins: UserType[];

    clinicWorkers: UserType[] | null;

    invites: UserType[] | null;
}

export type CreateClinicDTO = {
    clinicName: string;
    clinicAddress: string;
    clinicBio?: string;
}

export type UpdateClinicDto = {
    clinicName?: string;
    clinicAddress?: string;
    clinicBio?: string;
    isActive?: boolean;
};