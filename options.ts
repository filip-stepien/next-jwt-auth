import { AuthOptions } from '@/lib/types';

interface User {
    username: string;
    password: string;
}

const users: User[] = [];

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
        users.push({ username, password });
        console.log(users);
        return true;
    },
    login: (username, password) => {
        console.log(users);
        return users.some(u => u.username === username && u.password === password);
    },
    tokenValid: (_payload, _refreshToken) => {
        return true;
    },
    logout: (_payload, _refreshToken) => {}
};
