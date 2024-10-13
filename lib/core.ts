import { NextRequest, NextResponse } from 'next/server';
import { AuthOptions } from './types';

interface RouteRequestParams {
    params: { auth?: string[] } | undefined;
}

async function routeHandler(req: NextRequest, { params }: RouteRequestParams) {
    if (params && params.auth) {
        const route = params.auth[0];

        // todo: routing

        return NextResponse.json({ hello: 'hello' });
    }
}

export default function Auth(options: AuthOptions) {
    return routeHandler;
}
