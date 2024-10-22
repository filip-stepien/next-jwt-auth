import { NextRequest, NextResponse } from 'next/server';
import { AuthOptions, AuthHandlerCallback } from '@/lib/types';
import { getReqFormCredentials } from '@/lib/utils/request';
import { generateToken } from '@/lib/utils/jwt';

export async function getAuthResponse(
    req: NextRequest,
    opt: AuthOptions,
    authHandler: AuthHandlerCallback
) {
    try {
        const credentials = await getReqFormCredentials(req, opt);
        if (!credentials) return new NextResponse(null, { status: 400 });

        const username = credentials[opt.usernameInputName];
        const password = credentials[opt.passwordInputName];

        const authenticated = await Promise.resolve(authHandler(username, password));
        if (!authenticated) return new NextResponse(null, { status: 401 });

        const accessTokenPayload = await Promise.resolve(opt.accessTokenPayload(username));
        const refreshTokenPayload = await Promise.resolve(opt.refreshTokenPayload(username));
        const accessToken = await generateToken(accessTokenPayload, opt.accessToken);
        const refreshToken = await generateToken(refreshTokenPayload, opt.refreshToken);

        if (!accessToken || !refreshToken) return new NextResponse(null, { status: 500 });

        const res = NextResponse.json({ token: accessToken });
        res.cookies.set(opt.tokenCookieName, refreshToken, { httpOnly: true });
        return res;
    } catch (_e) {
        return new NextResponse(null, { status: 500 });
    }
}
