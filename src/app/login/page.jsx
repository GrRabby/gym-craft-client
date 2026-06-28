'use client'
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, Dumbbell, Flame } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { DumbbellSpinner } from "../components/DumbbellSpinner";


export default function LoginPage() {
    const searchParams = useSearchParams();
    const intended = searchParams.get("redirect") || "/";

    const [showPw, setShowPw] = useState(false);
    const [authError, setAuthError] = useState("");
    const [googleLoading, setGoogleLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ mode: "onTouched" });

    const onSubmit = async ({ email, password }) => {
        setAuthError("");
        const { error } = await authClient.signIn.email({ email, password });
        if (error) {
            setAuthError(error.message || "Login failed. Please try again.");
            return;
        }
        window.location.replace(intended);
    };

    const onGoogle = async () => {
        setAuthError("");
        setGoogleLoading(true);
        try {
            await authClient.signIn.social({ provider: "google", callbackURL: intended });
        } catch (e) {
            setAuthError("Google sign-in failed. Please try again.");
            setGoogleLoading(false);
        }
    };

    return (
        <main className="min-h-screen grid lg:grid-cols-2 bg-[#050505] font-sans text-white">

            <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 border-r border-[#C9962E]/20">

                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=80')" }}
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
                    <Link href={"/"} className="flex justify-center items-center gap-2">
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
                        The <span className="text-[#E8C667]">iron</span> never lies.
                        <br />
                        Show up.
                        <br />
                        Lift heavy.
                        <br />
                        <span className="text-[#E8C667]">Repeat.</span>
                    </p>
                    <div className="mt-6 flex items-center gap-3 text-[#8c8478] text-sm">
                        <div className="h-px w-12 bg-[#C9962E]/50" />
                        <span className="font-['Oswald'] tracking-[3px] uppercase text-xs">Craft Your Strength</span>
                    </div>
                </div>

                <div className="relative z-10 grid grid-cols-3 gap-6 pt-6 border-t border-[#C9962E]/20">
                    <Stat value="12K+" label="Members" />
                    <Stat value="240" label="Classes / Week" />
                    <Stat value="86" label="Certified Trainers" />
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
                        { }
                    </div>
                </div>

                <div className="relative z-10 w-full max-w-md mt-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px w-8 bg-[#E8C667]" />
                        <span className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[5px] uppercase">
                            Member Access
                        </span>
                    </div>
                    <h1 className="font-['Bebas_Neue'] text-5xl sm:text-6xl tracking-wide leading-none mb-2">
                        Step into <br />
                        the <span className="text-[#E8C667]">forge</span>.
                    </h1>
                    <p className="text-[#8c8478] text-sm mb-10">
                        Sign in to access your training, classes, and community.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Field
                            id="email"
                            label="Email"
                            icon={Mail}
                            error={errors.email?.message}
                        >
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
                        <Field
                            id="password"
                            label="Password"
                            icon={Lock}
                            error={errors.password?.message}
                            rightLink={
                                <Link href="/forgot-password" className="text-[#E8C667] text-xs hover:text-[#F7E4A3] no-underline tracking-wider uppercase font-['Oswald']">
                                    Forgot?
                                </Link>
                            }
                        >
                            <input
                                id="password"
                                type={showPw ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "At least 6 characters" },
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
                                        Locking in…
                                    </>
                                ) : (
                                    <>
                                        Enter the Gym
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
                            className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#C9962E]/30 hover:border-[#C9962E]/60 text-[#e7e0d2] font-['Oswald'] text-sm tracking-wider uppercase font-medium py-3.5 px-6 cursor-pointer transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {googleLoading ? <DumbbellSpinner size={16} /> : <GoogleIcon />}
                            Google
                        </button>
                    </form>

                    <p className="text-center text-[#8c8478] text-sm mt-8">
                        New to the gym?{" "}
                        <Link
                            href={`/register${intended !== "/" ? `?redirect=${encodeURIComponent(intended)}` : ""}`}
                            className="text-[#E8C667] hover:text-[#F7E4A3] font-medium no-underline font-['Oswald'] tracking-wider uppercase"
                        >
                            Claim your spot →
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}

 

function Field({ id, label, icon: Icon, error, rightLink, children }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label htmlFor={id} className="font-['Oswald'] text-[#cfc6b8] text-xs font-semibold tracking-[3px] uppercase">
                    {label}
                </label>
                {rightLink}
            </div>
            <div
                className={`relative bg-[#070707] border-t border-t-black/80 border-b border-b-[#2a2218] border-x border-x-[#1a1612] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] transition-colors focus-within:border-b-[#E8C667]/70 focus-within:shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_0_0_1px_rgba(232,198,103,0.25),0_0_18px_rgba(232,198,103,0.18)] ${error ? "border-b-[#ff5a5a]/70!" : ""}`}
            >
                <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c7468] pointer-events-none" />
                {children}
            </div>
            {error && <p className="text-[#ff8585] text-xs mt-1.5 font-medium">{error}</p>}
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

function Stat({ value, label }) {
    return (
        <div>
            <div className="font-['Bebas_Neue'] text-3xl text-[#E8C667] leading-none">{value}</div>
            <div className="font-['Oswald'] text-[10px] tracking-[2px] uppercase text-[#8c8478] mt-1">{label}</div>
        </div>
    );
}

function BrandMark({ small }) {
    const size = small ? "h-9 w-9" : "h-12 w-12";
    return (
        <svg viewBox="0 0 48 48" className={`${size} shrink-0`} aria-hidden="true">
            <defs>
                <linearGradient id="gcLoginGold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#F7E4A3" />
                    <stop offset="0.45" stopColor="#E8C667" />
                    <stop offset="1" stopColor="#C9962E" />
                </linearGradient>
            </defs>
            <path d="M40 13.5A18 18 0 1 0 40 34.5" fill="none" stroke="url(#gcLoginGold)" strokeWidth="4.4" strokeLinecap="round" />
            <g fill="#FFFFFF">
                <rect x="15" y="22.4" width="18" height="3.2" rx="1.6" />
                <rect x="11.5" y="19" width="3" height="10" rx="1.2" />
                <rect x="33.5" y="19" width="3" height="10" rx="1.2" />
                <rect x="8.5" y="21" width="2.4" height="6" rx="1" fill="url(#gcLoginGold)" />
                <rect x="37.1" y="21" width="2.4" height="6" rx="1" fill="url(#gcLoginGold)" />
            </g>
        </svg>
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