import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { properties, propertyImages, propertyAmenities } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const property = await db.query.properties.findFirst({
            where: eq(properties.id, id),
            with: {
                // we don't have relations set up in schema yet apparently, so we fetch manually
            }
        });

        if (!property) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const amenities = await db.query.propertyAmenities.findMany({
            where: eq(propertyAmenities.propertyId, id)
        });

        const images = await db.query.propertyImages.findMany({
            where: eq(propertyImages.propertyId, id),
            orderBy: (images, { asc }) => [asc(images.order)]
        });

        return NextResponse.json({
            ...property,
            amenities: amenities.map(a => a.name),
            gallery: images.map(i => i.url)
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Wait for cascade delete
        await db.delete(properties).where(eq(properties.id, id));

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error("Property deletion error:", error);
        return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();

        const result = await db.transaction(async (tx) => {
            // Update main properties table
            const [property] = await tx.update(properties).set({
                title: data.title,
                description: data.description,
                price: data.price,
                location: data.location,
                beds: parseInt(data.beds),
                baths: parseInt(data.baths),
                size: data.size,
                tag: data.tag,
                mainImage: data.mainImage,
                updatedAt: new Date(),
            }).where(eq(properties.id, id)).returning();

            // Clear old amenities and insert new
            await tx.delete(propertyAmenities).where(eq(propertyAmenities.propertyId, id));
            if (data.amenities && data.amenities.length > 0) {
                await tx.insert(propertyAmenities).values(
                    data.amenities.map((name: string) => ({
                        propertyId: id,
                        name,
                    }))
                );
            }

            // Clear old gallery and insert new
            await tx.delete(propertyImages).where(eq(propertyImages.propertyId, id));
            if (data.gallery && data.gallery.length > 0) {
                await tx.insert(propertyImages).values(
                    data.gallery.map((url: string, index: number) => ({
                        propertyId: id,
                        url,
                        order: index,
                    }))
                );
            }

            return property;
        });

        return NextResponse.json({ success: true, property: result });
    } catch (error: unknown) {
        console.error("Property update error:", error);
        return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
    }
}
