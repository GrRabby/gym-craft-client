"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trash2, Loader2, Search, MessageSquare, EyeOff, ShieldCheck,
    BadgeCheck, User as UserIcon, AlertTriangle
} from "lucide-react";

import { deleteForumPostAction } from "@/actions/forum-posts";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";

export default function ManageForumPostsTable({ initialPosts = [] }) {
    const router = useRouter();
    const [posts, setPosts] = useState(initialPosts);
    const [deletingPost, setDeletingPost] = useState(null);
    const [search, setSearch] = useState("");
    const [isPending, startTransition] = useTransition();

    // Client-side search filter — case-insensitive substring match against
    // title, description, and author name/email. Cheap for any realistic
    // moderation queue (< a few thousand posts).
    const filteredPosts = useMemo(() => {
        if (!search.trim()) return posts;
        const q = search.trim().toLowerCase();
        return posts.filter((p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.author.name?.toLowerCase().includes(q) ||
            p.author.email?.toLowerCase().includes(q),
        );
    }, [posts, search]);

    function confirmDelete(post) {
        setDeletingPost(post);
    }

    function performDelete(post) {
        startTransition(async () => {
            const result = await deleteForumPostAction(post.id);

            if (!result.ok) {
                toast.error(result.error || "Failed to delete post");
            } else {
                toast.success(`Removed "${truncate(post.title, 40)}"`);
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
                <div className="space-y-4">
                    {/* Search */}
                    <div className="relative max-w-md">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7c7468] pointer-events-none" />
                        <input
                            type="search"
                            placeholder="Search title, description, or author…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full bg-[#0a0a0a] border border-[#C9962E]/20 text-white placeholder:text-[#5a5247] text-sm pl-10 pr-4 py-2.5 outline-none focus:border-[#E8C667]/60 transition-colors ${CHAMFER_SM}`}
                        />
                    </div>

                    {/* Table */}
                    <div className={`bg-[#0a0a0a] border border-[#C9962E]/15 overflow-hidden ${CHAMFER_MD}`}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-[#C9962E]/15">
                                        <Th>Post</Th>
                                        <Th>Author</Th>
                                        <Th>Status</Th>
                                        <Th>Posted</Th>
                                        <Th align="right">Action</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence initial={false}>
                                        {filteredPosts.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-5 py-12 text-center text-[#7c7468] text-sm">
                                                    No posts match your search.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredPosts.map((post, i) => (
                                                <PostRow
                                                    key={post.id}
                                                    post={post}
                                                    isLast={i === filteredPosts.length - 1}
                                                    isRemoving={deletingPost?.id === post.id && isPending}
                                                    onDelete={() => confirmDelete(post)}
                                                />
                                            ))
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
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

/* ---------- row ---------- */

function PostRow({ post, isLast, isRemoving, onDelete }) {
    const isHidden = post.status === "flagged" || post.status === "removed";

    return (
        <motion.tr
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -24, transition: { duration: 0.25 } }}
            transition={{ duration: 0.2 }}
            className={`group transition-colors hover:bg-[#C9962E]/[0.04] ${isLast ? "" : "border-b border-[#C9962E]/10"
                }`}
        >
            {/* Post — thumbnail + title + description preview */}
            <td className="px-5 py-4">
                <div className="flex items-start gap-3 min-w-[280px] max-w-[480px]">
                    {post.image ? (
                        <div className={`relative w-16 h-16 shrink-0 overflow-hidden bg-[#0f0f0f] border border-[#C9962E]/20 ${CHAMFER_SM}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={post.image} alt="" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className={`w-16 h-16 shrink-0 flex items-center justify-center bg-[#0f0f0f] border border-[#C9962E]/20 ${CHAMFER_SM}`}>
                            <MessageSquare size={22} className="text-[#C9962E]/40" />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="font-['Bebas_Neue'] text-lg text-white tracking-wide leading-tight line-clamp-1 group-hover:text-[#E8C667] transition-colors">
                            {post.title}
                        </p>
                        <p className="text-[#7c7468] text-xs mt-1 line-clamp-2 leading-relaxed">
                            {post.description}
                        </p>
                    </div>
                </div>
            </td>

            {/* Author — avatar + name + role */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-2.5 min-w-[160px]">
                    <Avatar user={post.author} size={28} />
                    <div className="min-w-0">
                        <p className="text-[#cfc6b8] text-sm truncate">{post.author.name}</p>
                        <RoleLabel role={post.author.role} />
                    </div>
                </div>
            </td>

            {/* Status */}
            <td className="px-5 py-4">
                {isHidden ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#ff5a5a]/10 border border-[#ff5a5a]/40 text-[#ff8585] font-['Oswald'] text-[10px] font-bold tracking-[2px] uppercase [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]">
                        <EyeOff size={10} />
                        {post.status === "flagged" ? "Flagged" : "Removed"}
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] font-['Oswald'] text-[10px] font-bold tracking-[2px] uppercase [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]">
                        <ShieldCheck size={10} />
                        Live
                    </span>
                )}
            </td>

            {/* Date */}
            <td className="px-5 py-4">
                <span className="text-[#cfc6b8] text-xs whitespace-nowrap">
                    {formatDate(post.createdAt)}
                </span>
            </td>

            {/* Delete */}
            <td className="px-5 py-4 text-right">
                <button
                    type="button"
                    onClick={onDelete}
                    disabled={isRemoving}
                    aria-label={`Delete post: ${post.title}`}
                    title="Delete post"
                    className={`inline-flex items-center justify-center h-[34px] w-[34px] border border-[#ff5a5a]/30 hover:border-[#ff5a5a]/70 hover:bg-[#ff5a5a]/10 text-[#ff8585] hover:text-[#ff5a5a] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-wait ${CHAMFER_SM}`}
                >
                    {isRemoving ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Trash2 size={14} />
                    )}
                </button>
            </td>
        </motion.tr>
    );
}

/* ---------- helpers ---------- */

function Th({ children, align = "left" }) {
    return (
        <th
            className={`px-5 py-3.5 font-['Oswald'] text-[10px] font-semibold tracking-[3px] uppercase text-[#7c7468] text-${align}`}
        >
            {children}
        </th>
    );
}

function RoleLabel({ role }) {
    const meta = {
        admin: { Icon: ShieldCheck, label: "Admin", className: "text-[#E8C667]" },
        trainer: { Icon: BadgeCheck, label: "Trainer", className: "text-[#C9962E]" },
        member: { Icon: UserIcon, label: "Member", className: "text-[#7c7468]" },
    };
    const m = meta[role] || meta.member;
    const Icon = m.Icon;
    return (
        <span className={`inline-flex items-center gap-1 text-[10px] font-['Oswald'] tracking-[2px] uppercase ${m.className}`}>
            <Icon size={9} />
            {m.label}
        </span>
    );
}

function Avatar({ user, size = 28 }) {
    if (user?.image) {
        // eslint-disable-next-line @next/next/no-img-element
        return (
            <img
                src={user.image}
                alt=""
                className="rounded-full object-cover border border-[#C9962E]/40 shrink-0"
                style={{ width: size, height: size }}
            />
        );
    }
    const initials = (user?.name || "U")
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    return (
        <span
            className="rounded-full inline-flex items-center justify-center bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] font-bold border border-[#C9962E]/40 shrink-0"
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {initials}
        </span>
    );
}

function EmptyState() {
    return (
        <div className={`bg-[#0a0a0a] border border-[#C9962E]/15 py-16 px-8 text-center ${CHAMFER_MD}`}>
            <div className="inline-flex items-center justify-center h-16 w-16 mb-5 bg-[#C9962E]/5 border border-[#C9962E]/20 rounded-full">
                <MessageSquare size={26} className="text-[#C9962E]/50" />
            </div>
            <p className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none mb-2">
                No posts to moderate
            </p>
            <p className="text-[#7c7468] text-sm max-w-md mx-auto">
                Community posts will appear here as trainers and admins publish them.
            </p>
        </div>
    );
}

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