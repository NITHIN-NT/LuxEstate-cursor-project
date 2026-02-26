import { db } from "@/db";
import { properties, enquiries } from "@/db/schema";
import { count } from "drizzle-orm";
import { Building2, MessageSquare, TrendingUp, Users } from "lucide-react";
import DashboardCharts from "@/components/admin/DashboardCharts";
import DashboardStats from "@/components/admin/DashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
    // Real data fetching
    const [propertiesCount] = await db.select({ value: count() }).from(properties);
    const [enquiriesCount] = await db.select({ value: count() }).from(enquiries);

    const stats = [
        { label: "Total Properties", value: Number(propertiesCount.value), icon: Building2, trend: "+2 this week" },
        { label: "Active Enquiries", value: Number(enquiriesCount.value), icon: MessageSquare, trend: "+4 this week" },
        { label: "Growth Rate", value: "+12.5%", icon: TrendingUp, trend: "Compared to last month" },
        { label: "Total Viewers", value: "2.4k", icon: Users, trend: "Unique visitors" },
    ];

    return (
        <div className="space-y-6 pb-10">
            <header>
                <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
                <p className="text-sm text-slate-500 mt-1">Metrics and analytics for your portfolio.</p>
            </header>

            <DashboardStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Market Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full pt-0">
                        <DashboardCharts />
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Enquiries</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center text-center pb-8">
                        <MessageSquare className="w-10 h-10 text-slate-200 mb-3" />
                        <p className="font-medium text-slate-900">No activity yet</p>
                        <p className="text-sm text-slate-500 mt-1">New enquiries will appear here.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
