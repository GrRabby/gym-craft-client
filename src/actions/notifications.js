"use server";

import { getAuthJwt } from "@/lib/api-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function authedFetch(path, options = {}) {
    const jwt = await getAuthJwt();
    if (!jwt) throw Object.assign(new Error("Not authenticated"), { code: "NO_AUTH" });
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
 * Fetches the user's recent notifications + their unread count.
 * Called on mount + every 30 seconds + on tab focus.
 */
export async function getMyNotifications(limit = 20) {
    try {
        const res = await authedFetch(
            `/api/notifications/me?limit=${limit}`,
            { cache: "no-store" }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return {
                notifications: [],
                unreadCount: 0,
                error: data.error || `Request failed (${res.status})`,
            };
        }
        return {
            notifications: data.notifications || [],
            unreadCount:   data.unreadCount   || 0,
            error: null,
        };
    } catch (err) {
        if (err.code === "NO_AUTH") {
            return { notifications: [], unreadCount: 0, error: "Not authenticated" };
        }
        console.error("getMyNotifications failed:", err);
        return { notifications: [], unreadCount: 0, error: "Failed to load notifications" };
    }
}

export async function markNotificationReadAction(id) {
    try {
        const res = await authedFetch(`/api/notifications/${id}/read`, { method: "PATCH" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return { ok: false, error: data.error || `Request failed (${res.status})` };
        }
        return { ok: true };
    } catch (err) {
        if (err.code === "NO_AUTH") return { ok: false, error: "Not authenticated" };
        console.error("markNotificationReadAction failed:", err);
        return { ok: false, error: "Failed to mark as read" };
    }
}

export async function markAllNotificationsReadAction() {
    try {
        const res = await authedFetch(`/api/notifications/read-all`, { method: "PATCH" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return { ok: false, error: data.error || `Request failed (${res.status})` };
        }
        return { ok: true, updated: data.updated || 0 };
    } catch (err) {
        if (err.code === "NO_AUTH") return { ok: false, error: "Not authenticated" };
        console.error("markAllNotificationsReadAction failed:", err);
        return { ok: false, error: "Failed to mark all as read" };
    }
}

export async function deleteNotificationAction(id) {
    try {
        const res = await authedFetch(`/api/notifications/${id}`, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return { ok: false, error: data.error || `Request failed (${res.status})` };
        }
        return { ok: true };
    } catch (err) {
        if (err.code === "NO_AUTH") return { ok: false, error: "Not authenticated" };
        console.error("deleteNotificationAction failed:", err);
        return { ok: false, error: "Failed to delete notification" };
    }
}