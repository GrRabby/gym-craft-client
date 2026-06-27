import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/permissions";
import { getMyForumPosts } from "@/actions/forum-posts";
import MyForumPostsGrid from "@/app/components/MyForumPostsGrid";

export const dynamic = "force-dynamic";

export default async function MyForumPostsPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }
    if (user.role !== "trainer") {
        redirect("/dashboard");
    }

    const { posts, error } = await getMyForumPosts();

    return (
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-10 bg-[#E8C667]" />
                    <span className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[4px] uppercase">
                        Coach Tools
                    </span>
                </div>
                <div className="flex items-end justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="font-['Bebas_Neue'] text-4xl lg:text-5xl text-white tracking-wide leading-none">
                            My Forum{" "}
                            <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent">
                                Posts
                            </span>
                        </h1>
                        <p className="text-[#cfc6b8] text-sm mt-2">
                            Everything you&apos;ve shared with the GymCraft community.
                        </p>
                    </div>
                    {posts.length > 0 && (
                        <span className="font-['Oswald'] text-xs tracking-[3px] uppercase text-[#7c7468]">
                            {posts.length} {posts.length === 1 ? "post" : "posts"}
                        </span>
                    )}
                </div>
            </div>

            {error ? (
                <div className="max-w-xl p-6 border border-[#ff5a5a]/30 bg-[#ff5a5a]/5 text-[#ff8585] [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]">
                    <p className="font-['Oswald'] text-xs tracking-[3px] uppercase mb-2">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            ) : (
                <MyForumPostsGrid initialPosts={posts} />
            )}
        </div>
    );
}