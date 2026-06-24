import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/permissions";
import { getPendingApplications } from "@/actions/admin/trainer-applications";
import AppliedTrainersTable from "@/app/components/Appliedtrainerstable";

export const dynamic = "force-dynamic";

export default async function AppliedTrainersPage() {
    const { error: authError } = await requireAdmin();
    if (authError) redirect("/login?redirect=/dashboard/admin/trainers/applications");

    const { applications, error } = await getPendingApplications();

    if (error) {
        return (
            <div className="p-8 border border-[#ff5a5a]/30 bg-[#ff5a5a]/5 text-[#ff8585]">
                <p className="font-['Oswald'] text-xs tracking-[3px] uppercase mb-2">Error</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return <AppliedTrainersTable initialApplications={applications} />;
}