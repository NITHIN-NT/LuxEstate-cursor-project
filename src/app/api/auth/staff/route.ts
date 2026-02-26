import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || (session.user as { role: string }).role !== "superuser") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const staff = await db
            .select({
                id: admins.id,
                name: admins.name,
                email: admins.email,
                role: admins.role,
                createdAt: admins.createdAt,
            })
            .from(admins)
            .orderBy(admins.createdAt);

        return NextResponse.json(staff);
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as { role: string }).role !== "superuser") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { name, email, password, role } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
        }

        // Check if email already exists
        const [existing] = await db
            .select()
            .from(admins)
            .where(eq(admins.email, email))
            .limit(1);

        if (existing) {
            return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const [newStaff] = await db.insert(admins).values({
            name,
            email,
            password: hashedPassword,
            role: role || "staff",
        }).returning({
            id: admins.id,
            name: admins.name,
            email: admins.email,
            role: admins.role,
            createdAt: admins.createdAt,
        });

        return NextResponse.json({ success: true, staff: newStaff });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as { role: string }).role !== "superuser") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "Staff ID is required." }, { status: 400 });
        }

        // Prevent deleting yourself
        if (id === (session.user as { id: string }).id) {
            return NextResponse.json({ error: "You cannot remove your own account." }, { status: 400 });
        }

        await db.delete(admins).where(eq(admins.id, id));

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
