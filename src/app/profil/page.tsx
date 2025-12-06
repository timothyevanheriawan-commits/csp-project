"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import RecipeCard from "../components/RecipeCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";
import EmptyState from "../components/EmptyState";
import { User, Mail, BookOpen, Bookmark, PlusCircle } from "lucide-react";
import { Recipe } from '@/app/types/Recipe';
import { Session } from 'next-auth';

type Tab = 'recipes' | 'saved';

interface ProfileHeaderCardProps {
  session: Session;
  myRecipesLength: number;
  savedRecipesLength: number;
}
interface RecipeTabsProps {
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ session, myRecipesLength, savedRecipesLength }) => {
  const { user } = session;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 transform hover:shadow-2xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-full bg-green-100 flex items-center justify-center text-[#006400] font-bold text-5xl shadow-md overflow-hidden">
          {user.image ? (
            <Image src={user.image} alt="Avatar" width={128} height={128} className="object-cover w-full h-full" priority />
          ) : (
            user.name?.charAt(0).toUpperCase() || <User size={48} className="text-[#006400]" />
          )}
        </div>
        <div className="w-full">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="font-heading text-3xl md:text-4xl text-text mb-2">{user.name}</h1>
            <div className="flex items-center gap-2 text-text-light justify-center md:justify-start mb-2 text-sm">
              <Mail className="w-4 h-4 text-gray-500" /><span>{user.email}</span>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-around md:justify-start md:gap-12">
            <div className="text-center">
              <p className="text-3xl font-extrabold ">{myRecipesLength}</p>
              <p className="text-sm text-text-light">Resep Dibuat</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-text">{savedRecipesLength}</p>
              <p className="text-sm text-text-light">Resep Disimpan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecipeTabs: React.FC<RecipeTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabClass = (tabName: Tab) =>
    `flex items-center gap-2 py-3 px-1 border-b-2 font-semibold transition-colors ${activeTab === tabName
      ? "border-[#2E8B57] text-[#2E8B57]"
      : "border-transparent text-gray-500 hover:text-gray-800"
    }`;  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-4 md:gap-8">
        <button onClick={() => setActiveTab("recipes")} className={tabClass("recipes")}>
          <BookOpen className="w-5 h-5" />Resep Saya
        </button>
        <button onClick={() => setActiveTab("saved")} className={tabClass("saved")}>
          <Bookmark className="w-5 h-5" />Resep Disimpan
        </button>
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
        console.error("Terjadi kesalahan saat mengambil data profil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [status, router]);

  const savedRecipeIds = useMemo(() => new Set(savedRecipes.map(r => r.id)), [savedRecipes]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6FFF9]">
        <div className="w-16 h-16 border-4 border-[#2E8B57] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderRecipes = (recipes: Recipe[], isSavedTab: boolean) => (
    recipes.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((r) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            onDeleteSuccess={isSavedTab ? undefined : handleDeleteSuccess}
            isInitiallySaved={isSavedTab || savedRecipeIds.has(r.id)}
            viewMode="grid"
          />
        ))}
      </div>
    ) : (
      <EmptyState
        icon={isSavedTab ? Bookmark : PlusCircle}
        title={isSavedTab ? "Anda Belum Menyimpan Resep Apapun" : "Belum Ada Resep Dibuat"}
        description={isSavedTab ? "Jelajahi resep dan klik ikon simpan untuk menambahkannya di sini." : "Anda belum membuat resep apapun. Ayo bagikan resep lezat pertama Anda!"}
        buttonText={isSavedTab ? "Jelajahi Resep" : "+ Buat Resep Baru"}
        buttonHref={isSavedTab ? "/resep" : "/tambah-resep"}
      />
    )
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FFF9] font-['Inter']">
      <Navbar />
      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <ProfileHeaderCard session={session} myRecipesLength={myRecipes.length} savedRecipesLength={savedRecipes.length} />
        <div className="flex justify-between items-center mb-8">
          <RecipeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "recipes" && (
            <button
              onClick={() => router.push("/tambah-resep")}
              className="flex items-center gap-2 px-4 py-2 bg-[#2E8B57] text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out whitespace-nowrap"
            >
              + Tambah Resep
            </button>
          )}
        </div>
        <div className="min-h-[300px]">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => <RecipeCardSkeleton key={i} />)}
            </div>
          ) : (
            activeTab === 'saved' ? renderRecipes(savedRecipes, true) : renderRecipes(myRecipes, false)
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}