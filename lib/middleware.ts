import { NextRequest, NextResponse } from 'next/server';
import { getTokenCookieValue, verifyToken } from './utils';
import { AuthOptions } from './types';

async function handleOtherRoutes(req: NextRequest, opt: AuthOptions) {
    const token = getTokenCookieValue(req, opt.cookie.tokenCookieName);

    if (token) {
        const payload = await verifyToken(token, opt.refreshToken.secret);
        if (payload) {
            const valid = await Promise.resolve(opt.callbacks.tokenValid(payload, token));
            if (valid) NextResponse.next();
        }
    }

    return NextResponse.redirect(new URL(opt.redirect.logoutRedirectRoute, req.url));
}
