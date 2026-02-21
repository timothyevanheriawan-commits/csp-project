"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, Settings, Tags, LogOut, ChevronLeft, ChevronRight, Loader2, ChefHat } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if (status === "loading") return;
        if (!session || session.user.role !== "ADMIN") router.push("/");
    }, [session, status, router]);

    if (status === "loading" || !session || session.user.role !== "ADMIN") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-surface-muted">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        );
    }

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Resep", href: "/admin/recipes", icon: ChefHat },
        { label: "Pengguna", href: "/admin/users", icon: Users },
        { label: "Kategori", href: "/admin/categories", icon: Tags },
        { label: "Pengaturan", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-surface-muted font-body">
            {/* Sidebar */}
            <aside className={`${collapsed ? "w-18" : "w-60"} bg-white border-r border-primary-50 transition-all duration-300 flex flex-col sticky top-0 h-screen`}>
                <div className="p-5 flex items-center justify-between">
                    {!collapsed && (
                        <Link href="/" className="flex items-center gap-2 font-heading text-lg text-primary-700">
                            <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
                                <ChefHat className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold">Admin</span>
                        </Link>
                    )}
                    <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-surface-muted text-text-muted">
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>

                <nav className="flex-1 px-3 py-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-sm ${isActive ? "bg-primary-50 text-primary-700 font-semibold" : "text-text-secondary hover:bg-surface-muted hover:text-text"
                                    }`}>
                                <item.icon size={18} className={isActive ? "text-primary-600" : "text-text-muted"} />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-primary-50">
                    <Link href="/"
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors">
                        <LogOut size={18} />
                        {!collapsed && <span className="font-medium">Keluar Admin</span>}
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 md:p-8 min-h-screen">
                {children}
            </main>
        </div>
    );
}