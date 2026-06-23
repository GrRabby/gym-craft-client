import { redirect } from "next/navigation";
import { getAllUsers } from "@/actions/users";
import { requireAdmin } from "@/lib/permissions";
import UsersTable from "@/app/components/Userstable";

export const dynamic = "force-dynamic";

export default async function ManageUsersPage() {
    const { error } = await requireAdmin();
    if (error) redirect("/login?redirect=/dashboard/admin/users");

    const users = await getAllUsers();
    return <UsersTable initialUsers={users} />;
}