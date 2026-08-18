import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Sparkles, 
  Wind, 
  Sun, 
  Layers, 
  Radio, 
  Maximize2, 
  RotateCw,
  Scan,
  Zap
} from 'lucide-react';
import { AITourScene } from '../types';

interface DynamicMotionVideoCanvasProps {
  scene: AITourScene;
  fallbackImage: string;
  landmarkName: string;
  isPlaying: boolean;
  resolution?: string;
  droneAlt?: string;
  className?: string;
  isCinemaMode?: boolean;
}

export const DynamicMotionVideoCanvas: React.FC<DynamicMotionVideoCanvasProps> = ({
  scene,
  fallbackImage,
  landmarkName,
  isPlaying,
  resolution = '4K UHD 60FPS',
  droneAlt = '100m AGL',
  className = '',
  isCinemaMode = false
}) => {
  // Motion camera animation parameters
  const [motionType, setMotionType] = useState<'pan_zoom_in' | 'pan_zoom_out' | 'diagonal_drift' | 'drone_flyover'>('pan_zoom_in');
  const [cameraSpeed, setCameraSpeed] = useState<number>(1.0);
  const [visionFilter, setVisionFilter] = useState<'cinematic' | 'golden_hour' | 'historical_scan' | 'night_glamour'>('cinematic');
  
  // Realtime simulated telemetry
  const [telemetry, setTelemetry] = useState({
    altitude: 105,
    speed: 34.2,
    pitch: -4.5,
    roll: 1.2,
    heading: 142,
    gpsLat: 10.7769,
    gpsLng: 106.7009
  });

  // Switch camera motion pattern on scene change
  useEffect(() => {
    const motions: ('pan_zoom_in' | 'pan_zoom_out' | 'diagonal_drift' | 'drone_flyover')[] = [
      'pan_zoom_in',
      'pan_zoom_out',
      'diagonal_drift',
      'drone_flyover'
    ];
    const nextMotion = motions[Math.floor(Math.random() * motions.length)];
    setMotionType(nextMotion);
  }, [scene?.id]);

  // Live telemetry updater
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        altitude: Math.round(100 + Math.sin(Date.now() / 1500) * 12),
        speed: Number((32 + Math.cos(Date.now() / 2000) * 4).toFixed(1)),
        pitch: Number((-5 + Math.sin(Date.now() / 1800) * 3).toFixed(1)),
        roll: Number((Math.sin(Date.now() / 2500) * 2.5).toFixed(1)),
        heading: (prev.heading + 1) % 360,
        gpsLat: Number((10.7769 + Math.sin(Date.now() / 5000) * 0.0008).toFixed(5)),
        gpsLng: Number((106.7009 + Math.cos(Date.now() / 5000) * 0.0008).toFixed(5))
      }));
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Motion class calculations
  const getMotionAnimationClass = () => {
    if (!isPlaying) return 'scale-100 transform-none';
    switch (motionType) {
      case 'pan_zoom_in':
        return 'animate-cameraZoomIn duration-[12000ms] ease-out';
      case 'pan_zoom_out':
        return 'animate-cameraZoomOut duration-[12000ms] ease-out';
      case 'diagonal_drift':
        return 'animate-cameraDiagonal duration-[14000ms] ease-in-out';
      case 'drone_flyover':
        return 'animate-cameraFlyover duration-[15000ms] ease-in-out';
      default:
        return 'animate-pulse duration-[6000ms]';
    }
  };

  const imageUrl = scene?.snapshotUrl || fallbackImage;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-stone-950 select-none ${className}`}>
      {/* 1. Cinematic Background Layer with Dynamic Ken Burns Motion */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imageUrl}
          alt={landmarkName}
          className={`w-full h-full object-cover transition-all will-change-transform ${getMotionAnimationClass()} ${
            visionFilter === 'golden_hour' ? 'sepia-[0.3] contrast-110 saturate-125' :
            visionFilter === 'historical_scan' ? 'grayscale contrast-125' :
            visionFilter === 'night_glamour' ? 'brightness-90 contrast-125 hue-rotate-15' :
            'contrast-[1.08] saturate-[1.12]'
          }`}
          style={{
            transformOrigin: motionType === 'diagonal_drift' ? 'top left' : 'center center'
          }}
        />
      </div>

      {/* 2. Dynamic Weather & Atmosphere Visual FX */}
      {/* 🌅 Golden Hour Sun Flare Beams */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen">
          <div className="absolute -top-16 -right-16 w-80 h-80 bg-gradient-to-br from-amber-400/40 via-yellow-500/20 to-transparent rounded-full blur-3xl animate-pulse duration-[4000ms]" />
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl animate-pulse duration-[6000ms]" />
        </div>
      )}

      {/* 🌫️ Flowing Atmospheric Mist & Cloud Drift */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay animate-subtleDrift">
          <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12" />
        </div>
      )}

      {/* ✨ Floating Golden Heritage Particles */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b] animate-ping duration-[3000ms]" />
          <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-yellow-200 shadow-[0_0_10px_#fbbf24] animate-pulse duration-[2500ms]" />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-rose-300 shadow-[0_0_8px_#fb7185] animate-ping duration-[4000ms]" />
        </div>
      )}

      {/* 📺 Historical Reconstruction Scanlines (if active) */}
      {visionFilter === 'historical_scan' && (
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-60 animate-scanline" />
      )}

      {/* 3. Cinematic Film Vignette & Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/60 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />

      {/* 4. Live Drone Flycam Telemetry & Gimbal HUD */}
      <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between pointer-events-none font-mono">
        {/* Top HUD: Flight Mode, Resolution, Alt & Speed */}
        <div className="flex items-center justify-between text-xs text-amber-300/90 drop-shadow">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-950/80 backdrop-blur-md border border-amber-500/40">
              <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-stone-500'}`} />
              <span className="font-bold uppercase tracking-wider text-[11px]">
                {isPlaying ? 'REC AI FLYCAM' : 'STANDBY'}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-stone-950/80 backdrop-blur-md border border-amber-500/30 text-[10px]">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>GIMBAL 3-AXIS 360°</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <div className="px-2.5 py-1 rounded-xl bg-stone-950/80 backdrop-blur-md border border-amber-500/40 flex items-center gap-2">
              <span className="text-stone-400">ALT:</span>
              <span className="text-amber-300 font-bold">{telemetry.altitude}m</span>
              <span className="text-stone-500">|</span>
              <span className="text-stone-400">SPD:</span>
              <span className="text-cyan-300 font-bold">{telemetry.speed} km/h</span>
            </div>
            <div className="px-2 py-1 rounded-xl bg-amber-500 text-stone-950 font-black text-[10px] hidden md:block">
              {resolution}
            </div>
          </div>
        </div>

        {/* Center Drone Crosshair & Horizon Indicator */}
        <div className="absolute inset-0 m-auto w-32 h-32 flex items-center justify-center pointer-events-none opacity-40">
          {/* Circular reticle */}
          <div className="w-24 h-24 rounded-full border border-amber-400/60 border-dashed animate-spin-slow" />
          {/* Horizontal Level Line */}
          <div 
            className="absolute w-28 h-0.5 bg-amber-400/80 transition-transform duration-300"
            style={{ transform: `rotate(${telemetry.roll}deg)` }}
          />
          {/* Center Point */}
          <div className="absolute w-2 h-2 rounded-full bg-red-400" />
          {/* Pitch brackets */}
          <div className="absolute top-2 w-4 h-1 border-t border-amber-400" />
          <div className="absolute bottom-2 w-4 h-1 border-b border-amber-400" />
        </div>

        {/* Bottom Coordinates & Camera Angle Banner */}
        <div className="flex items-end justify-between text-[10px] text-amber-200/80 drop-shadow">
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-xl bg-stone-950/80 backdrop-blur-md border border-amber-500/30">
              <span className="font-bold text-amber-400">GPS: </span>
              <span>{telemetry.gpsLat}° N, {telemetry.gpsLng}° E</span>
            </div>
            <div className="px-2 py-1 rounded-xl bg-stone-950/80 backdrop-blur-md border border-amber-500/30 hidden sm:block">
              <span>HDG: {telemetry.heading}° SE</span>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-stone-950/80 backdrop-blur-md border border-amber-500/30 font-sans font-bold text-amber-300">
            {scene?.cameraLabel || 'Flycam Khảo Sát Toàn Cảnh'}
          </div>
        </div>
      </div>

      {/* 5. Vision Filter Switcher (Overlay on bottom right if Cinema Mode) */}
      {isCinemaMode && (
        <div className="absolute top-16 right-4 flex flex-col gap-1.5 z-20">
          {[
            { id: 'cinematic', label: '🎬 Chuẩn 4K', icon: Zap },
            { id: 'golden_hour', label: '🌅 Nắng Vàng', icon: Sun },
            { id: 'historical_scan', label: '📜 Quét Cổ', icon: Scan },
            { id: 'night_glamour', label: '✨ Huyền Ảo', icon: Sparkles }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setVisionFilter(f.id as any)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                visionFilter === f.id
                  ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                  : 'bg-stone-950/80 text-stone-300 hover:bg-stone-900 border border-stone-800 backdrop-blur-md'
              }`}
            >
              <span>{f.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
