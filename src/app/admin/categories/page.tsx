"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X, Tags, Grid3x3, Loader2, PackageCheck } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Category { id: string; name: string; icon: string | null; createdAt: string; }

const AVAILABLE_ICONS = ["UtensilsCrossed", "Cake", "Coffee", "Cookie", "Pizza", "Apple", "Beef", "Soup", "Grid3x3", "Flame", "GlassWater", "IceCream"];

export default function CategoryManagement() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newIcon, setNewIcon] = useState("Grid3x3");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editIcon, setEditIcon] = useState("");
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch("/api/categories");
                if (res.ok) setCategories(await res.json() || []);
                else toast.error("Gagal mengambil kategori");
            } catch { toast.error("Kesalahan sistem"); }
            finally { setIsLoading(false); }
        })();
    }, []);

    const handleAdd = async () => {
        if (!newName.trim()) return;
        setIsActionLoading("add");
        try {
            const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newName, icon: newIcon }) });
            if (res.ok) { const data = await res.json(); setCategories([...categories, data].sort((a, b) => a.name.localeCompare(b.name))); setNewName(""); setIsAdding(false); toast.success("Kategori ditambahkan"); }
            else { const err = await res.json(); toast.error(err.message || "Gagal"); }
        } catch { toast.error("Kesalahan sistem"); }
        finally { setIsActionLoading(null); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus kategori ini?")) return;
        setIsActionLoading(id);
        try {
            const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
            if (res.ok) { setCategories(categories.filter(c => c.id !== id)); toast.success("Dihapus"); }
            else { const err = await res.json(); toast.error(err.message || "Gagal"); }
        } catch { toast.error("Kesalahan sistem"); }
        finally { setIsActionLoading(null); }
    };

    const saveEdit = async () => {
        if (!editingId) return;
        setIsActionLoading(editingId);
        try {
            const res = await fetch("/api/categories", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, name: editName, icon: editIcon }) });
            if (res.ok) { setCategories(categories.map(c => c.id === editingId ? { ...c, name: editName, icon: editIcon } : c)); setEditingId(null); toast.success("Diperbarui"); }
            else { const err = await res.json(); toast.error(err.message || "Gagal"); }
        } catch { toast.error("Kesalahan sistem"); }
        finally { setIsActionLoading(null); }
    };

    const DynamicIcon = ({ name, className }: { name: string | null; className?: string }) => {
        const IconComp = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[name || "Grid3x3"] || Grid3x3;
        return <IconComp className={className} />;
    };

    return (
        <div className="space-y-6 font-body">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-text">Kontrol Taksonomi</h1>
                    <p className="text-text-muted text-sm mt-1">Kelola kategori resep dan ikon yang ditampilkan.</p>
                </div>
                <button onClick={() => setIsAdding(!isAdding)}
                    className="btn btn-primary px-4 py-2 rounded-xl text-sm active:scale-95">
                    {isAdding ? <X size={18} /> : <Plus size={18} />}
                    <span>{isAdding ? "Batal" : "Tambah Kategori"}</span>
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div initial={{ opacity: 0, height: 0, y: -16 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -16 }}
                        className="bg-primary-50/50 border border-primary-100 rounded-2xl p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-text mb-1.5">Nama Kategori</label>
                                <input type="text" placeholder="Contoh: Snack & Appetizer" value={newName} onChange={(e) => setNewName(e.target.value)} className="input-field py-2.5" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text mb-1.5">Ikon</label>
                                <div className="flex flex-wrap gap-1.5 p-1.5 bg-white border border-primary-100 rounded-xl max-h-28 overflow-y-auto">
                                    {AVAILABLE_ICONS.map(icon => (
                                        <button key={icon} onClick={() => setNewIcon(icon)}
                                            className={`p-1.5 rounded-lg transition-all ${newIcon === icon ? 'bg-primary-500 text-white shadow-sm' : 'hover:bg-primary-50 text-text-muted'}`}>
                                            <DynamicIcon name={icon} className="w-4 h-4" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-end">
                                <button onClick={handleAdd} disabled={isActionLoading === 'add' || !newName}
                                    className="w-full btn btn-primary py-2.5 rounded-xl text-sm disabled:opacity-50">
                                    {isActionLoading === 'add' ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-text-muted">
                        <Loader2 className="animate-spin mb-3" size={28} /><p className="text-sm">Memuat...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-text-muted bg-surface-muted border border-dashed border-primary-100 rounded-2xl">
                        <Tags size={40} className="mb-3 opacity-20" /><p className="font-heading text-base font-bold">Belum Ada Kategori</p>
                        <p className="text-xs mt-1">Tambahkan kategori baru di atas.</p>
                    </div>
                ) : (
                    categories.map((cat) => (
                        <motion.div layout key={cat.id}
                            className={`bg-white p-4 rounded-2xl border transition-all ${editingId === cat.id ? 'border-primary-400 ring-4 ring-primary-50' : 'border-primary-50 hover:border-primary-200/60'}`}
                            style={{ boxShadow: editingId === cat.id ? 'var(--shadow-lg)' : 'var(--shadow-xs)' }}>
                            {editingId === cat.id ? (
                                <div className="space-y-3">
                                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field py-2 text-sm" autoFocus />
                                    <div className="flex flex-wrap gap-1.5">
                                        {AVAILABLE_ICONS.map(icon => (
                                            <button key={icon} onClick={() => setEditIcon(icon)}
                                                className={`p-1.5 rounded-md transition-all ${editIcon === icon ? 'bg-primary-500 text-white' : 'hover:bg-primary-50 text-text-muted'}`}>
                                                <DynamicIcon name={icon} className="w-4 h-4" />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={saveEdit} className="flex-1 btn btn-primary py-2 rounded-xl text-xs">Simpan</button>
                                        <button onClick={() => setEditingId(null)} className="btn btn-ghost py-2 px-3 rounded-xl text-xs">Batal</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100">
                                            <DynamicIcon name={cat.icon} className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text text-sm leading-tight">{cat.name}</h4>
                                            <p className="text-[10px] text-text-muted mt-0.5">{new Date(cat.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditIcon(cat.icon || "Grid3x3"); }}
                                            className="p-1.5 text-text-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(cat.id)}
                                            className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            {!isLoading && categories.length > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex items-start gap-2.5">
                    <PackageCheck className="text-blue-500 shrink-0 mt-0.5" size={16} />
                    <p className="text-xs text-blue-700 leading-relaxed font-medium">
                        <strong>Tips:</strong> Nama kategori akan muncul otomatis di filter halaman jelajah resep.
                    </p>
                </div>
            )}
        </div>
    );
}