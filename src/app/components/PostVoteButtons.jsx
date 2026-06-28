"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ThumbsUp, ThumbsDown } from "lucide-react";

import { votePostAction } from "@/actions/post-votes";

const CHAMFER_SM = "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";

export default function PostVoteButtons({
    postId,
    initialLikes = 0,
    initialDislikes = 0,
    initialUserVote = null,
}) {
    const [likes, setLikes]       = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [userVote, setUserVote] = useState(initialUserVote);
    const [, startTransition] = useTransition();

    
    
    function predictNext(type) {
        let nextLikes = likes;
        let nextDislikes = dislikes;
        let nextVote = userVote;

        if (userVote === null) {
            if (type === "like")    { nextLikes++; nextVote = "like"; }
            else                    { nextDislikes++; nextVote = "dislike"; }
        } else if (userVote === type) {
            
            if (type === "like")    { nextLikes--; }
            else                    { nextDislikes--; }
            nextVote = null;
        } else {
            
            if (type === "like")    { nextLikes++; nextDislikes--; }
            else                    { nextDislikes++; nextLikes--; }
            nextVote = type;
        }

        return { likes: nextLikes, dislikes: nextDislikes, userVote: nextVote };
    }

    function handleVote(type) {
        const before = { likes, dislikes, userVote };
        const predicted = predictNext(type);
        setLikes(predicted.likes);
        setDislikes(predicted.dislikes);
        setUserVote(predicted.userVote);

        startTransition(async () => {
            const result = await votePostAction(postId, type);

            if (!result.ok) {
                
                setLikes(before.likes);
                setDislikes(before.dislikes);
                setUserVote(before.userVote);
                toast.error(result.error || "Vote failed");
                return;
            }

            
            setLikes(result.likes);
            setDislikes(result.dislikes);
            setUserVote(result.userVote);
        });
    }

    return (
        <div className="flex items-center gap-3 mt-8">
            <VoteButton
                Icon={ThumbsUp}
                count={likes}
                active={userVote === "like"}
                onClick={() => handleVote("like")}
                ariaLabel="Like this post"
            />
            <VoteButton
                Icon={ThumbsDown}
                count={dislikes}
                active={userVote === "dislike"}
                onClick={() => handleVote("dislike")}
                ariaLabel="Dislike this post"
            />
        </div>
    );
}

function VoteButton({ Icon, count, active, onClick, ariaLabel }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            aria-pressed={active}
            className={`inline-flex items-center gap-2 px-4 py-2.5 font-['Oswald'] text-sm font-semibold tracking-wider cursor-pointer transition-all border ${CHAMFER_SM} ${
                active
                    ? "bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] border-transparent text-[#1a1304] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.3)]"
                    : "bg-[#0a0a0a] border-[#C9962E]/25 text-[#cfc6b8] hover:border-[#E8C667]/60 hover:text-white"
            }`}
        >
            <Icon size={16} className={active ? "fill-current" : ""} />
            <span className="tabular-nums">{count}</span>
        </button>
    );
}