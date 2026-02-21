"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { ChefHat, Menu, X, User, LogOut, ChevronDown, Settings, Plus } from "lucide-react";
import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isLoggedIn = !!session;
  const userData = session?.user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navLinks = [
    { label: "Resep", href: "/resep" },
    { label: "Tentang Kami", href: "/tentang" },
  ];

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 bg-white border-b ${scrolled
        ? "border-primary-100/60 shadow-sm"
        : "border-transparent"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-[68px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group relative z-10">
              <div className="flex items-center justify-center w-9 h-9 bg-primary-500 rounded-xl shadow-md shadow-primary-500/15 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-primary-800 tracking-tight">
                RecipeShare
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-primary-600 hover:bg-primary-50/60 transition-all duration-300 link-grow"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/tambah-resep"
                className="ml-2 px-4 py-2 rounded-full text-sm font-bold bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md hover:shadow-primary-500/15 transition-all duration-300 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Resep
              </Link>

              {/* Divider */}
              <div className="w-px h-6 mx-3 bg-primary-100" />

              {/* Auth */}
              {isLoading ? (
                <div className="h-9 w-9 rounded-full animate-shimmer" />
              ) : isLoggedIn ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-full hover:bg-primary-50 transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary-400/25 bg-linear-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white shadow-sm">
                      {userData?.image ? (
                        <NextImage src={userData.image} alt="Profile" width={36} height={36} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-sm font-bold">{userData?.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-all duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 mt-2 w-60 bg-white rounded-2xl overflow-hidden py-1.5 border border-primary-50"
                        style={{ boxShadow: 'var(--shadow-xl)' }}
                      >
                        <div className="px-4 py-3 border-b border-primary-50/80">
                          <p className="text-sm font-bold text-text truncate">{userData?.name}</p>
                          <p className="text-xs text-text-muted truncate">{userData?.email}</p>
                        </div>

                        {[
                          { href: "/profil", icon: User, label: "Profil Saya" },
                          { href: "/profil/pengaturan", icon: Settings, label: "Pengaturan" },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-primary-50/60 hover:text-primary-700 transition-colors group"
                          >
                            <item.icon className="w-4 h-4 text-text-muted group-hover:text-primary-500 transition-colors" />
                            {item.label}
                          </Link>
                        ))}

                        {userData?.role === 'ADMIN' && (
                          <>
                            <div className="mx-3 my-1 h-px bg-primary-50" />
                            <Link
                              href="/admin"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50/60 transition-colors"
                            >
                              <ChefHat className="w-4 h-4" />
                              Dashboard Admin
                            </Link>
                          </>
                        )}

                        <div className="border-t border-primary-50/80 mt-1 pt-1">
                          <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Keluar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-bold px-5 py-2 rounded-full text-primary-700 border-2 border-primary-200 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all duration-300"
                >
                  Masuk
                </Link>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-xl text-primary-800 hover:bg-primary-50 transition-colors relative z-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Fullscreen */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-primary-900/95 backdrop-blur-xl" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-7 px-8"
            >
              {[
                { label: "Jelajahi Resep", href: "/resep" },
                { label: "Tentang Kami", href: "/tentang" },
                { label: "Tambah Resep", href: "/tambah-resep" },
              ].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-3xl font-heading font-bold text-white hover:text-accent-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="mt-6 w-12 h-px bg-white/15" />

              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                {isLoggedIn ? (
                  <div className="flex flex-col items-center gap-4">
                    <Link href="/profil" onClick={() => setIsMenuOpen(false)} className="text-lg text-white/70 hover:text-white transition-colors">Profil Saya</Link>
                    <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="text-lg text-red-400 hover:text-red-300 transition-colors">Keluar</button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}
                    className="px-8 py-3 bg-primary-500 text-white font-bold rounded-full text-lg hover:bg-primary-400 transition-colors">
                    Masuk
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}