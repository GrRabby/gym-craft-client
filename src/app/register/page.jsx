'use client'
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
    Eye, EyeOff, Mail, Lock, User, Upload, Camera, Check, X, Dumbbell, Flame,
} from "lucide-react";
import { registerUserAction } from "./register";
import { authClient } from "@/lib/auth-client";
import { DumbbellSpinner } from "../components/DumbbellSpinner";

const PW_RULES = {
    length: (v) => v.length >= 6,
    upper: (v) => /[A-Z]/.test(v),
    lower: (v) => /[a-z]/.test(v),
};

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const intended = searchParams.get("redirect") || "/";

    const [showPw, setShowPw] = useState(false);
    const [authError, setAuthError] = useState("");
    const [authErrorField, setAuthErrorField] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [imageError, setImageError] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const fileRef = useRef(null);
    const [googleLoading, setGoogleLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({ mode: "onTouched" });

    const pw = watch("password") || "";
    const checks = {
        length: PW_RULES.length(pw),
        upper: PW_RULES.upper(pw),
        lower: PW_RULES.lower(pw),
    };
    const passed = Object.values(checks).filter(Boolean).length;
    const handleFile = (file) => {
        setImageError("");
        if (!file) {
            setImageFile(null);
            setImagePreview("");
            return;
        }
        if (!file.type.startsWith("image/")) {
            setImageError("That doesn't look like an image.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setImageError("Image must be 2MB or smaller.");
            return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const onSubmit = async (values) => {
        setAuthError("");
        setAuthErrorField("");
        const fd = new FormData();
        fd.append("name", values.name);
        fd.append("email", values.email);
        fd.append("password", values.password);
        if (imageFile) fd.append("image", imageFile);

        const res = await registerUserAction(fd);

        if (!res?.ok) {
            setAuthError(res?.error || "Registration failed. Please try again.");
            setAuthErrorField(res?.field || "");
            return;
        }
        window.location.replace(intended);
    };

    const onGoogle = async () => {
        setAuthError("");
        setAuthErrorField("");
        setGoogleLoading(true);

        const { error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: intended,
            newUserCallbackURL: intended,
        });
        if (error) {
            setAuthError(error.message || "Could not start Google sign-up.");
            setGoogleLoading(false);
        }
    };

    return (
        <main className="min-h-screen grid lg:grid-cols-2 bg-[#050505] font-sans text-white">
            <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 border-r border-[#C9962E]/20">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1400&q=80')" }}
                />
                <div className="absolute inset-0 bg-linear-to-br from-[#0a0a0a]/95 via-[#0a0a0a]/80 to-[#1a1304]/90" />
                <div
                    className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(247,228,163,1) 1px, transparent 1px), linear-gradient(90deg, rgba(247,228,163,1) 1px, transparent 1px)",
                        backgroundSize: "44px 44px",
                    }}
                />
                <div className="absolute -left-20 top-1/3 w-[140%] h-32 bg-linear-to-r from-transparent via-[#C9962E]/15 to-transparent rotate-[-8deg] blur-2xl pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3">
                    <Link href={"/"} className="flex justify-center items-center gap-2 mb-5">
                        <img src="/LogoSmall.png" width={40} height={40}></img>
                        <div className="font-['Oswald'] font-bold text-2xl tracking-[2px] uppercase leading-none">
                            <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent">GYM</span>
                            <span className="text-white ml-1">CRAFT</span>
                        </div>
                    </Link>
                </div>

                <div className="relative z-10 max-w-md">
                    <Flame size={32} className="text-[#E8C667] mb-4" />
                    <p className="font-['Bebas_Neue'] text-5xl xl:text-6xl leading-[0.95] tracking-wide">
                        Day one.<br />
                        <span className="text-[#E8C667]">Rep one.</span><br />
                        Let&apos;s get<br />
                        to <span className="text-[#E8C667]">work</span>.
                    </p>
                    <div className="mt-6 flex items-center gap-3 text-[#8c8478] text-sm">
                        <div className="h-px w-12 bg-[#C9962E]/50" />
                        <span className="font-['Oswald'] tracking-[3px] uppercase text-xs">Craft Your Strength</span>
                    </div>
                </div>

                <div className="relative z-10 grid grid-cols-1 gap-3 pt-6 border-t border-[#C9962E]/20">
                    <Perk text="Book any of 240+ weekly classes" />
                    <Perk text="Follow trainers and join the community forum" />
                    <Perk text="Track every session, every rep" />
                </div>
            </aside>
            <section className="relative flex items-center justify-center p-6 sm:p-10 overflow-hidden">
                <div className="absolute inset-0 bg-[#0d0d0d]" />
                <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(45deg, rgba(247,228,163,0.4) 0 1px, transparent 1px 14px), repeating-linear-gradient(-45deg, rgba(247,228,163,0.4) 0 1px, transparent 1px 14px)",
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: "repeating-linear-gradient(0deg, rgba(247,228,163,0.6) 0 1px, transparent 1px 3px)",
                    }}
                />
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#E8C667]/60 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#C9962E]/40 to-transparent" />

                <div className="lg:hidden absolute top-6 left-6 right-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href={"/"} className="flex justify-center items-center gap-2 mb-5">
                            <img src="/LogoSmall.png" width={40} height={40}></img>
                            <div className="font-['Oswald'] font-bold text-2xl tracking-[2px] uppercase leading-none">
                                <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent">GYM</span>
                                <span className="text-white ml-1">CRAFT</span>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="relative z-10 w-full max-w-md py-12 lg:py-0">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px w-8 bg-[#E8C667]" />
                        <span className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[5px] uppercase">
                            New Member
                        </span>
                    </div>

                    <h1 className="font-['Bebas_Neue'] text-5xl sm:text-6xl tracking-wide leading-none mb-2">
                        Claim your <br />
                        <span className="text-[#E8C667]">spot</span> on the floor.
                    </h1>
                    <p className="text-[#8c8478] text-sm mb-8">
                        It takes a minute. The work takes longer.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block font-['Oswald'] text-[#cfc6b8] text-xs font-semibold tracking-[3px] uppercase mb-2">
                                Profile Image
                            </label>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => fileRef.current?.click()}
                                    className={`relative h-20 w-20 shrink-0 bg-[#070707] border-t border-t-black/80 border-x border-x-[#1a1612] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] overflow-hidden group cursor-pointer border-b ${authErrorField === "image" || imageError ? "border-b-[#ff5a5a]/70" : "border-b-[#2a2218]"}`}
                                    aria-label="Choose profile image"
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-[#5a5247]">
                                            <Camera size={22} />
                                        </div>
                                    )}
                                </button>
                                <div className="flex-1">
                                    <button
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#C9962E]/30 hover:border-[#C9962E]/60 text-[#e7e0d2] font-['Oswald'] text-xs tracking-[2px] uppercase font-medium py-2.5 px-4 cursor-pointer transition-colors"
                                    >
                                        <Upload size={14} />
                                        {imagePreview ? "Replace Image" : "Upload Image"}
                                    </button>
                                    <p className="text-[#5a5247] text-[11px] mt-1.5">PNG, JPG, or WEBP. Up to 2MB. Optional.</p>
                                </div>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    onChange={(e) => handleFile(e.target.files?.[0])}
                                />
                            </div>
                            {imageError && <p className="text-[#ff8585] text-xs mt-1.5">{imageError}</p>}
                        </div>

                        <Field id="name" label="Full Name" icon={User} error={errors.name?.message} serverHit={authErrorField === "name"}>
                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                placeholder="Rabby Ahmed"
                                {...register("name", {
                                    required: "Name is required",
                                    minLength: { value: 2, message: "At least 2 characters" },
                                })}
                                className="w-full bg-transparent text-white placeholder:text-[#4a4339] text-[15px] outline-none pl-9 pr-3 py-3"
                            />
                        </Field>

                        <Field id="email" label="Email" icon={Mail} error={errors.email?.message} serverHit={authErrorField === "email"}>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@gymcraft.app"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                                })}
                                className="w-full bg-transparent text-white placeholder:text-[#4a4339] text-[15px] outline-none pl-9 pr-3 py-3"
                            />
                        </Field>

                        <Field id="password" label="Password" icon={Lock} error={errors.password?.message} serverHit={authErrorField === "password"}>
                            <input
                                id="password"
                                type={showPw ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                {...register("password", {
                                    required: "Password is required",
                                    validate: {
                                        length: (v) => PW_RULES.length(v) || "At least 6 characters",
                                        upper: (v) => PW_RULES.upper(v) || "Include one uppercase letter",
                                        lower: (v) => PW_RULES.lower(v) || "Include one lowercase letter",
                                    },
                                })}
                                className="w-full bg-transparent text-white placeholder:text-[#4a4339] text-[15px] outline-none pl-9 pr-10 py-3"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw((v) => !v)}
                                aria-label={showPw ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7c7468] hover:text-[#E8C667] cursor-pointer"
                            >
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </Field>
                        {pw.length > 0 && (
                            <div>
                                <div className="flex gap-1.5 mb-2">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 flex-1 transition-colors ${i < passed
                                                ? passed === 3
                                                    ? "bg-linear-to-r from-[#F7E4A3] to-[#C9962E]"
                                                    : "bg-[#C9962E]/70"
                                                : "bg-[#1a1612]"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <ul className="grid grid-cols-1 gap-1">
                                    <Rule ok={checks.length} text="At least 6 characters" />
                                    <Rule ok={checks.upper} text="One uppercase letter (A–Z)" />
                                    <Rule ok={checks.lower} text="One lowercase letter (a–z)" />
                                </ul>
                            </div>
                        )}
                        {authError && (
                            <div className="flex items-start gap-2 bg-[#ff5a5a]/8 border-l-2 border-[#ff5a5a] text-[#ff8585] text-sm px-3.5 py-3">
                                <span className="font-['Oswald'] tracking-wider uppercase text-xs mt-px">Error:</span>
                                <span>{authError}</span>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full font-['Oswald'] font-bold text-base tracking-[3px] uppercase text-[#1a1304] py-4 px-6 bg-linear-to-b from-[#F7E4A3] via-[#E8C667] to-[#B8842B] border-t border-[#FBEFBF] border-b-2 border-b-[#7a5a1d] cursor-pointer transition-all hover:from-[#FBEFBF] hover:via-[#F0D27A] active:translate-y-px disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_6px_0_-2px_#5a4214,0_8px_24px_rgba(201,150,46,0.35)]"
                        >
                            <Rivet className="left-3 top-1/2 -translate-y-1/2" />
                            <Rivet className="right-3 top-1/2 -translate-y-1/2" />
                            <span className="flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <>
                                        <DumbbellSpinner size={16} />
                                        Forging your account…
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <Dumbbell size={16} className="transition-transform group-hover:translate-x-0.5" />
                                    </>
                                )}
                            </span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-linear-to-r from-transparent to-[#C9962E]/30" />
                            <span className="font-['Oswald'] text-[#5a5247] text-[11px] tracking-[4px] uppercase">
                                Or continue with
                            </span>
                            <div className="flex-1 h-px bg-linear-to-l from-transparent to-[#C9962E]/30" />
                        </div>
                        <button
                            type="button"
                            onClick={onGoogle}
                            disabled={googleLoading}
                            className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#C9962E]/30 hover:border-[#C9962E]/60 text-[#e7e0d2] font-['Oswald'] text-sm tracking-wider uppercase font-medium py-3.5 px-6 cursor-pointer transition-colors"
                        >
                            {googleLoading ? <DumbbellSpinner size={16} /> : <GoogleIcon />}
                            Google
                        </button>

                        <p className="text-[#5a5247] text-[11px] text-center leading-relaxed pt-1">
                            By creating an account you agree to GymCraft&apos;s{" "}
                            <Link href="/terms" className="text-[#8c8478] hover:text-[#E8C667]">Terms</Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-[#8c8478] hover:text-[#E8C667]">Privacy Policy</Link>.
                        </p>
                    </form>

                    <p className="text-center text-[#8c8478] text-sm mt-8">
                        Already a member?{" "}
                        <Link
                            href={`/login${intended !== "/" ? `?redirect=${encodeURIComponent(intended)}` : ""}`}
                            className="text-[#E8C667] hover:text-[#F7E4A3] font-medium no-underline font-['Oswald'] tracking-wider uppercase"
                        >
                            Log in →
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}


function Field({ id, label, icon: Icon, error, serverHit, children }) {
    const errored = error || serverHit;
    return (
        <div>
            <label htmlFor={id} className="block font-['Oswald'] text-[#cfc6b8] text-xs font-semibold tracking-[3px] uppercase mb-2">
                {label}
            </label>
            <div
                className={`relative bg-[#070707] border-t border-t-black/80 border-x border-x-[#1a1612] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] transition-colors focus-within:border-b-[#E8C667]/70 focus-within:shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_0_0_1px_rgba(232,198,103,0.25),0_0_18px_rgba(232,198,103,0.18)] border-b ${errored ? "border-b-[#ff5a5a]/70" : "border-b-[#2a2218]"}`}
            >
                <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c7468] pointer-events-none" />
                {children}
            </div>
            {error && <p className="text-[#ff8585] text-xs mt-1.5 font-medium">{error}</p>}
        </div>
    );
}

function Rule({ ok, text }) {
    return (
        <li className={`flex items-center gap-2 text-xs ${ok ? "text-[#E8C667]" : "text-[#7c7468]"}`}>
            {ok ? <Check size={13} /> : <X size={13} />}
            <span>{text}</span>
        </li>
    );
}

function Perk({ text }) {
    return (
        <div className="flex items-center gap-3 text-[#cfc6b8] text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E8C667] shrink-0" />
            {text}
        </div>
    );
}

function Rivet({ className = "" }) {
    return (
        <span
            className={`absolute h-2 w-2 rounded-full bg-[#7a5a1d] shadow-[inset_0_1px_0_#3a2a0e,0_1px_0_#FBEFBF] ${className}`}
            aria-hidden="true"
        />
    );
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 16.3 3 9.7 7.4 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36 26.7 37 24 37c-5.3 0-9.7-3.4-11.3-8L6 33.7C9.4 40.6 16.1 45 24 45z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.2 5.2C41 36 45 30.5 45 24c0-1.2-.1-2.3-.4-3.5z" />
        </svg>
    );
}