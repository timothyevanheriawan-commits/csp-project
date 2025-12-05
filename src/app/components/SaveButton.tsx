"use client";

import { Bookmark, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface SaveButtonProps {
    recipeId: string;
    isInitiallySaved: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ recipeId, isInitiallySaved }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(isInitiallySaved);
    const [isPending, startTransition] = useTransition();

    const handleSaveToggle = async () => {
        if (!session) {
            router.push('/login?callbackUrl=' + window.location.pathname);
            return;
        }

        startTransition(async () => {
            const method = isSaved ? 'DELETE' : 'POST';

            const res = await fetch(`/api/resep/${recipeId}/simpan`, {
                method: method,
            });

            if (res.ok) {
                setIsSaved(!isSaved);
                router.refresh();
            } else if (res.status === 409) {
                alert('Anda sudah menyimpan resep ini.');
            } else {
                alert('Terjadi kesalahan. Silakan coba lagi.');
            }
        });
    };

    return (
        <button
            onClick={handleSaveToggle}
            disabled={isPending}
            className="p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-colors disabled:cursor-not-allowed"
            aria-label={isSaved ? "Hapus dari simpanan" : "Simpan resep"}
        >
            {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            ) : (
                <Bookmark
                    className={`w-5 h-5 transition-all ${isSaved
                        ? 'text-green-600 fill-current'
                        : 'text-gray-600 hover:text-green-500'
                        }`}
                />
            )}
        </button>
    );
}