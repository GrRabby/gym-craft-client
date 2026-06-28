import { getPublicForumPosts } from "@/actions/forum-posts";
import ForumGrid from "@/app/components/ForumGrid";

export const dynamic = "force-dynamic";

export default async function ForumPage({ searchParams }) {
    const sp = await searchParams;
    const page   = Math.max(1, Number(sp?.page) || 1);
    const search = String(sp?.search || "").trim();
    const limit  = 12;

    const {
        posts, totalPages, total, error,
    } = await getPublicForumPosts({ page, limit, search });

    return (
        <main className="min-h-screen bg-[#050505] pb-20">
            { }
            <section className="relative pt-28 pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
                <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#E8C667]/8 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#C9962E]/6 blur-[120px] pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-10 bg-[#E8C667]" />
                        <span className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[4px] uppercase">
                            Community
                        </span>
                    </div>
                    <h1 className="font-['Bebas_Neue'] text-5xl lg:text-7xl text-white tracking-wide leading-none">
                        Community{" "}
                        <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent">
                            Forum
                        </span>
                    </h1>
                    <p className="text-[#cfc6b8] text-base lg:text-lg mt-4 max-w-2xl">
                        Training insights, stories, and announcements from GymCraft trainers and admins.
                    </p>
                </div>
            </section>

            { }
            <section className="max-w-7xl mx-auto px-6 lg:px-8">
                {error ? (
                    <ErrorBanner message={error} />
                ) : (
                    <ForumGrid
                        initialPosts={posts}
                        currentPage={page}
                        totalPages={totalPages}
                        total={total}
                        initialSearch={search}
                    />
                )}
            </section>
        </main>
    );
}

function ErrorBanner({ message }) {
    return (
        <div className="max-w-xl p-6 border border-[#ff5a5a]/30 bg-[#ff5a5a]/5 text-[#ff8585] [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]">
            <p className="font-['Oswald'] text-xs tracking-[3px] uppercase mb-2">Error</p>
            <p className="text-sm">{message}</p>
        </div>
    );
}