import { Location3D, PersonalizedItinerary, ItineraryStop } from '../types';
import { LOCATIONS } from '../data/locations';

export interface ItineraryGenerationOptions {
  theme: 'architecture_classic' | 'river_ports_300' | 'cuisine_flavors' | 'pottery_spiritual' | 'coastal_heroes' | 'heroic_tunnels';
  durationMode: 'half_day' | 'full_day' | 'two_days';
  transportMode: 'walk' | 'cyclo' | 'waterbus' | 'hop_on_bus' | 'motorbike';
  startPoint: string;
  pace: 'relaxed' | 'balanced' | 'deep_dive';
}

const THEME_DETAILS = {
  architecture_classic: {
    label: 'Kiến Trúc & Cổ Vật Đông Dương',
    subtitle: 'Hành trình chiêm ngưỡng những tuyệt tác kiến trúc giao thoa Pháp - Việt hơn 100 năm tuổi',
    badgeId: 'badge_ben_thanh',
    locationFilter: (l: Location3D) => ['ben_thanh', 'buu_dien_tphcm', 'dinh_doc_lap', 'duong_sach_hcm'].includes(l.id) || l.province === 'TP. Hồ Chí Minh'
  },
  river_ports_300: {
    label: 'Ký Ức Sông Nước & Bến Cảng 300 Năm',
    subtitle: 'Ngược dòng ký ức từ Cột cờ Thủ Ngữ, Bến Nhà Rồng đến cái nôi công nghiệp xưởng Ba Son',
    badgeId: 'badge_nha_rong',
    locationFilter: (l: Location3D) => ['thu_ngu', 'nha_rong', 'cho_ben_thanh'].includes(l.id) || l.historicalPeriod.includes('1863') || l.historicalPeriod.includes('1865')
  },
  cuisine_flavors: {
    label: 'Hương Vị Phương Nam & Ẩm Thực Chợ Xưa',
    subtitle: 'Khám phá văn hóa ẩm thực giao thoa Việt - Hoa tại các ngôi chợ trăm tuổi',
    badgeId: 'badge_ben_thanh',
    locationFilter: (l: Location3D) => ['cho_ben_thanh', 'cho_thu_dau_mot', 'cho_xom_luoi_vt', 'duong_sach_hcm'].includes(l.id)
  },
  pottery_spiritual: {
    label: 'Làng Nghề Gốm Sứ & Di Sản Tâm Linh',
    subtitle: 'Hành trình tĩnh tại khám phá gốm men lam Lái Thiêu và các danh lam cổ tự',
    badgeId: 'badge_bd_hoi_khanh',
    locationFilter: (l: Location3D) => ['chua_hoi_khanh_bd', 'lo_gom_dai_hung_bd', 'nha_co_tran_van_ho_bd', 'lang_nghe_son_mai_tuong_binh_hiep_bd'].includes(l.id) || l.province === 'Bình Dương'
  },
  coastal_heroes: {
    label: 'Hải Trình Biển Đảo & Di Tích Lịch Sử',
    subtitle: 'Từ ngọn hải đăng Vũng Tàu sừng sững ngắm sóng đến Côn Đảo thiêng liêng',
    badgeId: 'badge_vt_hai_dang',
    locationFilter: (l: Location3D) => ['hai_dang_vung_tau', 'bach_dinh_vung_tau', 'con_dao_prison', 'tuong_chua_kito_vung_tau', 'lang_chai_phuoc_hai'].includes(l.id) || l.province === 'Bà Rịa - Vũng Tàu'
  },
  heroic_tunnels: {
    label: 'Huyền Thoại Đất Thép & Chiến Khu Rừng Sác',
    subtitle: 'Khám phá hệ thống địa đạo Củ Chi kiên cường và căn cứ thủy quân Rừng Sác Cần Giờ',
    badgeId: 'badge_cu_chi',
    locationFilter: (l: Location3D) => ['cu_chi_tunnels', 'rung_sac_can_gio', 'dinh_doc_lap', 'con_dao_prison'].includes(l.id)
  }
};

const TRANSPORT_DETAILS = {
  walk: { label: 'Đi bộ thư thả & chụp ảnh', avgSpeedKmH: 4, icon: '🚶' },
  cyclo: { label: 'Xích lô hoài cổ phương Nam', avgSpeedKmH: 10, icon: '🚲' },
  waterbus: { label: 'Tàu buýt sông Saigon Waterbus', avgSpeedKmH: 22, icon: '🛥️' },
  hop_on_bus: { label: 'Xe buýt 2 tầng Hop-On Hop-Off', avgSpeedKmH: 18, icon: '🚌' },
  motorbike: { label: 'Xe máy luồn lách khám phá hẻm phố', avgSpeedKmH: 25, icon: '🛵' }
};

