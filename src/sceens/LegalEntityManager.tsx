import React, { useState } from 'react';
import {
    Box,
    Container,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';
import LegalEntityView from "../components/legalEntity/LegalEntityView";
import LegalEntityForm from "../components/legalEntity/LegalEntityForm";
import LegalEntityList from "../components/legalEntity/LegalEntityList";
import {BASE_URL} from "../constants/urls";
import {legalEntityDaoService} from "../services/legalEntityDaoService";
import {LandingScreenHeader} from "../components/LandingScreenHeader";

// Типи
interface Phone {
    type: string;
    number: string;
}

interface Address {
    type: string;
    country: string;
    area: string;
    region: string;
    settlement: string;
    settlement_type: string;
    settlement_id: string;
    street_type: string;
    street: string;
    building: string;
    apartment?: string;
    zip: string;
}

interface LegalEntityFormData {
    name: string;
    short_name: string;
    legal_form: string;
    public_name: string;
    edrpou: string;
    status: string;
    email: string;
    phones: Phone[];
    addresses: Address[];
}

interface LegalEntity extends LegalEntityFormData {
    id: string;
    created_at: string;
    updated_at: string;
}

type ViewMode = 'list' | 'create' | 'edit' | 'view';

interface NotificationState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
}

const LegalEntityManager: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedEntity, setSelectedEntity] = useState<LegalEntity | null>(null);
    const [notification, setNotification] = useState<NotificationState>({
        open: false,
        message: '',
        severity: 'success'
    });
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        entity: LegalEntity | null;
    }>({
        open: false,
        entity: null
    });

    // Показ уведомлення
    const showNotification = (message: string, severity: NotificationState['severity'] = 'success') => {
        setNotification({ open: true, message, severity });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    // Обробники для списку
    const handleCreate = () => {
        setSelectedEntity(null);
        setViewMode('create');
    };

    const handleEdit = (entity: LegalEntity) => {
        setSelectedEntity(entity);
        setViewMode('edit');
    };

    const handleView = (entity: LegalEntity) => {
        setSelectedEntity(entity);
        setViewMode('view');
    };

    const handleDelete = (entity: LegalEntity) => {
        setDeleteDialog({ open: true, entity });
    };

    const handleConfirmDelete = async () => {
        if (!deleteDialog.entity) return;

        try {
            await legalEntityDaoService.remove(deleteDialog.entity.id);

            showNotification('Організацію успішно видалено!');
            setDeleteDialog({ open: false, entity: null });
            setViewMode('list');
            setSelectedEntity(null);
        } catch (error) {
            showNotification(
                error instanceof Error ? error.message : 'Помилка видалення',
                'error'
            );
        }
    };


    const handleFormCancel = () => {
        setViewMode('list');
        setSelectedEntity(null);
    };

    // Обробники для перегляду
    const handleViewEdit = () => {
        setViewMode('edit');
    };

    const handleViewDelete = () => {
        if (selectedEntity) {
            handleDelete(selectedEntity);
        }
    };

    const handleViewBack = () => {
        setViewMode('list');
        setSelectedEntity(null);
    };

    const handleFormSubmit = async (data: LegalEntityFormData) => {
        try {
            if (viewMode === 'create') {
                await legalEntityDaoService.create(data);
                showNotification('Організацію успішно створено!');
            } else if (viewMode === 'edit' && selectedEntity) {
                await legalEntityDaoService.update(selectedEntity.id, data);
                showNotification('Організацію успішно оновлено!');
            }

            setViewMode('list');
            setSelectedEntity(null);
        } catch (error) {
            throw error; // Передаємо помилку назад до форми
        }
    };
    const handleCancelDelete = () => {
        setDeleteDialog({ open: false, entity: null });
    };

    // Рендер контенту на основі режиму
    const renderContent = () => {
        switch (viewMode) {
            case 'list':
                return (
                    <LegalEntityList
                        onEdit={handleEdit}
                        onCreate={handleCreate}
                        onView={handleView}
                    />
                );

            case 'create':
                return (
                    <LegalEntityForm
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                    />
                );

            case 'edit':
                return selectedEntity ? (
                    <LegalEntityForm
                        entity={selectedEntity}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                    />
                ) : (
                    <div>Помилка: не вибрано організацію для редагування</div>
                );

            case 'view':
                return selectedEntity ? (
                    <LegalEntityView
                        entity={selectedEntity}
                        onEdit={handleViewEdit}
                        onDelete={handleViewDelete}
                        onBack={handleViewBack}
                    />
                ) : (
                    <div>Помилка: не вибрано організацію для перегляду</div>
                );

            default:
                return <div>Невідомий режим перегляду</div>;
        }
    };

    return (
        <>
            <LandingScreenHeader />
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box minHeight="100vh">
                {renderContent()}
            </Box>

            {/* Уведомлення */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={hideNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={hideNotification}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            {/* Діалог підтвердження видалення */}
            <Dialog
                open={deleteDialog.open}
                onClose={handleCancelDelete}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Підтвердження видалення
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Ви впевнені, що хочете видалити організацію "{deleteDialog.entity?.name}"?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Ця дія незворотна і призведе до повного видалення всіх даних організації з системи.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>
                        Скасувати
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                    >
                        Видалити назавжди
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
        </>
    );
};

export default LegalEntityManager;