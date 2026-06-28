"use server";

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
        cache: "no-store",
    });
}

 
export async function createCheckoutSessionAction(classId) {
    try {
        const res = await authedFetch("/api/checkout/session", {
            method: "POST",
            body: JSON.stringify({ classId }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            return {
                ok: false,
                error: data.error || `Request failed (${res.status})`,
                blocked: !!data.blocked,
                alreadyBooked: res.status === 409,
            };
        }

        return {
            ok: true,
            clientSecret: data.clientSecret,
            sessionId: data.sessionId,
        };
    } catch (err) {
        if (err.code === "NO_AUTH") {
            return { ok: false, error: "Please log in to continue" };
        }
        console.error("createCheckoutSessionAction failed:", err);
        return { ok: false, error: "Failed to start checkout" };
    }
}

 
export async function getCheckoutSessionStatus(sessionId) {
    try {
        const res = await authedFetch(`/api/checkout/session-status/${sessionId}`);

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            return {
                ok: false,
                error: data.error || `Request failed (${res.status})`,
            };
        }

        return { ok: true, ...data };
    } catch (err) {
        if (err.code === "NO_AUTH") {
            return { ok: false, error: "Please log in" };
        }
        console.error("getCheckoutSessionStatus failed:", err);
        return { ok: false, error: "Failed to verify session" };
    }
}