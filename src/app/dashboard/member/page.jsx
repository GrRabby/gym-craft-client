import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Calendar, Heart, Mail, BadgeCheck, AlertCircle, Clock,
    ArrowRight, X, Dumbbell,
} from "lucide-react";

import { getCurrentUser } from "@/lib/permissions";
import { getMyBookings } from "@/actions/bookings";
import { getMyFavorites } from "@/actions/favorites";
import { getMyTrainerApplication } from "@/actions/trainer-applications";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";
const CHAMFER_XS = "[clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]";

export const dynamic = "force-dynamic";

export default async function MemberOverviewPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    const [bookingsResult, favoritesResult, appResult] = await Promise.all([
        getMyBookings(),
        getMyFavorites(),
        getMyTrainerApplication(),
    ]);

    const bookingsCount  = bookingsResult.bookings?.length || 0;
    const favoritesCount = favoritesResult.favorites?.length || 0;
    const application    = appResult.application || null;

    const firstName = user.name?.split(" ")[0] || user.name || "there";

    return (
        <div className="flex-1 flex flex-col gap-8">
            <header>
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-10 bg-[#E8C667]" />
                    <span className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[4px] uppercase">
                        Your Area
                    </span>
                </div>
                <h1 className="font-['Bebas_Neue'] text-4xl lg:text-5xl text-white tracking-wide leading-none">
                    Welcome back,{" "}
                    <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent">
                        {firstName}
                    </span>
                </h1>
                <p className="text-[#cfc6b8] text-sm mt-2">
                    Here&apos;s your training summary at a glance.
                </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard
                    href="/dashboard/member/bookings"
                    Icon={Calendar}
                    label="Booked Classes"
                    value={bookingsCount}
                    sublabel={bookingsCount === 1 ? "class locked in" : "classes locked in"}
                />
                <StatCard
                    href="/dashboard/member/favorites"
                    Icon={Heart}
                    label="Favorite Classes"
                    value={favoritesCount}
                    sublabel="saved for later"
                />
            </section>

            <section>
                <SectionHeader>Profile</SectionHeader>
                <ProfileCard user={user} />
            </section>

            <section>
                <SectionHeader>Trainer Application</SectionHeader>
                <TrainerApplicationCard application={application} />
            </section>
        </div>
    );
}

/* ---------- shared section header ---------- */

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

/* ---------- stat card ---------- */

function StatCard({ href, Icon, label, value, sublabel }) {
    return (
        <Link
            href={href}
            className={`group relative bg-[#0a0a0a] border border-[#C9962E]/20 hover:border-[#E8C667]/50 transition-all hover:-translate-y-0.5 p-6 ${CHAMFER_MD} no-underline overflow-hidden`}
        >
            <div className="absolute top-0 right-0 h-32 w-32 bg-[radial-gradient(circle_at_top_right,rgba(232,198,103,0.08),transparent_60%)] pointer-events-none" />

            <div className="relative flex items-center gap-5">
                <div className={`flex items-center justify-center h-14 w-14 bg-[#C9962E]/10 border border-[#C9962E]/30 shrink-0 ${CHAMFER_SM}`}>
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

                <ArrowRight size={16} className="text-[#7c7468] group-hover:text-[#E8C667] group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
        </Link>
    );
}

/* ---------- profile card (just user info) ---------- */

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
                        <RoleBadge />
                    </div>
                </div>
            </div>
        </div>
    );
}

function RoleBadge() {
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] font-['Oswald'] text-[10px] font-bold tracking-[2px] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] shrink-0 ${CHAMFER_XS}`}>
            <BadgeCheck size={11} />
            Member
        </span>
    );
}

/* ---------- trainer application card ---------- */

const STATUS_ACCENTS = {
    none:     { glow: "rgba(232,198,103,0.15)", border: "border-[#C9962E]/25" },
    pending:  { glow: "rgba(232,198,103,0.18)", border: "border-[#E8C667]/35" },
    rejected: { glow: "rgba(255,90,90,0.15)",   border: "border-[#ff5a5a]/30" },
    approved: { glow: "rgba(74,222,128,0.15)",  border: "border-[#4ade80]/30" },
};

function TrainerApplicationCard({ application }) {
    const status = application?.status || "none";
    const accent = STATUS_ACCENTS[status] || STATUS_ACCENTS.none;

    return (
        <div className={`relative bg-[#0a0a0a] border ${accent.border} p-6 lg:p-8 ${CHAMFER_MD} overflow-hidden`}>
            {/* Status-tinted ambient glow to reinforce state visually */}
            <div
                className="absolute top-0 right-0 h-40 w-40 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at top right, ${accent.glow}, transparent 60%)`,
                }}
            />

            <div className="relative">
                {status === "none"     && <NoApplicationContent />}
                {status === "pending"  && <PendingContent application={application} />}
                {status === "rejected" && <RejectedContent application={application} />}
                {status === "approved" && <ApprovedContent />}
            </div>
        </div>
    );
}

