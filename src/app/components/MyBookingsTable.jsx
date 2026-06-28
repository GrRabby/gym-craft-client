import Link from "next/link";
import {
    Calendar, Clock, ArrowRight, CalendarX,
    Dumbbell, HeartPulse, Flame, Sparkles, Activity, Move,
} from "lucide-react";

const CATEGORY_ICONS = {
    strength: Dumbbell,
    cardio: HeartPulse,
    hiit: Flame,
    yoga: Sparkles,
    pilates: Activity,
    mobility: Move,
};

const DAY_LABEL = {
    mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";


function formatTime12h(time24) {
    if (!time24 || !time24.includes(":")) return time24 || "";
    const [h, m] = time24.split(":");
    const hour = parseInt(h, 10);
    if (Number.isNaN(hour)) return time24;
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${period}`;
}

export default function MyBookingsTable({ bookings = [] }) {
    if (bookings.length === 0) {
        return <EmptyState />;
    }

    return (
        
        
        <div className={`bg-[#0a0a0a] border border-[#C9962E]/30 overflow-hidden ${CHAMFER_MD}`}>
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="border-b border-[#C9962E]/30">
                            <Th>Class</Th>
                            <Th>Trainer</Th>
                            <Th>Schedule</Th>
                            <Th align="right">Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, i) => (
                            <BookingRow
                                key={booking.id}
                                booking={booking}
                                isLast={i === bookings.length - 1}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function BookingRow({ booking, isLast }) {
    const { class: cls, trainer } = booking;
    const CatIcon = CATEGORY_ICONS[cls.category] || Dumbbell;

    return (
        <tr
            className={`group transition-colors hover:bg-[#C9962E]/[0.04] ${isLast ? "" : "border-b border-[#C9962E]/20"
                }`}
        >
            { }
            <td className="px-5 py-4">
                <div className="flex items-center gap-3 min-w-[200px]">
                    {cls.image ? (
                        <div className={`relative w-14 h-14 shrink-0 overflow-hidden bg-[#0f0f0f] border border-[#C9962E]/20 ${CHAMFER_SM}`}>
                            { }
                            <img
                                src={cls.image}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className={`w-14 h-14 shrink-0 flex items-center justify-center bg-[#0f0f0f] border border-[#C9962E]/20 ${CHAMFER_SM}`}>
                            <CatIcon size={24} className="text-[#C9962E]/40" />
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="font-['Bebas_Neue'] text-lg text-white tracking-wide leading-tight truncate group-hover:text-[#E8C667] transition-colors">
                            {cls.title}
                        </p>
                        <p className="font-['Oswald'] text-[10px] tracking-[2px] uppercase text-[#7c7468] mt-0.5 inline-flex items-center gap-1.5">
                            <CatIcon size={10} className="text-[#E8C667]" />
                            {cls.category} · {cls.duration} min
                        </p>
                    </div>
                </div>
            </td>

            { }
            <td className="px-5 py-4">
                <div className="flex items-center gap-2.5">
                    <Avatar user={trainer} size={28} />
                    <span className="text-[#cfc6b8] text-sm whitespace-nowrap">
                        {trainer.name}
                    </span>
                </div>
            </td>

            { }
            <td className="px-5 py-4">
                <div className="text-sm whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 text-[#cfc6b8]">
                        <Calendar size={12} className="text-[#E8C667] shrink-0" />
                        {cls.scheduleDays.map((d) => DAY_LABEL[d]).join(" · ")}
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-[#7c7468] mt-0.5 ml-[18px]">
                        <Clock size={11} className="shrink-0" />
                        {formatTime12h(cls.scheduleTime)}
                    </div>
                </div>
            </td>

            { }
            <td className="px-5 py-4 text-right">
                <Link
                    href={`/classes/${cls.id}?from=bookings`}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#C9962E]/30 hover:border-[#E8C667] hover:bg-[#C9962E]/5 text-[#cfc6b8] hover:text-white font-['Oswald'] text-[11px] tracking-[2px] uppercase font-semibold cursor-pointer transition-colors no-underline ${CHAMFER_SM}`}
                >
                    Details
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
            </td>
        </tr>
    );
}

 

function Th({ children, align = "left" }) {
    return (
        <th
            className={`px-5 py-3.5 font-['Oswald'] text-[10px] font-semibold tracking-[3px] uppercase text-[#7c7468] text-${align}`}
        >
            {children}
        </th>
    );
}

function Avatar({ user, size = 28 }) {
    if (user?.image) {
        
        return (
            <img
                src={user.image}
                alt=""
                className="rounded-full object-cover border border-[#C9962E]/40 shrink-0"
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
            className="rounded-full inline-flex items-center justify-center bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] font-bold border border-[#C9962E]/40 shrink-0"
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {initials}
        </span>
    );
}

function EmptyState() {
    return (
        <div className={`bg-[#0a0a0a] border border-[#C9962E]/15 py-16 px-8 text-center ${CHAMFER_MD}`}>
            <div className="inline-flex items-center justify-center h-16 w-16 mb-5 bg-[#C9962E]/5 border border-[#C9962E]/20 rounded-full">
                <CalendarX size={28} className="text-[#C9962E]/50" />
            </div>
            <p className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none mb-2">
                No bookings yet
            </p>
            <p className="text-[#7c7468] text-sm max-w-md mx-auto mb-8">
                Once you book a class, it&apos;ll show up here so you can find your way back to it.
            </p>
            <Link
                href="/classes"
                className={`inline-flex items-center gap-2 px-6 py-3 font-['Oswald'] font-semibold text-xs tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] cursor-pointer no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.25)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_5px_16px_rgba(201,150,46,0.35)] transition-all ${CHAMFER_SM}`}
            >
                Browse Classes
                <ArrowRight size={14} />
            </Link>
        </div>
    );
}