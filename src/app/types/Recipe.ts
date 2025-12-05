export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  difficulty: "MUDAH" | "SEDANG" | "SULIT";
  category: "MAKANAN_UTAMA" | "KUE_DESSERT" | "MINUMAN" | "CAMILAN";
  author: {
    id: string;
    name: string | null;
  } | null;
}
