import asyncHandler from 'express-async-handler';
import type { CookieOptions, Request, Response } from 'express';
import { HTTP_STATUS, ONE_DAY } from 'constants/general/general.Constants';
import { ICookie } from 'types/global/Global.Interfaces';
import { ILoginCredentials } from 'types/controllers/Controllers.Interfaces';
import { authService } from 'services/Auth.Service';
import { ApiError } from 'middlewares/apiErrors/ApiError';

const login = asyncHandler(async (req: Request, res: Response) => {
    const { identifier, password } = req.body as ILoginCredentials;
    const { accessToken, refreshToken, userData } = await authService.login({ identifier, password });

    const cookiesOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ONE_DAY * 30,
    } as CookieOptions;

    res.cookie('refreshToken', refreshToken, cookiesOptions);
    res.cookie('loggedUserData', { ...userData }, cookiesOptions);

    res.json({ accessToken });
});

const register = asyncHandler(async (req: Request, res: Response) => {
    const { identifier, password } = req.body as ILoginCredentials;
    const { accessToken, refreshToken, userData } = await authService.register({ identifier, password });

    const cookiesOptions: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ONE_DAY * 30,
    };

    res.cookie('refreshToken', refreshToken, cookiesOptions);
    res.cookie('loggedUserData', { ...userData }, cookiesOptions);

    res.status(201).json({ accessToken });
});

const refreshSession = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies as ICookie;

    if (!refreshToken) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN.code, 'Unauthorized!');
    }

    const { accessToken } = await authService.refreshSession({ refreshToken });

    res.json({ accessToken });
});

const logout = (req: Request, res: Response) => {
    const cookies = req.cookies as ICookie;

    if (!cookies?.refreshToken) {
        throw new ApiError(HTTP_STATUS.NO_CONTENT.code, '');
    }

    const cookieOptions = { httpOnly: true, sameSite: 'none', secure: true } as CookieOptions;

    res.clearCookie('refreshToken', cookieOptions);
    res.clearCookie('userInfo', cookieOptions);
    res.clearCookie('session', cookieOptions);

    res.json({ message: 'Cookie cleared' });
};

export const AuthController = {
    login,
    logout,
    register,
    refreshSession,
};
