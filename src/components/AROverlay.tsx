import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, Droplets, Thermometer, MapPin, Compass } from 'lucide-react';

interface SensorData {
  gps: { lat: number; lng: number; alt: number };
  hygrometer: number;
  temperature: number;
  noise: number;
  audioSources: { id: number; angle: number; intensity: number }[];
}

interface AROverlayProps {
  sensors: SensorData;
  emotion: string;
}

const AROverlay: React.FC<AROverlayProps> = ({ sensors, emotion }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Corner Brackets */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/20 rounded-tl-xl" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-xl" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/20 rounded-bl-xl" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/20 rounded-br-xl" />

      {/* Sound Localization Indicators */}
      {sensors.audioSources.map((source) => (
        <motion.div
          key={source.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: source.intensity / 100,
            scale: 1,
            x: Math.cos((source.angle * Math.PI) / 180) * 150 + window.innerWidth / 2,
            y: Math.sin((source.angle * Math.PI) / 180) * 150 + window.innerHeight / 2,
          }}
          className="absolute w-4 h-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-75" />
            <div className="absolute inset-0 bg-cyan-500 rounded-full shadow-[0_0_10px_#22d3ee]" />
          </div>
        </motion.div>
      ))}

      {/* Contextual Data Widgets */}
      <div className="absolute top-32 left-8 flex flex-col gap-6">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3 bg-black/30 backdrop-blur-md border border-white/10 p-3 rounded-lg"
        >
          <div className="p-2 bg-blue-500/20 rounded-md">
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-[10px] text-white/40 font-mono uppercase">Humidity</div>
            <div className="text-sm font-bold">{sensors.hygrometer}%</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 bg-black/30 backdrop-blur-md border border-white/10 p-3 rounded-lg"
        >
          <div className="p-2 bg-orange-500/20 rounded-md">
            <Thermometer className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <div className="text-[10px] text-white/40 font-mono uppercase">Temp</div>
            <div className="text-sm font-bold">{sensors.temperature}°C</div>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-32 right-8 flex flex-col gap-6 items-end">
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3 bg-black/30 backdrop-blur-md border border-white/10 p-3 rounded-lg text-right"
        >
          <div>
            <div className="text-[10px] text-white/40 font-mono uppercase">Location</div>
            <div className="text-xs font-bold font-mono tracking-tighter">
              {sensors.gps.lat.toFixed(4)}N {sensors.gps.lng.toFixed(4)}E
            </div>
          </div>
          <div className="p-2 bg-green-500/20 rounded-md">
            <MapPin className="w-4 h-4 text-green-400" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 bg-black/30 backdrop-blur-md border border-white/10 p-3 rounded-lg text-right"
        >
          <div>
            <div className="text-[10px] text-white/40 font-mono uppercase">Emotion</div>
            <div className="text-sm font-bold capitalize">{emotion}</div>
          </div>
          <div className="p-2 bg-purple-500/20 rounded-md">
            <Navigation className="w-4 h-4 text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* Horizon/Level Indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-[1px] bg-white/10">
        <div className="absolute top-0 left-0 w-4 h-2 border-l border-white/40" />
        <div className="absolute top-0 right-0 w-4 h-2 border-r border-white/40" />
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 border border-white/20 rotate-45" />
      </div>
    </div>
  );
};

export default AROverlay;