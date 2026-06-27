"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, Clock, ArrowRight, Trash2, Loader2, Heart,
    Dumbbell, HeartPulse, Flame, Sparkles, Activity, Move,
} from "lucide-react";

import { removeFavoriteAction } from "@/actions/favorites";

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

export default function MyFavoritesTable({ initialFavorites = [] }) {
    const router = useRouter();
    const [favorites, setFavorites] = useState(initialFavorites);
    const [removingIds, setRemovingIds] = useState(new Set());
    const [, startTransition] = useTransition();

    function handleRemove(favorite) {
        const { id: favoriteId, class: cls } = favorite;

        // setRemovingIds((prev) => new Set(prev).add(favoriteId));
        // setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));

        startTransition(async () => {
            const result = await removeFavoriteAction(cls.id);

            if (!result.ok) {
                // Failed — refresh from the server to restore truth
                router.refresh();
                toast.error(
                    result.blocked
                        ? "Action restricted by Admin"
                        : result.error || "Failed to remove favorite",
                );
            } else {
                toast.success(`Removed "${cls.title}" from favorites`);
                setRemovingIds((prev) => new Set(prev).add(favoriteId));
                setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));

            }

            setRemovingIds((prev) => {
                const next = new Set(prev);
                next.delete(favoriteId);
                return next;
            });
        });
    }

    if (favorites.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className={`bg-[#0a0a0a] border border-[#C9962E]/15 overflow-hidden ${CHAMFER_MD}`}>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-[#C9962E]/15">
                            <Th>Class</Th>
                            <Th>Trainer</Th>
                            <Th>Schedule</Th>
                            <Th align="right">Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence initial={false}>
                            {favorites.map((favorite, i) => (
                                <FavoriteRow
                                    key={favorite.id}
                                    favorite={favorite}
                                    isLast={i === favorites.length - 1}
                                    isRemoving={removingIds.has(favorite.id)}
                                    onRemove={() => handleRemove(favorite)}
                                />
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function FavoriteRow({ favorite, isLast, isRemoving, onRemove }) {
    const { class: cls } = favorite;
    const trainer = cls.trainer;
    const CatIcon = CATEGORY_ICONS[cls.category] || Dumbbell;

    return (
        <motion.tr
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -24, transition: { duration: 0.25 } }}
            transition={{ duration: 0.2 }}
            className={`group transition-colors hover:bg-[#C9962E]/[0.04] ${isLast ? "" : "border-b border-[#C9962E]/10"
                }`}
        >
            {/* Class */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-3 min-w-[200px]">
                    {cls.image ? (
                        <div className={`relative w-14 h-14 shrink-0 overflow-hidden bg-[#0f0f0f] border border-[#C9962E]/20 ${CHAMFER_SM}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
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

            {/* Trainer */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-2.5">
                    <Avatar user={trainer} size={28} />
                    <span className="text-[#cfc6b8] text-sm whitespace-nowrap">
                        {trainer.name}
                    </span>
                </div>
            </td>

            {/* Schedule */}
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

            {/* Actions — Details link + Remove icon button */}
            <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/classes/${cls.id}?from=favorites`}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#C9962E]/30 hover:border-[#E8C667] hover:bg-[#C9962E]/5 text-[#cfc6b8] hover:text-white font-['Oswald'] text-[11px] tracking-[2px] uppercase font-semibold cursor-pointer transition-colors no-underline ${CHAMFER_SM}`}
                    >
                        Details
                        <ArrowRight size={12} />
                    </Link>
                    <button
                        type="button"
                        onClick={onRemove}
                        disabled={isRemoving}
                        aria-label={`Remove ${cls.title} from favorites`}
                        title="Remove from favorites"
                        className={`inline-flex items-center justify-center h-[34px] w-[34px] border border-[#ff5a5a]/25 hover:border-[#ff5a5a]/70 hover:bg-[#ff5a5a]/10 text-[#ff8585] hover:text-[#ff5a5a] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-wait ${CHAMFER_SM}`}
                    >
                        {isRemoving ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Trash2 size={14} />
                        )}
                    </button>
                </div>
            </td>
        </motion.tr>
    );
}

/* ---------- helpers ---------- */

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
        // eslint-disable-next-line @next/next/no-img-element
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
                <Heart size={26} className="text-[#C9962E]/50" />
            </div>
            <p className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none mb-2">
                No favorites yet
            </p>
            <p className="text-[#7c7468] text-sm max-w-md mx-auto mb-8">
                Save classes you&apos;re interested in by tapping the heart icon on
                any class page, and they&apos;ll show up here.
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