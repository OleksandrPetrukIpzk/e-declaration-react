
export const getStatusColor = (status: any) => {
    switch (status) {
        case 'pending_doctor_review': return 'warning';
        case 'pending_doctor_sign': return 'info';
        case 'active': return 'success';
        case 'terminated': return 'default';
        case 'rejected': return 'error';
        default: return 'default';
    }
};

export const getStatusText = (status: any) => {
    switch (status) {
        case 'pending_doctor_review': return 'Pending Doctor Review';
        case 'pending_doctor_sign': return 'Pending Doctor Signature';
        case 'active': return 'Active';
        case 'terminated': return 'Terminated';
        case 'rejected': return 'Rejected';
        default: return status;
    }
};