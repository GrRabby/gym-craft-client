import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getCurrentUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user || null;
}


export async function requireAdmin() {
    const user = await getCurrentUser();
    if (!user) return { user: null, error: "Not authenticated" };
    if (user.role !== "admin") return { user, error: "Admin access required" };
    return { user, error: null };
}

export async function requireActiveUser() {
    const user = await getCurrentUser();
    if (!user) return { user: null, error: "Not authenticated" };
    if (user.status === "blocked") {
        return { user, error: "Action restricted by Admin", blocked: true };
    }
    return { user, error: null };
}