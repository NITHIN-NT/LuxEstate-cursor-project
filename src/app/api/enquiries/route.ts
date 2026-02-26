import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { enquiries } from "@/db/schema";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (!data.name || !data.email || !data.message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const [enquiry] = await db.insert(enquiries).values({
            propertyId: data.propertyId || null,
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            message: data.message,
            status: "pending",
        }).returning();

        return NextResponse.json({ success: true, enquiry });
    } catch (error: unknown) {
        console.error("Enquiry submission error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
