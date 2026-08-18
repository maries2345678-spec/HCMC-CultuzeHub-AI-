import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  Layers,
  Maximize2,
  Radio,
  Tv,
  Share2,
  BookOpen
} from 'lucide-react';
import { Location3D, AITourScene } from '../types';
import { DynamicMotionVideoCanvas } from './DynamicMotionVideoCanvas';
import { sound } from '../utils/audio';

interface AITourCinemaModalProps {
  location: Location3D;
  initialSceneIndex?: number;
  onClose: () => void;
  onSelectOtherLocation?: (loc: Location3D) => void;
  allLocations?: Location3D[];
}

export const AITourCinemaModal: React.FC<AITourCinemaModalProps> = ({
  location,
  initialSceneIndex = 0,
  onClose,
  onSelectOtherLocation,
  allLocations = []
}) => {
  const videoData = location.aiTourVideo;
  const scenes = videoData?.scenes || [];

  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(initialSceneIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sceneProgress, setSceneProgress] = useState<number>(0);

  const currentScene: AITourScene | undefined = scenes[activeSceneIdx] || scenes[0];

  useEffect(() => {
    // Start voiceover narration
    if (currentScene && !isMuted) {
      sound.speakVietnamese(currentScene.narratorVoiceover, 1.0, 1.0);
    }
    return () => {
      sound.stopSpeech();
    };
  }, [location.id]);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSceneProgress(prev => {
          if (prev >= 100) {
            if (activeSceneIdx < scenes.length - 1) {
              setActiveSceneIdx(s => s + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 2.0;
        });
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeSceneIdx, scenes.length]);

  // Voice narration when scene changes
  useEffect(() => {
    if (isPlaying && currentScene && !isMuted) {
      sound.stopSpeech();
      sound.speakVietnamese(currentScene.narratorVoiceover, 1.0, 1.0);
    }
  }, [isPlaying, activeSceneIdx, isMuted]);

  const handleTogglePlay = () => {
    sound.playClick();
    const next = !isPlaying;
    setIsPlaying(next);
    if (next) {
      if (currentScene && !isMuted) {
        sound.speakVietnamese(currentScene.narratorVoiceover, 1.0, 1.0);
      }
    } else {
      sound.stopSpeech();
    }
  };

  const handleSelectScene = (idx: number) => {
    sound.playClick();
    setActiveSceneIdx(idx);
    setSceneProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between text-stone-100 p-3 sm:p-6 overflow-hidden animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 shadow-lg">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-['Cinzel',serif] text-base sm:text-xl font-bold text-amber-200">
                {videoData?.title || `Tour Flycam AI 4K Chuyển Động: ${location.name}`}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                Live AI Dynamic Tour
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">
              {videoData?.subtitle || location.shortDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Mute toggle */}
          <button
            onClick={() => {
              const next = !isMuted;
              setIsMuted(next);
              if (next) sound.stopSpeech();
              else if (currentScene) sound.speakVietnamese(currentScene.narratorVoiceover, 1.0, 1.0);
            }}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Close Button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-red-950/50 hover:text-red-400 text-stone-400 border border-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Theater Display Area */}
      <div className="relative flex-1 my-3 rounded-2xl overflow-hidden border border-amber-500/30 bg-black flex items-center justify-center shadow-2xl">
        <DynamicMotionVideoCanvas
          scene={currentScene}
          fallbackImage={location.coverImage || location.thumbnail}
          landmarkName={location.name}
          isPlaying={isPlaying}
          resolution={videoData?.resolution || '4K UHD 60FPS'}
          droneAlt={videoData?.droneAlt || '100m AGL'}
          isCinemaMode={true}
        />

        {/* Center Play Button Overlay if Paused */}
        {!isPlaying && (
          <button
            onClick={handleTogglePlay}
            className="absolute w-16 h-16 rounded-full bg-amber-500/90 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-2xl backdrop-blur-md transition-all hover:scale-110 z-20"
          >
            <Play className="w-8 h-8 fill-stone-950 translate-x-0.5" />
          </button>
        )}

        {/* Minimal Corner Scene Tag (Subtitles removed as requested) */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-stone-950/80 backdrop-blur-md border border-amber-500/30 shadow-lg z-20 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-bold text-amber-300">{currentScene?.name}</span>
          <span className="text-xs font-mono text-stone-400">({currentScene?.timeCode})</span>
        </div>

        {/* Bottom progress line */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-stone-950/80 z-20">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-yellow-300 transition-all duration-300"
            style={{ width: `${sceneProgress}%` }}
          />
        </div>
      </div>

      {/* Bottom Scene Timeline & Controls */}
      <div className="space-y-3 z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {scenes.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => handleSelectScene(idx)}
              className={`p-2.5 rounded-xl text-left transition-all border ${
                activeSceneIdx === idx
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/60 shadow-lg'
                  : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs truncate">{sc.name.split(':')[0]}</span>
                <span className="text-[10px] font-mono opacity-70">{sc.timeCode}</span>
              </div>
              <p className="text-[11px] text-stone-300 line-clamp-1">{sc.visualHighlight}</p>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-amber-500/20">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Tạm Dừng' : 'Tiếp Tục Chiếu'}</span>
            </button>

            <button
              onClick={() => {
                if (activeSceneIdx > 0) handleSelectScene(activeSceneIdx - 1);
              }}
              disabled={activeSceneIdx === 0}
              className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 disabled:opacity-40 border border-stone-800 text-xs font-semibold flex items-center gap-1"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>Cảnh trước</span>
            </button>

            <button
              onClick={() => {
                if (activeSceneIdx < scenes.length - 1) handleSelectScene(activeSceneIdx + 1);
              }}
              disabled={activeSceneIdx === scenes.length - 1}
              className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 disabled:opacity-40 border border-stone-800 text-xs font-semibold flex items-center gap-1"
            >
              <span>Cảnh sau</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Landmark Switcher */}
          {allLocations.length > 0 && onSelectOtherLocation && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 hidden md:inline">Chọn địa danh khác:</span>
              <select
                value={location.id}
                onChange={(e) => {
                  const target = allLocations.find(l => l.id === e.target.value);
                  if (target) onSelectOtherLocation(target);
                }}
                className="bg-stone-900 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                {allLocations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.province})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
