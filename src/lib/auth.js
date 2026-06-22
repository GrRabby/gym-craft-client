import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
const client = new MongoClient(process.env.MONNGODB_URL);
const db = client.db('gym-craft');
export const auth = betterAuth({
    plugins: [
        jwt()
    ],
    session : {
        cookieCache : {
            enabled : true,
            strategy : "jwt",
            maxAge : 7*24*60*60
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
            },
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        },
    },
    database: mongodbAdapter(db, {client}),
});