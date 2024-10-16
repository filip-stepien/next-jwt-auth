import { AuthRouteHandler } from '@/lib/types';
import { getTokenCookieValue } from '../utils';
import { NextResponse } from 'next/server';

const logoutRoute: AuthRouteHandler = async (req, opt) => {
    const refreshToken = getTokenCookieValue(req, opt.tokenCookieName);
    const res = NextResponse.redirect(new URL(opt.logoutRedirectRoute, req.url));

    if (refreshToken) {
        await Promise.resolve(opt.logout(refreshToken));
        res.cookies.delete(opt.tokenCookieName);
    }

    return res;
};

export default logoutRoute;
