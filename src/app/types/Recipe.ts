
export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  ingredients: string[];
  instructions: string | null;
  imageUrl: string;
  difficulty: "MUDAH" | "SEDANG" | "SULIT";
  category: "MAKANAN_UTAMA" | "KUE_DESSERT" | "MINUMAN" | "CAMILAN";

  createdAt: string;
  updatedAt: string;

  authorId: string;
  author: {
    id: string;
    name: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}
