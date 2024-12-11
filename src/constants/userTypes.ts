export type UserType = {
    id: number;

    email: string;

    firstName: string | null;

    lastName: string | null;

    phone?: number | null;

    bio?: string | null;

    address?: string | null;

    region?: string | null;

    company?: string | null;

    role: number | null;

    profession?: string | null;

    password: string;

    refreshToken: string;

}