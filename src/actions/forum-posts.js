"use server";

import { revalidatePath } from "next/cache";
import { getAuthJwt } from "@/lib/api-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
]);

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

/* ---------- Imgbb upload ---------- */

async function uploadToImgbb(file) {
    if (!IMGBB_API_KEY) {
        throw new Error("Server not configured for image uploads");
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const form = new FormData();
    form.append("key", IMGBB_API_KEY);
    form.append("image", base64);

    const res = await fetch(IMGBB_ENDPOINT, { method: "POST", body: form });
    if (!res.ok) throw new Error(`Imgbb upload failed (${res.status})`);

    const data = await res.json();
    if (!data?.success || !data?.data?.url) {
        throw new Error(data?.error?.message || "Imgbb upload returned no URL");
    }
    return data.data.url;
}

/* ---------- create ---------- */

export async function createForumPostAction(formData) {
    try {
        const title       = String(formData.get("title") || "").trim();
        const description = String(formData.get("description") || "").trim();
        const imageFile   = formData.get("imageFile");

        if (!title) return { ok: false, error: "Title is required" };
        if (!description) return { ok: false, error: "Description is required" };
        if (!imageFile || typeof imageFile === "string" || imageFile.size === 0) {
            return { ok: false, error: "Image is required" };
        }
        if (imageFile.size > MAX_IMAGE_BYTES) {
            return { ok: false, error: "Image must be 5MB or smaller" };
        }
        if (!ALLOWED_TYPES.has(imageFile.type)) {
            return { ok: false, error: "Image must be PNG, JPG, or WebP" };
        }

        let imageUrl;
        try {
            imageUrl = await uploadToImgbb(imageFile);
        } catch (err) {
            console.error("Imgbb upload failed:", err);
            return { ok: false, error: err.message || "Image upload failed" };
        }

        const res = await authedFetch("/api/forum-posts", {
            method: "POST",
            body: JSON.stringify({ title, description, image: imageUrl }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return {
                ok: false,
                error: data.error || `Request failed (${res.status})`,
                blocked: !!data.blocked,
            };
        }

        // Refresh both list views — admin moderation table and trainer's own
        // list. force-dynamic on those pages already prevents stale caching,
        // but this is belt-and-suspenders.
        revalidatePath("/dashboard/trainer/forum");
        revalidatePath("/dashboard/admin/forum");

        return { ok: true, post: data.post };
    } catch (err) {
        if (err.code === "NO_AUTH") return { ok: false, error: "Not authenticated" };
        console.error("createForumPostAction failed:", err);
        return { ok: false, error: "Failed to publish post" };
    }
}

/* ---------- list (trainer's own) ---------- */

export async function getMyForumPosts() {
    try {
        const res = await authedFetch("/api/forum-posts/me", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return {
                posts: [],
                error: data.error || `Request failed (${res.status})`,
            };
        }
        return { posts: data.posts || [], error: null };
    } catch (err) {
        if (err.code === "NO_AUTH") return { posts: [], error: "Not authenticated" };
        console.error("getMyForumPosts failed:", err);
        return { posts: [], error: "Failed to load posts" };
    }
}

/* ---------- list (all — admin moderation) ---------- */

/**
 * Returns ALL forum posts across all users, with author info attached.
 * Admin-only on the backend. Used by the Forum Post Manage page.
 */
export async function getAllForumPosts() {
    try {
        const res = await authedFetch("/api/forum-posts", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return {
                posts: [],
                error: data.error || `Request failed (${res.status})`,
            };
        }
        return { posts: data.posts || [], error: null };
    } catch (err) {
        if (err.code === "NO_AUTH") return { posts: [], error: "Not authenticated" };
        console.error("getAllForumPosts failed:", err);
        return { posts: [], error: "Failed to load posts" };
    }
}

/* ---------- delete ---------- */

export async function deleteForumPostAction(postId) {
    try {
        const res = await authedFetch(`/api/forum-posts/${postId}`, {
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

        revalidatePath("/dashboard/trainer/forum");
        revalidatePath("/dashboard/admin/forum");
        return { ok: true };
    } catch (err) {
        if (err.code === "NO_AUTH") return { ok: false, error: "Not authenticated" };
        console.error("deleteForumPostAction failed:", err);
        return { ok: false, error: "Failed to delete post" };
    }
}