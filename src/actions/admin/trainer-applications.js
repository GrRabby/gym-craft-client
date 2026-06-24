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

export async function getPendingApplications() {
    const { error } = await requireAdmin();
    if (error) return { applications: [], error };

    try {
        const res = await authedFetch("/api/trainer-applications?status=pending");
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            return { applications: [], error: body?.error || `Request failed (${res.status})` };
        }
        const data = await res.json();
        return { applications: data, error: null };
    } catch (err) {
        console.error("getPendingApplications failed:", err);
        return { applications: [], error: "Failed to load applications." };
    }
}

export async function approveApplicationAction(applicationId, feedback = "") {
    const { error } = await requireAdmin();
    if (error) return { ok: false, error };

    try {
        const res = await authedFetch(`/api/trainer-applications/${applicationId}/approve`, {
            method: "PATCH",
            body: JSON.stringify({ feedback }),
        });
        let data = null;
        try { data = await res.json(); } catch {}
        if (!res.ok || !data?.ok)
            return { ok: false, error: data?.error || `Request failed (${res.status})` };

        revalidatePath("/dashboard/admin/trainers/applications");
        revalidatePath("/dashboard/admin/users");
        return { ok: true };
    } catch (err) {
        console.error("approve failed:", err);
        return { ok: false, error: "Failed to approve application." };
    }
}

export async function rejectApplicationAction(applicationId, feedback) {
    const { error } = await requireAdmin();
    if (error) return { ok: false, error };
    if (!feedback?.trim()) return { ok: false, error: "Feedback is required to reject." };

    try {
        const res = await authedFetch(`/api/trainer-applications/${applicationId}/reject`, {
            method: "PATCH",
            body: JSON.stringify({ feedback }),
        });
        let data = null;
        try { data = await res.json(); } catch {}
        if (!res.ok || !data?.ok)
            return { ok: false, error: data?.error || `Request failed (${res.status})` };

        revalidatePath("/dashboard/admin/trainers/applications");
        return { ok: true };
    } catch (err) {
        console.error("reject failed:", err);
        return { ok: false, error: "Failed to reject application." };
    }
}