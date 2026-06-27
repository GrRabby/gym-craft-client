import DashboardNavbar from "@/app/components/Dashboardnavbar";
import DashboardSidebar from "@/app/components/Dashboardsidebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#070707]">
            <DashboardSidebar />
            <div className="flex-1 lg:ml-[280px] flex flex-col">
                <DashboardNavbar></DashboardNavbar>
                <main className="flex-1 flex flex-col p-6 lg:p-10">{children}</main>
            </div>
        </div>
    );
}