const AI_TIPS_DATABASE: Record<string, { tip: string; photoHour: string; cuisine: string }> = {
  cho_ben_thanh: {
    tip: 'Vào cổng Nam ngắm tháp đồng hồ nguyên bản 1914, ghé hàng chè mâm bà Ba ở cổng Đông.',
    photoHour: '07:30 - 08:30 (Nắng sớm xuyên qua mái vòm)',
    cuisine: 'Bún riêu gánh chợ Bến Thành & Chè ba màu Nam Bộ'
  },
  buu_dien_tphcm: {
    tip: 'Chiêm ngưỡng 2 bản đồ cổ vẽ tay thời kỳ Pháp thuộc trên tường hai bên sảnh chính và buồng điện thoại bằng gỗ lim.',
    photoHour: '09:00 - 10:30 (Ánh sáng hắt qua cửa kính vòm)',
    cuisine: 'Cà phê bệt Nhà thờ Đức Bà'
  },
  dinh_doc_lap: {
    tip: 'Tham quan hầm chỉ huy ngầm dưới lòng đất và ngắm rèm hoa đá hình đốt trúc thanh tao bao quanh tầng 2.',
    photoHour: '14:30 - 16:00 (Nắng vàng rọi sân cỏ phía trước)',
    cuisine: 'Cơm tấm Sài Gòn bì chả'
  },
  nha_rong: {
    tip: 'Đứng tại ban công tầng 2 ngắm tàu thuyền tấp nập trên sông Sài Gòn và tìm hiểu hành trình năm 1911.',
    photoHour: '16:45 - 17:45 (Hoàng hôn buông trên bến cảng)',
    cuisine: 'Nước mía sầu riêng & bánh mì phá lấu'
  },
  thu_ngu: {
    tip: 'Di tích tín hiệu hàng hải 1865, điểm ngắm toàn cảnh cầu Ba Son và bến Bạch Đằng lộng gió.',
    photoHour: '17:30 - 18:30 (Lên đèn lung linh ven sông)',
    cuisine: 'Trà tắc khổng lồ phố đi bộ Bạch Đằng'
  },
  duong_sach_hcm: {
    tip: 'Không gian rợp bóng cây xanh cổ thụ, ghé các sạp sách tìm ấn phẩm lịch sử Sài Gòn xưa.',
    photoHour: '08:00 - 10:00 (Bóng nắng xuyên qua tán me)',
    cuisine: 'Cà phê trứng & bánh sừng bò'
  },
  chua_hoi_khanh_bd: {
    tip: 'Chiêm bái tượng Phật Thích Ca nhập niết bàn trên mái chùa dài 52m lớn nhất châu Á.',
    photoHour: '08:30 - 10:00 (Thanh tịnh ban mai)',
    cuisine: 'Bánh bèo bì Mỹ Liên Chợ Búng'
  },
  lo_gom_dai_hung_bd: {
    tip: 'Chứng kiến nghệ nhân vuốt gốm thủ công bên lò rồng cổ 180 năm tuổi còn đỏ lửa.',
    photoHour: '13:30 - 15:30 (Ánh sáng lò gốm huyền ảo)',
    cuisine: 'Gỏi gà măng cụt Lái Thiêu'
  },
  hai_dang_vung_tau: {
    tip: 'Tháp hải đăng cổ nhất Việt Nam (1862), đi dạo dọc đường hoa sứ cổ thụ nở thơm ngát.',
    photoHour: '16:00 - 17:30 (Hoàng hôn biển Bãi Trước)',
    cuisine: 'Bánh bông lan trứng muối Gốc Cột Điện & Sữa chua cô Tiên'
  },
  bach_dinh_vung_tau: {
    tip: 'Biệt thự phong cách Pháp thế kỷ 19 với bộ sưu tập 19 khẩu thần công cổ và gốm sứ Khang Hy.',
    photoHour: '10:00 - 11:30 (Ánh sáng biển trong trẻo)',
    cuisine: 'Bánh khọt Cô Ba Vũng Tàu'
  },
  cu_chi_tunnels: {
    tip: 'Trải nghiệm chui hầm địa đạo tầng 1 và thưởng thức khoai mì chấm muối mè tại bếp Hoàng Cầm.',
    photoHour: '09:30 - 11:30 (Nắng rọi qua tán rừng nguyên sinh)',
    cuisine: 'Khoai mì luộc chấm muối đậu phộng & Bò tơ Củ Chi'
  },
  con_dao_prison: {
    tip: 'Viếng Nghĩa trang Hàng Dương và tìm hiểu chứng tích lịch sử kiên trung bất khuất của các chiến sĩ.',
    photoHour: '07:00 - 09:00 hoặc 20:00 - 22:00',
    cuisine: 'Hải sản Côn Đảo & Mứt hạt bàng'
  }
};

