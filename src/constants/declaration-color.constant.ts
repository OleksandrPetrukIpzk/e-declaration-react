export const getStatusColor = (status: string, isExpired?: boolean) => {
    if (isExpired) return '#d32f2f';

    switch (status) {
        case 'active': return '#4caf50';
        case 'inactive': return '#ff9800';
        case 'terminated': return '#f44336';
        case 'pending': return '#2196f3';
        case 'pending_doctor_review': return '#2196f3';
        case 'pending_doctor_sign': return '#2196f3';
        case 'pending_approval': return '#2196f3';
        case 'approved': return '#4caf50';
        case 'rejected': return '#f44336';
        case 'cancelled': return '#9e9e9e';
        case 'suspended': return '#ff5722';
        case 'expired': return '#795548';
        default: return '#757575';
    }
};

export const getStatusText = (status: string, isExpired?: boolean) => {
    if (isExpired) return 'Прострочена';

    switch (status) {
        case 'active': return 'Активна';
        case 'inactive': return 'Неактивна';
        case 'terminated': return 'Припинена';
        case 'pending': return 'Очікується';
        case 'pending_doctor_review': return 'Очікує перевірки лікаря';
        case 'pending_doctor_sign': return 'Очікує підпису лікаря';
        case 'pending_approval': return 'Очікує підтвердження';
        case 'approved': return 'Підтверджена';
        case 'rejected': return 'Відхилена';
        case 'cancelled': return 'Скасована';
        case 'suspended': return 'Призупинена';
        case 'expired': return 'Закінчилась';
        default: return status;
    }
};

export const getScopeText = (scope: string) => {
    switch (scope) {
        case 'family_doctor': return 'Сімейний лікар';
        case 'specialist': return 'Спеціаліст';
        case 'emergency': return 'Екстрена';
        default: return scope;
    }
};
export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA');
};

export const isDeclarationExpired = (endDate?: string, status?: string) => {
    if (!endDate || status !== 'active') return false;
    const currentDate = new Date();
    const declarationEndDate = new Date(endDate);
    return declarationEndDate < currentDate;
};