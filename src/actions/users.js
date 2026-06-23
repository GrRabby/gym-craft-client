"use server";

import { requireAdmin } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export async function getAllUsers() {
    const { error } = await requireAdmin();
    if (error) throw new Error(error);

    const res = await fetch(`${API_URL}/api/users`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
}

export async function blockUserAction(userId) {
    const { user: admin, error } = await requireAdmin();
    if (error) return { ok: false, error };
    if (admin.id === userId) return { ok: false, error: "You can't block yourself." };

    try {
        const res = await fetch(`${API_URL}/api/users/${userId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "blocked" }),
        });
        const data = await res.json();
        if (!data.ok) return { ok: false, error: data.error || "Failed to block user." };

        revalidatePath("/dashboard/admin/users");
        return { ok: true };
    } catch (err) {
        console.error("blockUser failed:", err);
        return { ok: false, error: "Failed to block user." };
    }
}

export async function unblockUserAction(userId) {
    const { error } = await requireAdmin();
    if (error) return { ok: false, error };

    try {
        const res = await fetch(`${API_URL}/api/users/${userId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "active" }),
        });
        const data = await res.json();
        if (!data.ok) return { ok: false, error: data.error || "Failed to unblock user." };

        revalidatePath("/dashboard/admin/users");
        return { ok: true };
    } catch (err) {
        console.error("unblockUser failed:", err);
        return { ok: false, error: "Failed to unblock user." };
    }
}

export async function makeAdminAction(userId) {
    const { user: admin, error } = await requireAdmin();
    if (error) return { ok: false, error };
    if (admin.id === userId) return { ok: false, error: "You can't change your own role." };

    try {
        const res = await fetch(`${API_URL}/api/users/${userId}/role`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: "admin" }),
        });
        const data = await res.json();
        if (!data.ok) return { ok: false, error: data.error || "Failed to promote user." };

        revalidatePath("/dashboard/admin/users");
        return { ok: true };
    } catch (err) {
        console.error("makeAdmin failed:", err);
        return { ok: false, error: "Failed to promote user." };
    }
}