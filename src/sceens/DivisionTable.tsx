import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Typography,
    Box,
    Tooltip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { Division, DivisionType, DivisionStatus } from '../types/division.types';

interface DivisionTableProps {
    divisions: Division[];
    loading?: boolean;
    onEdit: (division: Division) => void;
    onDelete: (division: Division) => void;
}

const DivisionTable: React.FC<DivisionTableProps> = ({
                                                         divisions,
                                                         loading = false,
                                                         onEdit,
                                                         onDelete,
                                                     }) => {
    const getTypeLabel = (type: DivisionType): string => {
        const labels = {
            [DivisionType.CLINIC]: 'Клініка',
            [DivisionType.AMBULATORY]: 'Амбулаторія',
            [DivisionType.PHARMACY]: 'Pharmacy',
            [DivisionType.HOSPITAL]: 'Госпіталь',
        };
        return labels[type];
    };
    const getStatusColor = (status: DivisionStatus) => {
        const colors = {
            [DivisionStatus.ACTIVE]: 'success',
            [DivisionStatus.INACTIVE]: 'default',
            [DivisionStatus.PENDING]: 'warning',
            [DivisionStatus.SUSPENDED]: 'error',
        } as const;
        return colors[status];
    };

    const getStatusLabel = (status: DivisionStatus): string => {
        const labels = {
            [DivisionStatus.ACTIVE]: 'Активна',
            [DivisionStatus.INACTIVE]: 'Неактивна',
            [DivisionStatus.PENDING]: 'В очікуванні',
            [DivisionStatus.SUSPENDED]: 'Призупинена',
        };
        return labels[status];
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <Typography>Завантаження...</Typography>
            </Box>
        );
    }

    if (divisions.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" color="textSecondary">
                    Дивізії не знайдені
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Назва</TableCell>
                        <TableCell>Тип</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell>DLS ID</TableCell>
                        <TableCell align="center">Гірська група</TableCell>
                        <TableCell align="center">DLS верифікована</TableCell>
                        <TableCell>Створена</TableCell>
                        <TableCell>Оновлена</TableCell>
                        <TableCell align="center">Дії</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {divisions.map((division) => (
                        <TableRow key={division.id} hover>
                            <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                    {division.name}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={getTypeLabel(division.type)}
                                    size="small"
                                    variant="outlined"
                                />
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={getStatusLabel(division.status)}
                                    size="small"
                                    color={getStatusColor(division.status)}
                                />
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" fontFamily="monospace">
                                    {division.dls_id}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                {division.mountain_group ? (
                                    <CheckCircleIcon color="success" fontSize="small" />
                                ) : (
                                    <CancelIcon color="disabled" fontSize="small" />
                                )}
                            </TableCell>
                            <TableCell align="center">
                                {division.dls_verified ? (
                                    <CheckCircleIcon color="primary" fontSize="small" />
                                ) : (
                                    <CancelIcon color="disabled" fontSize="small" />
                                )}
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="textSecondary">
                                    {formatDate(division.created_at)}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="textSecondary">
                                    {formatDate(division.updated_at)}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Tooltip title="Редагувати">
                                        <IconButton
                                            size="small"
                                            onClick={() => onEdit(division)}
                                            color="primary"
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Видалити">
                                        <IconButton
                                            size="small"
                                            onClick={() => onDelete(division)}
                                            color="error"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DivisionTable;