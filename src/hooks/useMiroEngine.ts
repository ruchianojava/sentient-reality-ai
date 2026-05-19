import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  progress: number;
  time: string;
}

export function useMiroEngine(videoRef: React.RefObject<HTMLVideoElement>) {
  const [state, setState] = useState<'idle' | 'listening' | 'processing' | 'navigating' | 'looking'>('idle');
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('miro_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Analyze morning productivity', completed: false, progress: 65, time: '09:00' },
      { id: '2', title: 'Prepare for deep work session', completed: false, progress: 20, time: '10:30' },
    ];
  });

  const [sensors, setSensors] = useState({
    gps: { lat: 37.7749, lng: -122.4194, alt: 12 },
    hygrometer: 45,
    temperature: 22,
    noise: 30,
    audioSources: [
      { id: 1, angle: 45, intensity: 40 },
      { id: 2, angle: 280, intensity: 20 },
    ],
  });

  const [emotion, setEmotion] = useState('focused');

  // Persistence
  useEffect(() => {
    localStorage.setItem('miro_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Sensor Simulation & Hardware Integration
  useEffect(() => {
    // Camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setState('looking');
            setTimeout(() => setState('idle'), 2000);
          }
        })
        .catch((err) => console.error("Camera access denied:", err));
    }

    // GPS
    const geoId = navigator.geolocation.watchPosition(
      (pos) => {
        setSensors(prev => ({
          ...prev,
          gps: { 
            lat: pos.coords.latitude, 
            lng: pos.coords.longitude, 
            alt: pos.coords.altitude || 0 
          }
        }));
      },
      null,
      { enableHighAccuracy: true }
    );

    // Audio/Noise Simulation
    const noiseInterval = setInterval(() => {
      setSensors(prev => ({
        ...prev,
        noise: Math.floor(Math.random() * 20) + 20,
        hygrometer: Math.max(0, Math.min(100, prev.hygrometer + (Math.random() - 0.5))),
        audioSources: prev.audioSources.map(s => ({
          ...s,
          intensity: Math.max(0, Math.min(100, s.intensity + (Math.random() - 0.5) * 10))
        }))
      }));
    }, 2000);

    return () => {
      navigator.geolocation.clearWatch(geoId);
      clearInterval(noiseInterval);
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (state === 'listening') {
      setState('processing');
      setTimeout(() => {
        setState('idle');
        toast.info("Command Processed", {
          description: "Miro has updated your memory stack.",
        });
      }, 1500);
    } else {
      setState('listening');
      // Natural language feedback chime simulation
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    }
  }, [state]);

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      completed: false,
      progress: 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTasks([newTask, ...tasks]);
    toast.success("Memory Updated", {
      description: `New task: "${title}" added to queue.`,
    });
  };

  const completeTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed, progress: t.completed ? 0 : 100 } : t
    ));
    
    // Auditory feedback
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/600/600-preview.mp3');
    audio.volume = 0.1;
    audio.play().catch(() => {});
  };

  return {
    state,
    tasks,
    sensors,
    emotion,
    toggleListening,
    addTask,
    completeTask,
  };
}