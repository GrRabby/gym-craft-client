"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, ArrowRight, Loader2, AlertCircle } from "lucide-react";

const DAY_LABEL = {
    mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";
const CHAMFER_SM = "[clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]";

export default function SuccessView({ cls, amount, classId, error, pending }) {
    if (error) return <ErrorState message={error} classId={classId} />;
    if (pending) return <PendingState />;

    return (
        <div className="bg-[#070707] min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_-10%,rgba(201,150,46,0.15),transparent_60%)] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative max-w-2xl w-full"
            >
                {/* Checkmark */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.5, duration: 0.8 }}
                    className="mx-auto h-24 w-24 flex items-center justify-center bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] rounded-full mb-8 shadow-[0_0_60px_rgba(232,198,103,0.4),inset_0_2px_0_rgba(255,255,255,0.4)]"
                >
                    <CheckCircle2 size={48} className="text-[#1a1304]" strokeWidth={2.5} />
                </motion.div>

                {/* Headline */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-10 bg-[#E8C667]" />
                        <span className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[5px] uppercase">
                            Payment Successful
                        </span>
                        <div className="h-px w-10 bg-[#E8C667]" />
                    </div>
                    <h1 className="font-['Bebas_Neue'] text-5xl lg:text-7xl tracking-wide text-white leading-[0.9] mb-3">
                        Booking{" "}
                        <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent">
                            Confirmed
                        </span>
                    </h1>
                    <p className="text-[#cfc6b8] text-lg">
                        You&apos;re locked in. Time to show up and train.
                    </p>
                </div>

                {/* Booking summary */}
                {cls && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className={`bg-[#0a0a0a] border border-[#C9962E]/20 p-6 mb-8 ${CHAMFER_MD}`}
                    >
                        <div className="flex gap-4">
                            {cls.image && (
                                <div className={`w-24 h-24 flex-shrink-0 overflow-hidden ${CHAMFER_SM}`}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={cls.image} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h2 className="font-['Bebas_Neue'] text-2xl text-white tracking-wide truncate">
                                    {cls.title}
                                </h2>
                                {cls.trainer?.name && (
                                    <p className="text-[#cfc6b8] text-sm mt-1">
                                        with{" "}
                                        <span className="text-[#E8C667]">{cls.trainer.name}</span>
                                    </p>
                                )}
                                <p className="text-[#7c7468] text-xs mt-2 inline-flex items-center gap-1.5">
                                    <Calendar size={11} />
                                    {cls.scheduleDays.map((d) => DAY_LABEL[d]).join(" · ")} at{" "}
                                    {cls.scheduleTime}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 pt-5 border-t border-[#C9962E]/15 flex items-center justify-between">
                            <span className="font-['Oswald'] text-xs tracking-[3px] uppercase text-[#7c7468]">
                                Amount Paid
                            </span>
                            <span className="font-['Bebas_Neue'] text-3xl bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent leading-none">
                                ${amount?.toFixed(2)}{" "}
                                <span className="text-xs text-[#7c7468] font-sans font-normal">USD</span>
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    <Link
                        href="/dashboard/member"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 font-['Oswald'] font-semibold text-xs tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] cursor-pointer [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)] no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_14px_rgba(201,150,46,0.25)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_20px_rgba(201,150,46,0.35)] transition-all"
                    >
                        Go to Dashboard
                        <ArrowRight size={14} />
                    </Link>
                    <Link
                        href="/classes"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 font-['Oswald'] font-semibold text-xs tracking-[2px] uppercase text-[#cfc6b8] hover:text-white border border-[#C9962E]/25 hover:border-[#E8C667] cursor-pointer [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)] no-underline transition-colors"
                    >
                        Browse More Classes
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}

function PendingState() {
    return (
        <div className="bg-[#070707] min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <Loader2 size={48} className="mx-auto text-[#E8C667] animate-spin mb-6" />
                <h1 className="font-['Bebas_Neue'] text-4xl text-white tracking-wide mb-3">
                    Processing Payment
                </h1>
                <p className="text-[#cfc6b8] text-sm">
                    Your payment is being verified. This should only take a moment.
                </p>
            </div>
        </div>
    );
}

function ErrorState({ message, classId }) {
    return (
        <div className="bg-[#070707] min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center h-16 w-16 mb-6 bg-[#ff5a5a]/10 border border-[#ff5a5a]/30 rounded-full">
                    <AlertCircle size={32} className="text-[#ff5a5a]" />
                </div>
                <h1 className="font-['Bebas_Neue'] text-4xl text-white tracking-wide mb-3">
                    Verification Failed
                </h1>
                <p className="text-[#cfc6b8] text-sm mb-8">
                    {message || "We couldn't verify your payment. If you were charged, contact support."}
                </p>
                <Link
                    href={`/classes/${classId}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 font-['Oswald'] font-semibold text-xs tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] cursor-pointer [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)] no-underline"
                >
                    Back to class
                </Link>
            </div>
        </div>
    );
}