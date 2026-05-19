import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { 
  Mic, 
  Camera, 
  Navigation, 
  Droplets, 
  Settings, 
  Activity, 
  Bell, 
  CheckCircle2,
  AlertCircle,
  Menu,
  Terminal,
  Volume2,
  Bluetooth,
  Eye,
  Zap
} from 'lucide-react';
import MiroCore from './components/MiroCore';
import AROverlay from './components/AROverlay';
import VoiceInterface from './components/VoiceInterface';
import DebugPanel from './components/DebugPanel';
import { useMiroEngine } from './hooks/useMiroEngine';

export default function App() {
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { 
    state, 
    tasks, 
    sensors, 
    emotion, 
    toggleListening, 
    addTask, 
    completeTask 
  } = useMiroEngine(videoRef);

  useEffect(() => {
    // Simulate "locked screen" behavior or initial greeting
    toast.success("Miro is active", {
      description: "Sensors online. Listening for your voice.",
      icon: <Activity className="w-4 h-4" />,
    });
  }, []);

  return (
    <div className="relative h-[100dvh] w-full bg-black overflow-hidden font-sans text-white select-none">
      {/* AR Background Video Feed */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover opacity-60 grayscale-[0.3] brightness-75 transition-all duration-1000"
          style={{ transform: 'scale(1.1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://storage.googleapis.com/dala-prod-public-storage/generated-images/6ed044ef-6ade-434d-9d6d-a8d62f96ff21/ar-background-68232f79-1779221987568.webp')] opacity-10 mix-blend-overlay pointer-events-none" />
      </div>

      {/* AR Overlay Layer */}
      <AROverlay sensors={sensors} emotion={emotion} />

      {/* Persistent Ambient Indicator (Miro Core) */}
      <MiroCore 
        state={state} 
        emotion={emotion} 
        onClick={toggleListening} 
      />

      {/* Main UI Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 pointer-events-none">
        {/* Header */}
        <header className="flex justify-between items-start pointer-events-auto">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              Miro
            </h1>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/70 uppercase tracking-[0.2em]">
              <div className={`w-1.5 h-1.5 rounded-full ${state === 'listening' ? 'bg-red-500 animate-pulse' : 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]'}`} />
              System Status: {state.replace('-', ' ')}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setIsDebugOpen(!isDebugOpen)}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"
            >
              <Terminal className="w-5 h-5 text-cyan-400" />
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"
            >
              <Menu className="w-5 h-5 text-purple-400" />
            </button>
          </div>
        </header>

        {/* Voice & Tasks View */}
        <VoiceInterface 
          tasks={tasks} 
          state={state} 
          onComplete={completeTask}
          onAdd={addTask}
        />

        {/* Footer Info */}
        <footer className="flex justify-between items-end pointer-events-none">
          <div className="flex gap-4 opacity-50 text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-1">
              <Bluetooth className="w-3 h-3" />
              AIRPODS PRO
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Gaze Fixed
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs font-medium text-white/40 mb-1">LOCAL TIME</div>
            <div className="text-xl font-mono tabular-nums leading-none">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        </footer>
      </div>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {isDebugOpen && (
          <DebugPanel 
            sensors={sensors} 
            onClose={() => setIsDebugOpen(false)} 
          />
        )}
      </AnimatePresence>

      <Toaster position="top-center" theme="dark" closeButton />
    </div>
  );
}