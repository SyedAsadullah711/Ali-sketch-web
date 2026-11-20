import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { GalleryImage } from '../../types';
import { X, ChevronLeft, ChevronRight, Eye, Sparkles, Tag, ArrowUpRight } from 'lucide-react';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [showBefore, setShowBefore] = useState(false);

  const currentImage = images[currentIndex];

  const handlePrev = useCallback(() => {
    setShowBefore(false);
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    setShowBefore(false);
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Reset before view when currentImage changes
  useEffect(() => {
    setShowBefore(false);
  }, [currentIndex]);

  if (!isOpen || !currentImage) return null;

  const hasBeforeImage = !!currentImage.beforeImageUrl && currentImage.beforeImageUrl.trim() !== '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-300 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-studio-charcoal text-studio-ivory rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh] border border-studio-dark-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-studio-gold text-white flex items-center justify-center transition-colors"
          title="Close Lightbox (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Artwork Image View Area */}
        <div className="relative flex-1 bg-black/40 flex items-center justify-center min-h-[360px] md:min-h-[580px] p-4 select-none">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-studio-gold text-white flex items-center justify-center transition-colors"
            title="Previous artwork"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-studio-gold text-white flex items-center justify-center transition-colors"
            title="Next artwork"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Active Image (Sketch or Reference Photo) */}
          <div className="relative max-h-[75vh] flex items-center justify-center">
            <img
              src={showBefore && hasBeforeImage ? currentImage.beforeImageUrl : currentImage.imageUrl}
              alt={currentImage.title}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded shadow-lg transition-all duration-300"
            />

            {/* Before / After Floating Badge */}
            {hasBeforeImage && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center bg-black/80 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-xl">
                <button
                  type="button"
                  onClick={() => setShowBefore(false)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    !showBefore
                      ? 'bg-studio-gold text-white shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Handcrafted Sketch
                </button>
                <button
                  type="button"
                  onClick={() => setShowBefore(true)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    showBefore
                      ? 'bg-studio-gold text-white shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Original Photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Artwork Information Sidebar */}
        <div className="w-full md:w-80 p-6 md:p-8 flex flex-col justify-between bg-studio-charcoal border-t md:border-t-0 md:border-l border-studio-dark-border">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {currentImage.category && (
                <span className="text-[10px] tracking-widest uppercase font-semibold text-studio-gold bg-studio-gold/10 px-2.5 py-1 rounded">
                  {currentImage.category.name}
                </span>
              )}
              {currentImage.isFeatured && (
                <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-studio-gold" />
                  Featured
                </span>
              )}
            </div>

            <h3 className="font-serif text-2xl font-bold text-studio-ivory leading-snug">
              {currentImage.title}
            </h3>

            <p className="text-xs text-studio-ivory/70 leading-relaxed font-light">
              {currentImage.description || 'Pencil portrait handcrafted on 300gsm archival cotton paper.'}
            </p>

            {hasBeforeImage && (
              <div className="p-3 rounded bg-white/5 border border-white/10 text-xs text-studio-ivory/80 space-y-1">
                <div className="flex items-center gap-1.5 text-studio-gold font-medium">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Before &amp; After Available</span>
                </div>
                <p className="text-[11px] text-white/60">
                  Toggle between the client reference photograph and the finished graphite sketch.
                </p>
              </div>
            )}

            {currentImage.tags && (
              <div className="pt-2">
                <div className="text-[10px] uppercase tracking-wider text-studio-ivory/50 flex items-center gap-1 mb-2">
                  <Tag className="w-3 h-3 text-studio-gold" />
                  <span>Art Medium &amp; Tags</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentImage.tags.split(',').map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-white/10 text-studio-ivory/80 px-2 py-0.5 rounded-sm"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
            <Link
              to={`/order?style=${encodeURIComponent(currentImage.title)}`}
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-3 bg-studio-gold text-studio-charcoal font-semibold text-xs uppercase tracking-widest hover:bg-studio-ivory transition-colors rounded-sm"
            >
              <span>Commission This Style</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center justify-between text-[11px] text-studio-ivory/40">
              <span>Artwork {currentIndex + 1} of {images.length}</span>
              <span>Use &larr; &rarr; arrows to navigate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
