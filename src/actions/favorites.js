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

 
export async function getMyFavorites() {
    try {
        const res = await authedFetch("/api/favorites/me", {
            cache: "no-store",
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return {
                favorites: [],
                error: data.error || `Request failed (${res.status})`,
            };
        }
        return { favorites: data.favorites || [], error: null };
    } catch (err) {
        if (err.code === "NO_AUTH") {
            return { favorites: [], error: "Not authenticated" };
        }
        console.error("getMyFavorites failed:", err);
        return { favorites: [], error: "Failed to load favorites" };
    }
}

 
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