import { Search, CreditCard, Dumbbell } from "lucide-react";

import { SectionHeader } from "@/app/components/home/FeaturedClassesSection";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";

const STEPS = [
    {
        n: "01",
        Icon: Search,
        title: "Browse Classes",
        body: "Explore sessions across strength, cardio, HIIT, yoga, pilates, and mobility. Filter by category, search by trainer.",
    },
    {
        n: "02",
        Icon: CreditCard,
        title: "Book Your Spot",
        body: "One-tap secure checkout with Stripe. Instant confirmation — no waiting, no back-and-forth.",
    },
    {
        n: "03",
        Icon: Dumbbell,
        title: "Show Up & Train",
        body: "Find your class in your dashboard. Train alongside certified coaches who push you forward.",
    },
];

export default function HowItWorksSection() {
    return (
        <section className="relative py-20 lg:py-28 bg-[#070707]">
            {/* Faint top/bottom dividers */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#C9962E]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#C9962E]/15 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeader
                    eyebrow="The Process"
                    title="How It Works"
                    accent="Works"
                    subtitle="Three steps from curious visitor to committed athlete."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
                    {STEPS.map((step) => (
                        <Step key={step.n} step={step} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function Step({ step }) {
    const { n, Icon, title, body } = step;
    return (
        <div className={`relative bg-[#0a0a0a] border border-[#C9962E]/15 p-7 overflow-hidden ${CHAMFER_MD}`}>
            {/* Background number watermark */}
            <span
                className="absolute -top-4 -right-2 font-['Bebas_Neue'] text-[120px] leading-none text-[#C9962E]/5 select-none pointer-events-none"
                aria-hidden="true"
            >
                {n}
            </span>

            <div className="relative">
                <div className="inline-flex items-center justify-center h-12 w-12 bg-[#C9962E]/10 border border-[#C9962E]/30 text-[#E8C667] [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)] mb-5">
                    <Icon size={20} />
                </div>

                <p className="font-['Oswald'] text-[10px] font-semibold tracking-[3px] uppercase text-[#E8C667] mb-2">
                    Step {n}
                </p>
                <h3 className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-tight">
                    {title}
                </h3>
                <p className="text-[#cfc6b8] text-sm mt-3 leading-relaxed">{body}</p>
            </div>
        </div>
    );
}