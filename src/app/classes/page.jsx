import { getPublicClasses } from "@/actions/classes";
import ClassesGrid from "../components/ClassesGrid";


export const dynamic = "force-dynamic"; // searchParams aren't statically determinable

export default async function ClassesPage({ searchParams }) {
    const sp       = await searchParams;
    const page     = Math.max(1, Number(sp?.page) || 1);
    const search   = String(sp?.search   || "");
    const category = String(sp?.category || "");

    const { classes, totalPages, total, error } = await getPublicClasses({
        page, search, category,
    });

    // Split the comma-separated category param into an array for the client
    const currentCategories = category
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

    return (
        <>
            {/* Hero */}
            <section className="relative bg-[#050505] py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(620px_320px_at_50%_-8%,rgba(201,150,46,0.18),transparent_62%),linear-gradient(180deg,#0a0a0a,#040404)] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none [background-image:linear-gradient(rgba(247,228,163,1)_1px,transparent_1px),linear-gradient(90deg,rgba(247,228,163,1)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_50%_50%,black_0%,transparent_70%)]" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
                    <div className="flex items-center justify-center gap-3 mb-5">
                        <div className="h-px w-10 bg-[#E8C667]" />
                        <span className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[5px] uppercase">
                            All Classes
                        </span>
                        <div className="h-px w-10 bg-[#E8C667]" />
                    </div>
                    <h1 className="font-['Bebas_Neue'] text-5xl sm:text-6xl lg:text-7xl tracking-wide leading-[0.9]">
                        <span className="text-white">Find your </span>
                        <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent">
                            training.
                        </span>
                    </h1>
                    <p className="text-[#cfc6b8] max-w-2xl mx-auto text-base sm:text-lg mt-6 leading-relaxed">
                        Coach-led classes built for serious effort. Browse the schedule,
                        pick what fits, lock it in.
                    </p>
                </div>
            </section>

            <section className="bg-[#070707] py-4 lg:py-4 min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {error ? (
                        <div className="max-w-xl mx-auto p-8 border border-[#ff5a5a]/30 bg-[#ff5a5a]/5 text-[#ff8585]">
                            <p className="font-['Oswald'] text-xs tracking-[3px] uppercase mb-2">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    ) : (
                        <ClassesGrid
                            initialClasses={classes}
                            currentPage={page}
                            totalPages={totalPages}
                            total={total}
                            currentSearch={search}
                            currentCategories={currentCategories}
                        />
                    )}
                </div>
            </section>
        </>
    );
}