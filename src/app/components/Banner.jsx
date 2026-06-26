'use client'
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const SLIDE_DURATION = 7000;

const SLIDES = [
    {
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
        eyebrow: "Strength Training",
        title1: "Forge Your",
        title2: "Limits.",
        description:
            "Train with elite coaches across 240+ weekly sessions. Pick your pace. Push your edge.",
    },
    {
        image: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=1920&q=80",
        eyebrow: "High Intensity",
        title1: "Sweat. Then",
        title2: "Sweat More.",
        description:
            "From HIIT to mobility flows, find the class that meets you where you are — then takes you further.",
    },
    {
        image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1920&q=80",
        eyebrow: "Recovery & Mobility",
        title1: "Recover Like",
        title2: "A Pro.",
        description:
            "Yoga, mobility, and active recovery. What you do between sets matters as much as the sets.",
    },
];

const KB_VARIANTS = ["animate-gc-kb-0", "animate-gc-kb-1", "animate-gc-kb-2"];

export default function GymCraftBanner() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const t = setTimeout(() => setActiveIndex((i) => (i + 1) % SLIDES.length), SLIDE_DURATION);
        return () => clearTimeout(t);
    }, [activeIndex, isPaused]);

    const goTo = useCallback((i) => {
        setActiveIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
    }, []);

    const slide = SLIDES[activeIndex];

    return (
        <section
            className="relative h-[85vh] min-h-[620px] w-full overflow-hidden bg-black isolate font-sans"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-label="Featured fitness classes"
        >
            {SLIDES.map((s, i) => (
                <div
                    key={i}
                    aria-hidden={i !== activeIndex}
                    style={{ backgroundImage: `url(${s.image})` }}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ease-out ${KB_VARIANTS[i % 3]} ${i === activeIndex ? "opacity-100 z-1" : "opacity-0 z-0"
                        }`}
                />
            ))}
            <div className="absolute inset-0 z-[2] bg-linear-to-r from-[#050505] via-[#050505]/75 to-[#050505]/15 pointer-events-none" />
            <div className="absolute inset-0 z-[2] bg-linear-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />

            <div
                className="absolute inset-0 z-[3] opacity-[0.08] pointer-events-none [mask-image:radial-gradient(ellipse_at_25%_50%,black_25%,transparent_70%)] [background-image:linear-gradient(rgba(247,228,163,1)_1px,transparent_1px),linear-gradient(90deg,rgba(247,228,163,1)_1px,transparent_1px)] [background-size:56px_56px]"
            />
            <div className="absolute -bottom-40 -left-40 z-[3] w-[640px] h-[440px] bg-[radial-gradient(closest-side,rgba(201,150,46,0.32),transparent)] blur-3xl pointer-events-none" />
            <div className="absolute top-0 inset-x-0 z-[4] h-px bg-linear-to-r from-transparent via-[#C9962E]/55 to-transparent" />

            <div className="relative z-[5] max-w-310 mx-auto px-6 h-full flex flex-col justify-center">
                {/* Force remount on slide change so the entrance animation re-fires */}
                <div key={activeIndex} className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-5 opacity-0 animate-gc-fade-up">
                        <div className="h-px w-10 bg-[#E8C667]" />
                        <span className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[5px] uppercase">
                            {slide.eyebrow}
                        </span>
                    </div>

                    <h1 className="font-['Bebas_Neue'] text-6xl sm:text-7xl lg:text-[7.5rem] leading-[0.92] tracking-wide mb-6">
                        <span className="block text-white opacity-0 animate-gc-fade-up [animation-delay:80ms]">
                            {slide.title1}
                        </span>
                        <span className="block bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent opacity-0 animate-gc-fade-up [animation-delay:160ms]">
                            {slide.title2}
                        </span>
                    </h1>

                    <p className="text-[#cfc6b8] text-base sm:text-lg max-w-xl leading-relaxed mb-10 opacity-0 animate-gc-fade-up [animation-delay:240ms]">
                        {slide.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 opacity-0 animate-gc-fade-up [animation-delay:320ms]">


                        <Link
                            href="/classes"
                        >
                            <Button
                                radius="none"
                                className="!font-['Oswald'] !font-semibold !text-base !tracking-[2px] !uppercase !text-[#1a1304] !bg-linear-to-br !from-[#F7E4A3] !via-[#E8C667] !to-[#C9962E] !h-auto !py-3.5 !px-7 [clip-path:polygon(11px_0,100%_0,100%_calc(100%-11px),calc(100%-11px)_100%,0_100%,0_11px)] !shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_6px_22px_rgba(201,150,46,0.35)] hover:-translate-y-0.5 transition-transform"
                            >
                                Explore Classes <ArrowRight size={16} />
                            </Button>

                        </Link>
                    </div>

                    <div className="hidden sm:flex items-center gap-8 mt-12 pt-6 border-t border-[#C9962E]/15 max-w-md opacity-0 animate-gc-fade-up [animation-delay:400ms]">
                        <Stat value="240+" label="Weekly Classes" />
                        <Stat value="86" label="Certified Trainers" />
                        <Stat value="12K" label="Members" />
                    </div>
                </div>
            </div>

            <Button
                isIconOnly
                radius="none"
                onPress={() => goTo(activeIndex - 1)}
                aria-label="Previous slide"
                className="!absolute z-[6] left-3 sm:left-6 top-1/2 -translate-y-1/2 !h-12 !w-12 !min-w-0 !border !border-[#C9962E]/30 hover:!border-[#E8C667] !text-[#cfc6b8] hover:!text-white !bg-black/30 hover:!bg-black/60 !backdrop-blur-sm !hidden md:!flex [clip-path:polygon(9px_0,100%_0,100%_calc(100%-9px),calc(100%-9px)_100%,0_100%,0_9px)]"
            >
                <ChevronLeft size={20} />
            </Button>
            <Button
                isIconOnly
                radius="none"
                onPress={() => goTo(activeIndex + 1)}
                aria-label="Next slide"
                className="!absolute z-[6] right-3 sm:right-6 top-1/2 -translate-y-1/2 !h-12 !w-12 !min-w-0 !border !border-[#C9962E]/30 hover:!border-[#E8C667] !text-[#cfc6b8] hover:!text-white !bg-black/30 hover:!bg-black/60 !backdrop-blur-sm !hidden md:!flex [clip-path:polygon(9px_0,100%_0,100%_calc(100%-9px),calc(100%-9px)_100%,0_100%,0_9px)]"
            >
                <ChevronRight size={20} />
            </Button>

            <div className="absolute z-[6] bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
                {SLIDES.map((_, i) => {
                    const isActive = i === activeIndex;
                    return (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            aria-current={isActive ? "true" : undefined}
                            className={`relative h-1.5 transition-all duration-500 cursor-pointer ${isActive ? "w-14 bg-[#C9962E]/30" : "w-6 bg-[#C9962E]/25 hover:bg-[#C9962E]/45"
                                }`}
                        >
                            {isActive && (
                                <span
                                    key={`fill-${activeIndex}`}
                                    style={{
                                        animationDuration: `${SLIDE_DURATION}ms`,
                                        animationPlayState: isPaused ? "paused" : "running",
                                    }}
                                    className="absolute inset-y-0 left-0 w-full origin-left bg-linear-to-r from-[#F7E4A3] to-[#C9962E] animate-gc-progress"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

function Stat({ value, label }) {
    return (
        <div>
            <div className="font-['Bebas_Neue'] text-3xl text-[#E8C667] leading-none">{value}</div>
            <div className="font-['Oswald'] text-[10px] tracking-[2px] uppercase text-[#8c8478] mt-1">{label}</div>
        </div>
    );
}