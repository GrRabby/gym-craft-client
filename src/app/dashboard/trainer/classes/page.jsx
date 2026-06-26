import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/permissions";
import { getTrainerClasses } from "@/actions/trainer/classes";
import TrainerClassesTable from "@/app/components/TrainerClassesTable";

export default async function TrainerClassesPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login?redirect=/dashboard/trainer/classes");
    if (user.role !== "trainer") redirect("/dashboard");

    const { classes, error } = await getTrainerClasses();

    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="font-['Bebas_Neue'] text-3xl text-[#ff5a5a] tracking-wide mb-2">Error Loading Classes</h3>
                <p className="text-[#cfc6b8] text-sm max-w-md">{error}</p>
            </div>
        );
    }

    return <TrainerClassesTable initialClasses={classes} />;
}
