import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { desc } from "drizzle-orm";
import EnquiriesList from "@/components/admin/EnquiriesList";

export default async function EnquiriesPage() {
    const enquiryList = await db.query.enquiries.findMany({
        orderBy: [desc(enquiries.createdAt)],
    });

    return (
        <div className="space-y-10 pb-10">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-slate-900">Enquiries</h1>
                    <p className="text-sm text-slate-500">Monitor and respond to client messages.</p>
                </div>
            </header>

            <EnquiriesList enquiries={enquiryList} />
        </div>
    );
}
