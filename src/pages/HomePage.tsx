import React from 'react';
import { AnnouncementBar } from '../components/common/AnnouncementBar';
import { Header } from '../components/common/Header';
import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { ServicesSection } from '../components/home/ServicesSection';
import { GallerySection } from '../components/home/GallerySection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { PricingSection } from '../components/home/PricingSection';
import { FaqSection } from '../components/home/FaqSection';
import { CtaSection } from '../components/home/CtaSection';
import { Footer } from '../components/common/Footer';
import { useContent } from '../context/ContentContext';
import { Loader2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { isLoading, error } = useContent();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-studio-ivory flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-studio-gold animate-spin mb-4" />
        <span className="font-serif text-lg text-studio-charcoal">Loading Studio Portfolio...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-studio-ivory flex flex-col items-center justify-center p-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-studio-charcoal mb-2">Studio Offline</h2>
        <p className="text-sm text-studio-taupe max-w-md mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-studio-charcoal text-studio-ivory text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-studio-gold transition-colors"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-studio-ivory text-studio-charcoal selection:bg-studio-gold selection:text-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <GallerySection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};
