import Link from "next/link";
import {
    Dumbbell, Heart, Flame, Flower2, Wind, Repeat, ArrowRight,
} from "lucide-react";

import { SectionHeader } from "@/app/components/home/FeaturedClassesSection";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";

const CATEGORIES = [
    {
        slug: "strength",
        Icon: Dumbbell,
        label: "Strength",
        tagline: "Heavy compounds. Real iron.",
    },
    {
        slug: "cardio",
        Icon: Heart,
        label: "Cardio",
        tagline: "Endurance, intervals, output.",
    },
    {
        slug: "hiit",
        Icon: Flame,
        label: "HIIT",
        tagline: "Short bursts. Maximum effort.",
    },
    {
        slug: "yoga",
        Icon: Flower2,
        label: "Yoga",
        tagline: "Flow, breath, recovery.",
    },
    {
        slug: "pilates",
        Icon: Wind,
        label: "Pilates",
        tagline: "Core control, precision.",
    },
    {
        slug: "mobility",
        Icon: Repeat,
        label: "Mobility",
        tagline: "Range, joints, longevity.",
    },
];

export default function CategoriesSection() {
    return (
        <section className="relative py-20 lg:py-28 bg-[#070707]">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#C9962E]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#C9962E]/15 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeader
                    eyebrow="Train Your Way"
                    title="Six Disciplines"
                    accent="Disciplines"
                    subtitle="Pick the path that matches your goal — or rotate between them. Every category, one membership."
                />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-14">
                    {CATEGORIES.map((cat) => (
                        <CategoryTile key={cat.slug} cat={cat} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/classes"
                        className="inline-flex items-center gap-2 text-[#cfc6b8] hover:text-[#E8C667] text-sm font-['Oswald'] tracking-[3px] uppercase no-underline transition-colors"
                    >
                        Explore all classes
                        <ArrowRight size={13} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function CategoryTile({ cat }) {
    const { slug, Icon, label, tagline } = cat;
    return (
        <Link
            href={`/classes?category=${slug}`}
            className={`group relative bg-[#0a0a0a] border border-[#C9962E]/20 hover:border-[#C9962E]/40 transition-all p-6 overflow-hidden no-underline hover:-translate-y-1 ${CHAMFER_MD}`}
        >
            { }
            <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-[#E8C667]/0 group-hover:bg-[#E8C667]/15 blur-2xl transition-colors pointer-events-none" />

            <div className="relative flex items-start justify-between">
                <div>
                    <div className="inline-flex items-center justify-center h-11 w-11 bg-[#C9962E]/10 border border-[#C9962E]/30 text-[#E8C667] group-hover:bg-[#C9962E]/20 transition-colors [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)] mb-4">
                        <Icon size={20} />
                    </div>
                    <h3 className="font-['Bebas_Neue'] text-2xl text-white tracking-wide leading-none group-hover:text-[#E8C667] transition-colors">
                        {label}
                    </h3>
                    <p className="text-[#7c7468] text-xs mt-2 leading-relaxed">{tagline}</p>
                </div>
                <ArrowRight
                    size={14}
                    className="text-[#5a5247] group-hover:text-[#E8C667] group-hover:translate-x-0.5 transition-all mt-1"
                />
            </div>
        </Link>
    );
}