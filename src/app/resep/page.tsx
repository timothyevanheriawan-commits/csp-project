"use client";

import { useState, useEffect, useMemo, FC } from 'react';
import RecipeCard from '../components/RecipeCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChefHat, Coffee, Cake, UtensilsCrossed, Cookie, Search, Grid3x3, List, Loader2, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { SaveButton } from '../components/SaveButton';
interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  difficulty: string;
  category: 'MAKANAN_UTAMA' | 'KUE_DESSERT' | 'MINUMAN' | 'CAMILAN';
  author: { name: string; };
  createdAt?: string;
}

const categories = {
  SEMUA: { label: 'Semua Resep', icon: Grid3x3 },
  MAKANAN_UTAMA: { label: 'Makanan Utama', icon: UtensilsCrossed },
  KUE_DESSERT: { label: 'Kue & Dessert', icon: Cake },
  MINUMAN: { label: 'Minuman', icon: Coffee },
  CAMILAN: { label: 'Camilan', icon: Cookie },
};

type CategoryKey = keyof typeof categories;

const difficultyOrder: Record<string, number> = { 'mudah': 0, 'sedang': 1, 'sulit': 2 };

const getDifficultyClass = (difficulty: string) => {
  const d = difficulty.toLowerCase();
  return d === 'mudah' ? 'bg-green-100 text-green-700' : d === 'sedang' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
};

