// DivisionManagement.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Container,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Division, CreateDivisionDto, UpdateDivisionDto, DivisionSearchDto } from '../types/division.types';
import DivisionTable from './DivisionTable';
import DivisionForm from './DivisionForm';
import DivisionFilters from './DivisionFilters';
import {DivisionDaoService} from "../services/divisionDaoService";
import {LandingScreenHeader} from "../components/LandingScreenHeader";

const DivisionManagement: React.FC = () => {
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [loading, setLoading] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [editingDivision, setEditingDivision] = useState<Division | undefined>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [divisionToDelete, setDivisionToDelete] = useState<Division | undefined>();

    // Стани для повідомлень
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    // Завантаження дивізій при монтуванні компоненту
    useEffect(() => {
        loadDivisions();
    }, []);

    const loadDivisions = async () => {
        try {
            setLoading(true);
            const data: any = await DivisionDaoService.getAll();
            setDivisions(data);
        } catch (error) {
            showSnackbar('Помилка завантаження дивізій', 'error');
            console.error('Error loading divisions:', error);
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleFilter = async (filters: DivisionSearchDto) => {
        try {
            setLoading(true);
            const data: any = await DivisionDaoService.search(filters);
            setDivisions(data);
        } catch (error) {
            showSnackbar('Помилка пошуку дивізій', 'error');
            console.error('Error searching divisions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        loadDivisions();
    };

    const handleCreate = () => {
        setEditingDivision(undefined);
        setFormOpen(true);
    };

    const handleEdit = (division: Division) => {
        setEditingDivision(division);
        setFormOpen(true);
    };

    const handleFormSubmit = async (data: CreateDivisionDto | UpdateDivisionDto) => {
        try {
            if (editingDivision) {
                const updated: any = await DivisionDaoService.update(editingDivision.id, data as UpdateDivisionDto);
                setDivisions(prev =>
                    prev.map(d => d.id === editingDivision.id ? updated : d)
                );
                showSnackbar('Дивізію успішно оновлено', 'success');
            } else {
                const created: any = await DivisionDaoService.create(data as CreateDivisionDto);
                setDivisions(prev => [...prev, created]);
                showSnackbar('Дивізію успішно створено', 'success');
            }
            setFormOpen(false);
            setEditingDivision(undefined);
        } catch (error: any) {
            const message = error?.message?.includes('already exists')
                ? 'Дивізія з таким DLS ID вже існує'
                : 'Помилка збереження дивізії';
            showSnackbar(message, 'error');
            console.error('Error saving division:', error);
        }
    };

    const handleDelete = (division: Division) => {
        setDivisionToDelete(division);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!divisionToDelete) return;

        try {
            await DivisionDaoService.remove(divisionToDelete.id);
            setDivisions(prev => prev.filter(d => d.id !== divisionToDelete.id));
            showSnackbar('Дивізію успішно видалено', 'success');
        } catch (error) {
            showSnackbar('Помилка видалення дивізії', 'error');
            console.error('Error deleting division:', error);
        } finally {
            setDeleteDialogOpen(false);
            setDivisionToDelete(undefined);
        }
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setDivisionToDelete(undefined);
    };

    return (
        <>
            <LandingScreenHeader />
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1">
                    Управління дивізіями
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                    size="large"
                >
                    Додати дивізію
                </Button>
            </Box>

            <DivisionFilters
                onFilter={handleFilter}
                onClear={handleClearFilters}
            />

            <DivisionTable
                divisions={divisions}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <DivisionForm
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                division={editingDivision}
            />

            {/* Діалог підтвердження видалення */}
            <Dialog
                open={deleteDialogOpen}
                onClose={cancelDelete}
            >
                <DialogTitle>Підтвердження видалення</DialogTitle>
                <DialogContent>
                    <Typography>
                        Ви впевнені, що хочете видалити дивізію "{divisionToDelete?.name}"?
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Цю дію неможливо скасувати.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete}>
                        Скасувати
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar для повідомлень */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
        </>
    );
};

export default DivisionManagement;