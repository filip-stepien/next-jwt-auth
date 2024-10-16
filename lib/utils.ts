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

export async function refreshToken(oldToken: string, opt: TokenOptions): Promise<string | null> {
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

export async function getReqToken(
    req: NextRequest,
    opt: AuthOptions
): Promise<{ tokenStr: string; payload: object } | null> {
    const tokenStr = getTokenCookieValue(req, opt.cookie.tokenCookieName);

    if (tokenStr) {
        const payload = await getTokenPayload(tokenStr, opt.refreshToken.secret);
        if (payload) return { tokenStr, payload };
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

export async function getBodyFormData(req: NextRequest): Promise<object | null> {
    try {
        const formData = await req.formData();
        const formEntries = formData.entries();
        return Object.fromEntries(formEntries);
    } catch (_e) {
        return null;
    }
}

export function getTokenCookieValue(req: NextRequest, cookieName: string): string | null {
    const tokenCookie = req.cookies.get(cookieName);
    const token = tokenCookie?.value;
    return token ?? null;
}
