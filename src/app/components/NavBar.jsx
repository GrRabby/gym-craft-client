'use client'
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
    Home,
    Dumbbell,
    Users,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    ChevronDown,
} from "lucide-react";

const NAV_LINKS = [
    { label: "Home", href: "/", icon: Home },
    { label: "All Classes", href: "/classes", icon: Dumbbell },
    { label: "Community Forum", href: "/forum", icon: Users },
];

const DASHBOARD_BY_ROLE = {
    member: "/dashboard/member",
    trainer: "/dashboard/trainer",
    admin: "/dashboard/admin",
};

function LogoMark() {
    return (
        <svg viewBox="0 0 48 48" className="h-11 w-11 shrink-0" aria-hidden="true">
            <defs>
                <linearGradient id="gcGold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#F7E4A3" />
                    <stop offset="0.45" stopColor="#E8C667" />
                    <stop offset="1" stopColor="#C9962E" />
                </linearGradient>
            </defs>
            <path
                d="M40 13.5A18 18 0 1 0 40 34.5"
                fill="none"
                stroke="url(#gcGold)"
                strokeWidth="4.4"
                strokeLinecap="round"
            />
            <g fill="#FFFFFF">
                <rect x="15" y="22.4" width="18" height="3.2" rx="1.6" />
                <rect x="11.5" y="19" width="3" height="10" rx="1.2" />
                <rect x="33.5" y="19" width="3" height="10" rx="1.2" />
                <rect x="8.5" y="21" width="2.4" height="6" rx="1" fill="url(#gcGold)" />
                <rect x="37.1" y="21" width="2.4" height="6" rx="1" fill="url(#gcGold)" />
            </g>
        </svg>
    );
}

function Avatar({ user, size = 38 }) {
    const initials = (user?.name || "U")
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    if (user?.image) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={user.image}
                alt={user.name}
                className="rounded-full object-cover border-2 border-[#C9962E]/55 shrink-0"
                style={{ width: size, height: size }}
            />
        );
    }
    return (
        <span
            className="rounded-full inline-flex items-center justify-center border-2 border-[#C9962E]/55 shrink-0 bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] font-bold tracking-wider text-[14px]"
            style={{ width: size, height: size }}
        >
            {initials}
        </span>
    );
}

