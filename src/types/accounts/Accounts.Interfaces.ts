import { Role } from 'entities/accounts/Role.Entity';

export interface IAccountCredentials {
    identifier: string;
    password: string;
}

export interface IRoles {
    id: number;
    name: string;
}

export interface IUserAccount {
    id: number;
    login: string;
    email: string;
    password: string;
    roles: Role[];
}

export interface IUserAccountRole {
    userAccountId: number;
    userAccountRoles: string;
}
