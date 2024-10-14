import { NextResponse } from 'next/server';
import { AuthRouteHandler } from '@/lib/types';
import { getBodyJSON, refreshToken } from '@/lib//utils';

const refreshTokenRoute: AuthRouteHandler = async (req, opt) => {
    try {
        const body = (await getBodyJSON(req)) as { token: string };
        if (!body) return new NextResponse(null, { status: 400 });

        const accessTokenStr = body?.token;
        const refreshTokenStr = req.cookies.get(opt.cookie.tokenCookieName)?.value;

        if (!accessTokenStr || !refreshTokenStr) return new NextResponse(null, { status: 400 });

        const tokenValid = await Promise.resolve(opt.callbacks.tokenValid(refreshTokenStr));
        if (!tokenValid) return new NextResponse(null, { status: 401 });

        const newTokenStr = await refreshToken(accessTokenStr, opt.accessToken);
        if (!newTokenStr) return new NextResponse(null, { status: 401 });

        return NextResponse.json({ token: newTokenStr });
    } catch (_e) {
        return new NextResponse(null, { status: 500 });
    }
};

export default refreshTokenRoute;
