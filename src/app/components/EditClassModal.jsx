"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Dumbbell, HeartPulse, Flame, Sparkles, Activity, Move,
    Clock, DollarSign, Upload, X, Calendar, ArrowRight, ImageIcon, Loader2
} from "lucide-react";
import { updateClassAction } from "@/actions/trainer/classes";

const CATEGORIES = [
    { value: "strength", label: "Strength", Icon: Dumbbell },
    { value: "cardio",   label: "Cardio",   Icon: HeartPulse },
    { value: "hiit",     label: "HIIT",     Icon: Flame },
    { value: "yoga",     label: "Yoga",     Icon: Sparkles },
    { value: "pilates",  label: "Pilates",  Icon: Activity },
    { value: "mobility", label: "Mobility", Icon: Move },
];

const DIFFICULTIES = [
    { value: "beginner",     label: "Beginner",     hint: "New to this" },
    { value: "intermediate", label: "Intermediate", hint: "Steady practice" },
    { value: "advanced",     label: "Advanced",     hint: "Serious training" },
];

const DAYS = [
    { value: "mon", short: "Mon" },
    { value: "tue", short: "Tue" },
    { value: "wed", short: "Wed" },
    { value: "thu", short: "Thu" },
    { value: "fri", short: "Fri" },
    { value: "sat", short: "Sat" },
    { value: "sun", short: "Sun" },
];

