import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/lib/permissions";
import { getClassDetails } from "@/actions/classes";
import { createCheckoutSessionAction } from "@/actions/checkout";
import CheckoutClient from "./CheckoutClient";

// Per-user data + fresh Stripe session every load — never cache
export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }) {
    const { id } = await params;

    // Gate the route
    const user = await getCurrentUser();
    if (!user) {
        redirect(`/login?redirect=/classes/${id}/checkout`);
    }

    // Fetch class + booking status — single round trip
    const { class: cls, isBooked, error } = await getClassDetails(id);

    if (error || !cls) notFound();

    // If they're already booked, send them back to the details page.
    // The Book Now button there will show "Already Booked" and they
    // can decide what to do.
    if (isBooked) {
        redirect(`/classes/${id}`);
    }

    // Create the Stripe session server-side so we never expose creation
    // details to the client (auth, validation, double-booking check all
    // happen in Express before Stripe is called).
    const session = await createCheckoutSessionAction(id);

    if (!session.ok || !session.clientSecret) {
        return <CheckoutError error={session.error} classId={id} />;
    }

    return <CheckoutClient cls={cls} clientSecret={session.clientSecret} />;
}

function CheckoutError({ error, classId }) {
    return (
        <div className="bg-[#070707] min-h-screen flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 mb-6 bg-[#ff5a5a]/10 border border-[#ff5a5a]/30 rounded-full">
                    <span className="text-[#ff5a5a] text-3xl">×</span>
                </div>
                <h1 className="font-['Bebas_Neue'] text-4xl text-white tracking-wide mb-3">
                    Checkout Unavailable
                </h1>
                <p className="text-[#cfc6b8] text-sm mb-8">
                    {error || "We couldn't start checkout right now. Please try again."}
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