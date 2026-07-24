'use client';

import React, { createContext, useContext } from 'react';
import { Locale } from '@/lib/constants';

// Interfaces
export interface SystemSettings {
  address?: Record<string, string>;
  googleMaps?: string;
  hours?: string;
  phone?: string;
  zalo?: string;
  facebook?: string;
}

export interface AboutStoryGalleryItem {
  id: string;
  src: string;
  caption: Record<string, string>;
}

export interface AboutStoryContent {
  section1?: {
    image: string;
    title: Record<string, string>;
    items: Record<string, string>[];
  };
  section2?: {
    image: string;
    title: Record<string, string>;
    items: Record<string, string>[];
  };
  section3?: {
    title: Record<string, string>;
    detail: Record<string, string>;
  };
  gallery?: AboutStoryGalleryItem[];
}

interface SystemSettingsContextType {
  systemSettings: SystemSettings;
  aboutStoryContent: AboutStoryContent;
  getLocalizedText: (textObj: Record<string, string> | undefined, locale: Locale, fallback?: string) => string;
}

const SystemSettingsContext = createContext<SystemSettingsContextType>({
  systemSettings: {},
  aboutStoryContent: {},
  getLocalizedText: () => '',
});

export const useSystemSettings = () => useContext(SystemSettingsContext);

export const SystemSettingsProvider = ({
  children,
  systemSettings = {},
  aboutStoryContent = {},
}: {
  children: React.ReactNode;
  systemSettings?: any;
  aboutStoryContent?: any;
}) => {
  
  const getLocalizedText = (textObj: Record<string, string> | undefined, locale: Locale, fallback = '') => {
    if (!textObj) return fallback;
    return textObj[locale] || textObj['vi'] || fallback;
  };

  return (
    <SystemSettingsContext.Provider
      value={{
        systemSettings,
        aboutStoryContent,
        getLocalizedText
      }}
    >
      {children}
    </SystemSettingsContext.Provider>
  );
};
