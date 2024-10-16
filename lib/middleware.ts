import { NextRequest, NextResponse } from 'next/server';
import { getReqRefreshToken } from './utils';
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

const handleLoginRoute: AuthRouteHandler = async (req: NextRequest, opt: AuthOptions) => {
    const token = await getReqRefreshToken(req, opt);
    if (token) return NextResponse.redirect(req.url);

    return NextResponse.next();
};

export async function AuthMiddleware(opt: AuthOptions) {
    return async function middleware(req: NextRequest) {
        if (req.nextUrl.pathname.startsWith(opt.loginPageRoute)) {
            return handleLoginRoute(req, opt);
        } else {
            return handleOtherRoutes(req, opt);
        }
    };
}
