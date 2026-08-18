import { 
  AvatarCustomization, 
  CostumeId, 
  HeadwearId, 
  AccessoryId, 
  AvatarPose, 
  AvatarAura, 
  AvatarBackdrop 
} from '../types';

export interface CostumeItemDef {
  id: CostumeId;
  name: string;
  period: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requiredLP: number;
  requiredBadges: number;
  bonusExp: number;
  bonusLP: number;
  primaryColor: string;
  secondaryColor: string;
  icon: string;
  culturalNote: string;
}

export interface HeadwearItemDef {
  id: HeadwearId;
  name: string;
  period: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic';
  requiredLP: number;
  primaryColor: string;
  icon: string;
}

export interface AccessoryItemDef {
  id: AccessoryId;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requiredLP: number;
  perk: string;
  icon: string;
}

export interface BackdropDef {
  id: AvatarBackdrop;
  name: string;
  province: string;
  gradient: string;
  landmarkSilhouette: string;
  accentColor: string;
}

export const COSTUME_DEFINITIONS: Record<CostumeId, CostumeItemDef> = {
  costume_ba_ba: {
    id: 'costume_ba_ba',
    name: 'Áo Bà Ba Phương Nam & Khăn Rằn Miệt Vườn',
    period: 'Văn Hóa Dân Gian Nam Bộ',
    description: 'Trang phục biểu tượng của người dân phương Nam hào sảng, chân chất. Vải lụa nâu sòng nhẹ mát phối cùng khăn rằn dệt tay.',
    rarity: 'common',
    requiredLP: 0,
    requiredBadges: 0,
    bonusExp: 5,
    bonusLP: 5,
    primaryColor: '#78350f',
    secondaryColor: '#f59e0b',
    icon: '🌾',
    culturalNote: 'Áo bà ba gắn liền với nét đẹp lao động và văn hóa sông nước miệt vườn Nam Bộ từ thuở mở đất.'
  },
  costume_ngu_than: {
    id: 'costume_ngu_than',
    name: 'Áo Ngũ Thân Cổ Truyền Triều Nguyễn (Gia Định Thành)',
    period: 'Thế kỷ 18 - Đầu thế kỷ 20',
    description: 'Y phục năm thân cổ đứng cài cúc đồng quý tộc, tượng trưng cho tứ thân phụ mẫu và chính bản thân, biểu hiện đạo lý ngũ thường.',
    rarity: 'epic',
    requiredLP: 250,
    requiredBadges: 2,
    bonusExp: 20,
    bonusLP: 15,
    primaryColor: '#991b1b',
    secondaryColor: '#fbbf24',
    icon: '👑',
    culturalNote: 'Quy chế y phục mẫu mực dưới thời chúa Nguyễn và hoàng triều tại trấn Gia Định xưa.'
  },
  costume_lemur_ao_dai: {
    id: 'costume_lemur_ao_dai',
    name: 'Áo Dài Tân Thời Lemur Sài Gòn Thập Niên 1930',
    period: 'Sài Gòn Thập Niên 1930 - 1950',
    description: 'Chiếc áo dài cách tân tôn vinh vẻ đẹp thanh lịch của phụ nữ Sài Gòn xưa với cổ tròn viền ren và họa tiết hoa sen Đông Dương.',
    rarity: 'rare',
    requiredLP: 180,
    requiredBadges: 1,
    bonusExp: 15,
    bonusLP: 10,
    primaryColor: '#047857',
    secondaryColor: '#fcd34d',
    icon: '🌸',
    culturalNote: 'Cách tân rực rỡ khởi nguồn từ trường Mỹ thuật Đông Dương, trở thành biểu tượng thời trang rạng rỡ của Hòn ngọc Viễn Đông.'
  },
  costume_ba_son_sailor: {
    id: 'costume_ba_son_sailor',
    name: 'Đồng Phục Thủy Thủ Xưởng Đóng Tàu Ba Son 1863',
    period: 'Thế kỷ 19 - Di sản Công Nghiệp Sài Gòn',
    description: 'Bộ đồng phục hải quân xanh biển đậm với cúc mạ đồng chạm nổi mỏ neo và cổ áo thủy thủ lịch lãm, gắn liền với di sản xưởng thủy Ba Son.',
    rarity: 'rare',
    requiredLP: 200,
    requiredBadges: 2,
    bonusExp: 15,
    bonusLP: 15,
    primaryColor: '#1e3a8a',
    secondaryColor: '#60a5fa',
    icon: '⚓',
    culturalNote: 'Vinh danh cái nôi của ngành đóng tàu thủy hiện đại và phong trào công nhân Ba Son lịch sử.'
  },
  costume_don_ca_tai_tu: {
    id: 'costume_don_ca_tai_tu',
    name: 'Lễ Phục Nghệ Nhân Đờn Ca Tài Tử Nam Bộ',
    period: 'Di Sản Văn Hóa Phi Vật Thể UNESCO',
    description: 'Áo dài the gấm thêu hoa văn cung đình lộng lẫy, trang phục chuyên biệt của các danh cầm và tài tử Nam Bộ trong các đêm tao đàn.',
    rarity: 'legendary',
    requiredLP: 350,
    requiredBadges: 3,
    bonusExp: 25,
    bonusLP: 25,
    primaryColor: '#581c87',
    secondaryColor: '#e879f9',
    icon: '🪕',
    culturalNote: 'Âm hưởng Dạ Cổ Hoài Lang và 20 bài bản tổ vang vọng khắp sông Tiền sông Hậu.'
  },
  costume_explorer_kaki: {
    id: 'costume_explorer_kaki',
    name: 'Trang Phục Thám Hiểm Rừng Sác & Miệt Vườn Kaki',
    period: 'Đương Đại Dã Ngoại Di Sản',
    description: 'Trang phục dã ngoại chống nắng UPF50+ với nhiều túi đựng dụng cụ khảo cổ, dây đai cài la bàn và giày bốt lữ hành.',
    rarity: 'common',
    requiredLP: 100,
    requiredBadges: 1,
    bonusExp: 10,
    bonusLP: 10,
    primaryColor: '#365314',
    secondaryColor: '#a3e635',
    icon: '🧭',
    culturalNote: 'Trang bị năng động cho các chuyến khảo sát địa đạo Củ Chi và chiến khu Rừng Sác Cần Giờ.'
  }
};

