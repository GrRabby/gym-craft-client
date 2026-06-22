import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaXTwitter, FaInstagram, FaYoutube } from "react-icons/fa6";
/**
 * GymCraft — Footer
 * Place at: components/GymCraftFooter.jsx
 *
 * Renders at the bottom of every layout. Pairs visually with the navbar
 * (same gold hairline at the seam) and the login/register pages (faint
 * diamond-plate texture).
 */

const QUICK_LINKS = [
    { label: "Home", href: "/" },
    { label: "All Classes", href: "/classes" },
    { label: "Community Forum", href: "/forum" },
    { label: "Trainers", href: "/trainers" },
    { label: "Pricing", href: "/pricing" },
];

const RESOURCES = [
    { label: "About Us", href: "/about" },
    { label: "Help Center", href: "/help" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Become a Trainer", href: "/careers/trainer" },
];

const SOCIAL = [
    { label: "Facebook",  href: "https://facebook.com/gymcraft",  Icon: FaFacebookF },
    { label: "X",         href: "https://x.com/gymcraft",          Icon: XLogo },
    { label: "Instagram", href: "https://instagram.com/gymcraft", Icon: FaInstagram },
    { label: "YouTube",   href: "https://youtube.com/@gymcraft",  Icon: FaYoutube },
];

export default function FooterSection() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative bg-[#070707] font-sans text-[#cfc6b8] overflow-hidden">
            {/* Gold hairline at the top — mirrors the navbar's bottom edge */}
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#C9962E]/55 to-transparent" />

            {/* Subtle diamond-plate texture, very faint */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(247,228,163,0.4) 0 1px, transparent 1px 18px), repeating-linear-gradient(-45deg, rgba(247,228,163,0.4) 0 1px, transparent 1px 18px)",
                }}
            />
            {/* Ambient gold glow behind the brand */}
            <div className="absolute -left-20 -bottom-32 w-[480px] h-[300px] bg-[radial-gradient(closest-side,rgba(201,150,46,0.18),transparent)] pointer-events-none" />

            <div className="relative z-10 max-w-310 mx-auto px-6 pt-16 pb-8">
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap');`}</style>

                {/* Main grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

                    {/* Brand block */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-flex items-center gap-3 no-underline" aria-label="GymCraft home">
                            <LogoMark />
                            <div className="font-['Oswald'] font-bold text-2xl tracking-wider uppercase leading-none">
                                <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent mr-1">GYM</span>
                                <span className="text-white">CRAFT</span>
                            </div>
                        </Link>
                        <p className="text-[#8c8478] text-sm leading-relaxed mt-4 max-w-sm">
                            A fitness and gym management platform built for those who treat
                            training like a craft. Book classes, follow trainers, and track every rep.
                        </p>

                        {/* Social */}
                        <div className="mt-6">
                            <span className="font-['Oswald'] text-[#cfc6b8] text-xs font-semibold tracking-[3px] uppercase block mb-3">
                                Follow Along
                            </span>
                            <div className="flex items-center gap-2.5">
                                {SOCIAL.map(({ label, href, Icon }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="group relative inline-flex items-center justify-center h-10 w-10 border border-[#C9962E]/30 hover:border-transparent transition-colors overflow-hidden [clip-path:polygon(7px_0,100%_0,100%_calc(100%-7px),calc(100%-7px)_100%,0_100%,0_7px)]"
                                    >
                                        <span className="absolute inset-0 bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
                                        <Icon size={16} className="relative z-10 text-[#cfc6b8] group-hover:text-[#1a1304] transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <FooterColumn title="Quick Links" links={QUICK_LINKS} className="lg:col-span-2 lg:col-start-6" />

                    {/* Resources */}
                    <FooterColumn title="Resources" links={RESOURCES} className="lg:col-span-2" />

                    {/* Contact */}
                    <div className="lg:col-span-3">
                        <h3 className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[3px] uppercase mb-4">
                            Get In Touch
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <ContactRow icon={MapPin}>
                                Block A, Subhanighat<br />
                                Sylhet 3100, Bangladesh
                            </ContactRow>
                            <ContactRow icon={Mail}>
                                <a href="mailto:hello@gymcraft.app" className="hover:text-[#E8C667] transition-colors">
                                    hello@gymcraft.app
                                </a>
                            </ContactRow>
                            <ContactRow icon={Phone}>
                                <a href="tel:+8801700000000" className="hover:text-[#E8C667] transition-colors">
                                    +880 1700 000 000
                                </a>
                            </ContactRow>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="mt-14 border-t border-[#C9962E]/15" />

                {/* Bottom strip */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-[#7c7468] text-xs">
                    <p>
                        © {year} GymCraft. All rights reserved. Forged in Sylhet.
                    </p>
                    <p className="font-['Oswald'] tracking-[3px] uppercase text-[10px]">
                        Craft Your Strength
                    </p>
                </div>
            </div>
        </footer>
    );
}

/* ---------- pieces ---------- */

function FooterColumn({ title, links, className = "" }) {
    return (
        <div className={className}>
            <h3 className="font-['Oswald'] text-[#E8C667] text-xs font-semibold tracking-[3px] uppercase mb-4">
                {title}
            </h3>
            <ul className="space-y-2.5">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="group inline-flex items-center text-sm text-[#cfc6b8] hover:text-white transition-colors no-underline"
                        >
                            <span className="h-px w-0 bg-[#E8C667] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300" />
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ContactRow({ icon: Icon, children }) {
    return (
        <li className="flex items-start gap-3 text-[#cfc6b8]">
            <Icon size={15} className="text-[#E8C667] shrink-0 mt-0.5" />
            <span className="leading-relaxed">{children}</span>
        </li>
    );
}

function LogoMark() {
    return (
        <svg viewBox="0 0 48 48" className="h-11 w-11 shrink-0" aria-hidden="true">
            <defs>
                <linearGradient id="gcFooterGold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#F7E4A3" />
                    <stop offset="0.45" stopColor="#E8C667" />
                    <stop offset="1" stopColor="#C9962E" />
                </linearGradient>
            </defs>
            <path d="M40 13.5A18 18 0 1 0 40 34.5" fill="none" stroke="url(#gcFooterGold)" strokeWidth="4.4" strokeLinecap="round" />
            <g fill="#FFFFFF">
                <rect x="15" y="22.4" width="18" height="3.2" rx="1.6" />
                <rect x="11.5" y="19" width="3" height="10" rx="1.2" />
                <rect x="33.5" y="19" width="3" height="10" rx="1.2" />
                <rect x="8.5" y="21" width="2.4" height="6" rx="1" fill="url(#gcFooterGold)" />
                <rect x="37.1" y="21" width="2.4" height="6" rx="1" fill="url(#gcFooterGold)" />
            </g>
        </svg>
    );
}

/** Official X (formerly Twitter) brand mark — not the old bird. */
function XLogo({ size = 16 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 1200 1227"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.151 327.181 476.151H1200L714.137 519.284h.026Zm-145.025 168.544-47.468-67.894L144.011 79.694h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.138 687.854v-.026Z" />
        </svg>
    );
}