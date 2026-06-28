import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Calendar, Users, Mail, BadgeCheck, ArrowRight,
} from "lucide-react";

import { getCurrentUser } from "@/lib/permissions";
import { getTrainerStats } from "@/actions/trainer/trainer";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";
const CHAMFER_XS = "[clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]";

export const dynamic = "force-dynamic";

export default async function TrainerOverviewPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    const { classesCount, studentsCount } = await getTrainerStats();

    const firstName = user.name?.split(" ")[0] || user.name || "Coach";

    return (
        <div className="flex-1 flex flex-col gap-8">
            { }
            <header>
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-10 bg-[#E8C667]" />
                    <span className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[4px] uppercase">
                        Coach Tools
                    </span>
                </div>
                <h1 className="font-['Bebas_Neue'] text-4xl lg:text-5xl text-white tracking-wide leading-none">
                    Welcome back,{" "}
                    <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent">
                        Coach {firstName}
                    </span>
                </h1>
                <p className="text-[#cfc6b8] text-sm mt-2">
                    Your coaching activity at a glance.
                </p>
            </header>

            { }
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard
                    href="/dashboard/trainer/classes"
                    Icon={Calendar}
                    label="Classes Created"
                    value={classesCount}
                    sublabel={
                        classesCount === 1
                            ? "class on the roster"
                            : "classes on the roster"
                    }
                />
                <StatCard
                    Icon={Users}
                    label="Students Enrolled"
                    value={studentsCount}
                    sublabel="across all your classes"
                />
            </section>

            { }
            <section>
                <SectionHeader>Profile</SectionHeader>
                <ProfileCard user={user} />
            </section>
        </div>
    );
}

 

function SectionHeader({ children }) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#E8C667]" />
            <h2 className="font-['Oswald'] text-[11px] font-semibold tracking-[4px] uppercase text-[#E8C667]">
                {children}
            </h2>
        </div>
    );
}

 

function StatCard({ href, Icon, label, value, sublabel }) {
    
    const body = (
        <>
            <div className="absolute top-0 right-0 h-32 w-32 bg-[radial-gradient(circle_at_top_right,rgba(232,198,103,0.08),transparent_60%)] pointer-events-none" />

            <div className="relative flex items-center gap-5">
                <div
                    className={`flex items-center justify-center h-14 w-14 bg-[#C9962E]/10 border border-[#C9962E]/30 shrink-0 ${CHAMFER_SM}`}
                >
                    <Icon size={24} className="text-[#E8C667]" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-['Oswald'] text-[10px] font-semibold tracking-[3px] uppercase text-[#7c7468]">
                        {label}
                    </p>
                    <p className="font-['Bebas_Neue'] text-5xl bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent leading-none mt-1">
                        {value}
                    </p>
                    <p className="text-[#7c7468] text-xs mt-1.5">{sublabel}</p>
                </div>

                {href && (
                    <ArrowRight
                        size={16}
                        className="text-[#7c7468] group-hover:text-[#E8C667] group-hover:translate-x-0.5 transition-all shrink-0"
                    />
                )}
            </div>
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                className={`group relative bg-[#0a0a0a] border border-[#C9962E]/20 hover:border-[#E8C667]/50 transition-all hover:-translate-y-0.5 p-6 ${CHAMFER_MD} no-underline overflow-hidden`}
            >
                {body}
            </Link>
        );
    }

    return (
        <div
            className={`relative bg-[#0a0a0a] border border-[#C9962E]/20 p-6 ${CHAMFER_MD} overflow-hidden`}
        >
            {body}
        </div>
    );
}

 

function ProfileCard({ user }) {
    return (
        <div className={`bg-[#0a0a0a] border border-[#C9962E]/15 p-6 lg:p-8 ${CHAMFER_MD}`}>
            <div className="flex items-start gap-5 flex-wrap">
                <Avatar user={user} size={96} />
                <div className="flex-1 min-w-[200px]">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="min-w-0">
                            <h3 className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none">
                                {user.name}
                            </h3>
                            <p className="text-[#cfc6b8] text-sm mt-2.5 inline-flex items-center gap-1.5">
                                <Mail size={13} className="text-[#7c7468]" />
                                {user.email}
                            </p>
                        </div>
                        <TrainerBadge />
                    </div>
                </div>
            </div>
        </div>
    );
}

function TrainerBadge() {
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] font-['Oswald'] text-[10px] font-bold tracking-[2px] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] shrink-0 ${CHAMFER_XS}`}
        >
            <BadgeCheck size={11} />
            Trainer
        </span>
    );
}

 

function Avatar({ user, size = 96 }) {
    if (user?.image) {
        
        return (
            <img
                src={user.image}
                alt=""
                className="rounded-full object-cover border-2 border-[#C9962E]/40 shrink-0"
                style={{ width: size, height: size }}
            />
        );
    }
    const initials = (user?.name || "C")
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    return (
        <span
            className="rounded-full inline-flex items-center justify-center bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] font-bold border-2 border-[#C9962E]/40 shrink-0"
            style={{ width: size, height: size, fontSize: size * 0.32 }}
        >
            {initials}
        </span>
    );
}