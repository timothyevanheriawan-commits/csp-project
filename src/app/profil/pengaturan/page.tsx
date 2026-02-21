"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User, Camera, Save, ArrowLeft, Loader2, CheckCircle, Mail, UserCircle, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

export default function PengaturanProfil() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user) {
      setName(session.user.name || "");
      setPreviewUrl(session.user.image || "");
    }
  }, [session, status, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      let finalImageUrl = previewUrl;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${session?.user?.email}-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(uploadData.path);

        finalImageUrl = publicUrl;
      }

      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: finalImageUrl }),
      });

      if (res.ok) {
        await update({ name, image: finalImageUrl });
        setMessage("Profil berhasil diperbarui!");
        setTimeout(() => router.push("/profil"), 2000);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui profil");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") return null;

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute inset-0 bg-nature-gradient" />
      <div className="absolute inset-0 leaf-dots opacity-20" />

      <main className="grow py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/profil" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-600 transition-colors mb-5 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Kembali ke Profil</span>
            </Link>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-text mb-2">
              Pengaturan Profil
            </h1>
            <p className="text-text-secondary text-lg">
              Perbarui informasi pribadi dan foto profil Anda
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-7">
            {/* Left: Account Info */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 md:p-7 border border-primary-50"
                style={{ boxShadow: 'var(--shadow-sm)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="font-heading text-xl text-text">Informasi Akun</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                      placeholder="Nama Anda"
                    />
                  </div>

                  <div>
                    <label className=" text-sm font-semibold text-text-muted mb-2 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      Email (Tidak dapat diubah)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input
                        title="Email tidak dapat diubah"
                        type="email"
                        disabled
                        value={session?.user?.email || ""}
                        className="input-field pl-11 bg-surface-muted text-text-muted cursor-not-allowed border-primary-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Photo */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl p-6 border border-primary-50 sticky top-20 text-center"
                style={{ boxShadow: 'var(--shadow-sm)' }}>
                <h2 className="font-heading text-lg text-text mb-6">Foto Profil</h2>

                <div className="relative inline-block">
                  <div className="w-36 h-36 rounded-2xl overflow-hidden ring-4 ring-primary-50 bg-primary-50 flex items-center justify-center mx-auto relative shadow-md">
                    {previewUrl ? (
                      <Image src={previewUrl} alt="Avatar" fill className="object-cover" unoptimized />
                    ) : (
                      <User size={56} className="text-primary-200" />
                    )}
                  </div>

                  <label className="absolute -bottom-2 -right-2 bg-primary-500 p-2.5 rounded-xl text-white cursor-pointer hover:bg-primary-600 transition-all shadow-lg hover:scale-110 active:scale-95">
                    <Camera size={16} />
                    <input title="Upload foto" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>

                <p className="mt-4 text-xs text-text-muted">Format: JPG, PNG. Maks 2MB</p>

                <div className="h-px bg-primary-50 my-6" />

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn btn-primary py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <><Save size={16} /> Simpan </>
                    )}
                  </button>

                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center gap-2 text-primary-600 text-sm font-medium"
                    >
                      <CheckCircle size={14} /> {message}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </form>
        </div>
      </main>
    </div>
  );
}