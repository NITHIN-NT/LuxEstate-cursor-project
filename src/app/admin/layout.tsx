"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Building2,
    MessageSquare,
    Menu,
    X,
    House
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Properties", href: "/admin/properties", icon: Building2 },
        { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    ];

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
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
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
