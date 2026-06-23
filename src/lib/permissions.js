import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getCurrentUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user || null;
}

/** Gate: only admins past this point. */
export async function requireAdmin() {
    const user = await getCurrentUser();
    if (!user) return { user: null, error: "Not authenticated" };
    if (user.role !== "admin") return { user, error: "Admin access required" };
    return { user, error: null };
}

/**
 * Gate for state-changing actions. Returns blocked: true distinctly so
 * the UI can show "Action restricted by Admin" instead of a generic error.
 * Use at the top of: bookClassAction, applyTrainerAction, postCommentAction.
 */
export async function requireActiveUser() {
    const user = await getCurrentUser();
    if (!user) return { user: null, error: "Not authenticated" };
    if (user.status === "blocked") {
        return { user, error: "Action restricted by Admin", blocked: true };
    }
    return { user, error: null };
}