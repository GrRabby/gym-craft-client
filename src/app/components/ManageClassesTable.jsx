"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Eye, Check, X, Trash2, Search, Clock, DollarSign, Calendar, Mail,
    Dumbbell, HeartPulse, Flame, Sparkles, Activity, Move, Loader2, AlertTriangle,
} from "lucide-react";
import {
    approveClassAction, rejectClassAction, deleteClassAction,
} from "@/actions/admin/classes";

const CATEGORY_META = {
    strength: { label: "Strength", Icon: Dumbbell },
    cardio: { label: "Cardio", Icon: HeartPulse },
    hiit: { label: "HIIT", Icon: Flame },
    yoga: { label: "Yoga", Icon: Sparkles },
    pilates: { label: "Pilates", Icon: Activity },
    mobility: { label: "Mobility", Icon: Move },
};

const STATUS_STYLES = {
    pending: "text-[#E8C667] bg-[#C9962E]/8  border-[#C9962E]/40",
    approved: "text-[#4ade80] bg-[#4ade80]/8  border-[#4ade80]/40",
    rejected: "text-[#ff8585] bg-[#ff5a5a]/8  border-[#ff5a5a]/40",
};

const STATUS_DOT = {
    pending: "bg-[#E8C667]",
    approved: "bg-[#4ade80]",
    rejected: "bg-[#ff5a5a]",
};

const DAY_LABEL = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };

export default function ManageClassesTable({ initialClasses = [] }) {
    const [detailsClass, setDetailsClass] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return initialClasses.filter((c) => {
            if (statusFilter !== "all" && c.status !== statusFilter) return false;
            if (q && !c.title.toLowerCase().includes(q) && !c.trainer.name.toLowerCase().includes(q)) return false;
            return true;
        });
    }, [initialClasses, search, statusFilter]);

    return (
        <div className="space-y-6">
            { }
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-px w-8 bg-[#E8C667]" />
                        <span className="font-['Oswald'] text-[#E8C667] text-[10px] font-semibold tracking-[4px] uppercase">
                            Class Management
                        </span>
                    </div>
                    <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide text-white leading-none">
                        Manage <span className="text-[#E8C667]">Classes</span>
                    </h2>
                    <p className="text-[#8c8478] text-sm mt-2">
                        {filtered.length} of {initialClasses.length} {initialClasses.length === 1 ? "class" : "classes"}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c7468] pointer-events-none" />
                        <input
                            type="search"
                            placeholder="Search title or trainer"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-64 bg-[#0a0a0a] border border-[#C9962E]/25 text-white placeholder:text-[#5a5247] text-sm pl-9 pr-3 py-2.5 outline-none focus:border-[#E8C667]/60 transition-colors"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[#0a0a0a] border border-[#C9962E]/25 text-white text-sm py-2.5 pl-3 pr-8 outline-none focus:border-[#E8C667]/60 transition-colors font-['Oswald'] tracking-wider cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            { }
            <div className="bg-[#0a0a0a] border border-[#C9962E]/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[800px]">
                        <thead>
                            <tr className="border-b border-[#C9962E]/30 bg-black/40">
                                <Th>Class</Th>
                                <Th>Trainer</Th>
                                <Th>Category</Th>
                                <Th>Status</Th>
                                <Th>Submitted</Th>
                                <Th align="right">Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-20 text-center text-[#7c7468]">
                                        <Calendar size={28} className="mx-auto text-[#C9962E]/30 mb-3" />
                                        <p className="font-['Oswald'] text-xs tracking-[3px] uppercase">
                                            No classes match your filters
                                        </p>
                                    </td>
                                </tr>
                            ) : filtered.map((cls) => (
                                <ClassRow key={cls.id} cls={cls} onViewDetails={() => setDetailsClass(cls)} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <DetailsModal
                cls={detailsClass}
                isOpen={!!detailsClass}
                onClose={() => setDetailsClass(null)}
            />
        </div>
    );
}

 

function ClassRow({ cls, onViewDetails }) {
    const meta = CATEGORY_META[cls.category] || { label: cls.category, Icon: Dumbbell };
    const SIcon = meta.Icon;
    const submitted = new Date(cls.createdAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });

    return (
        <tr className="border-b border-[#C9962E]/20 hover:bg-white/[0.02] transition-colors">
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                    {cls.image ? (
                        
                        <img src={cls.image} alt="" className="h-10 w-16 object-cover border border-[#C9962E]/30 shrink-0" />
                    ) : (
                        <div className="h-10 w-16 bg-[#0f0f0f] border border-[#C9962E]/20 shrink-0" />
                    )}
                    <div className="min-w-0">
                        <p className="text-white font-medium truncate">{cls.title}</p>
                        <p className="text-[#7c7468] text-xs truncate">{cls.duration} min · USD {cls.price}</p>
                    </div>
                </div>
            </td>
            <td className="px-5 py-3.5">
                <p className="text-[#cfc6b8] truncate">{cls.trainer.name}</p>
                <p className="text-[#7c7468] text-xs truncate">{cls.trainer.email}</p>
            </td>
            <td className="px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 text-[#E8C667] text-xs font-['Oswald'] font-semibold tracking-[2px] uppercase">
                    <SIcon size={14} />
                    {meta.label}
                </span>
            </td>
            <td className="px-5 py-3.5">
                <StatusBadge status={cls.status} />
            </td>
            <td className="px-5 py-3.5 text-[#cfc6b8] text-xs">{submitted}</td>
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

function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
    const label = { pending: "Pending", approved: "Approved", rejected: "Rejected" }[status] || status;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border text-[10px] font-['Oswald'] font-semibold tracking-[2px] uppercase ${style} [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]`}>
            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status] || "bg-[#7c7468]"}`} />
            {label}
        </span>
    );
}

 

