import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function DashboardIndexPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login?redirect=/dashboard");
    }

    switch (user.role) {
        case "admin":
            redirect("/dashboard/admin");
        case "trainer":
            redirect("/dashboard/trainer");
        case "member":
        default:
            redirect("/dashboard/member");
    }
}