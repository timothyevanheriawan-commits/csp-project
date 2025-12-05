"use client";

import Link from "next/link";
import Image from "next/image";
import { User, ChefHat } from "lucide-react";
import { SaveButton } from "./SaveButton";
import { DeleteButton } from './DeleteButton';
import { Recipe } from "@/types/recipe";
import React from 'react';

function getDifficultyBadgeClass(difficulty: string | null | undefined): string {
  switch (difficulty?.toUpperCase()) {
    case "MUDAH":
      return "bg-green-100 text-green-800";
    case "SEDANG":
      return "bg-yellow-100 text-yellow-800";
    case "SULIT":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
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

  if (viewMode === 'list') {
    return (
      <Link href={`/resep/${recipe.id}`} className="block">
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex gap-4 cursor-pointer group relative">

          <div
            className="absolute top-3 right-3 z-10 flex items-center gap-2"
            onClick={handleActionClick}
          >
            <SaveButton recipeId={recipe.id} isInitiallySaved={isInitiallySaved} />
            {onDeleteSuccess && (
              <DeleteButton recipeId={recipe.id} onSuccess={() => onDeleteSuccess(recipe.id)} />
            )}
          </div>

          <div className="w-32 h-32 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
            {recipe.imageUrl ? (
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                width={128}
                height={128}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-200">
                <ChefHat className="w-8 h-8 text-secondary-400" />
              </div>
            )}
          </div>

          <div className="flex-grow pr-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-primary-500 transition-colors line-clamp-2">
              {recipe.title}
            </h3>
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
              {recipe.description || "Resep lezat yang wajib dicoba!"}
            </p>
            <div className="flex items-center gap-4 text-sm mt-auto">
              {recipe.difficulty && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadgeClass(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </span>
              )}
              {recipe.author && (
                <div className="text-gray-600 flex items-center gap-1">
                  <User size={14} />
                  <span>{recipe.author.name || 'Anonymous'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 transform overflow-hidden h-full flex flex-col group relative">

      <div
        className="absolute top-3 right-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleActionClick}
      >
        <SaveButton
          recipeId={recipe.id}
          isInitiallySaved={isInitiallySaved}
        />
        {onDeleteSuccess && (
          <DeleteButton recipeId={recipe.id} onSuccess={() => onDeleteSuccess(recipe.id)} />
        )}
      </div>

      <Link href={`/resep/${recipe.id}`} className="block">
        <div className="relative h-48 bg-gray-200">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-green-100 to-green-200">
              <ChefHat className="w-16 h-16 text-green-400" />
            </div>
          )}

          {recipe.difficulty && (
            <span
              className={`absolute top-3 left-3 ${getDifficultyBadgeClass(
                recipe.difficulty
              )} text-xs font-semibold px-2.5 py-1 rounded-full z-[5]`}
            >
              {recipe.difficulty}
            </span>
          )}
        </div>
      </Link>

      <div className="p-5 flex-grow flex flex-col">
        <Link href={`/resep/${recipe.id}`} className="block">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-green-600 transition-colors">
            {recipe.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {recipe.description || "Resep lezat yang wajib dicoba!"}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
          {recipe.author && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="truncate max-w-[100px]">
                {recipe.author.name || "Anonymous"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}