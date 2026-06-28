"use server";

import { getAuthJwt } from "@/lib/api-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

 
export async function getMyBookings() {
    try {
        const jwt = await getAuthJwt();
        if (!jwt) {
            return { bookings: [], error: "Not authenticated" };
        }

        const res = await fetch(`${API_URL}/api/bookings/me`, {
            headers: { Authorization: `Bearer ${jwt}` },
            cache: "no-store", 
        });

        if (!res.ok) {
            const body = await res.json().catch(() => null);
            return {
                bookings: [],
                error: body?.error || `Request failed (${res.status})`,
            };
        }

        const data = await res.json();
        return { bookings: data.bookings || [], error: null };
    } catch (err) {
        console.error("getMyBookings failed:", err);
        return { bookings: [], error: "Failed to load bookings" };
    }
}