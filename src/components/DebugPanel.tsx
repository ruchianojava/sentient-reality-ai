import React from 'react';
import { motion } from 'framer-motion';
import { X, Cpu, Globe, Database, Hash } from 'lucide-react';

interface DebugPanelProps {
  sensors: any;
  onClose: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ sensors, onClose }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 w-full md:w-80 bg-black/90 backdrop-blur-2xl border-l border-white/10 z-[100] p-6 font-mono text-xs overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-cyan-400 uppercase tracking-widest font-bold">
          <Cpu className="w-4 h-4" />
          Miro Debug_Sys
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        <section>
          <div className="text-white/40 mb-2 flex items-center gap-1">
            <Globe className="w-3 h-3" />
            GEOSPATIAL_STREAM
          </div>
          <div className="grid grid-cols-2 gap-2">
            <DataField label="LAT" value={sensors.gps.lat.toFixed(6)} />
            <DataField label="LNG" value={sensors.gps.lng.toFixed(6)} />
            <DataField label="ALT" value={`${sensors.gps.alt.toFixed(1)}m`} />
            <DataField label="ACC" value="0.992" />
          </div>
        </section>

        <section>
          <div className="text-white/40 mb-2 flex items-center gap-1">
            <Database className="w-3 h-3" />
            ENVIRONMENTAL_BUFF
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>HUMIDITY</span>
              <span className="text-cyan-400">{sensors.hygrometer}%</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500" style={{ width: `${sensors.hygrometer}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              <span>AMBIENT_NOISE</span>
              <span className="text-purple-400">{sensors.noise}dB</span>
            </div>
          </div>
        </section>

        <section>
          <div className="text-white/40 mb-2 flex items-center gap-1">
            <Hash className="w-3 h-3" />
            MEMORY_STACK
          </div>
          <div className="bg-white/5 rounded p-3 border border-white/10 overflow-hidden">
            <div className="text-[10px] text-green-500 mb-1 animate-pulse">> ANALYZING USER BEHAVIOR...</div>
            <div className="text-white/30 break-all leading-tight">
              0x4A 0x21 0xBC 0x99 0x12 0x34 0x56 0x78 0x90 0xAB 0xCD 0xEF 0xDE 0xAD 0xBE 0xEF
            </div>
          </div>
        </section>

        <section className="pt-4 border-t border-white/10">
          <div className="text-[10px] text-white/20 uppercase tracking-tighter">
            Build: v1.0.4-α_thought_engine
            <br />
            Last Synced: {new Date().toLocaleTimeString()}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

const DataField = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white/5 p-2 rounded border border-white/5">
    <div className="text-[9px] text-white/30">{label}</div>
    <div className="text-[11px] font-bold text-white/80">{value}</div>
  </div>
);

export default DebugPanel;