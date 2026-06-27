"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Upload, X, Image as ImageIcon, MessageSquarePlus,
    Loader2, FileText, Type,
} from "lucide-react";

import { createForumPostAction } from "@/actions/forum-posts";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";

const TITLE_MAX = 200;
const DESC_MAX = 5000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export default function AddForumPostForm({redirectOnSuccess = "/dashboard/trainer/forum",}) {
    const router = useRouter();
    const fileInputRef = useRef(null);

    const [isPending, setIsPending] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    function handleFilePick(file) {
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error("Image must be PNG, JPG, or WebP");
            return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
            toast.error("Image must be 5MB or smaller");
            return;
        }

        // Revoke the previous preview URL to avoid memory leak
        if (imagePreview) URL.revokeObjectURL(imagePreview);

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    function handleImageChange(e) {
        handleFilePick(e.target.files?.[0]);
    }

    function clearImage() {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (isPending) return;

        const trimmedTitle = title.trim();
        const trimmedDesc = description.trim();

        if (!trimmedTitle) {
            toast.error("Title is required");
            return;
        }
        if (!trimmedDesc) {
            toast.error("Description is required");
            return;
        }
        if (!imageFile) {
            toast.error("Please add an image");
            return;
        }

        setIsPending(true);

        const formData = new FormData();
        formData.append("title", trimmedTitle);
        formData.append("description", trimmedDesc);
        formData.append("imageFile", imageFile);

        const result = await createForumPostAction(formData);

        if (!result.ok) {
            if (result.blocked) {
                toast.error("Action restricted by Admin");
            } else {
                toast.error(result.error || "Failed to publish post");
            }
            setIsPending(false);
            return;
        }

        toast.success("Post published to the community forum");
        router.push(redirectOnSuccess);
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Form sits in a panel mirroring AddClassForm's chrome */}
            <div
                className={`relative bg-[#0a0a0a] border border-[#C9962E]/15 p-6 lg:p-8 ${CHAMFER_MD} overflow-hidden max-w-3xl`}
            >
                {/* Ambient gold corner glow */}
                <div className="absolute top-0 right-0 h-40 w-40 bg-[radial-gradient(circle_at_top_right,rgba(232,198,103,0.10),transparent_60%)] pointer-events-none" />

                <div className="relative space-y-8">
                    {/* Image */}
                    <Section
                        Icon={ImageIcon}
                        title="Cover Image"
                        hint="PNG, JPG, or WebP · max 5MB"
                    >
                        {imagePreview ? (
                            <div
                                className={`relative aspect-[16/9] overflow-hidden bg-[#0f0f0f] border border-[#C9962E]/20 ${CHAMFER_SM}`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imagePreview}
                                    alt="Selected"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <label
                                        htmlFor="image-replace"
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-sm border border-[#C9962E]/40 text-[#E8C667] font-['Oswald'] text-[10px] font-semibold tracking-[2px] uppercase cursor-pointer hover:border-[#E8C667] transition-colors ${CHAMFER_SM}`}
                                    >
                                        <Upload size={11} />
                                        Change
                                    </label>
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        aria-label="Remove image"
                                        className={`inline-flex items-center justify-center h-7 w-7 bg-black/70 backdrop-blur-sm border border-[#ff5a5a]/40 text-[#ff8585] hover:border-[#ff5a5a] hover:text-[#ff5a5a] cursor-pointer transition-colors ${CHAMFER_SM}`}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                                <input
                                    id="image-replace"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <label
                                htmlFor="image"
                                className={`flex flex-col items-center justify-center aspect-[16/9] bg-black/40 border-2 border-dashed border-[#C9962E]/25 hover:border-[#E8C667]/60 hover:bg-black/50 cursor-pointer transition-all ${CHAMFER_SM}`}
                            >
                                <Upload size={28} className="text-[#C9962E]/60 mb-3" />
                                <p className="font-['Oswald'] text-xs tracking-[3px] uppercase text-[#cfc6b8] mb-1">
                                    Click to upload
                                </p>
                                <p className="text-[#7c7468] text-xs">
                                    Drag-and-drop coming soon
                                </p>
                                <input
                                    id="image"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </Section>

                    {/* Title */}
                    <Section
                        Icon={Type}
                        title="Title"
                        hint={`${title.length}/${TITLE_MAX}`}
                    >
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={TITLE_MAX}
                            placeholder="What's your post about?"
                            className={`w-full bg-[#050505]/80 border border-[#C9962E]/20 text-white placeholder:text-[#5a5247] text-base px-4 py-3 outline-none focus:border-[#E8C667]/60 transition-colors ${CHAMFER_SM}`}
                        />
                    </Section>

                    {/* Description */}
                    <Section
                        Icon={FileText}
                        title="Description"
                        hint={`${description.length}/${DESC_MAX}`}
                    >
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={DESC_MAX}
                            rows={8}
                            placeholder="Share insights, training tips, technique breakdowns, or stories…"
                            className={`w-full bg-[#050505]/80 border border-[#C9962E]/20 text-white placeholder:text-[#5a5247] text-sm px-4 py-3 outline-none focus:border-[#E8C667]/60 transition-colors resize-y ${CHAMFER_SM}`}
                        />
                    </Section>

                    {/* Submit row */}
                    <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
                        <p className="text-[#7c7468] text-xs">
                            Posts publish immediately to the community forum.
                        </p>
                        <button
                            type="submit"
                            disabled={isPending}
                            className={`inline-flex items-center gap-2 px-6 py-3 font-['Oswald'] font-semibold text-xs tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_10px_rgba(201,150,46,0.25)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_5px_16px_rgba(201,150,46,0.35)] transition-all disabled:opacity-60 disabled:cursor-wait disabled:hover:translate-y-0 ${CHAMFER_SM}`}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Publishing…
                                </>
                            ) : (
                                <>
                                    <MessageSquarePlus size={14} />
                                    Publish Post
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

/* ---------- section header helper ---------- */

function Section({ Icon, title, hint, children }) {
    return (
        <div>
            <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-[#C9962E]/15">
                <div className="inline-flex items-center gap-2">
                    <Icon size={13} className="text-[#E8C667]" />
                    <h3 className="font-['Oswald'] text-[11px] font-semibold tracking-[3px] uppercase text-[#cfc6b8]">
                        {title}
                    </h3>
                </div>
                {hint && (
                    <span className="font-['Oswald'] text-[10px] tracking-[1px] uppercase text-[#7c7468]">
                        {hint}
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}