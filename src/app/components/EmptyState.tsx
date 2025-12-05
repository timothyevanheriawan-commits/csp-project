import Link from 'next/link';
import React from 'react';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, buttonText, buttonHref }) => {
  return (
    <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-center items-center mx-auto w-16 h-16 bg-green-100 rounded-full mb-4">
        <Icon className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      <Link
        href={buttonHref}
        className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default EmptyState;