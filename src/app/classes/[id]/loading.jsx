"use client";

import { useEffect } from "react";
import { ContainedLoader } from "@/app/components/DumbbellSpinner";

export default function Loading() {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant",
        });
    }, []);

    return <ContainedLoader label="Loading details" className="py-20" />;
}