import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ShareButtons from '@/app/components/ShareButtons';
import IngredientsChecklist from '@/app/components/IngredientsChecklist';
import InstructionsSteps from '@/app/components/InstructionsSteps';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { ChefHat, Calendar, User, Flame, BookOpen, Tag, ArrowLeft, Award } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  imageUrl: string;
  difficulty: 'MUDAH' | 'SEDANG' | 'SULIT';
  category: 'MAKANAN_UTAMA' | 'KUE_DESSERT' | 'MINUMAN' | 'CAMILAN';
  author: { name: string; email?: string; } | null;
  createdAt?: string;
}

type ParamsLike = { id: string } | Promise<{ id: string }>;
interface PageProps { params: ParamsLike; }

const formatDate = (dateString?: string): string =>
  dateString
    ? new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

function getDifficultyInfo(difficulty: string) {
  const info = {
    MUDAH: { label: 'Mudah', color: 'bg-green-100 text-green-800 border border-green-200', icon: <Award className="w-4 h-4" /> },
    SEDANG: { label: 'Sedang', color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', icon: <Award className="w-4 h-4" /> },
    SULIT: { label: 'Sulit', color: 'bg-red-100 text-red-800 border border-red-200', icon: <Award className="w-4 h-4" /> }
  };
  return info[difficulty as keyof typeof info] || info.MUDAH;
}

function getCategoryInfo(category: string) {
  const info = {
    MAKANAN_UTAMA: { label: 'Makanan Utama', color: 'text-primary' },
    KUE_DESSERT: { label: 'Kue & Dessert', color: 'text-accent' },
    MINUMAN: { label: 'Minuman', color: 'text-secondary' },
    CAMILAN: { label: 'Camilan', color: 'text-primary' }
  };
  return info[category as keyof typeof info] || { label: category, color: 'text-gray-600' };
}

async function getRecipeById(id?: string): Promise<Recipe | null> {
  if (!id || typeof id !== 'string') return null;
  const { data, error } = await supabase
    .from('Recipe')
    .select('*, author:User!authorId(*)')
    .eq('id', id.trim())
    .single();

  if (error) return null;
  return data as Recipe;
}

export default async function RecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) notFound();

  const difficultyInfo = getDifficultyInfo(recipe.difficulty);
  const categoryInfo = getCategoryInfo(recipe.category);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <section className="relative h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            {recipe.imageUrl ? (
              <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #2E8B57 0%, #9ED5C5 100%)' }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
              <Link
                href="/resep"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-all duration-200 hover:translate-x-[-4px] group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Kembali ke Resep</span>
              </Link>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight tracking-tight">
                {recipe.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <span className="flex items-center gap-2 text-sm md:text-base">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{recipe.author?.name || 'Anonymous'}</span>
                </span>
                {recipe.createdAt && (
                  <span className="flex items-center gap-2 text-sm md:text-base">
                    <Calendar className="w-4 h-4" />
                    {formatDate(recipe.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  {difficultyInfo.icon}
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Tingkat</p>
                    <p className={`font-semibold text-sm ${difficultyInfo.color} px-2 py-0.5 rounded-full inline-block`}>
                      {difficultyInfo.label}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Kategori</p>
                    <p className={`font-semibold text-sm ${categoryInfo.color}`}>
                      {categoryInfo.label}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {recipe.description && (
              <div className="bg-white rounded-2xl p-6 md:p-8 mb-10 shadow-sm hover:shadow-md transition-all duration-300">
                <h2 className="font-heading text-2xl text-text mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Tentang Resep Ini
                </h2>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                  {recipe.description}
                </p>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24 hover:shadow-md transition-all duration-300">
                  <h2 className="font-heading text-2xl text-text mb-6 flex items-center gap-2">
                    <ChefHat className="w-6 h-6 text-primary" />
                    Bahan-bahan
                  </h2>
                  <div className="space-y-1">
                    <IngredientsChecklist ingredients={recipe.ingredients} />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <h2 className="font-heading text-2xl text-text mb-6 flex items-center gap-2">
                    <Flame className="w-6 h-6 text-primary" />
                    Cara Memasak
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <InstructionsSteps instructions={recipe.instructions} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-6 bg-white/50 rounded-xl">
                  <ShareButtons title={recipe.title} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}