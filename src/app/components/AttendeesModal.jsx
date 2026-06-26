"use client";

import { useState, useEffect } from "react";
import { X, Users, Mail } from "lucide-react";
import { getClassAttendeesAction } from "@/actions/trainer/classes";
import { DumbbellSpinner } from "./DumbbellSpinner";

export default function AttendeesModal({ classId, className, isOpen, onClose }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen || !classId) return;

        let active = true;
        setLoading(true);
        setError("");

        async function fetchAttendees() {
            const res = await getClassAttendeesAction(classId);
            if (!active) return;
            if (res.ok) {
                setStudents(res.students || []);
            } else {
                setError(res.error || "Failed to load attendees.");
            }
            setLoading(false);
        }

        fetchAttendees();

        return () => {
            active = false;
        };
    }, [isOpen, classId]);

    // Handle ESC key press to close modal
    useEffect(() => {
        if (!isOpen) return;
        const onEsc = (e) => e.key === "Escape" && !loading && onClose();
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [isOpen, loading, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                aria-hidden="true"
            />

            {/* Modal Card */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="attendees-modal-title"
                className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto bg-[#0a0a0a] border border-[#C9962E]/30 shadow-[0_30px_80px_rgba(0,0,0,0.7),0_0_60px_rgba(201,150,46,0.08)] [clip-path:polygon(14px_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%,0_14px)] flex flex-col"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 p-5 border-b border-[#C9962E]/15">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-px w-5 bg-[#E8C667]" />
                            <span className="font-['Oswald'] text-[#E8C667] text-[10px] font-semibold tracking-[3px] uppercase">
                                Bookings List
                            </span>
                        </div>
                        <h2 id="attendees-modal-title" className="font-['Bebas_Neue'] text-2xl tracking-wide text-white leading-none truncate">
                            Attendees for <span className="text-[#E8C667]">{className}</span>
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="text-[#7c7468] hover:text-white p-1 cursor-pointer transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 p-5 overflow-y-auto min-h-[200px] flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-10 text-[#7c7468]">
                            <DumbbellSpinner size={30} label="Loading students..." />
                            {/* <p className="font-['Oswald'] text-xs tracking-[2px] uppercase">Loading students...</p> */}
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-10 text-[#ff8585] text-center">
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-[#7c7468]">
                            <Users size={28} className="text-[#C9962E]/30 mb-2" />
                            <p className="font-['Oswald'] text-xs tracking-[2px] uppercase">No students have booked yet</p>
                            <p className="text-[11px] text-[#5a5247] mt-1">Bookings will appear here as members purchase seats.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="text-[11px] font-['Oswald'] text-[#7c7468] uppercase tracking-[2px] pb-1 border-b border-[#C9962E]/10">
                                Total: {students.length} Student{students.length !== 1 ? "s" : ""}
                            </div>
                            <div className="divide-y divide-[#C9962E]/10">
                                {students.map((student, idx) => (
                                    <div key={student.id || idx} className="py-3 flex items-center justify-start gap-4">
                                        <span className="shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#E8C667]/10 text-[#E8C667] font-['Oswald'] font-bold text-xs">
                                            {idx + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-semibold truncate">{student.name}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-[#7c7468] mt-0.5 min-w-0">
                                                <Mail size={10} className="shrink-0" />
                                                <span className="truncate">{student.email}</span>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 pt-3 border-t border-[#C9962E]/10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="font-['Oswald'] text-xs tracking-[2px] uppercase text-[#cfc6b8] hover:text-white px-4 py-2 bg-white/5 border border-[#C9962E]/20 hover:border-[#E8C667] cursor-pointer transition-colors [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