export default function EditClassModal({ cls, isOpen, onClose }) {
    const fileInputRef = useRef(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(cls?.image || null);
    const [category, setCategory] = useState(cls?.category || "");
    const [difficulty, setDifficulty] = useState(cls?.difficulty || "");
    const [selectedDays, setSelectedDays] = useState(cls?.scheduleDays || []);
    const [isPending, startTransition] = useTransition();

    const {
        register, handleSubmit, reset,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
        defaultValues: {
            title: cls?.title || "",
            description: cls?.description || "",
            duration: cls?.duration || 60,
            price: cls?.price || 0,
            scheduleTime: cls?.scheduleTime || "07:00",
        }
    });

    
    useEffect(() => {
        if (cls) {
            reset({
                title: cls.title,
                description: cls.description,
                duration: cls.duration,
                price: cls.price,
                scheduleTime: cls.scheduleTime,
            });
            setCategory(cls.category);
            setDifficulty(cls.difficulty);
            setSelectedDays(cls.scheduleDays || []);
            setImagePreview(cls.image);
            setImageFile(null);
        }
    }, [cls, reset]);

    
    useEffect(() => {
        if (!isOpen) return;
        const onEsc = (e) => e.key === "Escape" && !isPending && onClose();
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [isOpen, isPending, onClose]);

    
    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen || !cls) return null;

    const handleImageChange = (file) => {
        if (!file) {
            setImageFile(null);
            setImagePreview(null);
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be under 5MB.");
            return;
        }
        if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
            toast.error("Only PNG, JPG, or WEBP images allowed.");
            return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const toggleDay = (day) =>
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );

    const onSubmit = (values) => {
        if (!category)                return toast.error("Pick a category.");
        if (!difficulty)              return toast.error("Pick a difficulty level.");
        if (selectedDays.length === 0) return toast.error("Pick at least one schedule day.");

        const fd = new FormData();
        fd.append("title", values.title);
        fd.append("description", values.description);
        fd.append("category", category);
        fd.append("difficulty", difficulty);
        fd.append("duration", values.duration);
        fd.append("price", values.price);
        fd.append("scheduleTime", values.scheduleTime);
        selectedDays.forEach((d) => fd.append("scheduleDays", d));
        
        if (imageFile) {
            fd.append("image", imageFile);
        }

        startTransition(async () => {
            const res = await updateClassAction(cls.id, fd);
            if (res?.ok) {
                toast.success("Class updated and submitted for review.");
                onClose();
                return;
            }
            if (res?.blocked) {
                toast.error("Action restricted by Admin");
                return;
            }
            toast.error(res?.error || "Failed to update class.");
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            { }
            <div
                onClick={!isPending ? onClose : undefined}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                aria-hidden="true"
            />

            { }
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-class-modal-title"
                className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-[#C9962E]/30 shadow-[0_30px_80px_rgba(0,0,0,0.7),0_0_60px_rgba(201,150,46,0.08)] [clip-path:polygon(14px_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%,0_14px)]"
            >
                { }
                <div className="sticky top-0 z-10 bg-[#0a0a0a] flex items-start justify-between gap-4 p-6 border-b border-[#C9962E]/15">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-px w-6 bg-[#E8C667]" />
                            <span className="font-['Oswald'] text-[#E8C667] text-[10px] font-semibold tracking-[4px] uppercase">
                                Update Class
                            </span>
                        </div>
                        <h2 id="edit-class-modal-title" className="font-['Bebas_Neue'] text-3xl tracking-wide text-white leading-none truncate">
                            Edit <span className="text-[#E8C667]">{cls.title}</span>
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        aria-label="Close"
                        className="text-[#7c7468] hover:text-white p-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                { }
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                    { }
                    <Section title="Class Image" subtitle="Optional. Change your class cover image (PNG, JPG, or WEBP under 5MB).">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(e) => handleImageChange(e.target.files?.[0])}
                            className="hidden"
                        />
                        {!imagePreview ? (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="group w-full aspect-[2/1] border-2 border-dashed border-[#C9962E]/30 hover:border-[#E8C667]/60 bg-black/40 hover:bg-black/60 transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer"
                            >
                                <span className="inline-flex items-center justify-center h-14 w-14 bg-linear-to-br from-[#F7E4A3]/10 via-[#E8C667]/10 to-[#C9962E]/10 border border-[#C9962E]/30 group-hover:border-[#E8C667] [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)] transition-colors">
                                    <ImageIcon size={22} className="text-[#E8C667]" />
                                </span>
                                <span className="font-['Oswald'] text-xs tracking-[3px] uppercase text-[#cfc6b8] group-hover:text-white">
                                    Click to upload image
                                </span>
                                <span className="text-[#7c7468] text-xs">Recommended 1200 × 720</span>
                            </button>
                        ) : (
                            <div className="relative aspect-[2/1] overflow-hidden border border-[#C9962E]/40 [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]">
                                { }
                                <img src={imagePreview} alt="Class preview" className="absolute inset-0 w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleImageChange(null)}
                                    aria-label="Remove image"
                                    className="absolute top-3 right-3 h-9 w-9 inline-flex items-center justify-center bg-black/70 backdrop-blur-sm border border-[#ff5a5a]/50 text-[#ff8585] hover:bg-[#ff5a5a]/20 hover:border-[#ff5a5a] cursor-pointer transition-colors"
                                >
                                    <X size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-sm border border-[#C9962E]/40 hover:border-[#E8C667] text-[#cfc6b8] hover:text-white font-['Oswald'] text-[11px] tracking-[2px] uppercase cursor-pointer transition-colors"
                                >
                                    <Upload size={11} />
                                    Change Image
                                </button>
                            </div>
                        )}
                    </Section>

                    { }
                    <Section title="Basic Info" subtitle="Keep title clear and description detailed.">
                        <div className="space-y-4">
                            <Field id="title" label="Class Name" error={errors.title?.message}>
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="e.g. Sunrise Strength Lab"
                                    {...register("title", {
                                        required: "Class name is required",
                                        minLength: { value: 3, message: "At least 3 characters" },
                                        maxLength: { value: 80, message: "Keep it under 80 characters" },
                                    })}
                                    className="w-full bg-transparent text-white placeholder:text-[#4a4339] text-[15px] outline-none px-3 py-3"
                                />
                            </Field>
                            <Field id="description" label="Description" error={errors.description?.message}>
                                <textarea
                                    id="description"
                                    rows={4}
                                    placeholder="Tell members what makes this class worth showing up for…"
                                    {...register("description", {
                                        required: "Description is required",
                                        minLength: { value: 20, message: "At least 20 characters" },
                                        maxLength: { value: 1000, message: "Keep it under 1000 characters" },
                                    })}
                                    className="w-full bg-transparent text-white placeholder:text-[#4a4339] text-[15px] outline-none px-3 py-3 resize-none"
                                />
                            </Field>
                        </div>
                    </Section>

                    { }
                    <Section title="Category" subtitle="Pick the one that fits best.">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                            {CATEGORIES.map(({ value, label, Icon }) => {
                                const selected = category === value;
                                return (
                                    <button
                                        type="button"
                                        key={value}
                                        onClick={() => setCategory(value)}
                                        aria-pressed={selected}
                                        className={`flex flex-col items-center justify-center gap-1.5 p-3 transition-all cursor-pointer [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)] ${
                                            selected
                                                ? "bg-linear-to-br from-[#C9962E]/25 via-[#C9962E]/10 to-transparent border border-[#E8C667]/55"
                                                : "bg-white/[0.02] border border-[#C9962E]/20 hover:border-[#C9962E]/50"
                                        }`}
                                    >
                                        <span className={`inline-flex items-center justify-center h-9 w-9 [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)] ${
                                            selected
                                                ? "bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304]"
                                                : "bg-[#0f0f0f] border border-[#C9962E]/25 text-[#cfc6b8]"
                                        }`}>
                                            <Icon size={16} strokeWidth={selected ? 2.2 : 1.8} />
                                        </span>
                                        <span className={`font-['Oswald'] text-[10px] tracking-[1px] uppercase font-semibold ${selected ? "text-white" : "text-[#cfc6b8]"}`}>
                                            {label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </Section>

                    { }
                    <Section title="Details">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            { }
                            <div>
                                <label className="block font-['Oswald'] text-[#cfc6b8] text-xs font-semibold tracking-[3px] uppercase mb-2">
                                    Difficulty
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {DIFFICULTIES.map(({ value, label, hint }) => {
                                        const selected = difficulty === value;
                                        return (
                                            <button
                                                type="button"
                                                key={value}
                                                onClick={() => setDifficulty(value)}
                                                aria-pressed={selected}
                                                className={`p-2.5 text-left transition-all cursor-pointer [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)] ${
                                                    selected
                                                        ? "bg-linear-to-br from-[#C9962E]/25 via-[#C9962E]/10 to-transparent border border-[#E8C667]/55"
                                                        : "bg-white/[0.02] border border-[#C9962E]/20 hover:border-[#C9962E]/50"
                                                }`}
                                            >
                                                <div className={`font-['Oswald'] text-[11px] tracking-[1px] uppercase font-semibold ${selected ? "text-white" : "text-[#cfc6b8]"}`}>
                                                    {label}
                                                </div>
                                                <div className="text-[#7c7468] text-[9px] mt-0.5">{hint}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            { }
                            <div className="grid grid-cols-2 gap-4">
                                <Field id="duration" label="Duration" error={errors.duration?.message} hint="Minutes">
                                    <div className="flex items-center">
                                        <Clock size={14} className="ml-3 text-[#7c7468] shrink-0" />
                                        <input
                                            id="duration"
                                            type="number"
                                            min={5}
                                            max={240}
                                            step={5}
                                            {...register("duration", {
                                                required: "Required",
                                                valueAsNumber: true,
                                                min: { value: 5, message: "Min 5" },
                                                max: { value: 240, message: "Max 240" },
                                            })}
                                            className="w-full bg-transparent text-white outline-none px-3 py-3 text-sm"
                                        />
                                    </div>
                                </Field>
                                <Field id="price" label="Price" error={errors.price?.message} hint="USD">
                                    <div className="flex items-center">
                                        <DollarSign size={14} className="ml-3 text-[#7c7468] shrink-0" />
                                        <input
                                            id="price"
                                            type="number"
                                            min={0}
                                            step={1}
                                            {...register("price", {
                                                required: "Required",
                                                valueAsNumber: true,
                                                min: { value: 0, message: "Cannot be negative" },
                                            })}
                                            className="w-full bg-transparent text-white outline-none px-3 py-3 text-sm"
                                        />
                                    </div>
                                </Field>
                            </div>
                        </div>
                    </Section>

                    { }
                    <Section title="Schedule" subtitle="Pick days and time for this class.">
                        <div className="space-y-4">
                            <div>
                                <label className="block font-['Oswald'] text-[#cfc6b8] text-xs font-semibold tracking-[3px] uppercase mb-2">
                                    Days
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {DAYS.map(({ value, short }) => {
                                        const selected = selectedDays.includes(value);
                                        return (
                                            <button
                                                type="button"
                                                key={value}
                                                onClick={() => toggleDay(value)}
                                                aria-pressed={selected}
                                                className={`px-3 py-1.5 font-['Oswald'] text-xs tracking-[1px] uppercase font-semibold cursor-pointer transition-all [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)] ${
                                                    selected
                                                        ? "bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                                                        : "bg-white/[0.02] border border-[#C9962E]/25 text-[#cfc6b8] hover:border-[#E8C667] hover:text-white"
                                                }`}
                                            >
                                                {short}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <Field id="scheduleTime" label="Time" hint="24-hour format" error={errors.scheduleTime?.message}>
                                <div className="flex items-center">
                                    <Calendar size={14} className="ml-3 text-[#7c7468] shrink-0" />
                                    <input
                                        id="scheduleTime"
                                        type="time"
                                        {...register("scheduleTime", { required: "Time is required" })}
                                        className="w-full bg-transparent text-white outline-none px-3 py-3 text-sm"
                                    />
                                </div>
                            </Field>
                        </div>
                    </Section>

                    { }
                    <div className="pt-6 border-t border-[#C9962E]/15 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="font-['Oswald'] text-xs tracking-[2px] uppercase text-[#cfc6b8] hover:text-white px-4 py-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex items-center gap-2 font-['Oswald'] font-semibold text-xs tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] cursor-pointer py-2.5 px-6 [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_18px_rgba(201,150,46,0.3)] transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isPending ? (
                                <><Loader2 size={12} className="animate-spin" /> Saving…</>
                            ) : (
                                <>Save Changes <ArrowRight size={12} /></>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Section({ title, subtitle, children }) {
    return (
        <section>
            <div className="mb-4 pb-2 border-b border-[#C9962E]/10">
                <h3 className="font-['Bebas_Neue'] text-xl tracking-wide text-white leading-none">{title}</h3>
                {subtitle && <p className="text-[#7c7468] text-[10px] mt-1">{subtitle}</p>}
            </div>
            {children}
        </section>
    );
}

function Field({ id, label, hint, error, children }) {
    return (
        <div>
            <label htmlFor={id} className="block font-['Oswald'] text-[#cfc6b8] text-[10px] font-semibold tracking-[2px] uppercase mb-1">
                {label}
            </label>
            <div className={`bg-black/50 border-t border-t-black/80 border-x border-x-[#1a1612] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] transition-colors focus-within:border-b-[#E8C667]/70 border-b ${error ? "border-b-[#ff5a5a]/70" : "border-b-[#2a2218]"}`}>
                {children}
            </div>
            {hint && !error && <p className="text-[#5a5247] text-[9px] mt-1">{hint}</p>}
            {error && <p className="text-[#ff8585] text-[10px] mt-1">{error}</p>}
        </div>
    );
}
