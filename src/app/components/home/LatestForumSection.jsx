import Link from "next/link";
import {
    MessageSquare, ArrowRight, ShieldCheck, BadgeCheck, Calendar,
} from "lucide-react";

import { SectionHeader } from "@/app/components/home/FeaturedClassesSection";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";

export default function LatestForumSection({ posts = [] }) {
    return (
        <section className="relative py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeader
                    eyebrow="Community Voice"
                    title="Latest from the Forum"
                    accent="Forum"
                    subtitle="Fresh insights, stories, and announcements from trainers and admins."
                />

                {posts.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                {posts.length > 0 && (
                    <div className="text-center mt-12">
                        <Link
                            href="/forum"
                            className="inline-flex items-center gap-2 text-[#cfc6b8] hover:text-[#E8C667] text-sm font-['Oswald'] tracking-[3px] uppercase no-underline transition-colors"
                        >
                            Visit the full forum
                            <ArrowRight size={13} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}

function PostCard({ post }) {
    return (
        <article className={`group h-full flex flex-col bg-[#0a0a0a] border border-[#C9962E]/15 hover:border-[#C9962E]/40 transition-colors overflow-hidden ${CHAMFER_MD}`}>
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

                <p className="text-[#7c7468] text-xs mt-3 inline-flex items-center gap-1.5">
                    <Calendar size={11} />
                    {formatDate(post.createdAt)}
                </p>

                <p className="text-[#cfc6b8] text-sm mt-3 line-clamp-3 leading-relaxed whitespace-pre-line">
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
        </article>
    );
}

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

function EmptyState() {
    return (
        <div className={`mt-12 bg-[#0a0a0a] border border-[#C9962E]/15 py-16 px-8 text-center ${CHAMFER_MD}`}>
            <MessageSquare size={32} className="text-[#C9962E]/30 mx-auto mb-4" />
            <p className="text-[#7c7468] text-sm">The forum is quiet — be the first to share something.</p>
        </div>
    );
}

function formatDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}