'use client';

import { Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-10 h-10 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-5 h-5" />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-10 h-10 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-[#0077B5] hover:border-[#0077B5] transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </a>
      <button
        onClick={handleCopyLink}
        className={`flex items-center justify-center w-10 h-10 bg-white rounded-full border transition-colors ${
          copied 
            ? 'border-green-500 text-green-500' 
            : 'border-gray-200 text-gray-500 hover:text-[#0a2140] hover:border-[#0a2140]'
        }`}
        aria-label={copied ? 'Link copied!' : 'Copy link'}
      >
        {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
      </button>
    </div>
  );
}
