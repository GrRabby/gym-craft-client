"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trash2, Loader2, MessageSquarePlus, MessageSquare,
    Clock, EyeOff, AlertTriangle
} from "lucide-react";

import { deleteForumPostAction } from "@/actions/forum-posts";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";

export default function MyForumPostsGrid({ initialPosts = [] }) {
    const router = useRouter();
    const [posts, setPosts] = useState(initialPosts);
    const [deletingPost, setDeletingPost] = useState(null);
    const [isPending, startTransition] = useTransition();

    function confirmDelete(post) {
        setDeletingPost(post);
    }

    function performDelete(post) {
        startTransition(async () => {
            const result = await deleteForumPostAction(post.id);

            if (!result.ok) {
                if (result.blocked) {
                    toast.error("Action restricted by Admin");
                } else {
                    toast.error(result.error || "Failed to delete post");
                }
            } else {
                toast.success("Post deleted");
                setPosts((prev) => prev.filter((p) => p.id !== post.id));
                setDeletingPost(null);
                router.refresh();
            }
        });
    }

    return (
        <>
            {posts.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AnimatePresence initial={false} mode="popLayout">
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                isRemoving={deletingPost?.id === post.id && isPending}
                                onDelete={() => confirmDelete(post)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingPost && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div onClick={() => !isPending && setDeletingPost(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                    <div className="relative w-full max-w-md bg-[#0a0a0a] border border-[#ff5a5a]/45 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]">
                        <div className="flex items-center gap-3 text-[#ff8585] mb-4">
                            <AlertTriangle size={24} className="shrink-0 animate-bounce" />
                            <h3 className="font-['Bebas_Neue'] text-2xl tracking-wide leading-none">Delete Post?</h3>
                        </div>
                        <p className="text-[#cfc6b8] text-sm leading-relaxed mb-6">
                            Are you sure you want to delete <span className="text-white font-semibold">"{deletingPost.title}"</span>? This action is permanent and cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeletingPost(null)}
                                disabled={isPending}
                                className="font-['Oswald'] text-xs tracking-[2px] uppercase text-[#cfc6b8] hover:text-white px-4 py-2 cursor-pointer disabled:opacity-40"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => performDelete(deletingPost)}
                                disabled={isPending}
                                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 font-['Oswald'] text-xs font-semibold tracking-[2px] uppercase cursor-pointer bg-[#ff5a5a]/15 border border-[#ff5a5a]/50 hover:border-[#ff5a5a] hover:bg-[#ff5a5a]/25 text-[#ff8585] hover:text-[#ffadad] [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)]"
                            >
                                {isPending ? (
                                    <><Loader2 size={12} className="animate-spin" /> Deleting…</>
                                ) : (
                                    "Yes, Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* ---------- card ---------- */

function PostCard({ post, isRemoving, onDelete }) {
    const isHidden = post.status === "flagged" || post.status === "removed";

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
            transition={{ duration: 0.25 }}
            className={`group relative bg-[#0a0a0a] border ${isHidden ? "border-[#ff5a5a]/25" : "border-[#C9962E]/50 hover:border-[#C9962E]/80"
                } transition-colors overflow-hidden flex flex-col ${CHAMFER_MD}`}
        >
            {/* Cover image with overlaid delete button */}
            <div className="relative aspect-[16/10] bg-[#0f0f0f] overflow-hidden">
                {post.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={post.image}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <MessageSquare size={36} className="text-[#C9962E]/25" />
                    </div>
                )}
                <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/50 to-transparent pointer-events-none" />

                {/* Status badge — only shown for non-published states */}
                {isHidden && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-sm border border-[#ff5a5a]/40 text-[#ff8585] font-['Oswald'] text-[10px] font-semibold tracking-[2px] uppercase [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]">
                        <EyeOff size={10} />
                        {post.status === "flagged" ? "Flagged" : "Removed"}
                    </span>
                )}

                {/* Delete button — top right of image */}
                <button
                    type="button"
                    onClick={onDelete}
                    disabled={isRemoving}
                    aria-label={`Delete post: ${post.title}`}
                    title="Delete post"
                    className={`absolute top-3 right-3 inline-flex items-center justify-center h-8 w-8 bg-black/70 backdrop-blur-sm border border-[#ff5a5a]/40 text-[#ff8585] hover:border-[#ff5a5a] hover:text-[#ff5a5a] hover:bg-[#ff5a5a]/10 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-wait ${CHAMFER_SM}`}
                >
                    {isRemoving ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Trash2 size={14} />
                    )}
                </button>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-['Bebas_Neue'] text-2xl text-white tracking-wide leading-tight line-clamp-2 group-hover:text-[#E8C667] transition-colors">
                    {post.title}
                </h3>

                <p className="text-[#7c7468] text-xs mt-2 inline-flex items-center gap-1.5">
                    <Clock size={11} />
                    {formatDate(post.createdAt)}
                </p>

                <p className="text-[#cfc6b8] text-sm mt-3 leading-relaxed line-clamp-3 whitespace-pre-line">
                    {post.description}
                </p>
            </div>
        </motion.article>
    );
}

/* ---------- empty state ---------- */

function EmptyState() {
    return (
        <div className={`bg-[#0a0a0a] border border-[#C9962E]/15 py-16 px-8 text-center ${CHAMFER_MD}`}>
            <div className="inline-flex items-center justify-center h-16 w-16 mb-5 bg-[#C9962E]/5 border border-[#C9962E]/20 rounded-full">
                <MessageSquare size={26} className="text-[#C9962E]/50" />
            </div>
            <p className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none mb-2">
                No posts yet
            </p>
            <p className="text-[#7c7468] text-sm max-w-md mx-auto mb-8">
                Share your first training tip, story, or insight with the GymCraft
                community. Your posts will show up here.
            </p>
            <Link
                href="/dashboard/trainer/forum/new"
                className={`inline-flex items-center gap-2 px-6 py-3 font-['Oswald'] font-semibold text-xs tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] cursor-pointer no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.25)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_5px_16px_rgba(201,150,46,0.35)] transition-all ${CHAMFER_SM}`}
            >
                <MessageSquarePlus size={14} />
                Add Your First Post
            </Link>
        </div>
    );
}

/* ---------- helpers ---------- */

function truncate(s, n) {
    if (!s) return "";
    return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

function formatDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}