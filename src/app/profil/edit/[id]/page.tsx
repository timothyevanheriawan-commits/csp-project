"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Plus, X, AlertCircle, Save, ArrowLeft, Utensils, List, FileText, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from 'react';
import { motion } from "framer-motion";

type ArrayField = 'ingredients' | 'instructions';
interface FormDataState {
    title: string; description: string; ingredients: string[]; instructions: string[];
    difficulty: 'MUDAH' | 'SEDANG' | 'SULIT';
    category: string;
    imageUrl: string;
}
interface Category { id: string; name: string; }

export default function EditResepPage() {
    const { status } = useSession();
    const router = useRouter();
    const params = useParams();
    const recipeId = params?.id;

    const [formData, setFormData] = useState<FormDataState>({
        title: "", description: "", ingredients: [""], instructions: [""], difficulty: "MUDAH", category: "MAKANAN_UTAMA", imageUrl: "",
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") router.push('/login');

        const fetchData = async () => {
            if (!recipeId) return;
            try {
                const [recipeRes, catRes] = await Promise.all([
                    fetch(`/api/resep/${recipeId}`),
                    fetch('/api/categories'),
                ]);
                const data = await recipeRes.json();
                if (recipeRes.ok) {
                    setFormData({
                        title: data.title || "",
                        description: data.description || "",
                        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [""],
                        instructions: typeof data.instructions === 'string'
                            ? data.instructions.split('\n').filter((i: string) => i.trim() !== "")
                            : (Array.isArray(data.instructions) ? data.instructions : [""]),
                        difficulty: data.difficulty || "MUDAH",
                        category: data.category || "MAKANAN_UTAMA",
                        imageUrl: data.imageUrl || "",
                    });
                    setImagePreview(data.imageUrl || "");
                }
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData || []);
                }
            } catch (err) {
                console.error(err);
                setError("Gagal memuat data resep.");
            } finally {
                setIsLoadingData(false);
            }
        };

        if (status === "authenticated") fetchData();
    }, [status, recipeId, router]);

    useEffect(() => { setImagePreview(formData.imageUrl || ""); }, [formData.imageUrl]);

    const handleArrayChange = (field: ArrayField, index: number, value: string) => {
        setFormData(p => ({ ...p, [field]: p[field].map((item, i) => i === index ? value : item) }));
    };
    const handleArrayAdd = (field: ArrayField) => { setFormData(p => ({ ...p, [field]: [...p[field], ""] })); };
    const handleArrayRemove = (field: ArrayField, index: number) => {
        if (formData[field].length > 1) setFormData(p => ({ ...p, [field]: p[field].filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError(""); setSuccessMessage(""); setIsSubmitting(true);
        const validIngredients = formData.ingredients.filter(ing => ing.trim());
        const validInstructions = formData.instructions.filter(inst => inst.trim());
        if (validIngredients.length === 0 || validInstructions.length === 0) {
            setError("Mohon isi minimal satu bahan dan satu langkah memasak."); setIsSubmitting(false); return;
        }
        try {
            const res = await fetch(`/api/resep/${recipeId}`, {
                method: "PATCH", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, ingredients: validIngredients, instructions: validInstructions.join("\n") }),
            });
            if (res.ok) { setSuccessMessage("Perubahan berhasil disimpan!"); setTimeout(() => router.push(`/profil`), 2000); }
            else { setError("Gagal menyimpan perubahan."); }
        } catch { setError("Terjadi kesalahan koneksi."); }
        finally { setIsSubmitting(false); }
    };

    const difficultyLevels: FormDataState['difficulty'][] = ['MUDAH', 'SEDANG', 'SULIT'];
    const difficultyConfig: Record<string, { label: string; active: string }> = {
        MUDAH: { label: 'Mudah', active: 'bg-green-50 text-green-700 ring-2 ring-green-400 border-green-200' },
        SEDANG: { label: 'Sedang', active: 'bg-amber-50 text-amber-700 ring-2 ring-amber-400 border-amber-200' },
        SULIT: { label: 'Sulit', active: 'bg-red-50 text-red-700 ring-2 ring-red-400 border-red-200' },
    };

    if (isLoadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <main className="grow py-6 md:py-10 relative">
                <div className="absolute inset-0 bg-nature-gradient" />
                <div className="absolute inset-0 leaf-dots opacity-20" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 pt-4"
                    >
                        <Link href="/profil" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-600 transition-colors mb-5 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Batal & Kembali ke Profil</span>
                        </Link>
                        <h1 className="font-heading font-bold text-3xl md:text-5xl text-text mb-2">
                            Edit Resep
                        </h1>
                        <p className="text-text-secondary text-lg">
                            Perbarui rincian resep Anda agar tetap akurat dan menarik
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-7">
                        {/* Main content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl p-6 md:p-7 border border-primary-50"
                                style={{ boxShadow: 'var(--shadow-sm)' }}
                            >
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <h2 className="font-heading text-xl text-text">Informasi Dasar</h2>
                                </div>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-text mb-2">Nama Resep <span className="text-red-500">*</span></label>
                                        <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="input-field" placeholder="Contoh: Nasi Goreng Spesial" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-text mb-2">Deskripsi</label>
                                        <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="input-field resize-none" placeholder="Ceritakan keistimewaan resep ini..." />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Ingredients */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl p-6 md:p-7 border border-primary-50"
                                style={{ boxShadow: 'var(--shadow-sm)' }}
                            >
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
                                        <List className="w-5 h-5 text-secondary-600" />
                                    </div>
                                    <h2 className="font-heading text-xl text-text">Bahan-bahan</h2>
                                </div>
                                <div className="space-y-3">
                                    {formData.ingredients.map((ingredient, index) => (
                                        <div key={index} className="flex gap-2 items-center group">
                                            <span className="shrink-0 w-8 h-8 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                                            <input type="text" value={ingredient} onChange={(e) => handleArrayChange("ingredients", index, e.target.value)}
                                                className="input-field" placeholder={`Bahan ke-${index + 1}`} />
                                            {formData.ingredients.length > 1 && (
                                                <button type="button" onClick={() => handleArrayRemove("ingredients", index)}
                                                    aria-label={`Hapus bahan ke-${index + 1}`}
                                                    className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => handleArrayAdd("ingredients")}
                                        className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors">
                                        <Plus className="w-4 h-4" />Tambah Bahan
                                    </button>
                                </div>
                            </motion.div>

                            {/* Instructions */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl p-6 md:p-7 border border-primary-50"
                                style={{ boxShadow: 'var(--shadow-sm)' }}
                            >
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                                        <Utensils className="w-5 h-5 text-accent-600" />
                                    </div>
                                    <h2 className="font-heading text-xl text-text">Langkah Memasak</h2>
                                </div>
                                <div className="space-y-4">
                                    {formData.instructions.map((instruction, index) => (
                                        <div key={index} className="flex gap-3 group">
                                            <span className="shrink-0 w-8 h-8 bg-accent-50 text-accent-700 rounded-full flex items-center justify-center text-xs font-bold mt-2">{index + 1}</span>
                                            <div className="flex-1 flex gap-2">
                                                <textarea value={instruction} onChange={(e) => handleArrayChange("instructions", index, e.target.value)}
                                                    className="input-field resize-none" rows={3} placeholder={`Langkah ${index + 1}`} />
                                                {formData.instructions.length > 1 && (
                                                    <button type="button" onClick={() => handleArrayRemove("instructions", index)}
                                                        aria-label={`Hapus langkah ke-${index + 1}`}
                                                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 self-start mt-2">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => handleArrayAdd("instructions")}
                                        className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-accent-700 bg-accent-50 hover:bg-accent-100 rounded-xl transition-colors">
                                        <Plus className="w-4 h-4" />Tambah Langkah
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="bg-white rounded-2xl p-6 border border-primary-50 sticky top-20 space-y-5"
                                style={{ boxShadow: 'var(--shadow-sm)' }}
                            >
                                <div>
                                    <label htmlFor="category-select" className="block text-sm font-semibold text-text mb-2">Kategori</label>
                                    <select id="category-select" value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input-field">
                                        {categories.length > 0 ? categories.map((cat: Category) => (
                                            <option key={cat.id} value={cat.name.toUpperCase().replace(/\s+/g, '_')}>{cat.name}</option>
                                        )) : (
                                            <>
                                                <option value="MAKANAN_UTAMA">Makanan Utama</option>
                                                <option value="KUE_DESSERT">Kue & Dessert</option>
                                                <option value="MINUMAN">Minuman</option>
                                                <option value="CAMILAN">Camilan</option>
                                            </>
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-text mb-2">Tingkat Kesulitan</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {difficultyLevels.map((level) => (
                                            <button key={level} type="button" onClick={() => setFormData({ ...formData, difficulty: level })}
                                                className={`py-2.5 px-3 rounded-xl font-medium text-sm transition-all border ${formData.difficulty === level ? difficultyConfig[level].active : 'bg-gray-50 text-text-secondary border-gray-200 hover:bg-gray-100'
                                                    }`}>
                                                {difficultyConfig[level].label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-text mb-2">URL Gambar</label>
                                    <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="input-field" placeholder="https://..." />
                                </div>

                                {imagePreview && (
                                    <div>
                                        <p className="text-xs font-semibold text-text-muted mb-2">Preview:</p>
                                        <div className="relative h-44 rounded-xl overflow-hidden bg-primary-50 border border-primary-100">
                                            <Image src={imagePreview.trimEnd()} alt="Preview" fill className="object-cover" unoptimized />
                                        </div>
                                    </div>
                                )}

                                <div className="h-px bg-primary-50" />

                                <div className="space-y-3">
                                    <button type="submit" disabled={isSubmitting}
                                        className="w-full btn btn-primary py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            : <><Save className="w-4 h-4" />Simpan Perubahan</>}
                                    </button>
                                    <Link href="/profil" className="btn btn-ghost w-full py-3 rounded-xl text-center block">
                                        Batal
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </form>

                    {/* Status messages */}
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                            className="mt-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span className="text-sm">{error}</span>
                        </motion.div>
                    )}
                    {successMessage && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                            className="mt-6 flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span className="text-sm">{successMessage}</span>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}