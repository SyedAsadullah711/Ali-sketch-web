import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Lightbox } from '../common/Lightbox';
import { Maximize2, Sparkles, Eye } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { content, isSectionVisible } = useContent();
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!isSectionVisible('gallery')) return null;

  const galleryImages = content?.galleryImages || [];
  const categories = content?.categories || [];

  const filteredImages =
    selectedCategory === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.categoryId === selectedCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-studio-beige/30 border-b border-studio-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-[11px] uppercase tracking-widest text-studio-gold font-semibold">
            Fine Art Portfolio
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-studio-charcoal">
            Featured Artwork Gallery
          </h2>
          <p className="text-sm sm:text-base text-studio-taupe font-light">
            Explore our archive of pencil studies and commissions. Click any piece for a high-resolution lightbox view and photograph comparisons.
          </p>
          <div className="w-12 h-0.5 bg-studio-gold mx-auto mt-4" />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-sm transition-all ${
              selectedCategory === 'all'
                ? 'bg-studio-charcoal text-studio-ivory shadow-sm'
                : 'bg-studio-card text-studio-taupe hover:text-studio-charcoal border border-studio-border'
            }`}
          >
            All Works ({galleryImages.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-sm transition-all ${
                selectedCategory === cat.id
                  ? 'bg-studio-charcoal text-studio-ivory shadow-sm'
                  : 'bg-studio-card text-studio-taupe hover:text-studio-charcoal border border-studio-border'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Artwork Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => {
            const hasBefore = !!image.beforeImageUrl && image.beforeImageUrl.trim() !== '';

            return (
              <div
                key={image.id}
                onClick={() => openLightbox(index)}
                className="group relative bg-studio-card rounded-sm overflow-hidden border border-studio-border shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Artwork Canvas View */}
                <div className="aspect-[4/5] overflow-hidden bg-studio-beige relative">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    loading="lazy"
                    className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Gradient Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-studio-charcoal/85 via-studio-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                    <span className="text-[10px] tracking-widest uppercase text-studio-gold font-semibold">
                      {image.category?.name || 'Graphite Sketch'}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-white leading-tight mt-1">
                      {image.title}
                    </h4>
                    <p className="text-[11px] text-white/70 line-clamp-2 mt-1 font-light">
                      {image.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-studio-gold pt-2 border-t border-white/20">
                      <span className="flex items-center gap-1 font-medium">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Enlarge Study</span>
                      </span>
                      {hasBefore && (
                        <span className="text-[10px] bg-studio-gold/20 text-studio-gold px-2 py-0.5 rounded border border-studio-gold/30">
                          Before/After
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    {image.isFeatured ? (
                      <span className="bg-studio-charcoal/85 backdrop-blur-sm text-amber-300 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-sm flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3 text-studio-gold" />
                        Featured
                      </span>
                    ) : <span />}

                    {hasBefore && (
                      <span className="bg-black/60 backdrop-blur-sm text-white/90 text-[10px] px-2 py-0.5 rounded-sm flex items-center gap-1">
                        <Eye className="w-3 h-3 text-studio-gold" />
                        B&amp;A
                      </span>
                    )}
                  </div>
                </div>

                {/* Visible Info Caption Below */}
                <div className="p-4 border-t border-studio-border/60 bg-studio-card flex items-center justify-between">
                  <div className="truncate pr-2">
                    <h4 className="font-serif text-sm font-bold text-studio-charcoal truncate group-hover:text-studio-gold transition-colors">
                      {image.title}
                    </h4>
                    <p className="text-[11px] text-studio-taupe truncate">
                      {image.category?.name || 'Graphite on Archival Cotton'}
                    </p>
                  </div>
                  <Maximize2 className="w-4 h-4 text-studio-taupe group-hover:text-studio-charcoal transition-colors shrink-0" />
                </div>
              </div>
            );
          })}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12 text-sm text-studio-taupe">
            No artworks found in this category.
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <Lightbox
        images={filteredImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </section>
  );
};
