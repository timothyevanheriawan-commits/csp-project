"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Users, ChefHat, Heart, Clock, TrendingUp, ArrowUpRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Stats { totalUsers: number; totalRecipes: number; totalSaved: number; }
interface RecentRecipe { id: string; title: string; createdAt: string; author: { name: string | null; } | null; }
interface CategoryStats { name: string; count: number; }

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentRecipes, setRecentRecipes] = useState<RecentRecipe[]>([]);
    const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            setIsLoading(true);
            try {
                const [usersRes, recipesRes, savedRes, recentRes, catSubRes] = await Promise.all([
                    supabase.from("User").select("id", { count: "exact", head: true }),
                    supabase.from("Recipe").select("id", { count: "exact", head: true }),
                    supabase.from("SavedRecipe").select("userId", { count: "exact", head: true }),
                    supabase.from("Recipe").select("id, title, createdAt, author:User!authorId(name)").order("createdAt", { ascending: false }).limit(5),
                    supabase.from("Recipe").select("category")
                ]);

                setStats({ totalUsers: usersRes.count || 0, totalRecipes: recipesRes.count || 0, totalSaved: savedRes.count || 0 });
                setRecentRecipes((recentRes.data || []) as unknown as RecentRecipe[]);

                const catMap: Record<string, number> = {};
                catSubRes.data?.forEach(r => { catMap[r.category] = (catMap[r.category] || 0) + 1; });
                setCategoryStats(Object.entries(catMap).map(([name, count]) => ({ name: name.replace("_", " "), count })).sort((a, b) => b.count - a.count));
            } catch (error) { console.error("Dashboard error:", error); }
            finally { setIsLoading(false); }
        }
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        );
    }

    const statCards = [
        { label: "Total Pengguna", value: stats?.totalUsers, icon: Users, bgIcon: "bg-blue-50", textIcon: "text-blue-600", accent: "border-blue-100" },
        { label: "Total Resep", value: stats?.totalRecipes, icon: ChefHat, bgIcon: "bg-primary-50", textIcon: "text-primary-600", accent: "border-primary-100" },
        { label: "Resep Disimpan", value: stats?.totalSaved, icon: Heart, bgIcon: "bg-red-50", textIcon: "text-red-500", accent: "border-red-100" },
    ];

    return (
        <div className="space-y-8 font-body">
            <div>
                <h1 className="text-2xl font-heading font-bold text-text md:text-3xl">Dashboard Overview</h1>
                <p className="text-text-muted text-sm mt-1">Pantau performa RecipeShare hari ini.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`bg-white p-5 rounded-2xl border ${stat.accent} flex items-center gap-4`}
                        style={{ boxShadow: 'var(--shadow-xs)' }}
                    >
                        <div className={`p-3.5 rounded-xl ${stat.bgIcon}`}>
                            <stat.icon className={`w-5 h-5 ${stat.textIcon}`} />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-text mt-0.5 tabular-nums">{stat.value?.toLocaleString() || 0}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Recipes */}
                <section className="bg-white p-6 rounded-2xl border border-primary-50" style={{ boxShadow: 'var(--shadow-xs)' }}>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-bold text-text flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary-500" />
                            Resep Terbaru
                        </h2>
                        <Link href="/admin/recipes" className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1">
                            Lihat Semua <ArrowUpRight size={12} />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {recentRecipes.length === 0 ? (
                            <p className="text-text-muted text-center py-6 text-sm italic">Belum ada resep baru.</p>
                        ) : (
                            recentRecipes.map((recipe) => (
                                <div key={recipe.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-muted transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary-700 font-bold text-sm">
                                            {recipe.title[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-text text-sm leading-tight">{recipe.title}</h4>
                                            <p className="text-[11px] text-text-muted mt-0.5">
                                                {recipe.author?.name || "Anonim"} · {new Date(recipe.createdAt).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                    <Link href={`/resep/${recipe.id}`} target="_blank"
                                        className="p-1.5 text-text-muted hover:text-primary-600 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                        <ArrowUpRight size={16} />
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Category Distribution */}
                <section className="bg-white p-6 rounded-2xl border border-primary-50" style={{ boxShadow: 'var(--shadow-xs)' }}>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-bold text-text flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary-500" />
                            Distribusi Kategori
                        </h2>
                    </div>
                    <div className="space-y-5">
                        {categoryStats.length === 0 ? (
                            <p className="text-text-muted text-center py-6 text-sm italic">Belum ada data kategori.</p>
                        ) : (
                            categoryStats.map((cat, i) => {
                                const percentage = stats?.totalRecipes ? (cat.count / stats.totalRecipes) * 100 : 0;
                                return (
                                    <div key={cat.name} className="space-y-1.5">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-semibold text-text capitalize">{cat.name.toLowerCase()}</span>
                                            <span className="text-[11px] font-bold text-text-muted tabular-nums">{cat.count} ({percentage.toFixed(0)}%)</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-primary-50 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                                                className="h-full bg-linear-to-r from-primary-500 to-secondary-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}