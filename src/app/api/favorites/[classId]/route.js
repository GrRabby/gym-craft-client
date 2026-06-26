import { NextResponse } from "next/server";

import { getAuthJwt } from "@/lib/api-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Thin proxy routes that forward favorite add/remove to Express with the
 * user's JWT attached. Used by ClassDetailsView's toggleFavorite, which
 * needs to avoid the server-action auto-refresh behavior that nudges
 * scroll position on the class details page.
 */

export async function POST(req, { params }) {
    try {
        const { classId } = await params;
        const jwt = await getAuthJwt();

        if (!jwt) {
            return NextResponse.json(
                { ok: false, error: "Not authenticated" },
                { status: 401 },
            );
        }

        const res = await fetch(`${API_URL}/api/favorites`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({ classId }),
        });

        const data = await res.json().catch(() => ({}));
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.error("POST /api/favorites/[classId] proxy failed:", err);
        return NextResponse.json(
            { ok: false, error: "Failed to add favorite" },
            { status: 500 },
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        const { classId } = await params;
        const jwt = await getAuthJwt();

        if (!jwt) {
            return NextResponse.json(
                { ok: false, error: "Not authenticated" },
                { status: 401 },
            );
        }

        const res = await fetch(`${API_URL}/api/favorites/${classId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${jwt}` },
        });

        const data = await res.json().catch(() => ({}));
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.error("DELETE /api/favorites/[classId] proxy failed:", err);
        return NextResponse.json(
            { ok: false, error: "Failed to remove favorite" },
            { status: 500 },
        );
    }
}