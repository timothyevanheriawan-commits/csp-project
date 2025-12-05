"use client";

import { useState, useEffect } from 'react';
import {
  FaWhatsapp,
  FaTwitter,
  FaFacebookF,
  FaLink
} from 'react-icons/fa';

interface ShareButtonsProps {
  title: string;
  className?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, className = '' }) => {
  const [pageUrl, setPageUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const copyToClipboard = () => {
    if (!pageUrl) return;

    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopySuccess('Link berhasil disalin!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Gagal menyalin link.');
    });
  };

  if (!pageUrl) return null;

  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(`Coba resep ini: ${title}`);

  const shareLinks = [
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`,
      icon: <FaWhatsapp size={20} />,
      className: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <FaTwitter size={20} />,
      className: 'bg-blue-400 hover:bg-blue-500',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FaFacebookF size={20} />,
      className: 'bg-blue-800 hover:bg-blue-900',
    },
  ];

  return (
    <div className={`w-full ${className}`}>
      <h4 className="text-lg font-semibold text-gray-800 mb-3 leading-tight">
        Bagikan Resep Ini
      </h4>
      <div className="flex flex-wrap items-center gap-3">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-300 ${link.className}`}
            aria-label={`Bagikan ke ${link.name}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-300"
          aria-label="Salin link"
        >
          <FaLink size={20} />
          <span>Salin Link</span>
        </button>

        {copySuccess && (
          <span className="text-sm text-green-700 ml-2 transition-opacity duration-300">
            {copySuccess}
          </span>
        )}
      </div>
    </div>
  );
};

export default ShareButtons;
