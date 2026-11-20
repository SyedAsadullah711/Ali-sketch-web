import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PublicContentData } from '../types';
import { publicApi } from '../api/client';

interface ContentContextType {
  content: PublicContentData | null;
  isLoading: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
  isSectionVisible: (sectionKey: string) => boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<PublicContentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await publicApi.getContent();
      setContent(data);
    } catch (err: any) {
      console.error('Failed to load website content:', err);
      setError(err.message || 'Unable to connect to studio content.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const isSectionVisible = (sectionKey: string): boolean => {
    if (!content?.sections) return true;
    const section = content.sections.find((s) => s.sectionKey === sectionKey);
    return section ? section.isVisible : true;
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        isLoading,
        error,
        refreshContent: fetchContent,
        isSectionVisible,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
