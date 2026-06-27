import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
const client = new MongoClient(process.env.MONNGODB_URL);
const db = client.db('gym-craft');
export const auth = betterAuth({
    plugins: [
        jwt({
            // Bake the fields Express needs to authorize requests right into
            // the JWT payload — no DB lookup needed on every API call.
            jwt: {
                definePayload: ({ user }) => ({
                    id: user.id,
                    role: user.role,
                    status: user.status,
                }),
            },
        }),
    ],
    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 7 * 24 * 60 * 60
        }
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "member",
                input: false,
            },
            status: {
                type: "string",
                defaultValue: "active",
                input: false,
            },
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        },
    },
    database: mongodbAdapter(db, { client }),
});