import { redirect } from "next/navigation";
import { Users, Dumbbell, CalendarCheck, ShieldCheck, Mail } from "lucide-react";

import { getCurrentUser } from "@/lib/permissions";
import { getAdminStats } from "@/actions/admin/admin";
import AdminCharts from "@/app/components/AdminCharts";

export const dynamic = "force-dynamic";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";

export default async function AdminOverviewPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    if (user.role !== "admin") redirect("/dashboard");

    const stats = await getAdminStats();
    const firstName = user.name?.split(" ")[0] || "Admin";

    return (
        <div className="flex-1 flex flex-col gap-8">
            {/* Header */}
            <header>
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-10 bg-[#E8C667]" />
                    <span className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[4px] uppercase">
                        Admin Tools
                    </span>
                </div>
                <h1 className="font-['Bebas_Neue'] text-4xl lg:text-5xl text-white tracking-wide leading-none">
                    Welcome back,{" "}
                    <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent">
                        {firstName}
                    </span>
                </h1>
                <p className="text-[#cfc6b8] text-sm mt-2">
                    Here&apos;s how the GymCraft platform is performing right now.
                </p>
            </header>

            {/* Error banner (rare — usually backend down) */}
            {stats.error && (
                <div className={`p-4 border border-[#ff5a5a]/30 bg-[#ff5a5a]/5 text-[#ff8585] ${CHAMFER_MD}`}>
                    <p className="font-['Oswald'] text-xs tracking-[3px] uppercase mb-1">Couldn&apos;t load stats</p>
                    <p className="text-sm">{stats.error}</p>
                </div>
            )}

            {/* Stat cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <StatCard
                    Icon={Users}
                    label="Total Users"
                    value={stats.totals.totalUsers}
                    accent="Across all roles"
                />
                <StatCard
                    Icon={Dumbbell}
                    label="Total Classes"
                    value={stats.totals.totalClasses}
                    accent="All statuses"
                />
                <StatCard
                    Icon={CalendarCheck}
                    label="Total Booked Classes"
                    value={stats.totals.totalBookings}
                    accent="Paid bookings"
                />
            </section>

            {/* Charts */}
            <section>
                <SectionHeading title="Platform Insights" />
                <AdminCharts
                    bookingsTimeSeries={stats.bookingsTimeSeries}
                    usersByRole={stats.usersByRole}
                    bookingsByCategory={stats.bookingsByCategory}
                />
            </section>

            {/* Profile */}
            <section>
                <SectionHeading title="Your Profile" />
                <ProfileCard user={user} />
            </section>
        </div>
    );
}

/* ---------- pieces ---------- */

function SectionHeading({ title }) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-6 bg-[#C9962E]/40" />
            <span className="font-['Oswald'] text-[#cfc6b8] text-xs font-semibold tracking-[3px] uppercase">
                {title}
            </span>
            <div className="h-px flex-1 bg-[#C9962E]/10" />
        </div>
    );
}

function StatCard({ Icon, label, value, accent }) {
    return (
        <div
            className={`relative bg-[#0a0a0a] border border-[#C9962E]/15 p-6 overflow-hidden ${CHAMFER_MD}`}
        >
            {/* Ambient corner glow */}
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#E8C667]/10 blur-3xl pointer-events-none" />

            <div className="relative flex items-start justify-between">
                <div className="min-w-0">
                    <p className="font-['Oswald'] text-[10px] tracking-[3px] uppercase text-[#7c7468] mb-2">
                        {label}
                    </p>
                    <p className="font-['Bebas_Neue'] text-5xl text-white leading-none">
                        {value.toLocaleString()}
                    </p>
                    {accent && (
                        <p className="text-[#5a5247] text-xs mt-2">{accent}</p>
                    )}
                </div>
                <div className="inline-flex items-center justify-center h-11 w-11 bg-[#C9962E]/10 border border-[#C9962E]/30 text-[#E8C667] shrink-0 [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]">
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
}

function ProfileCard({ user }) {
    const initials = (user.name || "A")
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className={`relative bg-[#0a0a0a] border border-[#C9962E]/15 p-6 overflow-hidden ${CHAMFER_MD}`}>
            <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#E8C667]/8 blur-3xl pointer-events-none" />

            <div className="relative flex items-center gap-5 flex-wrap">
                {/* Avatar */}
                {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={user.image}
                        alt=""
                        className="h-20 w-20 rounded-full object-cover border-2 border-[#C9962E]/40 shrink-0"
                    />
                ) : (
                    <span className="h-20 w-20 rounded-full inline-flex items-center justify-center bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] font-['Bebas_Neue'] text-3xl border-2 border-[#C9962E]/40 shrink-0">
                        {initials}
                    </span>
                )}

                {/* Identity */}
                <div className="min-w-0 flex-1">
                    <p className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none">
                        {user.name}
                    </p>
                    <p className="text-[#cfc6b8] text-sm mt-2 inline-flex items-center gap-1.5">
                        <Mail size={13} className="text-[#7c7468]" />
                        {user.email}
                    </p>
                </div>

                {/* Admin badge */}
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] font-['Oswald'] text-xs font-bold tracking-[3px] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.25)] [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]">
                    <ShieldCheck size={13} />
                    Admin
                </span>
            </div>
        </div>
    );
}