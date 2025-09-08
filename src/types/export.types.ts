export interface FieldConfig {
    field: string;
    label: string;
    description: string;
}

export interface EntityConfig {
    name: string;
    required: FieldConfig[];
    optional: FieldConfig[];
}

export type EntityType = 'user' | 'user_clinic_relations' | 'user_connections' | 'clinic' | 'custom';

export interface EntityFieldState {
    active: boolean;
    csvField: string;
}

export interface CustomField {
    columnName: string;
    fieldPaths: string;
}

export interface EntityFieldsState {
    [fieldName: string]: EntityFieldState;
}