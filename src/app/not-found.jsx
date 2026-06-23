import Link from "next/link";
import { Home, ArrowRight, Dumbbell } from "lucide-react";

export default function NotFound() {
    return (
        <section className="relative flex items-center justify-center min-h-[100vh] overflow-hidden bg-[#050505] px-6 py-24">
            <div className="absolute inset-0 bg-[radial-gradient(620px_320px_at_72%_-8%,rgba(201,150,46,0.18),transparent_62%),radial-gradient(520px_320px_at_18%_4%,rgba(201,150,46,0.10),transparent_60%),linear-gradient(180deg,#0a0a0a,#040404)] pointer-events-none" />

            <div className="absolute inset-0 opacity-[0.06] pointer-events-none [background-image:linear-gradient(rgba(247,228,163,1)_1px,transparent_1px),linear-gradient(90deg,rgba(247,228,163,1)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_50%_50%,black_0%,transparent_70%)]" />

            <div className="relative z-10 max-w-2xl text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-px w-8 bg-[#E8C667]" />
                    <span className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[5px] uppercase">
                        Missing Rep
                    </span>
                    <div className="h-px w-8 bg-[#E8C667]" />
                </div>
                <h1
                    aria-label="404 page not found"
                    className="font-['Bebas_Neue'] text-[160px] sm:text-[220px] lg:text-[260px] leading-[0.85] tracking-wider mb-2 bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent select-none"
                >
                    404
                </h1>

                <h2 className="font-['Bebas_Neue'] text-4xl sm:text-5xl tracking-wide leading-none text-white mb-5">
                    You Skipped <span className="text-[#E8C667]">A Set.</span>
                </h2>

                <p className="text-[#cfc6b8] text-base sm:text-lg leading-relaxed max-w-md mx-auto mb-10">
                    This page isn&apos;t on the rack. It may have been moved, renamed, or never
                    existed at all. Let&apos;s get you back to the floor.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-5">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 font-['Oswald'] font-semibold text-base tracking-[2px] uppercase text-[#1a1304] bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] no-underline py-3.5 px-7 [clip-path:polygon(11px_0,100%_0,100%_calc(100%-11px),calc(100%-11px)_100%,0_100%,0_11px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_6px_22px_rgba(201,150,46,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_10px_30px_rgba(201,150,46,0.5)]"
                    >
                        <Home size={16} />
                        Back to Home
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>

                    <Link
                        href="/classes"
                        className="inline-flex items-center gap-2 font-['Oswald'] font-medium text-sm tracking-[2px] uppercase text-[#cfc6b8] hover:text-white no-underline py-3 px-2 border-b border-[#C9962E]/30 hover:border-[#E8C667] transition-colors"
                    >
                        <Dumbbell size={14} />
                        Or Browse Classes
                    </Link>
                </div>
            </div>
        </section>
    );
}