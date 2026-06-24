"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, UserMinus, Loader2, BadgeCheck } from "lucide-react";
import { demoteTrainerAction } from "@/actions/admin/trainers";

export default function ManageTrainersTable({ initialTrainers = [] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [pendingRowId, setPendingRowId] = useState(null);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return initialTrainers;
        return initialTrainers.filter(
            (t) => t.name?.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q)
        );
    }, [initialTrainers, search]);

    const runDemote = (trainer) => {
        setPendingRowId(trainer.id);
        startTransition(async () => {
            const res = await demoteTrainerAction(trainer.id);
            if (res?.ok) toast.success(`${trainer.name} demoted to member.`);
            else toast.error(res?.error || "Action failed");
            router.refresh();
            setPendingRowId(null);
        });
    };

    const onDemote = (trainer) => {
        toast(`Demote ${trainer.name}?`, {
            description: "They'll lose trainer privileges and become a regular member. Their classes and history remain.",
            duration: 10000,
            action: {
                label: "Demote",
                onClick: () => runDemote(trainer),
            },
            cancel: { label: "Cancel", onClick: () => {} },
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-px w-8 bg-[#E8C667]" />
                        <span className="font-['Oswald'] text-[#E8C667] text-[10px] font-semibold tracking-[4px] uppercase">
                            Active Trainers
                        </span>
                    </div>
                    <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide text-white leading-none">
                        Manage <span className="text-[#E8C667]">Trainers</span>
                    </h2>
                    <p className="text-[#8c8478] text-sm mt-2">
                        {filtered.length} of {initialTrainers.length} {initialTrainers.length === 1 ? "trainer" : "trainers"}
                    </p>
                </div>

                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c7468] pointer-events-none" />
                    <input
                        type="search"
                        placeholder="Search name or email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-64 bg-[#0a0a0a] border border-[#C9962E]/25 text-white placeholder:text-[#5a5247] text-sm pl-9 pr-3 py-2.5 outline-none focus:border-[#E8C667]/60 transition-colors"
                    />
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#C9962E]/15 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#C9962E]/20 bg-black/40">
                                <Th>Trainer</Th>
                                <Th>Email</Th>
                                <Th>Status</Th>
                                <Th>Joined</Th>
                                <Th align="right">Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-20 text-center text-[#7c7468]">
                                        <BadgeCheck size={28} className="mx-auto text-[#C9962E]/30 mb-3" />
                                        <p className="font-['Oswald'] text-xs tracking-[3px] uppercase">
                                            {search ? "No trainers match your search" : "No active trainers yet"}
                                        </p>
                                        {!search && (
                                            <p className="text-xs mt-2">Approved trainer applications will appear here.</p>
                                        )}
                                    </td>
                                </tr>
                            ) : filtered.map((trainer) => (
                                <TrainerRow
                                    key={trainer.id}
                                    trainer={trainer}
                                    pending={pendingRowId === trainer.id && isPending}
                                    onDemote={() => onDemote(trainer)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function TrainerRow({ trainer, pending, onDemote }) {
    const blocked = (trainer.status || "active") === "blocked";
    const joined = trainer.createdAt
        ? new Date(trainer.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
          })
        : "—";

    return (
        <tr className="border-b border-[#C9962E]/8 hover:bg-white/[0.02] transition-colors">
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                    <Avatar user={trainer} />
                    <span className="text-white font-medium truncate">{trainer.name}</span>
                </div>
            </td>
            <td className="px-5 py-3.5 text-[#cfc6b8] text-xs font-mono">{trainer.email}</td>
            <td className="px-5 py-3.5">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-['Oswald'] font-semibold tracking-[2px] uppercase ${blocked ? "text-[#ff8585]" : "text-[#4ade80]"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${blocked ? "bg-[#ff5a5a] shadow-[0_0_8px_rgba(255,90,90,0.6)]" : "bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.5)]"}`} />
                    {blocked ? "Blocked" : "Active"}
                </span>
            </td>
            <td className="px-5 py-3.5 text-[#cfc6b8] text-xs">{joined}</td>
            <td className="px-5 py-3.5">
                <div className="flex items-center justify-end">
                    {pending ? (
                        <Loader2 size={16} className="animate-spin text-[#E8C667]" />
                    ) : (
                        <button
                            onClick={onDemote}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 font-['Oswald'] text-[11px] font-semibold tracking-[1.5px] uppercase cursor-pointer transition-all [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)] bg-[#ff5a5a]/8 border border-[#ff5a5a]/40 hover:border-[#ff5a5a] text-[#ff8585] hover:text-[#ffadad]"
                        >
                            <UserMinus size={11} />
                            Demote to User
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

function Th({ children, align = "left" }) {
    return (
        <th className={`font-['Oswald'] px-5 py-3.5 text-[10px] tracking-[3px] uppercase text-[#E8C667] ${align === "right" ? "text-right" : "text-left"}`}>
            {children}
        </th>
    );
}

function Avatar({ user }) {
    if (user?.image) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={user.image} alt="" className="h-8 w-8 rounded-full object-cover border border-[#C9962E]/40 shrink-0" />;
    }
    const initials = (user?.name || "U").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
    return (
        <span className="h-8 w-8 rounded-full inline-flex items-center justify-center bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] text-xs font-bold border border-[#C9962E]/40 shrink-0">
            {initials}
        </span>
    );
}