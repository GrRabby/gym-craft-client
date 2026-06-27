"use client";

import { useRef, useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare, ArrowRight, ChevronLeft, ChevronRight,
    ShieldCheck, BadgeCheck, Search, X, Loader2,
} from "lucide-react";

import { ContainedLoader } from "@/app/components/DumbbellSpinner";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";

const DEBOUNCE_MS = 350;

export default function ForumGrid({
    initialPosts = [],
    currentPage,
    totalPages,
    total = 0,
    initialSearch = "",
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const gridRef = useRef(null);
    const [isPending, startTransition] = useTransition();

    // Local input value — drives debounced URL updates
    const [searchInput, setSearchInput] = useState(initialSearch);

    // Sync local input to URL changes that come from elsewhere
    // (e.g., back button restoring a previous search)
    useEffect(() => {
        setSearchInput(initialSearch);
    }, [initialSearch]);

    // Debounce: push to URL DEBOUNCE_MS after user stops typing.
    // No push if the trimmed input equals what's already in the URL.
    useEffect(() => {
        const trimmed = searchInput.trim();
        if (trimmed === initialSearch) return;

        const t = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (trimmed) params.set("search", trimmed);
            else params.delete("search");
            params.delete("page");  // any new search resets to page 1

            startTransition(() => {
                router.push(`/forum${params.toString() ? `?${params}` : ""}`, { scroll: false });
            });
        }, DEBOUNCE_MS);

        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    function clearSearch() {
        setSearchInput("");
    }

    function goToPage(p) {
        if (p < 1 || p > totalPages || p === currentPage) return;
        gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        const params = new URLSearchParams(searchParams);
        params.set("page", String(p));
        startTransition(() => {
            router.push(`/forum?${params}`, { scroll: false });
        });
    }

    const isSearching = initialSearch.length > 0;
    const hasResults  = initialPosts.length > 0;

    return (
        <div ref={gridRef} className="scroll-mt-24">
            {/* Search + result count */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative w-full sm:max-w-md">
                    {isPending ? (
                        <Loader2
                            size={14}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E8C667] animate-spin pointer-events-none"
                        />
                    ) : (
                        <Search
                            size={14}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7c7468] pointer-events-none"
                        />
                    )}
                    <input
                        type="search"
                        placeholder="Search posts or authors…"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className={`w-full bg-[#0a0a0a] border border-[#C9962E]/20 text-white placeholder:text-[#5a5247] text-sm pl-10 pr-10 py-2.5 outline-none focus:border-[#E8C667]/60 transition-colors ${CHAMFER_SM}`}
                    />
                    {searchInput && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7c7468] hover:text-[#E8C667] cursor-pointer transition-colors"
                        >
                        </button>
                    )}
                </div>

                <span className="font-['Oswald'] text-xs tracking-[2px] uppercase text-[#7c7468]">
                    {isSearching ? (
                        <>
                            {total} {total === 1 ? "result" : "results"} for{" "}
                            <span className="text-[#E8C667]">"{initialSearch}"</span>
                        </>
                    ) : (
                        <>{total} {total === 1 ? "post" : "posts"} from the community</>
                    )}
                </span>
            </div>
            {isPending ? (
                <ContainedLoader label="Loading posts" className="min-h-[500px]" />
            ) : !hasResults ? (
                <EmptyState isSearching={isSearching} onClear={clearSearch} />
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    <AnimatePresence mode="popLayout">
                        {initialPosts.map((post, i) => (
                            <motion.article
                                key={post.id}
                                layout
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.94 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 18,
                                    delay: i * 0.04,
                                }}
                            >
                                <PostCard post={post} />
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Pagination */}
            {!isPending && hasResults && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onGoTo={goToPage}
                />
            )}
        </div>
    );
}

/* ---------- card ---------- */

