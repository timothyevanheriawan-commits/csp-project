import Link from 'next/link';

export default function EmptyState({ icon: Icon, title, description, buttonText, buttonHref }) {
  return (
    <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-center items-center mx-auto w-16 h-16 bg-green-100 rounded-full mb-4">
        <Icon className="w-8 h-8 text-primary-500" />
      </div>
      <h3 className="text-xl font-semibold text-text mb-2">{title}</h3>
      <p className="text-text-light mb-6">{description}</p>
      {buttonText && buttonHref && (
        <Link
          href={buttonHref}
          className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}