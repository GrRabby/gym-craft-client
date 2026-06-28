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

 
export async function getAllTrainers() {
    const { error } = await requireAdmin();
    if (error) return { trainers: [], error };

    try {
        const res = await authedFetch("/api/users?role=trainer");
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            return { trainers: [], error: body?.error || `Request failed (${res.status})` };
        }
        const trainers = await res.json();
        return { trainers, error: null };
    } catch (err) {
        console.error("getAllTrainers failed:", err);
        return { trainers: [], error: "Failed to load trainers." };
    }
}

 
export async function demoteTrainerAction(userId) {
    const { user: admin, error } = await requireAdmin();
    if (error) return { ok: false, error };
    if (admin.id === userId)
        return { ok: false, error: "You can't change your own role." };

    try {
        const res = await authedFetch(`/api/users/${userId}/role`, {
            method: "PATCH",
            body: JSON.stringify({ role: "member" }),
        });
        let data = null;
        try { data = await res.json(); } catch { }
        if (!res.ok || !data?.ok)
            return { ok: false, error: data?.error || `Request failed (${res.status})` };

        revalidatePath("/dashboard/admin/trainers");
        revalidatePath("/dashboard/admin/users");
        return { ok: true };
    } catch (err) {
        console.error("demoteTrainer failed:", err);
        return { ok: false, error: "Failed to demote trainer." };
    }
}