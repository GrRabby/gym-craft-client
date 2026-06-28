'use client'
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    CalendarCheck,
    CalendarPlus,
    CalendarDays,
    Award,
    Heart,
    Users,
    UserPlus,
    BadgeCheck,
    Dumbbell,
    MessageSquare,
    MessageSquarePlus,
    MessagesSquare,
    Receipt,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { DumbbellSpinner } from "./DumbbellSpinner";

const ROLE_LABELS = {
    member:  "Member",
    trainer: "Trainer",
    admin:   "Admin",
};

const SECTION_LABELS = {
    member:  "Your Area",
    trainer: "Coach Tools",
    admin:   "Admin Tools",
};
const NAV_BY_ROLE = {
    member: [
        { label: "Overview",         href: "/dashboard/member",           icon: LayoutDashboard, exact: true },
        { label: "Booked Classes",   href: "/dashboard/member/bookings",  icon: CalendarCheck },
        { label: "Apply as Trainer", href: "/dashboard/member/apply",     icon: Award },
        { label: "Favorite Classes", href: "/dashboard/member/favorites", icon: Heart },
    ],
    trainer: [
        { label: "Overview",       href: "/dashboard/trainer",             icon: LayoutDashboard, exact: true },
        { label: "Add Class",      href: "/dashboard/trainer/classes/new", icon: CalendarPlus },
        { label: "My Classes",     href: "/dashboard/trainer/classes",     icon: CalendarDays,    exact: true },
        { label: "Add Forum Post", href: "/dashboard/trainer/forum/new",   icon: MessageSquarePlus },
        { label: "My Forum Posts", href: "/dashboard/trainer/forum",       icon: MessageSquare,   exact: true },
    ],
    admin: [
        { label: "Overview",          href: "/dashboard/admin",                       icon: LayoutDashboard, exact: true },
        { label: "Manage Users",      href: "/dashboard/admin/users",                 icon: Users },
        { label: "Applied Trainers",  href: "/dashboard/admin/trainers/applications", icon: UserPlus },
        { label: "Manage Trainers",   href: "/dashboard/admin/trainers",              icon: BadgeCheck,      exact: true },
        { label: "Manage Classes",    href: "/dashboard/admin/classes",               icon: Dumbbell },
        { label: "Add Forum Post",    href: "/dashboard/admin/forum/new",             icon: MessageSquarePlus },
        { label: "Forum Post Manage", href: "/dashboard/admin/forum",                 icon: MessagesSquare,  exact: true },
        { label: "Transactions",      href: "/dashboard/admin/transactions",          icon: Receipt },
    ],
};

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const { data: session } = authClient.useSession();
    const user = session?.user;

    const role = ROLE_LABELS[user?.role] ? user.role : "member";
    const navLinks = NAV_BY_ROLE[role];

    const isActive = (href, exact = false) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

    const handleLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    router.refresh();
                },
                onError: () => setLoggingOut(false),
            },
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open dashboard menu"
                className="lg:hidden fixed top-4 left-4 z-40 h-11 w-11 flex items-center justify-center bg-[#0d0d0d] border border-[#C9962E]/40 text-[#E8C667] shadow-[0_8px_24px_rgba(0,0,0,0.6)] [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]"
            >
                <Menu size={20} />
            </button>

            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                    className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col
                    bg-[#070707] border-r border-[#C9962E]/20
                    transition-transform duration-300 ease-out
                    lg:translate-x-0
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                <div
                    className="absolute inset-0 opacity-[0.035] pointer-events-none [background-image:repeating-linear-gradient(0deg,rgba(247,228,163,0.6)_0_1px,transparent_1px_3px)]"
                    aria-hidden="true"
                />
                <div className="absolute top-0 left-0 right-0 h-32 bg-[radial-gradient(closest-side,rgba(201,150,46,0.18),transparent)] pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-[#C9962E]/40 to-transparent pointer-events-none" />

                <div className="relative px-6 pt-6 pb-5 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="GymCraft home">
                        <img src="/Logo small.png" width={45} height={45}></img>
                        <div className="flex flex-col leading-none">
                            <span className="font-['Oswald'] font-bold text-lg tracking-wider uppercase">
                                <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent mr-0.5">GYM</span>
                                <span className="text-white">CRAFT</span>
                            </span>
                            <span className="font-['Oswald'] text-[9px] tracking-[3px] uppercase text-[#7c7468] mt-1">
                                {ROLE_LABELS[role]} Dashboard
                            </span>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close menu"
                        className="lg:hidden text-[#7c7468] hover:text-white cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="relative px-6 mt-4 mb-3 flex items-center gap-2.5">
                    <div className="h-px w-6 bg-[#E8C667]" />
                    <span className="font-['Oswald'] text-[#E8C667] text-[10px] font-semibold tracking-[3px] uppercase">
                        {SECTION_LABELS[role]}
                    </span>
                </div>

                <nav className="relative flex flex-col gap-1 px-3 pb-4 overflow-y-auto" aria-label={`${ROLE_LABELS[role]} dashboard`}>
                    {navLinks.map((link) => (
                        <NavItem
                            key={link.href}
                            {...link}
                            active={isActive(link.href, link.exact)}
                            onNavigate={() => setMobileOpen(false)}
                        />
                    ))}
                </nav>

                <div className="relative mt-auto p-4 border-t border-[#C9962E]/15">
                    {user && (
                        <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-[#C9962E]/15 [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]">
                            <Avatar user={user} />
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{user.name}</p>
                                <p className="text-[#E8C667] text-[10px] uppercase tracking-[2px] font-['Oswald'] font-semibold">
                                    {ROLE_LABELS[user.role] || "Member"}
                                </p>
                            </div>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="mt-3 group w-full flex items-center gap-2.5 px-3 py-2.5 text-[#8c8478] hover:text-[#ff8585] hover:bg-[#ff5a5a]/5 font-['Oswald'] text-xs tracking-[2px] uppercase font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loggingOut ? <DumbbellSpinner size={14} /> : <LogOut size={14} />}
                        {loggingOut ? "Logging out…" : "Log out"}
                    </button>
                </div>
            </aside>
        </>
    );
}

function NavItem({ href, label, icon: Icon, active, onNavigate }) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`
                relative group flex items-center gap-3 pl-4 pr-3 py-2.5 no-underline
                transition-all duration-200
                ${active
                    ? "bg-linear-to-r from-[#C9962E]/15 via-[#C9962E]/5 to-transparent"
                    : "hover:bg-white/[0.02]"
                }
            `}
        >
            <span
                aria-hidden="true"
                className={`
                    absolute left-0 top-1.5 bottom-1.5 w-[3px]
                    bg-linear-to-b from-[#F7E4A3] via-[#E8C667] to-[#C9962E]
                    shadow-[0_0_10px_rgba(232,198,103,0.5)]
                    transition-opacity duration-200
                    ${active ? "opacity-100" : "opacity-0 group-hover:opacity-40"}
                `}
            />

            <span
                className={`
                    inline-flex items-center justify-center h-9 w-9 shrink-0 transition-all duration-200
                    [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]
                    ${active
                        ? "bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_14px_rgba(201,150,46,0.35)]"
                        : "bg-[#0f0f0f] border border-[#C9962E]/20 text-[#cfc6b8] group-hover:border-[#C9962E]/50 group-hover:text-[#E8C667]"
                    }
                `}
            >
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
            </span>

            <span
                className={`
                    flex-1 font-['Oswald'] font-medium text-[13px] tracking-[1.5px] uppercase transition-colors
                    ${active ? "text-white" : "text-[#a8a094] group-hover:text-white"}
                `}
            >
                {label}
            </span>

            <ChevronRight
                size={14}
                className={`shrink-0 transition-all duration-200 ${
                    active
                        ? "text-[#E8C667] opacity-100"
                        : "text-[#7c7468] opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0"
                }`}
            />
        </Link>
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
            className="rounded-full inline-flex items-center justify-center border-2 border-[#C9962E]/55 shrink-0 bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] font-bold tracking-wider text-[13px]"
            style={{ width: size, height: size }}
        >
            {initials}
        </span>
    );
}