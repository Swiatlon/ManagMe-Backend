import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AccountRepository } from 'repositories/accounts/Accounts.Repository';
import { ILoginCredentials, IRefreshCredentials } from 'types/controllers/Controllers.Interfaces';
import { IUserPayload } from 'types/global/Global.Interfaces';
import { HTTP_STATUS, LONGER_ACCESS_TOKEN_TIME, LONGER_REFRESH_TOKEN_TIME } from 'constants/general/general.Constants';
import { IAuthService } from 'types/services/Services.Interfaces';
import { ApiError } from 'middlewares/apiErrors/ApiError';

export class AuthService implements IAuthService {
    async register({ identifier, password }: ILoginCredentials) {
        const existingUser = await AccountRepository().getAccountWithRolesByIdentifier(identifier);

        if (existingUser) {
            throw new ApiError(HTTP_STATUS.UNAUTHORIZED.code, 'Email is already in use!');
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await AccountRepository().createAccount({
            email: identifier,
            password: hashedPassword,
        });

        const roles = newUser.roles.map((role) => role.name);

        const dataPassedToAccessToken = {
            roles,
            accountId: newUser.id,
        };

        const accessToken = jwt.sign(dataPassedToAccessToken, String(process.env.ACCESS_TOKEN_SECRET), {
            expiresIn: LONGER_ACCESS_TOKEN_TIME,
        });

        const refreshToken = jwt.sign({ email: newUser.email }, String(process.env.REFRESH_TOKEN_SECRET), {
            expiresIn: LONGER_REFRESH_TOKEN_TIME,
        });

        return {
            accessToken,
            refreshToken,
            userData: dataPassedToAccessToken,
        };
    }

    async login({ identifier, password }: ILoginCredentials) {
        const foundUser = await AccountRepository().getAccountWithRolesByIdentifier(identifier);

        if (!foundUser) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND.code, 'User not found!');
        }

        const match = bcrypt.compareSync(password, foundUser.password);

        if (!match) {
            throw new ApiError(HTTP_STATUS.UNAUTHORIZED.code, 'Password or identifier incorrect!');
        }

        // Access Token

        const dataPassedToAccessToken = {
            roles: foundUser.roles.map((role) => role.name),
            accountId: foundUser.id,
        };

        const accessToken = jwt.sign(dataPassedToAccessToken, String(process.env.ACCESS_TOKEN_SECRET), {
            expiresIn: LONGER_ACCESS_TOKEN_TIME,
        });

        // Refresh Token

        const dataPassedToRefreshToken = {
            email: foundUser.email,
        };

        const refreshToken = jwt.sign(dataPassedToRefreshToken, String(process.env.REFRESH_TOKEN_SECRET), {
            expiresIn: LONGER_REFRESH_TOKEN_TIME,
        });

        return {
            accessToken,
            refreshToken,
            userData: dataPassedToAccessToken,
        };
    }

    async refreshSession({ refreshToken }: IRefreshCredentials) {
        const decoded = await new Promise<IUserPayload>((resolve, reject) => {
            jwt.verify(refreshToken, String(process.env.REFRESH_TOKEN_SECRET), (err, decodedToken) => {
                if (err) {
                    reject(err);
                }

                resolve(decodedToken as IUserPayload);
            });
        });

        const foundUser = await AccountRepository().getAccountWithRolesByIdentifier(decoded.email);

        if (!foundUser) {
            throw new ApiError(HTTP_STATUS.UNAUTHORIZED.code, 'User not found!');
        }

        const dataPassedToAccessToken = {
            roles: foundUser.roles.map((role) => role.name),
            accountId: foundUser.id,
        };

        const accessToken = jwt.sign(dataPassedToAccessToken, String(process.env.ACCESS_TOKEN_SECRET), {
            expiresIn: LONGER_ACCESS_TOKEN_TIME,
        });

        return { accessToken };
    }
}

export const authService = new AuthService();
