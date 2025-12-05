
import Link from 'next/link';
import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">

      <h1 className="text-6xl md:text-9xl font-extrabold text-green-600">
        404
      </h1>

      <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-800">
        Halaman Tidak Ditemukan
      </h2>

      <p className="mt-2 text-base text-gray-500 max-w-md">
        Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin URL-nya salah ketik atau halaman tersebut sudah tidak ada lagi.
      </p>

      <Link
        href="/"
        className="mt-8 inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
      >
        Kembali ke Halaman Utama
      </Link>
    </div>
  );
}

export default NotFoundPage;