function UserMenu({ user, onLogout }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function onClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0.75 rounded-full"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-haspopup="true"
            >
                <Avatar user={user} />
                <ChevronDown
                    size={16}
                    className="text-[#b6ada0] transition-transform duration-200 ease-out"
                    style={{ transform: open ? "rotate(180deg)" : "none" }}
                />
            </button>

            {open && (
                <div
                    className="absolute right-0 top-[calc(100%+12px)] w-57.5 bg-[#0f0f0f] border border-[#C9962E]/25 rounded-xl p-2 shadow-[0_16px_40px_rgba(0,0,0,0.6)] animate-[gcDrop_0.16s_ease]"
                    role="menu"
                >
                    <div className="flex items-center gap-2.75 px-2 pt-2 pb-2.5">
                        <Avatar user={user} size={42} />
                        <div className="flex flex-col min-w-0 font-sans">
                            <span className="text-white font-medium text-sm truncate">{user.name}</span>
                            <span className="text-[#e8c667] text-[10px] tracking-widest uppercase font-bold">{user.role}</span>
                        </div>
                    </div>
                    <div className="h-px bg-[#C9962E]/18 my-0.5" />
                    <button
                        className="w-full flex items-center gap-2.5 p-2.5 bg-transparent border-none cursor-pointer rounded-lg text-[#cfc6b8] text-sm font-sans font-medium text-left transition-colors duration-150 hover:bg-[#C9962E]/10 hover:text-[#ff8585]"
                        onClick={() => {
                            setOpen(false);
                            onLogout?.();
                        }}
                        role="menuitem"
                    >
                        <LogOut size={16} />
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}

export function GymCraftNavbar({
    user = null,
    active = "/",
    onLogin = () => { },
    onLogout = () => { },
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const dashHref = user ? DASHBOARD_BY_ROLE[user.role] || "/dashboard" : null;

    return (
        <header className="sticky top-0 z-50 bg-linear-to-b from-[#0a0a0a] to-[#040404] backdrop-blur-xl saturate-160 border-b border-[#C9962E]/16 shadow-[0_10px_34px_rgba(0,0,0,0.5)] font-sans before:content-[''] before:absolute before:inset-0 before:z-0 before:pointer-events-none before:bg-[radial-gradient(460px_130px_at_16%_-20%,rgba(201,150,46,0.14),transparent_70%)] after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-px after:h-px after:z-1 after:bg-linear-to-r after:from-transparent after:via-[#F7E4A3]/55 after:to-transparent">
            {/* Import clean alternative heading font */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap');`}</style>

            <div className="relative z-10 max-w-310 mx-auto px-6 h-18.5 flex items-center gap-7">

                {/* Brand */}
                <Link href="/" className="flex items-center gap-3 no-underline shrink-0" aria-label="GymCraft home">
                    <LogoMark />
                    <span className="flex flex-col justify-center leading-none">
                        <div className="font-['Oswald'] font-bold text-2xl tracking-wider uppercase">
                            <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent mr-1">GYM</span>
                            <span className="text-white">CRAFT</span>
                        </div>
                        <span className="font-sans font-semibold text-[8px] tracking-[4px] text-[#7c7468] mt-1 uppercase hidden md:inline">
                            Craft Your Strength
                        </span>
                    </span>
                </Link>

                {/* Desktop links */}
                <nav className="hidden md:flex items-center gap-2 ml-auto" aria-label="Primary">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative isolate overflow-hidden px-4.5 py-2.25 no-underline font-['Oswald'] font-medium text-[15px] tracking-wider uppercase border border-[#C9962E]/30 bg-white/2.5 [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)] transition-all duration-220 before:content-[''] before:absolute before:inset-0 before:z-[-1] before:bg-linear-to-br before:from-[#F7E4A3] before:via-[#E8C667] before:to-[#C9962E] before:translate-y-[101%] before:transition-transform before:duration-340 before:ease-[cubic-bezier(0.2,0.85,0.25,1)] hover:text-[#1a1304] hover:border-transparent hover:before:translate-y-0 ${active === link.href
                                    ? "text-[#f7e4a3] border-[#C9962E]/55 bg-linear-to-b from-[#C9962E]/18 to-[#C9962E]/04 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.75 after:z-2 after:bg-linear-to-br after:from-[#F7E4A3] after:via-[#E8C667] after:to-[#C9962E] after:shadow-[0_0_12px_rgba(247,228,163,0.65)] hover:text-[#1a1304]"
                                    : "text-[#e7e0d2]"
                                }`}
                        >
                            <span>{link.label}</span>
                        </Link>
                    ))}
                    {user && (
                        <Link
                            href={dashHref}
                            className={`relative isolate overflow-hidden px-4.5 py-2.25 no-underline font-['Oswald'] font-medium text-[15px] tracking-wider uppercase border bg-white/2.5 [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)] transition-all duration-220 before:content-[''] before:absolute before:inset-0 before:z-[-1] before:bg-linear-to-br before:from-[#F7E4A3] before:via-[#E8C667] before:to-[#C9962E] before:translate-y-[101%] before:transition-transform before:duration-340 before:ease-[cubic-bezier(0.2,0.85,0.25,1)] hover:text-[#1a1304] hover:border-transparent hover:before:translate-y-0 text-[#e8c667] border-[#C9962E]/36 ${active === dashHref
                                    ? "text-[#f7e4a3] border-[#C9962E]/55 bg-linear-to-b from-[#C9962E]/18 to-[#C9962E]/04 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.75 after:z-2 after:bg-linear-to-br after:from-[#F7E4A3] after:via-[#E8C667] after:to-[#C9962E] after:shadow-[0_0_12px_rgba(247,228,163,0.65)] hover:text-[#1a1304]"
                                    : ""
                                }`}
                        >
                            <span>Dashboard</span>
                        </Link>
                    )}
                </nav>

                {/* Auth zone */}
                <div className="flex items-center gap-3.5 ml-auto md:ml-0">
                    {user ? (
                        <UserMenu user={user} onLogout={onLogout} />
                    ) : (
                        <Link
                            href = '/login'
                        >
                            <button
                                className="font-['Oswald'] font-semibold text-[15px] tracking-wider uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] border-none cursor-pointer py-2.5 px-6 [clip-path:polygon(9px_0,100%_0,100%_calc(100%-9px),calc(100%-9px)_100%,0_100%,0_9px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_18px_rgba(201,150,46,0.3)] transition-all active:translate-y-0 hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_7px_26px_rgba(201,150,46,0.45)]"
                                onClick={onLogin}
                            >
                                Log In
                            </button>
                        </Link>
                    )}

                    <button
                        className="flex md:hidden bg-transparent border-none text-[#e8c667] cursor-pointer p-1"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Toggle menu"
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <div className={`flex md:hidden flex-col gap-0.5 px-4 overflow-hidden bg-[#070707] transition-all duration-300 border-b ${mobileOpen ? "max-h-85 pt-2.5 pb-4 border-[#C9962E]/22" : "max-h-0 border-transparent"}`}>
                {NAV_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 p-3.25 no-underline font-['Oswald'] font-medium text-base tracking-wide uppercase rounded-lg transition-colors text-[#cfc6b8] hover:bg-[#C9962E]/10 hover:text-white ${active === link.href ? "bg-[#C9962E]/10 text-white!" : ""}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <Icon size={18} className="text-[#e8c667]" />
                            {link.label}
                        </Link>
                    );
                })}
                {user && (
                    <Link
                        href={dashHref}
                        className={`flex items-center gap-3 p-3.25 no-underline font-['Oswald'] font-medium text-base tracking-wide uppercase rounded-lg transition-colors text-[#cfc6b8] hover:bg-[#C9962E]/10 hover:text-white ${active === dashHref ? "bg-[#C9962E]/10 text-white!" : ""}`}
                        onClick={() => setMobileOpen(false)}
                    >
                        <LayoutDashboard size={18} className="text-[#e8c667]" />
                        Dashboard
                    </Link>
                )}
            </div>
        </header>
    );
}

export default GymCraftNavbar;