type Gender = 'male' | 'female';
type PhoneType = 'mobile' | 'landline' | 'work';
type DocumentType = 'PASSPORT' | 'BIRTH_CERTIFICATE' | 'NATIONAL_ID';
type EmployeeType = 'doctor' | 'nurse' | 'admin' | 1;
type EmployeeStatus = 'active' | 'inactive' | 'suspended';
type VerificationStatus = 'verified' | 'not_verified' | 'pending';
type DeclarationStatus = 'active' | 'inactive' | 'terminated';
type DeclarationScope = 'family_doctor' | 'specialist' | 'emergency';
type DivisionType = 'clinic' | 'hospital' | 'ambulatory' | 'pharmacy';
type DivisionStatus = 'active' | 'inactive' | 'terminated';
type AddressType = 'RESIDENCE' | 'REGISTRATION' | 'WORK';
type SettlementType = 'CITY' | 'TOWN' | 'VILLAGE';
type StreetType = 'STREET' | 'AVENUE' | 'BOULEVARD' | 'SQUARE';
type RelationType = 'PRIMARY' | 'SECONDARY';
type EducationDegree = 'BACHELOR' | 'MASTER' | 'PhD' | 'SPECIALIST';
type QualificationType = 'SPECIALIZATION' | 'CERTIFICATION' | 'COURSE';
type SpecialityType = 'THERAPIST' | 'PEDIATRICIAN' | 'SURGEON' | 'CARDIOLOGIST';
type SpecialityLevel = 'FIRST' | 'SECOND' | 'HIGHEST';
type QualificationTypeEnum = 'AWARDING' | 'CONFIRMATION' | 'IMPROVEMENT';
type AuthMethodType = 'OTP' | 'BANK_ID' | 'MOBILE_ID';
type PreferredCommunication = 'phone' | 'email' | 'sms';

interface Phone {
    type: PhoneType;
    number: string;
}

interface Address {
    type: AddressType;
    country: string;
    area: string;
    region: string;
    settlement: string;
    settlement_type: SettlementType;
    settlement_id: string;
    street_type: StreetType;
    street: string;
    building: string;
    apartment?: string;
    zip: string;
}

interface Document {
    type: DocumentType;
    number: string;
    expiration_date?: string;
    issued_by: string;
    issued_at: string;
}

interface RelationshipDocument {
    type: DocumentType;
    number: string;
    issued_by: string;
    issued_at: string;
    active_to: string;
}

interface EmergencyContact {
    first_name: string;
    last_name: string;
    second_name: string;
    phones: Phone[];
}

interface ConfidantPerson {
    relation_type: RelationType;
    first_name: string;
    last_name: string;
    second_name: string;
    birth_date: string;
    birth_country: string;
    birth_settlement: string;
    gender: Gender;
    email: string;
    tax_id: string;
    secret: string;
    unzr: string;
    preferred_way_communication: PreferredCommunication;
    documents_person: Document[];
    documents_relationship: RelationshipDocument[];
    phones: Phone[];
}

interface Person {
    id: string;
    first_name: string;
    last_name: string;
    second_name: string;
    birth_date: string;
    gender: Gender;
    tax_id: string;
    phones: Phone[];
    birth_settlement: string;
    birth_country: string;
    verification_status: VerificationStatus;
    emergency_contact: EmergencyContact;
    confidant_person: ConfidantPerson[];
}

interface Education {
    country: string;
    city: string;
    institution_name: string;
    issued_date: string;
    diploma_number: string;
    degree: EducationDegree;
    speciality: string;
}

interface Qualification {
    type: QualificationType;
    institution_name: string;
    speciality: string;
    issued_date: string;
    certificate_number: string;
    valid_to: string;
    additional_info?: string;
}

interface Speciality {
    speciality: SpecialityType;
    speciality_officio: boolean;
    level: SpecialityLevel;
    qualification_type: QualificationTypeEnum;
    attestation_name: string;
    attestation_date: string;
    valid_to_date: string;
    certificate_number: string;
}

interface ScienceDegree {
    country: string;
    city: string;
    degree: string;
    institution_name: string;
    diploma_number: string;
    speciality: string;
    issued_date: string;
}

interface Doctor {
    educations: Education[];
    qualifications: Qualification[];
    specialities: Speciality[];
    science_degree: ScienceDegree;
}

interface Party {
    id: string;
    first_name: string;
    last_name: string;
    second_name: string;
}

interface Employee {
    id: string;
    position: string;
    employee_type: EmployeeType;
    status: EmployeeStatus;
    start_date: string;
    end_date: string;
    party: Party;
    division_id: string;
    legal_entity_id: string;
    doctor: Doctor;
}

interface Division {
    id: string;
    name: string;
    legal_entity_id: string;
    type: DivisionType;
    status: DivisionStatus;
    mountain_group: boolean;
    dls_id: string;
    dls_verified: boolean;
}

interface LegalEntity {
    id: string;
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

interface AuthenticationMethod {
    type: AuthMethodType;
    number: string;
}

interface Urgent {
    authentication_method_current: AuthenticationMethod;
}

interface ElectronicDeclaration {
    id: string;
    declaration_number: string;
    start_date: string;
    end_date: string;
    signed_at: string;
    person: Person;
    employee: Employee;
    division: Division;
    legal_entity: LegalEntity;
    status: DeclarationStatus;
    scope: DeclarationScope;
    declaration_request_id: string;
    inserted_at: string;
    updated_at: string;
    reason: string;
    reason_description: string;
    urgent: Urgent;
}
interface Declaration {
    id: string;
    declaration_number: string;
    start_date: string;
    end_date: string;
    signed_at: string;
    status: 'active' | 'inactive' | 'terminated';
    scope: 'family_doctor' | 'specialist' | 'emergency';
    reason: string;
    reason_description?: string;
    person: {
        id: string;
        first_name: string;
        last_name: string;
        second_name: string;
        birth_date: string;
        tax_id: string;
    };
    employee: {
        id: string;
        position: string;
        party: {
            first_name: string;
            last_name: string;
            second_name: string;
        };
    };
    division: {
        id: string;
        name: string;
    };
    legal_entity: {
        id: string;
        name: string;
    };
    inserted_at: string;
    updated_at: string;
}

interface CreateDeclarationData {
    start_date: string;
    end_date: string;
    signed_at: string;
    person_id: string;
    employee_id: string;
    division_id: string;
    legal_entity_id: string;
    status: string;
    scope: string;
    declaration_request_id: string;
    reason: string;
    reason_description?: string;
}

export type {
    ElectronicDeclaration,
    Person,
    Employee,
    Division,
    LegalEntity,
    Doctor,
    Education,
    Qualification,
    Speciality,
    ConfidantPerson,
    EmergencyContact,
    Phone,
    Address,
    Document,
    Gender,
    PhoneType,
    DocumentType,
    EmployeeType,
    EmployeeStatus,
    VerificationStatus,
    DeclarationStatus,
    DeclarationScope,
    DivisionType,
    DivisionStatus,
    Declaration,
    CreateDeclarationData
};