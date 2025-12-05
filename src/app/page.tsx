import { supabase } from '@/lib/supabaseClient';
import { getServerSession } from 'next-auth/next';
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RecipeCard from "./components/RecipeCard";
import Stats from "./components/Stats";
import { ChefHat, Plus, Sparkles } from "lucide-react";
import { Recipe } from '@/types/recipe';
import TestimonialCard from './components/TestimonialCard';
import { authOptions } from './api/auth/[...nextauth]/route';


async function getStats() {
  const [{ count: recipeCount, error: recipeError }, { data: users, error: userError }] = await Promise.all([
    supabase.from('Recipe').select('*', { count: 'exact', head: true }),
    supabase.from('Recipe').select('authorId'),
  ]);
  const userCount = users ? new Set(users.map(u => u.authorId)).size : 0;
  if (recipeError || userError) console.error("Error fetching stats:", recipeError || userError);
  return { recipeCount: recipeCount ?? 0, userCount, categoryCount: 4 };
}

async function getLatestRecipes(limit = 6) {
  const { data: recipes, error } = await supabase.from('Recipe').select('*, author:User!authorId(*)').order('createdAt', { ascending: false }).limit(limit);
  if (error) { console.error("Error fetching latest recipes:", error.message); return []; }
  return recipes;
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [latestRecipes, stats] = await Promise.all([
    getLatestRecipes(),
    getStats()
  ]);
  const testimonials = [
    { quote: "RecipeShare benar-benar mengubah cara saya memasak! Sangat mudah menemukan resep tradisional yang sudah lama saya cari. Komunitasnya juga sangat membantu.", name: "Sarah Amelia", role: "Ibu Rumah Tangga", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80" },
    { quote: "Sebagai seorang mahasiswa, saya sering bingung mau masak apa. Berkat RecipeShare, saya jadi bisa mencoba banyak resep simpel dan hemat. Fitur kategorinya juara!", name: "Budi Santoso", role: "Mahasiswa", imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" },
    { quote: "Saya suka sekali bisa berbagi resep andalan keluarga di sini. Platformnya bersih dan mudah digunakan. Senang bisa menjadi bagian dari komunitas kuliner ini.", name: "Dewi Lestari", role: "Pekerja Kantoran", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" }
  ];
  let savedRecipeIds = new Set<string>();
  if (session?.user?.email) {
    const { data: user } = await supabase.from('User').select('id').eq('email', session.user.email).single();
    if (user) {
      const { data: saved } = await supabase.from('SavedRecipe').select('recipeId').eq('userId', user.id);
      if (saved) {
        savedRecipeIds = new Set(saved.map(item => item.recipeId));
      }
    }
  }
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        <section className="relative bg-gradient-to-br from-secondary-100 via-background to-accent-50 py-20 overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/rainforest-cruises/images/c_fill,g_auto,f_auto,q_auto:best,w_2000/v1622207103/Indonesian-Food-Main/Indonesian-Food-Main.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>

            <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/30 via-black/40 to-accent-900/30"></div>
          </div>

          <div className="absolute top-10 left-10 w-20 h-20 bg-accent-200 rounded-full opacity-30 animate-pulse z-10"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary-300 rounded-full opacity-20 animate-pulse delay-1000 z-10"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="text-center">
              <h1 className="font-heading font-semibold text-5xl md:text-6xl lg:text-7xl text-white mb-4 leading-tight drop-shadow-lg">
                Koleksi Resep Nusantara
              </h1>
              <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-10 font-body drop-shadow">
                Temukan inspirasi masakan dari seluruh penjuru Indonesia. Dari
                yang tradisional hingga modern, semua ada di sini!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/tambah-resep"
                  className="btn-primary text-gray-100 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Plus className="w-5 h-5" />
                  Bagikan Resepmu
                </Link>
                <Link
                  href="/resep"
                  className="bg-white/90 backdrop-blur text-text hover:bg-white transition-all inline-flex items-center justify-center px-5 py-3 rounded-lg shadow-lg hover:shadow-xl"
                >
                  Jelajahi Resep
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl text-text mb-4">
                Apa Kata Mereka?
              </h2>
              <p className="text-text-light text-lg max-w-2xl mx-auto">
                Dengarkan cerita dari para pengguna setia RecipeShare yang telah menemukan
                inspirasi di dapur mereka.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  quote={testimonial.quote}
                  name={testimonial.name}
                  role={testimonial.role}
                  imageUrl={testimonial.imageUrl}
                />
              ))}
            </div>
          </div>
        </section>

        <Stats
          recipeCount={stats.recipeCount}
          userCount={stats.userCount}
          categoryCount={stats.categoryCount}
        />

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl text-text mb-4">
                Resep Terbaru
              </h2>
              <p className="text-text-light text-lg">
                Kreasi terbaru dari komunitas pecinta kuliner
              </p>
            </div>
            {latestRecipes.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-soft p-12 max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-secondary-100 rounded-full flex items-center justify-center">
                    <ChefHat className="w-12 h-12 text-primary-500" />
                  </div>
                  <h3 className="font-heading text-2xl text-text mb-3">
                    Belum Ada Resep
                  </h3>
                  <p className="text-text-light mb-8">
                    Jadilah yang pertama membagikan resep kesukaanmu!
                  </p>
                  <Link
                    href="/tambah-resep"
                    className="btn-accent inline-flex items-center gap-2 py-2 px-4 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Resep Pertama
                  </Link>
                </div>
              </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {latestRecipes.map((recipe) => {
                    // 4. Periksa apakah resep ini ada di dalam daftar simpanan
                    const isSaved = savedRecipeIds.has(recipe.id);
                    return (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        isInitiallySaved={isSaved} // <-- Kirim statusnya sebagai prop
                      />
                    );
                  })}
                </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}