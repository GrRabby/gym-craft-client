import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/permissions";
import AddForumPostForm from "@/app/components/AddForumPostForm";

export const dynamic = "force-dynamic";

export default async function AddForumPostPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }
    
    
    if (user.role !== "trainer") {
        redirect("/dashboard");
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-10 bg-[#E8C667]" />
                    <span className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[4px] uppercase">
                        Coach Tools
                    </span>
                </div>
                <h1 className="font-['Bebas_Neue'] text-4xl lg:text-5xl text-white tracking-wide leading-none">
                    Add{" "}
                    <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent">
                        Forum Post
                    </span>
                </h1>
                <p className="text-[#cfc6b8] text-sm mt-2">
                    Share insights, training tips, or stories with the GymCraft community.
                </p>
            </div>

            <AddForumPostForm />
        </div>
    );
}