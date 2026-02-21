"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, ChefHat, UserPlus, ArrowRight, ArrowLeft, Check, AlertCircle } from "lucide-react";
import NextImage from "next/image";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const passwordRequirements = [
    { text: "Minimal 6 karakter", met: password.length >= 6 },
    { text: "Mengandung huruf", met: /[a-zA-Z]/.test(password) },
    { text: "Mengandung angka", met: /\d/.test(password) },
  ];
  const allPasswordReqsMet = passwordRequirements.every(req => req.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (password !== confirmPassword) { setError("Konfirmasi password tidak cocok."); return; }
    if (!allPasswordReqsMet) { setError("Password belum memenuhi semua persyaratan."); return; }
    if (!agreedToTerms) { setError("Anda harus menyetujui Syarat & Ketentuan."); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) router.push("/login?status=success");
      else { const data = await res.json(); setError(data.message || "Pendaftaran gagal."); }
    } catch { setError("Terjadi kesalahan. Periksa koneksi internet Anda."); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
        <NextImage src="https://images.pexels.com/photos/8570300/pexels-photo-8570300.jpeg" alt="Cooking" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-l from-black/30 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 z-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-7 border border-white/15">
            <p className="font-heading text-xl text-white leading-snug mb-3">
              &ldquo;Bergabunglah dengan ribuan pecinta kuliner dan bagikan resep terbaikmu.&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-white/15" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-300">RecipeShare</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="absolute inset-0 bg-nature-gradient" />
        <div className="absolute inset-0 leaf-dots opacity-25" />

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="max-w-md w-full relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-600 transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /><span className="text-sm font-medium">Kembali</span>
          </Link>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform">
                <ChefHat className="w-7 h-7 text-primary-600" />
              </div>
            </div>
            <h1 className="font-heading text-3xl text-text mb-2 font-bold">Buat Akun Baru</h1>
            <p className="text-text-secondary">Daftar gratis dan mari mulai memasak!</p>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-primary-50" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-text mb-2">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="input-field pl-11" placeholder="John Doe" />
                </div>
              </div>
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
                  <input id="password" type={showPassword ? "text" : "password"} required value={password}
                    onChange={(e) => setPassword(e.target.value)} className="input-field pl-11 pr-11" placeholder="••••••••" />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1">
                  {passwordRequirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${req.met ? "bg-primary-500" : "bg-gray-200"
                        }`}><Check className={`w-2.5 h-2.5 ${req.met ? "text-white" : "text-gray-400"}`} /></div>
                      <span className={req.met ? "text-primary-700" : "text-text-muted"}>{req.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text mb-2">Konfirmasi Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} className="input-field pl-11 pr-11" placeholder="••••••••" />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 mt-0.5 rounded border-gray-300 text-primary-500 focus:ring-primary-400 cursor-pointer" />
                  <span className="text-sm text-text-secondary">
                    Saya setuju dengan <Link href="/terms" className="font-semibold text-primary-600 hover:underline">Syarat & Ketentuan</Link>
                  </span>
                </label>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span className="text-sm">{error}</span>
                </motion.div>
              )}

              <button type="submit" disabled={isSubmitting}
                className="w-full btn btn-primary py-3.5 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed mt-1">
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><UserPlus className="w-4 h-4" />Daftar Sekarang</>}
              </button>
            </form>

            <div className="mt-6 text-center pt-5 border-t border-primary-50">
              <p className="text-text-secondary text-sm">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 link-grow group">
                  Masuk di sini <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}