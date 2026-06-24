"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
    Dumbbell, HeartPulse, Flame, Sparkles, Activity, Move,
    Clock, Award, CheckCircle2, XCircle, AlertCircle, ArrowRight, RefreshCw,
} from "lucide-react";
import { applyAsTrainerAction } from "@/actions/trainer-applications";

const SPECIALTIES = [
    { value: "strength", label: "Strength",  Icon: Dumbbell,    blurb: "Powerlifting, hypertrophy, free weights" },
    { value: "cardio",   label: "Cardio",    Icon: HeartPulse,  blurb: "Running, cycling, endurance work" },
    { value: "hiit",     label: "HIIT",      Icon: Flame,       blurb: "High-intensity interval training" },
    { value: "yoga",     label: "Yoga",      Icon: Sparkles,    blurb: "Vinyasa, ashtanga, restorative" },
    { value: "pilates",  label: "Pilates",   Icon: Activity,    blurb: "Mat, reformer, core conditioning" },
    { value: "mobility", label: "Mobility",  Icon: Move,        blurb: "Recovery, stretching, foam work" },
];

const SPECIALTY_LABEL = Object.fromEntries(SPECIALTIES.map((s) => [s.value, s.label]));

export default function ApplyTrainerForm({ initialApplication }) {
    const [application, setApplication] = useState(initialApplication);

    // Show status when an application exists and isn't being "reapplied"
    if (application) {
        return (
            <ApplicationStatus
                application={application}
                onReapply={() => setApplication(null)}
            />
        );
    }

    return <Form onSubmitted={(app) => setApplication(app)} />;
}

/* ---------- The form ---------- */

