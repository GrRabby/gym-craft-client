"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Calculator, Ruler, Weight, ArrowRight, Activity, Info,
} from "lucide-react";

import { SectionHeader } from "@/app/components/home/FeaturedClassesSection";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";


const CATEGORIES = [
    {
        label:   "Underweight",
        max:     18.5,
        color:   "#7c9cb8",
        message: "Build strength with progressive strength training. Pair classes with proper nutrition.",
    },
    {
        label:   "Healthy",
        max:     25,
        color:   "#4ade80",
        message: "You're in a healthy range. Keep training across disciplines to maintain it.",
    },
    {
        label:   "Overweight",
        max:     30,
        color:   "#E8C667",
        message: "HIIT and cardio classes can help. Consistency beats intensity — start small.",
    },
    {
        label:   "Obese",
        max:     Infinity,
        color:   "#ff5a5a",
        message: "Reach out to a coach for a personalized plan. Every journey starts with one step.",
    },
];


const SCALE_MIN = 15;
const SCALE_MAX = 40;

function categoryFor(bmi) {
    if (bmi == null) return null;
    return CATEGORIES.find((c) => bmi < c.max);
}

function bmiToScalePercent(bmi) {
    if (bmi == null) return 0;
    const clamped = Math.max(SCALE_MIN, Math.min(SCALE_MAX, bmi));
    return ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
}

export default function BmiCalculatorSection() {
    const [unit, setUnit]         = useState("metric");
    const [heightCm, setHeightCm] = useState("");
    const [heightFt, setHeightFt] = useState("");
    const [heightIn, setHeightIn] = useState("");
    const [weight, setWeight]     = useState("");

    const bmi = useMemo(() => {
        const w = parseFloat(weight);
        if (!w || w <= 0) return null;

        if (unit === "metric") {
            const cm = parseFloat(heightCm);
            if (!cm || cm <= 0) return null;
            const meters = cm / 100;
            return w / (meters * meters);
        }

        const ft  = parseFloat(heightFt) || 0;
        const inc = parseFloat(heightIn) || 0;
        const totalInches = ft * 12 + inc;
        if (totalInches <= 0) return null;
        return (703 * w) / (totalInches * totalInches);
    }, [unit, heightCm, heightFt, heightIn, weight]);

    const category    = useMemo(() => categoryFor(bmi), [bmi]);
    const markerLeft  = useMemo(() => bmiToScalePercent(bmi), [bmi]);

    function reset() {
        setHeightCm("");
        setHeightFt("");
        setHeightIn("");
        setWeight("");
    }

    return (
        <section className="relative py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeader
                    eyebrow="Health Insights"
                    title="Calculate Your BMI"
                    accent="BMI"
                    subtitle="A quick check-in on where you stand. Body Mass Index is a starting point, not a verdict."
                />

                <div className={`mt-14 bg-[#0a0a0a] border border-[#C9962E]/30 overflow-hidden ${CHAMFER_MD}`}>
                    { }
                    <div className="relative">
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#E8C667]/8 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#C9962E]/6 blur-3xl pointer-events-none" />

                        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">
                            { }
                            <div className="p-7 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#C9962E]/15">
                                { }
                                <div className="flex items-center gap-2 mb-7">
                                    <UnitButton
                                        active={unit === "metric"}
                                        onClick={() => { setUnit("metric"); }}
                                    >
                                        Metric (cm · kg)
                                    </UnitButton>
                                    <UnitButton
                                        active={unit === "imperial"}
                                        onClick={() => { setUnit("imperial"); }}
                                    >
                                        Imperial (ft · lbs)
                                    </UnitButton>
                                </div>

                                { }
                                <div className="mb-5">
                                    <label className="block font-['Oswald'] text-[10px] font-semibold tracking-[3px] uppercase text-[#7c7468] mb-2.5">
                                        <Ruler size={11} className="inline mr-1.5 -mt-0.5" />
                                        Height
                                    </label>

                                    {unit === "metric" ? (
                                        <Field
                                            type="number"
                                            value={heightCm}
                                            onChange={(e) => setHeightCm(e.target.value)}
                                            placeholder="170"
                                            suffix="cm"
                                            min="50"
                                            max="250"
                                        />
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            <Field
                                                type="number"
                                                value={heightFt}
                                                onChange={(e) => setHeightFt(e.target.value)}
                                                placeholder="5"
                                                suffix="ft"
                                                min="2"
                                                max="8"
                                            />
                                            <Field
                                                type="number"
                                                value={heightIn}
                                                onChange={(e) => setHeightIn(e.target.value)}
                                                placeholder="9"
                                                suffix="in"
                                                min="0"
                                                max="11"
                                            />
                                        </div>
                                    )}
                                </div>

                                { }
                                <div>
                                    <label className="block font-['Oswald'] text-[10px] font-semibold tracking-[3px] uppercase text-[#7c7468] mb-2.5">
                                        <Weight size={11} className="inline mr-1.5 -mt-0.5" />
                                        Weight
                                    </label>
                                    <Field
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder={unit === "metric" ? "70" : "154"}
                                        suffix={unit === "metric" ? "kg" : "lbs"}
                                        min="20"
                                        max="500"
                                    />
                                </div>

                                { }
                                {(heightCm || heightFt || heightIn || weight) && (
                                    <button
                                        type="button"
                                        onClick={reset}
                                        className="mt-6 inline-flex items-center gap-1.5 text-[#7c7468] hover:text-[#E8C667] text-xs font-['Oswald'] tracking-[2px] uppercase cursor-pointer transition-colors"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            { }
                            <div className="p-7 lg:p-10 flex flex-col">
                                {bmi == null ? (
                                    <EmptyResult />
                                ) : (
                                    <FilledResult
                                        bmi={bmi}
                                        category={category}
                                        markerLeft={markerLeft}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                { }
                <p className="text-[#5a5247] text-xs text-center mt-6 max-w-2xl mx-auto leading-relaxed inline-flex items-start gap-2 justify-center">
                    <Info size={11} className="mt-0.5 shrink-0" />
                    <span>
                        BMI is a screening tool, not a diagnosis. Muscle mass, body
                        composition, and individual factors aren&apos;t reflected here.
                        Consult a coach or healthcare provider for personalized guidance.
                    </span>
                </p>
            </div>
        </section>
    );
}

 

function UnitButton({ children, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center gap-2 px-4 py-2 font-['Oswald'] font-semibold text-[10px] tracking-[2px] uppercase cursor-pointer transition-all border ${CHAMFER_SM} ${
                active
                    ? "bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] border-transparent text-[#1a1304]"
                    : "bg-[#0f0f0f] border-[#C9962E]/20 text-[#cfc6b8] hover:border-[#C9962E]/50 hover:text-white"
            }`}
        >
            {children}
        </button>
    );
}

function Field({ value, onChange, placeholder, suffix, ...rest }) {
    return (
        <div className="relative">
            <input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-[#050505] border border-[#C9962E]/20 text-white placeholder:text-[#3a342c] text-lg font-['Oswald'] px-4 py-3 pr-14 outline-none focus:border-[#E8C667]/60 transition-colors ${CHAMFER_SM}`}
                {...rest}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7c7468] text-xs font-['Oswald'] tracking-wider uppercase pointer-events-none">
                {suffix}
            </span>
        </div>
    );
}

 

function EmptyResult() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[260px]">
            <div className="inline-flex items-center justify-center h-14 w-14 mb-4 bg-[#C9962E]/5 border border-[#C9962E]/20 rounded-full">
                <Calculator size={22} className="text-[#C9962E]/50" />
            </div>
            <p className="font-['Bebas_Neue'] text-2xl text-[#cfc6b8] tracking-wide leading-tight">
                Enter your details
            </p>
            <p className="text-[#5a5247] text-xs mt-2 max-w-xs">
                Fill in height and weight to see your BMI and category.
            </p>
        </div>
    );
}

