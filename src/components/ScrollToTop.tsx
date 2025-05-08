import React from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  visible: boolean;
  onClick: () => void;
}

export function ScrollToTop({ visible, onClick }: ScrollToTopProps) {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300 z-50"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}