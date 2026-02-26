import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatItem {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
}

interface DashboardStatsProps {
    stats: StatItem[];
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <Card key={i} className="flex flex-col justify-between">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            {stat.label}
                        </CardTitle>
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <stat.icon className="w-4 h-4 text-slate-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        {stat.trend && (
                            <p className="mt-2 text-xs font-medium text-slate-500">
                                {stat.trend}
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
