"use server";

import { revalidatePath } from "next/cache";
import { getAuthJwt } from "@/lib/api-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function authedFetch(path, options = {}) {
    const jwt = await getAuthJwt();
    if (!jwt) {
        throw Object.assign(new Error("Not authenticated"), { code: "NO_AUTH" });
    }
    return fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            Authorization: `Bearer ${jwt}`,
        },
    });
}

/**
 * Adds the class to the user's favorites. Backend uses upsert so a duplicate
 * add is silently a no-op rather than an error — we still return ok:true.
 */
export async function addFavoriteAction(classId) {
    try {
        const res = await authedFetch("/api/favorites", {
            method: "POST",
            body: JSON.stringify({ classId }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return {
                ok: false,
                error: data.error || `Request failed (${res.status})`,
                blocked: !!data.blocked,
            };
        }

        // Refresh the favorites dashboard view (when it exists). Harmless
        // if the page hasn't been built yet — Next.js silently no-ops.
        revalidatePath("/dashboard/member/favorites");

        return { ok: true };
    } catch (err) {
        if (err.code === "NO_AUTH") {
            return { ok: false, error: "Please log in to add favorites" };
        }
        console.error("addFavoriteAction failed:", err);
        return { ok: false, error: "Failed to add favorite" };
    }
}

/**
 * Removes the class from favorites. Idempotent on the backend.
 */
export async function removeFavoriteAction(classId) {
    try {
        const res = await authedFetch(`/api/favorites/${classId}`, {
            method: "DELETE",
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return {
                ok: false,
                error: data.error || `Request failed (${res.status})`,
                blocked: !!data.blocked,
            };
        }

        revalidatePath("/dashboard/member/favorites");

        return { ok: true };
    } catch (err) {
        if (err.code === "NO_AUTH") {
            return { ok: false, error: "Please log in" };
        }
        console.error("removeFavoriteAction failed:", err);
        return { ok: false, error: "Failed to remove favorite" };
    }
}