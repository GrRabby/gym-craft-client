'use client'
import { authClient } from "@/lib/auth-client";

const ROLE_LABELS = {
    member:  "Member",
    trainer: "Trainer",
    admin:   "Admin",
};

export default function DashboardNavbar() {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const roleLabel = ROLE_LABELS[user?.role] || "Member";
    const firstName = user?.name?.split(" ")[0] || "there";

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });

    return (
        <header className="relative bg-[#0a0a0a]/60 backdrop-blur-sm border-b border-[#C9962E]/15">
            <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#C9962E]/40 to-transparent" />

            <div className="flex items-center justify-between gap-6 py-4 lg:py-4 pl-20 lg:pl-5 pr-6 lg:pr-5">
                <div className="min-w-0">
                    <div className="flex items-center gap-2.5 mb-2">
                        <div className="h-px w-7 bg-[#E8C667]" />
                        <span className="font-['Oswald'] text-[#E8C667] text-[10px] font-semibold tracking-[4px] uppercase">
                            {roleLabel} Area
                        </span>
                    </div>
                    <p className="text-[#cfc6b8] text-sm mt-1 truncate">
                        Welcome back,{" "}
                        <span className="text-white font-medium">{firstName}!</span>
                    </p>
                </div>
                <div className="hidden md:flex flex-col items-end pt-1 shrink-0">
                    <span className="font-['Oswald'] text-[10px] tracking-[3px] uppercase text-[#7c7468]">
                        Today
                    </span>
                    <span className="font-['Oswald'] text-sm tracking-[2px] uppercase text-[#E8C667] mt-1">
                        {today}
                    </span>
                </div>
            </div>
        </header>
    );
}