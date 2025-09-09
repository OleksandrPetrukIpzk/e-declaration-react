import {ClinicType} from "./clinic.types";
import { UserType } from "./userTypes";

export type Notification = {
    id: number;
    sender: UserType;
    recipient: UserType;
    title: string;
    message: string;
    type: string;
    relatedClinic?: ClinicType;
    isRead: boolean;
    createdAt: string;
    metadata?: any;
}