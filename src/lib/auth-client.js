import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL, // e.g. https://gymcraft.app
    plugins: [jwtClient()],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;