"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Dumbbell, HeartPulse, Flame, Sparkles, Activity, Move,
    Eye, Check, X, Clock, Award, Mail, Loader2,
} from "lucide-react";
import {
    approveApplicationAction, rejectApplicationAction,
} from "@/actions/admin/trainer-applications";

const SPECIALTY_META = {
    strength: { label: "Strength", Icon: Dumbbell },
    cardio: { label: "Cardio", Icon: HeartPulse },
    hiit: { label: "HIIT", Icon: Flame },
    yoga: { label: "Yoga", Icon: Sparkles },
    pilates: { label: "Pilates", Icon: Activity },
    mobility: { label: "Mobility", Icon: Move },
};

export default function AppliedTrainersTable({ initialApplications = [] }) {
    const [detailsApp, setDetailsApp] = useState(null);

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-8 bg-[#E8C667]" />
                    <span className="font-['Oswald'] text-[#E8C667] text-[10px] font-semibold tracking-[4px] uppercase">
                        Trainer Applications
                    </span>
                </div>
                <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide text-white leading-none">
                    Pending <span className="text-[#E8C667]">Review</span>
                </h2>
                <p className="text-[#8c8478] text-sm mt-2">
                    {initialApplications.length} {initialApplications.length === 1 ? "application" : "applications"} awaiting your decision
                </p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#C9962E]/15 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#C9962E]/20 bg-black/40">
                                <Th>Applicant</Th>
                                <Th>Specialty</Th>
                                <Th>Experience</Th>
                                <Th>Applied</Th>
                                <Th align="right">Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {initialApplications.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-20 text-center text-[#7c7468]">
                                        <Award size={28} className="mx-auto text-[#C9962E]/30 mb-3" />
                                        <p className="font-['Oswald'] text-xs tracking-[3px] uppercase">No pending applications</p>
                                        <p className="text-xs mt-2">New applications will appear here.</p>
                                    </td>
                                </tr>
                            ) : initialApplications.map((app) => (
                                <ApplicationRow
                                    key={app.id}
                                    app={app}
                                    onViewDetails={() => setDetailsApp(app)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <DetailsModal
                application={detailsApp}
                isOpen={!!detailsApp}
                onClose={() => setDetailsApp(null)}
            />
        </div>
    );
}

 

function ApplicationRow({ app, onViewDetails }) {
    const meta = SPECIALTY_META[app.specialty] || { label: app.specialty, Icon: Dumbbell };
    const SIcon = meta.Icon;
    const applied = new Date(app.createdAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });

    return (
        <tr className="border-b border-[#C9962E]/8 hover:bg-white/[0.02] transition-colors">
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                    <Avatar user={app.applicant} />
                    <div className="min-w-0">
                        <p className="text-white font-medium truncate">{app.applicant.name}</p>
                        <p className="text-[#7c7468] text-xs truncate">{app.applicant.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 text-[#E8C667] text-xs font-['Oswald'] font-semibold tracking-[2px] uppercase">
                    <SIcon size={14} />
                    {meta.label}
                </span>
            </td>
            <td className="px-5 py-3.5 text-[#cfc6b8]">
                {app.experience} {app.experience === 1 ? "yr" : "yrs"}
            </td>
            <td className="px-5 py-3.5 text-[#cfc6b8] text-xs">{applied}</td>
            <td className="px-5 py-3.5">
                <div className="flex justify-end">
                    <button
                        onClick={onViewDetails}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 font-['Oswald'] text-[11px] font-semibold tracking-[1.5px] uppercase cursor-pointer transition-all [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)] bg-white/5 border border-[#C9962E]/30 hover:border-[#E8C667] text-[#cfc6b8] hover:text-white"
                    >
                        <Eye size={11} />
                        Details
                    </button>
                </div>
            </td>
        </tr>
    );
}

 

function DetailsModal({ application, isOpen, onClose }) {
    const router = useRouter();
    const [feedback, setFeedback] = useState("");
    const [isPending, startTransition] = useTransition();
    const [actioning, setActioning] = useState(null); 

    
    useEffect(() => {
        setFeedback("");
        setActioning(null);
    }, [application?.id]);

    
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

    if (!isOpen || !application) return null;

    const meta = SPECIALTY_META[application.specialty] || { label: application.specialty, Icon: Dumbbell };
    const SIcon = meta.Icon;
    const applied = new Date(application.createdAt).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit",
    });

    const runAction = (action, kind, successMsg) => {
        setActioning(kind);
        startTransition(async () => {
            const res = await action;
            if (res?.ok) {
                toast.success(successMsg);
                onClose();
                router.refresh();
            } else {
                toast.error(res?.error || "Action failed");
                setActioning(null);
            }
        });
    };

    const handleApprove = () => {
        runAction(
            approveApplicationAction(application.id, feedback),
            "approve",
            `${application.applicant.name} promoted to trainer.`
        );
    };

    const handleReject = () => {
        if (!feedback.trim()) {
            toast.error("Feedback is required to reject.");
            return;
        }
        runAction(
            rejectApplicationAction(application.id, feedback),
            "reject",
            `${application.applicant.name}'s application rejected.`
        );
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
                aria-labelledby="app-modal-title"
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-[#C9962E]/30 shadow-[0_30px_80px_rgba(0,0,0,0.7),0_0_60px_rgba(201,150,46,0.08)] [clip-path:polygon(14px_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%,0_14px)]"
            >
                { }
                <div className="flex items-start justify-between gap-4 p-6 border-b border-[#C9962E]/15">
                    <div className="flex items-center gap-4 min-w-0">
                        <Avatar user={application.applicant} size={48} />
                        <div className="min-w-0">
                            <p className="font-['Oswald'] text-[#E8C667] text-[10px] font-semibold tracking-[3px] uppercase">
                                Application Details
                            </p>
                            <h2 id="app-modal-title" className="font-['Bebas_Neue'] text-3xl tracking-wide text-white leading-none mt-1 truncate">
                                {application.applicant.name}
                            </h2>
                            <div className="flex items-center gap-1.5 text-[#7c7468] text-xs mt-1.5">
                                <Mail size={11} />
                                <span className="truncate">{application.applicant.email}</span>
                            </div>
                        </div>
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
                <div className="p-6 space-y-6">
                    { }
                    <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <Detail Icon={SIcon} label="Specialty" value={meta.label} highlight />
                        <Detail Icon={Clock} label="Experience" value={`${application.experience} ${application.experience === 1 ? "year" : "years"}`} />
                        <Detail Icon={Award} label="Applied" value={applied} />
                    </dl>

                    { }
                    <div>
                        <label htmlFor="feedback" className="block font-['Oswald'] text-[#cfc6b8] text-xs font-semibold tracking-[3px] uppercase mb-2">
                            Feedback <span className="text-[#7c7468] normal-case tracking-normal font-normal">— required for rejection</span>
                        </label>
                        <textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Share your decision with the applicant. They'll see this on their dashboard."
                            rows={4}
                            disabled={isPending}
                            className="w-full bg-[#070707] border border-[#1a1612] focus:border-[#E8C667]/70 text-white placeholder:text-[#4a4339] text-sm p-3 outline-none transition-colors resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] disabled:opacity-60"
                        />
                        <p className="text-[#5a5247] text-[11px] mt-1.5">{feedback.length}/500</p>
                    </div>
                </div>

                { }
                <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 pt-2 border-t border-[#C9962E]/10">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="font-['Oswald'] text-xs tracking-[2px] uppercase text-[#cfc6b8] hover:text-white px-4 py-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={isPending || !feedback.trim()}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 font-['Oswald'] text-xs font-semibold tracking-[2px] uppercase cursor-pointer transition-all [clip-path:polygon(7px_0,100%_0,100%_calc(100%-7px),calc(100%-7px)_100%,0_100%,0_7px)] bg-[#ff5a5a]/8 border border-[#ff5a5a]/40 hover:border-[#ff5a5a] text-[#ff8585] hover:text-[#ffadad] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#ff5a5a]/40"
                    >
                        {actioning === "reject"
                            ? <><Loader2 size={12} className="animate-spin" /> Rejecting…</>
                            : <><X size={12} /> Reject</>
                        }
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={isPending}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 font-['Oswald'] text-xs font-semibold tracking-[2px] uppercase cursor-pointer transition-all [clip-path:polygon(7px_0,100%_0,100%_calc(100%-7px),calc(100%-7px)_100%,0_100%,0_7px)] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] hover:-translate-y-px shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {actioning === "approve"
                            ? <><Loader2 size={12} className="animate-spin" /> Approving…</>
                            : <><Check size={12} /> Approve</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

 

function Th({ children, align = "left" }) {
    return (
        <th className={`font-['Oswald'] px-5 py-3.5 text-[10px] tracking-[3px] uppercase text-[#E8C667] ${align === "right" ? "text-right" : "text-left"}`}>
            {children}
        </th>
    );
}

function Detail({ Icon, label, value, highlight }) {
    return (
        <div className="flex items-start gap-3">
            <Icon size={16} className={`mt-0.5 shrink-0 ${highlight ? "text-[#E8C667]" : "text-[#7c7468]"}`} />
            <div className="min-w-0">
                <dt className="font-['Oswald'] text-[10px] tracking-[2px] uppercase text-[#7c7468]">{label}</dt>
                <dd className={`text-sm font-medium mt-0.5 truncate ${highlight ? "text-[#E8C667]" : "text-white"}`}>
                    {value}
                </dd>
            </div>
        </div>
    );
}

function Avatar({ user, size = 38 }) {
    if (user?.image) {
        
        return <img src={user.image} alt="" className="rounded-full object-cover border-2 border-[#C9962E]/55 shrink-0" style={{ width: size, height: size }} />;
    }
    const initials = (user?.name || "U").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
    return (
        <span
            className="rounded-full inline-flex items-center justify-center border-2 border-[#C9962E]/55 shrink-0 bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] font-bold tracking-wider"
            style={{ width: size, height: size, fontSize: size * 0.34 }}
        >
            {initials}
        </span>
    );
}