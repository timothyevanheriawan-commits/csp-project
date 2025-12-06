"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ChefHat,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle
} from "lucide-react";
import Image from "next/image";

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
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (!allPasswordReqsMet) {
      setError("Password belum memenuhi semua persyaratan.");
      return;
    }
    if (!agreedToTerms) {
      setError("Anda harus menyetujui Syarat & Ketentuan.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/login?status=success");
      } else {
        const data = await res.json();
        setError(data.message || "Pendaftaran gagal. Email mungkin sudah digunakan.");
      }
    } catch (err: unknown) { // === PERBAIKAN TIPE DI SINI ===
      if (err instanceof Error) {
        setError(`Terjadi kesalahan: ${err.message}`);
      } else {
        setError("Terjadi kesalahan. Periksa koneksi internet Anda.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F6FFF9]">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0" />
        <Image
          src="https://images.pexels.com/photos/8570300/pexels-photo-8570300.jpeg"
          alt="Cooking Preparation"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium
                     text-white/90 hover:text-white transition-colors group w-fit"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Beranda
          </Link>

          <div></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">

        <div className="max-w-md w-full">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center ">
              <div className="p-4 bg-[#9ED5C5]/20 rounded-2xl 
                            transform transition-transform duration-300 hover:scale-105">
                <ChefHat className="w-10 h-10 text-[#2E8B57]" />
              </div>
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="font-['Playfair_Display'] text-4xl   mb-3">
              Buat Akun Baru
            </h1>
            <p className="text-gray-600 font-['Inter']">
              Daftar gratis dan mari mulai memasak!
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 
                        transform transition-all duration-300 hover:shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold  mb-2 font-['Inter']"
                >
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input id="name" name="name" type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl
                                  "
                    placeholder="John Doe" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold  mb-2 font-['Inter']"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input id="email" name="email" type="email" autoComplete="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl
                                  "
                    placeholder="nama@email.com" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold  mb-2 font-['Inter']"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input id="password" name="password" type={showPassword ? "text" : "password"} required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl
                                  "
                    placeholder="••••••••" />
                  <button type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs transition-colors duration-300">
                      <Check className={`w-3.5 h-3.5 shrink-0 ${req.met ? "text-green-500" : "text-gray-300"}`} />
                      <span className={req.met ? "text-green-600" : "text-gray-500"}>{req.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold  mb-2 font-['Inter']"
                >
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl
                                  "
                    placeholder="••••••••" />
                  <button type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-start">
                  <input id="terms" name="terms" type="checkbox" required
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 mt-0.5 text-[#2E8B57] rounded border-gray-300
                                  focus:ring-2 focus:ring-[#2E8B57] cursor-pointer shrink-0" />
                  <label htmlFor="terms" className="ml-3 block text-sm text-gray-600 font-['Inter']">
                    Saya setuju dengan{" "}
                    <Link href="/terms" className="font-medium text-[#2E8B57] hover:underline">
                      Syarat & Ketentuan
                    </Link>
                  </label>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 bg-red-50 border-2 border-red-200 
                              text-red-700 px-4 py-3 rounded-xl animate-fadeIn">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <span className="text-sm font-['Inter']">{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2E8B57] hover:bg-[#236B43] text-white font-semibold 
                           py-3 px-6 rounded-xl transition-all duration-200 
                           transform hover:scale-[1.02] active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 font-['Inter']
                           shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-3 border-white border-t-transparent 
                                  rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Daftar Sekarang
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center pt-6 border-t-2 border-gray-100">
              <p className="text-gray-600 font-['Inter']">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#2E8B57] hover:text-[#FFC145] 
                           inline-flex items-center gap-1 transition-colors duration-200 group"
                >
                  Masuk di sini
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}