function PostCard({ post }) {
    return (
        <div className={`group h-full flex flex-col bg-[#0a0a0a] border border-[#C9962E]/15 hover:border-[#C9962E]/40 transition-colors overflow-hidden ${CHAMFER_MD}`}>
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
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-['Bebas_Neue'] text-2xl text-white tracking-wide leading-tight line-clamp-2 group-hover:text-[#E8C667] transition-colors">
                    {post.title}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                    <Avatar user={post.author} size={20} />
                    <span className="text-[#cfc6b8] text-xs truncate">{post.author.name}</span>
                    <RoleBadge role={post.author.role} />
                </div>

                <p className="text-[#7c7468] text-sm mt-3 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {post.description}
                </p>

                <div className="mt-auto pt-4">
                    <Link
                        href={`/forum/${post.id}`}
                        className={`inline-flex items-center gap-2 px-4 py-2 font-['Oswald'] font-semibold text-[11px] tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.2)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_5px_16px_rgba(201,150,46,0.35)] transition-all ${CHAMFER_SM}`}
                    >
                        Read More
                        <ArrowRight size={12} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ---------- bits ---------- */

function Avatar({ user, size = 24 }) {
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
            style={{ width: size, height: size, fontSize: size * 0.42 }}
        >
            {initials}
        </span>
    );
}

function RoleBadge({ role }) {
    if (role !== "admin" && role !== "trainer") return null;
    const Icon = role === "admin" ? ShieldCheck : BadgeCheck;
    const label = role === "admin" ? "Admin" : "Trainer";
    const color = role === "admin" ? "text-[#E8C667]" : "text-[#C9962E]";
    return (
        <span className={`inline-flex items-center gap-0.5 text-[9px] font-['Oswald'] tracking-[2px] uppercase ${color}`}>
            <Icon size={9} />
            {label}
        </span>
    );
}

function Pagination({ currentPage, totalPages, onGoTo }) {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "…") {
            pages.push("…");
        }
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            <PageButton onClick={() => onGoTo(currentPage - 1)} disabled={currentPage <= 1} aria-label="Previous page">
                <ChevronLeft size={14} />
            </PageButton>

            {pages.map((p, i) =>
                p === "…" ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-[#7c7468]">…</span>
                ) : (
                    <PageButton
                        key={p}
                        active={p === currentPage}
                        onClick={() => onGoTo(p)}
                    >
                        {p}
                    </PageButton>
                ),
            )}

            <PageButton onClick={() => onGoTo(currentPage + 1)} disabled={currentPage >= totalPages} aria-label="Next page">
                <ChevronRight size={14} />
            </PageButton>
        </div>
    );
}

function PageButton({ children, active, disabled, onClick, ...rest }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center h-9 min-w-9 px-3 font-['Oswald'] text-sm font-semibold cursor-pointer transition-colors border ${CHAMFER_SM} ${
                active
                    ? "bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] border-transparent text-[#1a1304]"
                    : "bg-[#0a0a0a] border-[#C9962E]/25 text-[#cfc6b8] hover:border-[#E8C667]/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            }`}
            {...rest}
        >
            {children}
        </button>
    );
}

function EmptyState({ isSearching, onClear }) {
    if (isSearching) {
        return (
            <div className={`bg-[#0a0a0a] border border-[#C9962E]/15 py-20 px-8 text-center ${CHAMFER_MD}`}>
                <div className="inline-flex items-center justify-center h-16 w-16 mb-5 bg-[#C9962E]/5 border border-[#C9962E]/20 rounded-full">
                    <Search size={26} className="text-[#C9962E]/50" />
                </div>
                <p className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none mb-2">
                    No matching posts
                </p>
                <p className="text-[#7c7468] text-sm max-w-md mx-auto mb-6">
                    Try a different keyword or clear the search to see all community posts.
                </p>
                <button
                    type="button"
                    onClick={onClear}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 font-['Oswald'] font-semibold text-xs tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.2)] hover:-translate-y-0.5 transition-all ${CHAMFER_SM}`}
                >
                    <X size={12} />
                    Clear Search
                </button>
            </div>
        );
    }

    return (
        <div className={`bg-[#0a0a0a] border border-[#C9962E]/15 py-20 px-8 text-center ${CHAMFER_MD}`}>
            <div className="inline-flex items-center justify-center h-16 w-16 mb-5 bg-[#C9962E]/5 border border-[#C9962E]/20 rounded-full">
                <MessageSquare size={26} className="text-[#C9962E]/50" />
            </div>
            <p className="font-['Bebas_Neue'] text-3xl text-white tracking-wide leading-none mb-2">
                The forum is quiet
            </p>
            <p className="text-[#7c7468] text-sm max-w-md mx-auto">
                No community posts yet. Check back soon — trainers and admins
                share insights here regularly.
            </p>
        </div>
    );
}