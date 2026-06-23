import DashboardNavbar from "@/app/components/Dashboardnavbar";
import DashboardSidebar from "@/app/components/Dashboardsidebar";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#070707]">
            <DashboardSidebar />
            <main className="flex-1 lg:ml-[280px]">
                <DashboardNavbar></DashboardNavbar>
                <main className="p-6 lg:p-10">{children}</main>
            </main>
            <Toaster
                theme="dark"
                position="top-right"
                richColors
                toastOptions={{
                    classNames: {
                        actionButton: "!bg-linear-to-br !from-[#F7E4A3] !via-[#E8C667] !to-[#C9962E] !text-[#1a1304]",
                        cancelButton: "!bg-white/5 !text-[#cfc6b8] !border !border-[#C9962E]/30",
                    },
                }}
            />
        </div>
    );
}