'use client';

import { useState } from 'react';

const CATEGORIES = ['All', 'Product Updates', 'Customer Stories', 'Interview Tips', 'Career Prep', 'Features'];

export function BlogCategoryFilter() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
            activeCategory === category
              ? 'bg-foreground text-white shadow-lg shadow-foreground/20'
              : 'bg-white text-foreground border border-gray-200 hover:border-foreground/30'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
