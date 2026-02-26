import { db } from "@/db";
import { properties } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Plus } from "lucide-react";
import PropertiesGrid from "@/components/admin/PropertiesGrid";
import { Button } from "@/components/ui/button";

export default async function PropertiesPage() {
    const propertyList = await db.query.properties.findMany({
        orderBy: [desc(properties.createdAt)],
    });

    return (
        <div className="space-y-10 pb-10">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                        Estate <span className="text-blue-700">Portfolio</span>
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight">Curate and manage your high-end property listings.</p>
                </div>
                <Button asChild className="group pr-5">
                    <Link href="/admin/properties/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Entry
                    </Link>
                </Button>
            </header>

            <PropertiesGrid properties={propertyList} />
        </div>
    );
}
