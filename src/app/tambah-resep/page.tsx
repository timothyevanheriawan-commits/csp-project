"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Plus, X, AlertCircle, Save, ArrowLeft, Utensils, List, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";

type ArrayField = 'ingredients' | 'instructions';
interface FormDataState {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  difficulty: 'MUDAH' | 'SEDANG' | 'SULIT';
  category: 'MAKANAN_UTAMA' | 'KUE_DESSERT' | 'MINUMAN' | 'CAMILAN';
  imageUrl: string;
}

export default function TambahResepPage() {
  const { status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataState>({
    title: "", description: "", ingredients: [""], instructions: [""], difficulty: "MUDAH", category: "MAKANAN_UTAMA", imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => { if (status === "unauthenticated") router.push('/login'); }, [status, router]);
  useEffect(() => { setImagePreview(formData.imageUrl || ""); }, [formData.imageUrl]);

  const handleArrayChange = (field: ArrayField, index: number, value: string) => {
    setFormData(p => ({ ...p, [field]: p[field].map((item, i) => i === index ? value : item) }));
  };
  const handleArrayAdd = (field: ArrayField) => {
    setFormData(p => ({ ...p, [field]: [...p[field], ""] }));
  };
  const handleArrayRemove = (field: ArrayField, index: number) => {
    if (formData[field].length > 1) {
      setFormData(p => ({ ...p, [field]: p[field].filter((_, i) => i !== index) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccessMessage(""); setIsSubmitting(true);

    const validIngredients = formData.ingredients.filter(ing => ing.trim());
    const validInstructions = formData.instructions.filter(inst => inst.trim());

    if (validIngredients.length === 0 || validInstructions.length === 0) {
      setError("Mohon isi minimal satu bahan dan satu langkah memasak.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/resep", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ingredients: validIngredients, instructions: validInstructions }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage("Resep berhasil disimpan! Mengalihkan...");
        setTimeout(() => router.push(`/resep/${data.id}`), 2000);
      } else {
        const data = await res.json();
        setError(data.message || "Gagal menyimpan resep. Silakan coba lagi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan periksa koneksi internet Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficultyLevels: FormDataState['difficulty'][] = ['MUDAH', 'SEDANG', 'SULIT'];
  const categoryLevels: FormDataState['category'][] = ['MAKANAN_UTAMA', 'KUE_DESSERT', 'MINUMAN', 'CAMILAN'];


  return (
    <div className="min-h-screen flex flex-col bg-[#F6FFF9]">
      <Navbar />
      <main className="grow py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/profil" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2E8B57] transition-colors duration-200 mb-6 group font-['Inter']">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Kembali ke Profil</span>
            </Link>
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1F1F1F] mb-3">
              Tambah Resep Baru
            </h1>
            <p className="text-gray-600 font-['Inter'] text-lg">
              Bagikan resep kesukaanmu dengan ribuan pecinta kuliner lainnya
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transform transition-all duration-300 hover:shadow-xl">
                <h2 className="font-['Playfair_Display'] text-2xl text-[#1F1F1F] mb-6 flex items-center gap-3">
                  <div className="p-2 bg-[#9ED5C5]/20 rounded-lg"><FileText className="w-6 h-6 text-[#2E8B57]" /></div>
                  Informasi Dasar
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#1F1F1F] mb-2 font-['Inter']">Nama Resep <span className="text-red-500">*</span></label>
                    <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" placeholder="Contoh: Nasi Goreng Spesial Kampung"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1F1F1F] mb-2 font-['Inter']">Deskripsi</label>
                    <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" placeholder="Ceritakan keistimewaan resep ini..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transform transition-all duration-300 hover:shadow-xl">
                <h2 className="font-['Playfair_Display'] text-2xl text-[#1F1F1F] mb-6 flex items-center gap-3">
                  <div className="p-2 bg-[#9ED5C5]/20 rounded-lg"><List className="w-6 h-6 text-[#359c61]" /></div>
                  Bahan-bahan
                </h2>
                <div className="space-y-3">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 items-center group">
                      <span className="shrink-0 w-8 h-8 bg-[#2E8B57]/10 text-[#2E8B57] rounded-full flex items-center justify-center text-sm font-semibold">{index + 1}</span>
                      <input type="text" value={ingredient} onChange={(e) => handleArrayChange("ingredients", index, e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl" placeholder={`Bahan ke-${index + 1}`}
                      />
                      {formData.ingredients.length > 1 && (
                        <button type="button" onClick={() => handleArrayRemove("ingredients", index)}
                          aria-label={`Hapus bahan ke-${index + 1}`}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => handleArrayAdd("ingredients")}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-[#2E8B57]/10 hover:bg-[#2E8B57]/20 text-[#2E8B57] font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] font-['Inter']">
                    <Plus className="w-4 h-4" />Tambah Bahan
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transform transition-all duration-300 hover:shadow-xl">
                <h2 className="font-['Playfair_Display'] text-2xl text-[#1F1F1F] mb-6 flex items-center gap-3">
                  <div className="p-2 bg-[#9ED5C5]/20 rounded-lg"><Utensils className="w-6 h-6 text-[#2E8B57]" /></div>
                  Langkah Memasak
                </h2>
                <div className="space-y-4">
                  {formData.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-3 group">
                      <span className="shrink-0 w-8 h-8 bg-[#2E8B57]/10 text-[#2E8B57] rounded-full flex items-center justify-center text-sm font-semibold">{index + 1}</span>
                      <div className="flex-1 flex gap-2">
                        <textarea value={instruction} onChange={(e) => handleArrayChange("instructions", index, e.target.value)}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl" rows={3} placeholder={`Langkah ${index + 1}`}
                        />
                        {formData.instructions.length > 1 && (
                          <button type="button" aria-label={`Hapus langkah ke-${index + 1}`} // <-- Tambahkan ini
                            onClick={() => handleArrayRemove("instructions", index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 self-start">
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleArrayAdd("instructions")}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-[#2E8B57]/10 hover:bg-[#2E8B57]/20 text-[#2E8B57] font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] font-['Inter']">
                    <Plus className="w-4 h-4" />Tambah Langkah
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 top-24 transform transition-all duration-300 hover:shadow-xl">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="category-select" className="block text-sm font-semibold text-[#1F1F1F] mb-2 font-['Inter']">Kategori</label>
                    <select id="category-select" value={formData.category} onChange={(e) => setFormData({
                      ...formData, category: e.target.value as FormDataState['category']
                    })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl">
                      <option value="MAKANAN_UTAMA">Makanan Utama</option>
                      <option value="KUE_DESSERT">Kue & Dessert</option>
                      <option value="MINUMAN">Minuman</option>
                      <option value="CAMILAN">Camilan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1F1F1F] mb-2 font-['Inter']">Tingkat Kesulitan</label>
                    <div className="grid grid-cols-3 gap-2">
                      {difficultyLevels.map((level) => (
                        <button key={level} type="button" onClick={() => setFormData({ ...formData, difficulty: level })}
                          className={`py-2 px-3 rounded-lg font-medium text-sm transition-all
                            ${formData.difficulty === level
                              ? level === 'MUDAH' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' :
                                level === 'SEDANG' ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500' :
                                  'bg-red-100 text-red-700 ring-2 ring-red-500'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                          {level === 'MUDAH' ? 'Mudah' : level === 'SEDANG' ? 'Sedang' : 'Sulit'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1F1F1F] mb-2 font-['Inter']">URL Gambar</label>
                    <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" placeholder="https://..."
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">Preview:</p>
                      <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={() => setImagePreview("")} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-6 flex items-start gap-3 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl animate-fadeIn">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <span className="font-['Inter']">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-6 flex items-start gap-3 bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl animate-fadeIn">
              <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <span className="font-['Inter']">{successMessage}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button type="submit" onClick={handleSubmit} disabled={isSubmitting}
              className="flex-1 sm:flex-initial bg-[#2E8B57] hover:bg-[#236B43] text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Inter'] shadow-lg hover:shadow-xl">
              {isSubmitting ? (
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Save className="w-5 h-5" />Simpan Resep</>
              )}
            </button>
            <Link href="/profil" className="flex-1 sm:flex-initial bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-center font-['Inter']">
              Batal
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}