import { db } from "@/db";
import { properties, enquiries, admins } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { Building2, MessageSquare, Users, CalendarDays } from "lucide-react";
import DashboardCharts from "@/components/admin/DashboardCharts";
import DashboardStats from "@/components/admin/DashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
    // Real data fetching
    const [propertiesCount] = await db.select({ value: count() }).from(properties);
    const [enquiriesCount] = await db.select({ value: count() }).from(enquiries);
    const [pendingCount] = await db.select({ value: count() }).from(enquiries).where(eq(enquiries.status, "pending"));
    const [staffCount] = await db.select({ value: count() }).from(admins);

    // Real recent enquiries
    const recentEnquiries = await db.query.enquiries.findMany({
        orderBy: [desc(enquiries.createdAt)],
        limit: 5,
    });

    // Real chart data: enquiries per day (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
    });

    const allEnquiries = await db.query.enquiries.findMany({
        orderBy: [desc(enquiries.createdAt)],
    });

    const chartData = last7Days.map((date) => {
        const dayStr = date.toLocaleDateString("en-US", { weekday: "short" });
        const dayLabel = date.toLocaleDateString("en-US", { weekday: "long" });
        const dayCount = allEnquiries.filter((e) => {
            const eDate = new Date(e.createdAt);
            return eDate.toDateString() === date.toDateString();
        }).length;
        return { name: dayStr, enquiries: dayCount, label: dayLabel };
    });

    const stats = [
        { label: "Total Properties", value: Number(propertiesCount.value), icon: Building2, trend: `${Number(propertiesCount.value)} listed` },
        { label: "Total Enquiries", value: Number(enquiriesCount.value), icon: MessageSquare, trend: `${Number(pendingCount.value)} pending` },
        { label: "Pending Review", value: Number(pendingCount.value), icon: CalendarDays, trend: "Awaiting response" },
        { label: "Team Members", value: Number(staffCount.value), icon: Users, trend: "Active accounts" },
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
                        <CardTitle className="text-lg">Enquiry Activity (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full pt-0">
                        <DashboardCharts data={chartData} />
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Enquiries</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                        {recentEnquiries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-8">
                                <MessageSquare className="w-10 h-10 text-slate-200 mb-3" />
                                <p className="font-medium text-slate-900">No enquiries yet</p>
                                <p className="text-sm text-slate-500 mt-1">New enquiries will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentEnquiries.map((enq) => (
                                    <div key={enq.id} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                                            {enq.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-slate-900 truncate">{enq.name}</p>
                                                <Badge variant={enq.status === "pending" ? "secondary" : "default"} className="text-[10px]">
                                                    {enq.status}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-slate-500 truncate">{enq.email}</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {new Date(enq.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
