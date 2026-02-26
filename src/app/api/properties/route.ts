import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { properties, propertyImages, propertyAmenities } from "@/db/schema";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Use a transaction to ensure ACID compliance (Atomicity)
        const result = await db.transaction(async (tx) => {
            // 1. Insert into properties table
            const [property] = await tx.insert(properties).values({
                title: data.title,
                description: data.description,
                price: data.price,
                location: data.location,
                beds: parseInt(data.beds),
                baths: parseInt(data.baths),
                size: data.size,
                tag: data.tag,
                mainImage: data.mainImage,
            }).returning();

            // 2. Insert into amenities (Normalized 1:N)
            if (data.amenities && data.amenities.length > 0) {
                await tx.insert(propertyAmenities).values(
                    data.amenities.map((name: string) => ({
                        propertyId: property.id,
                        name,
                    }))
                );
            }

            // 3. Insert into gallery images (Normalized 1:N)
            if (data.gallery && data.gallery.length > 0) {
                await tx.insert(propertyImages).values(
                    data.gallery.map((url: string, index: number) => ({
                        propertyId: property.id,
                        url,
                        order: index,
                    }))
                );
            }

            return property;
        });

        return NextResponse.json({ success: true, property: result });
    } catch (error: unknown) {
        console.error("Property creation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const list = await db.query.properties.findMany({
            orderBy: (p, { desc }) => [desc(p.createdAt)],
        });
        return NextResponse.json(list);
    } catch {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