function FilledResult({ bmi, category, markerLeft }) {
    return (
        <div className="flex-1 flex flex-col">
            { }
            <div className="flex items-baseline gap-3">
                <span
                    className="font-['Bebas_Neue'] text-7xl leading-none"
                    style={{ color: category.color }}
                >
                    {bmi.toFixed(1)}
                </span>
                <span className="font-['Oswald'] text-xs tracking-[3px] uppercase text-[#7c7468]">
                    BMI
                </span>
            </div>

            { }
            <div className="mt-3">
                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-['Oswald'] text-xs font-bold tracking-[2px] uppercase ${CHAMFER_SM}`}
                    style={{
                        background: `${category.color}15`,
                        border:     `1px solid ${category.color}50`,
                        color:      category.color,
                    }}
                >
                    <Activity size={11} />
                    {category.label}
                </span>
            </div>

            { }
            <div className="mt-7">
                <div className={`relative h-2.5 bg-[#0f0f0f] overflow-hidden ${CHAMFER_SM}`}>
                    { }
                    {CATEGORIES.map((cat, i) => {
                        const prevMax = i === 0 ? SCALE_MIN : CATEGORIES[i - 1].max;
                        const start   = Math.max(SCALE_MIN, prevMax);
                        const end     = Math.min(SCALE_MAX, cat.max);
                        if (start >= end) return null;
                        const left  = ((start - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
                        const width = ((end - start) / (SCALE_MAX - SCALE_MIN)) * 100;
                        return (
                            <div
                                key={cat.label}
                                className="absolute h-full"
                                style={{
                                    left:       `${left}%`,
                                    width:      `${width}%`,
                                    background: `${cat.color}45`,
                                }}
                            />
                        );
                    })}

                    { }
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-1 bg-white rounded-full shadow-[0_0_0_2px_#0a0a0a]"
                        animate={{ left: `${markerLeft}%` }}
                        transition={{ type: "spring", stiffness: 200, damping: 22 }}
                    />
                </div>

                { }
                <div className="flex justify-between mt-2 text-[9px] font-['Oswald'] tracking-[1px] uppercase text-[#5a5247]">
                    <span>{SCALE_MIN}</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>{SCALE_MAX}+</span>
                </div>
            </div>

            { }
            <p className="text-[#cfc6b8] text-sm leading-relaxed mt-6">
                {category.message}
            </p>

            { }
            <div className="mt-auto pt-6">
                <Link
                    href="/classes"
                    className={`inline-flex items-center gap-2 px-5 py-2.5 font-['Oswald'] font-semibold text-xs tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.2)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_5px_16px_rgba(201,150,46,0.35)] transition-all ${CHAMFER_SM}`}
                >
                    Find Classes For You
                    <ArrowRight size={12} />
                </Link>
            </div>
        </div>
    );
}