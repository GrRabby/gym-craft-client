"use server";

import { getAuthJwt } from "@/lib/api-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Public — no auth needed. Forwards pagination + filter params to Express.
 */
export async function getPublicClasses({
    page = 1, limit = 9, search = "", category = "",
} = {}) {
    try {
        const params = new URLSearchParams();
        params.set("page",  String(page));
        params.set("limit", String(limit));
        if (search)   params.set("search",   search);
        if (category) params.set("category", category);

        const res = await fetch(`${API_URL}/api/classes/public?${params}`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            const body = await res.json().catch(() => null);
            return {
                classes: [], page: 1, totalPages: 1, total: 0,
                error: body?.error || `Request failed (${res.status})`,
            };
        }
        const data = await res.json();
        return { ...data, error: null };
    } catch (err) {
        console.error("getPublicClasses failed:", err);
        return {
            classes: [], page: 1, totalPages: 1, total: 0,
            error: "Failed to load classes.",
        };
    }
}

/**
 * Auth-required. Returns the class + booking/favorite status for the
 * currently logged-in user in a single round trip.
 *
 * Caller (the page) is expected to redirect to /login before calling this
 * when there's no session. If called without auth, getAuthJwt() will throw
 * or return null and the request will 401 — we surface that as an error.
 */
export async function getClassDetails(classId) {
    try {
        const jwt = await getAuthJwt();
        if (!jwt) {
            return {
                class: null, isBooked: false, isFavorited: false,
                error: "Not authenticated",
            };
        }

        const res = await fetch(`${API_URL}/api/classes/${classId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
            cache: "no-store", // per-user data — never cache
        });

        if (!res.ok) {
            const body = await res.json().catch(() => null);
            return {
                class: null, isBooked: false, isFavorited: false,
                error: body?.error || `Request failed (${res.status})`,
            };
        }

        const data = await res.json();
        return { ...data, error: null };
    } catch (err) {
        console.error("getClassDetails failed:", err);
        return {
            class: null, isBooked: false, isFavorited: false,
            error: "Failed to load class",
        };
    }
}