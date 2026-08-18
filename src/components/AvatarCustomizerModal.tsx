import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Award,
  Shirt,
  Compass,
  Crown,
  Palette,
  Eye,
  Zap,
  Check,
  Lock,
  RotateCcw,
  Layers,
  Image as ImageIcon,
  Share2
} from 'lucide-react';
import { 
  UserProfile, 
  AvatarCustomization, 
  CostumeId, 
  HeadwearId, 
  AccessoryId, 
  AvatarPose, 
  AvatarAura, 
  AvatarBackdrop 
} from '../types';
import { Avatar3DViewer } from './Avatar3DViewer';
import {
  COSTUME_DEFINITIONS,
  HEADWEAR_DEFINITIONS,
  ACCESSORY_DEFINITIONS,
  BACKDROP_DEFINITIONS,
  DEFAULT_AVATAR_CUSTOMIZATION,
  getAvatarCustomization,
  saveAvatarCustomization,
  unlockCostumeItem,
  unlockHeadwearItem,
  unlockAccessoryItem
} from '../utils/avatarStorage';
import { sound } from '../utils/audio';

interface AvatarCustomizerModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateAvatarCustomization: (custom: AvatarCustomization) => void;
  onDeductLP?: (amount: number) => void;
}

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateAvatarCustomization,
  onDeductLP
}) => {
  const [custom, setCustom] = useState<AvatarCustomization>(() => {
    return user?.avatarCustomization || getAvatarCustomization();
  });

  const [activeCategory, setActiveCategory] = useState<'costumes' | 'headwear' | 'accessories' | 'appearance' | 'aura_backdrop'>('costumes');

  if (!isOpen) return null;

  const currentCostume = COSTUME_DEFINITIONS[custom.costumeId] || COSTUME_DEFINITIONS.costume_ba_ba;
  const currentHeadwear = HEADWEAR_DEFINITIONS[custom.headwearId] || HEADWEAR_DEFINITIONS.none;
  const currentAccessory = ACCESSORY_DEFINITIONS[custom.accessoryId] || ACCESSORY_DEFINITIONS.none;

  const handleSave = () => {
    sound.playSuccess();
    saveAvatarCustomization(custom);
    onUpdateAvatarCustomization(custom);
    onClose();
  };

  const handleUnlockCostume = (cId: CostumeId) => {
    const item = COSTUME_DEFINITIONS[cId];
    if (user.lpPoints < item.requiredLP) {
      alert(`Bạn cần ${item.requiredLP} LP để mở khóa trang phục này! Hiện có ${user.lpPoints} LP.`);
      return;
    }
    if (user.badgesUnlocked.length < item.requiredBadges) {
      alert(`Bạn cần ít nhất ${item.requiredBadges} huy hiệu để mở khóa trang phục này!`);
      return;
    }

    if (onDeductLP && item.requiredLP > 0) {
      onDeductLP(item.requiredLP);
    }
    sound.playSuccess();
    const updated = unlockCostumeItem(cId);
    setCustom(prev => ({
      ...prev,
      unlockedCostumes: updated.unlockedCostumes,
      costumeId: cId
    }));
  };

  const handleUnlockHeadwear = (hId: HeadwearId) => {
    const item = HEADWEAR_DEFINITIONS[hId];
    if (user.lpPoints < item.requiredLP) {
      alert(`Bạn cần ${item.requiredLP} LP để mở khóa nón này!`);
      return;
    }
    if (onDeductLP && item.requiredLP > 0) {
      onDeductLP(item.requiredLP);
    }
    sound.playSuccess();
    const updated = unlockHeadwearItem(hId);
    setCustom(prev => ({
      ...prev,
      unlockedHeadwears: updated.unlockedHeadwears,
      headwearId: hId
    }));
  };

  const handleUnlockAccessory = (aId: AccessoryId) => {
    const item = ACCESSORY_DEFINITIONS[aId];
    if (user.lpPoints < item.requiredLP) {
      alert(`Bạn cần ${item.requiredLP} LP để mở khóa phụ kiện này!`);
      return;
    }
    if (onDeductLP && item.requiredLP > 0) {
      onDeductLP(item.requiredLP);
    }
    sound.playSuccess();
    const updated = unlockAccessoryItem(aId);
    setCustom(prev => ({
      ...prev,
      unlockedAccessories: updated.unlockedAccessories,
      accessoryId: aId
    }));
  };

  const skinTones = [
    { id: '#fcd34d', label: 'Tự Nhiên' },
    { id: '#fef08a', label: 'Sáng Thanh Tú' },
    { id: '#d97706', label: 'Rám Nắng Phương Nam' },
    { id: '#92400e', label: 'Ngăm Miệt Vườn' },
    { id: '#fed7aa', label: 'Hồng Hào' }
  ];

  const hairColors = [
    { id: '#1c1917', label: 'Đen Tuyền' },
    { id: '#451a03', label: 'Hạt Dẻ Cổ Điển' },
    { id: '#292524', label: 'Than Đen' },
    { id: '#78350f', label: 'Nâu Đồng' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-5xl bg-stone-900 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl text-stone-100 relative max-h-[95vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-stone-950 text-stone-400 hover:text-stone-100 hover:bg-red-950/40 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-500/20 pb-3 gap-2 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Crown className="w-5 h-5" />
              </span>
              <h2 className="font-['Cinzel',serif] text-lg sm:text-2xl font-bold text-amber-200">
                Phòng Thử Cổ Trang & Tùy Biến Avatar 3D
              </h2>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Trang bị cổ phục Nam Bộ, nón lá, khăn rằn và pháp bảo di sản để nhận điểm thưởng & diện kiến cộng đồng
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-stone-950 border border-amber-500/30 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-stone-300 font-medium">Linh Điểm (LP):</span>
              <span className="font-mono font-bold text-amber-300 text-sm">{user.lpPoints} LP</span>
            </div>
          </div>
        </div>

        {/* Main Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-3 flex-1 overflow-y-auto pr-1">
          {/* Left Column: 3D Live Avatar Preview Canvas (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between p-4 rounded-2xl bg-stone-950 border border-amber-500/30 space-y-3">
            <div className="text-center w-full">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                MÔ PHỎNG 3D LIVE CHARACTER
              </span>
              <h3 className="font-bold text-sm text-stone-200 truncate">
                {currentCostume.name}
              </h3>
            </div>

            {/* The 3D SVG Avatar Render */}
            <div className="relative flex items-center justify-center w-full py-2">
              <Avatar3DViewer
                customization={custom}
                size="xl"
                showBackdrop={true}
                className="shadow-2xl ring-2 ring-amber-500/30"
              />
            </div>

            {/* Active Stat Buff Summary Box */}
            <div className="w-full p-3 rounded-xl bg-stone-900/90 border border-amber-500/20 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Hiệu Ứng Trang Bị:
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  +{currentCostume.bonusLP}% LP • +{currentCostume.bonusExp}% EXP
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                <strong>Phụ kiện: </strong>{currentAccessory.name} ({currentAccessory.perk})
              </p>
              <p className="text-[10px] text-stone-400 italic">
                "{currentCostume.culturalNote}"
              </p>
            </div>
          </div>

          {/* Right Column: Customization Controls & Item Categories (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            {/* Category Switcher Tabs */}
            <div className="flex items-center gap-1.5 border-b border-stone-800 pb-2 overflow-x-auto shrink-0">
              {[
                { id: 'costumes', label: '👘 Cổ Phục Nam Bộ', icon: Shirt },
                { id: 'headwear', label: '👒 Nón & Khăn Xếp', icon: Crown },
                { id: 'accessories', label: '🧭 Bảo Vật Cầm Tay', icon: Compass },
                { id: 'appearance', label: '🎨 Khuôn Mặt & Tóc', icon: Palette },
                { id: 'aura_backdrop', label: '✨ Hào Quang & Di Tích', icon: ImageIcon }
              ].map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveCategory(cat.id as any);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
                      activeCategory === cat.id
                        ? 'bg-amber-500 text-stone-950 font-extrabold shadow-lg shadow-amber-500/20'
                        : 'bg-stone-950 text-stone-400 hover:text-amber-200 border border-stone-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Category Content Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {/* TAB 1: TRANG PHỤC CỔ TRANG */}
              {activeCategory === 'costumes' && (
                <div className="space-y-2.5">
                  <p className="text-xs text-stone-400">
                    Chọn trang phục lịch sử để khoác lên avatar. Các trang phục cao cấp mang lại hiệu ứng cộng dồn điểm thưởng LP:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.values(COSTUME_DEFINITIONS).map(item => {
                      const isUnlocked = custom.unlockedCostumes.includes(item.id);
                      const isEquipped = custom.costumeId === item.id;
                      const canUnlock = user.lpPoints >= item.requiredLP && user.badgesUnlocked.length >= item.requiredBadges;

                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                            isEquipped
                              ? 'bg-amber-950/40 border-amber-400 shadow-md ring-1 ring-amber-400'
                              : isUnlocked
                              ? 'bg-stone-950 border-stone-800 hover:border-amber-500/40'
                              : 'bg-stone-950/50 border-stone-900 opacity-75'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl p-1.5 rounded-xl bg-stone-900 border border-stone-800">
                                {item.icon}
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-stone-100">{item.name}</h4>
                                <span className="text-[10px] text-amber-400 font-semibold">{item.period}</span>
                              </div>
                            </div>
                            {isEquipped && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-extrabold flex items-center gap-1">
                                <Check className="w-3 h-3" /> Đang Mặc
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="flex items-center justify-between pt-1 border-t border-stone-800/80 text-[10px]">
                            <span className="text-emerald-400 font-bold">
                              +{item.bonusLP}% LP • +{item.bonusExp}% EXP
                            </span>

                            {isUnlocked ? (
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  setCustom(c => ({ ...c, costumeId: item.id }));
                                }}
                                disabled={isEquipped}
                                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                                  isEquipped
                                    ? 'bg-stone-800 text-stone-500 cursor-default'
                                    : 'bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/40'
                                }`}
                              >
                                {isEquipped ? 'Đang Mặc' : 'Mặc Ngay'}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnlockCostume(item.id)}
                                disabled={!canUnlock}
                                className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 text-[10px] ${
                                  canUnlock
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 shadow'
                                    : 'bg-stone-900 text-stone-500 border border-stone-800 cursor-not-allowed'
                                }`}
                              >
                                <Lock className="w-3 h-3" />
                                <span>Mở Khóa: {item.requiredLP} LP ({item.requiredBadges}🏅)</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: NÓN & KHĂN ĐÓNG */}
              {activeCategory === 'headwear' && (
                <div className="space-y-2.5">
                  <p className="text-xs text-stone-400">
                    Đội nón lá quai thao, khăn đóng hoàng triều hoặc mũ beret ký giả Sài Gòn:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.values(HEADWEAR_DEFINITIONS).map(item => {
                      const isUnlocked = custom.unlockedHeadwears.includes(item.id);
                      const isEquipped = custom.headwearId === item.id;
                      const canUnlock = user.lpPoints >= item.requiredLP;

                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                            isEquipped
                              ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-400'
                              : isUnlocked
                              ? 'bg-stone-950 border-stone-800 hover:border-amber-500/40'
                              : 'bg-stone-950/50 border-stone-900 opacity-75'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl p-1.5 rounded-xl bg-stone-900 border border-stone-800">
                                {item.icon}
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-stone-100">{item.name}</h4>
                                <span className="text-[10px] text-amber-400">{item.period}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-[11px] text-stone-300">{item.description}</p>

                          <div className="flex items-center justify-between pt-1 border-t border-stone-800 text-[10px]">
                            <span className="text-stone-400">
                              {item.requiredLP === 0 ? 'Miễn phí' : `${item.requiredLP} LP`}
                            </span>

                            {isUnlocked ? (
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  setCustom(c => ({ ...c, headwearId: item.id }));
                                }}
                                disabled={isEquipped}
                                className={`px-3 py-1 rounded-xl font-bold ${
                                  isEquipped
                                    ? 'bg-stone-800 text-stone-500'
                                    : 'bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/40'
                                }`}
                              >
                                {isEquipped ? 'Đang Đội' : 'Đội Ngay'}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnlockHeadwear(item.id)}
                                disabled={!canUnlock}
                                className="px-2.5 py-1 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center gap-1 disabled:opacity-40"
                              >
                                <Lock className="w-3 h-3" /> Mở: {item.requiredLP} LP
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: BẢO VẬT CẦM TAY & PHỤ KIỆN */}
              {activeCategory === 'accessories' && (
                <div className="space-y-2.5">
                  <p className="text-xs text-stone-400">
                    Bảo vật trang bị trên tay giúp kích hoạt đặc quyền độc nhất trong suốt hành trình:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.values(ACCESSORY_DEFINITIONS).map(item => {
                      const isUnlocked = custom.unlockedAccessories.includes(item.id);
                      const isEquipped = custom.accessoryId === item.id;
                      const canUnlock = user.lpPoints >= item.requiredLP;

                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                            isEquipped
                              ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-400'
                              : isUnlocked
                              ? 'bg-stone-950 border-stone-800 hover:border-amber-500/40'
                              : 'bg-stone-950/50 border-stone-900 opacity-75'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl p-1.5 rounded-xl bg-stone-900 border border-stone-800">
                                {item.icon}
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-stone-100">{item.name}</h4>
                                <span className="text-[10px] text-cyan-400 font-semibold">{item.perk}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-[11px] text-stone-300">{item.description}</p>

                          <div className="flex items-center justify-between pt-1 border-t border-stone-800 text-[10px]">
                            <span className="text-amber-400 font-bold">{item.requiredLP} LP</span>

                            {isUnlocked ? (
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  setCustom(c => ({ ...c, accessoryId: item.id }));
                                }}
                                disabled={isEquipped}
                                className={`px-3 py-1 rounded-xl font-bold ${
                                  isEquipped
                                    ? 'bg-stone-800 text-stone-500'
                                    : 'bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/40'
                                }`}
                              >
                                {isEquipped ? 'Đang Cầm' : 'Trang Bị'}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnlockAccessory(item.id)}
                                disabled={!canUnlock}
                                className="px-2.5 py-1 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center gap-1 disabled:opacity-40"
                              >
                                <Lock className="w-3 h-3" /> Mở: {item.requiredLP} LP
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: DIỆN MẠO, TÓC & BIỂU CẢM */}
              {activeCategory === 'appearance' && (
                <div className="space-y-4">
                  {/* Kiểu Tóc */}
                  <div>
                    <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
                      Kiểu Tóc Di Sản
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'traditional_bun', label: 'Búi Tóc Cổ Truyền', icon: '団' },
                        { id: 'vintage_wavy', label: 'Gợn Sóng Tân Thời', icon: '🌊' },
                        { id: 'modern_short', label: 'Ngắn Năng Động', icon: '✂️' },
                        { id: 'scholar_ponytail', label: 'Cột Cao Học Giả', icon: '📜' }
                      ].map(h => (
                        <button
                          key={h.id}
                          onClick={() => {
                            sound.playClick();
                            setCustom(c => ({ ...c, hairStyle: h.id as any }));
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                            custom.hairStyle === h.id
                              ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                              : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-amber-500/40'
                          }`}
                        >
                          <span className="text-base block mb-1">{h.icon}</span>
                          {h.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tông Da */}
                  <div>
                    <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
                      Sắc Da Phương Nam
                    </label>
                    <div className="flex items-center gap-3">
                      {skinTones.map(st => (
                        <button
                          key={st.id}
                          onClick={() => {
                            sound.playClick();
                            setCustom(c => ({ ...c, skinTone: st.id }));
                          }}
                          className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center transition-transform ${
                            custom.skinTone === st.id ? 'scale-110 border-amber-400 ring-2 ring-amber-400/40' : 'border-stone-700'
                          }`}
                          style={{ backgroundColor: st.id }}
                          title={st.label}
                        >
                          {custom.skinTone === st.id && <Check className="w-4 h-4 text-stone-950" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Màu Tóc */}
                  <div>
                    <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
                      Màu Tóc
                    </label>
                    <div className="flex items-center gap-3">
                      {hairColors.map(hc => (
                        <button
                          key={hc.id}
                          onClick={() => {
                            sound.playClick();
                            setCustom(c => ({ ...c, hairColor: hc.id }));
                          }}
                          className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center transition-transform ${
                            custom.hairColor === hc.id ? 'scale-110 border-amber-400 ring-2 ring-amber-400/40' : 'border-stone-700'
                          }`}
                          style={{ backgroundColor: hc.id }}
                          title={hc.label}
                        >
                          {custom.hairColor === hc.id && <Check className="w-4 h-4 text-amber-300" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Biểu Cảm Khuôn Mặt */}
                  <div>
                    <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
                      Biểu Cảm Khuôn Mặt
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'smile', label: 'Tươi Cười Rạng Rỡ', icon: '😊' },
                        { id: 'scholarly', label: 'Điềm Tĩnh Học Giả', icon: '🧐' },
                        { id: 'proud', label: 'Tự Hào Di Sản', icon: '🌟' },
                        { id: 'focus', label: 'Tập Trung Giải Mã', icon: '🎯' }
                      ].map(exp => (
                        <button
                          key={exp.id}
                          onClick={() => {
                            sound.playClick();
                            setCustom(c => ({ ...c, expression: exp.id as any }));
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                            custom.expression === exp.id
                              ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                              : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-amber-500/40'
                          }`}
                        >
                          <span className="text-base block mb-1">{exp.icon}</span>
                          {exp.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: HÀO QUANG & BỐI CẢNH DI TÍCH 3D */}
              {activeCategory === 'aura_backdrop' && (
                <div className="space-y-4">
                  {/* Hào Quang Aura */}
                  <div>
                    <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
                      Hào Quang Di Sản Huyền Ảo
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'royal_gold', label: 'Ánh Vàng Hoàng Gia', color: '#fbbf24' },
                        { id: 'heritage_fire', label: 'Lửa Thiêng Di Sản', color: '#f97316' },
                        { id: 'southern_ocean', label: 'Sóng Biển Phương Nam', color: '#38bdf8' },
                        { id: 'ancient_jade', label: 'Ngọc Bích Cổ Vật', color: '#34d399' },
                        { id: 'none', label: 'Tắt Hào Quang', color: '#71717a' }
                      ].map(a => (
                        <button
                          key={a.id}
                          onClick={() => {
                            sound.playClick();
                            setCustom(c => ({ ...c, aura: a.id as any }));
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all flex items-center justify-center gap-2 ${
                            custom.aura === a.id
                              ? 'bg-amber-950/40 border-amber-400 text-amber-200 ring-1 ring-amber-400'
                              : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                          <span>{a.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bối Cảnh Di Tích */}
                  <div>
                    <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
                      Phông Nền Di Tích Phương Nam
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {Object.values(BACKDROP_DEFINITIONS).map(b => (
                        <button
                          key={b.id}
                          onClick={() => {
                            sound.playClick();
                            setCustom(c => ({ ...c, backdrop: b.id }));
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                            custom.backdrop === b.id
                              ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-400 text-amber-200'
                              : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-amber-500/40 hover:text-stone-200'
                          }`}
                        >
                          <span className="text-2xl p-2 rounded-xl bg-stone-900 border border-stone-800">
                            {b.landmarkSilhouette}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-xs text-stone-100 truncate">{b.name}</h5>
                            <span className="text-[10px] text-amber-400">{b.province}</span>
                          </div>
                          {custom.backdrop === b.id && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-amber-500/20 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setCustom(DEFAULT_AVATAR_CUSTOMIZATION);
            }}
            className="px-3.5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc định</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-semibold transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 text-xs font-black shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Check className="w-4 h-4" />
              <span>Lưu & Trang Bị Avatar 3D</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
