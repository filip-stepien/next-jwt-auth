import { NextResponse } from 'next/server';
import { AuthRouteHandler } from '@/lib/types';
import { getReqAccessToken, getReqRefreshToken, getRefreshedToken } from '@/lib//utils';

const refreshTokenRoute: AuthRouteHandler = async (req, opt) => {
    try {
        const accessToken = await getReqAccessToken(req, opt);
        const refreshToken = await getReqRefreshToken(req, opt);

        if (!accessToken || !refreshToken) return new NextResponse(null, { status: 400 });

        const { refreshTokenStr, refreshTokenPayload } = refreshToken;
        const { accessTokenStr } = accessToken;

        const valid = await Promise.resolve(opt.tokenValid(refreshTokenPayload, refreshTokenStr));
        if (!valid) return new NextResponse(null, { status: 401 });

        const newTokenStr = await getRefreshedToken(accessTokenStr, opt.accessToken);
        if (!newTokenStr) return new NextResponse(null, { status: 401 });

        return NextResponse.json({ token: newTokenStr });
    } catch (_e) {
        return new NextResponse(null, { status: 500 });
    }
};

export default refreshTokenRoute;
