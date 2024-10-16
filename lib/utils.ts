import { JWTPayload, SignJWT } from 'jose';
import { TokenOptions } from './types';
import * as jose from 'jose';
import { NextRequest } from 'next/server';
import { AuthOptions } from './types';

export async function generateToken(payload: object, opt: TokenOptions): Promise<string | null> {
    try {
        const jwtPayload = payload as JWTPayload;
        const token = await new SignJWT(jwtPayload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer(opt.issuer)
            .setAudience(opt.audience)
            .setExpirationTime(opt.expiresIn)
            .sign(new TextEncoder().encode(opt.secret));
        return token;
    } catch (_e) {
        return null;
    }
}

export async function getRefreshedToken(
    oldToken: string,
    opt: TokenOptions
): Promise<string | null> {
    try {
        const payload = jose.decodeJwt(oldToken);
        return await generateToken(payload, opt);
    } catch (_e) {
        return null;
    }
}

export async function getTokenPayload(token: string, secret: string): Promise<object | null> {
    try {
        const payload = await jose.jwtVerify(token, new TextEncoder().encode(secret));
        return payload as object;
    } catch (_e) {
        return null;
    }
}

export async function getReqRefreshToken(
    req: NextRequest,
    opt: AuthOptions
): Promise<{ refreshTokenStr: string; refreshTokenPayload: object } | null> {
    const refreshTokenStr = getTokenCookieValue(req, opt.tokenCookieName);

    if (refreshTokenStr) {
        const refreshTokenPayload = await getTokenPayload(refreshTokenStr, opt.refreshToken.secret);
        if (refreshTokenPayload) return { refreshTokenStr, refreshTokenPayload };
    }

    return null;
}

export async function getBodyJSON(req: NextRequest): Promise<object | null> {
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
        const body = (await getBodyJSON(req)) as { token: string };
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

export function getTokenCookieValue(req: NextRequest, cookieName: string): string | null {
    const tokenCookie = req.cookies.get(cookieName);
    const token = tokenCookie?.value;
    return token ?? null;
}
