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

export async function getComments(postId) {
    try {
        const params = new URLSearchParams({ postId });
        const res = await authedFetch(`/api/comments?${params}`, { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return { comments: [], error: data.error || `Request failed (${res.status})` };
        }
        return { comments: data.comments || [], error: null };
    } catch (err) {
        if (err.code === "NO_AUTH") return { comments: [], error: "Not authenticated" };
        console.error("getComments failed:", err);
        return { comments: [], error: "Failed to load comments" };
    }
}

export async function addCommentAction({ postId, parentId = null, content }) {
    try {
        const res = await authedFetch("/api/comments", {
            method: "POST",
            body: JSON.stringify({ postId, parentId, content }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return {
                ok: false,
                error: data.error || `Request failed (${res.status})`,
                blocked: !!data.blocked,
            };
        }
        return { ok: true, comment: data.comment };
    } catch (err) {
        if (err.code === "NO_AUTH") return { ok: false, error: "Not authenticated" };
        console.error("addCommentAction failed:", err);
        return { ok: false, error: "Failed to post comment" };
    }
}

export async function editCommentAction(commentId, content) {
    try {
        const res = await authedFetch(`/api/comments/${commentId}`, {
            method: "PATCH",
            body: JSON.stringify({ content }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return {
                ok: false,
                error: data.error || `Request failed (${res.status})`,
                blocked: !!data.blocked,
            };
        }
        return { ok: true, comment: data.comment };
    } catch (err) {
        if (err.code === "NO_AUTH") return { ok: false, error: "Not authenticated" };
        console.error("editCommentAction failed:", err);
        return { ok: false, error: "Failed to edit comment" };
    }
}

 
export async function deleteCommentAction(commentId) {
    try {
        const res = await authedFetch(`/api/comments/${commentId}`, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return {
                ok: false,
                error: data.error || `Request failed (${res.status})`,
                blocked: !!data.blocked,
            };
        }
        return { ok: true, deletedIds: data.deletedIds || [commentId] };
    } catch (err) {
        if (err.code === "NO_AUTH") return { ok: false, error: "Not authenticated" };
        console.error("deleteCommentAction failed:", err);
        return { ok: false, error: "Failed to delete comment" };
    }
}