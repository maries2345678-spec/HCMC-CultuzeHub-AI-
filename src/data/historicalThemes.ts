import { HistoricalThemeSkin } from '../types';

export const HISTORICAL_THEME_SKINS: HistoricalThemeSkin[] = [
  {
    id: 'classic_amber',
    name: 'Phương Nam Hoàng Kim',
    era: 'Nguyên Bản Di Sản (Thế kỷ 19 - Hiện đại)',
    tagline: 'Vàng hổ phách cung đình & Gỗ mun trầm mặc',
    description: 'Phong cách nguyên bản cổ kính và thanh lịch với tông vàng hổ phách ấm áp, ánh kim hoàng gia trên nền đá đen trầm mặc.',
    previewColors: {
      primary: '#f59e0b',
      accent: '#fbbf24',
      background: '#0c0a09',
      border: 'rgba(245, 158, 11, 0.35)'
    },
    cardBgClass: 'bg-stone-900/90',
    borderClass: 'border-amber-500/30',
    accentTextClass: 'text-amber-300',
    headerGradient: 'from-amber-600 via-amber-500 to-yellow-400',
    badgeTag: '👑 Nguyên Bản',
    iconName: 'Sparkles',
    musicMood: 'Nhã nhạc & Cung đình Nam Bộ'
  },
  {
    id: 'indochine',
    name: 'Đông Dương Cổ Điển (Indochine)',
    era: 'Thời kỳ 1920 - 1950',
    tagline: 'Xanh lục ngọc bích & Vàng hoàng thổ gạch bông',
    description: 'Phong cách kiến trúc Indochine giao thoa Á - Âu lãng mạn. Tông xanh ngọc rêu quý phái hòa cùng sắc vàng hoàng thổ của những căn biệt thự cổ và họa tiết gạch bông Nam Bộ.',
    previewColors: {
      primary: '#10b981',
      accent: '#34d399',
      background: '#061a14',
      border: 'rgba(16, 185, 129, 0.35)'
    },
    cardBgClass: 'bg-emerald-950/80',
    borderClass: 'border-emerald-500/30',
    accentTextClass: 'text-emerald-300',
    headerGradient: 'from-emerald-600 via-teal-500 to-amber-300',
    badgeTag: '🌿 Indochine 1930',
    iconName: 'Palmtree',
    musicMood: 'Tơ đồng thính phòng & Jazz Đông Dương'
  },
  {
    id: 'vintage_90s',
    name: 'Sài Gòn Thập Niên 90 (Retro 90s)',
    era: 'Thời kỳ 1985 - 1999',
    tagline: 'Lam dạ quang, Cam san hô & Băng cassette phố thị',
    description: 'Ký ức Hòn Ngọc Viễn Đông thập niên 90 với bảng hiệu vẽ tay nghệ thuật, quán cà phê vợt hẻm nhỏ, ánh đèn neon rực rỡ và nhịp sống đô thị năng động.',
    previewColors: {
      primary: '#06b6d4',
      accent: '#f97316',
      background: '#091522',
      border: 'rgba(6, 182, 212, 0.35)'
    },
    cardBgClass: 'bg-cyan-950/70',
    borderClass: 'border-cyan-500/30',
    accentTextClass: 'text-cyan-300',
    headerGradient: 'from-cyan-500 via-teal-400 to-orange-400',
    badgeTag: '📼 Retro 90s',
    iconName: 'Radio',
    musicMood: 'Băng nhạc cassette & Phố thị về đêm'
  },
  {
    id: 'gia_dinh_dynasty',
    name: 'Hoàng Triều Gia Định (Triều Nguyễn)',
    era: 'Thời kỳ 1698 - 1880',
    tagline: 'Đỏ son sơn mài, Vàng rồng & Thành Bát Quái',
    description: 'Tái hiện thời kỳ mở cõi phương Nam với Lễ Thành Hầu Nguyễn Hữu Cảnh, thành Quy Bát Quái và nghệ thuật sơn mài son thiếp vàng lộng lẫy.',
    previewColors: {
      primary: '#ef4444',
      accent: '#f59e0b',
      background: '#180a0a',
      border: 'rgba(239, 68, 68, 0.35)'
    },
    cardBgClass: 'bg-red-950/70',
    borderClass: 'border-rose-500/30',
    accentTextClass: 'text-rose-300',
    headerGradient: 'from-rose-600 via-amber-500 to-yellow-300',
    badgeTag: '🏮 Hoàng Triều 1698',
    iconName: 'Crown',
    musicMood: 'Trống hội khai khẩn & Nhã nhạc triều đình'
  },
  {
    id: 'ba_son_industrial',
    name: 'Cơ Khí Ba Son 1925 (Xưởng Tàu Hào Hùng)',
    era: 'Thời kỳ 1911 - 1945',
    tagline: 'Xanh thép hải quân, Đồng thau & Ngọn lửa bến cảng',
    description: 'Phong cách tôn vinh cái nôi công nghiệp đóng tàu bên bờ sông Sài Gòn, nơi ghi dấu chân người thợ Tôn Đức Thắng và những chuyến hải trình vượt đại dương.',
    previewColors: {
      primary: '#38bdf8',
      accent: '#fbbf24',
      background: '#0b1320',
      border: 'rgba(56, 189, 248, 0.35)'
    },
    cardBgClass: 'bg-slate-900/85',
    borderClass: 'border-sky-500/30',
    accentTextClass: 'text-sky-300',
    headerGradient: 'from-sky-500 via-blue-400 to-amber-300',
    badgeTag: '⚓ Ba Son 1925',
    iconName: 'Anchor',
    musicMood: 'Sóng vỗ bến cảng & Còi tàu viễn dương'
  }
];

export const getHistoricalSkin = (themeId?: string): HistoricalThemeSkin => {
  return HISTORICAL_THEME_SKINS.find(s => s.id === themeId) || HISTORICAL_THEME_SKINS[0];
};
