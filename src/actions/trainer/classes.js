"use server";

import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { requireActiveUser } from "@/lib/permissions";
import { getAuthJwt } from "@/lib/api-token";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

async function uploadClassImage(file) {
    if (!file || file.size === 0) return null;
    if (file.size > MAX_BYTES)
        throw new Error("Image must be under 5 MB.");
    if (!ALLOWED_MIME.includes(file.type))
        throw new Error("Only PNG, JPG, or WEBP images allowed.");

    const buffer = Buffer.from(await file.arrayBuffer());

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "gymcraft/classes",
                resource_type: "image",
                transformation: [
                    { width: 1200, height: 720, crop: "fill", gravity: "auto" },
                    { quality: "auto:good" },
                ],
            },
            (err, result) => (err ? reject(err) : resolve(result.secure_url))
        );
        stream.end(buffer);
    });
}

/**
 * Receives FormData from the form, uploads the image to Cloudinary, then
 * forwards the class payload to Express. Returns { ok, error, class? }.
 */
export async function createClassAction(formData) {
    // Auth — trainer only, must be active (soft-block aware)
    const { user, error, blocked } = await requireActiveUser();
    if (error) return { ok: false, error, blocked };
    if (user.role !== "trainer")
        return { ok: false, error: "Only trainers can create classes." };

    // Pull fields off FormData
    const imageFile    = formData.get("image");
    const title        = String(formData.get("title") || "").trim();
    const description  = String(formData.get("description") || "").trim();
    const category     = String(formData.get("category") || "");
    const difficulty   = String(formData.get("difficulty") || "");
    const duration     = Number(formData.get("duration"));
    const price        = Number(formData.get("price"));
    const scheduleTime = String(formData.get("scheduleTime") || "");
    const scheduleDays = formData.getAll("scheduleDays").map(String);

    // Upload image to Cloudinary first
    let imageUrl;
    try {
        imageUrl = await uploadClassImage(imageFile);
    } catch (err) {
        return { ok: false, error: err.message };
    }

    // POST to Express
    try {
        const token = await getAuthJwt();
        const res = await fetch(`${API_URL}/api/classes`, {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
                title, description, image: imageUrl,
                category, difficulty, duration, price,
                scheduleDays, scheduleTime,
            }),
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

        revalidatePath("/dashboard/trainer/classes");
        return { ok: true, class: data.class };
    } catch (err) {
        console.error("createClassAction failed:", err);
        return { ok: false, error: "Failed to create class." };
    }
}

/**
 * Fetches all classes created by the currently logged-in trainer.
 */
export async function getTrainerClasses() {
    try {
        const token = await getAuthJwt();
        const res = await fetch(`${API_URL}/api/classes/trainer/my-classes`, {
            cache: "no-store",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        if (!res.ok) {
            const body = await res.json().catch(() => null);
            return { classes: [], error: body?.error || `Request failed (${res.status})` };
        }

        const data = await res.json();
        return { classes: data, error: null };
    } catch (err) {
        console.error("getTrainerClasses failed:", err);
        return { classes: [], error: "Failed to load classes." };
    }
}

/**
 * Updates a class's details. Uploads new image if provided.
 */
export async function updateClassAction(classId, formData) {
    const { user, error, blocked } = await requireActiveUser();
    if (error) return { ok: false, error, blocked };
    if (user.role !== "trainer")
        return { ok: false, error: "Only trainers can update classes." };

    const imageFile    = formData.get("image");
    const title        = String(formData.get("title") || "").trim();
    const description  = String(formData.get("description") || "").trim();
    const category     = String(formData.get("category") || "");
    const difficulty   = String(formData.get("difficulty") || "");
    const duration     = Number(formData.get("duration"));
    const price        = Number(formData.get("price"));
    const scheduleTime = String(formData.get("scheduleTime") || "");
    const scheduleDays = formData.getAll("scheduleDays").map(String);

    let imageUrl;
    if (imageFile && imageFile.size > 0) {
        try {
            imageUrl = await uploadClassImage(imageFile);
        } catch (err) {
            return { ok: false, error: err.message };
        }
    }

    try {
        const token = await getAuthJwt();
        const payload = {
            title, description,
            category, difficulty, duration, price,
            scheduleDays, scheduleTime,
        };

        if (imageUrl) {
            payload.image = imageUrl;
        }

        const res = await fetch(`${API_URL}/api/classes/trainer/${classId}`, {
            method: "PATCH",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
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

        revalidatePath("/dashboard/trainer/classes");
        return { ok: true, class: data.class };
    } catch (err) {
        console.error("updateClassAction failed:", err);
        return { ok: false, error: "Failed to update class." };
    }
}

/**
 * Permanently deletes a class.
 */
export async function deleteClassAction(classId) {
    const { user, error, blocked } = await requireActiveUser();
    if (error) return { ok: false, error, blocked };
    if (user.role !== "trainer")
        return { ok: false, error: "Only trainers can delete classes." };

    try {
        const token = await getAuthJwt();
        const res = await fetch(`${API_URL}/api/classes/trainer/${classId}`, {
            method: "DELETE",
            cache: "no-store",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
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

        revalidatePath("/dashboard/trainer/classes");
        return { ok: true };
    } catch (err) {
        console.error("deleteClassAction failed:", err);
        return { ok: false, error: "Failed to delete class." };
    }
}

/**
 * Fetches the attendee list for a class.
 */
export async function getClassAttendeesAction(classId) {
    const { user, error } = await requireActiveUser();
    if (error) return { ok: false, error };
    if (user.role !== "trainer")
        return { ok: false, error: "Only trainers can view attendees." };

    try {
        const token = await getAuthJwt();
        const res = await fetch(`${API_URL}/api/classes/trainer/${classId}/attendees`, {
            cache: "no-store",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        let data = null;
        try { data = await res.json(); } catch {}

        if (!res.ok || !data?.ok) {
            return {
                ok: false,
                error: data?.error || `Request failed (${res.status})`,
            };
        }

        return { ok: true, students: data.students };
    } catch (err) {
        console.error("getClassAttendeesAction failed:", err);
        return { ok: false, error: "Failed to load attendees." };
    }
}