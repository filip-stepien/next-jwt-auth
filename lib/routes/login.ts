import { NextResponse } from 'next/server';
import { AuthRouteHandler } from '@/lib/types';
import { generateToken, getReqFormCredentials } from '@/lib/utils';

const loginRoute: AuthRouteHandler = async (req, opt) => {
    try {
        const credentials = await getReqFormCredentials(req, opt);
        if (!credentials) return new NextResponse(null, { status: 400 });

        const username = credentials[opt.usernameInputName];
        const password = credentials[opt.passwordInputName];
        const authenticated = await opt.login(username, password);

        if (!authenticated) return new NextResponse(null, { status: 401 });

        const accessTokenPayload = await opt.accessTokenPayload();
        const refreshTokenPayload = await opt.refreshTokenPayload();
        const accessToken = await generateToken(accessTokenPayload, opt.accessToken);
        const refreshToken = await generateToken(refreshTokenPayload, opt.refreshToken);

        if (!accessToken || !refreshToken) return new NextResponse(null, { status: 500 });

        const res = NextResponse.json({ token: accessToken });
        res.cookies.set(opt.tokenCookieName, refreshToken, { httpOnly: true });
        return res;
    } catch (_e) {
        return new NextResponse(null, { status: 500 });
    }
};

export default loginRoute;
