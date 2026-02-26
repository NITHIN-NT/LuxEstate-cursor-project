import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createAndSendOTP } from "@/lib/otp";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required." }, { status: 400 });
        }

        // Check if admin exists
        const [admin] = await db
            .select()
            .from(admins)
            .where(eq(admins.email, email))
            .limit(1);

        if (!admin) {
            // Don't reveal if email exists
            return NextResponse.json({ success: true });
        }

        const sent = await createAndSendOTP(email);
        if (!sent) {
            return NextResponse.json({ error: "Failed to send verification code. Please try again." }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
