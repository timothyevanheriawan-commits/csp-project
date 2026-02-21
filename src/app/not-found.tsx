import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative">
      <div className="absolute inset-0 bg-nature-gradient" />
      <div className="absolute inset-0 leaf-dots opacity-20" />

      <div className="text-center px-4 relative z-10">
        {/* Big 404 */}
        <h1 className="font-heading text-[8rem] md:text-[12rem] leading-none text-primary-100 select-none">
          404
        </h1>

        <div className="-mt-8 md:-mt-12">
          <h2 className="font-heading text-2xl md:text-3xl text-text mb-3">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-text-secondary max-w-md mx-auto mb-8">
            Sepertinya resep yang Anda cari sudah berpindah dapur.
            Mari kembali dan temukan resep lezat lainnya!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn btn-primary px-6 py-3 rounded-xl gap-2">
              <Home className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
            <Link href="/resep" className="btn btn-ghost px-6 py-3 rounded-xl gap-2">
              <Search className="w-4 h-4" />
              Cari Resep
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}