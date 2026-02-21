"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Eye, EyeOff, ChefHat, ArrowLeft, AlertCircle } from "lucide-react";
import NextImage from "next/image";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setIsLoading(true);
    try {
      const result = await signIn("credentials", { redirect: false, email, password });
      if (result?.error) setError("Email atau password salah. Silakan coba lagi.");
      else router.push("/");
    } catch { setError("Terjadi kesalahan. Silakan coba lagi."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="absolute inset-0 bg-nature-gradient" />
        <div className="absolute inset-0 leaf-dots opacity-25" />

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="max-w-md w-full relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-600 transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /><span className="text-sm font-medium">Kembali</span>
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-5">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform duration-300">
                <ChefHat className="w-7 h-7 text-primary-600" />
              </div>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl text-text mb-2 font-bold">Selamat Datang Kembali</h1>
            <p className="text-text-secondary">Masuk untuk mulai berbagi resep favoritmu</p>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-primary-50" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-text mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-11" placeholder="nama@email.com" />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-text mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password}
                    onChange={(e) => setPassword(e.target.value)} className="input-field pl-11 pr-11" placeholder="••••••••" />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span className="text-sm">{error}</span>
                </motion.div>
              )}

              <button type="submit" disabled={isLoading}
                className="w-full btn btn-primary py-3.5 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><LogIn className="w-4 h-4" />Masuk</>}
              </button>
            </form>

            <div className="mt-6 text-center pt-5 border-t border-primary-50">
              <p className="text-text-secondary text-sm">
                Belum punya akun?{" "}
                <Link href="/register" className="font-bold text-primary-600 hover:text-primary-700 link-grow">Daftar sekarang!</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
        <NextImage src="https://images.pexels.com/photos/11912814/pexels-photo-11912814.jpeg" alt="Delicious Food" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 z-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-7 border border-white/15">
            <p className="font-heading text-xl text-white leading-snug mb-3">
              &ldquo;Temukan ribuan resep autentik dari komunitas pecinta kuliner Nusantara.&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-white/15" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-300">RecipeShare</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}