export const generatePersonalizedItinerary = (options: ItineraryGenerationOptions): PersonalizedItinerary => {
  const themeInfo = THEME_DETAILS[options.theme] || THEME_DETAILS.architecture_classic;
  const transportInfo = TRANSPORT_DETAILS[options.transportMode] || TRANSPORT_DETAILS.walk;

  // Filter locations by theme
  let matchingLocations = LOCATIONS.filter(themeInfo.locationFilter);
  if (matchingLocations.length < 3) {
    matchingLocations = LOCATIONS.slice(0, 5);
  }

  // Determine stop count based on duration
  const stopCount = options.durationMode === 'half_day' ? 3 : options.durationMode === 'full_day' ? 5 : 7;
  const selectedLocs = matchingLocations.slice(0, stopCount);

  // Time schedules
  const startHour = 8;
  const startMinute = 0;
  let currentTotalMinutes = startHour * 60 + startMinute;
  let totalDistanceKm = 0;

  const stops: ItineraryStop[] = selectedLocs.map((loc, idx) => {
    const stayMinutes = options.pace === 'relaxed' ? 75 : options.pace === 'deep_dive' ? 90 : 60;
    const distance = idx === 0 ? 0 : Number((1.5 + idx * 1.2).toFixed(1));
    totalDistanceKm += distance;

    const travelMinutes = idx === 0 ? 0 : Math.round((distance / transportInfo.avgSpeedKmH) * 60) + 10;
    currentTotalMinutes += travelMinutes;

    const startH = Math.floor(currentTotalMinutes / 60);
    const startM = currentTotalMinutes % 60;
    const endTotal = currentTotalMinutes + stayMinutes;
    const endH = Math.floor(endTotal / 60);
    const endM = endTotal % 60;

    const formatTime = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const timeSlot = `${formatTime(startH, startM)} - ${formatTime(endH, endM)}`;

    currentTotalMinutes = endTotal;

    const aiData = AI_TIPS_DATABASE[loc.id] || {
      tip: `Khám phá các nét độc đáo và giải mã câu đố tại ${loc.name}.`,
      photoHour: '08:00 - 10:00 (Ánh sáng tự nhiên)',
      cuisine: 'Đặc sản địa phương Nam Bộ'
    };

    return {
      locationId: loc.id,
      locationName: loc.name,
      province: loc.province,
      district: loc.district,
      order: idx + 1,
      timeSlot,
      durationMinutes: stayMinutes,
      distanceFromPrevKm: distance,
      travelMode: options.transportMode,
      activityHighlight: loc.shortDesc,
      aiLocalTip: aiData.tip,
      goldenPhotoHour: aiData.photoHour,
      mustTryCuisine: aiData.cuisine,
      coordinates: { lat: 10.7 + loc.y * 0.005, lng: 106.6 + loc.x * 0.005 },
      isVisited: idx === 0
    };
  });

  const totalDurationHours = options.durationMode === 'half_day' ? 3.5 : options.durationMode === 'full_day' ? 7.5 : 16;
  const totalLPBonus = stops.length * 50 + (options.durationMode === 'two_days' ? 200 : 100);

  return {
    id: `itinerary_${options.theme}_${Date.now()}`,
    title: `Lộ Trình: ${themeInfo.label}`,
    subtitle: themeInfo.subtitle,
    theme: options.theme,
    themeLabel: themeInfo.label,
    durationMode: options.durationMode,
    durationLabel: options.durationMode === 'half_day' ? 'Nửa Ngày (3 - 4 giờ)' : options.durationMode === 'full_day' ? '1 Ngày Trọn Vẹn' : '2 Ngày 1 Đêm (Liên Tỉnh)',
    transportMode: options.transportMode,
    transportLabel: transportInfo.label,
    startPoint: options.startPoint,
    pace: options.pace,
    totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
    totalDurationHours,
    totalLPBonus,
    completionBadgeId: themeInfo.badgeId,
    stops,
    createdAt: new Date().toISOString(),
    isActiveOnMap: true
  };
};

const ITINERARY_STORAGE_KEY = 'saigon_heritage_personalized_itinerary_v2';

export const getSavedItinerary = (): PersonalizedItinerary | null => {
  try {
    const raw = localStorage.getItem(ITINERARY_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

export const saveActiveItinerary = (itinerary: PersonalizedItinerary | null): void => {
  try {
    if (itinerary) {
      localStorage.setItem(ITINERARY_STORAGE_KEY, JSON.stringify(itinerary));
    } else {
      localStorage.removeItem(ITINERARY_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to save itinerary:', err);
  }
};
