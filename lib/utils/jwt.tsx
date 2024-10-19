import { TokenOptions } from '@/lib/types';
import { JWTPayload, SignJWT } from 'jose';
import * as jose from 'jose';

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