function NoApplicationContent() {
    return (
        <>
            <div className="flex items-start gap-4 mb-5">
                <div className={`flex items-center justify-center h-12 w-12 bg-[#C9962E]/10 border border-[#C9962E]/30 shrink-0 ${CHAMFER_SM}`}>
                    <Dumbbell size={20} className="text-[#E8C667]" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none">
                        Become a Trainer
                    </h3>
                    <p className="text-[#cfc6b8] text-sm mt-2.5 leading-relaxed">
                        Share your expertise — apply to coach classes on GymCraft and start
                        earning while doing what you love.
                    </p>
                </div>
            </div>
            <PrimaryActionLink href="/dashboard/member/apply">
                Apply Now
                <ArrowRight size={14} />
            </PrimaryActionLink>
        </>
    );
}

function PendingContent({ application }) {
    return (
        <>
            <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                <h3 className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none">
                    Application Under Review
                </h3>
                <StatusBadge status="pending" />
            </div>
            <p className="text-[#cfc6b8] text-sm leading-relaxed">
                Our admins are evaluating your application. You&apos;ll receive an update
                here once a decision is made — usually within a few business days.
            </p>
            {application?.createdAt && (
                <p className="text-[#7c7468] text-xs mt-4 inline-flex items-center gap-1.5">
                    <Clock size={11} />
                    Submitted {formatDate(application.createdAt)}
                </p>
            )}
        </>
    );
}

function RejectedContent({ application }) {
    return (
        <>
            <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                <h3 className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none">
                    Application Not Approved
                </h3>
                <StatusBadge status="rejected" />
            </div>
            <p className="text-[#cfc6b8] text-sm leading-relaxed mb-5">
                Your application was reviewed but didn&apos;t meet our requirements this time.
                Review the feedback below and retry the application when you&aposX;re ready.
            </p>
            <p className="text-[#e74032] text-sm leading-relaxed mb-5">
                Reject reason : {application.rejectionReason}
            </p>

            {application?.feedback && (
                <div className={`bg-[#ff5a5a]/[0.07] border border-[#ff5a5a]/30 p-4 lg:p-5 ${CHAMFER_SM}`}>
                    <div className="flex items-start gap-3">
                        <AlertCircle size={16} className="text-[#ff8585] shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="font-['Oswald'] text-[10px] font-semibold tracking-[2px] uppercase text-[#ff8585] mb-2">
                                Admin feedback
                            </p>
                            <p className="text-[#e7e0d2] text-sm italic leading-relaxed">
                                &ldquo;{application.feedback}&rdquo;
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-5">
                <PrimaryActionLink href="/dashboard/member/apply">
                    Retry Submission
                    <ArrowRight size={14} />
                </PrimaryActionLink>
            </div>
        </>
    );
}

function ApprovedContent() {
    // Defensive — approved applicants are promoted to trainer and shouldn't
    // land on this page. Kept just in case there's a transient state.
    return (
        <>
            <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <h3 className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none">
                    Application Approved
                </h3>
                <StatusBadge status="approved" />
            </div>
            <p className="text-[#cfc6b8] text-sm">
                Refresh the page — your trainer role should activate momentarily.
            </p>
        </>
    );
}

/* ---------- shared bits ---------- */

function PrimaryActionLink({ href, children }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-2 px-5 py-2.5 font-['Oswald'] font-semibold text-xs tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] cursor-pointer no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.25)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_5px_16px_rgba(201,150,46,0.35)] transition-all ${CHAMFER_SM}`}
        >
            {children}
        </Link>
    );
}

function StatusBadge({ status }) {
    const variants = {
        pending: {
            bg: "bg-[#E8C667]/10",
            border: "border-[#E8C667]/40",
            text: "text-[#E8C667]",
            label: "Pending",
            Icon: Clock,
        },
        approved: {
            bg: "bg-[#4ade80]/10",
            border: "border-[#4ade80]/40",
            text: "text-[#4ade80]",
            label: "Approved",
            Icon: BadgeCheck,
        },
        rejected: {
            bg: "bg-[#ff5a5a]/10",
            border: "border-[#ff5a5a]/40",
            text: "text-[#ff8585]",
            label: "Rejected",
            Icon: X,
        },
    };
    const v = variants[status] || variants.pending;
    const SIcon = v.Icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${v.bg} border ${v.border} ${v.text} font-['Oswald'] text-[10px] font-bold tracking-[2px] uppercase shrink-0 ${CHAMFER_XS}`}>
            <SIcon size={11} />
            {v.label}
        </span>
    );
}

function Avatar({ user, size = 96 }) {
    if (user?.image) {
        // eslint-disable-next-line @next/next/no-img-element
        return (
            <img
                src={user.image}
                alt=""
                className="rounded-full object-cover border-2 border-[#C9962E]/40 shrink-0"
                style={{ width: size, height: size }}
            />
        );
    }
    const initials = (user?.name || "U")
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

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}