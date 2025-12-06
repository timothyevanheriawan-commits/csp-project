"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Eye, EyeOff, ChefHat, ArrowLeft, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const result = await signIn("credentials", { redirect: false, email, password });
      if (result?.error) {
        setError("Email atau password salah. Silakan coba lagi.");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F6FFF9]">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2E8B57] transition-colors duration-200 mb-8 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="p-4 bg-[#9ED5C5]/20 rounded-2xl transform transition-transform duration-300 hover:scale-105">
                <ChefHat className="w-10 h-10 text-[#2E8B57]" />
              </div>
            </div>
            <h1 className="font-['Playfair_Display'] text-4xl mb-3">Selamat Datang Kembali</h1>
            <p className="text-gray-600 font-['Inter']">Masuk untuk mulai berbagi resep favoritmu</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2 font-['Inter']">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-2 font-['Inter']">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl animate-fadeIn">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <span className="text-sm font-['Inter']">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2E8B57] hover:bg-[#236B43] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Inter'] shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Masuk
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center pt-6 border-t-2 border-gray-100">
              <p className="text-gray-600 font-['Inter']">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#2E8B57] hover:text-[#17472c] inline-flex items-center gap-1"
                >
                  Daftar sekarang!
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0" />
        <Image
          src="https://images.pexels.com/photos/11912814/pexels-photo-11912814.jpeg"
          alt="Delicious Food"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">

        </div>
      </div>
    </div>
  );
}