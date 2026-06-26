"use server";

import { requireAdmin } from "@/lib/permissions";
import { getAuthJwt } from "@/lib/api-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Wraps fetch with the Better Auth JWT forwarded as Authorization header.
 */
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

export async function getAllTransactions() {
    const { error } = await requireAdmin();
    if (error) throw new Error(error);

    try {
        const res = await authedFetch("/api/bookings/all");
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            return { transactions: [], error: body?.error || `Request failed (${res.status})` };
        }
        const data = await res.json();
        return { transactions: data.transactions || [], error: null };
    } catch (err) {
        console.error("getAllTransactions failed:", err);
        return { transactions: [], error: "Failed to load transactions" };
    }
}
