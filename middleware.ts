import { options } from '@/options';
import { AuthMiddleware } from './lib/middleware';

const authMiddleware = AuthMiddleware(options);

export { authMiddleware as middleware };

export const config = {
    matcher: ['/login', '/register', '/test', '/logout']
};
