import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed bottom-6 right-6 p-3 md:p-4 rounded-full shadow-lg bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 hover:scale-110 transition-transform z-50 flex items-center justify-center border border-transparent dark:border-gray-300 font-bold text-sm md:text-base"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}