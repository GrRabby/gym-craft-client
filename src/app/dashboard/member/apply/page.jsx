
import { getMyTrainerApplication } from "@/actions/trainer-applications";
import ApplyTrainerForm from "@/app/components/ApplyTrainerForm";

export const dynamic = "force-dynamic";

export default async function ApplyTrainerPage() {
    const { application, error } = await getMyTrainerApplication();

    if (error) {
        return (
            <div className="p-8 border border-[#ff5a5a]/30 bg-[#ff5a5a]/5 text-[#ff8585]">
                <p className="font-['Oswald'] text-xs tracking-[3px] uppercase mb-2">Error</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return <ApplyTrainerForm initialApplication={application} />;
}