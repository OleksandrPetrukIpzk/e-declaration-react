import {CreateClinicDTO, UpdateClinicDto} from "../types/clinic.types";
import api from "../constants/axiosInterceptor";

const create = async (createClinicDto: CreateClinicDTO) => {
    const data = await api.post('clinic/create', createClinicDto).then((response) => response.data);
    return data;
}
const invite = async (clinicId: number) => {
    const data = await api.post('clinic/invite', {clinicId}).then((response) => console.log(response.data));
}
const inviteConfirm = async (clinicId: number, userId: number) => {
    const data = await api.post('clinic/invite/confirm', {clinicId, userId}).then((response) => response.data);
    return data;
}
const joinToClinicAsWorker = async (clinicId: number) => {
    const data = await api.post('clinic/join-to-clinic', {clinicId}).then((response) => response.data);
    return data;
}
const inviteReject = async (clinicId: number, userId: number) => {
    const data = await api.post('clinic/invite/reject', {clinicId, userId}).then((response) => response.data);
    return data;
}
const getAllInvites = async (clinicId: number) => {
    const data = api.post(`clinic/invite/get`, {clinicId}).then((response) => response.data);
    return data;
}
const getClinics = async () => {
    const data = await api.get('clinic/get').then((response) => response.data);
    return data;
}
const editClinic = async (data: UpdateClinicDto, id: string) => {
    const response = await api.patch(`clinic/${id}`, data).then((response) => console.log(response.data));
}
const getClinicById = async (id: string) => {
    const response = api.get(`clinic/${id}`).then((response) => response.data);
    return response;
}
const getAllClinics = async () => {
    const data = await api.get('clinic/get-all').then((response) => response.data);
    return data;
}
const getActiveClinics = async () => {
    const data = await api.get('clinic/get-active').then((response) => response.data);
    return data;
}
const leaveClinic = async (clinicId: number) => {
    const data = await api.post('clinic/leave', {clinicId}).then((response) => response.data);
    return data;
}
export const ClinicDaoService = {
    create,
    getClinics,
    editClinic,
    getClinicById,
    invite,
    inviteConfirm,
    inviteReject,
    getAllInvites,
    getActiveClinics,
    joinToClinicAsWorker,
    getAllClinics,
    leaveClinic
}