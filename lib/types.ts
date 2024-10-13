export interface RouteRequestParams {
    params: { auth?: string[] } | undefined;
}

export interface TokenOptions {
    secret: string;
    expiresIn: string;
    issuer: string;
    audience: string;
}

export interface AuthOptions {
    accessToken: TokenOptions;
    refreshToken: TokenOptions;

    /** Name attribute values for input fields used in the login form.
     */
    inputNames: {
        username: string;
        password: string;
    };

    cookie: {
        tokenCookieName: string;
    };

    callbacks: {
        /** Callback emitted before access token generation.
         * Returned payload will be stored in the generated token.
         */
        accessTokenPayload: () => object | Promise<object>;

        /** Callback emitted before refresh token generation.
         * Returned payload will be stored in the generated token.
         */
        refreshTokenPayload: () => object | Promise<object>;

        /** Callback used for authenticating a user.
         * This function should check if passed credentials are valid.
         */
        login: (username: string, password: string) => boolean | Promise<boolean>;

        /** Callback emitted when the user navigates between pages.
         * This function should be used to check if the refresh token
         * from the cookie is valid and matches the previously stored token.
         */
        checkAuth: (refreshToken: string) => boolean | Promise<boolean>;

        /** Callback emitted before discarding the refresh token from the cookie.
         * This function should be used to delete the previously stored token.
         */
        logout: (refreshToken: string) => void | Promise<void>;
    };
}
