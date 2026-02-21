// src/app/components/Footer.tsx
"use client";

import Link from "next/link";
import { ChefHat, Facebook, Twitter, Instagram } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#121a15] text-gray-400 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Kolom 1: Brand & Bio */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex items-center justify-center w-8 h-8 bg-[#2E8B57] rounded-lg shadow-lg shadow-green-900/40">
                <ChefHat className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-white tracking-tight">
                RecipeShare
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Platform berbagi resep kuliner terbesar di Indonesia. Menghubungkan dapur rumahan dengan dunia melalui rasa.
            </p>
          </div>

          {/* Kolom 2: Quick Links */}
          <div>
            <h3 className="font-heading text-white font-bold mb-6 uppercase tracking-widest text-xs">Navigasi</h3>
            <ul className="space-y-3">
              {[
                { name: "Beranda", href: "/" },
                { name: "Jelajahi Resep", href: "/resep" },
                { name: "Tentang Kami", href: "/tentang" },
                { name: "Buka Dapur (Posting)", href: "/tambah-resep" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-[#2E8B57] hover:translate-x-1 flex items-center gap-1 transition-all duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Social Media */}
          <div>
            <h3 className="font-heading text-white font-bold mb-6 uppercase tracking-widest text-xs">Komunitas</h3>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, link: "#", name: "Facebook" },
                { Icon: Twitter, link: "#", name: "Twitter" },
                { Icon: Instagram, link: "#", name: "Instagram" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.link}
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-[#2E8B57] hover:border-[#2E8B57] transition-colors shadow-xl"
                  aria-label={social.name}
                >
                  <social.Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            <p className="mt-6 text-xs text-gray-500 italic">
              #MasakLezatSetiapHari
            </p>
          </div>

          {/* Kolom 4: Newsletter/Tips */}
          <div>
            <h3 className="font-heading text-white font-bold mb-6 uppercase tracking-widest text-xs">Inspirasi Dapur</h3>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#2E8B57]/10 rounded-full blur-2xl"></div>
              <p className="text-xs italic leading-relaxed relative z-10 text-gray-300">
                &quot;Rahasia masakan enak bukan hanya bumbu, tapi ketulusan saat meracik bahan di atas api kecil.&quot;
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-[#2E8B57] uppercase tracking-tighter cursor-default">
                <span>Tips Hari Ini</span>
                <div className="h-px grow bg-[#2E8B57]/20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-medium tracking-wide uppercase">
          <p>&copy; {currentYear} RecipeShare</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}