import { NextRequest, NextResponse } from 'next/server';
import { AuthOptions } from '@/lib/types';
import { refreshToken } from '@/lib//utils';

export default async function refreshTokenRoute(req: NextRequest, opt: AuthOptions) {
    try {
        const body = await req.json();
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
}
