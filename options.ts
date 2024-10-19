import { AuthOptions } from '@/lib/types';

export const options: AuthOptions = {
    accessToken: {
        secret: '👻👻👻',
        expiresIn: '5m',
        issuer: 'issuer',
        audience: 'audience'
    },
    refreshToken: {
        secret: '👻👻👻',
        expiresIn: '5m',
        issuer: 'issuer',
        audience: 'audience'
    },
    usernameInputName: 'username',
    passwordInputName: 'password',
    logoutRedirectRoute: '/login',
    loginPageRoute: '/login',
    alreadyLoggedRoute: '/test',
    tokenCookieName: 'refresh-token',

    accessTokenPayload: username => ({ username }),
    refreshTokenPayload: async username => ({ username }),
    login: (_usernam, _password) => {
        return true;
    },
    tokenValid: (_payload, _refreshToken) => {
        return true;
    },
    logout: (_payload, _refreshToken) => {}
};
