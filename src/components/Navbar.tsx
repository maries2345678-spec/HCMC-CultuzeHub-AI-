import React from 'react';
import { 
  Compass, 
  Award, 
  MessageSquare, 
  Gift, 
  Volume2, 
  VolumeX, 
  Sun, 
  Sunset, 
  Moon, 
  Sparkles,
  Users,
  Bot,
  Trophy,
  Camera,
  Shirt,
  Route,
  UserCheck,
  Palette
} from 'lucide-react';
import { UserProfile, HistoricalThemeId } from '../types';
import { getHistoricalSkin } from '../data/historicalThemes';
import { sound } from '../utils/audio';

interface NavbarProps {
  activeTab: 'map' | 'quests' | 'badges' | 'leaderboard' | 'forum' | 'chat' | 'rewards';
  setActiveTab: (tab: 'map' | 'quests' | 'badges' | 'leaderboard' | 'forum' | 'chat' | 'rewards') => void;
  user: UserProfile;
  timeOfDay: 'day' | 'sunset' | 'night';
  setTimeOfDay: (time: 'day' | 'sunset' | 'night') => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onOpenProfile: () => void;
  onOpenAI: () => void;
  onOpenAR: () => void;
  onOpenJournal?: () => void;
  onOpenAvatarCustomizer?: () => void;
  onOpenItineraryPlanner?: () => void;
  onOpenThemeModal?: () => void;
  currentThemeId?: HistoricalThemeId;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  timeOfDay,
  setTimeOfDay,
  isMuted,
  setIsMuted,
  onOpenProfile,
  onOpenAI,
  onOpenAR,
  onOpenJournal,
  onOpenAvatarCustomizer,
  onOpenItineraryPlanner,
  onOpenThemeModal,
  currentThemeId = 'classic_amber'
}) => {
  const currentSkin = getHistoricalSkin(currentThemeId);
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) {
      sound.playCycloBell();
    }
  };

  const cycleTimeOfDay = () => {
    sound.playClick();
    if (timeOfDay === 'day') setTimeOfDay('sunset');
    else if (timeOfDay === 'sunset') setTimeOfDay('night');
    else setTimeOfDay('day');
  };

  const navItems = [
    { id: 'map', label: 'Bản Đồ 3D', icon: Compass },
    { id: 'quests', label: 'Nhiệm Vụ (21)', icon: Sparkles },
    { id: 'badges', label: 'Bộ Huy Hiệu (21)', icon: Award },
    { id: 'leaderboard', label: 'Bảng Vàng', icon: Trophy },
    { id: 'forum', label: 'Diễn Đàn', icon: MessageSquare },
    { id: 'chat', label: 'Kênh Chat', icon: Users },
    { id: 'rewards', label: 'Đổi Thưởng', icon: Gift },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-amber-500/20 text-stone-200 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div 
          onClick={() => { sound.playTraditionalMelody(); setActiveTab('map'); }}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="brand-logo-btn"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-400 animate-spin-slow group-hover:rotate-45 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-['Cinzel',serif] font-bold text-base sm:text-lg tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                SÀI GÒN KỲ BÍ
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 hidden sm:inline-block">
                Đông Nam Bộ 3D
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block">
              TP.HCM • Bình Dương • Bà Rịa - Vũng Tàu
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(item.id as any);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                    : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Personalized Itinerary Planner Button */}
          {onOpenItineraryPlanner && (
            <button
              onClick={() => { sound.playClick(); onOpenItineraryPlanner(); }}
              id="open-itinerary-planner-navbar-btn"
              title="Lập Lộ Trình Di Sản Cá Nhân Hóa AI"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
            >
              <Route className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Lộ Trình AI</span>
            </button>
          )}

          {/* 3D Avatar Customizer Button */}
          {onOpenAvatarCustomizer && (
            <button
              onClick={() => { sound.playClick(); onOpenAvatarCustomizer(); }}
              id="open-avatar-customizer-navbar-btn"
              title="Trang Bị Cổ Trang & Avatar 3D"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
            >
              <Shirt className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Avatar Cổ Trang</span>
            </button>
          )}

          {/* Travel Journal Button */}
          {onOpenJournal && (
            <button
              onClick={() => { sound.playClick(); onOpenJournal(); }}
              id="open-travel-journal-navbar-btn"
              title="Mở Sổ Nhật Ký Lữ Hành Phương Nam"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-amber-950/40 border border-stone-800 text-stone-300 hover:text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-105 hidden xl:flex"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Nhật Ký</span>
            </button>
          )}

          {/* AR Camera Scanner Button */}
          <button
            onClick={() => { sound.playClick(); onOpenAR(); }}
            id="open-ar-scanner-btn"
            title="Mở máy quét Thực Tế Tăng Cường (AR) nhận diện di sản nhận +100 LP"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Quét AR</span>
            <span className="hidden md:inline px-1 py-0.2 rounded bg-stone-950/20 text-[9px] font-black">+100LP</span>
          </button>

          {/* AI Heritage Assistant Trigger */}
          <button
            onClick={onOpenAI}
            id="open-ai-assistant-btn"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600/30 to-amber-500/20 hover:from-amber-600/40 hover:to-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all animate-pulse"
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Ba Son AI</span>
          </button>

          {/* Historical Theme Skin Button */}
          {onOpenThemeModal && (
            <button
              onClick={() => { sound.playClick(); onOpenThemeModal(); }}
              id="open-theme-skin-navbar-btn"
              title={`Đổi Chủ Đề Thời Kỳ Lịch Sử (Đang chọn: ${currentSkin.name})`}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/30 text-stone-200 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
            >
              <div 
                className="w-2.5 h-2.5 rounded-full border border-stone-600 shadow-sm shrink-0" 
                style={{ backgroundColor: currentSkin.previewColors.primary }} 
              />
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">{currentSkin.badgeTag}</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            id="sound-toggle-btn"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Time of day toggle */}
          <button
            onClick={cycleTimeOfDay}
            id="time-of-day-btn"
            title={`Thời gian: ${timeOfDay === 'day' ? 'Ban ngày' : timeOfDay === 'sunset' ? 'Hoàng hôn' : 'Ban đêm'}`}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 transition-colors"
          >
            {timeOfDay === 'day' && <Sun className="w-4 h-4 text-amber-400" />}
            {timeOfDay === 'sunset' && <Sunset className="w-4 h-4 text-orange-400" />}
            {timeOfDay === 'night' && <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* User Profile Capsule */}
          <div
            onClick={onOpenProfile}
            id="user-profile-capsule-btn"
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-stone-900/90 hover:bg-stone-800 rounded-xl border border-amber-500/30 cursor-pointer shadow-md transition-all group"
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-7 h-7 rounded-lg object-cover border border-amber-400/50 group-hover:scale-105 transition-transform" 
            />
            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-bold text-stone-200 group-hover:text-amber-200 transition-colors leading-tight">
                {user.name}
              </div>
              <div className="text-[10px] text-amber-400 font-mono font-bold leading-tight">
                {user.lpPoints} LP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-stone-800/80 px-2 py-1.5 bg-stone-950/95 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(item.id as any);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
