import { Resend } from "resend";
import { db } from "@/db";
import { otpCodes } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";

function getResend() {
    return new Resend(process.env.RESEND_API_KEY);
}

/**
 * Generate alphanumeric OTP like "HN97H9"
 */
export function generateOTP(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No O/0/1/I/L to avoid confusion
    let otp = "";
    for (let i = 0; i < 6; i++) {
        otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return otp;
}

/**
 * Store OTP in database and send via Resend
 */
export async function createAndSendOTP(email: string): Promise<boolean> {
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store in DB
    await db.insert(otpCodes).values({
        email,
        code,
        expiresAt,
    });

    // Send via Resend
    try {
        const resend = getResend();
        await resend.emails.send({
            from: "LuxEstate <onboarding@resend.dev>",
            to: email,
            subject: "Your LuxEstate Password Reset Code",
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; margin-bottom: 8px;">Password Reset</h2>
                    <p style="color: #64748b; margin-bottom: 24px;">Use the verification code below to reset your password. This code expires in 10 minutes.</p>
                    <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                        <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #0f172a;">${code}</span>
                    </div>
                    <p style="color: #94a3b8; font-size: 13px;">If you did not request a password reset, please ignore this email.</p>
                </div>
            `,
        });
        return true;
    } catch (error) {
        console.error("Failed to send OTP email:", error);
        return false;
    }
}

/**
 * Verify OTP from database
 */
export async function verifyOTPCode(email: string, code: string): Promise<boolean> {
    const [record] = await db
        .select()
        .from(otpCodes)
        .where(
            and(
                eq(otpCodes.email, email),
                eq(otpCodes.code, code.toUpperCase()),
                gt(otpCodes.expiresAt, new Date())
            )
        )
        .limit(1);

    if (!record) return false;

    // Delete used OTP
    await db.delete(otpCodes).where(eq(otpCodes.id, record.id));
    return true;
}
