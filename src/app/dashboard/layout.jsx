import DashboardNavbar from "@/app/components/Dashboardnavbar";
import DashboardSidebar from "@/app/components/Dashboardsidebar";


export default function DashboardLayout ({ children }) {
    return (
        <div className="flex min-h-screen bg-[#070707]">
            <DashboardSidebar />
            <main className="flex-1 lg:ml-[280px]">
                <DashboardNavbar></DashboardNavbar>
                <main className="p-6 lg:p-10">{children}</main>
            </main>
        </div>
    );
}