import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ShareButtons from '@/app/components/ShareButtons';
import IngredientsChecklist from '@/app/components/IngredientsChecklist';
import InstructionsSteps from '@/app/components/InstructionsSteps';
import { ChefHat, Calendar, Flame, BookOpen, ArrowLeft } from 'lucide-react';

interface Recipe {
  id: string; title: string; description: string; ingredients: string[];
  instructions: string; imageUrl: string;
  difficulty: 'MUDAH' | 'SEDANG' | 'SULIT';
  category: string;
  author: { name: string; email?: string; } | null;
  createdAt?: string;
}

type ParamsLike = { id: string } | Promise<{ id: string }>;
interface PageProps { params: ParamsLike; }

function safeImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  return url.trimEnd();
}

const formatDate = (dateString?: string): string =>
  dateString ? new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

function getDifficultyInfo(difficulty: string) {
  const map: Record<string, { label: string; class: string }> = {
    MUDAH: { label: 'Mudah', class: 'bg-green-50 text-green-700 border border-green-200/60' },
    SEDANG: { label: 'Sedang', class: 'bg-amber-50 text-amber-700 border border-amber-200/60' },
    SULIT: { label: 'Sulit', class: 'bg-red-50 text-red-700 border border-red-200/60' },
  };
  return map[difficulty] || map.MUDAH;
}

async function getRecipeById(id?: string): Promise<Recipe | null> {
  if (!id || typeof id !== 'string') return null;
  const { data, error } = await supabase
    .from('Recipe').select('*, author:User!authorId(*)').eq('id', id.trim()).single();
  if (error) return null;
  return data as Recipe;
}

export default async function RecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(id);
  if (!recipe) notFound();

  const diffInfo = getDifficultyInfo(recipe.difficulty);
  const imageUrl = safeImageUrl(recipe.imageUrl);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow">
        {/* Hero Banner */}
        <section className="relative h-[380px] md:h-[460px] lg:h-[520px] overflow-hidden">
          <div className="absolute inset-0">
            {imageUrl ? (
              <Image src={imageUrl} alt={recipe.title} className="object-cover" fill unoptimized quality={100} sizes="100vw" priority />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-primary-200 via-secondary-100 to-primary-100" />
            )}
            <div className="absolute inset-0 bg-hero-overlay" />
            <div className="absolute inset-0 grain-overlay" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
              <Link href="/resep" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-5 transition-all group text-sm">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Kembali ke Resep
              </Link>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${diffInfo.class}`}>{diffInfo.label}</span>
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 text-white/80 backdrop-blur-sm border border-white/15">
                  {recipe.category.replace(/_/g, ' ')}
                </span>
              </div>

              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl text-white mb-5 leading-tight max-w-3xl font-bold tracking-tight">
                {recipe.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/20">
                    {recipe.author?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <span className="font-medium text-white/85">{recipe.author?.name || 'Anonim'}</span>
                </span>
                {recipe.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(recipe.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-10 md:py-16 relative">
          <div className="absolute inset-0 bg-nature-gradient" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {recipe.description && (
              <div className="bg-white rounded-2xl p-6 md:p-8 mb-8 border border-primary-50"
                style={{ boxShadow: 'var(--shadow-sm)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-primary-500" />
                  <h2 className="font-heading text-xl text-text">Tentang Resep Ini</h2>
                </div>
                <p className="text-text-secondary text-base md:text-lg leading-relaxed">{recipe.description}</p>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-7">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 border border-primary-50 sticky top-20"
                  style={{ boxShadow: 'var(--shadow-sm)' }}>
                  <div className="flex items-center gap-2 mb-5">
                    <ChefHat className="w-5 h-5 text-primary-500" />
                    <h2 className="font-heading text-xl text-text">Bahan-bahan</h2>
                  </div>
                  <IngredientsChecklist ingredients={recipe.ingredients} />
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-primary-50"
                  style={{ boxShadow: 'var(--shadow-sm)' }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Flame className="w-5 h-5 text-accent-500" />
                    <h2 className="font-heading text-xl text-text">Cara Memasak</h2>
                  </div>
                  <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-text">
                    <InstructionsSteps instructions={recipe.instructions} />
                  </div>
                </div>

                <div className="mt-7 p-5 bg-white rounded-2xl border border-primary-50 flex flex-col sm:flex-row items-center justify-between gap-4"
                  style={{ boxShadow: 'var(--shadow-xs)' }}>
                  <ShareButtons title={recipe.title} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}