"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Clock, ArrowRight, Calendar, ChevronLeft, ChevronRight,
    Loader2, Compass,
    Dumbbell, HeartPulse, Flame, Sparkles, Activity, Move,
} from "lucide-react";
import { DumbbellSpinner } from "./DumbbellSpinner";

const CATEGORIES = [
    { value: "strength", label: "Strength", Icon: Dumbbell },
    { value: "cardio", label: "Cardio", Icon: HeartPulse },
    { value: "hiit", label: "HIIT", Icon: Flame },
    { value: "yoga", label: "Yoga", Icon: Sparkles },
    { value: "pilates", label: "Pilates", Icon: Activity },
    { value: "mobility", label: "Mobility", Icon: Move },
];

const CATEGORY_META = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

const DAY_LABEL = {
    mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

const DIFFICULTY_DOT = {
    beginner: "bg-[#4ade80]",
    intermediate: "bg-[#E8C667]",
    advanced: "bg-[#ff5a5a]",
};

export default function ClassesGrid({
    initialClasses = [],
    currentPage = 1,
    totalPages = 1,
    total = 0,
    currentSearch = "",
    currentCategories = [],
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const topAnchorRef = useRef(null);
    const prevPageRef = useRef(currentPage);
    /* ---------- Search input ↔ URL (debounced) ---------- */
    const [searchInput, setSearchInput] = useState(currentSearch);
    // Scroll cleanly up to the top of the grid whenever the page changes
    useEffect(() => {
        if (prevPageRef.current !== currentPage) {
            topAnchorRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }else{
            window.scrollTo({
                top: 0,
                behavior: "instant",
            });
        }

        prevPageRef.current = currentPage;
        
    }, [currentPage]);
    // Sync local input when URL changes externally (back button, link share)
    useEffect(() => {
        setSearchInput(currentSearch);
    }, [currentSearch]);

    // Debounce typing → URL push (400ms idle)
    useEffect(() => {
        if (searchInput === currentSearch) return;
        const t = setTimeout(() => setParam("search", searchInput.trim()), 400);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    /* ---------- URL helpers ---------- */
    function setParam(key, value) {
        const params = new URLSearchParams(searchParams);
        if (key !== "page") params.delete("page");          // any filter change → page 1
        if (value === "" || value == null) params.delete(key);
        else params.set(key, String(value));

        const qs = params.toString();
        startTransition(() => {
            router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
        });
    }

    function toggleCategory(value) {
        const next = currentCategories.includes(value)
            ? currentCategories.filter((c) => c !== value)
            : [...currentCategories, value];
        setParam("category", next.join(","));
    }

    function clearAll() {
        startTransition(() => router.push(pathname, { scroll: false }));
    }
    // Safely infers page size by measuring current list array length, or defaults to 9
    const PAGE_SIZE = 9; // Hardcoded to match your backend limit
    const fromItem = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const toItem = Math.min(currentPage * PAGE_SIZE, total);
    const hasActiveFilters = currentCategories.length > 0 || !!currentSearch;

    /* ---------- Render ---------- */
    return (
        <div className="space-y-10">
            {/* Search */}
            <div ref={topAnchorRef} className="scroll-mt-30">
            </div>
            <div className="relative max-w-xl mx-auto">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c7468] pointer-events-none" />
                <input
                    type="search"
                    placeholder="Search classes by name…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#C9962E]/25 text-white placeholder:text-[#5a5247] text-base pl-11 pr-12 py-3.5 outline-none focus:border-[#E8C667]/60 transition-colors [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]"
                />
                {isPending && (
                    <DumbbellSpinner className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E8C667]" size={20} />
                )}
            </div>
            {/* Stats / Scroll Anchor point */}

            {/* Category pills — multi-select */}
            <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                    type="button"
                    onClick={clearAll}
                    disabled={!hasActiveFilters}
                    className={`inline-flex items-center gap-2 px-4 py-2 font-['Oswald'] text-xs tracking-[2px] uppercase font-semibold cursor-pointer transition-all [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)] ${!hasActiveFilters
                        ? "bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.25)]"
                        : "bg-white/[0.02] border border-[#C9962E]/25 text-[#cfc6b8] hover:border-[#E8C667] hover:text-white"
                        } disabled:cursor-default`}
                >
                    <Compass size={12} />
                    All
                </button>

                {CATEGORIES.map(({ value, label, Icon }) => {
                    const selected = currentCategories.includes(value);
                    return (
                        <button
                            type="button"
                            key={value}
                            onClick={() => toggleCategory(value)}
                            aria-pressed={selected}
                            className={`relative inline-flex items-center gap-2 px-4 py-2 font-['Oswald'] text-xs tracking-[2px] uppercase font-semibold cursor-pointer transition-colors [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)] ${selected
                                ? "text-[#1a1304]"
                                : "bg-white/[0.02] border border-[#C9962E]/25 text-[#cfc6b8] hover:border-[#E8C667] hover:text-white"
                                }`}
                        >
                            <AnimatePresence>
                                {selected && (
                                    <motion.span
                                        key="bg"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute inset-0 bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.25)] [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)]"
                                    />
                                )}
                            </AnimatePresence>
                            <Icon size={12} className="relative z-10" />
                            <span className="relative z-10">{label}</span>
                        </button>
                    );
                })}
            </div>
            <p className="text-start text-[#7c7468] text-sm font-['Oswald'] tracking-[2px] uppercase">
                {total === 0 ? (
                    "No classes found"
                ) : (
                    <>
                        Showing <span className="text-[#E8C667]">{fromItem}–{toItem}</span> of <span className="text-[#E8C667]">{total}</span> {total === 1 ? "class" : "classes"} {hasActiveFilters ? "matched" : "available"}
                    </>
                )}
            </p>

            {/* Grid */}
            {initialClasses.length === 0 ? (
                <EmptyState hasFilters={hasActiveFilters} />
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {initialClasses.map((cls, i) => (
                            <motion.article
                                key={cls.id}
                                layout
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.94 }}
                                transition={{
                                    type: "spring",
                                    bounce: 0.15,
                                    duration: 0.5,
                                    delay: i * 0.04,
                                }}
                            >
                                <ClassCardBody cls={cls} />
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6">
                    <PagerButton
                        onClick={() => setParam("page", String(currentPage - 1))}
                        disabled={currentPage <= 1 || isPending}
                    >
                        <ChevronLeft size={14} />
                        Prev
                    </PagerButton>

                    <span className="font-['Oswald'] text-xs tracking-[3px] uppercase text-[#cfc6b8]">
                        Page {currentPage} <span className="text-[#7c7468]">of</span> {totalPages}
                    </span>

                    <PagerButton
                        onClick={() => setParam("page", String(currentPage + 1))}
                        disabled={currentPage >= totalPages || isPending}
                    >
                        Next
                        <ChevronRight size={14} />
                    </PagerButton>
                </div>
            )}
        </div>
    );
}

