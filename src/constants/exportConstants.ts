import {EntityConfig, EntityType} from "../types/export.types";

export const ENTITY_CONFIGS: Record<EntityType, EntityConfig> = {
    user: {
        name: 'User (Користувач)',
        required: [
            { field: 'email', label: 'Email', description: 'Email адреса користувача' },
            { field: 'password', label: 'Пароль', description: 'Пароль користувача' },
            { field: 'role', label: 'Роль', description: 'Номер ролі користувача' }
        ],
        optional: [
            { field: 'firstName', label: 'Ім\'я', description: 'Ім\'я користувача' },
            { field: 'lastName', label: 'Прізвище', description: 'Прізвище користувача' },
            { field: 'phone', label: 'Телефон', description: 'Номер телефону' },
            { field: 'bio', label: 'Біографія', description: 'Біографічна інформація' },
            { field: 'address', label: 'Адреса', description: 'Адреса проживання' },
            { field: 'region', label: 'Регіон', description: 'Регіон проживання' },
            { field: 'profession', label: 'Професія', description: 'Професія користувача' },
            { field: 'isActive', label: 'Активний', description: 'Статус активності (true/false)' },
            { field: 'refreshToken', label: 'Refresh Token', description: 'Токен для оновлення' },
            { field: 'administeredClinics', label: 'Адміністровані клініки', description: 'Назви клінік через кому: "Medical Center, Dental Clinic"' },
            { field: 'workClinics', label: 'Робочі клініки', description: 'Назви клінік де працює, через кому' },
            { field: 'connections', label: 'Зв\'язки з користувачами', description: 'Email користувачів через кому' },
            { field: 'clinicInvites', label: 'Запрошення в клініки', description: 'Назви клінік через кому' }
        ]
    },
    user_clinic_relations: {
        name: 'User-Clinic Relations (Зв\'язки користувач-клініка)',
        required: [
            { field: 'userEmail', label: 'Email користувача', description: 'Email користувача' },
            { field: 'clinicName', label: 'Назва клініки', description: 'Назва клініки' },
            { field: 'relationType', label: 'Тип зв\'язку', description: 'admin, worker або invite' }
        ],
        optional: [
            { field: 'startDate', label: 'Дата початку', description: 'Коли почався зв\'язок' },
            { field: 'endDate', label: 'Дата завершення', description: 'Коли завершився зв\'язок' },
            { field: 'notes', label: 'Примітки', description: 'Додаткова інформація' }
        ]
    },
    user_connections: {
        name: 'User Connections (Зв\'язки між користувачами)',
        required: [
            { field: 'userEmail1', label: 'Email першого користувача', description: 'Email ініціатора зв\'язку' },
            { field: 'userEmail2', label: 'Email другого користувача', description: 'Email цільового користувача' }
        ],
        optional: [
            { field: 'connectionType', label: 'Тип зв\'язку', description: 'friend, colleague, etc.' },
            { field: 'createdDate', label: 'Дата створення', description: 'Коли створено зв\'язок' },
            { field: 'status', label: 'Статус', description: 'active, pending, blocked' }
        ]
    },
    clinic: {
        name: 'Clinic (Клініка)',
        required: [
            { field: 'clinicName', label: 'Назва клініки', description: 'Офіційна назва клініки' },
            { field: 'clinicAddress', label: 'Адреса клініки', description: 'Адреса клініки' }
        ],
        optional: [
            { field: 'clinicBio', label: 'Опис клініки', description: 'Біографія/опис клініки' },
            { field: 'isActive', label: 'Активна', description: 'Статус активності клініки (true/false)' },
            { field: 'dateOfCreate', label: 'Дата створення', description: 'Коли була створена клініка' },
            { field: 'createdBy', label: 'Створена користувачем', description: 'Email користувача який створив' },
            { field: 'clinicAdmins', label: 'Адміністратори', description: 'Email адміністраторів через кому' },
            { field: 'clinicWorkers', label: 'Працівники', description: 'Email працівників через кому' },
            { field: 'invites', label: 'Запрошені користувачі', description: 'Email запрошених користувачів через кому' }
        ]
    },
    custom: {
        name: 'Custom (Користувацький)',
        required: [],
        optional: []
    }
};