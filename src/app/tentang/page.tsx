import Image from 'next/image';
import Link from 'next/link';
import { ChefHat, Users, Sparkles, Heart, Search, Edit3, Share2, LucideIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface CardProps { icon: LucideIcon; title: string; description: string; }

const joinSteps: CardProps[] = [
  { icon: Search, title: '1. Temukan', description: 'Jelajahi ribuan resep otentik dari seluruh Indonesia, dari Sabang sampai Merauke.' },
  { icon: Edit3, title: '2. Ciptakan', description: 'Coba resep di dapur Anda sendiri, beri sentuhan pribadi, dan ciptakan mahakarya kuliner Anda.' },
  { icon: Share2, title: '3. Bagikan', description: 'Bagikan resep andalan keluarga atau kreasi baru Anda untuk menginspirasi komunitas.' }
];

const principles: CardProps[] = [
  { icon: ChefHat, title: 'Otentisitas', description: 'Kami menghargai resep asli yang diwariskan dari generasi ke generasi, lengkap dengan cerita di baliknya.' },
  { icon: Users, title: 'Komunitas', description: 'Kami adalah platform yang dibangun oleh dan untuk komunitas pecinta kuliner yang suportif dan saling menginspirasi.' },
  { icon: Sparkles, title: 'Inovasi', description: 'Kami mendorong kreasi baru yang terinspirasi dari cita rasa tradisional, karena kuliner terus berkembang.' }
];

const FeatureCard = ({ icon: Icon, title, description }: CardProps) => (
  <div className="rounded-lg border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
      <Icon size={32} />
    </div>
    <h3 className="mb-2 text-xl font-semibold text-slate-900">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const PrincipleCard = ({ icon: Icon, title, description }: CardProps) => (
  <div className="flex flex-col items-center text-center">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
      <Icon size={24} />
    </div>
    <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

export default function AboutPage() {
  return (
    <div className="bg-slate-50 text-slate-800">
      <Navbar />
      <header className="relative sm:pt-20 sm:pb-20 overflow-hidden" style={{ backgroundColor: "#eaf8ee" }}>
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="a" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(2) rotate(45)">
                <rect x="0" y="0" width="100%" height="100%" fill="none" />
                <path d="M10-10l20 20m0-40l-20 20" strokeWidth="1" stroke="#a7f3d0" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#a)" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mt-4 text-4xl leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Menyatukan Rasa, <br className="hidden sm:block" />
            Membagikan Cerita.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            RecipeShare lahir dari kecintaan terhadap kekayaan kuliner Nusantara.
            Kami percaya setiap resep memiliki cerita, dan setiap cerita layak untuk dibagikan dan dirayakan bersama.
          </p>
        </div>
      </header>

      <main>
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="order-2 lg:order-1">
                <h2 className="mb-6 text-3xl text-slate-900 lg:text-4xl">
                  Sebuah Platform dari Hati untuk Pecinta Kuliner
                </h2>
                <blockquote className="mb-6 border-l-4 border-green-500 pl-6 text-lg italic text-slate-700">
                  &ldquo;Kami membayangkan sebuah ruang digital di mana resep warisan keluarga bisa hidup berdampingan
                  dengan kreasi modern, di mana setiap orang bisa menjadi koki, pencerita, dan penjaga tradisi rasa.
                  - Sebastian A. Indrawan&ldquo;
                </blockquote>
                <p className="text-slate-600">
                  Inilah semangat yang mendorong lahirnya RecipeShare.
                  Kami ingin membangun jembatan antar generasi dan budaya melalui bahasa universal yaitu makanan.
                </p>
              </div>
              <div className="order-1 flex justify-center lg:order-2">
                <Image
                  src="https://images.pexels.com/photos/6019593/pexels-photo-6019593.jpeg"
                  alt="Pendiri RecipeShare"
                  width={450}
                  height={500}
                  className="rounded-xl object-cover shadow-2xl transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: "#eaf8ee" }} className="py-20 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl text-slate-900 lg:text-4xl">
                Bergabung dalam Perjalanan Rasa
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                Menjadi bagian dari komunitas kami sangatlah mudah. Cukup ikuti tiga langkah sederhana ini.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
              {joinSteps.map((step, i) => <FeatureCard key={i} {...step} />)}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl bg-white p-8 shadow-lg sm:p-12">
              <h2 className="mb-12 text-center text-3xl text-slate-900">
                Prinsip yang Kami Pegang Teguh
              </h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
                {principles.map((p, i) => <PrincipleCard key={i} {...p} />)}
              </div>
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: "#eaf8ee" }} className="py-20 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-green-600 to-emerald-500 p-12 text-center">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/10" />
              <div className="relative">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                  <Heart className="text-white" size={32} />
                </div>
                <h2 className="mb-4 text-3xl text-white">
                  Jadilah Bagian dari Cerita Kami
                </h2>
                <p className="mx-auto mb-8 max-w-xl text-green-100">
                  Punya resep andalan keluarga? Atau baru saja mencoba resep baru yang luar biasa?
                  Bagikan kreasimu dan jadilah inspirasi bagi jutaan pecinta kuliner lainnya!
                </p>
                <Link
                  href="/tambah-resep"
                  className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-green-600 shadow-lg transition-all hover:scale-105 hover:bg-gray-100"
                >
                  Bagikan Resep Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}