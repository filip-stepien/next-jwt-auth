import { JWTPayload, SignJWT } from 'jose';
import { TokenOptions } from './types';
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

export async function refreshToken(oldToken: string, opt: TokenOptions): Promise<string | null> {
    try {
        const payload = jose.decodeJwt(oldToken);
        return await generateToken(payload, opt);
    } catch (_e) {
        return null;
    }
}
