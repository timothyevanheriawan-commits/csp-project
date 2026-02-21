"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ChefHat, Users, Sparkles, Heart, Search, Edit3, Share2, LucideIcon, ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

interface CardProps { icon: LucideIcon; title: string; description: string; }

const joinSteps: CardProps[] = [
  { icon: Search, title: '1. Temukan', description: 'Jelajahi ribuan resep otentik dari seluruh Indonesia, dari Sabang sampai Merauke.' },
  { icon: Edit3, title: '2. Ciptakan', description: 'Coba resep di dapur Anda sendiri, beri sentuhan pribadi, dan ciptakan mahakarya kuliner Anda.' },
  { icon: Share2, title: '3. Bagikan', description: 'Bagikan resep andalan keluarga atau kreasi baru Anda untuk menginspirasi komunitas.' }
];

const principles: CardProps[] = [
  { icon: ChefHat, title: 'Otentisitas', description: 'Kami menghargai resep asli yang diwariskan dari generasi ke generasi, lengkap dengan cerita di baliknya.' },
  { icon: Users, title: 'Komunitas', description: 'Platform yang dibangun oleh dan untuk komunitas pecinta kuliner yang suportif dan saling menginspirasi.' },
  { icon: Sparkles, title: 'Inovasi', description: 'Kami mendorong kreasi baru yang terinspirasi dari cita rasa tradisional, karena kuliner terus berkembang.' }
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Header */}
      <section className="relative pt-28 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-nature-gradient" />
        <div className="absolute inset-0 leaf-dots opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary-100/30 rounded-full blur-[100px]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
            <motion.div variants={fadeUp}>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-500 mb-4 block">
                Tentang Kami
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading text-4xl sm:text-5xl lg:text-6xl text-text leading-tight mb-6 font-bold">
              Menyatukan Rasa,{' '}
              <br className="hidden sm:block" />
              <span className="relative inline-block">
                Membagikan Cerita
                <span className="absolute bottom-1 md:bottom-2 left-0 right-0 h-2.5 md:h-3 bg-primary-200/50 rounded-sm -z-1" />
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
              RecipeShare lahir dari kecintaan terhadap kekayaan kuliner Nusantara.
              Kami percaya setiap resep memiliki cerita, dan setiap cerita layak untuk dibagikan dan dirayakan bersama.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-500 mb-4 block">
                Cerita Kami
              </span>
              <h2 className="font-heading text-3xl lg:text-4xl text-text mb-6 font-bold leading-snug">
                Sebuah Platform dari Hati untuk Pecinta Kuliner
              </h2>

              <div className="relative pl-6 mb-6 border-l-[3px] border-primary-400">
                <p className="text-text-secondary text-lg italic leading-relaxed">
                  &ldquo;Kami membayangkan sebuah ruang digital di mana resep warisan keluarga bisa hidup berdampingan
                  dengan kreasi modern, di mana setiap orang bisa menjadi koki, pencerita, dan penjaga tradisi rasa.&rdquo;
                </p>
                <p className="text-primary-600 font-semibold text-sm mt-3">— Sebastian A. Indrawan</p>
              </div>

              <p className="text-text-secondary leading-relaxed">
                Inilah semangat yang mendorong lahirnya RecipeShare.
                Kami ingin membangun jembatan antar generasi dan budaya melalui bahasa universal yaitu makanan.
              </p>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="order-1 lg:order-2 flex justify-center"
            >
              <div className="relative">
                {/* Decorative frame */}
                <div className="absolute -top-3 -right-3 w-full h-full rounded-2xl border-2 border-primary-200/40 z-0" />
                <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-primary-100/50 rounded-xl z-0" />

                <Image
                  src="https://images.pexels.com/photos/6019593/pexels-photo-6019593.jpeg"
                  alt="Pendiri RecipeShare"
                  width={450}
                  height={500}
                  className="relative z-10 rounded-2xl object-cover shadow-xl hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Steps */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-surface-muted" />
        <div className="absolute inset-0 leaf-dots opacity-30" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100/30 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-500 mb-3 block">
              Cara Bergabung
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl text-text mb-4 font-bold">
              Bergabung dalam Perjalanan Rasa
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Menjadi bagian dari komunitas kami sangatlah mudah. Cukup ikuti tiga langkah sederhana ini.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {joinSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-7 rounded-2xl bg-white border border-primary-50 hover:border-primary-200/60 card-lift text-center relative overflow-hidden"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-px h-10 bg-linear-to-b from-primary-300/40 to-transparent" />
                  <div className="absolute top-0 right-0 h-px w-10 bg-linear-to-l from-primary-300/40 to-transparent" />
                </div>

                <div className="mx-auto mb-5 w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-500">
                  <step.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-heading text-xl text-text mb-2 font-bold">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-white" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-500 mb-3 block">
              Nilai Kami
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl text-text font-bold">
              Prinsip yang Kami Pegang Teguh
            </h2>
          </motion.div>

          <div className="bg-white rounded-2xl p-8 md:p-12 border border-primary-50"
            style={{ boxShadow: 'var(--shadow-md)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {principles.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-4 w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                    <p.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-heading text-lg text-text mb-2 font-bold">{p.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{p.description}</p>

                  {/* Decorative line */}
                  <div className="mt-5 w-8 h-0.5 bg-linear-to-r from-primary-300 to-secondary-300 rounded-full" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-surface-muted" />
        <div className="absolute inset-0 leaf-dots opacity-20" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-2xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-primary-600 via-primary-500 to-secondary-500" />
              <div className="absolute inset-0 grain-overlay" />

              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/8" />
              <div className="absolute -bottom-12 -left-8 w-56 h-56 rounded-full bg-white/5" />
              <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-white/5" />

              <div className="relative z-10 p-10 md:p-14 text-center">
                <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Heart className="w-8 h-8 text-white" />
                </div>

                <h2 className="font-heading text-3xl md:text-4xl text-white mb-4 font-bold">
                  Jadilah Bagian dari Cerita Kami
                </h2>
                <p className="text-white/75 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                  Punya resep andalan keluarga? Atau baru saja mencoba resep baru yang luar biasa?
                  Bagikan kreasimu dan jadilah inspirasi bagi pecinta kuliner lainnya!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/tambah-resep"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-bold rounded-xl shadow-lg hover:bg-primary-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    <Edit3 className="w-4 h-4" />
                    Bagikan Resep Sekarang
                  </Link>
                  <Link
                    href="/resep"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/12 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:border-white/35 active:scale-[0.98] transition-all duration-300"
                  >
                    Jelajahi Resep
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}