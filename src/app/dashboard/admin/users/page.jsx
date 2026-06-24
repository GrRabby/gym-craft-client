import { redirect } from "next/navigation";
import { getAllUsers } from "@/actions/users";
import { requireAdmin } from "@/lib/permissions";
import UsersTable from "@/app/components/Userstable";

export const dynamic = "force-dynamic";

export default async function ManageUsersPage() {
    const { error } = await requireAdmin();
    if (error) redirect("/login?redirect=/dashboard/admin/users");

    const { users, error: fetchError } = await getAllUsers();
    if (fetchError) {
        return (
            <div className="p-8 border border-[#ff5a5a]/30 bg-[#ff5a5a]/5 text-[#ff8585]">
                <p className="font-['Oswald'] text-xs tracking-[3px] uppercase mb-2">Error</p>
                <p className="text-sm">{fetchError}</p>
            </div>
        );
    }
    return <UsersTable initialUsers={users} />;
}