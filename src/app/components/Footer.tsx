import Link from "next/link";
import { ChefHat, Facebook, Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ChefHat className="w-8 h-8 text-green-500" />
              <span className="font-bold text-xl text-white">RecipeShare</span>
            </div>
            <p className="text-sm">
              Platform berbagi resep terbaik untuk pecinta kuliner Nusantara.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-green-400 transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/resep"
                  className="hover:text-green-400 transition-colors"
                >
                  Resep
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang"
                  className="hover:text-green-400 transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/tambah-resep"
                  className="hover:text-green-400 transition-colors"
                >
                  Tambah Resep
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/" className="hover:text-green-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" className="hover:text-green-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/" className="hover:text-green-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="mailto:info@recipeshare.com"
                className="hover:text-green-400 transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Tips Hari Ini</h3>
            <p className="text-sm">
              Selalu jaga konsistensi panas dan timing, karena hampir semua teknik memasak bergantung pada dua hal
              itu untuk menghasilkan tekstur dan rasa yang tepat.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; 2025 RecipeShare. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