export default function ResepPage() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('SEMUA');
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

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const filteredAndSearchedRecipes = useMemo(() => {
    return allRecipes
      .filter(recipe => {
        const categoryMatch = selectedCategory === 'SEMUA' || recipe.category === selectedCategory;
        const searchMatch = !searchQuery.trim() || recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && searchMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === 'easiest') {
          const difficultyA = difficultyOrder[a.difficulty?.toLowerCase()] ?? 99;
          const difficultyB = difficultyOrder[b.difficulty?.toLowerCase()] ?? 99;
          return difficultyA - difficultyB;
        }
        return 0;
      });
  }, [allRecipes, selectedCategory, searchQuery, sortBy]);

  const categoryStats = useMemo(() => {
    const stats: Record<CategoryKey, number> = { SEMUA: allRecipes.length, MAKANAN_UTAMA: 0, KUE_DESSERT: 0, MINUMAN: 0, CAMILAN: 0 };
    allRecipes.forEach(r => r.category in stats && r.category !== 'SEMUA' && stats[r.category as 'MAKANAN_UTAMA' | 'KUE_DESSERT' | 'MINUMAN' | 'CAMILAN']++);
    return stats;
  }, [allRecipes]);

  const SelectedIcon = categories[selectedCategory].icon;

  const CategoryButton: FC<{ categoryKey: CategoryKey }> = ({ categoryKey }) => {
    const { label, icon: Icon } = categories[categoryKey];
    const isSelected = selectedCategory === categoryKey;
    const count = categoryStats[categoryKey];
    const baseClasses = "p-4 rounded-xl transition-all duration-200 bg-white shadow-sm hover:shadow-lg";
    return (
      <button
        onClick={() => setSelectedCategory(categoryKey)}
        className={`${baseClasses} ${isSelected ? 'border-2 border-primary-500 shadow-xl' : 'border border-gray-200 hover:border-gray-300'}`}
      >
        <Icon className={`w-6 h-6 mb-2 mx-auto ${isSelected ? 'text-primary-500' : 'text-gray-600'}`} />
        <h3 className={`font-medium text-sm ${isSelected ? 'text-primary-600' : 'text-text'}`}>{label}</h3>
        <p className={`text-xs mt-1 ${isSelected ? 'text-primary-500' : 'text-text-lighter'}`}>{count} Resep</p>
        {isSelected && (<div className="mt-2 mx-auto w-8 h-1 bg-primary-500 rounded-full"></div>)}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-inter" style={{ backgroundColor: "#eaf8ee" }}>
      <Navbar />
      <main className="flex-grow">
        <section className="relative py-16 overflow-hidden" style={{ backgroundColor: "#eaf8ee" }}>
          <div className="absolute top-5 right-10 w-24 h-24 bg-accent-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-5 left-10 w-32 h-32 bg-secondary-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl text-gray-800 mb-4">Resep</h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Temukan resep pilihan berdasarkan kategori, dari hidangan utama hingga camilan.</p>
            </div>
          </div>
        </section>
        <section className="py-8 -mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {(Object.keys(categories) as CategoryKey[]).map(key => <CategoryButton key={key} categoryKey={key} />)}
            </div>
          </div>
        </section>
        <section className="py-6 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Cari di ${categories[selectedCategory].label}...`}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex gap-3 items-center">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  ><Grid3x3 className="w-4 h-4" /></button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  ><List className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
            {(searchQuery || selectedCategory !== 'SEMUA') && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedCategory !== 'SEMUA' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    <SelectedIcon className="w-3 h-3" />
                    {categories[selectedCategory].label}
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                    <Search className="w-3 h-3" />
                    "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-1 hover:text-secondary-900"
                    >×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </section>
        <section className="py-12" style={{ backgroundColor: "#eaf8ee" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-gray-600">Memuat resep...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Menampilkan <span className="font-semibold text-gray-800">{filteredAndSearchedRecipes.length}</span> resep
                    {selectedCategory !== 'SEMUA' && ` dalam kategori ${categories[selectedCategory].label}`}
                  </p>
                </div>
                {filteredAndSearchedRecipes.length > 0 ? (
                  <div className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'
                      : 'flex flex-col gap-4'
                  }>
                    {filteredAndSearchedRecipes.map(recipe => {
                      const isSaved = savedRecipeIds.has(recipe.id);

                      return viewMode === 'grid' ? (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          isInitiallySaved={isSaved}
                          viewMode={viewMode}
                        />
                      ) : (
                        <Link href={`/resep/${recipe.id}`} key={recipe.id}>
                          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex gap-4 cursor-pointer group relative">

                            <div className="absolute top-3 right-3 z-10" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                              <SaveButton recipeId={recipe.id} isInitiallySaved={isSaved} />
                            </div>

                              <div className="w-32 h-32  bg-gray-200 flex-shrink-0 rounded-lg overflow-hidden">
                              {recipe.imageUrl ? (
                                <img
                                  src={recipe.imageUrl}
                                  alt={recipe.title}
                                  className="w-full h-full rounded-lg object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-200">
                                  <ChefHat className="w-8 h-8 text-secondary-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-grow pr-8">
                              <h3 className="text-xl text-gray-800 mb-1 group-hover:text-primary-500 transition-colors">{recipe.title}</h3>
                              <p className="text-gray-500 text-sm mb-2 line-clamp-2">{recipe.description || "Resep lezat yang wajib dicoba!"}</p>
                              <div className="flex items-center gap-4 text-sm mt-3">
                                {recipe.difficulty && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyClass(recipe.difficulty)}`}>
                                    {recipe.difficulty}
                                  </span>
                                )}
                                <div className="text-gray-600">Oleh {recipe.author?.name || 'Anonymous'}</div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="bg-white rounded-2xl shadow-soft p-12 max-w-md mx-auto ">
                      <SelectedIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-2xl text-gray-800 mb-2 ">Tidak Ada Resep</h3>
                      <p className="text-black-600 mb-6">
                        {searchQuery
                          ? `Tidak ada resep yang cocok dengan pencarian "${searchQuery}"`
                          : `Belum ada resep dalam kategori ${categories[selectedCategory].label}`
                        }
                      </p>
                      <div className="space-y-3">
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                          >Hapus Pencarian
                          </button>
                        )}
                        <Link
                          href="/tambah-resep"
                          className="w-full inline-block py-2 px-4 rounded-lg font-semibold text-white"
                          style={{ backgroundColor: '#ffc145', }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e0a935')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffc145')}
                        >
                          + Tambah Resep Baru
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}