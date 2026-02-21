"use client";

import Image from 'next/image';
import React from 'react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  imageUrl: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role, imageUrl }) => {
  return (
    <div className="relative p-7 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm transition-all duration-500 hover:bg-white/8 hover:border-white/15 group h-full flex flex-col">
      {/* Decorative quote */}
      <div className="absolute top-5 right-6 font-heading text-6xl text-primary-400/10 leading-none group-hover:text-primary-400/15 transition-colors duration-500 select-none">
        &ldquo;
      </div>

      <p className="text-white/70 text-sm leading-relaxed mb-7 relative z-10 grow group-hover:text-white/80 transition-colors duration-500">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="flex items-center gap-3 relative z-10">
        <div className="relative shrink-0">
          <Image
            className="h-11 w-11 rounded-full object-cover ring-2 ring-primary-400/20"
            src={imageUrl}
            alt={`Foto ${name}`}
            width={44}
            height={44}
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary-500 rounded-full border-2 border-primary-900" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{name}</div>
          <div className="text-[11px] text-primary-300/70">{role}</div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;