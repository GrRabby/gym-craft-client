"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Search, Shield, ShieldOff, Crown, Loader2, ChevronLeft, ChevronRight,
} from "lucide-react";
import {
    blockUserAction, unblockUserAction, makeAdminAction,
} from "@/actions/users";

const ROLE_LABELS = { member: "Member", trainer: "Trainer", admin: "Admin" };
const ROLE_STYLES = {
    member:  "text-[#cfc6b8] bg-[#1a1612] border-[#3a342a]",
    trainer: "text-[#7dd3fc] bg-[#0a1a24] border-[#1e3a52]",
    admin:   "text-[#E8C667] bg-[#1f1810] border-[#C9962E]/40",
};
const PAGE_SIZE = 10;

export default function UsersTable({ initialUsers = [] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [pendingRowId, setPendingRowId] = useState(null);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return initialUsers.filter((u) => {
            if (q && !u.name?.toLowerCase().includes(q) && !u.email?.toLowerCase().includes(q)) return false;
            if (roleFilter !== "all" && u.role !== roleFilter) return false;
            if (statusFilter !== "all" && (u.status || "active") !== statusFilter) return false;
            return true;
        });
    }, [initialUsers, search, roleFilter, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const runAction = (action, user, successMsg) => {
        setPendingRowId(user.id);
        startTransition(async () => {
            const res = await action(user.id);
            if (res?.ok) toast.success(successMsg);
            else toast.error(res?.error || "Action failed");
            router.refresh();
            setPendingRowId(null);
        });
    };

    const onBlock   = (u) => runAction(blockUserAction,   u, `${u.name} blocked.`);
    const onUnblock = (u) => runAction(unblockUserAction, u, `${u.name} unblocked.`);
    const onPromote = (u) => {
        if (!confirm(`Promote ${u.name} to admin?\n\nAdmins have full access. This can't be easily undone.`)) return;
        runAction(makeAdminAction, u, `${u.name} promoted to admin.`);
    };

    return (
        <div className="space-y-6">
            {/* Header + filters */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <h2 className="font-['Bebas_Neue'] text-3xl tracking-wide text-white leading-none">All Users</h2>
                    <p className="text-[#8c8478] text-sm mt-2">
                        {filtered.length} of {initialUsers.length} users
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c7468] pointer-events-none" />
                        <input
                            type="search"
                            placeholder="Search name or email"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full sm:w-64 bg-[#0a0a0a] border border-[#C9962E]/25 text-white placeholder:text-[#5a5247] text-sm pl-9 pr-3 py-2.5 outline-none focus:border-[#E8C667]/60 transition-colors"
                        />
                    </div>
                    <Select value={roleFilter} onChange={(v) => { setRoleFilter(v); setPage(1); }} options={[
                        { value: "all", label: "All Roles" },
                        { value: "member", label: "Members" },
                        { value: "trainer", label: "Trainers" },
                        { value: "admin", label: "Admins" },
                    ]} />
                    <Select value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }} options={[
                        { value: "all", label: "All Statuses" },
                        { value: "active", label: "Active" },
                        { value: "blocked", label: "Blocked" },
                    ]} />
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#0a0a0a] border border-[#C9962E]/15 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#C9962E]/20 bg-black/40">
                                <Th>User</Th>
                                <Th>Email</Th>
                                <Th>Role</Th>
                                <Th>Status</Th>
                                <Th align="right">Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {paged.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-16 text-center text-[#7c7468]">
                                        No users match your filters.
                                    </td>
                                </tr>
                            ) : paged.map((user) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    pending={pendingRowId === user.id && isPending}
                                    onBlock={() => onBlock(user)}
                                    onUnblock={() => onUnblock(user)}
                                    onPromote={() => onPromote(user)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-[#C9962E]/15 text-xs text-[#8c8478]">
                        <span className="font-['Oswald'] tracking-wider uppercase">Page {safePage} of {totalPages}</span>
                        <div className="flex gap-2">
                            <PagerBtn onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage <= 1}>
                                <ChevronLeft size={14} />
                            </PagerBtn>
                            <PagerBtn onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage >= totalPages}>
                                <ChevronRight size={14} />
                            </PagerBtn>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function UserRow({ user, pending, onBlock, onUnblock, onPromote }) {
    const blocked = (user.status || "active") === "blocked";
    return (
        <tr className="border-b border-[#C9962E]/8 hover:bg-white/[0.02] transition-colors">
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                    <Avatar user={user} />
                    <span className="text-white font-medium truncate">{user.name}</span>
                </div>
            </td>
            <td className="px-5 py-3.5 text-[#cfc6b8] text-xs font-mono">{user.email}</td>
            <td className="px-5 py-3.5">
                <span className={`inline-block px-2.5 py-1 text-[10px] font-['Oswald'] font-semibold tracking-[2px] uppercase border [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)] ${ROLE_STYLES[user.role] || ROLE_STYLES.member}`}>
                    {ROLE_LABELS[user.role] || "Member"}
                </span>
            </td>
            <td className="px-5 py-3.5">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-['Oswald'] font-semibold tracking-[2px] uppercase ${blocked ? "text-[#ff8585]" : "text-[#4ade80]"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${blocked ? "bg-[#ff5a5a] shadow-[0_0_8px_rgba(255,90,90,0.6)]" : "bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.5)]"}`} />
                    {blocked ? "Blocked" : "Active"}
                </span>
            </td>
            <td className="px-5 py-3.5">
                <div className="flex items-center justify-end gap-2">
                    {pending ? (
                        <Loader2 size={16} className="animate-spin text-[#E8C667]" />
                    ) : (
                        <>
                            {user.role !== "admin" && (
                                <ActionBtn onClick={onPromote} icon={Crown} variant="gold">Make Admin</ActionBtn>
                            )}
                            {blocked ? (
                                <ActionBtn onClick={onUnblock} icon={Shield} variant="ghost">Unblock</ActionBtn>
                            ) : (
                                <ActionBtn onClick={onBlock} icon={ShieldOff} variant="danger">Block</ActionBtn>
                            )}
                        </>
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

function ActionBtn({ icon: Icon, variant, children, onClick }) {
    const styles = {
        gold:   "bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] hover:-translate-y-px shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.25)]",
        ghost:  "bg-white/5 border border-[#C9962E]/30 hover:border-[#E8C667] text-[#cfc6b8] hover:text-white",
        danger: "bg-[#ff5a5a]/8 border border-[#ff5a5a]/40 hover:border-[#ff5a5a] text-[#ff8585] hover:text-[#ffadad]",
    };
    return (
        <button onClick={onClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-['Oswald'] text-[11px] font-semibold tracking-[1.5px] uppercase cursor-pointer transition-all [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)] ${styles[variant]}`}>
            <Icon size={11} />
            {children}
        </button>
    );
}

function PagerBtn({ children, ...props }) {
    return (
        <button {...props}
            className="h-8 w-8 flex items-center justify-center border border-[#C9962E]/25 hover:border-[#E8C667] hover:text-white text-[#cfc6b8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
            {children}
        </button>
    );
}

function Select({ value, onChange, options }) {
    return (
        <select value={value} onChange={(e) => onChange(e.target.value)}
            className="bg-[#0a0a0a] border border-[#C9962E]/25 text-white text-sm py-2.5 pl-3 pr-8 outline-none focus:border-[#E8C667]/60 font-['Oswald'] tracking-wider cursor-pointer">
            {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
        </select>
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