import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/permissions";
import AddClassForm from "@/app/components/AddClassForm";

export default async function NewClassPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login?redirect=/dashboard/trainer/classes/new");
    if (user.role !== "trainer") redirect("/dashboard");

    return <AddClassForm />;
}