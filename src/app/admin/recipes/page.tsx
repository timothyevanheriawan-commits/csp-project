"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Trash2, Star, Edit2, Check, X, ChevronLeft, ChevronRight, Loader2, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Recipe { id: string; title: string; category: string; createdAt: string; isFeatured: boolean; author: { name: string | null; email: string | null; } | null; }

export default function RecipeManagement() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRecipes, setSelectedRecipes] = useState<Set<string>>(new Set());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try { const res = await fetch("/api/admin/resep"); if (res.ok) setRecipes(await res.json() || []); else toast.error("Gagal mengambil data"); }
            catch { toast.error("Kesalahan sistem"); }
            finally { setIsLoading(false); }
        })();
    }, []);

    const filteredRecipes = useMemo(() => recipes.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [recipes, searchQuery]);

    const toggleSelect = (id: string) => { const s = new Set(selectedRecipes); if (s.has(id)) s.delete(id); else s.add(id); setSelectedRecipes(s); };
    const toggleSelectAll = () => { setSelectedRecipes(selectedRecipes.size === filteredRecipes.length ? new Set() : new Set(filteredRecipes.map(r => r.id))); };

    const handleDelete = async (ids: string[]) => {
        if (!confirm(`Hapus ${ids.length} resep?`)) return;
        setIsActionLoading("delete");
        try {
            const res = await fetch(`/api/admin/resep?ids=${ids.join(",")}`, { method: "DELETE" });
            if (res.ok) { toast.success(`${ids.length} resep dihapus`); setRecipes(recipes.filter(r => !ids.includes(r.id))); setSelectedRecipes(new Set()); }
            else { const err = await res.json(); toast.error(err.message || "Gagal"); }
        } catch { toast.error("Kesalahan sistem"); }
        finally { setIsActionLoading(null); }
    };

    const toggleFeatured = async (recipe: Recipe) => {
        setIsActionLoading(recipe.id);
        try {
            const res = await fetch("/api/admin/resep", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: recipe.id, isFeatured: !recipe.isFeatured }) });
            if (res.ok) { setRecipes(recipes.map(r => r.id === recipe.id ? { ...r, isFeatured: !r.isFeatured } : r)); toast.success(recipe.isFeatured ? "Dihapus dari unggulan" : "Dijadikan unggulan"); }
            else { const err = await res.json(); toast.error(err.message || "Gagal"); }
        } catch { toast.error("Kesalahan sistem"); }
        finally { setIsActionLoading(null); }
    };

    const saveEdit = async () => {
        if (!editingId) return;
        setIsActionLoading(editingId);
        try {
            const res = await fetch("/api/admin/resep", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, title: editTitle }) });
            if (res.ok) { setRecipes(recipes.map(r => r.id === editingId ? { ...r, title: editTitle } : r)); setEditingId(null); toast.success("Judul diperbarui"); }
            else { const err = await res.json(); toast.error(err.message || "Gagal"); }
        } catch { toast.error("Kesalahan sistem"); }
        finally { setIsActionLoading(null); }
    };

    return (
        <div className="space-y-6 font-body">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-text">Moderasi Konten</h1>
                    <p className="text-text-muted text-sm mt-1">Kelola semua resep yang dipublikasikan.</p>
                </div>
                <div className="flex items-center gap-3">
                    <AnimatePresence>
                        {selectedRecipes.size > 0 && (
                            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => handleDelete(Array.from(selectedRecipes))}
                                className="bg-red-50 text-red-600 px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 hover:bg-red-100 transition-colors border border-red-200 text-sm">
                                <Trash2 size={15} />Hapus ({selectedRecipes.size})
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                        <input type="text" placeholder="Cari judul atau penulis..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-10 py-2 text-sm w-full md:w-60" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-primary-50 overflow-hidden" style={{ boxShadow: 'var(--shadow-xs)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-muted border-b border-primary-50">
                                <th className="p-4 w-10 text-center">
                                    <input type="checkbox" checked={selectedRecipes.size === filteredRecipes.length && filteredRecipes.length > 0} onChange={toggleSelectAll}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                </th>
                                {["Info Resep", "Penulis", "Kategori", "Tanggal", "Status"].map(h => (
                                    <th key={h} className="p-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                                ))}
                                <th className="p-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-50/80">
                            {isLoading ? (
                                <tr><td colSpan={7} className="p-12 text-center"><Loader2 className="w-7 h-7 text-primary-500 animate-spin mx-auto" /><p className="mt-2 text-text-muted text-sm">Memuat...</p></td></tr>
                            ) : filteredRecipes.length === 0 ? (
                                <tr><td colSpan={7} className="p-12 text-center text-text-muted text-sm">Tidak ada resep ditemukan.</td></tr>
                            ) : (
                                filteredRecipes.map((recipe) => (
                                    <tr key={recipe.id} className={`hover:bg-surface-muted/50 transition-colors ${selectedRecipes.has(recipe.id) ? 'bg-primary-50/30' : ''}`}>
                                        <td className="p-4 text-center">
                                            <input type="checkbox" checked={selectedRecipes.has(recipe.id)} onChange={() => toggleSelect(recipe.id)}
                                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                        </td>
                                        <td className="p-4">
                                            {editingId === recipe.id ? (
                                                <div className="flex items-center gap-1.5">
                                                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="input-field py-1.5 px-2 text-sm flex-1" autoFocus />
                                                    <button onClick={saveEdit} className="text-primary-600 hover:bg-primary-50 p-1 rounded-md"><Check size={14} /></button>
                                                    <button onClick={() => setEditingId(null)} className="text-red-500 hover:bg-red-50 p-1 rounded-md"><X size={14} /></button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0"><ChefHat size={16} className="text-primary-400" /></div>
                                                    <div>
                                                        <p className="font-semibold text-text text-sm leading-tight">{recipe.title}</p>
                                                        <p className="text-[10px] text-text-muted mt-0.5">ID: {recipe.id.slice(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm font-medium text-text-secondary">{recipe.author?.name || "Anonim"}</p>
                                            <p className="text-[10px] text-text-muted">{recipe.author?.email || "-"}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full font-semibold">{recipe.category.replace("_", " ")}</span>
                                        </td>
                                        <td className="p-4 text-xs text-text-muted">{new Date(recipe.createdAt).toLocaleDateString("id-ID")}</td>
                                        <td className="p-4">
                                            <button onClick={() => toggleFeatured(recipe)} disabled={isActionLoading === recipe.id}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${recipe.isFeatured ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-surface-muted text-text-muted hover:bg-primary-50"}`}>
                                                {isActionLoading === recipe.id ? <Loader2 size={10} className="animate-spin" /> : <Star size={10} fill={recipe.isFeatured ? "currentColor" : "none"} />}
                                                {recipe.isFeatured ? "Unggulan" : "Biasa"}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => { setEditingId(recipe.id); setEditTitle(recipe.title); }}
                                                    className="p-1.5 text-text-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit"><Edit2 size={14} /></button>
                                                <button onClick={() => handleDelete([recipe.id])}
                                                    className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!isLoading && filteredRecipes.length > 0 && (
                    <div className="p-3 border-t border-primary-50 bg-surface-muted flex items-center justify-between">
                        <p className="text-[11px] text-text-muted font-medium">{filteredRecipes.length} dari {recipes.length} resep</p>
                        <div className="flex items-center gap-1">
                            <button className="p-1.5 text-text-muted hover:bg-white rounded-lg"><ChevronLeft size={14} /></button>
                            <button className="p-1.5 text-text-muted hover:bg-white rounded-lg"><ChevronRight size={14} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}