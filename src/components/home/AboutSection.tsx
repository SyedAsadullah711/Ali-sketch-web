import React from 'react';
import { useContent } from '../../context/ContentContext';
import { Palette, Award, BookOpen, Quote } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { content, isSectionVisible } = useContent();

  if (!isSectionVisible('about')) return null;

  const settings = content?.settings;
  const heading = settings?.aboutHeading || 'The Artist Behind Every Stroke';
  const subheading =
    settings?.aboutSubheading || 'Fine art with soul, passion, and over a decade of graphite mastery.';
  const story =
    settings?.aboutStory ||
    'Stroke & Soul was founded with a singular conviction: that a hand-drawn pencil portrait possesses an emotional resonance photographs cannot match. Through nuanced gradients, sharp cross-hatching, and deep velvety charcoals, each drawing captures not merely a likeness, but the very essence and warmth of your cherished moments.';
  const experience =
    settings?.aboutExperience ||
    'With over 12 years of specialized graphite and charcoal portraiture, Alex Morgan has created more than 900 commissioned pieces for collectors and families across 24 countries.';
  const specialization =
    settings?.aboutSpecialization ||
    'Hyper-realistic graphite portraiture, fine expressive charcoal, delicate textural hair and fabric rendering, and legacy family portraits.';
  const philosophy =
    settings?.aboutPhilosophy ||
    'Every pencil stroke is deliberate. True art cannot be rushed; it is an intimate conversation between the artist’s eye, the graphite medium, and the subject’s soul.';
  const years = settings?.aboutYearsExperience || 12;
  const message =
    settings?.aboutPersonalMessage ||
    '“When you commission a sketch with me, you are trusting me with your memories. I treat every single portrait as an heirloom intended to grace your home for generations.”';
  const imageUrl =
    settings?.aboutImageUrl ||
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80';
  const artistName = settings?.artistName || 'Alex Morgan';

  return (
    <section id="about" className="py-20 lg:py-28 bg-studio-beige/30 border-b border-studio-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-[11px] uppercase tracking-widest text-studio-gold font-semibold">
            Biography &amp; Philosophy
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-studio-charcoal">
            {heading}
          </h2>
          <p className="text-sm sm:text-base text-studio-taupe font-light">
            {subheading}
          </p>
          <div className="w-12 h-0.5 bg-studio-gold mx-auto mt-4" />
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Artist Photo in Studio */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-[3/4] rounded-sm overflow-hidden bg-studio-beige border border-studio-border shadow-elevated relative">
                <img
                  src={imageUrl}
                  alt={`Artist ${artistName} sketching in fine art studio`}
                  className="w-full h-full object-cover filter contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />
                
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="font-serif text-xl font-bold">{artistName}</div>
                  <div className="text-xs text-studio-gold tracking-widest uppercase font-medium">
                    Principal Graphite &amp; Charcoal Artist
                  </div>
                </div>
              </div>

              {/* Years Experience Seal */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-studio-card p-4 rounded-sm shadow-xl border border-studio-border text-center">
                <div className="font-serif text-3xl font-bold text-studio-gold leading-none">
                  {years}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-studio-charcoal font-semibold mt-1">
                  Years Dedicated
                </div>
                <div className="text-[9px] text-studio-taupe">to Pencil Portraiture</div>
              </div>
            </div>
          </div>

          {/* Text & Pillars */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-studio-charcoal">
                Preserving Human Emotion on Heavyweight Archival Cotton
              </h3>
              <p className="text-sm text-studio-taupe leading-relaxed font-light">
                {story}
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-sm bg-studio-card border border-studio-border/70 shadow-soft space-y-2">
                <div className="w-8 h-8 rounded-full bg-studio-gold/10 flex items-center justify-center text-studio-gold">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-studio-charcoal">
                  Experience &amp; Heritage
                </h4>
                <p className="text-xs text-studio-taupe leading-relaxed">
                  {experience}
                </p>
              </div>

              <div className="p-5 rounded-sm bg-studio-card border border-studio-border/70 shadow-soft space-y-2">
                <div className="w-8 h-8 rounded-full bg-studio-gold/10 flex items-center justify-center text-studio-gold">
                  <Palette className="w-4 h-4" />
                </div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-studio-charcoal">
                  Artistic Specialization
                </h4>
                <p className="text-xs text-studio-taupe leading-relaxed">
                  {specialization}
                </p>
              </div>

              <div className="p-5 rounded-sm bg-studio-card border border-studio-border/70 shadow-soft space-y-2 sm:col-span-2">
                <div className="w-8 h-8 rounded-full bg-studio-gold/10 flex items-center justify-center text-studio-gold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-studio-charcoal">
                  Creative Philosophy
                </h4>
                <p className="text-xs text-studio-taupe leading-relaxed">
                  {philosophy}
                </p>
              </div>
            </div>

            {/* Signed Artist Quote */}
            <div className="p-6 rounded-sm bg-studio-card border-l-2 border-studio-gold shadow-soft relative">
              <Quote className="w-6 h-6 text-studio-gold/30 absolute top-4 right-4" />
              <p className="font-cormorant italic text-lg sm:text-xl text-studio-charcoal leading-relaxed">
                {message}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs tracking-widest uppercase font-semibold text-studio-taupe">
                  — {artistName}
                </span>
                <span className="font-cormorant italic text-sm text-studio-gold">
                  Stroke &amp; Soul Studio
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
