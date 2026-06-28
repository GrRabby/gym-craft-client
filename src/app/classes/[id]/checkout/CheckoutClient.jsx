"use client";

import { useMemo } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import {
    ArrowLeft, Lock, Clock,
    Dumbbell, HeartPulse, Flame, Sparkles, Activity, Move,
} from "lucide-react";

const CATEGORY_META = {
    strength: { label: "Strength", Icon: Dumbbell },
    cardio:   { label: "Cardio",   Icon: HeartPulse },
    hiit:     { label: "HIIT",     Icon: Flame },
    yoga:     { label: "Yoga",     Icon: Sparkles },
    pilates:  { label: "Pilates",  Icon: Activity },
    mobility: { label: "Mobility", Icon: Move },
};

const DAY_LABEL = {
    mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);


function fmtUSD(amount) {
    return Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export default function CheckoutClient({ cls, clientSecret }) {
    const options = useMemo(() => ({ clientSecret }), [clientSecret]);

    const meta = CATEGORY_META[cls.category] || { label: cls.category, Icon: Dumbbell };
    const CatIcon = meta.Icon;

    return (
        <div className="bg-[#070707] min-h-screen">
            <div className="w-full mx-auto px-6 lg:px-10 pt-8 pb-20">
                <Link
                    href={`/classes/${cls.id}`}
                    className="inline-flex items-center gap-2 text-[#7c7468] hover:text-[#E8C667] text-xs font-['Oswald'] tracking-[2px] uppercase transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to class
                </Link>

                <div className="mt-6 mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-px w-10 bg-[#E8C667]" />
                        <span className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[5px] uppercase">
                            Complete Booking
                        </span>
                    </div>
                    <h1 className="font-['Bebas_Neue'] text-5xl lg:text-6xl tracking-wide leading-[0.9]">
                        <span className="text-white">Secure </span>
                        <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent">
                            Payment
                        </span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <aside className="lg:col-span-2">
                        <OrderSummary cls={cls} CatIcon={CatIcon} categoryLabel={meta.label} />
                    </aside>

                    <div className="lg:col-span-3">
                        <div className={`bg-[#0a0a0a] border border-[#C9962E]/20 p-6 lg:p-8 ${CHAMFER_MD}`}>
                            <h2 className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none">
                                Payment Details
                            </h2>
                            <p className="text-[#7c7468] text-[11px] font-['Oswald'] tracking-[2px] uppercase mt-2 mb-6 flex items-center gap-1.5">
                                <Lock size={11} className="text-[#E8C667]" />
                                Encrypted &amp; secured by Stripe
                            </p>

                            <div className="min-h-[400px] bg-white rounded-md overflow-hidden w-full">
                                <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                                    <EmbeddedCheckout />
                                </EmbeddedCheckoutProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrderSummary({ cls, CatIcon, categoryLabel }) {
    return (
        <div className={`bg-[#0a0a0a] border border-[#C9962E]/20 p-6 ${CHAMFER_MD} lg:sticky lg:top-24`}>
            {cls.image && (
                <div className={`relative aspect-[16/10] overflow-hidden mb-5 ${CHAMFER_SM}`}>
                    { }
                    <img src={cls.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                </div>
            )}

            <p className="font-['Oswald'] text-[10px] tracking-[3px] uppercase text-[#7c7468] mb-2">
                Order Summary
            </p>

            <h2 className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-tight">
                {cls.title}
            </h2>

            <p className="text-[#cfc6b8] text-sm mt-2">
                Coached by{" "}
                <span className="text-[#E8C667] font-semibold">{cls.trainer.name}</span>
            </p>

            <div className="mt-5 pt-5 border-t border-[#C9962E]/15 space-y-2.5 text-sm">
                <Row label="Category">
                    <span className="inline-flex items-center gap-1.5 text-[#cfc6b8]">
                        <CatIcon size={12} className="text-[#E8C667]" />
                        {categoryLabel}
                    </span>
                </Row>
                <Row label="Duration">
                    <span className="text-[#cfc6b8] inline-flex items-center gap-1.5">
                        <Clock size={12} className="text-[#E8C667]" />
                        {cls.duration} minutes
                    </span>
                </Row>
                <Row label="Difficulty">
                    <span className="text-[#cfc6b8] capitalize">{cls.difficulty}</span>
                </Row>
                <Row label="Schedule">
                    <span className="text-[#cfc6b8] text-right">
                        {cls.scheduleDays.map((d) => DAY_LABEL[d]).join(" · ")}
                        <br />
                        <span className="text-[#E8C667]">at {cls.scheduleTime}</span>
                    </span>
                </Row>
            </div>

            <div className="mt-5 pt-5 border-t border-[#C9962E]/15">
                <div className="flex items-baseline justify-between">
                    <span className="font-['Oswald'] text-xs tracking-[3px] uppercase text-[#7c7468]">
                        Total
                    </span>
                    <span className="font-['Bebas_Neue'] text-4xl bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent leading-none">
                        ${fmtUSD(cls.price)}{" "}
                        <span className="text-xs text-[#7c7468] font-sans font-normal">USD</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

function Row({ label, children }) {
    return (
        <div className="flex items-start justify-between gap-3">
            <span className="text-[#7c7468] shrink-0">{label}</span>
            {children}
        </div>
    );
}