import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getResetToken, deleteResetToken } from "@/app/api/auth/verify-otp/route";

export async function POST(request: NextRequest) {
    try {
        const { resetToken, newPassword } = await request.json();

        if (!resetToken || !newPassword) {
            return NextResponse.json({ error: "Reset token and new password are required." }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
        }

        const tokenData = getResetToken(resetToken);
        if (!tokenData) {
            return NextResponse.json({ error: "Reset link has expired. Please start the process again." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await db
            .update(admins)
            .set({ password: hashedPassword })
            .where(eq(admins.email, tokenData.email));

        deleteResetToken(resetToken);

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
