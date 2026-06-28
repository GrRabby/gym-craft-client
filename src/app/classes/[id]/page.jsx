import { redirect, notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/permissions";
import { getClassDetails } from "@/actions/classes";
import ClassDetailsView from "@/app/components/ClassDetailsView";

export const dynamic = "force-dynamic";


const ALLOWED_FROM = new Set(["bookings", "favorites"]);

export default async function ClassDetailsPage({ params, searchParams }) {
    const { id } = await params;
    const sp = await searchParams;

    const user = await getCurrentUser();
    if (!user) {
        
        
        const fromQs = sp?.from ? `&from=${encodeURIComponent(sp.from)}` : "";
        redirect(`/login?redirect=/classes/${id}${fromQs}`);
    }

    const { class: cls, isBooked, isFavorited, error } = await getClassDetails(id);

    if (error || !cls) notFound();

    const from = ALLOWED_FROM.has(sp?.from) ? sp.from : null;

    return (
        <ClassDetailsView
            cls={cls}
            initialBooked={isBooked}
            initialFavorited={isFavorited}
            from={from}
        />
    );
}