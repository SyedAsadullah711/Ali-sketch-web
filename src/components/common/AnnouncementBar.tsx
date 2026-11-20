import React from 'react';
import { useContent } from '../../context/ContentContext';
import { Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { content, isSectionVisible } = useContent();

  if (!isSectionVisible('announcement')) return null;

  const settings = content?.settings;
  if (!settings || settings.announcementVisible === false || !settings.announcementText) {
    return null;
  }

  const bg = settings.announcementBg || '#292722';
  const color = settings.announcementTextColor || '#F7F3EB';

  return (
    <div
      style={{ backgroundColor: bg, color }}
      className="py-2.5 px-4 text-center text-xs tracking-widest font-medium uppercase transition-colors duration-300 relative z-50 flex items-center justify-center gap-2 border-b border-black/10"
    >
      <Sparkles className="w-3.5 h-3.5 text-studio-gold animate-pulse" />
      <span>{settings.announcementText}</span>
      <Sparkles className="w-3.5 h-3.5 text-studio-gold animate-pulse" />
    </div>
  );
};