export const HEADWEAR_DEFINITIONS: Record<HeadwearId, HeadwearItemDef> = {
  none: {
    id: 'none',
    name: 'Không đội mũ',
    period: '-',
    description: 'Để tóc tự nhiên',
    rarity: 'common',
    requiredLP: 0,
    primaryColor: 'transparent',
    icon: '👤'
  },
  head_non_la: {
    id: 'head_non_la',
    name: 'Nón Lá Quai Thao Truyền Thống',
    period: 'Cổ truyền',
    description: 'Nón lá chóp nhọn chằm lá buông tinh xảo kèm quai lụa tơ tằm mềm mại.',
    rarity: 'common',
    requiredLP: 50,
    primaryColor: '#fef08a',
    icon: '👒'
  },
  head_khan_dong: {
    id: 'head_khan_dong',
    name: 'Khăn Đóng Hoàng Gia Gia Định (Khăn Xếp)',
    period: 'Triều Nguyễn',
    description: 'Khăn xếp lụa gấm đen tuyền hoặc hoàng kim với các nếp gấp chuẩn mực ngũ luân.',
    rarity: 'rare',
    requiredLP: 120,
    primaryColor: '#0f172a',
    icon: '👑'
  },
  head_non_tai_beo: {
    id: 'head_non_tai_beo',
    name: 'Nón Tai Bèo Kháng Chiến Nam Bộ',
    period: '1945 - 1975',
    description: 'Vải kaki xanh lá dã ngoại, vành tròn chống nắng che mưa trên mọi địa hình.',
    rarity: 'common',
    requiredLP: 60,
    primaryColor: '#15803d',
    icon: '🧢'
  },
  head_beret_vintage: {
    id: 'head_beret_vintage',
    name: 'Mũ Beret Ký Giả Sài Gòn Thập Niên 1960',
    period: 'Sài Gòn Xưa',
    description: 'Mũ beret nỉ cổ điển mang đậm phong thái lãng mạn của thi sĩ và ký giả Sài Gòn xưa.',
    rarity: 'rare',
    requiredLP: 100,
    primaryColor: '#44403c',
    icon: '🎩'
  },
  head_non_coi: {
    id: 'head_non_coi',
    name: 'Nón Cối Thám Hiểm Di Tích',
    period: 'Dã ngoại',
    description: 'Nón cối lợp vải bạt xanh rêu cứng cáp bảo vệ trong các chuyến leo núi ngọn hải đăng.',
    rarity: 'common',
    requiredLP: 70,
    primaryColor: '#3f6212',
    icon: '🪖'
  },
  head_tram_cai_hoa_sen: {
    id: 'head_tram_cai_hoa_sen',
    name: 'Trâm Cài Bạc Hoa Sen Khảm Ngọc',
    period: 'Mỹ nghệ Cung đình',
    description: 'Trâm bạc chạm khắc đóa sen nở khảm ngọc bích sang trọng cài trên búi tóc cổ.',
    rarity: 'rare',
    requiredLP: 150,
    primaryColor: '#cbd5e1',
    icon: '✨'
  }
};

