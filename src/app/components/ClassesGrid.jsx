"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Search, Clock, ArrowRight, Calendar, Compass,
    Dumbbell, HeartPulse, Flame, Sparkles, Activity, Move,
} from "lucide-react";

const CATEGORIES = [
    { value: "all",      label: "All",      Icon: Compass },
    { value: "strength", label: "Strength", Icon: Dumbbell },
    { value: "cardio",   label: "Cardio",   Icon: HeartPulse },
    { value: "hiit",     label: "HIIT",     Icon: Flame },
    { value: "yoga",     label: "Yoga",     Icon: Sparkles },
    { value: "pilates",  label: "Pilates",  Icon: Activity },
    { value: "mobility", label: "Mobility", Icon: Move },
];

const CATEGORY_META = Object.fromEntries(
    CATEGORIES.filter((c) => c.value !== "all").map((c) => [c.value, { label: c.label, Icon: c.Icon }])
);

const DAY_LABEL = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };

const DIFFICULTY_DOT = {
    beginner:     "bg-[#4ade80]",
    intermediate: "bg-[#E8C667]",
    advanced:     "bg-[#ff5a5a]",
};

export default function ClassesGrid({ initialClasses = [] }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return initialClasses.filter((c) => {
            if (category !== "all" && c.category !== category) return false;
            if (q && !c.title.toLowerCase().includes(q)) return false;
            return true;
        });
    }, [initialClasses, search, category]);

    return (
        <div className="space-y-10">
            {/* Filters */}
            <div className="space-y-5">
                <div className="relative max-w-xl mx-auto">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c7468] pointer-events-none" />
                    <input
                        type="search"
                        placeholder="Search classes by name…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-[#C9962E]/25 text-white placeholder:text-[#5a5247] text-base pl-11 pr-4 py-3.5 outline-none focus:border-[#E8C667]/60 transition-colors [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]"
                    />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                    {CATEGORIES.map(({ value, label, Icon }) => {
                        const selected = category === value;
                        return (
                            <button
                                type="button"
                                key={value}
                                onClick={() => setCategory(value)}
                                aria-pressed={selected}
                                className={`inline-flex items-center gap-2 px-4 py-2 font-['Oswald'] text-xs tracking-[2px] uppercase font-semibold cursor-pointer transition-all [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)] ${
                                    selected
                                        ? "bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.25)]"
                                        : "bg-white/[0.02] border border-[#C9962E]/25 text-[#cfc6b8] hover:border-[#E8C667] hover:text-white"
                                }`}
                            >
                                <Icon size={12} />
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Stats line */}
            <p className="text-center text-[#7c7468] text-sm font-['Oswald'] tracking-[2px] uppercase">
                Showing {filtered.length} of {initialClasses.length} {initialClasses.length === 1 ? "class" : "classes"}
            </p>

            {/* Grid / empty state */}
            {filtered.length === 0 ? (
                <EmptyState hasFilters={!!search || category !== "all"} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((cls) => <ClassCard key={cls.id} cls={cls} />)}
                </div>
            )}
        </div>
    );
}

/* ---------- card ---------- */

function ClassCard({ cls }) {
    const meta = CATEGORY_META[cls.category] || { label: cls.category, Icon: Dumbbell };
    const SIcon = meta.Icon;
    const days = cls.scheduleDays.map((d) => DAY_LABEL[d]).join(" · ");
    const diffLabel = cls.difficulty.charAt(0).toUpperCase() + cls.difficulty.slice(1);

    return (
        <article className="group relative bg-[#0a0a0a] border border-[#C9962E]/15 hover:border-[#C9962E]/55 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(201,150,46,0.15)] [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)] overflow-hidden flex flex-col">
            {/* Image / fallback */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#0f0f0f]">
                {cls.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={cls.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <SIcon size={48} className="text-[#C9962E]/30" />
                    </div>
                )}

                {/* Top gradient for badge contrast */}
                <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/60 to-transparent pointer-events-none" />

                {/* Category badge */}
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-sm border border-[#C9962E]/40 text-[#E8C667] text-[10px] font-['Oswald'] font-semibold tracking-[2px] uppercase">
                    <SIcon size={11} />
                    {meta.label}
                </div>

                {/* Price badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] text-[11px] font-['Oswald'] font-bold tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                    BDT {cls.price}
                </div>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-['Bebas_Neue'] text-2xl tracking-wide text-white leading-tight group-hover:text-[#E8C667] transition-colors line-clamp-2">
                    {cls.title}
                </h3>

                {/* Trainer */}
                <div className="flex items-center gap-2 mt-2.5 text-xs text-[#7c7468]">
                    <Avatar user={cls.trainer} size={20} />
                    <span>with <span className="text-[#cfc6b8]">{cls.trainer.name}</span></span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 mt-4 text-xs text-[#cfc6b8]">
                    <span className="inline-flex items-center gap-1.5">
                        <Clock size={12} className="text-[#E8C667]" />
                        {cls.duration} min
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${DIFFICULTY_DOT[cls.difficulty] || "bg-[#7c7468]"}`} />
                        {diffLabel}
                    </span>
                </div>

                {/* Schedule */}
                <div className="mt-3 pt-3 border-t border-[#C9962E]/10">
                    <p className="font-['Oswald'] text-[10px] tracking-[2px] uppercase text-[#7c7468] mb-1">Schedule</p>
                    <p className="text-[#cfc6b8] text-xs leading-relaxed">
                        {days} <span className="text-[#E8C667]">at {cls.scheduleTime}</span>
                    </p>
                </div>

                {/* CTA — pushed to bottom of card */}
                <Link
                    href={`/classes/${cls.id}`}
                    className="mt-5 group/btn inline-flex items-center justify-center gap-2 px-4 py-2.5 font-['Oswald'] font-semibold text-xs tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] no-underline cursor-pointer [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition-all hover:-translate-y-0.5"
                >
                    View Details
                    <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
                </Link>
            </div>
        </article>
    );
}

/* ---------- helpers ---------- */

function EmptyState({ hasFilters }) {
    return (
        <div className="py-20 text-center">
            <Calendar size={36} className="mx-auto text-[#C9962E]/30 mb-4" />
            <p className="font-['Oswald'] text-sm tracking-[3px] uppercase text-[#cfc6b8]">
                {hasFilters ? "No classes match your filters" : "No classes available yet"}
            </p>
            <p className="text-[#7c7468] text-sm mt-2 max-w-md mx-auto">
                {hasFilters
                    ? "Try a different category or clear your search."
                    : "New classes will appear here as trainers add them."}
            </p>
        </div>
    );
}

function Avatar({ user, size = 24 }) {
    if (user?.image) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={user.image} alt="" className="rounded-full object-cover border border-[#C9962E]/40 shrink-0" style={{ width: size, height: size }} />;
    }
    const initials = (user?.name || "U").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
    return (
        <span
            className="rounded-full inline-flex items-center justify-center bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] font-bold border border-[#C9962E]/40 shrink-0"
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {initials}
        </span>
    );
}