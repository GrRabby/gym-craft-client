"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Receipt } from "lucide-react";

const PAGE_SIZE = 10;

export default function TransactionsTable({ initialTransactions = [] }) {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("date_desc"); // date_desc, date_asc, amount_desc, amount_asc
    const [page, setPage] = useState(1);

    // Filtered & Sorted Transactions
    const processed = useMemo(() => {
        const q = search.trim().toLowerCase();
        let items = initialTransactions.filter((t) => {
            if (q && !t.userEmail?.toLowerCase().includes(q) && !t.classTitle?.toLowerCase().includes(q)) {
                return false;
            }
            return true;
        });

        // Sorting
        items.sort((a, b) => {
            if (sortBy === "date_desc") {
                return new Date(b.paidAt) - new Date(a.paidAt);
            }
            if (sortBy === "date_asc") {
                return new Date(a.paidAt) - new Date(b.paidAt);
            }
            if (sortBy === "amount_desc") {
                return b.amount - a.amount;
            }
            if (sortBy === "amount_asc") {
                return a.amount - b.amount;
            }
            return 0;
        });

        return items;
    }, [initialTransactions, search, sortBy]);

    const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paged = processed.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const formatAmount = (val) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(val);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        try {
            const d = new Date(dateStr);
            return d.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <h2 className="font-['Bebas_Neue'] text-3xl tracking-wide text-white leading-none">Transactions</h2>
                    <p className="text-[#8c8478] text-sm mt-2">
                        {processed.length} of {initialTransactions.length} payment histories
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c7468] pointer-events-none" />
                        <input
                            type="search"
                            placeholder="Search email or class"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full sm:w-64 bg-[#0a0a0a] border border-[#C9962E]/25 text-white placeholder:text-[#5a5247] text-sm pl-9 pr-3 py-2.5 outline-none focus:border-[#E8C667]/60 transition-colors"
                        />
                    </div>
                    <Select value={sortBy} onChange={(v) => { setSortBy(v); setPage(1); }} options={[
                        { value: "date_desc", label: "Date: Latest First" },
                        { value: "date_asc", label: "Date: Oldest First" },
                        { value: "amount_desc", label: "Amount: High to Low" },
                        { value: "amount_asc", label: "Amount: Low to High" },
                    ]} />
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#C9962E]/15 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#C9962E]/20 bg-black/40">
                                <Th>User Email</Th>
                                <Th>Class Booked</Th>
                                <Th>Amount</Th>
                                <Th>Date</Th>
                                <Th>Transaction ID</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {paged.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-16 text-center text-[#7c7468]">
                                        No transactions match your filters.
                                    </td>
                                </tr>
                            ) : paged.map((tx) => (
                                <tr key={tx.id} className="border-b border-[#C9962E]/8 hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-3.5 text-[#cfc6b8] text-xs font-mono">{tx.userEmail}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <Receipt size={13} className="text-[#E8C667] shrink-0" />
                                            <span className="text-white font-medium">{tx.classTitle}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="font-['Oswald'] text-[#E8C667] font-semibold text-sm">
                                            {formatAmount(tx.amount)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-[#cfc6b8] text-xs">
                                        {formatDate(tx.paidAt)}
                                    </td>
                                    <td className="px-5 py-3.5 text-[#8c8478] text-xs font-mono select-all">
                                        {tx.paymentIntentId}
                                    </td>
                                </tr>
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

function Th({ children }) {
    return (
        <th className="font-['Oswald'] px-5 py-3.5 text-[10px] tracking-[3px] uppercase text-[#E8C667] text-left">
            {children}
        </th>
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
