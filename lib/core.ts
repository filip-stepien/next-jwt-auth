import { NextRequest, NextResponse } from 'next/server';
import { AuthOptions, AuthRoute, RouteRequestParams } from './types';
import loginRoute from '@/lib/routes/login';
import refreshTokenRoute from '@/lib/routes/refreshToken';

const router: AuthRoute[] = [
    { route: 'login', method: 'POST', handler: loginRoute },
    { route: 'refreshToken', method: 'POST', handler: refreshTokenRoute }
];

function routeHandler(req: NextRequest, { params }: RouteRequestParams, opt: AuthOptions) {
    console.log(params);
    if (params && params.auth) {
        const route = params.auth[0];
        const method = req.method;
        const authRoute = router.find(r => r.route === route && r.method === method);
        return authRoute ? authRoute.handler(req, opt) : new NextResponse(null, { status: 404 });
    }
}

export default function Auth(opt: AuthOptions) {
    return (req: NextRequest, params: RouteRequestParams) => {
        return routeHandler(req, params, opt);
    };
}
