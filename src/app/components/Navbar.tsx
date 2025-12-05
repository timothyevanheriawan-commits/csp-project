"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { ChefHat, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isLoggedIn = !!session;

  const userData = session?.user;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <ChefHat className="w-8 h-8 text-green-600" />
            <span className="font-bold text-xl text-gray-900">RecipeShare</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/resep" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Resep
            </Link>
            <Link href="/tentang" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Tentang Kami
            </Link>
            {isLoggedIn && (
              <Link href="/tambah-resep" className="btn-primary hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors hover:scale-105 transform duration-200">
                + Tambah Resep
              </Link>
            )}

            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            ) : isLoggedIn && userData ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {userData.image ? (
                      <Image
                        src={userData.image}
                        alt="Profile"
                        width={32} height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      userData.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-lg">
                          {userData.image ? (
                            <Image
                              src={userData.image}
                              alt="Profile"
                              width={48} height={48}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            userData.name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="text-white truncate">
                          <p className="font-semibold">{userData.name}</p>
                          <p className="text-xs opacity-90">{userData.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link href="/profil" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group" onClick={() => setIsProfileOpen(false)}>
                        <User className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
                        <span className="text-gray-700 group-hover:text-green-600">Profil Saya</span>
                      </Link>
                      <hr className="my-2 border-gray-200" />
                      <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 rounded-lg transition-colors group">
                        <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                        <span className="text-gray-700 group-hover:text-red-600">Keluar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Masuk
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3 px-2">
              <Link href="/resep" className="text-gray-700 hover:text-green-600 font-medium py-2 rounded-md px-3" onClick={() => setIsMenuOpen(false)}>Resep</Link>
              <Link href="/tentang" className="text-gray-700 hover:text-green-600 font-medium py-2 rounded-md px-3" onClick={() => setIsMenuOpen(false)}>Tentang Kami</Link>


              {isLoading ? (
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : isLoggedIn ? (
                <>
                  <Link href="/profil" className="text-gray-700 hover:text-green-600 font-medium py-2 rounded-md px-3" onClick={() => setIsMenuOpen(false)}>Profil</Link>
                  <Link href="/tambah-resep" className="text-gray-700 hover:text-green-600 font-medium py-2 rounded-md px-3" onClick={() => setIsMenuOpen(false)}>Tambah Resep</Link>
                  <button onClick={handleLogout} className="text-left text-red-600 font-medium py-2 rounded-md px-3 hover:bg-red-50">Keluar</button>
                </>
              ) : (
                <Link href="/login" className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg text-center" onClick={() => setIsMenuOpen(false)}>
                  Masuk / Daftar
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}