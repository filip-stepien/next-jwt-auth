import Auth from '@/lib/core';
import { AuthOptions } from '@/lib/types';

// demo

let storage: string[] = [];

const options: AuthOptions = {
    secrets: {
        accessToken: '👻👻👻',
        refreshToken: '😨😨😨'
    },
    callbacks: {
        accessToken: () => ({ username: 'admin' }),
        refreshToken: async () => ({ username: 'admin' }),
        login: (refreshToken: string) => {
            storage.push(refreshToken);
        },
        checkAuth: (refreshToken: string) => {
            return storage.some(token => token === refreshToken);
        },
        logout: (refreshToken: string) => {
            storage = storage.filter(token => token !== refreshToken);
        }
    }
};
const handler = Auth(options);

export { handler as GET, handler as POST };
