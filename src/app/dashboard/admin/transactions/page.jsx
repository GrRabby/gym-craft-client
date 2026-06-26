import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/permissions";
import { getAllTransactions } from "@/actions/admin/transactions";
import TransactionsTable from "@/app/components/TransactionsTable";

export const dynamic = "force-dynamic";

export default async function AdminTransactionsPage() {
    const { error } = await requireAdmin();
    if (error) redirect("/login?redirect=/dashboard/admin/transactions");

    const { transactions, error: fetchError } = await getAllTransactions();

    if (fetchError) {
        return (
            <div className="p-8 border border-[#ff5a5a]/30 bg-[#ff5a5a]/5 text-[#ff8585]">
                <p className="font-['Oswald'] text-xs tracking-[3px] uppercase mb-2">Error</p>
                <p className="text-sm">{fetchError}</p>
            </div>
        );
    }

    return <TransactionsTable initialTransactions={transactions} />;
}