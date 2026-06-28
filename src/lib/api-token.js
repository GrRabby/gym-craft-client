import "server-only";
import { cookies } from "next/headers";

 
const AUTH_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";

export async function getAuthJwt() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

    if (!cookieHeader) return null;

    try {
        const res = await fetch(`${AUTH_URL}/api/auth/token`, {
            headers: { Cookie: cookieHeader },
            cache: "no-store",
        });
        if (!res.ok) return null;
        const data = await res.json().catch(() => null);
        return data?.token || null;
    } catch (err) {
        console.error("getAuthJwt failed:", err);
        return null;
    }
}