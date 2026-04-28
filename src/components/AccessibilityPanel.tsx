import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Type, Wind, Check } from 'lucide-react';
import { useAccessibility } from '../lib/AccessibilityContext';

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { contrast, font, motion: motionMode, toggleContrast, toggleFont, toggleMotion } = useAccessibility();

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:text-rainbow-blue transition-all"
        title="Accessibility Settings"
      >
        <Eye size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 z-[70] overflow-hidden"
            >
              <h3 className="text-lg font-black text-brand-dark mb-6">Inclusive Settings</h3>
              
              <div className="space-y-4">
                {/* Contrast */}
                <button 
                  onClick={toggleContrast}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border-2 ${
                    contrast === 'high' ? 'border-rainbow-blue bg-rainbow-blue/5 text-rainbow-blue' : 'border-slate-50 bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3 font-bold">
                    <Eye size={20} />
                    High Contrast
                  </div>
                  {contrast === 'high' && <Check size={18} />}
                </button>

                {/* Font */}
                <button 
                  onClick={toggleFont}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border-2 ${
                    font === 'dyslexic' ? 'border-rainbow-blue bg-rainbow-blue/5 text-rainbow-blue font-dyslexic' : 'border-slate-50 bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3 font-bold">
                    <Type size={20} />
                    Dyslexia Font
                  </div>
                  {font === 'dyslexic' && <Check size={18} />}
                </button>

                {/* Motion */}
                <button 
                  onClick={toggleMotion}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border-2 ${
                    motionMode === 'reduced' ? 'border-rainbow-blue bg-rainbow-blue/5 text-rainbow-blue' : 'border-slate-50 bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3 font-bold">
                    <Wind size={20} />
                    Reduced Motion
                  </div>
                  {motionMode === 'reduced' && <Check size={18} />}
                </button>
              </div>

              <p className="mt-6 text-[10px] text-center font-bold text-slate-400 p-2 bg-slate-50 rounded-xl">
                 PREFERENCES SAVED AUTOMATICALLY
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
