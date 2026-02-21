export default function Loading() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background">
            <div className="relative">
                {/* Outer ring */}
                <div className="w-14 h-14 rounded-full border-3 border-primary-100 border-t-primary-500 animate-spin" />
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse-soft" />
                </div>
            </div>
            <p className="text-text-muted text-sm mt-4 animate-pulse-soft">Memuat...</p>
        </div>
    );
}