"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatsProps {
  recipeCount: number;
  userCount: number;
  categoryCount: number;
}

function AnimatedCounter({ value, suffix = "+" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView || value === 0) return;
    const duration = 1200;
    const steps = 35;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setDisplay(value); clearInterval(timer); }
      else { setDisplay(Math.floor(current)); }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>;
}

const Stats: React.FC<StatsProps> = ({ recipeCount, userCount, categoryCount }) => {
  const stats = [
    { label: "Resep Tersedia", value: recipeCount },
    { label: "Kontributor Aktif", value: userCount },
    { label: "Kategori Masakan", value: categoryCount },
  ];

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[180px] bg-primary-50/50 rounded-full blur-[100px]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-600 mb-2 font-bold">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-sm text-text-secondary font-medium">{stat.label}</div>
              <div className="mt-3 mx-auto w-8 h-0.5 bg-linear-to-r from-primary-400 to-secondary-400 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;