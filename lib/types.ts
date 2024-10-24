import { NextRequest, NextResponse } from 'next/server';

export interface RouteRequestParams {
    params: { auth?: string[] } | undefined;
}

export interface TokenOptions {
    secret: string;
    expiresIn: string;
    issuer: string;
    audience: string;
}

export type AuthHandlerCallback = (
    username: string,
    password: string
) => boolean | Promise<boolean>;

export interface AuthOptions {
    accessToken: TokenOptions;
    refreshToken: TokenOptions;

    /** Name attribute values for input fields used in the login form.
     */
    usernameInputName: string;
    passwordInputName: string;

    tokenCookieName: string;
    logoutRedirectRoute: string;
    loginPageRoute: string;
    registerPageRoute: string;
    alreadyLoggedRoute: string;

    /** Callback emitted before access token generation.
     * Returned payload will be stored in the generated token.
     */
    accessTokenPayload: (username: string) => object | Promise<object>;

    /** Callback emitted before refresh token generation.
     * Returned payload will be stored in the generated token.
     */
    refreshTokenPayload: (username: string) => object | Promise<object>;

    /** Callback used for authenticating a user.
     * This function should check if passed credentials are valid.
     */
    login: AuthHandlerCallback;

    register: AuthHandlerCallback;

    /** Callback emitted when the user navigates between pages or refreshes the access token.
     * This function should be used to check if the refresh token
     * from the cookie is valid and matches the previously stored token.
     */
    tokenValid: (refreshTokenPayload: object, refreshToken: string) => boolean | Promise<boolean>;

    /** Callback emitted before discarding the refresh token from the cookie.
     * This function should be used to delete the previously stored token.
     */
    logout: (refreshTokenPayload: object, refreshToken: string) => void | Promise<void>;
}

export type AuthRouteHandler = (
    req: NextRequest,
    options: AuthOptions
) => NextResponse | Promise<NextResponse>;

export interface AuthRoute {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
    route: string;
    handler: AuthRouteHandler;
}
