import Link from "next/link";
import {
    Dumbbell, Clock, TrendingUp, ArrowRight, Flame,
} from "lucide-react";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";

const CATEGORY_LABELS = {
    strength: "Strength",
    cardio: "Cardio",
    hiit: "HIIT",
    yoga: "Yoga",
    pilates: "Pilates",
    mobility: "Mobility",
};

export default function FeaturedClassesSection({ classes = [] }) {
    return (
        <section className="relative py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                { }
                <SectionHeader
                    eyebrow="Top Classes"
                    title="Featured Classes"
                    accent="Featured"
                    subtitle="The most-booked sessions across the platform — ranked by what members are actually training in."
                />

                { }
                {classes.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
                        {classes.map((cls) => (
                            <FeaturedCard key={cls.id} cls={cls} />
                        ))}
                    </div>
                )}

                { }
                {classes.length > 0 && (
                    <div className="text-center mt-12">
                        <Link
                            href="/classes"
                            className="inline-flex items-center gap-2 text-[#cfc6b8] hover:text-[#E8C667] text-sm font-['Oswald'] tracking-[3px] uppercase no-underline transition-colors"
                        >
                            View all classes
                            <ArrowRight size={13} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}

 

function FeaturedCard({ cls }) {
    return (
        <article className={`group h-full flex flex-col bg-[#0a0a0a] border border-[#C9962E]/30 hover:border-[#C9962E]/70 transition-colors overflow-hidden ${CHAMFER_MD}`}>
            { }
            <div className="relative aspect-[16/10] bg-[#0f0f0f] overflow-hidden">
                {cls.image ? (
                    
                    <img
                        src={cls.image}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Dumbbell size={36} className="text-[#C9962E]/25" />
                    </div>
                )}
                <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/55 to-transparent pointer-events-none" />

                { }
                {cls.bookingCount > 0 && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-sm border border-[#E8C667]/50 text-[#E8C667] font-['Oswald'] text-[10px] font-bold tracking-[2px] uppercase [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]">
                        <Flame size={10} />
                        {cls.bookingCount} {cls.bookingCount === 1 ? "Booking" : "Bookings"}
                    </span>
                )}

                { }
                <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-1 bg-black/70 backdrop-blur-sm border border-[#C9962E]/30 text-[#cfc6b8] font-['Oswald'] text-[10px] font-semibold tracking-[2px] uppercase [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]">
                    {CATEGORY_LABELS[cls.category] || cls.category}
                </span>
            </div>

            { }
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-['Bebas_Neue'] text-2xl text-white tracking-wide leading-tight line-clamp-2 group-hover:text-[#E8C667] transition-colors">
                    {cls.title}
                </h3>

                { }
                <div className="flex items-center gap-2 mt-2">
                    <Avatar user={cls.trainer} size={20} />
                    <span className="text-[#cfc6b8] text-xs truncate">Coach {cls.trainer.name}</span>
                </div>

                { }
                <div className="flex items-center gap-4 mt-4 text-xs font-['Oswald'] tracking-[1px]">
                    <span className="inline-flex items-center gap-1.5 text-[#cfc6b8]">
                        <Clock size={12} className="text-[#E8C667]" />
                        {cls.duration} min
                    </span>
                    <span className="text-[#3a342c]">·</span>
                    <span className="inline-flex items-center gap-1.5 text-[#cfc6b8]">
                        <TrendingUp size={12} className="text-[#E8C667]" />
                        ${cls.price}
                    </span>
                </div>

                { }
                <div className="mt-auto pt-5">
                    <Link
                        href={`/classes/${cls.id}`}
                        className={`inline-flex items-center gap-2 px-4 py-2 font-['Oswald'] font-semibold text-[11px] tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.2)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_5px_16px_rgba(201,150,46,0.35)] transition-all ${CHAMFER_SM}`}
                    >
                        Details
                        <ArrowRight size={12} />
                    </Link>
                </div>
            </div>
        </article>
    );
}

 

export function SectionHeader({ eyebrow, title, accent, subtitle }) {
    
    const titleParts = accent ? title.split(accent) : [title];
    return (
        <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#E8C667]" />
                <span className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[4px] uppercase">
                    {eyebrow}
                </span>
                <div className="h-px w-8 bg-[#E8C667]" />
            </div>
            <h2 className="font-['Bebas_Neue'] text-4xl lg:text-5xl text-white tracking-wide leading-[1.05]">
                {titleParts[0]}
                {accent && (
                    <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent">
                        {accent}
                    </span>
                )}
                {titleParts[1]}
            </h2>
            {subtitle && (
                <p className="text-[#cfc6b8] text-base mt-4 leading-relaxed">{subtitle}</p>
            )}
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
            style={{ width: size, height: size, fontSize: size * 0.42 }}
        >
            {initials}
        </span>
    );
}

function EmptyState() {
    return (
        <div className={`mt-12 bg-[#0a0a0a] border border-[#C9962E]/15 py-16 px-8 text-center ${CHAMFER_MD}`}>
            <Dumbbell size={32} className="text-[#C9962E]/30 mx-auto mb-4" />
            <p className="text-[#7c7468] text-sm">No featured classes yet — check back soon.</p>
        </div>
    );
}