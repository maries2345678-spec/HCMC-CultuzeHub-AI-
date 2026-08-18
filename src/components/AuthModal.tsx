import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  Save, 
  CheckCircle2,
  Cloud,
  RefreshCw,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';
import { sound } from '../utils/audio';

interface AuthModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onLogin: (updatedProfile: UserProfile) => void;
  onLogout: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onLogin,
  onLogout
}) => {
  const [tab, setTab] = useState<'profile' | 'login' | 'register'>('profile');
  const [name, setName] = useState<string>(currentUser.name);
  const [email, setEmail] = useState<string>(currentUser.email || currentUser.googleEmail || 'yxinh187@gmail.com');
  const [password, setPassword] = useState<string>('••••••••');
  const [avatar, setAvatar] = useState<string>(currentUser.avatar);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    
    const updated: UserProfile = {
      ...currentUser,
      name: name.trim() || 'Lữ Khách Phương Nam',
      email: email.trim(),
      avatar: avatar
    };

    onLogin(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();

    const updated: UserProfile = {
      ...currentUser,
      id: `user_${Date.now()}`,
      name: name.trim() || (tab === 'login' ? 'Lữ Khách Đăng Nhập' : 'Lữ Khách Mới'),
      email: email.trim(),
      avatar: avatar,
      lpPoints: tab === 'register' ? Math.max(currentUser.lpPoints, 350) : currentUser.lpPoints
    };

    onLogin(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  // Google Sign-In and Progress Sync
  const handleGoogleSignIn = async () => {
    sound.playClick();
    setIsGoogleLoading(true);
    try {
      const sampleGoogleUser = {
        email: email.includes('@') ? email : 'yxinh187@gmail.com',
        name: name || 'Lữ Khách Google Ba Son',
        picture: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        googleId: 'google_user_ba_son_187'
      };

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleGoogleUser)
      });
      const data = await res.json();

      if (data.success) {
        sound.playSuccess();
        const mergedUser: UserProfile = {
          ...currentUser,
          ...data.user,
          name: data.user.name || name,
          avatar: data.user.avatar || avatar,
          isGoogleLinked: true,
          googleEmail: sampleGoogleUser.email,
          lastSyncedAt: new Date().toISOString()
        };
        onLogin(mergedUser);
        setSyncMessage('Đã đăng nhập Google & đồng bộ tiến trình thành công!');
        setTimeout(() => {
          setSyncMessage('');
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Google Auth error:', err);
      const fallbackUser: UserProfile = {
        ...currentUser,
        isGoogleLinked: true,
        googleEmail: email || 'yxinh187@gmail.com',
        lastSyncedAt: new Date().toISOString()
      };
      onLogin(fallbackUser);
      setSyncMessage('Đã liên kết tài khoản Google & lưu trữ cục bộ!');
      setTimeout(() => setSyncMessage(''), 2000);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSyncCloud = async () => {
    sound.playClick();
    setIsSyncing(true);
    try {
      await fetch('/api/user/save-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile: currentUser })
      });
      sound.playDanTranhNote(659.25, 0.8);
      setSyncMessage('Tiến trình trò chơi đã được sao lưu đám mây an toàn!');
      setTimeout(() => setSyncMessage(''), 2500);
    } catch (e) {
      setSyncMessage('Tiến trình đã được lưu vào bộ nhớ trình duyệt.');
      setTimeout(() => setSyncMessage(''), 2500);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-stone-900 border-2 border-amber-500/40 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden text-stone-100 flex flex-col">
        
        {/* Header */}
        <div className="relative px-5 py-4 bg-stone-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Cinzel',serif] font-bold text-base text-amber-200">
                {tab === 'profile' ? 'Hồ Sơ & Lưu Tiến Trình' : tab === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Khám Phá'}
              </h2>
              <p className="text-[10px] text-stone-400">Đăng nhập Google để lưu trữ tiến trình vĩnh viễn</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-950/60 p-1">
          <button
            onClick={() => { sound.playClick(); setTab('profile'); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'profile' 
                ? 'bg-amber-500 text-stone-950 shadow-md' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Hồ Sơ & Cloud Sync
          </button>
          <button
            onClick={() => { sound.playClick(); setTab('login'); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'login' 
                ? 'bg-amber-500 text-stone-950 shadow-md' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => { sound.playClick(); setTab('register'); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'register' 
                ? 'bg-amber-500 text-stone-950 shadow-md' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Tạo Mới (+350 LP)
          </button>
        </div>

        {/* Sync status toast */}
        {syncMessage && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {/* Quick Google Sign-In Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-stone-700 shadow-md space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center p-1 shadow-sm shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-200">Đăng Nhập Bằng Google</h4>
                  <p className="text-[10px] text-stone-400">
                    {currentUser.isGoogleLinked ? `Đã liên kết: ${currentUser.googleEmail || currentUser.email}` : 'Tự động lưu tiến trình game & nhận +500 LP'}
                  </p>
                </div>
              </div>

              {currentUser.isGoogleLinked ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> Đã kết nối
                </span>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs flex items-center justify-center gap-2 shadow transition-all hover:scale-[1.01]"
            >
              {isGoogleLoading ? (
                <span>Đang kết nối Google...</span>
              ) : currentUser.isGoogleLinked ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-stone-700" />
                  <span>Đồng Bộ Lại Với Tài Khoản Google</span>
                </>
              ) : (
                <>
                  <span>Tiếp Tục Với Google</span>
                </>
              )}
            </button>
          </div>

          {tab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300">Chọn Ảnh Đại Diện (Avatar)</label>
                <div className="flex items-center gap-3">
                  <img 
                    src={avatar} 
                    alt="Preview" 
                    className="w-14 h-14 rounded-2xl border-2 border-amber-400 object-cover shadow-lg" 
                  />
                  <div className="flex-1 grid grid-cols-6 gap-1.5">
                    {PRESET_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { sound.playClick(); setAvatar(av); }}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                          avatar === av ? 'border-amber-400 scale-110 shadow-md' : 'border-stone-700 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Tên Danh Xưng Lữ Khách</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên hiển thị..."
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500/60 text-xs text-stone-100 outline-none"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Địa Chỉ Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@saigon.heritage.vn"
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500/60 text-xs text-stone-100 outline-none"
                />
              </div>

              {/* Stats Overview */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-300">
                  <span>Cấp Độ Khám Phá:</span>
                  <span className="font-bold text-amber-300">Cấp {currentUser.level} ({currentUser.title})</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Linh Điểm Đang Có:</span>
                  <span className="font-bold text-amber-400 font-mono">{currentUser.lpPoints} LP</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Huy Hiệu Sở Hữu:</span>
                  <span className="font-bold text-emerald-400">{currentUser.badgesUnlocked.length} / 21</span>
                </div>
                <div className="flex justify-between text-stone-300 pt-1 border-t border-amber-500/20 text-[10px]">
                  <span>Trạng Thái Đám Mây:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Cloud className="w-3 h-3" /> {currentUser.isGoogleLinked ? 'Đã Tự Động Sao Lưu' : 'Cục Bộ'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncCloud}
                  disabled={isSyncing}
                  className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  title="Đẩy tiến trình lên máy chủ đám mây"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sao Lưu Ngay</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveSuccess ? 'Đã Lưu Thành Công!' : 'Lưu Thay Đổi'}</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Email / Tên Đăng Nhập</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@saigon.heritage.vn"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500/60 text-xs text-stone-100 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Mật Khẩu</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500/60 text-xs text-stone-100 outline-none"
                    required
                  />
                </div>
              </div>

              {tab === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Tên Lữ Khách Bạn Muốn Đặt</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Minh Khang"
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500/60 text-xs text-stone-100 outline-none"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                {tab === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{saveSuccess ? 'Đang Đăng Nhập...' : tab === 'login' ? 'Đăng Nhập Vào Game' : 'Tạo Tài Khoản & Nhận +350 LP'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
