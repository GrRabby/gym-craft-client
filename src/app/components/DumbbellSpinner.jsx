import { Dumbbell } from "lucide-react";


export function DumbbellSpinner({ size = 16, className = "" }) {
    return (
        <Dumbbell
            size={size}
            className={`animate-spin text-[#E8C667] ${className}`}
            aria-hidden="true"
        />
    );
}
function SpinnerCluster({ scale = 1 }) {
    const px = 128 * scale;    
    const dumbbellSize = 42 * scale;
    return (
        <div className="relative" style={{ width: px, height: px }}>
            <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full animate-spin"
                style={{ animationDuration: "3s" }}
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="gcLoaderArc" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#F7E4A3" />
                        <stop offset="0.5" stopColor="#E8C667" />
                        <stop offset="1" stopColor="#C9962E" />
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(201,150,46,0.10)" strokeWidth="2" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="url(#gcLoaderArc)" strokeWidth="2" strokeDasharray="70 220" strokeLinecap="round" />
            </svg>
 
            <div
                className="absolute inset-0 flex items-center justify-center animate-spin"
                style={{ animationDuration: "1.8s", animationDirection: "reverse" }}
            >
                <Dumbbell
                    size={dumbbellSize}
                    strokeWidth={1.8}
                    className="text-[#E8C667] drop-shadow-[0_0_12px_rgba(232,198,103,0.5)]"
                />
            </div>
        </div>
    );
}
export function ContainedLoader({ label = "Loading", className = "" }) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={`flex-1 flex flex-col items-center justify-center font-sans ${className}`}
        >
            <SpinnerCluster scale={0.75} />
            <p className="font-['Oswald'] text-[10px] tracking-[5px] uppercase text-[#7c7468] mt-6 animate-pulse">
                {label}
            </p>
            <span className="sr-only">{label}</span>
        </div>
    );
}
export function FullPageLoader({ label = "Loading" }) {
    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] font-sans"
        >
            <div className="absolute inset-0 bg-[radial-gradient(closest-side_at_50%_50%,rgba(201,150,46,0.18),transparent_60%)] pointer-events-none" />

            <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none [background-image:linear-gradient(rgba(247,228,163,1)_1px,transparent_1px),linear-gradient(90deg,rgba(247,228,163,1)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_50%_50%,black_0%,transparent_70%)]"
            />

            <div className="relative z-10 flex flex-col items-center">
                <div className="relative h-32 w-32">
                    <svg
                        viewBox="0 0 100 100"
                        className="absolute inset-0 h-full w-full animate-spin"
                        style={{ animationDuration: "3s" }}
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient id="loaderArcGold" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stopColor="#F7E4A3" />
                                <stop offset="0.5" stopColor="#E8C667" />
                                <stop offset="1" stopColor="#C9962E" />
                            </linearGradient>
                        </defs>
                        <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="url(#loaderArcGold)"
                            strokeWidth="2"
                            strokeDasharray="70 220"
                            strokeLinecap="round"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="rgba(201,150,46,0.10)"
                            strokeWidth="2"
                        />
                    </svg>

                    <div
                        className="absolute inset-0 flex items-center justify-center animate-spin"
                        style={{
                            animationDuration: "1.8s",
                            animationDirection: "reverse",
                        }}
                    >
                        <Dumbbell
                            size={42}
                            strokeWidth={1.8}
                            className="text-[#E8C667] drop-shadow-[0_0_12px_rgba(232,198,103,0.5)]"
                        />
                    </div>
                </div>

                <div className="font-['Oswald'] font-bold text-xl tracking-[3px] uppercase mt-10 leading-none">
                    <span className="bg-linear-to-br from-[#F7E4A3] via-[#E8C667] to-[#C9962E] bg-clip-text text-transparent mr-1">
                        GYM
                    </span>
                    <span className="text-white">CRAFT</span>
                </div>

                <p className="font-['Oswald'] text-[10px] tracking-[5px] uppercase text-[#7c7468] mt-3 animate-pulse">
                    {label}
                </p>
            </div>

            <span className="sr-only">Loading content</span>
        </div>
    );
}

export default FullPageLoader;