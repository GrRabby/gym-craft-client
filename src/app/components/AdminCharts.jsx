"use client";

import {
    ResponsiveContainer,
    AreaChart, Area,
    PieChart, Pie, Cell,
    BarChart, Bar,
    XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { LineChart as LineIcon, PieChart as PieIcon, BarChart3 } from "lucide-react";

const CHAMFER_MD = "[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]";

// Gold-tier palette for chart segments. Starts with the brightest and walks
// down to deep amber — enough range for the donut even if all 6 user roles
// existed (currently only 3, so we use the first 3).
const GOLD_PALETTE = ["#E8C667", "#C9962E", "#F7E4A3", "#8B6F1F", "#5C4815", "#3D2F0E"];

const CATEGORY_LABELS = {
    strength: "Strength",
    cardio:   "Cardio",
    hiit:     "HIIT",
    yoga:     "Yoga",
    pilates:  "Pilates",
    mobility: "Mobility",
};

const ROLE_LABELS = {
    admin:   "Admin",
    trainer: "Trainer",
    member:  "Member",
};

/* ============================================================
   Top-level export
   ============================================================ */

export default function AdminCharts({
    bookingsTimeSeries = [],
    usersByRole = [],
    bookingsByCategory = [],
}) {
    return (
        <div className="space-y-5">
            {/* Wide area chart spans full width — momentum is the headline story */}
            <ChartCard
                Icon={LineIcon}
                title="Bookings Over 30 Days"
                subtitle="Daily paid bookings — track platform momentum"
            >
                <BookingsAreaChart data={bookingsTimeSeries} />
            </ChartCard>

            {/* Composition + popularity side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ChartCard
                    Icon={PieIcon}
                    title="Users by Role"
                    subtitle="Community composition"
                >
                    <UsersDonutChart data={usersByRole} />
                </ChartCard>
                <ChartCard
                    Icon={BarChart3}
                    title="Bookings by Category"
                    subtitle="Which class types members pay for"
                >
                    <CategoryBarChart data={bookingsByCategory} />
                </ChartCard>
            </div>
        </div>
    );
}

/* ============================================================
   Card chrome — all three charts sit inside this
   ============================================================ */

function ChartCard({ Icon, title, subtitle, children }) {
    return (
        <div className={`relative bg-[#0a0a0a] border border-[#C9962E]/15 overflow-hidden ${CHAMFER_MD}`}>
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#E8C667]/8 blur-3xl pointer-events-none" />

            <div className="relative p-5 lg:p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="inline-flex items-center justify-center h-9 w-9 bg-[#C9962E]/10 border border-[#C9962E]/30 text-[#E8C667] [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]">
                        <Icon size={16} />
                    </div>
                    <div>
                        <h3 className="font-['Bebas_Neue'] text-xl text-white tracking-wide leading-tight">
                            {title}
                        </h3>
                        <p className="text-[#7c7468] text-xs mt-0.5">{subtitle}</p>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}

/* ============================================================
   Custom tooltip — used by all three charts
   ============================================================ */

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="bg-[#0a0a0a] border border-[#C9962E]/40 px-3 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.6)] [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]">
            {label && (
                <p className="font-['Oswald'] text-[10px] tracking-[2px] uppercase text-[#7c7468] mb-1.5">
                    {label}
                </p>
            )}
            {payload.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                    <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ background: entry.color || "#E8C667" }}
                    />
                    <span className="text-[#cfc6b8]">{entry.name}:</span>
                    <span className="text-white font-semibold">{entry.value}</span>
                </div>
            ))}
        </div>
    );
}

/* ============================================================
   Chart 1 — Area chart, bookings over 30 days
   ============================================================ */

function BookingsAreaChart({ data }) {
    if (!data || data.length === 0) {
        return <EmptyChart message="No bookings in the last 30 days" />;
    }

    const chartData = data.map((d) => ({
        ...d,
        displayDate: new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day:   "numeric",
        }),
    }));

    return (
        <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <defs>
                    <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#E8C667" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="#E8C667" stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#C9962E"
                    strokeOpacity={0.1}
                    vertical={false}
                />
                <XAxis
                    dataKey="displayDate"
                    stroke="#7c7468"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#C9962E", strokeOpacity: 0.2 }}
                    interval="preserveStartEnd"
                    minTickGap={20}
                />
                <YAxis
                    stroke="#7c7468"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#C9962E", strokeOpacity: 0.2 }}
                    allowDecimals={false}
                />
                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: "#E8C667", strokeOpacity: 0.3, strokeWidth: 1 }}
                />
                <Area
                    type="monotone"
                    dataKey="bookings"
                    name="Bookings"
                    stroke="#E8C667"
                    strokeWidth={2}
                    fill="url(#goldArea)"
                    activeDot={{ r: 5, fill: "#F7E4A3", stroke: "#0a0a0a", strokeWidth: 2 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

/* ============================================================
   Chart 2 — Donut, users by role
   ============================================================ */

function UsersDonutChart({ data }) {
    if (!data || data.length === 0) {
        return <EmptyChart message="No users yet" />;
    }

    const chartData = data.map((d, i) => ({
        name:  ROLE_LABELS[d.role] || d.role,
        value: d.count,
        color: GOLD_PALETTE[i % GOLD_PALETTE.length],
    }));

    const total = chartData.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={62}
                            outerRadius={92}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center total */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="font-['Bebas_Neue'] text-4xl text-white leading-none">{total}</p>
                    <p className="font-['Oswald'] text-[9px] tracking-[2px] uppercase text-[#7c7468] mt-1">
                        Total users
                    </p>
                </div>
            </div>

            {/* Legend below */}
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {chartData.map((entry, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs">
                        <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: entry.color }}
                        />
                        <span className="text-[#cfc6b8]">{entry.name}</span>
                        <span className="text-[#7c7468]">({entry.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ============================================================
   Chart 3 — Horizontal bar, bookings by category
   ============================================================ */

function CategoryBarChart({ data }) {
    if (!data || data.length === 0) {
        return <EmptyChart message="No bookings yet" />;
    }

    const chartData = data.map((d) => ({
        category: CATEGORY_LABELS[d.category] || d.category,
        bookings: d.count,
    }));

    return (
        <ResponsiveContainer width="100%" height={260}>
            <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 4, right: 20, left: 4, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="goldBar" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%"   stopColor="#C9962E" />
                        <stop offset="100%" stopColor="#E8C667" />
                    </linearGradient>
                </defs>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#C9962E"
                    strokeOpacity={0.1}
                    horizontal={false}
                />
                <XAxis
                    type="number"
                    stroke="#7c7468"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#C9962E", strokeOpacity: 0.2 }}
                    allowDecimals={false}
                />
                <YAxis
                    dataKey="category"
                    type="category"
                    stroke="#cfc6b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#C9962E", strokeOpacity: 0.2 }}
                    width={70}
                />
                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#C9962E", fillOpacity: 0.06 }}
                />
                <Bar
                    dataKey="bookings"
                    name="Bookings"
                    fill="url(#goldBar)"
                    radius={[0, 4, 4, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

/* ============================================================
   Empty state — shared by all 3 charts
   ============================================================ */

function EmptyChart({ message }) {
    return (
        <div className="flex items-center justify-center h-[260px] border border-dashed border-[#C9962E]/15 [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]">
            <p className="text-[#5a5247] text-sm">{message}</p>
        </div>
    );
}