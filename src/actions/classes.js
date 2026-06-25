"use server";
 
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export async function getPublicClasses() {
    try {
        const res = await fetch(`${API_URL}/api/classes/public`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            return { classes: [], error: body?.error || `Request failed (${res.status})` };
        }
        return { classes: await res.json(), error: null };
    } catch (err) {
        console.error("getPublicClasses failed:", err);
        return { classes: [], error: "Failed to load classes." };
    }
}