import { AuthRouteHandler } from '@/lib/types';
import { getReqRefreshToken } from '@/lib/utils/request';
import { NextResponse } from 'next/server';

const logoutRoute: AuthRouteHandler = async (req, opt) => {
    const refreshToken = await getReqRefreshToken(req, opt);
    const res = NextResponse.redirect(new URL(opt.logoutRedirectRoute, req.url));

    if (refreshToken) {
        const { refreshTokenStr, refreshTokenPayload } = refreshToken;
        await Promise.resolve(opt.logout(refreshTokenPayload, refreshTokenStr));
        res.cookies.delete(opt.tokenCookieName);
    }

    return res;
};

export default logoutRoute;
