import { RolesEnum } from 'constants/entities/entities.Constants';
import { Request } from 'express';

export interface ICookie {
    refreshToken?: string;
    loggedUserData: {
        accountId: number;
        roles: RolesEnum[];
    };
}

export interface IUserPayload {
    email: string;
    login: string;
    id: number;
}

export interface ICustomError extends Error {
    statusCode?: number;
}

export interface ICustomVisbilityFieldRequest extends Request {
    selectFields?: string[];
}
