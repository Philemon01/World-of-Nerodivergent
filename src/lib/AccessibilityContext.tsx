import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  contrast: 'normal' | 'high';
  font: 'normal' | 'dyslexic';
  motion: 'normal' | 'reduced';
  toggleContrast: () => void;
  toggleFont: () => void;
  toggleMotion: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contrast, setContrast] = useState<'normal' | 'high'>(() => 
    (localStorage.getItem('acc-contrast') as 'normal' | 'high') || 'normal'
  );
  const [font, setFont] = useState<'normal' | 'dyslexic'>(() => 
    (localStorage.getItem('acc-font') as 'normal' | 'dyslexic') || 'normal'
  );
  const [motion, setMotion] = useState<'normal' | 'reduced'>(() => 
    (localStorage.getItem('acc-motion') as 'normal' | 'reduced') || 'normal'
  );

  useEffect(() => {
    localStorage.setItem('acc-contrast', contrast);
    localStorage.setItem('acc-font', font);
    localStorage.setItem('acc-motion', motion);
    
    // Apply classes to document root
    const root = document.documentElement;
    root.classList.remove('acc-high-contrast', 'acc-dyslexic-font', 'acc-reduced-motion');
    
    if (contrast === 'high') root.classList.add('acc-high-contrast');
    if (font === 'dyslexic') root.classList.add('acc-dyslexic-font');
    if (motion === 'reduced') root.classList.add('acc-reduced-motion');
  }, [contrast, font, motion]);

  const toggleContrast = () => setContrast(prev => prev === 'normal' ? 'high' : 'normal');
  const toggleFont = () => setFont(prev => prev === 'normal' ? 'dyslexic' : 'normal');
  const toggleMotion = () => setMotion(prev => prev === 'normal' ? 'reduced' : 'normal');

  return (
    <AccessibilityContext.Provider value={{ contrast, font, motion, toggleContrast, toggleFont, toggleMotion }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
