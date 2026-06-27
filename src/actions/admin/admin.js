"use server";

import { getAuthJwt } from "@/lib/api-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function emptyStats() {
    return {
        totals: { totalUsers: 0, totalClasses: 0, totalBookings: 0 },
        usersByRole: [],
        bookingsTimeSeries: [],
        bookingsByCategory: [],
    };
}

export async function getAdminStats() {
    try {
        const jwt = await getAuthJwt();
        if (!jwt) {
            return { ...emptyStats(), error: "Not authenticated" };
        }

        const res = await fetch(`${API_URL}/api/admin/stats`, {
            headers: { Authorization: `Bearer ${jwt}` },
            cache: "no-store",
        });

        if (!res.ok) {
            const body = await res.json().catch(() => null);
            return {
                ...emptyStats(),
                error: body?.error || `Request failed (${res.status})`,
            };
        }

        const data = await res.json();
        return {
            totals:             data.totals             || emptyStats().totals,
            usersByRole:        data.usersByRole        || [],
            bookingsTimeSeries: data.bookingsTimeSeries || [],
            bookingsByCategory: data.bookingsByCategory || [],
            error: null,
        };
    } catch (err) {
        console.error("getAdminStats failed:", err);
        return { ...emptyStats(), error: "Failed to load stats" };
    }
}