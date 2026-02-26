"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Lock, Eye, EyeOff, UserPlus, Trash2, Shield, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function SettingsPage() {
    const { data: session } = useSession();
    const isSuperuser = (session?.user as { role?: string })?.role === "superuser";

    // Change Password State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);
    const [pwError, setPwError] = useState("");
    const [pwSuccess, setPwSuccess] = useState("");

    // Staff Management State
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [staffLoading, setStaffLoading] = useState(false);
    const [newStaffName, setNewStaffName] = useState("");
    const [newStaffEmail, setNewStaffEmail] = useState("");
    const [newStaffPassword, setNewStaffPassword] = useState("");
    const [staffError, setStaffError] = useState("");
    const [staffSuccess, setStaffSuccess] = useState("");
    const [addingStaff, setAddingStaff] = useState(false);

    useEffect(() => {
        if (isSuperuser) fetchStaff();
    }, [isSuperuser]);

    const fetchStaff = async () => {
        setStaffLoading(true);
        try {
            const res = await fetch("/api/auth/staff");
            if (res.ok) {
                const data = await res.json();
                setStaff(data);
            }
        } catch {
            console.error("Failed to fetch staff");
        } finally {
            setStaffLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwError("");
        setPwSuccess("");

        if (!currentPassword.trim()) { setPwError("Please enter your current password."); return; }
        if (!newPassword.trim()) { setPwError("Please enter a new password."); return; }
        if (newPassword.length < 6) { setPwError("New password must be at least 6 characters."); return; }
        if (newPassword !== confirmPassword) { setPwError("Passwords do not match."); return; }

        setPwLoading(true);
        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) { setPwError(data.error); return; }
            setPwSuccess("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => setPwSuccess(""), 3000);
        } catch {
            setPwError("Failed to update password. Please try again.");
        } finally {
            setPwLoading(false);
        }
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setStaffError("");
        setStaffSuccess("");

        if (!newStaffName.trim() || !newStaffEmail.trim() || !newStaffPassword.trim()) {
            setStaffError("All fields are required.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newStaffEmail)) {
            setStaffError("Please enter a valid email address.");
            return;
        }

        if (newStaffPassword.length < 6) {
            setStaffError("Password must be at least 6 characters.");
            return;
        }

        setAddingStaff(true);
        try {
            const res = await fetch("/api/auth/staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newStaffName, email: newStaffEmail, password: newStaffPassword, role: "staff" }),
            });
            const data = await res.json();
            if (!res.ok) { setStaffError(data.error); return; }
            setStaffSuccess("Staff member added successfully!");
            setNewStaffName("");
            setNewStaffEmail("");
            setNewStaffPassword("");
            fetchStaff();
            setTimeout(() => setStaffSuccess(""), 3000);
        } catch {
            setStaffError("Failed to add staff member.");
        } finally {
            setAddingStaff(false);
        }
    };

    const handleDeleteStaff = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove ${name}?`)) return;
        try {
            const res = await fetch("/api/auth/staff", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) fetchStaff();
        } catch {
            console.error("Failed to delete staff");
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account and team</p>
            </div>

            {/* Change Password */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Lock className="w-5 h-5" /> Change Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                        {pwError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">{pwError}</div>}
                        {pwSuccess && <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg">{pwSuccess}</div>}

                        <div>
                            <Label>Current Password</Label>
                            <div className="relative mt-1.5">
                                <Input
                                    type={showCurrent ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    disabled={pwLoading}
                                />
                                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label>New Password</Label>
                            <div className="relative mt-1.5">
                                <Input
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    disabled={pwLoading}
                                />
                                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label>Confirm New Password</Label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat new password"
                                className="mt-1.5"
                                disabled={pwLoading}
                            />
                        </div>

                        <Button type="submit" disabled={pwLoading} className="w-full sm:w-auto">
                            {pwLoading ? "Updating..." : "Update Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Staff Management - Superuser Only */}
            {isSuperuser && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Shield className="w-5 h-5" /> Staff Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Add Staff Form */}
                        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <UserPlus className="w-4 h-4" /> Add New Staff Member
                            </h3>
                            <form onSubmit={handleAddStaff} className="space-y-4">
                                {staffError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">{staffError}</div>}
                                {staffSuccess && <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg">{staffSuccess}</div>}

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <Label>Full Name</Label>
                                        <Input value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} placeholder="Jane Doe" className="mt-1.5" disabled={addingStaff} />
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <Input type="email" value={newStaffEmail} onChange={(e) => setNewStaffEmail(e.target.value)} placeholder="jane@luxestate.com" className="mt-1.5" disabled={addingStaff} />
                                    </div>
                                    <div>
                                        <Label>Password</Label>
                                        <Input type="password" value={newStaffPassword} onChange={(e) => setNewStaffPassword(e.target.value)} placeholder="Min 6 chars" className="mt-1.5" disabled={addingStaff} />
                                    </div>
                                </div>
                                <Button type="submit" disabled={addingStaff} size="sm">
                                    <UserPlus className="w-4 h-4 mr-1" />
                                    {addingStaff ? "Adding..." : "Add Staff"}
                                </Button>
                            </form>
                        </div>

                        {/* Staff List */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-3">Current Team</h3>
                            {staffLoading ? (
                                <p className="text-sm text-slate-400">Loading...</p>
                            ) : (
                                <div className="space-y-3">
                                    {staff.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                                    {member.role === "superuser" ? <Shield className="w-5 h-5 text-slate-600" /> : <User className="w-5 h-5 text-slate-400" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{member.name}</p>
                                                    <p className="text-xs text-slate-500">{member.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant={member.role === "superuser" ? "default" : "secondary"}>
                                                    {member.role}
                                                </Badge>
                                                {member.id !== (session?.user as { id?: string })?.id && (
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteStaff(member.id, member.name)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
