import { AuthRouteHandler } from '@/lib/types';
import { getTokenCookieValue } from '../utils';
import { NextResponse } from 'next/server';

const logoutRoute: AuthRouteHandler = async (req, opt) => {
    const refreshToken = getTokenCookieValue(req, opt.cookie.tokenCookieName);
    const res = NextResponse.redirect(new URL(opt.redirect.logoutRedirectRoute, req.url));

    if (refreshToken) {
        await Promise.resolve(opt.callbacks.logout(refreshToken));
        res.cookies.delete(opt.cookie.tokenCookieName);
    }

    return res;
};

export default logoutRoute;
