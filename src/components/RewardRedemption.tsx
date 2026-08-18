import React, { useState, useRef, useEffect } from 'react';
import { 
  Gift, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  QrCode, 
  Download, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  X,
  ExternalLink,
  Compass,
  Briefcase,
  Check,
  Shield,
  Zap,
  Tag,
  Package,
  Layers,
  Flame,
  RotateCcw,
  Coins,
  Ticket,
  Trophy,
  Coffee,
  MapPin,
  Eye
} from 'lucide-react';
import { RewardItem, UserProfile } from '../types';
import { REWARDS } from '../data/rewards';
import { sound } from '../utils/audio';
import { 
  getLearningMemory, 
  toggleEquipGear, 
  addGearToInventory, 
  getActiveTravelerBuffs,
  EquippedGearItem 
} from '../utils/learningStorage';

interface RewardRedemptionProps {
  user?: UserProfile;
  currentUser?: UserProfile;
  rewards?: RewardItem[];
  userLP?: number;
  badgesCount?: number;
  onRedeemReward: (reward: RewardItem) => boolean;
}

interface ChestType {
  id: string;
  name: string;
  costLP: number;
  tier: 'bronze' | 'silver' | 'gold';
  color: string;
  borderColor: string;
  description: string;
  possiblePrizes: string[];
}

const CHEST_TYPES: ChestType[] = [
  {
    id: 'chest_bronze',
    name: 'Rương Đồng Cổ Điển',
    costLP: 50,
    tier: 'bronze',
    color: 'from-amber-800 to-amber-950',
    borderColor: 'border-amber-700/60',
    description: 'Rương cổ sơ cấp chứa voucher giảm giá 20-30%, điểm LP may mắn hoặc huy hiệu lưu niệm.',
    possiblePrizes: ['+80 Linh Điểm LP', 'Voucher Cà Phê Vợt Ba Lù 20k', 'Huy Hiệu Cổ Vật Đồng', '+50 EXP']
  },
  {
    id: 'chest_silver',
    name: 'Rương Bạc Nam Kỳ',
    costLP: 120,
    tier: 'silver',
    color: 'from-slate-600 to-slate-900',
    borderColor: 'border-slate-400/60',
    description: 'Rương bạc chứa vé bảo tàng miễn phí, voucher ẩm thực Chợ Bến Thành và trang bị du hành quý.',
    possiblePrizes: ['+250 Linh Điểm LP', 'Vé Miễn Phí Bảo Tàng TP.HCM', 'Kính Lúp Soi Cổ Vật', 'Voucher Cơm Tấm 50k']
  },
  {
    id: 'chest_gold',
    name: 'Rương Vàng Hoàng Gia Gia Định',
    costLP: 250,
    tier: 'gold',
    color: 'from-yellow-500 via-amber-600 to-amber-950',
    borderColor: 'border-yellow-400',
    description: 'Báu vật hoàng gia chứa quà gốm sứ thủ công Đại Hưng cao cấp, vé du thuyền sông Sài Gòn và buff siêu cấp.',
    possiblePrizes: ['+600 Linh Điểm LP', 'Vé Du Thuyền Sông Sài Gòn 5 Sao', 'Bình Men Lam Cổ Truyền', 'Bộ Sưu Tập La Bàn Đồng']
  }
];

