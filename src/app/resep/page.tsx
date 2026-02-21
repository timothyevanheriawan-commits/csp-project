"use client";

import React, { useState, useEffect, useMemo } from 'react';
import RecipeCard from '../components/RecipeCard';
import { LucideIcon, Coffee, Cake, UtensilsCrossed, Cookie, Search, Grid3x3, List, Loader2, Plus } from 'lucide-react';
import * as LucideIcons from "lucide-react";
import Link from 'next/link';
import { Recipe } from '../types/Recipe';
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
};

interface CategoryInfo { label: string; icon: LucideIcon; }
interface DBCategory { id: string; name: string; icon?: string; }
const DEFAULT_CATEGORIES: Record<string, CategoryInfo> = {
  SEMUA: { label: 'Semua', icon: Grid3x3 },
  MAKANAN_UTAMA: { label: 'Makanan Utama', icon: UtensilsCrossed },
  KUE_DESSERT: { label: 'Kue & Dessert', icon: Cake },
  MINUMAN: { label: 'Minuman', icon: Coffee },
  CAMILAN: { label: 'Camilan', icon: Cookie },
};

const difficultyOrder: Record<string, number> = { 'MUDAH': 0, 'SEDANG': 1, 'SULIT': 2 };

export default function ResepPage() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());
  const [dynamicCategories, setDynamicCategories] = useState<Record<string, CategoryInfo>>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy] = useState('newest');

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [recipesRes, savedIdsRes] = await Promise.all([
          fetch('/api/resep'),
          fetch('/api/profil/saved-recipe-ids')
        ]);
        if (!recipesRes.ok) throw new Error("Gagal mengambil data resep");
        const recipesData = await recipesRes.json();
        setAllRecipes(recipesData);
        if (savedIdsRes.ok) {
          const savedIdsData = await savedIdsRes.json();
          setSavedRecipeIds(new Set(savedIdsData));
        }
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const categoriesData = await catRes.json();
          if (categoriesData && categoriesData.length > 0) {
            const mapped: Record<string, CategoryInfo> = { SEMUA: DEFAULT_CATEGORIES.SEMUA };
            categoriesData.forEach((cat: DBCategory) => {
              const iconName = cat.icon || "UtensilsCrossed";
              const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[iconName] || UtensilsCrossed;
              const key = cat.name.toUpperCase().replace(/\s+/g, '_');
              mapped[key] = { label: cat.name, icon: Icon };
            });
            setDynamicCategories(mapped);
          }
        }
      } catch (error) { console.error(error); }
      finally { setIsLoading(false); }
    };
    fetchInitialData();
  }, []);

  const filteredRecipes = useMemo(() => {
    return allRecipes
      .filter(recipe => {
        const categoryMatch = selectedCategory === 'SEMUA' || recipe.category === selectedCategory;
        const searchMatch = !searchQuery.trim() || recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && searchMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        if (sortBy === 'easiest') return (difficultyOrder[a.difficulty] ?? 99) - (difficultyOrder[b.difficulty] ?? 99);
        return 0;
      });
  }, [allRecipes, selectedCategory, searchQuery, sortBy]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { SEMUA: allRecipes.length };
    Object.keys(dynamicCategories).forEach(k => { if (k !== 'SEMUA') stats[k] = 0; });
    allRecipes.forEach(r => { if (r.category in stats) stats[r.category]++; });
    return stats;
  }, [allRecipes, dynamicCategories]);

  const SelectedIcon = dynamicCategories[selectedCategory]?.icon || Grid3x3;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Page header */}
      <section className="relative pt-28 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-primary-900 grain-overlay" />
        <div className="absolute top-16 right-10 w-40 h-40 bg-primary-600/10 rounded-full blur-[70px]" />
        <div className="absolute bottom-8 left-16 w-28 h-28 bg-secondary-500/8 rounded-full blur-[50px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-400 mb-3 block">Koleksi Resep</span>
            <h1 className="font-heading text-4xl md:text-5xl text-white mb-3 font-bold">Jelajahi Resep</h1>
            <p className="text-primary-300/60 text-lg max-w-xl">Temukan resep pilihan berdasarkan kategori, dari hidangan utama hingga camilan.</p>
          </motion.div>
        </div>
      </section>

      {/* Category pills — sticky */}
      <section className="sticky top-16 md:top-[72px] z-30 bg-white/92 backdrop-blur-xl border-b border-primary-100/50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            {Object.entries(dynamicCategories).map(([key, { label, icon: Icon }]) => {
              const isActive = selectedCategory === key;
              const count = categoryStats[key] || 0;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 shrink-0 ${isActive
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                    : "bg-primary-50 text-text-secondary hover:bg-primary-100 hover:text-primary-700"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-primary-100 text-primary-600"
                    }`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search + View */}
      <section className="bg-white border-b border-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Cari di ${dynamicCategories[selectedCategory]?.label || 'Semua'}...`}
                className="input-field pl-11 py-2.5 text-sm" />
            </div>
            <div className="flex items-center gap-3">
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                  &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')} className="ml-0.5 hover:text-primary-900 font-bold">×</button>
                </span>
              )}
              <div className="flex bg-primary-50/70 rounded-lg p-0.5">
                <button onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}>
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe results */}
      <section className="py-8 grow relative">
        <div className="absolute inset-0 bg-nature-gradient" />
        <div className="absolute inset-0 leaf-dots opacity-30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {isLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
              <p className="text-text-muted text-sm">Memuat resep lezat...</p>
            </motion.div>
          ) : (
            <>
              <div className="mb-5">
                <p className="text-sm text-text-secondary">
                  Menampilkan <span className="font-bold text-text">{filteredRecipes.length}</span> resep
                  {selectedCategory !== 'SEMUA' && ` dalam kategori ${dynamicCategories[selectedCategory]?.label}`}
                </p>
              </div>

              {filteredRecipes.length > 0 ? (
                <motion.div
                  variants={containerVariants} initial="hidden" animate="visible"
                  key={`${selectedCategory}-${viewMode}`}
                  className={viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6'
                    : 'flex flex-col gap-3'
                  }
                >
                  {filteredRecipes.map(recipe => (
                    <motion.div key={recipe.id} variants={itemVariants}>
                      <RecipeCard recipe={recipe} isInitiallySaved={savedRecipeIds.has(recipe.id)} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                  <div className="bg-white rounded-2xl p-10 max-w-md mx-auto border border-primary-100" style={{ boxShadow: 'var(--shadow-md)' }}>
                    <SelectedIcon className="w-14 h-14 text-primary-300 mx-auto mb-4 animate-float" />
                    <h3 className="font-heading text-2xl text-text mb-2">Tidak Ada Resep</h3>
                    <p className="text-text-secondary text-sm mb-6">
                      {searchQuery ? `Tidak ada resep untuk "${searchQuery}"` : `Belum ada resep di kategori ini.`}
                    </p>
                    <div className="flex flex-col gap-3">
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="btn btn-ghost w-full rounded-xl">Hapus Pencarian</button>
                      )}
                      <Link href="/tambah-resep" className="btn btn-accent w-full rounded-xl">
                        <Plus size={18} /> Tambah Resep Baru
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}