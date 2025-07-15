import {UserType} from "./userTypes";

export type ClinicType = {
    id: number;

    isActive: boolean;

    clinicName: string;

    createdBy: UserType;

    clinicBio: string | null;

    dateOfCreate: string;

    clinicAdmins: UserType[];

    clinicWorkers: UserType[] | null;
}