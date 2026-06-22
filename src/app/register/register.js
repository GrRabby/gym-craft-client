"use server";
import { auth } from "@/lib/auth";
// TODO: import your real better-auth server instance
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

async function uploadAvatarFile(file) {
    if (!file || file.size === 0) return null;

    if (file.size > MAX_AVATAR_SIZE) {
        throw new Error("Image must be 2MB or smaller.");
    }
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
        throw new Error("Image must be a PNG, JPG, or WEBP.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: "gymcraft/avatars",
                resource_type: "image",
                transformation: [
                    { width: 400, height: 400, crop: "fill", gravity: "auto" },
                    { quality: "auto", fetch_format: "auto" },
                ],
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload failed:", error);
                    return reject(new Error("Image upload failed."));
                }
                resolve(result.secure_url);
            }
        ).end(buffer);
    });
}

export async function registerUserAction(formData) {
    try {
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim().toLowerCase();
        const password = String(formData.get("password") || "");
        const file = formData.get("image"); // File | null

        // Server-side validation — never trust the client.
        if (name.length < 2) return { ok: false, error: "Name is required.", field: "name" };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Enter a valid email.", field: "email" };
        if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters.", field: "password" };
        if (!/[A-Z]/.test(password)) return { ok: false, error: "Password must include one uppercase letter.", field: "password" };
        if (!/[a-z]/.test(password)) return { ok: false, error: "Password must include one lowercase letter.", field: "password" };

        let imageUrl = null;
        try {
            imageUrl = await uploadAvatarFile(file);
        } catch (e) {
            return { ok: false, error: e.message || "Image upload failed.", field: "image" };
        }

        try {
            await auth.api.signUpEmail({
                body: { name, email, password, image: imageUrl, role: "member" },
            });
        } catch (err) {
            const code = err?.body?.code;
            const message = err?.body?.message;
            const status = err?.status || err?.statusCode;

            if (code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" || status === 422 || status === "UNPROCESSABLE_ENTITY") {
                return { ok: false, error: message || "That email is already registered.", field: "email" };
            }
            if (code === "INVALID_EMAIL") {
                return { ok: false, error: message || "Enter a valid email.", field: "email" };
            }
            if (code?.startsWith?.("PASSWORD_")) {
                return { ok: false, error: message || "Password didn't meet the requirements.", field: "password" };
            }

            // Unknown Better Auth error — log it, surface its message if it has one.
            console.error("signUpEmail failed:", err);
            return { ok: false, error: message || "Sign-up failed. Please try again." };
        }
        return { ok: true };
    } catch (err) {
        return { ok: false, error: "Something went wrong. Please try again." };
    }
}