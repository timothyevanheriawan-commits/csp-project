export default function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-primary-50 h-full flex flex-col"
      style={{ boxShadow: 'var(--shadow-xs)' }}>
      {/* Image skeleton */}
      <div className="h-52 bg-primary-50 animate-shimmer" />

      <div className="p-5 grow flex flex-col space-y-3">
        {/* Title */}
        <div className="h-5 bg-primary-50 rounded-lg w-4/5 animate-shimmer" />
        <div className="h-5 bg-primary-50 rounded-lg w-3/5 animate-shimmer" />

        {/* Description */}
        <div className="space-y-2 pt-1">
          <div className="h-3.5 bg-primary-50/70 rounded w-full animate-shimmer" />
          <div className="h-3.5 bg-primary-50/70 rounded w-2/3 animate-shimmer" />
        </div>

        <div className="grow" />

        {/* Author */}
        <div className="flex items-center gap-2.5 pt-4 border-t border-primary-50/80">
          <div className="w-7 h-7 rounded-full bg-primary-50 animate-shimmer" />
          <div className="h-3 bg-primary-50 rounded w-20 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}