"use server";

import { getAuthJwt } from "@/lib/api-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

 
export async function getPublicClasses({
    page = 1, limit = 9, search = "", category = "",
} = {}) {
    try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (search) params.set("search", search);
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
            cache: "no-store", 
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
export async function getFeaturedClasses(limit = 6) {
    try {
        const res = await fetch(
            `${API_URL}/api/classes/public/featured?limit=${limit}`,
            { cache: "no-store" },
        );

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return {
                classes: [],
                error: data.error || `Request failed (${res.status})`,
            };
        }
        return { classes: data.classes || [], error: null };
    } catch (err) {
        console.error("getFeaturedClasses failed:", err);
        return { classes: [], error: "Failed to load featured classes" };
    }
}