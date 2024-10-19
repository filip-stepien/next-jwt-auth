import { NextRequest } from 'next/server';
import { AuthOptions } from '@/lib/types';
import { getTokenPayload } from '@/lib/utils/jwt';

export function getReqCookieValue(req: NextRequest, cookieName: string): string | null {
    const cookie = req.cookies.get(cookieName);
    const value = cookie?.value;
    return value ?? null;
}

export async function getReqRefreshToken(
    req: NextRequest,
    opt: AuthOptions
): Promise<{ refreshTokenStr: string; refreshTokenPayload: object } | null> {
    const refreshTokenStr = getReqCookieValue(req, opt.tokenCookieName);

    if (refreshTokenStr) {
        const refreshTokenPayload = await getTokenPayload(refreshTokenStr, opt.refreshToken.secret);
        if (refreshTokenPayload) return { refreshTokenStr, refreshTokenPayload };
    }

    return null;
}

export async function getReqBodyJSON(req: NextRequest): Promise<object | null> {
    try {
        return await req.json();
    } catch (_e) {
        return null;
    }
}

export async function getReqAccessToken(
    req: NextRequest,
    opt: AuthOptions
): Promise<{ accessTokenStr: string; accessTokenPayload: object } | null> {
    try {
        const body = (await getReqBodyJSON(req)) as { token: string };
        const accessTokenStr = body?.token;

        if (accessTokenStr) {
            const accessTokenPayload = await getTokenPayload(
                accessTokenStr,
                opt.accessToken.secret
            );
            if (accessTokenPayload) return { accessTokenStr, accessTokenPayload };
        }

        return null;
    } catch (_e) {
        return null;
    }
}

export async function getReqBodyFormData(
    req: NextRequest
): Promise<{ [key: string]: string } | null> {
    try {
        const formData = await req.formData();
        const formEntries = formData.entries();
        return Object.fromEntries(formEntries) as { [key: string]: string };
    } catch (_e) {
        return null;
    }
}

export async function getReqFormCredentials(
    req: NextRequest,
    opt: AuthOptions
): Promise<{ [key: string]: string } | null> {
    try {
        const formData = await getReqBodyFormData(req);
        const { usernameInputName, passwordInputName } = opt;

        if (formData && usernameInputName in formData && passwordInputName in formData) {
            return {
                [usernameInputName]: formData[usernameInputName],
                [passwordInputName]: formData[passwordInputName]
            };
        }

        return null;
    } catch (_e) {
        return null;
    }
}
