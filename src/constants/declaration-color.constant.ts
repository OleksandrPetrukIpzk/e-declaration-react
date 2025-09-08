export const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return '#4caf50';
        case 'inactive': return '#ff9800';
        case 'terminated': return '#f44336';
        default: return '#757575';
    }
};

export const getStatusText = (status: string) => {
    switch (status) {
        case 'active': return 'Активна';
        case 'inactive': return 'Неактивна';
        case 'terminated': return 'Припинена';
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