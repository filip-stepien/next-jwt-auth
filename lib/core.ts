import { NextRequest, NextResponse } from 'next/server';
import { AuthOptions, RouteRequestParams } from './types';
import loginRoute from '@/lib/routes/login';
import refreshTokenRoute from '@/lib/routes/refreshToken';

async function routeHandler(req: NextRequest, { params }: RouteRequestParams, opt: AuthOptions) {
    if (params && params.auth) {
        const route = params.auth[0];

        switch (route) {
            case 'login':
                return loginRoute(req, opt);
            case 'refresh-token':
                return refreshTokenRoute(req, opt);
        }

        return NextResponse.json({ hello: 'hello' });
    }
}

export default function Auth(opt: AuthOptions) {
    return async (req: NextRequest, params: RouteRequestParams) => {
        return await routeHandler(req, params, opt);
    };
}
