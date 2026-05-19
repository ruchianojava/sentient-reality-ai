import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Plus, Mic, Send } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  progress: number;
  time: string;
}

interface VoiceInterfaceProps {
  tasks: Task[];
  state: string;
  onComplete: (id: string) => void;
  onAdd: (title: string) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ tasks, state, onComplete, onAdd }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pointer-events-auto flex flex-col gap-6 mb-12">
      {/* Transcript / AI Response area */}
      <div className="min-h-[60px] flex items-center justify-center text-center px-4">
        <AnimatePresence mode="wait">
          {state === 'listening' ? (
            <motion.div
              key="listening"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-lg font-light text-cyan-400 animate-pulse italic"
            >
              "Thinking... tell me what's on your mind."
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="text-sm font-medium tracking-wide text-white/40 uppercase"
            >
              {tasks.length > 0 ? `${tasks.filter(t => !t.completed).length} items pending in memory` : "Ready for instructions"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto scrollbar-hide">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`group flex items-center justify-between p-4 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
              task.completed 
                ? 'bg-white/5 border-white/5 opacity-50' 
                : 'bg-white/10 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onComplete(task.id)}
                className="transition-transform active:scale-90"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : (
                  <Circle className="w-6 h-6 text-white/30" />
                )}
              </button>
              <div>
                <div className={`text-sm font-medium transition-all ${task.completed ? 'line-through text-white/40' : 'text-white'}`}>
                  {task.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      className="h-full bg-cyan-400"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/30">{task.time}</span>
                </div>
              </div>
            </div>
            
            {!task.completed && (
              <Clock className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Manual Input (Fallback for voice-first design) */}
      <form 
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-1 pl-4 rounded-full bg-white/5 border border-white/10 focus-within:border-cyan-500/50 transition-colors"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="New thought..."
          className="flex-1 bg-transparent border-none outline-none text-sm py-2 placeholder:text-white/20"
        />
        <button 
          type="submit"
          className="p-2 rounded-full bg-cyan-500 text-black hover:bg-cyan-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default VoiceInterface;