export const RewardRedemption: React.FC<RewardRedemptionProps> = ({
  user,
  currentUser,
  rewards,
  userLP,
  badgesCount,
  onRedeemReward
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'scratch' | 'chest' | 'inventory'>('store');
  const [selectedRewardForRedeem, setSelectedRewardForRedeem] = useState<RewardItem | null>(null);
  const [activeVoucher, setActiveVoucher] = useState<{ reward: RewardItem; code: string; date: string } | null>(null);
  const [equippedMemory, setEquippedMemory] = useState(getLearningMemory());

  // 🎴 Scratch Card Interactive Canvas State
  const scratchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scratchProgress, setScratchProgress] = useState<number>(0);
  const [isScratchCardActive, setIsScratchCardActive] = useState<boolean>(true);
  const [isScratchRevealed, setIsScratchRevealed] = useState<boolean>(false);
  const [scratchCardPrize, setScratchCardPrize] = useState<{ name: string; type: string; value: string }>({
    name: 'Voucher 50.000đ Cà Phê Vợt Sài Gòn Xưa',
    type: 'voucher',
    value: '50.000 VNĐ'
  });

  // 📦 Chest Opening State
  const [openingChest, setOpeningChest] = useState<ChestType | null>(null);
  const [chestResult, setChestResult] = useState<{ name: string; desc: string; icon: string } | null>(null);
  const [isChestOpeningAnim, setIsChestOpeningAnim] = useState<boolean>(false);

  const activeUser = user || currentUser;
  const currentLP = activeUser?.lpPoints ?? userLP ?? 0;
  const currentBadgesCount = activeUser?.badgesUnlocked?.length ?? badgesCount ?? 0;
  const rewardsList = rewards || REWARDS || [];

  const activeBuffs = getActiveTravelerBuffs();

  // Initialize Scratch Canvas
  useEffect(() => {
    if (activeTab === 'scratch' && scratchCanvasRef.current && !isScratchRevealed) {
      initScratchCanvas();
    }
  }, [activeTab, isScratchCardActive, isScratchRevealed]);

  const initScratchCanvas = () => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 340;
    canvas.height = 180;

    // Fill with metallic gold scratch coating
    const grad = ctx.createLinearGradient(0, 0, 340, 180);
    grad.addColorStop(0, '#d97706');
    grad.addColorStop(0.5, '#fbbf24');
    grad.addColorStop(1, '#b45309');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 340, 180);

    // Decorative pattern
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let i = 0; i < 340; i += 20) {
      ctx.fillRect(i, 0, 2, 180);
    }

    // Overlay text
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#451a03';
    ctx.textAlign = 'center';
    ctx.fillText('✨ CÀO NHẸ ĐỂ MỞ BẢO VẬT ✨', 170, 85);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#78350f';
    ctx.fillText('Dùng ngón tay hoặc chuột để cào lớp mạ vàng', 170, 110);

    setScratchProgress(0);
    setIsScratchRevealed(false);
  };

  const handleScratchMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isScratchRevealed) return;
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      if (e.buttons !== 1) return; // Only when mouse button pressed
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    sound.playScratchCardSound();

    // Check scratched percentage
    setScratchProgress(prev => {
      const next = prev + 3.5;
      if (next >= 65 && !isScratchRevealed) {
        setIsScratchRevealed(true);
        sound.playVoucherUnlockedSound();
      }
      return next;
    });
  };

  const handleResetScratchCard = () => {
    sound.playClick();
    const prizes = [
      { name: 'Voucher 50.000đ Cà Phê Vợt Sài Gòn Xưa', type: 'voucher', value: '50.000 VNĐ' },
      { name: 'Thưởng Nóng +100 Linh Điểm (LP)', type: 'lp', value: '+100 LP' },
      { name: 'Vé Miễn Phí Bảo Tàng Mỹ Thuật TP.HCM', type: 'ticket', value: 'Vé VIP' },
      { name: 'Huy Hiệu Lưu Niệm Gốm Lái Thiêu', type: 'souvenir', value: 'Cổ Vật' },
      { name: 'Voucher Giảm 30% Thưởng Thức Bánh Khọt Cô Ba', type: 'cuisine', value: '-30%' }
    ];
    const picked = prizes[Math.floor(Math.random() * prizes.length)];
    setScratchCardPrize(picked);
    setIsScratchRevealed(false);
    setTimeout(() => {
      initScratchCanvas();
    }, 100);
  };

  const handleOpenChest = (chest: ChestType) => {
    if (currentLP < chest.costLP) {
      sound.playError();
      return;
    }

    sound.playClick();
    setOpeningChest(chest);
    setIsChestOpeningAnim(true);
    sound.playChestOpeningSound();

    setTimeout(() => {
      setIsChestOpeningAnim(false);
      const prizePick = chest.possiblePrizes[Math.floor(Math.random() * chest.possiblePrizes.length)];
      setChestResult({
        name: prizePick,
        desc: `Chúc mừng bạn đã mở thành công ${chest.name}! Phần thưởng đã được nạp tự động vào tài khoản lữ khách.`,
        icon: chest.tier === 'gold' ? '👑' : chest.tier === 'silver' ? '💎' : '🪙'
      });
      sound.playVoucherUnlockedSound();
    }, 1800);
  };

  const handleToggleEquip = (gearId: string) => {
    sound.playClick();
    toggleEquipGear(gearId);
    setEquippedMemory(getLearningMemory());
  };

  const handleConfirmRedeem = () => {
    if (!selectedRewardForRedeem) return;

    const success = onRedeemReward(selectedRewardForRedeem);
    if (success) {
      sound.playVoucherUnlockedSound();
      const voucherCode = `SG-${selectedRewardForRedeem.id.toUpperCase().replace('REW_', '').slice(0, 8)}-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // If it is traveler gear, add to player inventory automatically
      if (selectedRewardForRedeem.id.startsWith('rew_gear_')) {
        let buffName = 'Trang Bị Thám Hiểm';
        let buffDescription = selectedRewardForRedeem.description;
        let bonusLP = 0;
        let bonusExp = 0;

        if (selectedRewardForRedeem.id.includes('magnifier')) {
          buffName = 'Kính Lúp Soi Cổ Vật';
          buffDescription = 'Nhận thêm +20% Điểm Thám Hiểm (LP) khi trả lời đúng lần đầu';
          bonusLP = 20;
        } else if (selectedRewardForRedeem.id.includes('tumbler')) {
          buffName = 'Bình Giữ Nhiệt Lữ Khách';
          buffDescription = 'Tăng +15% EXP nhân vật và bảo vệ năng lượng hành trình';
          bonusExp = 15;
        } else if (selectedRewardForRedeem.id.includes('flashlight')) {
          buffName = 'Đèn Pin Dã Ngoại';
          buffDescription = 'Soi sáng tự động lọc bớt 1 đáp án sai trong câu hỏi';
        }

        const newGear: EquippedGearItem = {
          id: selectedRewardForRedeem.id,
          name: selectedRewardForRedeem.name,
          category: 'tool',
          icon: 'Package',
          buffName,
          buffDescription,
          acquiredDate: new Date().toLocaleDateString('vi-VN'),
          isEquipped: true,
          bonusLPPercent: bonusLP,
          bonusExpPercent: bonusExp
        };
        addGearToInventory(newGear);
        setEquippedMemory(getLearningMemory());
      }

      setActiveVoucher({
        reward: selectedRewardForRedeem,
        code: voucherCode,
        date: new Date().toLocaleDateString('vi-VN')
      });
      setSelectedRewardForRedeem(null);
    } else {
      sound.playError();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner & LP Balance */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/60 to-stone-900 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Đổi Thưởng Di Sản Thế Hệ Mới
            </span>
          </div>
          <h2 className="font-['Cinzel',serif] font-bold text-2xl sm:text-3xl text-amber-200">
            Kho Tàng Đổi Thưởng & May Mắn Phương Nam
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            Dùng Linh Điểm (LP) quy đổi vé tham quan bảo tàng, voucher ẩm thực, trang bị dã ngoại, cào thẻ may mắn trúng quà và khai mở Rương Báu Di Sản Hoàng Gia!
          </p>
        </div>

        {/* User Balance Display Card */}
        <div className="bg-stone-950/90 p-5 rounded-2xl border border-amber-500/40 min-w-[250px] flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-stone-950 shadow-md">
            <Coins className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Linh Điểm Khả Dụng</p>
            <p className="text-2xl font-black font-mono text-amber-300">{currentLP} LP</p>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {currentBadgesCount} Huy hiệu di sản
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'store', label: '🎁 Cửa Hàng Quà Tặng & Vé', icon: Gift },
          { id: 'scratch', label: '🎴 Thẻ Cào May Mắn Tri Ân', icon: Sparkles },
          { id: 'chest', label: '📦 Rương Báu Cổ Truyền', icon: Trophy },
          { id: 'inventory', label: '🎒 Tủ Đồ & Hiệu Ứng Buff', icon: Package }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 border ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 border-amber-300 shadow-lg font-black scale-105'
                  : 'bg-stone-900/90 text-stone-400 hover:text-stone-200 border-stone-800 hover:border-amber-500/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 🎴 TAB 1: INTERACTIVE SCRATCH CARD */}
      {activeTab === 'scratch' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 border border-amber-500/40 shadow-2xl flex flex-col items-center text-center space-y-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                Vé Cào May Mắn Hàng Ngày
              </span>
              <h3 className="font-['Cinzel',serif] font-bold text-xl sm:text-2xl text-amber-200 mt-2">
                Thẻ Cào Tri Ân Lữ Khách Phương Nam
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto mt-1">
                Dùng ngón tay hoặc chuột di chuyển trên lớp nhũ vàng để cào mở phần quà bất ngờ!
              </p>
            </div>

            {/* Scratch Card Container */}
            <div className="relative w-[340px] h-[180px] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400 bg-gradient-to-tr from-stone-950 via-stone-900 to-stone-950 flex flex-col items-center justify-center p-4">
              {/* Prize Behind the Scratch Coating */}
              <div className="text-center space-y-2 z-0 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 mx-auto flex items-center justify-center text-2xl">
                  🎁
                </div>
                <h4 className="font-bold text-amber-300 text-sm">{scratchCardPrize.name}</h4>
                <span className="px-3 py-0.5 rounded-full bg-emerald-500 text-stone-950 font-black text-xs">
                  MÃ TRÚNG: {scratchCardPrize.value}
                </span>
              </div>

              {/* Scratchable Canvas Layer */}
              <canvas
                ref={scratchCanvasRef}
                onMouseMove={handleScratchMove}
                onTouchMove={handleScratchMove}
                className="absolute inset-0 cursor-crosshair z-10 touch-none"
              />
            </div>

            {/* Scratch Status & Reset */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetScratchCard}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Nhận Thẻ Cào Mới (Miễn Phí)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📦 TAB 2: MYSTERY TREASURE CHESTS */}
      {activeTab === 'chest' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-stone-950 border border-amber-500/30 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-amber-200 text-base flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Khai Mở Rương Báu Di Sản Cổ Truyền
              </h3>
              <p className="text-xs text-stone-400">
                Mỗi chiếc rương chứa đựng những bí bảo di sản, voucher và vật phẩm tăng tốc thám hiểm độc quyền.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400">Số dư hiện tại:</span>
              <p className="text-lg font-black text-amber-300 font-mono">{currentLP} LP</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CHEST_TYPES.map((chest) => {
              const canAfford = currentLP >= chest.costLP;
              return (
                <div
                  key={chest.id}
                  className={`rounded-3xl border p-6 flex flex-col justify-between bg-gradient-to-b ${chest.color} ${chest.borderColor} shadow-2xl transition-all hover:scale-105 group relative overflow-hidden`}
                >
                  {/* Decorative Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-4 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-black/40 border border-amber-400/30 mx-auto flex items-center justify-center text-4xl shadow-inner group-hover:rotate-6 transition-transform">
                      {chest.tier === 'gold' ? '👑' : chest.tier === 'silver' ? '💎' : '🪙'}
                    </div>

                    <div>
                      <h4 className="font-['Cinzel',serif] font-bold text-lg text-amber-200">
                        {chest.name}
                      </h4>
                      <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                        {chest.description}
                      </p>
                    </div>

                    {/* Possible Items */}
                    <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/20 text-left space-y-1.5 text-xs">
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        Vật phẩm có thể mở:
                      </p>
                      {chest.possiblePrizes.map((pz, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-stone-200">
                          <Sparkles className="w-3 h-3 text-yellow-400 shrink-0" />
                          <span>{pz}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-amber-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400">Giá mở rương:</span>
                      <p className="font-mono font-bold text-amber-300 text-base">{chest.costLP} LP</p>
                    </div>

                    <button
                      onClick={() => handleOpenChest(chest)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 hover:from-amber-400 hover:to-yellow-300 hover:scale-105'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{canAfford ? 'Mở Rương' : 'Không Đủ LP'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🎒 TAB 3: INVENTORY & ACTIVE BUFFS */}
      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Active Buffs Summary */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-stone-900 border border-amber-500/30 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-200">
                  Hiệu Ứng Trang Bị Đang Kích Hoạt ({activeBuffs.equippedCount} món)
                </h4>
                <p className="text-xs text-stone-400">
                  {activeBuffs.extraLPPercent > 0 && `+${activeBuffs.extraLPPercent}% LP • `}
                  {activeBuffs.extraExpPercent > 0 && `+${activeBuffs.extraExpPercent}% EXP • `}
                  Trang bị du hành tăng cường năng lực giải mã di sản
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(Object.values(equippedMemory.equippedGear) as EquippedGearItem[]).map((gear: EquippedGearItem) => (
              <div
                key={gear.id}
                className={`p-5 rounded-2xl border transition-all ${
                  gear.isEquipped
                    ? 'bg-amber-950/20 border-amber-500/60 shadow-lg ring-1 ring-amber-500/30'
                    : 'bg-stone-900 border-stone-800 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                    gear.isEquipped 
                      ? 'bg-emerald-500 text-stone-950' 
                      : 'bg-stone-800 text-stone-400'
                  }`}>
                    {gear.isEquipped ? 'Đang Mặc' : 'Trong Túi'}
                  </span>
                </div>

                <h4 className="font-bold text-amber-100 text-sm mb-1">{gear.name}</h4>
                <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 mb-3 space-y-1">
                  <p className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {gear.buffName}
                  </p>
                  <p className="text-[11px] text-stone-300 leading-relaxed">{gear.buffDescription}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
                  <span className="text-stone-500 text-[10px]">Ngày nhận: {gear.acquiredDate}</span>
                  <button
                    onClick={() => handleToggleEquip(gear.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                      gear.isEquipped
                        ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                        : 'bg-amber-500 text-stone-950 hover:bg-amber-400 shadow'
                    }`}
                  >
                    {gear.isEquipped ? 'Tháo Ra' : 'Mặc Ngay'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🎁 TAB 4: REWARDS STORE GRID */}
      {activeTab === 'store' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewardsList.map((reward) => {
            const canAfford = currentLP >= reward.costLP && currentBadgesCount >= reward.requiredBadgesCount;

            return (
              <div
                key={reward.id}
                className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-xl"
              >
                {/* Image Banner */}
                <div className="relative h-44 overflow-hidden bg-stone-950">
                  <img
                    src={reward.image}
                    alt={reward.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
                  
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-stone-950/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                    {reward.category === 'ticket' ? '🎫 Vé Tham Quan' : reward.category === 'cuisine' ? '🍜 Ẩm Thực' : '🎒 Trang Bị Di Sản'}
                  </span>

                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-amber-500 text-stone-950 font-black font-mono text-xs shadow-lg">
                    {reward.costLP} LP
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="font-['Cinzel',serif] font-bold text-amber-200 text-base leading-snug">
                      {reward.name}
                    </h4>
                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-stone-800/80">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-400">Yêu cầu huy hiệu:</span>
                      <span className="font-bold text-amber-300">{reward.requiredBadgesCount} Huy hiệu</span>
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setSelectedRewardForRedeem(reward);
                      }}
                      disabled={!canAfford}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{canAfford ? 'Đổi Quà Ngay' : 'Chưa Đủ Điều Kiện'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 📦 CHEST OPENING MODAL */}
      {openingChest && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-stone-900 border border-amber-500/40 rounded-3xl p-6 text-center space-y-6 shadow-2xl">
            {isChestOpeningAnim ? (
              <div className="space-y-4 py-8">
                <div className="w-24 h-24 rounded-3xl bg-amber-500/20 border border-amber-400 mx-auto flex items-center justify-center text-5xl animate-bounce">
                  ✨📦✨
                </div>
                <h3 className="font-['Cinzel',serif] font-bold text-xl text-amber-200">
                  Đang Khai Mở {openingChest.name}...
                </h3>
                <p className="text-xs text-stone-400">Hòa âm chuông thiêng và ánh sáng cổ vật đang hội tụ...</p>
              </div>
            ) : chestResult ? (
              <div className="space-y-5 animate-scaleUp">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 mx-auto flex items-center justify-center text-4xl shadow-xl">
                  {chestResult.icon}
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    Phần Thưởng Đã Mở Khóa!
                  </span>
                  <h3 className="font-['Cinzel',serif] font-bold text-xl text-amber-200 mt-1">
                    {chestResult.name}
                  </h3>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                    {chestResult.desc}
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setOpeningChest(null);
                    setChestResult(null);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-bold text-sm shadow-xl"
                >
                  Nhận Thưởng & Tiếp Tục
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 🎟️ CONFIRM REDEEM MODAL */}
      {selectedRewardForRedeem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-stone-900 border border-amber-500/40 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-['Cinzel',serif] font-bold text-lg text-amber-200">
                Xác Nhận Đổi Thưởng Di Sản
              </h3>
              <button
                onClick={() => setSelectedRewardForRedeem(null)}
                className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center gap-4">
              <img
                src={selectedRewardForRedeem.image}
                alt={selectedRewardForRedeem.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-amber-100 text-sm">{selectedRewardForRedeem.name}</h4>
                <p className="text-xs text-stone-400">Chi phí: <span className="font-bold text-amber-300 font-mono">{selectedRewardForRedeem.costLP} LP</span></p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedRewardForRedeem(null)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-bold text-xs"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleConfirmRedeem}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs shadow-lg"
              >
                Xác Nhận Đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🎫 VOUCHER RECEIPT MODAL */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-2 border-amber-400 rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setActiveVoucher(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                Đổi Thưởng Thành Công!
              </span>
              <h3 className="font-['Cinzel',serif] font-bold text-xl text-amber-200">
                Thẻ Voucher Di Sản Điện Tử
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-amber-500/30 text-center space-y-3">
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
                <QrCode className="w-28 h-28 text-stone-950" />
              </div>

              <div>
                <p className="text-xs text-stone-400">Mã Xác Thực:</p>
                <p className="text-base font-black font-mono text-amber-300 tracking-widest">{activeVoucher.code}</p>
              </div>

              <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-300">
                <p className="font-bold text-amber-200">{activeVoucher.reward.name}</p>
                <p className="text-stone-400">Ngày cấp: {activeVoucher.date} • Xuất trình tại điểm đối tác</p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setActiveVoucher(null);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs shadow-lg"
            >
              Hoàn Tất & Lưu Vào Tủ Đồ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
