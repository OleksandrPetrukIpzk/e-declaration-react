import {UserType} from "./userTypes";

export type DeclarationType = {
    id: number;

    createdAt: Date;

    endedAt: Date;

    isActive: boolean;

    signByPatient: string;

    status: string;

    signByDoctor: string | null;

    photoByPatient: string | null;

    photoByDoctor: string | null;

    createdBy: UserType | null;

    createdWith: UserType | null;
}