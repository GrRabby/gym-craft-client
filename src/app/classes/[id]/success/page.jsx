import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/permissions";
import { getCheckoutSessionStatus } from "@/actions/checkout";
import SuccessView from "@/app/components/SuccessView";

export const dynamic = "force-dynamic";

export default async function SuccessPage({ params, searchParams }) {
    const { id } = await params;
    const sp = await searchParams;
    const sessionId = sp?.session_id;

    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    // Without a session_id, this URL was hit directly — send them home
    if (!sessionId) {
        redirect(`/classes/${id}`);
    }

    // Verify the session with Stripe. Backend also writes the Booking
    // here if the webhook hasn't fired yet (idempotent — upsert keyed on
    // stripeSessionId).
    const result = await getCheckoutSessionStatus(sessionId);

    if (!result.ok) {
        return <SuccessView error={result.error} classId={id} />;
    }

    if (result.status !== "complete") {
        return <SuccessView pending classId={id} />;
    }

    return (
        <SuccessView
            cls={result.class}
            amount={result.amount}
            classId={id}
        />
    );
}