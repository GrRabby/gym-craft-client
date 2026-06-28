"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Edit, Trash2, Users, Search, Clock, DollarSign, Calendar,
    Dumbbell, HeartPulse, Flame, Sparkles, Activity, Move, Loader2, AlertTriangle
} from "lucide-react";
import { deleteClassAction } from "@/actions/trainer/classes";
import EditClassModal from "./EditClassModal";
import AttendeesModal from "./AttendeesModal";

const CATEGORY_META = {
    strength: { label: "Strength", Icon: Dumbbell },
    cardio: { label: "Cardio", Icon: HeartPulse },
    hiit: { label: "HIIT", Icon: Flame },
    yoga: { label: "Yoga", Icon: Sparkles },
    pilates: { label: "Pilates", Icon: Activity },
    mobility: { label: "Mobility", Icon: Move },
};

const STATUS_STYLES = {
    pending: "text-[#E8C667] bg-[#C9962E]/8 border-[#C9962E]/40",
    approved: "text-[#4ade80] bg-[#4ade80]/8 border-[#4ade80]/40",
    rejected: "text-[#ff8585] bg-[#ff5a5a]/8 border-[#ff5a5a]/40",
};

const STATUS_DOT = {
    pending: "bg-[#E8C667]",
    approved: "bg-[#4ade80]",
    rejected: "bg-[#ff5a5a]",
};

export default function TrainerClassesTable({ initialClasses = [] }) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    
    const [editingClass, setEditingClass] = useState(null);
    const [attendeesClass, setAttendeesClass] = useState(null);
    const [deletingClass, setDeletingClass] = useState(null);
    const [isPending, startTransition] = useTransition();

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return initialClasses.filter((c) => {
            if (statusFilter !== "all" && c.status !== statusFilter) return false;
            if (q && !c.title.toLowerCase().includes(q)) return false;
            return true;
        });
    }, [initialClasses, search, statusFilter]);

    const handleDelete = () => {
        if (!deletingClass) return;
        startTransition(async () => {
            const res = await deleteClassAction(deletingClass.id);
            if (res?.ok) {
                toast.success(`"${deletingClass.title}" deleted successfully.`);
                setDeletingClass(null);
                router.refresh();
            } else {
                toast.error(res?.error || "Failed to delete class.");
            }
        });
    };

    return (
        <div className="space-y-6">
            { }
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-px w-8 bg-[#E8C667]" />
                        <span className="font-['Oswald'] text-[#E8C667] text-[10px] font-semibold tracking-[4px] uppercase">
                            Coach Portfolio
                        </span>
                    </div>
                    <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide text-white leading-none">
                        My <span className="text-[#E8C667]">Classes</span>
                    </h2>
                    <p className="text-[#8c8478] text-sm mt-2">
                        {filtered.length} of {initialClasses.length} class{initialClasses.length === 1 ? "" : "es"}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c7468] pointer-events-none" />
                        <input
                            type="search"
                            placeholder="Search class title"
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
                    <table className="w-full text-sm min-w-[1200px]">
                        <thead>
                            <tr className="border-b border-[#C9962E]/30 bg-black/40">
                                <Th>Class Details</Th>
                                <Th>Category</Th>
                                <Th>Difficulty</Th>
                                <Th>Status</Th>
                                <Th>Created</Th>
                                <Th align="right">Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-20 text-center text-[#7c7468]">
                                        <Calendar size={28} className="mx-auto text-[#C9962E]/30 mb-3" />
                                        <p className="font-['Oswald'] text-xs tracking-[3px] uppercase">
                                            No classes found
                                        </p>
                                    </td>
                                </tr>
                            ) : filtered.map((cls) => {
                                const meta = CATEGORY_META[cls.category] || { label: cls.category, Icon: Dumbbell };
                                const SIcon = meta.Icon;
                                const createdDate = new Date(cls.createdAt).toLocaleDateString("en-US", {
                                    month: "short", day: "numeric", year: "numeric",
                                });

                                return (
                                    <tr key={cls.id} className="border-b border-[#C9962E]/20 hover:bg-white/[0.02] transition-colors">
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
                                            <span className="inline-flex items-center gap-1.5 text-[#E8C667] text-xs font-['Oswald'] font-semibold tracking-[2px] uppercase">
                                                <SIcon size={14} />
                                                {meta.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-[#cfc6b8] capitalize">{cls.difficulty}</td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex flex-col items-start gap-1">
                                                <StatusBadge status={cls.status} />
                                                {cls.status === "rejected" && cls.feedback && (
                                                    <p className="text-[#ff8585]/75 text-[11px] max-w-[200px] truncate italic" title={cls.feedback}>
                                                        &quot;{cls.feedback}&quot;
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-[#cfc6b8] text-xs">{createdDate}</td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setAttendeesClass(cls)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 font-['Oswald'] text-[10px] font-semibold tracking-[1px] uppercase cursor-pointer transition-all  bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)] bg-white/5 border border-[#C9962E]/30 hover:border-[#E8C667] text-[#1a1304] hover:text-white"
                                                    title="View registered students"
                                                >
                                                    <Users size={11} />
                                                    View Students
                                                </button>
                                                <button
                                                    onClick={() => setEditingClass(cls)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 font-['Oswald'] text-[10px] font-semibold tracking-[1px] uppercase cursor-pointer transition-all [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)] bg-white/5 border border-[#C9962E]/30 hover:border-[#E8C667] text-[#cfc6b8] hover:text-white"
                                                >
                                                    <Edit size={11} />
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => setDeletingClass(cls)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 font-['Oswald'] text-[10px] font-semibold tracking-[1px] uppercase cursor-pointer transition-all [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)] bg-white/5 border border-[#ff5a5a]/30 hover:border-[#ff5a5a] text-[#ff8585] hover:text-[#ffadad]"
                                                >
                                                    <Trash2 size={11} />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            { }
            <EditClassModal
                cls={editingClass}
                isOpen={!!editingClass}
                onClose={() => {
                    setEditingClass(null);
                    router.refresh();
                }}
            />

            <AttendeesModal
                classId={attendeesClass?.id}
                className={attendeesClass?.title}
                isOpen={!!attendeesClass}
                onClose={() => setAttendeesClass(null)}
            />

            { }
            {deletingClass && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div onClick={() => !isPending && setDeletingClass(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                    <div className="relative w-full max-w-md bg-[#0a0a0a] border border-[#ff5a5a]/45 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]">
                        <div className="flex items-center gap-3 text-[#ff8585] mb-4">
                            <AlertTriangle size={24} className="shrink-0 animate-bounce" />
                            <h3 className="font-['Bebas_Neue'] text-2xl tracking-wide leading-none">Delete Class?</h3>
                        </div>
                        <p className="text-[#cfc6b8] text-sm leading-relaxed mb-6">
                            Are you sure you want to delete <span className="text-white font-semibold">&quot;{deletingClass.title}&quot;</span>? This action is permanent and cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeletingClass(null)}
                                disabled={isPending}
                                className="font-['Oswald'] text-xs tracking-[2px] uppercase text-[#cfc6b8] hover:text-white px-4 py-2 cursor-pointer disabled:opacity-40"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 font-['Oswald'] text-xs font-semibold tracking-[2px] uppercase cursor-pointer bg-[#ff5a5a]/15 border border-[#ff5a5a]/50 hover:border-[#ff5a5a] hover:bg-[#ff5a5a]/25 text-[#ff8585] hover:text-[#ffadad] [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)]"
                            >
                                {isPending ? (
                                    <><Loader2 size={12} className="animate-spin" /> Deleting…</>
                                ) : (
                                    "Yes, Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
