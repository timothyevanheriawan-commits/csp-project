"use client";

import Link from "next/link";
import Image from "next/image";
import { User, ChefHat, Pencil } from "lucide-react";
import { SaveButton } from "./SaveButton";
import { DeleteButton } from './DeleteButton';
import { Recipe } from "@/app/types/Recipe";
import React from 'react';

function getDifficultyStyle(difficulty: string | null | undefined) {
  switch (difficulty?.toUpperCase()) {
    case "MUDAH": return { badge: "bg-green-50 text-green-700 border border-green-200/60", dot: "bg-green-500" };
    case "SEDANG": return { badge: "bg-amber-50 text-amber-700 border border-amber-200/60", dot: "bg-amber-500" };
    case "SULIT": return { badge: "bg-red-50 text-red-700 border border-red-200/60", dot: "bg-red-500" };
    default: return { badge: "bg-gray-50 text-gray-600 border border-gray-200/60", dot: "bg-gray-400" };
  }
}

function safeImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  return url.trimEnd();
}

interface RecipeCardProps {
  recipe: Recipe;
  onDeleteSuccess?: (recipeId: string) => void;
  isInitiallySaved: boolean;
  viewMode: 'grid' | 'list';
}

export default function RecipeCard({ recipe, onDeleteSuccess, isInitiallySaved, viewMode }: RecipeCardProps) {
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const diffStyle = getDifficultyStyle(recipe.difficulty);
  const imageUrl = safeImageUrl(recipe.imageUrl);

  const actionButtons = (
    <div
      className={`absolute top-3 right-3 z-20 flex items-center gap-1.5 ${viewMode === 'grid' ? 'opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0' : ''
        }`}
      onClick={handleActionClick}
    >
      <SaveButton recipeId={recipe.id} isInitiallySaved={isInitiallySaved} />
      {onDeleteSuccess && (
        <>
          <Link
            href={`/profil/edit/${recipe.id}`}
            className="p-2 rounded-full bg-white/85 backdrop-blur-sm text-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-sm"
          >
            <Pencil size={15} />
          </Link>
          <DeleteButton recipeId={recipe.id} onSuccess={() => onDeleteSuccess(recipe.id)} />
        </>
      )}
    </div>
  );

  // === LIST VIEW ===
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl p-4 flex gap-4 cursor-pointer group relative border border-primary-50 hover:border-primary-200/60 transition-all duration-300 hover:translate-x-1"
        style={{ boxShadow: 'var(--shadow-xs)' }}
      >
        {actionButtons}
        <Link href={`/resep/${recipe.id}`} className="shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg bg-primary-50 overflow-hidden">
            {imageUrl ? (
              <Image src={imageUrl} alt={recipe.title} width={128} height={128} quality={90} fill 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary-50 to-secondary-50">
                <ChefHat className="w-8 h-8 text-primary-300" />
              </div>
            )}
          </div>
        </Link>
        <div className="grow flex flex-col justify-center min-w-0">
          <Link href={`/resep/${recipe.id}`}>
            <h3 className="text-lg font-heading font-semibold text-text hover:text-primary-600 line-clamp-1 transition-colors">{recipe.title}</h3>
          </Link>
          <p className="text-text-secondary text-sm line-clamp-2 mb-3 leading-relaxed">{recipe.description}</p>
          <div className="flex items-center gap-3 text-sm">
            {recipe.difficulty && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${diffStyle.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${diffStyle.dot}`} />
                {recipe.difficulty}
              </span>
            )}
            <span className="text-text-muted text-xs flex items-center gap-1">
              <User className="w-3 h-3" />
              {recipe.author?.name || "Anonim"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // === GRID VIEW ===
  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden h-full flex flex-col border border-primary-50/80 hover:border-primary-200/50 card-lift"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      {actionButtons}

      <Link href={`/resep/${recipe.id}`} className="block overflow-hidden">
        <div className="relative h-52 sm:h-56 bg-primary-50 overflow-hidden">
          {imageUrl ? (
            <Image src={imageUrl} alt={recipe.title} fill
              className="object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="flex items-center justify-center h-full bg-linear-to-br from-primary-50 via-background to-secondary-50">
              <ChefHat size={40} className="text-primary-200 animate-float" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-tot from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {recipe.difficulty && (
            <span className={`absolute top-3.5 left-3.5 ${diffStyle.badge} inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full z-10 backdrop-blur-[2px] uppercase tracking-widest`}>
              <span className={`w-1.5 h-1.5 rounded-full ${diffStyle.dot}`} />
              {recipe.difficulty}
            </span>
          )}
        </div>
      </Link>

      <div className="p-5 grow flex flex-col">
        <Link href={`/resep/${recipe.id}`}>
          <h3 className="font-heading text-lg font-bold text-text mb-2 line-clamp-2 hover:text-primary-600 transition-colors duration-300 leading-snug">
            {recipe.title}
          </h3>
        </Link>
        <p className="text-text-secondary text-sm mb-5 line-clamp-2 grow leading-relaxed">
          {recipe.description || "Resep lezat yang wajib dicoba!"}
        </p>

        <div className="flex items-center gap-2.5 pt-4 border-t border-primary-50/80">
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white shadow-sm">
            {recipe.author?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <span className="text-xs font-medium text-text-muted">
            {recipe.author?.name || "Anonim"}
          </span>
        </div>
      </div>
    </div>
  );
}