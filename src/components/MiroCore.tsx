import React from 'react';
import { motion } from 'framer-motion';

interface MiroCoreProps {
  state: 'idle' | 'listening' | 'processing' | 'navigating' | 'looking';
  emotion: string;
  onClick: () => void;
}

const MiroCore: React.FC<MiroCoreProps> = ({ state, emotion, onClick }) => {
  const getGlowColor = () => {
    if (state === 'listening') return 'rgba(239, 68, 68, 0.6)'; // Red
    if (state === 'processing') return 'rgba(168, 85, 247, 0.6)'; // Purple
    if (state === 'navigating') return 'rgba(34, 197, 94, 0.6)'; // Green
    
    // Default by emotion
    switch (emotion) {
      case 'happy': return 'rgba(234, 179, 8, 0.6)';
      case 'calm': return 'rgba(56, 189, 248, 0.6)';
      case 'focused': return 'rgba(34, 211, 238, 0.6)';
      default: return 'rgba(255, 255, 255, 0.3)';
    }
  };

  return (
    <div 
      className="fixed left-1/2 -translate-x-1/2 bottom-32 z-50 cursor-pointer pointer-events-auto"
      onClick={onClick}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer Halo */}
        <motion.div
          animate={{
            scale: state === 'listening' ? [1, 1.4, 1] : [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: state === 'listening' ? 0.8 : 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ backgroundColor: getGlowColor() }}
          className="absolute w-24 h-24 rounded-full blur-2xl"
        />

        {/* Pulsing Core */}
        <motion.div
          animate={{
            rotate: state === 'processing' ? 360 : 0,
            scale: state === 'listening' ? [1, 0.9, 1] : 1,
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.4, repeat: Infinity }
          }}
          className="relative w-16 h-16 rounded-full overflow-hidden border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl"
        >
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/6ed044ef-6ade-434d-9d6d-a8d62f96ff21/miro-core-base-d3d4c447-1779221987477.webp" 
            alt="Miro Core"
            className={`w-full h-full object-cover transition-all duration-700 ${state === 'listening' ? 'hue-rotate-90 contrast-125' : ''}`}
          />
          
          {/* Internal Geometric Elements */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
          
          {/* Activity Rings */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0.5 rounded-full border border-dashed border-white/20"
          />
        </motion.div>

        {/* Feedback Ring */}
        <AnimatePresence>
          {state === 'listening' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="absolute w-16 h-16 rounded-full border border-red-500/50"
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* State Label */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-4"
      >
        <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/60 blur-[0.3px]">
          {state === 'idle' ? 'Miro Active' : state}
        </span>
      </motion.div>
    </div>
  );
};

export default MiroCore;