import { NextRequest, NextResponse } from 'next/server';
import { AuthOptions, RouteRequestParams } from './types';
import { generateToken } from './utils';

async function handleLoginRoute(req: NextRequest, opt: AuthOptions) {
    try {
        const formData = await req.formData();
        const username = formData.get(opt.inputNames.username) as string | null;
        const password = formData.get(opt.inputNames.password) as string | null;

        if (!username || !password) return new NextResponse(null, { status: 400 });

        const authenticated = await opt.callbacks.login(username, password);
        if (!authenticated) return new NextResponse(null, { status: 401 });

        const accessTokenPayload = await opt.callbacks.accessTokenPayload();
        const refreshTokenPayload = await opt.callbacks.refreshTokenPayload();
        const accessToken = await generateToken(accessTokenPayload, opt.accessToken);
        const refreshToken = await generateToken(refreshTokenPayload, opt.refreshToken);

        if (!accessToken || !refreshToken) return new NextResponse(null, { status: 500 });

        const res = NextResponse.json({ token: accessToken });
        res.cookies.set(opt.cookie.tokenCookieName, refreshToken, { httpOnly: true });
        return res;
    } catch (e) {
        return new NextResponse(null, { status: 500 });
    }
}

async function routeHandler(req: NextRequest, { params }: RouteRequestParams, opt: AuthOptions) {
    if (params && params.auth) {
        const route = params.auth[0];

        switch (route) {
            case 'login':
                return handleLoginRoute(req, opt);
        }

        return NextResponse.json({ hello: 'hello' });
    }
}

export default function Auth(opt: AuthOptions) {
    return async (req: NextRequest, params: RouteRequestParams) => {
        return await routeHandler(req, params, opt);
    };
}
