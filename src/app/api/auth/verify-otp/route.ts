import { NextRequest, NextResponse } from "next/server";
import { verifyOTPCode } from "@/lib/otp";
import { randomUUID } from "crypto";

// In-memory store for reset tokens (short-lived, 5 minutes)
const resetTokens = new Map<string, { email: string; expiresAt: number }>();

export function getResetToken(token: string) {
    const data = resetTokens.get(token);
    if (!data || Date.now() > data.expiresAt) {
        resetTokens.delete(token);
        return null;
    }
    return data;
}

export function deleteResetToken(token: string) {
    resetTokens.delete(token);
}

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json({ error: "Email and verification code are required." }, { status: 400 });
        }

        const isValid = await verifyOTPCode(email, code);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid or expired verification code. Please try again." }, { status: 400 });
        }

        // Issue a temporary reset token
        const resetToken = randomUUID();
        resetTokens.set(resetToken, {
            email,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        });

        return NextResponse.json({ success: true, resetToken });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
