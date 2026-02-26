// src/lib/properties.ts
import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface PropertyWithRelations {
    id: string;
    title: string;
    description: string;
    price: string;
    location: string;
    beds: number;
    baths: number;
    size: string;
    tag: string | null;
    tagColor: string | null;
    mainImage: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
    gallery: string[];
    features: { label: string; value: string }[];
    amenities: string[];
}

export async function getProperties(): Promise<PropertyWithRelations[]> {
    const dbProps = await db.query.properties.findMany({
        with: {
            images: true,
            features: true,
            amenities: true,
        },
        orderBy: (properties, { desc }) => [desc(properties.createdAt)],
    });

    return dbProps.map((p) => ({
        ...p,
        price: "$" + Number(p.price).toLocaleString(), // Format price back to string for UI
        gallery: (p.images || []).sort((a, b) => a.order - b.order).map((img) => img.url),
        features: (p.features || []).map((f) => ({ label: f.label, value: f.value })),
        amenities: (p.amenities || []).map((a) => a.name)
    }));
}

export async function getPropertyById(id: string): Promise<PropertyWithRelations | null> {
    const p = await db.query.properties.findFirst({
        where: eq(properties.id, id),
        with: {
            images: true,
            features: true,
            amenities: true,
        },
    });

    if (!p) return null;

    return {
        ...p,
        price: "$" + Number(p.price).toLocaleString(),
        gallery: (p.images || []).sort((a, b) => a.order - b.order).map((img) => img.url),
        features: (p.features || []).map((f) => ({ label: f.label, value: f.value })),
        amenities: (p.amenities || []).map((a) => a.name)
    };
}
