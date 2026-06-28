"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell, BadgeCheck, AlertCircle, Info, CheckCheck, Trash2,
    Inbox, Loader2,
} from "lucide-react";

import {
    getMyNotifications,
    markNotificationReadAction,
    markAllNotificationsReadAction,
    deleteNotificationAction,
} from "@/actions/notifications";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";

const POLL_INTERVAL_MS = 30_000;


const META = {
    trainer_approved: { Icon: BadgeCheck,   color: "#4ade80" },
    trainer_rejected: { Icon: AlertCircle,  color: "#ff5a5a" },
    trainer_demoted:  { Icon: AlertCircle,  color: "#E8C667" },
    info:             { Icon: Info,         color: "#cfc6b8" },
};

function getMeta(type) {
    return META[type] || META.info;
}

 
export default function NotificationBell({ user }) {
    const router = useRouter();
    const containerRef = useRef(null);
    const [open, setOpen]                       = useState(false);
    const [notifications, setNotifications]     = useState([]);
    const [unreadCount, setUnreadCount]         = useState(0);
    const [loading, setLoading]                 = useState(true);
    const [, startTransition] = useTransition();

    
    useEffect(() => {
        if (!user) return;

        let cancelled = false;

        async function refresh() {
            const result = await getMyNotifications(20);
            if (cancelled) return;
            if (!result.error) {
                setNotifications(result.notifications);
                setUnreadCount(result.unreadCount);
            }
            setLoading(false);
        }

        refresh();
        const interval = setInterval(refresh, POLL_INTERVAL_MS);

        function handleFocus() { refresh(); }
        window.addEventListener("focus", handleFocus);

        return () => {
            cancelled = true;
            clearInterval(interval);
            window.removeEventListener("focus", handleFocus);
        };
    }, [user]);

    
    useEffect(() => {
        if (!open) return;
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    
    function handleClickNotification(n) {
        if (!n.isRead) {
            setNotifications((prev) =>
                prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x))
            );
            setUnreadCount((c) => Math.max(0, c - 1));
            startTransition(() => { markNotificationReadAction(n.id); });
        }
        setOpen(false);
        if (n.link) router.push(n.link);
    }

    function handleMarkAllRead() {
        if (unreadCount === 0) return;
        setNotifications((prev) => prev.map((x) => ({ ...x, isRead: true })));
        setUnreadCount(0);
        startTransition(() => { markAllNotificationsReadAction(); });
    }

    function handleDelete(n, e) {
        e.stopPropagation();  
        setNotifications((prev) => prev.filter((x) => x.id !== n.id));
        if (!n.isRead) setUnreadCount((c) => Math.max(0, c - 1));
        startTransition(() => { deleteNotificationAction(n.id); });
    }

    if (!user) return null;

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="Notifications"
                aria-expanded={open}
                className="relative inline-flex items-center justify-center h-9 w-9 text-[#cfc6b8] hover:text-[#E8C667] cursor-pointer transition-colors"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 inline-flex items-center justify-center bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] text-[#1a1304] text-[9px] font-bold rounded-full ring-2 ring-[#050505]">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.18 }}
                        className={`fixed sm:absolute right-3 sm:right-0 top-16 sm:top-full sm:mt-2 left-3 sm:left-auto w-auto sm:w-96 max-w-md sm:max-w-none bg-[#0a0a0a] border border-[#C9962E]/25 shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-50 ${CHAMFER_MD}`}
                    >
                        { }
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[#C9962E]/15">
                            <div className="flex items-center gap-2">
                                <span className="font-['Bebas_Neue'] text-xl text-white tracking-wide leading-none">
                                    Notifications
                                </span>
                                {unreadCount > 0 && (
                                    <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 bg-[#C9962E]/15 border border-[#C9962E]/40 text-[#E8C667] text-[10px] font-bold font-['Oswald'] tracking-wider rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={handleMarkAllRead}
                                    className="inline-flex items-center gap-1 text-[#7c7468] hover:text-[#E8C667] text-[10px] font-['Oswald'] tracking-[2px] uppercase cursor-pointer transition-colors"
                                >
                                    <CheckCheck size={11} />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        { }
                        <div className="max-h-[420px] overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 size={20} className="text-[#E8C667] animate-spin" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <ul>
                                    {notifications.map((n) => (
                                        <NotificationItem
                                            key={n.id}
                                            n={n}
                                            onClick={() => handleClickNotification(n)}
                                            onDelete={(e) => handleDelete(n, e)}
                                        />
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

 

function NotificationItem({ n, onClick, onDelete }) {
    const { Icon, color } = getMeta(n.type);

    return (
        <li
            onClick={onClick}
            className={`group relative px-4 py-3 cursor-pointer transition-colors border-b border-[#C9962E]/10 last:border-b-0 ${
                n.isRead
                    ? "hover:bg-[#C9962E]/[0.04]"
                    : "bg-[#C9962E]/[0.05] hover:bg-[#C9962E]/[0.09]"
            }`}
        >
            <div className="flex items-start gap-3">
                { }
                <div
                    className={`shrink-0 inline-flex items-center justify-center h-9 w-9 border ${CHAMFER_SM}`}
                    style={{
                        background: `${color}12`,
                        borderColor: `${color}40`,
                        color,
                    }}
                >
                    <Icon size={15} />
                </div>

                { }
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-white text-sm font-semibold leading-tight">
                            {n.title}
                        </p>
                        {!n.isRead && (
                            <span
                                className="shrink-0 h-2 w-2 rounded-full mt-1.5"
                                style={{ background: color }}
                                aria-label="Unread"
                            />
                        )}
                    </div>
                    <p className="text-[#cfc6b8] text-xs mt-1 leading-relaxed line-clamp-2">
                        {n.message}
                    </p>
                    <p className="text-[#5a5247] text-[10px] font-['Oswald'] tracking-[2px] uppercase mt-1.5">
                        {formatTime(n.createdAt)}
                    </p>
                </div>

                { }
                <button
                    type="button"
                    onClick={onDelete}
                    aria-label="Delete notification"
                    className="shrink-0 opacity-0 group-hover:opacity-100 text-[#7c7468] hover:text-[#ff5a5a] cursor-pointer transition-all p-1"
                >
                    <Trash2 size={12} />
                </button>
            </div>
        </li>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Inbox size={28} className="text-[#C9962E]/30 mb-3" />
            <p className="text-[#cfc6b8] text-sm">No notifications yet</p>
            <p className="text-[#5a5247] text-xs mt-1">
                You'll see updates here as they happen.
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
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}