function DetailsModal({ cls, isOpen, onClose }) {
    const router = useRouter();
    const [feedback, setFeedback] = useState("");
    const [actioning, setActioning] = useState(null);     
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setFeedback("");
        setActioning(null);
        setConfirmDelete(false);
    }, [cls?.id]);

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

    const meta = CATEGORY_META[cls.category] || { label: cls.category, Icon: Dumbbell };
    const SIcon = meta.Icon;
    const submitted = new Date(cls.createdAt).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
    });
    const scheduleDays = cls.scheduleDays.map((d) => DAY_LABEL[d]).join(" · ");

    const runAction = (promise, kind, successMsg) => {
        setActioning(kind);
        startTransition(async () => {
            const res = await promise;
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

    const handleApprove = () =>
        runAction(approveClassAction(cls.id, feedback), "approve", `"${cls.title}" approved.`);

    const handleReject = () => {
        if (!feedback.trim()) {
            toast.error("Feedback is required to reject.");
            return;
        }
        runAction(rejectClassAction(cls.id, feedback), "reject", `"${cls.title}" rejected.`);
    };

    const handleDelete = () =>
        runAction(deleteClassAction(cls.id), "delete", `"${cls.title}" deleted.`);

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
                aria-labelledby="class-modal-title"
                className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-[#C9962E]/30 shadow-[0_30px_80px_rgba(0,0,0,0.7),0_0_60px_rgba(201,150,46,0.08)] [clip-path:polygon(14px_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%,0_14px)]"
            >
                { }
                <div className="flex items-start justify-between gap-4 p-6 border-b border-[#C9962E]/15">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-['Oswald'] text-[#E8C667] text-[10px] font-semibold tracking-[3px] uppercase">
                                Class Review
                            </span>
                            <StatusBadge status={cls.status} />
                        </div>
                        <h2 id="class-modal-title" className="font-['Bebas_Neue'] text-3xl tracking-wide text-white leading-none truncate">
                            {cls.title}
                        </h2>
                        <div className="flex items-center gap-2 mt-2 text-xs text-[#7c7468] flex-wrap">
                            <span>by <span className="text-[#cfc6b8]">{cls.trainer.name}</span></span>
                            <span>·</span>
                            <Mail size={11} />
                            <span className="truncate">{cls.trainer.email}</span>
                            <span>·</span>
                            <span>{submitted}</span>
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
                {cls.image && (
                    <div className="px-6 pt-6">
                        { }
                        <img
                            src={cls.image}
                            alt=""
                            className="w-full aspect-[2/1] object-cover border border-[#C9962E]/25 [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]"
                        />
                    </div>
                )}

                { }
                <div className="p-6 space-y-6">
                    { }
                    <div>
                        <p className="font-['Oswald'] text-[10px] tracking-[3px] uppercase text-[#7c7468] mb-2">
                            Description
                        </p>
                        <p className="text-[#cfc6b8] text-sm leading-relaxed whitespace-pre-line">
                            {cls.description}
                        </p>
                    </div>

                    { }
                    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Detail Icon={SIcon} label="Category" value={meta.label} highlight />
                        <Detail label="Difficulty" value={cls.difficulty.charAt(0).toUpperCase() + cls.difficulty.slice(1)} />
                        <Detail Icon={Clock} label="Duration" value={`${cls.duration} min`} />
                        <Detail Icon={DollarSign} label="Price" value={`USD ${cls.price}`} />
                    </dl>

                    { }
                    <div>
                        <p className="font-['Oswald'] text-[10px] tracking-[3px] uppercase text-[#7c7468] mb-2">
                            Schedule
                        </p>
                        <p className="text-white text-sm">
                            {scheduleDays} <span className="text-[#E8C667]">at {cls.scheduleTime}</span>
                        </p>
                    </div>

                    { }
                    {cls.feedback && (
                        <div className="p-3 bg-white/[0.02] border-l-2 border-[#C9962E]/50">
                            <p className="font-['Oswald'] text-[10px] tracking-[3px] uppercase text-[#7c7468] mb-1">
                                Previous Feedback
                            </p>
                            <p className="text-[#cfc6b8] text-sm italic">{cls.feedback}</p>
                        </div>
                    )}

                    { }
                    {cls.status === "pending" && (
                        <div>
                            <label htmlFor="feedback" className="block font-['Oswald'] text-[#cfc6b8] text-xs font-semibold tracking-[3px] uppercase mb-2">
                                Feedback <span className="text-[#7c7468] normal-case tracking-normal font-normal">— required for rejection</span>
                            </label>
                            <textarea
                                id="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Share your decision with the trainer. They'll see this on their dashboard."
                                rows={3}
                                disabled={isPending}
                                className="w-full bg-[#070707] border border-[#1a1612] focus:border-[#E8C667]/70 text-white placeholder:text-[#4a4339] text-sm p-3 outline-none transition-colors resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] disabled:opacity-60"
                            />
                        </div>
                    )}
                </div>

                { }
                <div className="p-6 pt-2 border-t border-[#C9962E]/10">
                    {confirmDelete ? (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                            <div className="flex items-center gap-2 text-[#ff8585] text-sm sm:mr-auto">
                                <AlertTriangle size={14} className="shrink-0" />
                                <span>Permanently delete this class?</span>
                            </div>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                disabled={isPending}
                                className="font-['Oswald'] text-xs tracking-[2px] uppercase text-[#cfc6b8] hover:text-white px-4 py-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 font-['Oswald'] text-xs font-semibold tracking-[2px] uppercase cursor-pointer transition-all [clip-path:polygon(7px_0,100%_0,100%_calc(100%-7px),calc(100%-7px)_100%,0_100%,0_7px)] bg-[#ff5a5a]/15 border border-[#ff5a5a]/50 hover:border-[#ff5a5a] hover:bg-[#ff5a5a]/25 text-[#ff8585] hover:text-[#ffadad] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {actioning === "delete"
                                    ? <><Loader2 size={12} className="animate-spin" /> Deleting…</>
                                    : <><Trash2 size={12} /> Yes, Delete</>
                                }
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-3 justify-end items-stretch sm:items-center">
                            <button
                                onClick={onClose}
                                disabled={isPending}
                                className="font-['Oswald'] text-xs tracking-[2px] uppercase text-[#cfc6b8] hover:text-white px-4 py-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setConfirmDelete(true)}
                                disabled={isPending}
                                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 font-['Oswald'] text-xs font-semibold tracking-[2px] uppercase cursor-pointer transition-all [clip-path:polygon(7px_0,100%_0,100%_calc(100%-7px),calc(100%-7px)_100%,0_100%,0_7px)] bg-white/5 border border-[#ff5a5a]/40 hover:border-[#ff5a5a] text-[#ff8585] hover:text-[#ffadad] disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Trash2 size={12} />
                                Delete
                            </button>
                            {cls.status === "pending" && (
                                <>
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
                                </>
                            )}
                        </div>
                    )}
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
        <div className="flex items-start gap-2.5">
            {Icon && <Icon size={14} className={`mt-0.5 shrink-0 ${highlight ? "text-[#E8C667]" : "text-[#7c7468]"}`} />}
            <div className="min-w-0">
                <dt className="font-['Oswald'] text-[10px] tracking-[2px] uppercase text-[#7c7468]">{label}</dt>
                <dd className={`text-sm font-medium mt-0.5 truncate ${highlight ? "text-[#E8C667]" : "text-white"}`}>
                    {value}
                </dd>
            </div>
        </div>
    );
}