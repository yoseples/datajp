import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      title="Kembali ke Posisi Paling Atas (Scroll to Top)"
      className="fixed bottom-7 right-7 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-2xl shadow-rose-900/50 border border-rose-400/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 active:scale-95 group animate-in fade-in zoom-in-75"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
      <span className="sr-only">Kembali ke Atas</span>
    </button>
  );
}
