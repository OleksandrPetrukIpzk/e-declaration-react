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
    declaration: {
        name: 'Declaration (Декларація)',
        required: [
            { field: 'declaration_number', label: 'Номер декларації', description: 'Унікальний номер декларації' },
            { field: 'start_date', label: 'Дата початку', description: 'Дата початку дії декларації (YYYY-MM-DD)' },
            { field: 'person_id', label: 'ID пацієнта', description: 'Ідентифікатор пацієнта' },
            { field: 'employee_id', label: 'ID лікаря', description: 'Ідентифікатор лікаря' },
            { field: 'division_id', label: 'ID підрозділу', description: 'Ідентифікатор підрозділу' },
            { field: 'legal_entity_id', label: 'ID юр.особи', description: 'Ідентифікатор юридичної особи' },
            { field: 'status', label: 'Статус', description: 'Статус декларації: active, inactive, terminated' },
            { field: 'scope', label: 'Область', description: 'Область дії: family_doctor, specialist, emergency' }
        ],
        optional: [
            { field: 'end_date', label: 'Дата завершення', description: 'Дата завершення дії декларації (YYYY-MM-DD)' },
            { field: 'signed_at', label: 'Дата підписання', description: 'Дата та час підписання декларації' },
            { field: 'reason', label: 'Причина', description: 'Причина створення/зміни статусу декларації' },
            { field: 'reason_description', label: 'Опис причини', description: 'Детальний опис причини' },
            { field: 'declaration_request_id', label: 'ID запиту', description: 'Ідентифікатор запиту на декларацію' },
            { field: 'person.first_name', label: 'Ім\'я пацієнта', description: 'Ім\'я пацієнта' },
            { field: 'person.last_name', label: 'Прізвище пацієнта', description: 'Прізвище пацієнта' },
            { field: 'person.second_name', label: 'По батькові пацієнта', description: 'По батькові пацієнта' },
            { field: 'person.birth_date', label: 'Дата народження', description: 'Дата народження пацієнта' },
            { field: 'person.tax_id', label: 'ІПН пацієнта', description: 'Індивідуальний податковий номер пацієнта' },
            { field: 'employee.position', label: 'Посада лікаря', description: 'Посада працівника' },
            { field: 'employee.party.first_name', label: 'Ім\'я лікаря', description: 'Ім\'я лікаря' },
            { field: 'employee.party.last_name', label: 'Прізвище лікаря', description: 'Прізвище лікаря' },
            { field: 'employee.party.second_name', label: 'По батькові лікаря', description: 'По батькові лікаря' },
            { field: 'division.name', label: 'Назва підрозділу', description: 'Назва підрозділу медичного закладу' },
            { field: 'legal_entity.name', label: 'Назва юр.особи', description: 'Повна назва юридичної особи' },
            { field: 'legal_entity.edrpou', label: 'ЄДРПОУ', description: 'Код ЄДРПОУ юридичної особи' }
        ]
    },
    legal_entity: {
        name: 'Legal Entity (Юридична особа)',
        required: [
            { field: 'name', label: 'Повна назва', description: 'Повна офіційна назва юридичної особи' },
            { field: 'edrpou', label: 'ЄДРПОУ', description: 'Код ЄДРПОУ (8 цифр)' },
            { field: 'legal_form', label: 'Правова форма', description: 'ТОВ, ПАТ, ПрАТ, КТ, ПП, ФОП, НП, БФ' },
            { field: 'email', label: 'Email', description: 'Email адреса юридичної особи' },
            { field: 'status', label: 'Статус', description: 'active, inactive, pending, suspended, new' }
        ],
        optional: [
            { field: 'short_name', label: 'Скорочена назва', description: 'Скорочена назва юридичної особи' },
            { field: 'public_name', label: 'Публічна назва', description: 'Назва для публічного відображення' },
            { field: 'phones', label: 'Телефони', description: 'Масив телефонів у форматі JSON: [{"type":"mobile","number":"+380501234567"}]' },
            { field: 'addresses', label: 'Адреси', description: 'Масив адрес у форматі JSON' },
            { field: 'license_number', label: 'Номер ліцензії', description: 'Номер медичної ліцензії' },
            { field: 'license_expiry', label: 'Дата закінчення ліцензії', description: 'Дата закінчення дії ліцензії (YYYY-MM-DD)' },
            { field: 'specializations', label: 'Спеціалізації', description: 'Масив спеціалізацій через кому' },
            { field: 'accreditation_level', label: 'Рівень акредитації', description: 'Рівень акредитації медичного закладу' },
            { field: 'facility_type', label: 'Тип закладу', description: 'hospital, clinic, pharmacy, laboratory, rehabilitation' },
            { field: 'bed_count', label: 'Кількість ліжок', description: 'Кількість ліжко-місць у закладі' },
            { field: 'emergency_services', label: 'Невідкладна допомога', description: 'Наявність невідкладної допомоги (true/false)' },
            { field: 'laboratory_services', label: 'Лабораторні послуги', description: 'Наявність лабораторних послуг (true/false)' },
            { field: 'imaging_services', label: 'Діагностичні послуги', description: 'Наявність діагностичних послуг (true/false)' }
        ]
    },
    division: {
        name: 'Division (Підрозділ)',
        required: [
            { field: 'name', label: 'Назва підрозділу', description: 'Назва медичного підрозділу' },
            { field: 'type', label: 'Тип підрозділу', description: 'clinic, hospital, ambulatory, pharmacy' },
            { field: 'status', label: 'Статус', description: 'active, inactive, pending, suspended' },
            { field: 'dls_id', label: 'DLS ID', description: 'Ідентифікатор у системі DLS' }
        ],
        optional: [
            { field: 'mountain_group', label: 'Гірська місцевість', description: 'Чи розташований у гірській місцевості (true/false)' },
            { field: 'dls_verified', label: 'DLS верифікований', description: 'Верифікація в системі DLS (true/false)' },
            { field: 'legal_entity_id', label: 'ID юр.особи', description: 'Ідентифікатор юридичної особи' },
            { field: 'addresses', label: 'Адреси', description: 'Адреса підрозділу у форматі JSON' },
            { field: 'phones', label: 'Телефони', description: 'Масив телефонів у форматі JSON: [{"type":"mobile","number":"+380501234567"}]' },
            { field: 'email', label: 'Email', description: 'Email адреса підрозділу' },
            { field: 'working_hours', label: 'Години роботи', description: 'Графік роботи підрозділу' }
        ]
    },
    custom: {
        name: 'Custom (Користувацький)',
        required: [],
        optional: []
    }
};