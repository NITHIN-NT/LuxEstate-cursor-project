"use client";

import { useState } from "react";
import { House, ArrowLeft, Mail, KeyRound, Lock } from "lucide-react";
import Link from "next/link";

type Step = "email" | "otp" | "reset";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!email.trim()) { setError("Please enter your email address."); return; }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            setStep("otp");
        } catch {
            setError("Failed to send verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!otp.trim()) { setError("Please enter the verification code."); return; }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: otp }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            setResetToken(data.resetToken);
            setStep("reset");
        } catch {
            setError("Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!newPassword.trim()) { setError("Please enter a new password."); return; }
        if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
        if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resetToken, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            setSuccess(true);
        } catch {
            setError("Password reset failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                        <KeyRound className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Password Reset Successful</h2>
                    <p className="text-slate-500 mb-6">Your password has been updated. You can now sign in with your new password.</p>
                    <Link
                        href="/admin/login"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-900 rounded-xl mb-4">
                        <House className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
                    <p className="text-slate-500 mt-1">
                        {step === "email" && "Enter your email to receive a verification code"}
                        {step === "otp" && "Enter the 6-character code sent to your email"}
                        {step === "reset" && "Choose a new password for your account"}
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {["email", "otp", "reset"].map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === s ? "bg-slate-900 text-white" :
                                    ["email", "otp", "reset"].indexOf(step) > i ? "bg-green-500 text-white" :
                                        "bg-slate-200 text-slate-500"
                                }`}>
                                {i + 1}
                            </div>
                            {i < 2 && <div className={`w-8 h-0.5 ${["email", "otp", "reset"].indexOf(step) > i ? "bg-green-500" : "bg-slate-200"}`} />}
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-5">
                            {error}
                        </div>
                    )}

                    {step === "email" && (
                        <form onSubmit={handleSendOTP} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@luxestate.com"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${loading ? "bg-slate-400 cursor-not-allowed text-white" : "bg-slate-900 hover:bg-slate-800 text-white"}`}>
                                {loading ? "Sending..." : "Send Verification Code"}
                            </button>
                        </form>
                    )}

                    {step === "otp" && (
                        <form onSubmit={handleVerifyOTP} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Verification Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.toUpperCase())}
                                    placeholder="HN97H9"
                                    maxLength={6}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm text-center tracking-[0.5em] font-mono text-lg uppercase"
                                    disabled={loading}
                                />
                                <p className="text-xs text-slate-400 mt-2">Code sent to {email}</p>
                            </div>
                            <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${loading ? "bg-slate-400 cursor-not-allowed text-white" : "bg-slate-900 hover:bg-slate-800 text-white"}`}>
                                {loading ? "Verifying..." : "Verify Code"}
                            </button>
                            <button type="button" onClick={() => setStep("email")} className="w-full text-sm text-slate-500 hover:text-slate-900 transition-colors">
                                Didn&apos;t receive it? Go back
                            </button>
                        </form>
                    )}

                    {step === "reset" && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat your password"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${loading ? "bg-slate-400 cursor-not-allowed text-white" : "bg-slate-900 hover:bg-slate-800 text-white"}`}>
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}
                </div>

                <div className="text-center mt-6">
                    <Link href="/admin/login" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
