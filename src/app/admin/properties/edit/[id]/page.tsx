"use client";

import { useEffect, useState, use } from "react";
import PropertyForm, { PropertyData } from "@/components/admin/PropertyForm";
import { Loader2 } from "lucide-react";

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [initialData, setInitialData] = useState<PropertyData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/properties/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setInitialData(data);
                } else {
                    alert("Failed to fetch property details");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!initialData) {
        return <div className="p-8 text-slate-500">Property not found.</div>;
    }

    return <PropertyForm isEditing={true} initialData={initialData} />;
}
