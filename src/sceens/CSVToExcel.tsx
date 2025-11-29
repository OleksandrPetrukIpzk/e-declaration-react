import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Alert,
    AlertTitle,
    Chip,
    Tooltip,
    IconButton,
    Card,
    CardContent,
    CircularProgress,
    FormHelperText,
} from '@mui/material';
import {
    Add,
    Delete,
    Download,
    Info,
    CheckCircle,
    Error as ErrorIcon
} from '@mui/icons-material';
import {CustomField, EntityFieldsState, EntityType } from '../types/export.types';
import {ENTITY_CONFIGS} from "../constants/exportConstants";
import {EntitySelector} from "../components/exportToExcel/EntitySelector";
import {DropZoneInput} from "../components/exportToExcel/DropZone";

const ExportToExcelComponent: React.FC = () => {
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [tableName, setTableName] = useState<string>('');
    const [selectedEntity, setSelectedEntity] = useState<EntityType>('custom');
    const [entityFields, setEntityFields] = useState<EntityFieldsState>({});
    const [customFields, setCustomFields] = useState<CustomField[]>([{ columnName: '', fieldPaths: '' }]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    useEffect(() => {
        if (selectedEntity !== 'custom') {
            const config = ENTITY_CONFIGS[selectedEntity];
            const initialFields: EntityFieldsState = {};

            config.required.forEach(field => {
                initialFields[field.field] = { active: true, csvField: '' };
            });

            config.optional.forEach(field => {
                initialFields[field.field] = { active: false, csvField: '' };
            });

            setEntityFields(initialFields);
        }
    }, [selectedEntity]);


    const toggleEntityField = (fieldName: string) => {
        setEntityFields(prev => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                active: !prev[fieldName].active
            }
        }));
    };

    const updateEntityFieldCsv = (fieldName: string, csvField: string) => {
        setEntityFields(prev => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                csvField
            }
        }));
    };
    const addCustomField = () => {
        setCustomFields([...customFields, { columnName: '', fieldPaths: '' }]);
    };

    const removeCustomField = (index: number) => {
        if (customFields.length > 1) {
            setCustomFields(customFields.filter((_, i) => i !== index));
        }
    };

    const updateCustomField = (index: number, key: keyof CustomField, value: string) => {
        const updatedFields = customFields.map((field, i) =>
            i === index ? { ...field, [key]: value } : field
        );
        setCustomFields(updatedFields);
    };

    const handleSubmit = async () => {
        if (!csvFile) {
            setError('Будь ласка, оберіть CSV файл');
            return;
        }

        if (!tableName.trim()) {
            setError('Будь ласка, введіть назву таблиці');
            return;
        }

        let fieldsToSubmit: CustomField[] = [];

        if (selectedEntity === 'custom') {
            const invalidFields = customFields.filter(field => !field.columnName.trim() || !field.fieldPaths.trim());
            if (invalidFields.length > 0) {
                setError('Будь ласка, заповніть всі кастомні поля');
                return;
            }
            fieldsToSubmit = customFields;
        } else {
            const config = ENTITY_CONFIGS[selectedEntity];
            const activeFields = Object.entries(entityFields).filter(([_, data]) => data.active);

            const missingRequired = config.required.filter(reqField =>
                !entityFields[reqField.field]?.active || !entityFields[reqField.field]?.csvField.trim()
            );

            if (missingRequired.length > 0) {
                setError(`Обов'язкові поля не заповнені: ${missingRequired.map(f => f.label).join(', ')}`);
                return;
            }

            const missingCsvMapping = activeFields.filter(([_, data]) => !data.csvField.trim());
            if (missingCsvMapping.length > 0) {
                setError('Будь ласка, вкажіть відповідність CSV полів для всіх активних полів');
                return;
            }

            fieldsToSubmit = activeFields.map(([fieldName, data]) => ({
                columnName: fieldName,
                fieldPaths: data.csvField
            }));
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('csvFile', csvFile);
            formData.append('tableName', tableName);
            formData.append('entityType', selectedEntity);
            formData.append('fields', JSON.stringify(fieldsToSubmit));

            const response = await fetch('http://localhost:3005/export-excel/csv-to-excel', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Помилка при обробці файлу');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `export_${tableName}_${Date.now()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setSuccess('Excel файл успішно створено та завантажено!');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Alert severity="info" sx={{ mb: 3 }}>
                    <AlertTitle>Як це працює</AlertTitle>
                    Оберіть тип ентіті або створіть власні поля, завантажте CSV файл,
                    налаштуйте відповідність полів та створіть Excel файл.
                </Alert>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <EntitySelector setSelectedEntity={setSelectedEntity} selectedEntity={selectedEntity} setError={setError} />
                        <DropZoneInput setError={setError} setCsvFile={setCsvFile} csvFile={csvFile} />


                    {/* Название листа */}
                    <TextField
                        fullWidth
                        label="Назва аркуша в Excel файлі"
                        value={tableName}
                        onChange={(e) => setTableName(e.target.value)}
                        placeholder="users, clinics, data тощо"
                        variant="outlined"
                    />

                    {/* Поля ентити или кастомные поля */}
                    {selectedEntity !== 'custom' ? (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Поля ентіті {ENTITY_CONFIGS[selectedEntity].name}
                            </Typography>

                            {/* Обязательные поля */}
                            {ENTITY_CONFIGS[selectedEntity].required.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" color="error" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                        <ErrorIcon sx={{ mr: 1 }} />
                                        Обов'язкові поля
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {ENTITY_CONFIGS[selectedEntity].required.map((field) => (
                                            <Card key={field.field}>
                                                <CardContent>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={12} md={5}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                                    {field.label}
                                                                </Typography>
                                                                <Chip
                                                                    label="Обов'язкове"
                                                                    size="small"
                                                                    color="error"
                                                                    variant="filled"
                                                                />
                                                                <Tooltip title={field.description} arrow>
                                                                    <IconButton size="small">
                                                                        <Info fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                            <Typography variant="caption" display="block">
                                                                Поле: {field.field}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} md={7}>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                value={entityFields[field.field]?.csvField || ''}
                                                                onChange={(e) => updateEntityFieldCsv(field.field, e.target.value)}
                                                                placeholder="Назва колонки в CSV"
                                                                variant="outlined"
                                                                required
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Опциональные поля */}
                            {ENTITY_CONFIGS[selectedEntity].optional.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>
                                        Опціональні поля
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {ENTITY_CONFIGS[selectedEntity].optional.map((field) => (
                                            <Card key={field.field} variant="outlined">
                                                <CardContent>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={12} md={1}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={entityFields[field.field]?.active || false}
                                                                        onChange={() => toggleEntityField(field.field)}
                                                                    />
                                                                }
                                                                label=""
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} md={4}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                                    {field.label}
                                                                </Typography>
                                                                <Chip
                                                                    label="Опціональне"
                                                                    size="small"
                                                                    color="primary"
                                                                    variant="outlined"
                                                                />
                                                                <Tooltip title={field.description} arrow>
                                                                    <IconButton size="small">
                                                                        <Info fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                            <Typography variant="caption" display="block" color="text.secondary">
                                                                Поле: {field.field}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} md={7}>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                value={entityFields[field.field]?.csvField || ''}
                                                                onChange={(e) => updateEntityFieldCsv(field.field, e.target.value)}
                                                                placeholder="Назва колонки в CSV"
                                                                variant="outlined"
                                                                disabled={!entityFields[field.field]?.active}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Кастомні поля для експорту
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={addCustomField}
                                >
                                    Додати поле
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {customFields.map((field, index) => (
                                    <Card key={index} variant="outlined">
                                        <CardContent>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} md={5}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={field.columnName}
                                                        onChange={(e) => updateCustomField(index, 'columnName', e.target.value)}
                                                        placeholder="Назва колонки в Excel"
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={field.fieldPaths}
                                                        onChange={(e) => updateCustomField(index, 'fieldPaths', e.target.value)}
                                                        placeholder="film або film,award_type"
                                                        variant="outlined"
                                                    />
                                                    <FormHelperText>
                                                        Для кількох полів використовуйте кому
                                                    </FormHelperText>
                                                </Grid>
                                                <Grid item xs={12} md={1}>
                                                    {customFields.length > 1 && (
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => removeCustomField(index)}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Сообщения об ошибках */}
                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    {/* Сообщения об успехе */}
                    {success && (
                        <Alert severity="success" icon={<CheckCircle />}>
                            {success}
                        </Alert>
                    )}

                    {/* Кнопка отправки */}
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={loading ? <CircularProgress size={20} /> : <Download />}
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ py: 1.5 }}
                    >
                        {loading ? 'Обробка...' : 'Створити Excel файл'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ExportToExcelComponent;