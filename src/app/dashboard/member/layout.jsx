import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export default async function MemberLayout({ children }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login?redirect=/dashboard/member");
    }

    if (user.role !== "member") {
        redirect(`/dashboard/${user.role}`);
    }

    return <>{children}</>;
}