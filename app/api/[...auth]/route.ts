import Auth from '@/lib/core';
import { AuthOptions } from '@/lib/types';
import * as jose from 'jose';

// demo

interface User extends jose.JWTPayload {
    username: string;
}

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
    inputNames: {
        username: 'username',
        password: 'password'
    },
    redirect: {
        logoutRedirectRoute: '/'
    },
    cookie: {
        tokenCookieName: 'refresh-token'
    },
    callbacks: {
        accessTokenPayload: (): User => ({ username: 'admin' }),
        refreshTokenPayload: async () => ({ username: 'admin' }),
        login: (_username: string, _password: string) => {
            return true;
        },
        tokenValid: (_payload: object, _refreshToken: string) => {
            return true;
        },
        logout: (refreshToken: string) => {
            storage = storage.filter(token => token !== refreshToken);
        }
    }
};
const handler = Auth(options);

export { handler as GET, handler as POST };
