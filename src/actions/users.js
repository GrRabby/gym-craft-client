"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/permissions";
import { getAuthJwt } from "@/lib/api-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Wraps fetch with the Better Auth JWT forwarded as Authorization header.
 * The token is signed by Better Auth and verified by Express via JWKS.
 */
async function authedFetch(path, opts = {}) {
    const token = await getAuthJwt();
    return fetch(`${API_URL}${path}`, {
        ...opts,
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...opts.headers,
        },
    });
}

export async function getAllUsers() {
    const { error } = await requireAdmin();
    if (error) throw new Error(error);

    const res = await authedFetch("/api/users");
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        return { users: [], error: body?.error || `Request failed (${res.status})` };
    }
    return { users: await res.json(), error: null };
}

export async function blockUserAction(userId) {
    const { user: admin, error } = await requireAdmin();
    if (error) return { ok: false, error };
    if (admin.id === userId) return { ok: false, error: "You can't block yourself." };

    try {
        const res = await authedFetch(`/api/users/${userId}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: "blocked" }),
        });
        const data = await res.json();
        if (!data.ok) return { ok: false, error: data.error || "Failed to block user." };

        revalidatePath("/dashboard/admin/users");
        return { ok: true };
    } catch (err) {
        console.error("blockUser failed:", err);
        return { ok: false, error: "Failed to block user." };
    }
}

export async function unblockUserAction(userId) {
    const { error } = await requireAdmin();
    if (error) return { ok: false, error };

    try {
        const res = await authedFetch(`/api/users/${userId}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: "active" }),
        });
        const data = await res.json();
        if (!data.ok) return { ok: false, error: data.error || "Failed to unblock user." };

        revalidatePath("/dashboard/admin/users");
        return { ok: true };
    } catch (err) {
        console.error("unblockUser failed:", err);
        return { ok: false, error: "Failed to unblock user." };
    }
}

export async function makeAdminAction(userId) {
    const { user: admin, error } = await requireAdmin();
    if (error) return { ok: false, error };
    if (admin.id === userId) return { ok: false, error: "You can't change your own role." };

    try {
        const res = await authedFetch(`/api/users/${userId}/role`, {
            method: "PATCH",
            body: JSON.stringify({ role: "admin" }),
        });
        const data = await res.json();
        if (!data.ok) return { ok: false, error: data.error || "Failed to promote user." };

        revalidatePath("/dashboard/admin/users");
        return { ok: true };
    } catch (err) {
        console.error("makeAdmin failed:", err);
        return { ok: false, error: "Failed to promote user." };
    }
}