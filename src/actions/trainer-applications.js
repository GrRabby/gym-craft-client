"use server";

import { revalidatePath } from "next/cache";
import { getAuthJwt } from "@/lib/api-token";
import { getCurrentUser } from "@/lib/permissions";

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

 
export async function getMyTrainerApplication() {
    const user = await getCurrentUser();
    if (!user) return { application: null, error: "Not authenticated" };

    try {
        const res = await authedFetch("/api/trainer-applications/me");
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            return { application: null, error: body?.error || `Request failed (${res.status})` };
        }
        const data = await res.json();
        return { application: data.application, error: null };
    } catch (err) {
        console.error("getMyTrainerApplication failed:", err);
        return { application: null, error: "Failed to load application." };
    }
}

 
export async function applyAsTrainerAction({ experience, specialty }) {
    try {
        const res = await authedFetch("/api/trainer-applications", {
            method: "POST",
            body: JSON.stringify({ experience, specialty }),
        });

        let data = null;
        try { data = await res.json(); } catch {}

        if (!res.ok || !data?.ok) {
            return {
                ok: false,
                error: data?.error || `Request failed (${res.status})`,
                blocked: data?.blocked,
            };
        }

        revalidatePath("/dashboard/member/apply");
        return { ok: true, application: data.application };
    } catch (err) {
        console.error("applyAsTrainerAction failed:", err);
        return { ok: false, error: "Failed to submit application." };
    }
}