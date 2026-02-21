"use client";

import { supabase } from '@/lib/supabaseClient';
import { useSession } from 'next-auth/react';
import Link from "next/link";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import RecipeCard from "./components/RecipeCard";
import Stats from "./components/Stats";
import { Sparkles, Plus, ChefHat, Loader2, ArrowRight, Flame, BookOpen, Users } from "lucide-react";
import TestimonialCard from './components/TestimonialCard';
import { useEffect, useState, useRef } from 'react';
import { Recipe } from '@/app/types/Recipe';

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

function HeroSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={heroRef} className="relative min-h-[88vh] flex items-center justify-center overflow-hidden -mt-16 md:-mt-[68px]">
      {/* Parallax BG */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 scale-110">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/rainforest-cruises/images/c_fill,g_auto,f_auto,q_auto:best,w_2000/v1622207103/Indonesian-Food-Main/Indonesian-Food-Main.jpg')`,
          }}
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 z-1 bg-hero-overlay" />
      <div className="absolute inset-0 z-2 grain-overlay" />

      {/* Floating particles */}
      <motion.div
        animate={{ y: [-6, 6, -6], rotate: [0, 4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[18%] left-[8%] w-3 h-3 rounded-full bg-accent-400/30 blur-[1px] z-3"
      />
      <motion.div
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-[28%] right-[12%] w-4 h-4 rounded-full bg-secondary-400/20 blur-[1px] z-3"
      />
      <motion.div
        animate={{ y: [-5, 10, -5], x: [-3, 3, -3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[25%] left-[18%] w-2.5 h-2.5 rounded-full bg-primary-300/30 z-3"
      />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center pt-16"
      >
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-7">
          <motion.div variants={fadeUp} className="flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-accent-400 animate-pulse-soft" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-white/85">
                Pusat Resep Terpercaya Nusantara
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-heading  text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-black leading-none tracking-tight"
          >
            Masak Lezat
            <br />
            <span className="relative inline-block">
              Setiap Hari
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-1 md:bottom-2 left-0 right-0 h-2.5 md:h-3.5 bg-primary-500/30 origin-left rounded-sm -z-1"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg md:text-xl text-white/75 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Temukan ribuan resep autentik Indonesia yang telah diuji oleh komunitas.
            Dari dapur rumahan menuju hidangan istimewa.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-3"
          >
            <Link
              href="/tambah-resep"
              className="group btn btn-primary px-8 py-4 rounded-2xl text-base hover:shadow-[0_0_25px_rgba(46,139,87,0.35)] transition-all duration-300"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
              Bagikan Resepmu
            </Link>
            <Link
              href="/resep"
              className="btn btn-white px-8 py-4 rounded-2xl text-base"
            >
              Jelajahi Rasa
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function WhySection() {
  const features = [
    { icon: Flame, title: "Resep Autentik", desc: "Langsung dari dapur-dapur rumahan di seluruh Nusantara." },
    { icon: BookOpen, title: "Langkah Jelas", desc: "Instruksi detail yang mudah diikuti, bahkan untuk pemula." },
    { icon: Users, title: "Komunitas Aktif", desc: "Bergabung dengan pecinta masakan Indonesia lainnya." },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-nature-gradient" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary-100/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-secondary-100/20 rounded-full blur-[90px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-500 mb-3 block">
            Mengapa RecipeShare?
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-text font-bold">
            Lebih dari sekadar resep
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-7 rounded-2xl bg-white border border-primary-50 hover:border-primary-200/70 card-lift relative overflow-hidden"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 right-0 w-px h-10 bg-linear-to-b from-primary-300/40 to-transparent" />
                <div className="absolute top-0 right-0 h-px w-10 bg-linear-to-l from-primary-300/40 to-transparent" />
              </div>

              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-500">
                <f.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-heading text-xl text-text mb-2 font-bold">{f.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: session } = useSession();
  const [latestRecipes, setLatestRecipes] = useState<Recipe[]>([]);
  const [stats, setStats] = useState({ recipeCount: 0, userCount: 0, categoryCount: 4 });
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [recipesRes, recipeCountRes, usersRes] = await Promise.all([
        supabase.from('Recipe').select('*, author:User!authorId(*)').order('createdAt', { ascending: false }).limit(6),
        supabase.from('Recipe').select('*', { count: 'exact', head: true }),
        supabase.from('Recipe').select('authorId'),
      ]);

      if (recipesRes.data) setLatestRecipes(recipesRes.data as Recipe[]);
      const userCount = usersRes.data ? new Set(usersRes.data.map(u => u.authorId)).size : 0;
      setStats({ recipeCount: recipeCountRes.count ?? 0, userCount, categoryCount: 4 });

      if (session?.user?.email) {
        const { data: user } = await supabase.from('User').select('id').eq('email', session.user.email).single();
        if (user) {
          const { data: saved } = await supabase.from('SavedRecipe').select('recipeId').eq('userId', user.id);
          if (saved) setSavedRecipeIds(new Set(saved.map(item => item.recipeId)));
        }
      }
      setIsLoading(false);
    }
    loadData();
  }, [session]);

  const testimonials = [
    { quote: "RecipeShare benar-benar mengubah cara saya memasak! Resep-resepnya sangat autentik.", name: "Sarah Amelia", role: "Ibu Rumah Tangga", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" },
    { quote: "Berkat RecipeShare, saya jadi bisa mencoba banyak resep simpel untuk anak kos.", name: "Budi Santoso", role: "Mahasiswa", imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80" },
    { quote: "Saya suka sekali bisa berbagi resep andalan keluarga di sini. Komunitasnya ramah!", name: "Dewi Lestari", role: "Pekerja Kantoran", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow">
        <HeroSection />
        <WhySection />
        <Stats {...stats} />

        {/* Latest Recipes */}
        <section className="py-20 md:py-28 relative">
          <div className="absolute inset-0 bg-surface-muted" />
          <div className="absolute inset-0 leaf-dots opacity-40" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12"
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-500 mb-3 block">
                  Baru Ditambahkan
                </span>
                <h2 className="font-heading text-3xl md:text-5xl text-text font-bold">Resep Terbaru</h2>
              </div>
              <Link href="/resep" className="group inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                Lihat Semua
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="animate-spin text-primary-500 mb-4" size={36} />
                <p className="text-text-muted text-sm">Memuat resep lezat...</p>
              </div>
            ) : latestRecipes.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-white rounded-2xl border border-primary-100 max-w-md mx-auto"
                style={{ boxShadow: 'var(--shadow-md)' }}>
                <ChefHat className="w-12 h-12 text-primary-400 mx-auto mb-4 animate-float" />
                <p className="mb-6 text-text-secondary">Belum ada resep. Jadilah yang pertama!</p>
                <Link href="/tambah-resep" className="btn btn-accent px-6 py-3 rounded-xl">
                  <Plus size={18} /> Tambah Resep Pertama
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
                {latestRecipes.map((recipe, i) => (
                  <motion.div key={recipe.id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}>
                    <RecipeCard recipe={recipe} isInitiallySaved={savedRecipeIds.has(recipe.id)} viewMode="grid" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-900 grain-overlay" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-secondary-600/8 rounded-full blur-[80px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="text-center mb-14">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-400 mb-3 block">Testimoni</span>
              <h2 className="font-heading text-3xl md:text-5xl text-white font-bold">Apa Kata Mereka?</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <TestimonialCard {...t} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-nature-gradient" />
          <div className="absolute inset-0 leaf-dots opacity-25" />

          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }} className="space-y-7">
              <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-text leading-tight font-bold">
                Siap berbagi
                <br />
                resep andalanmu?
              </h2>
              <p className="text-lg text-text-secondary max-w-lg mx-auto">
                Bergabunglah dengan komunitas pecinta kuliner Nusantara dan lestarikan warisan rasa Indonesia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link href="/tambah-resep" className="btn btn-primary px-8 py-4 rounded-2xl text-base">
                  <Plus className="w-5 h-5" /> Mulai Menulis Resep
                </Link>
                <Link href="/register" className="btn btn-ghost px-8 py-4 rounded-2xl text-base">
                  Buat Akun Gratis
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}