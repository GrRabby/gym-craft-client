import { redirect, notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/permissions";
import { getClassDetails } from "@/actions/classes";
import ClassDetailsView from "@/app/components/ClassDetailsView";

// Per-user data — never statically generate
export const dynamic = "force-dynamic";

export default async function ClassDetailsPage({ params }) {
    const { id } = await params;

    const user = await getCurrentUser();
    if (!user) {
        redirect(`/login?redirect=/classes/${id}`);
    }

    const { class: cls, isBooked, isFavorited, error } = await getClassDetails(id);

    if (error || !cls) {
        notFound();
    }

    return (
        <ClassDetailsView
            cls={cls}
            initialBooked={isBooked}
            initialFavorited={isFavorited}
        />
    );
}