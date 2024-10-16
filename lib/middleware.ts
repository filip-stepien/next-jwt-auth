import { NextRequest, NextResponse } from 'next/server';
import { getReqToken } from './utils';
import { AuthOptions, AuthRouteHandler } from './types';

const handleOtherRoutes: AuthRouteHandler = async (req: NextRequest, opt: AuthOptions) => {
    const token = await getReqToken(req, opt);

    if (token) {
        const { tokenStr, payload } = token;
        const valid = await Promise.resolve(opt.callbacks.tokenValid(payload, tokenStr));
        if (valid) return NextResponse.next();
    }

    return NextResponse.redirect(new URL(opt.logoutRedirectRoute, req.url));
};

const handleLoginRoute: AuthRouteHandler = async (req: NextRequest, opt: AuthOptions) => {
    const token = await getReqToken(req, opt);
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
