"use server";

import { getAuthJwt } from "@/lib/api-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Returns headline stats for the current trainer:
 *   - classesCount: total classes created (any status)
 *   - studentsCount: total paid bookings across all their classes
 *
 * Used by the Trainer Overview dashboard.
 */
export async function getTrainerStats() {
    try {
        const jwt = await getAuthJwt();
        if (!jwt) {
            return {
                classesCount: 0,
                studentsCount: 0,
                error: "Not authenticated",
            };
        }

        const res = await fetch(`${API_URL}/api/classes/stats/me`, {
            headers: { Authorization: `Bearer ${jwt}` },
            cache: "no-store",
        });

        if (!res.ok) {
            const body = await res.json().catch(() => null);
            return {
                classesCount: 0,
                studentsCount: 0,
                error: body?.error || `Request failed (${res.status})`,
            };
        }

        const data = await res.json();
        return {
            classesCount:  data.classesCount  || 0,
            studentsCount: data.studentsCount || 0,
            error: null,
        };
    } catch (err) {
        console.error("getTrainerStats failed:", err);
        return {
            classesCount: 0,
            studentsCount: 0,
            error: "Failed to load stats",
        };
    }
}