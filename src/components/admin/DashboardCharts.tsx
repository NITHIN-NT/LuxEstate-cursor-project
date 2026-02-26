"use client";

import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

const data = [
    { name: "Mon", properties: 4, label: "Monday" },
    { name: "Tue", properties: 7, label: "Tuesday" },
    { name: "Wed", properties: 5, label: "Wednesday" },
    { name: "Thu", properties: 12, label: "Thursday" },
    { name: "Fri", properties: 15, label: "Friday" },
    { name: "Sat", properties: 10, label: "Saturday" },
    { name: "Sun", properties: 8, label: "Sunday" },
];

export default function DashboardCharts() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorProperties" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={10}
                />

                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                />

                <Tooltip
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-md">
                                    <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                                        {payload[0].payload.label}
                                    </p>
                                    <p className="text-lg font-bold text-slate-900">
                                        {payload[0].value} <span className="text-sm font-medium text-slate-500">views</span>
                                    </p>
                                </div>
                            );
                        }
                        return null;
                    }}
                />

                <Area
                    type="monotone"
                    dataKey="properties"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProperties)"
                    activeDot={{ r: 4, fill: "#3b82f6", stroke: "#ffffff", strokeWidth: 2 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
