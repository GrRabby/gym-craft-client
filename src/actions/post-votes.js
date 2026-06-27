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
 * Sends a vote to the backend. Returns fresh counts + the user's
 * current vote state so the client can sync optimistic UI.
 */
export async function votePostAction(postId, type) {
    try {
        const res = await authedFetch("/api/post-votes", {
            method: "POST",
            body: JSON.stringify({ postId, type }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return {
                ok: false,
                error: data.error || `Request failed (${res.status})`,
                blocked: !!data.blocked,
            };
        }
        return {
            ok: true,
            likes:    data.likes ?? 0,
            dislikes: data.dislikes ?? 0,
            userVote: data.userVote ?? null,
        };
    } catch (err) {
        if (err.code === "NO_AUTH") return { ok: false, error: "Not authenticated" };
        console.error("votePostAction failed:", err);
        return { ok: false, error: "Failed to record vote" };
    }
}