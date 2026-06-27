import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login?redirect=/dashboard/admin");
    }

    if (user.role !== "admin") {
        redirect(`/dashboard/${user.role}`);
    }

    return <>{children}</>;
}