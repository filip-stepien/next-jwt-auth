import { AuthOptions } from '@/lib/types';
import fs from 'fs';

interface User {
    username: string;
    password: string;
}

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
    registerPageRoute: '/register',
    alreadyLoggedRoute: '/test',
    tokenCookieName: 'refresh-token',

    accessTokenPayload: username => ({ username }),
    refreshTokenPayload: async username => ({ username }),
    register: (username, password) => {
        if (!fs.existsSync('debug.json')) fs.writeFileSync('debug.json', JSON.stringify([]));

        const file = fs.readFileSync('debug.json', { encoding: 'utf8' });
        const arr = JSON.parse(file) as User[];

        arr.push({ username, password });
        fs.writeFileSync('debug.json', JSON.stringify(arr));

        return true;
    },
    login: (username, password) => {
        if (!fs.existsSync('debug.json')) fs.writeFileSync('debug.json', JSON.stringify([]));

        const file = fs.readFileSync('debug.json', { encoding: 'utf8' });
        const arr = JSON.parse(file) as User[];

        return arr.some(u => u.username === username && u.password === password);
    },
    tokenValid: (_payload, _refreshToken) => {
        return true;
    },
    logout: (_payload, _refreshToken) => {}
};
