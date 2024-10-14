import { NextResponse } from 'next/server';
import { AuthRouteHandler } from '@/lib/types';
import { generateToken, getBodyFormData } from '@/lib/utils';

const loginRoute: AuthRouteHandler = async (req, opt) => {
    try {
        const formData = (await getBodyFormData(req)) as { username: string; password: string };
        const { username, password } = formData;

        if (!formData || !username || !password) return new NextResponse(null, { status: 400 });

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
    } catch (_e) {
        return new NextResponse(null, { status: 500 });
    }
};

export default loginRoute;