export const ACCESSORY_DEFINITIONS: Record<AccessoryId, AccessoryItemDef> = {
  none: {
    id: 'none',
    name: 'Không phụ kiện',
    description: 'Không trang bị vật phẩm cầm tay',
    rarity: 'common',
    requiredLP: 0,
    perk: 'Mặc định',
    icon: '✋'
  },
  acc_compass: {
    id: 'acc_compass',
    name: 'La Bàn Đồng Thau Du Khách Phương Nam',
    description: 'La bàn cơ học vỏ đồng mạ vàng xoay kim từ tính 3D chỉ hướng chính xác.',
    rarity: 'rare',
    requiredLP: 120,
    perk: 'Giảm 50% thời gian mở gợi ý AI và tăng độ nhạy quét AR',
    icon: '🧭'
  },
  acc_magnifier: {
    id: 'acc_magnifier',
    name: 'Kính Lúp Cổ Điển Soi Cổ Vật & Mật Ngôn',
    description: 'Kính lúp hợp kim đồng thau thấu kính 10X soi rõ các hoa văn bia đá.',
    rarity: 'rare',
    requiredLP: 140,
    perk: 'Nhận thêm +20% LP khi trả lời đúng lần đầu',
    icon: '🔍'
  },
  acc_khan_ran: {
    id: 'acc_khan_ran',
    name: 'Khăn Rằn Nam Bộ Sợi Bông Dệt Thủ Công',
    description: 'Khăn rằn caro truyền thống vắt ngang vai mang đậm khí chất phương Nam.',
    rarity: 'common',
    requiredLP: 60,
    perk: 'Tăng +10% EXP cho mọi hành trình thám hiểm',
    icon: '🧣'
  },
  acc_the_bai: {
    id: 'acc_the_bai',
    name: 'Thẻ Bài Ngự Tứ Hoàng Triều Mạ Vàng',
    description: 'Thẻ bài đồng chạm rồng phượng ban tặng cho học giả đỗ đạt Gia Định xưa.',
    rarity: 'legendary',
    requiredLP: 300,
    perk: 'Nhận danh xưng Ngự Tứ Học Giả và x2 LP sự kiện',
    icon: '🏷️'
  },
  acc_kinh_vintage: {
    id: 'acc_kinh_vintage',
    name: 'Kính Cổ Cận Thị Tròn Đồi Mồi',
    description: 'Cặp kính mắt tròn gọng đồi mồi trí thức của các học giả Sài Gòn đầu thế kỷ 20.',
    rarity: 'rare',
    requiredLP: 110,
    perk: 'Tự động lọc bớt 1 phương án sai trong câu đố',
    icon: '👓'
  },
  acc_so_tay_but_tre: {
    id: 'acc_so_tay_but_tre',
    name: 'Sổ Tay Bìa Da & Bút Tre Tự Nhiên',
    description: 'Sổ nhật ký ghi chép thơ cổ và bản đồ kèm bút tre khắc laser.',
    rarity: 'rare',
    requiredLP: 130,
    perk: 'Lưu tự động các câu trích thơ hay vào nhật ký',
    icon: '📖'
  },
  acc_binh_inox: {
    id: 'acc_binh_inox',
    name: 'Bình Giữ Nhiệt Khắc Tọa Độ Di Sản',
    description: 'Bình inox 304 giữ nhiệt 24h khắc bản đồ cổ 1892.',
    rarity: 'rare',
    requiredLP: 150,
    perk: 'Bảo vệ chuỗi ngày học tập (Streak Shield)',
    icon: '🧴'
  }
};

