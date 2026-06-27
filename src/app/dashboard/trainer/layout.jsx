import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function TrainerLayout({ children }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login?redirect=/dashboard/trainer");
    }

    if (user.role !== "trainer") {
        redirect(`/dashboard/${user.role}`);
    }

    return <>{children}</>;
}