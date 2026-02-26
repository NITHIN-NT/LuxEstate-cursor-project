"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Building2,
    MessageSquare,
    Menu,
    X,
    House,
    Settings,
    LogOut,
    Users,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function AdminSidebar({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const isSuperuser = (session?.user as { role?: string })?.role === "superuser";

    // Don't show sidebar on login/forgot-password pages
    const isAuthPage = pathname.startsWith("/admin/login") || pathname.startsWith("/admin/forgot-password");
    if (isAuthPage) return <>{children}</>;

    const menuItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Properties", href: "/admin/properties", icon: Building2 },
        { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
        ...(isSuperuser ? [{ name: "Staff", href: "/admin/settings", icon: Users }] : []),
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    // De-duplicate settings for superuser (Staff links to settings page)
    const uniqueItems = menuItems.filter((item, index, self) =>
        index === self.findIndex((t) => t.href === item.href)
    );

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/admin/login");
    };

    return (
        <div className="min-h-[100dvh] bg-slate-50 flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <House className="w-6 h-6 text-slate-900" />
                    <span className="font-bold text-slate-900 tracking-tight">LuxEstate</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 hover:text-slate-900 transition-colors">
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen flex flex-col",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-100">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                        <House className="text-white w-4 h-4" />
                    </div>
                    <span className="font-bold text-lg text-slate-900 tracking-tight">LuxEstate</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {uniqueItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname.startsWith(item.href)
                                    ? "bg-slate-100 text-slate-900"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* User + Logout */}
                <div className="px-4 py-4 border-t border-slate-100">
                    {session?.user && (
                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                                {session.user.name?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{session.user.name}</p>
                                <p className="text-xs text-slate-500 truncate">{(session.user as { role?: string })?.role}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 lg:hidden z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 w-full p-4 md:p-8 overflow-y-auto lg:h-screen lg:max-w-6xl mx-auto">
                {children}
            </main>
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <AdminSidebar>{children}</AdminSidebar>
        </SessionProvider>
    );
}