export const BACKDROP_DEFINITIONS: Record<AvatarBackdrop, BackdropDef> = {
  ben_thanh: {
    id: 'ben_thanh',
    name: 'Tháp Đồng Hồ Chợ Bến Thành',
    province: 'TP. Hồ Chí Minh',
    gradient: 'from-amber-950/80 via-stone-900 to-stone-950',
    landmarkSilhouette: '🏛️',
    accentColor: '#f59e0b'
  },
  thu_ngu: {
    id: 'thu_ngu',
    name: 'Cột Cờ Thủ Ngữ & Bến Bạch Đằng',
    province: 'TP. Hồ Chí Minh',
    gradient: 'from-sky-950/80 via-stone-900 to-stone-950',
    landmarkSilhouette: '🚩',
    accentColor: '#38bdf8'
  },
  nha_rong: {
    id: 'nha_rong',
    name: 'Bến Nhà Rồng & Sông Sài Gòn',
    province: 'TP. Hồ Chí Minh',
    gradient: 'from-rose-950/80 via-stone-900 to-stone-950',
    landmarkSilhouette: '🚢',
    accentColor: '#fb7185'
  },
  ba_thien_hau: {
    id: 'ba_thien_hau',
    name: 'Chùa Bà Thiên Hậu Chợ Lớn',
    province: 'TP. Hồ Chí Minh',
    gradient: 'from-red-950/80 via-stone-900 to-stone-950',
    landmarkSilhouette: '🏮',
    accentColor: '#ef4444'
  },
  lai_thieu_kiln: {
    id: 'lai_thieu_kiln',
    name: 'Lò Gốm Cổ Men Lam Lái Thiêu',
    province: 'Bình Dương',
    gradient: 'from-amber-950/90 via-stone-900 to-stone-950',
    landmarkSilhouette: '🏺',
    accentColor: '#d97706'
  },
  vung_tau_lighthouse: {
    id: 'vung_tau_lighthouse',
    name: 'Ngọn Hải Đăng Núi Nhỏ Vũng Tàu',
    province: 'Bà Rịa - Vũng Tàu',
    gradient: 'from-indigo-950/80 via-stone-900 to-stone-950',
    landmarkSilhouette: '🗼',
    accentColor: '#818cf8'
  }
};

const AVATAR_STORAGE_KEY = 'saigon_heritage_custom_avatar_v2';

export const DEFAULT_AVATAR_CUSTOMIZATION: AvatarCustomization = {
  costumeId: 'costume_ba_ba',
  headwearId: 'none',
  accessoryId: 'acc_compass',
  gender: 'explorer',
  skinTone: '#fcd34d',
  hairStyle: 'modern_short',
  hairColor: '#1c1917',
  expression: 'smile',
  pose: 'greeting',
  aura: 'royal_gold',
  backdrop: 'ben_thanh',
  unlockedCostumes: ['costume_ba_ba', 'costume_explorer_kaki'],
  unlockedHeadwears: ['none', 'head_non_la'],
  unlockedAccessories: ['none', 'acc_compass', 'acc_khan_ran']
};

export const getAvatarCustomization = (): AvatarCustomization => {
  try {
    const raw = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (raw) {
      const parsed: AvatarCustomization = JSON.parse(raw);
      return {
        ...DEFAULT_AVATAR_CUSTOMIZATION,
        ...parsed,
        unlockedCostumes: Array.isArray(parsed.unlockedCostumes) ? parsed.unlockedCostumes : DEFAULT_AVATAR_CUSTOMIZATION.unlockedCostumes,
        unlockedHeadwears: Array.isArray(parsed.unlockedHeadwears) ? parsed.unlockedHeadwears : DEFAULT_AVATAR_CUSTOMIZATION.unlockedHeadwears,
        unlockedAccessories: Array.isArray(parsed.unlockedAccessories) ? parsed.unlockedAccessories : DEFAULT_AVATAR_CUSTOMIZATION.unlockedAccessories
      };
    }
  } catch {}
  return DEFAULT_AVATAR_CUSTOMIZATION;
};

export const saveAvatarCustomization = (custom: AvatarCustomization): void => {
  try {
    localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(custom));
  } catch (err) {
    console.error('Failed to save avatar customization:', err);
  }
};

export const unlockCostumeItem = (costumeId: CostumeId): AvatarCustomization => {
  const current = getAvatarCustomization();
  if (!current.unlockedCostumes.includes(costumeId)) {
    current.unlockedCostumes.push(costumeId);
    saveAvatarCustomization(current);
  }
  return current;
};

export const unlockHeadwearItem = (headwearId: HeadwearId): AvatarCustomization => {
  const current = getAvatarCustomization();
  if (!current.unlockedHeadwears.includes(headwearId)) {
    current.unlockedHeadwears.push(headwearId);
    saveAvatarCustomization(current);
  }
  return current;
};

export const unlockAccessoryItem = (accessoryId: AccessoryId): AvatarCustomization => {
  const current = getAvatarCustomization();
  if (!current.unlockedAccessories.includes(accessoryId)) {
    current.unlockedAccessories.push(accessoryId);
    saveAvatarCustomization(current);
  }
  return current;
};
