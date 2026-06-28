import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCurrentUser } from "@/lib/permissions";
import { getForumPostDetails } from "@/actions/forum-posts";
import { getComments } from "@/actions/comments";
import PostDetailsView from "@/app/components/PostDetailsView";
import PostVoteButtons from "@/app/components/PostVoteButtons";
import CommentsSection from "@/app/components/CommentsSection";


export const dynamic = "force-dynamic";

export default async function ForumPostDetailsPage({ params }) {
    const { id } = await params;

    
    const user = await getCurrentUser();
    if (!user) {
        redirect(`/login?redirect=/forum/${id}`);
    }

    
    const [details, commentsResult] = await Promise.all([
        getForumPostDetails(id),
        getComments(id),
    ]);
    if (!details.post) {
        if (details.status === 404) notFound();
        
    }
    return (
        <main className="min-h-screen bg-[#050505] pb-20">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-24 lg:pt-28">
                { }
                <Link
                    href="/forum"
                    className="inline-flex items-center gap-2 text-[#cfc6b8] hover:text-[#E8C667] transition-colors text-sm font-['Oswald'] tracking-[2px] uppercase mb-8 no-underline"
                >
                    <ArrowLeft size={14} />
                    Back to Community Forum
                </Link>

                {details.error && !details.post ? (
                    <ErrorBanner message={details.error} />
                ) : (
                    <>
                        { }
                        <PostDetailsView post={details.post} />

                        { }
                        <PostVoteButtons
                            postId={details.post.id}
                            initialLikes={details.likes}
                            initialDislikes={details.dislikes}
                            initialUserVote={details.userVote}
                        />

                        { }
                        <hr className="my-10 border-[#C9962E]/20" />

                        { }
                        <CommentsSection
                            postId={details.post.id}
                            initialComments={commentsResult.comments}
                            currentUser={{
                                id:    user.id,
                                name:  user.name,
                                image: user.image,
                                role:  user.role,
                            }}
                        />
                    </>
                )}
            </div>
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