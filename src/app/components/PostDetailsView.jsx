import { ShieldCheck, BadgeCheck, Calendar } from "lucide-react";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";

export default function PostDetailsView({ post }) {
    if (!post) return null;

    return (
        <article>
            { }
            {post.image && (
                <div className={`relative aspect-[16/9] bg-[#0f0f0f] overflow-hidden mb-8 ${CHAMFER_MD}`}>
                    { }
                    <img
                        src={post.image}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            { }
            <h1 className="font-['Bebas_Neue'] text-4xl lg:text-6xl text-white tracking-wide leading-none">
                {post.title}
            </h1>

            { }
            <div className="flex items-center gap-3 mt-5 pb-6 border-b border-[#C9962E]/15">
                <Avatar user={post.author} size={36} />
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-semibold">{post.author.name}</p>
                        <RoleBadge role={post.author.role} />
                    </div>
                    <p className="text-[#7c7468] text-xs mt-0.5 inline-flex items-center gap-1.5">
                        <Calendar size={11} />
                        {formatDate(post.createdAt)}
                    </p>
                </div>
            </div>

            { }
            <div className="prose prose-invert max-w-none mt-8">
                <p className="text-[#cfc6b8] text-base lg:text-lg leading-relaxed whitespace-pre-line">
                    {post.description}
                </p>
            </div>
        </article>
    );
}

function Avatar({ user, size = 32 }) {
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
    if (role !== "admin" && role !== "trainer") return null;
    const Icon = role === "admin" ? ShieldCheck : BadgeCheck;
    const label = role === "admin" ? "Admin" : "Trainer";
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#C9962E]/10 border border-[#C9962E]/30 text-[#E8C667] font-['Oswald'] text-[9px] font-bold tracking-[2px] uppercase [clip-path:polygon(3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%,0_3px)]">
            <Icon size={9} />
            {label}
        </span>
    );
}

function formatDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}