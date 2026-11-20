import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-studio-ivory flex flex-col items-center justify-center p-4 text-center selection:bg-studio-gold selection:text-white">
      <div className="font-serif text-6xl font-bold text-studio-gold mb-2">404</div>
      <h1 className="font-serif text-3xl font-bold text-studio-charcoal mb-3">
        Studio Canvas Not Found
      </h1>
      <p className="text-sm text-studio-taupe max-w-md mb-8">
        The page you are looking for may have been moved, renamed, or is currently in the artist&apos;s sketchbook.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Studio Home</span>
      </Link>
    </div>
  );
};
