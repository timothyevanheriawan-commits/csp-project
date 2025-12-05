import React from 'react';

interface StatsProps {
  recipeCount: number;
  userCount: number;
  categoryCount: number;
}

const Stats: React.FC<StatsProps> = ({ recipeCount, userCount, categoryCount }) => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-heading text-primary-500 mb-2">
              {recipeCount}+
            </div>
            <div className="text-text-light">Resep Tersedia</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-heading text-accent-400 mb-2">
              {userCount}+
            </div>
            <div className="text-text-light">Kontributor Aktif</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-heading text-secondary-500 mb-2">
              {categoryCount}+
            </div>
            <div className="text-text-light">Kategori Masakan</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;