function Form({ onSubmitted }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const {
        register, handleSubmit, control,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onTouched",
        defaultValues: { experience: 1, specialty: "" },
    });

    const onSubmit = (values) => {
        startTransition(async () => {
            const res = await applyAsTrainerAction(values);
            if (res?.ok) {
                toast.success("Application submitted. Our team will review it shortly.");
                onSubmitted(res.application);
                router.refresh();
                return;
            }
            if (res?.blocked) {
                toast.error("Action restricted by Admin");
                return;
            }
            toast.error(res?.error || "Failed to submit application.");
        });
    };

    const busy = isPending || isSubmitting;

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-[#E8C667]" />
                <span className="font-['Oswald'] text-[#E8C667] text-[10px] font-semibold tracking-[4px] uppercase">
                    Trainer Application
                </span>
            </div>
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide text-white leading-none">
                Step up to <span className="text-[#E8C667]">coach.</span>
            </h2>
            <p className="text-[#8c8478] text-sm mt-3 max-w-xl">
                Tell us how long you&apos;ve been training and what you&apos;re best at.
                We&apos;ll review applications within a few business days.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-9">
                {/* Experience */}
                <div>
                    <label htmlFor="experience" className="block font-['Oswald'] text-[#cfc6b8] text-xs font-semibold tracking-[3px] uppercase mb-2">
                        Years of Experience
                    </label>
                    <div className={`relative bg-[#070707] border-t border-t-black/80 border-x border-x-[#1a1612] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] transition-colors focus-within:border-b-[#E8C667]/70 border-b ${errors.experience ? "border-b-[#ff5a5a]/70" : "border-b-[#2a2218]"}`}>
                        <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c7468] pointer-events-none" />
                        <input
                            id="experience"
                            type="number"
                            min={0}
                            max={60}
                            step={1}
                            placeholder="e.g. 3"
                            {...register("experience", {
                                required: "Experience is required",
                                valueAsNumber: true,
                                min: { value: 0, message: "Must be 0 or more" },
                                max: { value: 60, message: "That can't be right" },
                            })}
                            className="w-full bg-transparent text-white placeholder:text-[#4a4339] text-[15px] outline-none pl-10 pr-3 py-3"
                        />
                    </div>
                    <p className="text-[#5a5247] text-[11px] mt-1.5">
                        Include any coaching, personal training, or competitive experience.
                    </p>
                    {errors.experience && (
                        <p className="text-[#ff8585] text-xs mt-1.5">{errors.experience.message}</p>
                    )}
                </div>

                {/* Specialty pills */}
                <div>
                    <label className="block font-['Oswald'] text-[#cfc6b8] text-xs font-semibold tracking-[3px] uppercase mb-3">
                        Your Specialty
                    </label>

                    <Controller
                        name="specialty"
                        control={control}
                        rules={{ required: "Pick the specialty you want to coach" }}
                        render={({ field }) => (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {SPECIALTIES.map(({ value, label, Icon, blurb }) => {
                                    const selected = field.value === value;
                                    return (
                                        <button
                                            type="button"
                                            key={value}
                                            onClick={() => field.onChange(value)}
                                            aria-pressed={selected}
                                            className={`group text-left p-4 transition-all cursor-pointer
                                                [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]
                                                ${selected
                                                    ? "bg-linear-to-br from-[#C9962E]/25 via-[#C9962E]/10 to-transparent border border-[#E8C667]/55 shadow-[inset_0_1px_0_rgba(247,228,163,0.15),0_4px_18px_rgba(201,150,46,0.18)]"
                                                    : "bg-white/[0.02] border border-[#C9962E]/20 hover:border-[#C9962E]/50"
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className={`inline-flex items-center justify-center h-10 w-10 shrink-0 transition-all [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)] ${
                                                    selected
                                                        ? "bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                                                        : "bg-[#0f0f0f] border border-[#C9962E]/25 text-[#cfc6b8] group-hover:text-[#E8C667]"
                                                }`}>
                                                    <Icon size={18} strokeWidth={selected ? 2.2 : 1.8} />
                                                </span>
                                                <div className="min-w-0">
                                                    <div className={`font-['Oswald'] text-sm tracking-[1.5px] uppercase font-semibold ${selected ? "text-white" : "text-[#cfc6b8]"}`}>
                                                        {label}
                                                    </div>
                                                    <p className="text-[#7c7468] text-xs mt-1 leading-relaxed">{blurb}</p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    />
                    {errors.specialty && (
                        <p className="text-[#ff8585] text-xs mt-2">{errors.specialty.message}</p>
                    )}
                </div>

                {/* Info banner */}
                <div className="flex items-start gap-3 p-4 bg-[#C9962E]/5 border-l-2 border-[#C9962E]/50">
                    <AlertCircle size={16} className="text-[#E8C667] mt-0.5 shrink-0" />
                    <p className="text-[#cfc6b8] text-xs leading-relaxed">
                        Once submitted, your application enters a <span className="text-[#E8C667] font-medium">pending</span> review.
                        You&apos;ll be notified by email when it&apos;s approved or if we need more info.
                    </p>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex items-center gap-2 font-['Oswald'] font-semibold text-sm tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] border-none cursor-pointer py-3 px-7 [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_18px_rgba(201,150,46,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_28px_rgba(201,150,46,0.42)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                    {busy ? "Submitting…" : "Submit Application"}
                    {!busy && <ArrowRight size={14} />}
                </button>
            </form>
        </div>
    );
}


function ApplicationStatus({ application, onReapply }) {
    const { status, experience, specialty, createdAt, rejectionReason } = application;

    const presets = {
        pending: {
            Icon: Clock,
            label: "Under Review",
            tone: "text-[#E8C667]",
            ring: "border-[#C9962E]/50",
            bg: "bg-[#C9962E]/8",
            blurb: "Your application is in the queue. Our team typically responds within a few business days.",
        },
        approved: {
            Icon: CheckCircle2,
            label: "Approved",
            tone: "text-[#4ade80]",
            ring: "border-[#4ade80]/50",
            bg: "bg-[#4ade80]/8",
            blurb: "Welcome to the coaching team. You'll find trainer tools in the sidebar after your next login.",
        },
        rejected: {
            Icon: XCircle,
            label: "Not Approved",
            tone: "text-[#ff8585]",
            ring: "border-[#ff5a5a]/50",
            bg: "bg-[#ff5a5a]/8",
            blurb: rejectionReason
                ? `Reason: ${rejectionReason}`
                : "We weren't able to approve this application. You're welcome to apply again with updated details.",
        },
    };

    const p = presets[status] || presets.pending;
    const Icon = p.Icon;

    const submitted = new Date(createdAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-[#E8C667]" />
                <span className="font-['Oswald'] text-[#E8C667] text-[10px] font-semibold tracking-[4px] uppercase">
                    Trainer Application
                </span>
            </div>
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide text-white leading-none">
                Your <span className="text-[#E8C667]">application.</span>
            </h2>

            {/* Status card */}
            <div className={`mt-8 p-6 border ${p.ring} ${p.bg} [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]`}>
                <div className="flex items-start gap-4">
                    <span className={`inline-flex items-center justify-center h-12 w-12 shrink-0 border ${p.ring} ${p.bg} [clip-path:polygon(7px_0,100%_0,100%_calc(100%-7px),calc(100%-7px)_100%,0_100%,0_7px)]`}>
                        <Icon size={22} className={p.tone} />
                    </span>
                    <div>
                        <p className="font-['Oswald'] text-[10px] tracking-[3px] uppercase text-[#7c7468] mb-1">
                            Status
                        </p>
                        <p className={`font-['Bebas_Neue'] text-3xl tracking-wide ${p.tone} leading-none`}>
                            {p.label}
                        </p>
                        <p className="text-[#cfc6b8] text-sm mt-3 leading-relaxed">{p.blurb}</p>
                    </div>
                </div>
            </div>

            {/* Submitted details */}
            <div className="mt-6 p-6 bg-[#0a0a0a] border border-[#C9962E]/15">
                <p className="font-['Oswald'] text-[10px] tracking-[3px] uppercase text-[#7c7468] mb-4">
                    What you submitted
                </p>
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Detail Icon={Clock} label="Experience" value={`${experience} ${experience === 1 ? "year" : "years"}`} />
                    <Detail Icon={Award} label="Specialty" value={SPECIALTY_LABEL[specialty] || specialty} />
                    <Detail Icon={ArrowRight} label="Submitted" value={submitted} />
                </dl>
            </div>

            {/* Reapply (only if rejected) */}
            {status === "rejected" && (
                <button
                    onClick={onReapply}
                    className="mt-6 inline-flex items-center gap-2 font-['Oswald'] font-semibold text-sm tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] border-none cursor-pointer py-3 px-6 [clip-path:polygon(9px_0,100%_0,100%_calc(100%-9px),calc(100%-9px)_100%,0_100%,0_9px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_18px_rgba(201,150,46,0.3)] transition-all hover:-translate-y-0.5"
                >
                    <RefreshCw size={14} />
                    Apply Again
                </button>
            )}
        </div>
    );
}

function Detail({ Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <Icon size={16} className="text-[#E8C667] mt-0.5 shrink-0" />
            <div>
                <dt className="font-['Oswald'] text-[10px] tracking-[2px] uppercase text-[#7c7468]">{label}</dt>
                <dd className="text-white text-sm font-medium mt-0.5">{value}</dd>
            </div>
        </div>
    );
}