"use client";

import { Bookmark, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SaveButtonProps {
    recipeId: string;
    isInitiallySaved: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ recipeId, isInitiallySaved }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(isInitiallySaved);
    const [isPending, startTransition] = useTransition();
    const [showPulse, setShowPulse] = useState(false);

    const handleSaveToggle = async () => {
        if (!session) {
            router.push('/login?callbackUrl=' + window.location.pathname);
            return;
        }
        startTransition(async () => {
            const method = isSaved ? 'DELETE' : 'POST';
            const res = await fetch(`/api/resep/${recipeId}/simpan`, { method });
            if (res.ok) {
                setIsSaved(!isSaved);
                if (!isSaved) {
                    setShowPulse(true);
                    setTimeout(() => setShowPulse(false), 600);
                }
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
            className="relative p-2.5 rounded-full bg-white/85 backdrop-blur-sm hover:bg-white transition-all duration-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            aria-label={isSaved ? "Hapus dari simpanan" : "Simpan resep"}
        >
            <AnimatePresence>
                {showPulse && (
                    <motion.div
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 rounded-full bg-primary-400"
                    />
                )}
            </AnimatePresence>

            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin text-text-muted" />
            ) : (
                <Bookmark
                    className={`w-4 h-4 transition-all duration-300 ${isSaved ? 'text-primary-600 fill-current scale-110' : 'text-text-secondary hover:text-primary-500'
                        }`}
                />
            )}
        </button>
    );
};