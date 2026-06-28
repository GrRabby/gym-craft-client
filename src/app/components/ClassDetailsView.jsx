"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
    ArrowLeft, ArrowRight, Clock, Heart, ShoppingCart, CheckCircle2,
    Loader2,
    Dumbbell, HeartPulse, Flame, Sparkles, Activity, Move,
} from "lucide-react";

import { addFavoriteAction, removeFavoriteAction } from "@/actions/favorites";

const CATEGORY_META = {
    strength: { label: "Strength", Icon: Dumbbell },
    cardio: { label: "Cardio", Icon: HeartPulse },
    hiit: { label: "HIIT", Icon: Flame },
    yoga: { label: "Yoga", Icon: Sparkles },
    pilates: { label: "Pilates", Icon: Activity },
    mobility: { label: "Mobility", Icon: Move },
};

const ALL_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABEL = {
    mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

const DIFFICULTY_META = {
    beginner: { label: "Beginner", dot: "bg-[#4ade80]", text: "text-[#4ade80]" },
    intermediate: { label: "Intermediate", dot: "bg-[#E8C667]", text: "text-[#E8C667]" },
    advanced: { label: "Advanced", dot: "bg-[#ff5a5a]", text: "text-[#ff5a5a]" },
};

const CHAMFER_LG = "[clip-path:polygon(16px_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%,0_16px)]";
const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";
const CHAMFER_XS = "[clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]";


const BACK_LINKS = {
    bookings: { href: "/dashboard/member/bookings", label: "Back to bookings" },
    favorites: { href: "/dashboard/member/favorites", label: "Back to favorites" },
};
const DEFAULT_BACK = { href: "/classes", label: "Back to all classes" };

export default function ClassDetailsView({ cls, initialBooked, initialFavorited, from }) {
    const router = useRouter();

    const [isFavorited, setIsFavorited] = useState(initialFavorited);
    const [isFavoritePending, startFavoriteTransition] = useTransition();

    const isBooked = initialBooked;
    const back = BACK_LINKS[from] || DEFAULT_BACK;

     

    function handleBookClick() {
        if (isBooked) {
            toast.error("You have already booked this class");
            return;
        }
        router.push(`/classes/${cls.id}/checkout`);
    }

    function toggleFavorite() {
        if (isFavoritePending) return;

        const wasFavorited = isFavorited;

        
        setIsFavorited(!wasFavorited);

        startFavoriteTransition(async () => {
            try {
                const res = await fetch(`/api/favorites/${cls.id}`, {
                    method: wasFavorited ? "DELETE" : "POST",
                });

                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                    
                    setIsFavorited(wasFavorited);
                    if (data.blocked) {
                        toast.error("Action restricted by Admin");
                    } else {
                        toast.error(data.error || "Failed to update favorite");
                    }
                    return;
                }

                toast.success(
                    wasFavorited
                        ? "Removed from favorites"
                        : "Successfully added to your favorites!",
                );
            } catch (err) {
                setIsFavorited(wasFavorited);
                toast.error("Network error. Please try again.");
            }
        });
    }

     

    const categoryMeta = CATEGORY_META[cls.category] || { label: cls.category, Icon: Dumbbell };
    const CatIcon = categoryMeta.Icon;
    const diffMeta = DIFFICULTY_META[cls.difficulty] || { label: cls.difficulty, dot: "bg-[#7c7468]", text: "text-[#cfc6b8]" };

    return (
        <div className="bg-[#070707] min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 pb-20">
                { }
                <Link
                    href={back.href}
                    className="inline-flex items-center gap-2 text-[#7c7468] hover:text-[#E8C667] text-xs font-['Oswald'] tracking-[2px] uppercase transition-colors"
                >
                    <ArrowLeft size={14} />
                    {back.label}
                </Link>

                { }
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`mt-6 relative aspect-[21/9] overflow-hidden bg-[#0a0a0a] border border-[#C9962E]/20 ${CHAMFER_LG}`}
                >
                    {cls.image ? (
                        
                        <img src={cls.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <CatIcon size={120} className="text-[#C9962E]/20" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

                    <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-sm border border-[#C9962E]/40 text-[#E8C667] text-[11px] font-['Oswald'] font-semibold tracking-[2px] uppercase ${CHAMFER_XS}`}>
                            <CatIcon size={12} />
                            {categoryMeta.label}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-sm border border-[#C9962E]/40 ${diffMeta.text} text-[11px] font-['Oswald'] font-semibold tracking-[2px] uppercase ${CHAMFER_XS}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${diffMeta.dot}`} />
                            {diffMeta.label}
                        </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6 lg:p-10">
                        <h1 className="font-['Bebas_Neue'] text-4xl sm:text-5xl lg:text-7xl text-white leading-[0.95] tracking-wide">
                            {cls.title}
                        </h1>
                        <div className="flex items-center gap-3 mt-4">
                            <Avatar user={cls.trainer} size={32} />
                            <p className="text-sm text-[#cfc6b8]">
                                Coached by{" "}
                                <span className="text-[#E8C667] font-semibold">{cls.trainer.name}</span>
                            </p>
                        </div>
                    </div>
                </motion.div>

                { }
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <aside className="lg:col-start-3 lg:row-start-1">
                        <div className="lg:sticky lg:top-24">
                            <ActionCard
                                cls={cls}
                                isBooked={isBooked}
                                isFavorited={isFavorited}
                                isFavoritePending={isFavoritePending}
                                onBook={handleBookClick}
                                onToggleFavorite={toggleFavorite}
                            />
                        </div>
                    </aside>

                    <div className="lg:col-start-1 lg:col-span-2 lg:row-start-1 space-y-10">
                        <DescriptionSection cls={cls} />
                        <ScheduleSection cls={cls} />
                        <TrainerSection trainer={cls.trainer} />
                    </div>
                </div>
            </div>
        </div>
    );
}

 

function ActionCard({
    cls, isBooked, isFavorited, isFavoritePending, onBook, onToggleFavorite,
}) {
    return (
        <div className={`relative bg-[#0a0a0a] border border-[#C9962E]/20 p-6 ${CHAMFER_MD}`}>
            <div className="absolute top-0 right-0 h-32 w-32 bg-[radial-gradient(circle_at_top_right,rgba(232,198,103,0.12),transparent_60%)] pointer-events-none" />

            <div className="relative">
                <p className="font-['Oswald'] text-[10px] tracking-[3px] uppercase text-[#7c7468]">
                    Price per session
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-['Bebas_Neue'] text-5xl bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent leading-none">
                        ${cls.price}
                    </span>
                    <span className="text-xs text-[#7c7468] font-['Oswald'] tracking-[2px] uppercase">USD</span>
                </div>
                <p className="text-[#7c7468] text-xs mt-2 inline-flex items-center gap-1.5">
                    <Clock size={11} className="text-[#E8C667]" />
                    {cls.duration} minute session
                </p>
            </div>

            <div className="relative mt-6 space-y-3">
                <button
                    type="button"
                    onClick={onBook}
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 font-['Oswald'] font-semibold text-sm tracking-[2px] uppercase cursor-pointer transition-all ${CHAMFER_SM} ${isBooked
                            ? "bg-[#0f0f0f] border-2 border-[#4ade80]/40 text-[#4ade80] hover:border-[#4ade80]/60"
                            : "bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_14px_rgba(201,150,46,0.25)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_20px_rgba(201,150,46,0.35)]"
                        }`}
                >
                    {isBooked ? (
                        <>
                            <CheckCircle2 size={16} />
                            Already Booked
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={16} />
                            Book Now
                            <ArrowRight size={14} />
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={onToggleFavorite}
                    disabled={isFavoritePending}
                    aria-pressed={isFavorited}
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 font-['Oswald'] font-semibold text-xs tracking-[2px] uppercase cursor-pointer transition-all ${CHAMFER_SM} disabled:opacity-60 disabled:cursor-wait ${isFavorited
                            ? "bg-[#C9962E]/10 border-2 border-[#E8C667]/50 text-[#E8C667] hover:bg-[#C9962E]/15"
                            : "bg-white/[0.02] border-2 border-[#C9962E]/25 text-[#cfc6b8] hover:border-[#E8C667] hover:text-white"
                        }`}
                >
                    {isFavoritePending ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Heart size={14} className={isFavorited ? "fill-[#E8C667]" : ""} />
                    )}
                    {isFavorited ? "Saved to Favorites" : "Add to Favorites"}
                </button>
            </div>

            <div className="relative mt-6 pt-5 border-t border-[#C9962E]/15">
                <p className="font-['Oswald'] text-[10px] tracking-[3px] uppercase text-[#7c7468] mb-2">
                    Schedule
                </p>
                <p className="text-[#cfc6b8] text-sm">
                    {cls.scheduleDays.map((d) => DAY_LABEL[d]).join(" · ")}{" "}
                    <span className="text-[#E8C667]">at {cls.scheduleTime}</span>
                </p>
            </div>
        </div>
    );
}

 

function DescriptionSection({ cls }) {
    return (
        <div>
            <SectionTitle>About This Class</SectionTitle>
            <p className="text-[#cfc6b8] leading-relaxed whitespace-pre-line">
                {cls.description}
            </p>
        </div>
    );
}

function ScheduleSection({ cls }) {
    return (
        <div>
            <SectionTitle>Schedule</SectionTitle>
            <div className={`bg-[#0a0a0a] border border-[#C9962E]/15 p-6 ${CHAMFER_MD}`}>
                <div className="flex items-center gap-3 mb-5">
                    <Clock size={20} className="text-[#E8C667]" />
                    <p className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none">
                        {cls.scheduleTime}
                    </p>
                    <span className="text-[#7c7468] text-sm self-end mb-0.5">
                        · {cls.duration} min
                    </span>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {ALL_DAYS.map((day) => {
                        const active = cls.scheduleDays.includes(day);
                        return (
                            <div
                                key={day}
                                className={`text-center py-2.5 transition-colors ${CHAMFER_XS} ${active
                                        ? "bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                                        : "bg-white/[0.02] border border-[#C9962E]/15 text-[#5a5247]"
                                    }`}
                            >
                                <span className="font-['Oswald'] text-xs tracking-[2px] uppercase">
                                    {DAY_LABEL[day]}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function TrainerSection({ trainer }) {
    return (
        <div>
            <SectionTitle>Your Coach</SectionTitle>
            <div className={`bg-[#0a0a0a] border border-[#C9962E]/15 p-5 flex items-center gap-4 ${CHAMFER_MD}`}>
                <Avatar user={trainer} size={56} />
                <div>
                    <p className="font-['Bebas_Neue'] text-2xl text-white tracking-wide leading-none">
                        {trainer.name}
                    </p>
                    <p className="font-['Oswald'] text-[11px] tracking-[2px] uppercase text-[#E8C667] mt-1.5">
                        Certified Trainer
                    </p>
                </div>
            </div>
        </div>
    );
}

function SectionTitle({ children }) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#E8C667]" />
            <h2 className="font-['Oswald'] text-[11px] font-semibold tracking-[4px] uppercase text-[#E8C667]">
                {children}
            </h2>
        </div>
    );
}

function Avatar({ user, size = 24 }) {
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