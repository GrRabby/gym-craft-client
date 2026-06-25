"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/permissions";
import { getAuthJwt } from "@/lib/api-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

export async function getAllClasses(status = "all") {
    const { error } = await requireAdmin();
    if (error) return { classes: [], error };

    try {
        const query = status && status !== "all" ? `?status=${status}` : "";
        const res = await authedFetch(`/api/classes${query}`);
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            return { classes: [], error: body?.error || `Request failed (${res.status})` };
        }
        return { classes: await res.json(), error: null };
    } catch (err) {
        console.error("getAllClasses failed:", err);
        return { classes: [], error: "Failed to load classes." };
    }
}

export async function approveClassAction(classId, feedback = "") {
    const { error } = await requireAdmin();
    if (error) return { ok: false, error };

    try {
        const res = await authedFetch(`/api/classes/${classId}/approve`, {
            method: "PATCH",
            body: JSON.stringify({ feedback }),
        });
        let data = null;
        try { data = await res.json(); } catch {}
        if (!res.ok || !data?.ok)
            return { ok: false, error: data?.error || `Request failed (${res.status})` };

        revalidatePath("/dashboard/admin/classes");
        return { ok: true };
    } catch (err) {
        console.error("approveClass failed:", err);
        return { ok: false, error: "Failed to approve class." };
    }
}

export async function rejectClassAction(classId, feedback) {
    const { error } = await requireAdmin();
    if (error) return { ok: false, error };
    if (!feedback?.trim()) return { ok: false, error: "Feedback is required to reject." };

    try {
        const res = await authedFetch(`/api/classes/${classId}/reject`, {
            method: "PATCH",
            body: JSON.stringify({ feedback }),
        });
        let data = null;
        try { data = await res.json(); } catch {}
        if (!res.ok || !data?.ok)
            return { ok: false, error: data?.error || `Request failed (${res.status})` };

        revalidatePath("/dashboard/admin/classes");
        return { ok: true };
    } catch (err) {
        console.error("rejectClass failed:", err);
        return { ok: false, error: "Failed to reject class." };
    }
}

export async function deleteClassAction(classId) {
    const { error } = await requireAdmin();
    if (error) return { ok: false, error };

    try {
        const res = await authedFetch(`/api/classes/${classId}`, { method: "DELETE" });
        let data = null;
        try { data = await res.json(); } catch {}
        if (!res.ok || !data?.ok)
            return { ok: false, error: data?.error || `Request failed (${res.status})` };

        revalidatePath("/dashboard/admin/classes");
        return { ok: true };
    } catch (err) {
        console.error("deleteClass failed:", err);
        return { ok: false, error: "Failed to delete class." };
    }
}