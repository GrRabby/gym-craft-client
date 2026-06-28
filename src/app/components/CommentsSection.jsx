"use client";

import { useState, useTransition, useMemo } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send, Reply, Edit2, Trash2, Loader2, MessageCircle,
    Check, X, ShieldCheck, BadgeCheck, User as UserIcon,
} from "lucide-react";

import {
    addCommentAction,
    editCommentAction,
    deleteCommentAction,
} from "@/actions/comments";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";

const MAX_LEN = 2000;

export default function CommentsSection({ postId, initialComments = [], currentUser }) {
    const [comments, setComments] = useState(initialComments);
    const [newText, setNewText] = useState("");
    const [submittingTop, startTopTransition] = useTransition();

    
    const { topLevel, repliesByParent } = useMemo(() => {
        const top = [];
        const byParent = {};
        for (const c of comments) {
            if (c.parentId) {
                if (!byParent[c.parentId]) byParent[c.parentId] = [];
                byParent[c.parentId].push(c);
            } else {
                top.push(c);
            }
        }
        return { topLevel: top, repliesByParent: byParent };
    }, [comments]);

     

    function handleAddTop() {
        const text = newText.trim();
        if (!text) return;
        if (text.length > MAX_LEN) {
            toast.error(`Comment too long (max ${MAX_LEN})`);
            return;
        }

        startTopTransition(async () => {
            const result = await addCommentAction({ postId, parentId: null, content: text });
            if (!result.ok) {
                toast.error(result.error || "Failed to post");
                return;
            }
            setComments((prev) => [...prev, result.comment]);
            setNewText("");
        });
    }

    function handleAddReply(parentId, text, onDone) {
        addCommentAction({ postId, parentId, content: text }).then((result) => {
            if (!result.ok) {
                toast.error(result.error || "Failed to reply");
                onDone(false);
                return;
            }
            setComments((prev) => [...prev, result.comment]);
            onDone(true);
        });
    }

    function handleEdit(commentId, newContent, onDone) {
        editCommentAction(commentId, newContent).then((result) => {
            if (!result.ok) {
                toast.error(result.error || "Failed to edit");
                onDone(false);
                return;
            }
            setComments((prev) =>
                prev.map((c) =>
                    c.id === commentId
                        ? { ...c, content: result.comment.content, isEdited: true, updatedAt: result.comment.updatedAt }
                        : c
                )
            );
            onDone(true);
        });
    }

     
    function handleDelete(comment) {
        const replyCount = !comment.parentId
            ? (repliesByParent[comment.id] || []).length
            : 0;

        const description = replyCount > 0
            ? `This will also delete ${replyCount} ${replyCount === 1 ? "reply" : "replies"}. This action cannot be undone.`
            : "This action cannot be undone.";

        toast("Delete this comment?", {
            description,
            duration: 8000,
            action: {
                label: "Delete",
                onClick: async () => {
                    const result = await deleteCommentAction(comment.id);
                    if (!result.ok) {
                        toast.error(result.error || "Failed to delete");
                        return;
                    }
                    const removeSet = new Set(result.deletedIds);
                    setComments((prev) => prev.filter((c) => !removeSet.has(c.id)));
                    toast.success("Comment deleted");
                },
            },
            cancel: { label: "Cancel", onClick: () => {} },
        });
    }

    return (
        <section>
            { }
            <div className="flex items-center gap-3 mb-6">
                <MessageCircle size={20} className="text-[#E8C667]" />
                <h2 className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none">
                    Comments
                </h2>
                <span className="font-['Oswald'] text-xs tracking-[2px] uppercase text-[#7c7468]">
                    ({comments.length})
                </span>
            </div>

            { }
            <div className={`bg-[#0a0a0a] border border-[#C9962E]/15 p-5 mb-8 ${CHAMFER_MD}`}>
                <div className="flex items-start gap-3">
                    <Avatar user={currentUser} size={32} />
                    <div className="flex-1 min-w-0">
                        <textarea
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            placeholder="Share your thoughts…"
                            rows={3}
                            maxLength={MAX_LEN}
                            className={`w-full bg-[#050505] border border-[#C9962E]/20 text-white placeholder:text-[#5a5247] text-sm px-3 py-2.5 outline-none focus:border-[#E8C667]/60 transition-colors resize-y ${CHAMFER_SM}`}
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-[#5a5247] font-['Oswald'] tracking-[2px]">
                                {newText.length}/{MAX_LEN}
                            </span>
                            <button
                                type="button"
                                onClick={handleAddTop}
                                disabled={submittingTop || !newText.trim()}
                                className={`inline-flex items-center gap-2 px-4 py-2 font-['Oswald'] font-semibold text-xs tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.2)] transition-all ${CHAMFER_SM}`}
                            >
                                {submittingTop ? (
                                    <Loader2 size={12} className="animate-spin" />
                                ) : (
                                    <Send size={12} />
                                )}
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            { }
            {topLevel.length === 0 ? (
                <EmptyComments />
            ) : (
                <div className="space-y-4">
                    <AnimatePresence initial={false}>
                        {topLevel.map((c) => (
                            <CommentThread
                                key={c.id}
                                comment={c}
                                replies={repliesByParent[c.id] || []}
                                currentUser={currentUser}
                                onAddReply={handleAddReply}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </section>
    );
}

 

function CommentThread({ comment, replies, currentUser, onAddReply, onEdit, onDelete }) {
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [submittingReply, setSubmittingReply] = useState(false);

    function submitReply() {
        const text = replyText.trim();
        if (!text) return;
        if (text.length > MAX_LEN) {
            toast.error(`Reply too long (max ${MAX_LEN})`);
            return;
        }
        setSubmittingReply(true);
        onAddReply(comment.id, text, (ok) => {
            setSubmittingReply(false);
            if (ok) {
                setReplyText("");
                setReplyingTo(null);
            }
        });
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.25 } }}
            transition={{ duration: 0.2 }}
        >
            <CommentItem
                comment={comment}
                currentUser={currentUser}
                canReply
                onReply={() => setReplyingTo(replyingTo === "thread" ? null : "thread")}
                onEdit={onEdit}
                onDelete={onDelete}
            />

            { }
            {replyingTo === "thread" && (
                <div className="ml-8 mt-3 pl-4 border-l-2 border-[#C9962E]/20">
                    <div className={`bg-[#0a0a0a] border border-[#C9962E]/15 p-4 ${CHAMFER_SM}`}>
                        <div className="flex items-start gap-2.5">
                            <Avatar user={currentUser} size={24} />
                            <div className="flex-1 min-w-0">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={`Reply to ${comment.author?.name || "this comment"}…`}
                                    rows={2}
                                    maxLength={MAX_LEN}
                                    autoFocus
                                    className={`w-full bg-[#050505] border border-[#C9962E]/20 text-white placeholder:text-[#5a5247] text-sm px-3 py-2 outline-none focus:border-[#E8C667]/60 transition-colors resize-y ${CHAMFER_SM}`}
                                />
                                <div className="flex items-center justify-end gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => { setReplyingTo(null); setReplyText(""); }}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-['Oswald'] font-semibold text-[10px] tracking-[2px] uppercase text-[#cfc6b8] bg-[#1a1a1a] border border-[#C9962E]/20 hover:border-[#C9962E]/50 cursor-pointer transition-colors ${CHAMFER_SM}`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={submitReply}
                                        disabled={submittingReply || !replyText.trim()}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-['Oswald'] font-semibold text-[10px] tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all ${CHAMFER_SM}`}
                                    >
                                        {submittingReply ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            { }
            {replies.length > 0 && (
                <div className="ml-8 mt-3 pl-4 border-l-2 border-[#C9962E]/20 space-y-3">
                    <AnimatePresence initial={false}>
                        {replies.map((r) => (
                            <motion.div
                                key={r.id}
                                layout
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                                transition={{ duration: 0.2 }}
                            >
                                <CommentItem
                                    comment={r}
                                    currentUser={currentUser}
                                    canReply={false}
                                    isReply
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
}

 

function CommentItem({ comment, currentUser, canReply, isReply, onReply, onEdit, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const [submittingEdit, setSubmittingEdit] = useState(false);

    const isOwn = currentUser?.id === comment.author?.id;

    function submitEdit() {
        const text = editText.trim();
        if (!text) return;
        if (text === comment.content) {
            setEditing(false);
            return;
        }
        if (text.length > MAX_LEN) {
            toast.error(`Comment too long (max ${MAX_LEN})`);
            return;
        }
        setSubmittingEdit(true);
        onEdit(comment.id, text, (ok) => {
            setSubmittingEdit(false);
            if (ok) setEditing(false);
        });
    }

    return (
        <div className={`bg-[#0a0a0a] border border-[#C9962E]/15 p-4 ${CHAMFER_SM}`}>
            <div className="flex items-start gap-3">
                <Avatar user={comment.author} size={isReply ? 26 : 30} />

                <div className="flex-1 min-w-0">
                    { }
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-sm font-semibold truncate">
                            {comment.author?.name || "Unknown"}
                        </span>
                        {comment.author?.role && <RoleBadge role={comment.author.role} />}
                        <span className="text-[#5a5247] text-xs">•</span>
                        <span className="text-[#7c7468] text-xs">{formatTime(comment.createdAt)}</span>
                        {comment.isEdited && (
                            <span className="text-[#5a5247] text-[10px] italic">(edited)</span>
                        )}
                    </div>

                    { }
                    {editing ? (
                        <div className="mt-2">
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                rows={3}
                                maxLength={MAX_LEN}
                                autoFocus
                                className={`w-full bg-[#050505] border border-[#C9962E]/20 text-white text-sm px-3 py-2 outline-none focus:border-[#E8C667]/60 transition-colors resize-y ${CHAMFER_SM}`}
                            />
                            <div className="flex items-center justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => { setEditing(false); setEditText(comment.content); }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[#cfc6b8] text-xs hover:text-white cursor-pointer transition-colors"
                                >
                                    <X size={11} />
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={submitEdit}
                                    disabled={submittingEdit || !editText.trim()}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-['Oswald'] font-semibold text-[10px] tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all ${CHAMFER_SM}`}
                                >
                                    {submittingEdit ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-[#cfc6b8]">
                            {comment.content}
                        </p>
                    )}

                    { }
                    {!editing && (
                        <div className="flex items-center gap-3 mt-2.5">
                            {canReply && (
                                <button
                                    type="button"
                                    onClick={onReply}
                                    className="inline-flex items-center gap-1 text-[#7c7468] hover:text-[#E8C667] text-xs font-['Oswald'] tracking-wider uppercase cursor-pointer transition-colors"
                                >
                                    <Reply size={11} />
                                    Reply
                                </button>
                            )}
                            {isOwn && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => { setEditText(comment.content); setEditing(true); }}
                                        className="inline-flex items-center gap-1 text-[#7c7468] hover:text-[#E8C667] text-xs font-['Oswald'] tracking-wider uppercase cursor-pointer transition-colors"
                                    >
                                        <Edit2 size={11} />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(comment)}
                                        className="inline-flex items-center gap-1 text-[#7c7468] hover:text-[#ff5a5a] text-xs font-['Oswald'] tracking-wider uppercase cursor-pointer transition-colors"
                                    >
                                        <Trash2 size={11} />
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

 

function Avatar({ user, size = 28 }) {
    if (user?.image) {
        
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
            style={{ width: size, height: size, fontSize: size * 0.42 }}
        >
            {initials}
        </span>
    );
}

function RoleBadge({ role }) {
    const meta = {
        admin:   { Icon: ShieldCheck, label: "Admin",   className: "text-[#E8C667]" },
        trainer: { Icon: BadgeCheck,  label: "Trainer", className: "text-[#C9962E]" },
        member:  { Icon: UserIcon,    label: "Member",  className: "text-[#7c7468]" },
    };
    const m = meta[role];
    if (!m) return null;
    const Icon = m.Icon;
    return (
        <span className={`inline-flex items-center gap-0.5 text-[9px] font-['Oswald'] tracking-[2px] uppercase ${m.className}`}>
            <Icon size={9} />
            {m.label}
        </span>
    );
}

function EmptyComments() {
    return (
        <div className={`bg-[#0a0a0a] border border-dashed border-[#C9962E]/15 p-10 text-center ${CHAMFER_SM}`}>
            <MessageCircle size={28} className="text-[#C9962E]/30 mx-auto mb-3" />
            <p className="text-[#7c7468] text-sm">
                No comments yet. Be the first to share your thoughts.
            </p>
        </div>
    );
}

function formatTime(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    const now = new Date();
    const diffSec = Math.floor((now - d) / 1000);

    if (diffSec < 60) return "just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}