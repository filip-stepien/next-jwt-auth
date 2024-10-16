import Auth from '@/lib/core';
import { AuthOptions } from '@/lib/types';

// demo

let storage: string[] = [];

const options: AuthOptions = {
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
    logoutRedirectRoute: '/',
    loginPageRoute: '/login',
    tokenCookieName: 'refresh-token',

    accessTokenPayload: username => ({ username }),
    refreshTokenPayload: async username => ({ username }),
    login: (_usernam, _password) => {
        return true;
    },
    tokenValid: (_payload, _refreshToken) => {
        return true;
    },
    logout: (_payload, refreshToken) => {
        storage = storage.filter(token => token !== refreshToken);
    }
};
const handler = Auth(options);

export { handler as GET, handler as POST };
