"use client";

import { Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DeleteButtonProps {
    recipeId: string;
    onSuccess: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ recipeId, onSuccess }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus resep ini? Tindakan ini tidak dapat dibatalkan.')) {
            return;
        }

        setIsDeleting(true);

        try {
            const res = await fetch(`/api/resep/${recipeId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                onSuccess();
                return;
            }

            const errorData = await res.json();
            throw new Error(errorData.message || 'Gagal menghapus resep.');

        } catch (error: unknown) {
            let errorMessage = 'Terjadi kesalahan tak terduga.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            alert(`Terjadi kesalahan: ${errorMessage}`);

            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Hapus resep"
        >
            {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Trash2 className="w-5 h-5" />
            )}
        </button>
    );
};