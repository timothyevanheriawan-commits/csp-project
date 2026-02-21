"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import RecipeCard from "../components/RecipeCard";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";
import { Mail, BookOpen, Bookmark, PlusCircle, Settings, ChefHat } from "lucide-react";
import { Recipe } from '@/app/types/Recipe';
import { Session } from 'next-auth';
import Link from "next/link";
import { motion } from "framer-motion";

type Tab = 'recipes' | 'saved';

interface RecipeTabsProps {
  activeTab: 'recipes' | 'saved';
  setActiveTab: (tab: 'recipes' | 'saved') => void;
}

interface ProfileHeaderCardProps {
  session: Session;
  myRecipesLength: number;
  savedRecipesLength: number;
}

const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ session, myRecipesLength, savedRecipesLength }) => {
  const { user } = session;

  return (
    <div className="bg-white rounded-2xl p-6 md:p-10 mb-10 border border-primary-50 relative overflow-hidden group" style={{ boxShadow: 'var(--shadow-md)' }}>
      {/* Dekorasi Subtle */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary-50 rounded-full opacity-60 transition-transform group-hover:scale-110 duration-1000 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary-50 rounded-full opacity-60 blur-xl" />

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Avatar Section */}
        <div className="shrink-0 relative">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-linear-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            {user.image ? (
              <NextImage src={user.image} alt="Avatar" width={160} height={160} className="object-cover w-full h-full" priority unoptimized />
            ) : (
              <span className="text-primary-600 font-heading font-bold text-6xl">{user.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left">
          <div className="grow">
            <h1 className="font-heading text-4xl md:text-5xl text-text mb-2 tracking-tight font-bold">
              {user.name}
            </h1>
            <div className="flex items-center gap-2 text-text-muted justify-center md:justify-start mb-6">
              <Mail className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium">{user.email}</span>
            </div>

            {/* Stats List */}
            <div className="pt-5 border-t border-primary-50/80 flex justify-center md:justify-start gap-12">
              <div className="flex flex-col">
                <span className="text-3xl font-heading font-bold text-primary-700">{myRecipesLength}</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Resep Dibuat</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-heading font-bold text-primary-700">{savedRecipesLength}</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Resep Disimpan</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Link
            href="/profil/pengaturan"
            className="mt-8 md:mt-0 btn btn-ghost rounded-xl px-5 py-2.5 text-sm shadow-sm"
          >
            <Settings size={16} />
            <span>Edit Profil</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const RecipeTabs: React.FC<RecipeTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabClass = (tabName: Tab) =>
    `relative flex items-center gap-2 py-3 px-2 font-semibold transition-colors duration-300 ${activeTab === tabName
      ? "text-primary-600"
      : "text-text-muted hover:text-text-secondary"
    }`;

  return (
    <div className="border-b border-primary-100 mb-8">
      <div className="flex gap-6 md:gap-10">
        {(['recipes', 'saved'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={tabClass(tab)}>
            {tab === 'recipes' ? <BookOpen className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            {tab === 'recipes' ? 'Resep Saya' : 'Resep Disimpan'}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-px left-0 right-0 h-0.5 bg-primary-500 rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function ProfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"recipes" | "saved">("recipes");

  const handleDeleteSuccess = (id: string) => {
    setMyRecipes(p => p.filter(r => r.id !== id));
    setSavedRecipes(p => p.filter(r => r.id !== id));
  };

  useEffect(() => {
    if (status === "unauthenticated") return router.push("/login");
    if (status !== "authenticated") return;

    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const [myRes, savedRes] = await Promise.all([
          fetch("/api/profil/resep"),
          fetch("/api/profil/resep-tersimpan")
        ]);
        const [myData, savedData] = await Promise.all([
          myRes.ok ? myRes.json() : [],
          savedRes.ok ? savedRes.json() : []
        ]);
        setMyRecipes(myData || []);
        setSavedRecipes(savedData || []);
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [status, router]);

  const savedRecipeIds = useMemo(() => new Set(savedRecipes.map(r => r.id)), [savedRecipes]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  const renderRecipes = (recipes: Recipe[], isSavedTab: boolean) => (
    recipes.length > 0 ? (
      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onDeleteSuccess={activeTab === 'recipes' ? handleDeleteSuccess : undefined}
            isInitiallySaved={savedRecipeIds.has(recipe.id)}
            viewMode="grid"
          />
        ))}
      </motion.div>
    ) : (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 bg-white rounded-2xl border border-primary-50 max-w-lg mx-auto" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center">
          {isSavedTab ? <Bookmark className="w-8 h-8 text-primary-400" /> : <ChefHat className="w-8 h-8 text-primary-400" />}
        </div>
        <h3 className="font-heading text-2xl font-bold text-text mb-2">
          {isSavedTab ? "Belum Ada Resep Disimpan" : "Belum Ada Resep Dibuat"}
        </h3>
        <p className="text-text-secondary text-sm mb-6">
          {isSavedTab ? "Jelajahi resep dan klik ikon simpan untuk menyimpannya di sini." : "Ayo mulai bagikan karya kuliner Anda ke komunitas!"}
        </p>
        <Link href={isSavedTab ? "/resep" : "/tambah-resep"} className="btn btn-primary rounded-xl px-6 py-3">
          {isSavedTab ? "Jelajahi Resep" : <><PlusCircle className="w-4 h-4" /> Buat Resep Baru</>}
        </Link>
      </motion.div>
    )
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute inset-0 bg-nature-gradient" />
      <div className="absolute inset-0 leaf-dots opacity-20" />

      <main className="grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <ProfileHeaderCard session={session} myRecipesLength={myRecipes.length} savedRecipesLength={savedRecipes.length} />
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <RecipeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "recipes" && (
            <button
              onClick={() => router.push("/tambah-resep")}
              className="hidden sm:flex items-center justify-center w-12 h-12 bg-primary-500 text-white rounded-xl shadow-md hover:bg-primary-600 hover:shadow-lg transition-all active:scale-95 group"
            >
              <PlusCircle className="w-6 h-6 transition-transform group-hover:rotate-90" />
            </button>
          )}
        </div>

        <div className="min-h-[300px]">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(3)].map((_, i) => <RecipeCardSkeleton key={i} />)}
            </div>
          ) : (
            activeTab === 'saved' ? renderRecipes(savedRecipes, true) : renderRecipes(myRecipes, false)
          )}
        </div>
      </main>
    </div>
  );
}