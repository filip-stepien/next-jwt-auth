export interface AuthOptions {
    /** Secrets used for generating tokens.
     */
    secrets: {
        accessToken: string;
        refreshToken: string;
    };

    callbacks: {
        /** Callback emitted upon access token generation.
         * Returned payload will be stored in the generated token.
         */
        accessToken: () => object | Promise<object>;

        /** Callback emitted upon refresh token generation.
         * Returned payload will be stored in the generated token.
         */
        refreshToken: () => object | Promise<object>;

        /** Callback emitted on the login action.
         * This function should store refresh token from parameter in a secure location,
         * preferably in an encrypted form.
         */
        login: (refreshToken: string) => void | Promise<void>;

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
