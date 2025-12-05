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
    <div className="bg-white p-8 rounded-xl shadow-soft transition-transform hover:scale-105">
      <p className="text-text-light font-body italic mb-6">"{quote}"</p>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Image
            className="h-12 w-12 rounded-full object-cover"
            src={imageUrl}
            alt={`Foto ${name}`}
            width={48}
            height={48}
          />
        </div>
        <div className="ml-4">
          <div className="font-heading text-lg font-semibold text-text">{name}</div>
          <div className="text-sm text-text-light">{role}</div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;