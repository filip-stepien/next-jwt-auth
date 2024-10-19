import { AuthRouteHandler } from '@/lib/types';
import { getReqRefreshToken } from '@/lib/utils/request';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const logoutRoute: AuthRouteHandler = async (req, opt) => {
    const refreshToken = await getReqRefreshToken(req, opt);
    const cookieStore = cookies();

    if (refreshToken) {
        const { refreshTokenStr, refreshTokenPayload } = refreshToken;
        await Promise.resolve(opt.logout(refreshTokenPayload, refreshTokenStr));
        cookieStore.delete(opt.tokenCookieName);
        return new NextResponse(null, { status: 200 });
    }

    return new NextResponse(null, { status: 400 });
};

export default logoutRoute;
