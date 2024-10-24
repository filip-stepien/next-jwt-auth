import { NextRequest, NextResponse } from 'next/server';
import { getReqRefreshToken } from '@/lib/utils/request';
import { AuthOptions, AuthRouteHandler } from './types';

const handleOtherRoutes: AuthRouteHandler = async (req: NextRequest, opt: AuthOptions) => {
    const refreshToken = await getReqRefreshToken(req, opt);

    if (refreshToken) {
        const { refreshTokenStr, refreshTokenPayload } = refreshToken;
        const valid = await Promise.resolve(opt.tokenValid(refreshTokenPayload, refreshTokenStr));
        if (valid) return NextResponse.next();
    }

    return NextResponse.redirect(new URL(opt.logoutRedirectRoute, req.url));
};

const handleAuthRoute: AuthRouteHandler = async (req: NextRequest, opt: AuthOptions) => {
    const token = await getReqRefreshToken(req, opt);
    if (token) return NextResponse.redirect(new URL(opt.alreadyLoggedRoute, req.url));

    return NextResponse.next();
};

export function AuthMiddleware(opt: AuthOptions) {
    return async function middleware(req: NextRequest) {
        const loginRoute = req.nextUrl.pathname.startsWith(opt.loginPageRoute);
        const registerRoute = req.nextUrl.pathname.startsWith(opt.registerPageRoute);

        if (loginRoute || registerRoute) {
            return handleAuthRoute(req, opt);
        } else {
            return handleOtherRoutes(req, opt);
        }
    };
}