/* ---------- card body ---------- */

function ClassCardBody({ cls }) {
    const meta = CATEGORY_META[cls.category] || { label: cls.category, Icon: Dumbbell };
    const SIcon = meta.Icon;
    const days = cls.scheduleDays.map((d) => DAY_LABEL[d]).join(" · ");
    const diffLabel = cls.difficulty.charAt(0).toUpperCase() + cls.difficulty.slice(1);

    // Inner div handles hover transforms — outer motion.article handles layout
    // transforms. Separating them keeps hover lift from fighting layout animation.
    return (
        <div className="group relative h-full bg-[#0a0a0a] border border-[#C9962E]/15 hover:border-[#C9962E]/55 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(201,150,46,0.15)] [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)] overflow-hidden flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden bg-[#0f0f0f]">
                {cls.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cls.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <SIcon size={48} className="text-[#C9962E]/30" />
                    </div>
                )}
                <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/60 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-sm border border-[#C9962E]/40 text-[#E8C667] text-[10px] font-['Oswald'] font-semibold tracking-[2px] uppercase">
                    <SIcon size={11} />
                    {meta.label}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] text-[11px] font-['Oswald'] font-bold tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                    USD {cls.price}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-['Bebas_Neue'] text-2xl tracking-wide text-white leading-tight group-hover:text-[#E8C667] transition-colors line-clamp-2">
                    {cls.title}
                </h3>

                <div className="flex items-center gap-2 mt-2.5 text-xs text-[#7c7468]">
                    <Avatar user={cls.trainer} size={20} />
                    <span>with <span className="text-[#cfc6b8]">{cls.trainer.name}</span></span>
                </div>

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

                <div className="mt-3 pt-3 border-t border-[#C9962E]/10">
                    <p className="font-['Oswald'] text-[10px] tracking-[2px] uppercase text-[#7c7468] mb-1">Schedule</p>
                    <p className="text-[#cfc6b8] text-xs leading-relaxed">
                        {days} <span className="text-[#E8C667]">at {cls.scheduleTime}</span>
                    </p>
                </div>

                <Link
                    href={`/classes/${cls.id}`}
                    className="mt-5 group/btn inline-flex items-center justify-center gap-2 px-4 py-2.5 font-['Oswald'] font-semibold text-xs tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] no-underline cursor-pointer [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition-all hover:-translate-y-0.5"
                >
                    View Details
                    <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
                </Link>
            </div>
        </div>
    );
}

/* ---------- helpers ---------- */

function PagerButton({ children, ...props }) {
    return (
        <button
            {...props}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#C9962E]/25 hover:border-[#E8C667] hover:bg-[#C9962E]/5 text-[#cfc6b8] hover:text-white font-['Oswald'] text-xs tracking-[2px] uppercase font-semibold cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#C9962E]/25 disabled:hover:bg-transparent disabled:hover:text-[#cfc6b8] [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)]"
        >
            {children}
        </button>
    );
}

function EmptyState({ hasFilters }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
            <Calendar size={36} className="mx-auto text-[#C9962E]/30 mb-4" />
            <p className="font-['Oswald'] text-sm tracking-[3px] uppercase text-[#cfc6b8]">
                {hasFilters ? "No classes match your filters" : "No classes available yet"}
            </p>
            <p className="text-[#7c7468] text-sm mt-2 max-w-md mx-auto">
                {hasFilters ? "Try a different category or clear your search." : "New classes will appear here as trainers add them."}
            </p>
        </motion.div>
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