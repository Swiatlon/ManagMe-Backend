import { RolesEnum } from 'constants/entities/entities.Constants';
import { ILoginCredentials, IRefreshCredentials, IRegisterCredentials } from 'types/controllers/Controllers.Interfaces';

export interface ILoggedAccountData {
    accountId: number;
    roles: RolesEnum[];
}

export interface IAuthService {
    login(credentials: ILoginCredentials): Promise<{
        accessToken: string;
        refreshToken: string;
        userData: {
            accountId: number;
            roles: string[];
        };
    }>;

    refreshSession(credentials: IRefreshCredentials): Promise<{
        accessToken: string;
    }>;

    register(credentials: IRegisterCredentials): Promise<{
        accessToken: string;
        refreshToken: string;
        userData: {
            accountId: number;
            roles: string[];
        };
    }>;
}
