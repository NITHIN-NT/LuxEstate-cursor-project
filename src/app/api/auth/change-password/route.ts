import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Both current and new passwords are required." }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: "New password must be at least 6 characters long." }, { status: 400 });
        }

        const [admin] = await db
            .select()
            .from(admins)
            .where(eq(admins.id, (session.user as { id: string }).id))
            .limit(1);

        if (!admin) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        const isValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isValid) {
            return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await db
            .update(admins)
            .set({ password: hashedPassword })
            .where(eq(admins.id, admin.id));

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
