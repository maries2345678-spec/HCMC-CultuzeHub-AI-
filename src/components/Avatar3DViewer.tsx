import React from 'react';
import { 
  AvatarCustomization, 
  CostumeId, 
  HeadwearId, 
  AccessoryId 
} from '../types';
import { 
  COSTUME_DEFINITIONS, 
  HEADWEAR_DEFINITIONS, 
  ACCESSORY_DEFINITIONS, 
  BACKDROP_DEFINITIONS,
  DEFAULT_AVATAR_CUSTOMIZATION
} from '../utils/avatarStorage';

interface Avatar3DViewerProps {
  customization: AvatarCustomization;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBackdrop?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Avatar3DViewer: React.FC<Avatar3DViewerProps> = ({
  customization = DEFAULT_AVATAR_CUSTOMIZATION,
  size = 'md',
  showBackdrop = true,
  interactive = false,
  onClick,
  className = ''
}) => {
  const safeCustomization = customization || DEFAULT_AVATAR_CUSTOMIZATION;
  const costume = COSTUME_DEFINITIONS[safeCustomization.costumeId] || COSTUME_DEFINITIONS.costume_ba_ba;
  const headwear = HEADWEAR_DEFINITIONS[safeCustomization.headwearId] || HEADWEAR_DEFINITIONS.none;
  const accessory = ACCESSORY_DEFINITIONS[safeCustomization.accessoryId] || ACCESSORY_DEFINITIONS.none;
  const backdrop = BACKDROP_DEFINITIONS[safeCustomization.backdrop] || BACKDROP_DEFINITIONS.ben_thanh;

  // Size dimensions
  const dimensionMap = {
    sm: { width: 44, height: 44, svgView: '0 0 200 240', scale: 0.8 },
    md: { width: 90, height: 90, svgView: '0 0 200 240', scale: 1 },
    lg: { width: 180, height: 210, svgView: '0 0 200 240', scale: 1 },
    xl: { width: 280, height: 320, svgView: '0 0 200 240', scale: 1 }
  };

  const dim = dimensionMap[size];

  // Skin tone & hair color
  const skin = safeCustomization.skinTone || '#fcd34d';
  const hair = safeCustomization.hairColor || '#1c1917';

  // Aura colors
  const auraGradients: Record<string, { stop1: string; stop2: string; glow: string }> = {
    none: { stop1: 'transparent', stop2: 'transparent', glow: 'transparent' },
    royal_gold: { stop1: '#f59e0b', stop2: '#fef08a', glow: 'rgba(245, 158, 11, 0.45)' },
    heritage_fire: { stop1: '#ef4444', stop2: '#f97316', glow: 'rgba(239, 68, 68, 0.45)' },
    southern_ocean: { stop1: '#0284c7', stop2: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)' },
    ancient_jade: { stop1: '#059669', stop2: '#34d399', glow: 'rgba(52, 211, 153, 0.45)' }
  };

  const aura = auraGradients[safeCustomization.aura] || auraGradients.royal_gold;

  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl overflow-hidden flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer hover:scale-105 transition-transform' : ''
      } ${className}`}
      style={{
        width: size === 'sm' ? dim.width : '100%',
        maxWidth: dim.width,
        height: dim.height
      }}
    >
      {/* Background Ambience Layer */}
      {showBackdrop && (
        <div 
          className={`absolute inset-0 bg-gradient-to-b ${backdrop.gradient} border border-amber-500/30 transition-all`}
        >
          {/* Subtle Landmark Watermark in Background */}
          <div className="absolute top-2 right-2 text-2xl opacity-20 pointer-events-none">
            {backdrop.landmarkSilhouette}
          </div>
          {/* Subtle Animated Grid Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        </div>
      )}

      {/* SVG 3D Heritage Character Canvas */}
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full relative z-10 drop-shadow-2xl animate-subtleFloat"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Aura Halo Glow Filter */}
          <filter id={`auraGlow-${safeCustomization.costumeId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Gold Shimmer Gradient */}
          <linearGradient id="goldShimmer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Costume Primary Gradient */}
          <linearGradient id={`costumeGrad-${safeCustomization.costumeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={costume.secondaryColor} />
            <stop offset="40%" stopColor={costume.primaryColor} />
            <stop offset="100%" stopColor="#1c1917" />
          </linearGradient>

          {/* Headwear Gradient */}
          <linearGradient id={`headwearGrad-${safeCustomization.headwearId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor={headwear.primaryColor || '#d97706'} />
          </linearGradient>
        </defs>

        {/* 🌟 1. Dynamic Aura Glow Ring */}
        {safeCustomization.aura !== 'none' && (
          <g className="animate-pulse">
            <circle
              cx="100"
              cy="120"
              r="78"
              fill="none"
              stroke={aura.stop1}
              strokeWidth="3"
              strokeDasharray="6 4"
              opacity="0.6"
              filter={`url(#auraGlow-${safeCustomization.costumeId})`}
            />
            <circle
              cx="100"
              cy="120"
              r="86"
              fill="none"
              stroke={aura.stop2}
              strokeWidth="1.5"
              opacity="0.4"
            />
          </g>
        )}

        {/* 👤 2. Body / Torso / Ancient Costume */}
        <g className="character-torso">
          {/* Main Robe / Outfit Body */}
          <path
            d="M 60 140 Q 40 180 32 230 L 168 230 Q 160 180 140 140 Q 100 132 60 140 Z"
            fill={`url(#costumeGrad-${safeCustomization.costumeId})`}
            stroke="#451a03"
            strokeWidth="2.5"
          />

          {/* Costume-Specific Embellishments */}
          {safeCustomization.costumeId === 'costume_ngu_than' && (
            // Áo Ngũ Thân: Cổ đứng giao lĩnh & 5 cúc vàng
            <g>
              <path
                d="M 85 136 L 100 160 L 125 230"
                stroke="#fbbf24"
                strokeWidth="3"
                fill="none"
                strokeDasharray="2 1"
              />
              <circle cx="100" cy="148" r="3" fill="#fbbf24" />
              <circle cx="106" cy="165" r="3" fill="#fbbf24" />
              <circle cx="112" cy="185" r="3" fill="#fbbf24" />
              <circle cx="118" cy="205" r="3" fill="#fbbf24" />
              <circle cx="122" cy="222" r="3" fill="#fbbf24" />
            </g>
          )}

          {safeCustomization.costumeId === 'costume_lemur_ao_dai' && (
            // Áo Dài Lemur Tân Thời: Hoa sen & viền ren duyên dáng
            <g>
              <path d="M 88 135 Q 100 150 112 135" stroke="#fcd34d" strokeWidth="2.5" fill="none" />
              {/* Lotus embroidery */}
              <circle cx="100" cy="175" r="7" fill="#f43f5e" opacity="0.8" />
              <circle cx="96" cy="172" r="5" fill="#fb7185" opacity="0.9" />
              <circle cx="104" cy="172" r="5" fill="#fb7185" opacity="0.9" />
              <path d="M 100 182 L 100 195" stroke="#15803d" strokeWidth="2" />
            </g>
          )}

          {safeCustomization.costumeId === 'costume_ba_ba' && (
            // Áo Bà Ba: Cổ tròn mộc mạc & hai túi áo dưới
            <g>
              <path d="M 86 135 Q 100 146 114 135" stroke="#fef08a" strokeWidth="2" fill="none" />
              <line x1="100" y1="146" x2="100" y2="230" stroke="#451a03" strokeWidth="2" />
              {/* Two front pockets */}
              <rect x="52" y="195" width="22" height="20" rx="3" fill="#522504" stroke="#78350f" />
              <rect x="126" y="195" width="22" height="20" rx="3" fill="#522504" stroke="#78350f" />
            </g>
          )}

          {safeCustomization.costumeId === 'costume_ba_son_sailor' && (
            // Thủy Thủ Ba Son: Cổ yếm thủy thủ & viền trắng
            <g>
              <polygon points="70,140 100,175 130,140 120,132 80,132" fill="#1e40af" stroke="#93c5fd" strokeWidth="1.5" />
              <circle cx="100" cy="178" r="4" fill="#fbbf24" stroke="#78350f" />
              {/* Anchor badge */}
              <path d="M 97 190 L 103 190 M 100 188 L 100 200 M 95 197 Q 100 204 105 197" stroke="#fbbf24" strokeWidth="2" fill="none" />
            </g>
          )}

          {safeCustomization.costumeId === 'costume_don_ca_tai_tu' && (
            // Đờn Ca Tài Tử: Lụa gấm hoa văn hoàng gia tím & vàng
            <g>
              <path d="M 70 145 L 130 145 L 120 230 L 80 230 Z" fill="#4c1d95" opacity="0.3" />
              <circle cx="85" cy="165" r="4" fill="#fbbf24" />
              <circle cx="115" cy="165" r="4" fill="#fbbf24" />
              <circle cx="100" cy="190" r="5" fill="#fbbf24" />
              <path d="M 90 135 L 100 150 L 110 135" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
            </g>
          )}

          {safeCustomization.costumeId === 'costume_explorer_kaki' && (
            // Trang phục Kaki: Dây đai thám hiểm & túi hộp
            <g>
              <line x1="72" y1="140" x2="128" y2="225" stroke="#1c1917" strokeWidth="4" />
              <rect x="94" y="175" width="16" height="18" rx="2" fill="#4d7c0f" stroke="#1c1917" strokeWidth="1.5" />
            </g>
          )}

          {/* Shoulders & Arms */}
          {/* Left Arm */}
          <path
            d="M 60 140 Q 35 165 30 195 Q 38 200 48 190 Q 55 170 68 155 Z"
            fill={`url(#costumeGrad-${safeCustomization.costumeId})`}
            stroke="#451a03"
            strokeWidth="2"
          />
          {/* Right Arm (Dynamic depending on pose) */}
          {safeCustomization.pose === 'greeting' && (
            // Posed respectfully
            <path
              d="M 140 140 Q 165 165 170 195 Q 162 200 152 190 Q 145 170 132 155 Z"
              fill={`url(#costumeGrad-${safeCustomization.costumeId})`}
              stroke="#451a03"
              strokeWidth="2"
            />
          )}

          {safeCustomization.pose === 'compass_guide' && (
            // Holding compass upward
            <path
              d="M 140 140 Q 170 150 165 180 Q 155 185 145 175 Q 138 160 132 150 Z"
              fill={`url(#costumeGrad-${safeCustomization.costumeId})`}
              stroke="#451a03"
              strokeWidth="2"
            />
          )}

          {safeCustomization.pose === 'scholar_inspect' && (
            // Inspecting with glass
            <path
              d="M 140 140 Q 155 155 145 175 Q 135 178 130 165 Q 132 155 132 145 Z"
              fill={`url(#costumeGrad-${safeCustomization.costumeId})`}
              stroke="#451a03"
              strokeWidth="2"
            />
          )}
        </g>

        {/* 🧣 3. Accessory Around Neck / Shoulder (e.g. Khăn Rằn) */}
        {safeCustomization.accessoryId === 'acc_khan_ran' && (
          <g>
            <path
              d="M 75 132 Q 100 148 125 132 L 132 205 Q 125 210 118 205 L 115 142 Q 100 152 85 142 L 82 205 Q 75 210 68 205 Z"
              fill="#f8fafc"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Caro lines */}
            <path
              d="M 70 155 L 82 155 M 70 170 L 82 170 M 70 185 L 82 185 M 118 155 L 130 155 M 118 170 L 130 170 M 118 185 L 130 185"
              stroke="#0f172a"
              strokeWidth="2"
            />
          </g>
        )}

        {/* 🏷️ Thẻ Bài Hoàng Triều */}
        {safeCustomization.accessoryId === 'acc_the_bai' && (
          <g>
            <line x1="100" y1="135" x2="100" y2="168" stroke="#dc2626" strokeWidth="2" />
            <rect x="94" y="168" width="12" height="22" rx="2" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
            <text x="100" y="182" fontSize="7" fontWeight="bold" fill="#78350f" textAnchor="middle">GIA</text>
          </g>
        )}

        {/* 🗣️ 4. Neck */}
        <path d="M 88 115 L 88 138 Q 100 144 112 138 L 112 115 Z" fill={skin} stroke="#78350f" strokeWidth="1.5" />

        {/* 👤 5. Head & Facial Features */}
        <g className="character-head">
          {/* Head Base */}
          <ellipse cx="100" cy="85" rx="34" ry="38" fill={skin} stroke="#78350f" strokeWidth="2" />

          {/* Ears */}
          <circle cx="64" cy="85" r="7" fill={skin} stroke="#78350f" strokeWidth="1.5" />
          <circle cx="136" cy="85" r="7" fill={skin} stroke="#78350f" strokeWidth="1.5" />

          {/* Hair Styles */}
          {safeCustomization.hairStyle === 'traditional_bun' && (
            <g>
              {/* Bun on top */}
              <circle cx="100" cy="45" r="16" fill={hair} stroke="#0c0a09" strokeWidth="2" />
              {/* Hairline */}
              <path
                d="M 66 82 Q 75 52 100 52 Q 125 52 134 82 Q 120 62 100 64 Q 80 62 66 82 Z"
                fill={hair}
                stroke="#0c0a09"
                strokeWidth="1.5"
              />
            </g>
          )}

          {safeCustomization.hairStyle === 'vintage_wavy' && (
            <g>
              {/* Wavy vintage bob */}
              <path
                d="M 62 88 Q 60 52 100 52 Q 140 52 138 88 Q 145 105 136 115 Q 125 80 100 70 Q 75 80 64 115 Q 55 105 62 88 Z"
                fill={hair}
                stroke="#0c0a09"
                strokeWidth="2"
              />
            </g>
          )}

          {safeCustomization.hairStyle === 'modern_short' && (
            <g>
              {/* Short parted hair */}
              <path
                d="M 64 80 Q 70 48 100 48 Q 130 48 136 80 Q 120 60 100 62 Q 80 58 64 80 Z"
                fill={hair}
                stroke="#0c0a09"
                strokeWidth="2"
              />
            </g>
          )}

          {safeCustomization.hairStyle === 'scholar_ponytail' && (
            <g>
              <path
                d="M 64 80 Q 70 50 100 50 Q 130 50 136 80 Q 120 60 100 62 Q 80 60 64 80 Z"
                fill={hair}
                stroke="#0c0a09"
                strokeWidth="1.5"
              />
              <path d="M 100 48 Q 115 30 120 50" stroke={hair} strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Eyebrows */}
          <path d="M 76 74 Q 85 71 92 74" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 108 74 Q 115 71 124 74" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Eyes */}
          <ellipse cx="84" cy="84" rx="4" ry="4.5" fill="#1c1917" />
          <ellipse cx="116" cy="84" rx="4" ry="4.5" fill="#1c1917" />
          {/* Eye Sparkle */}
          <circle cx="85.5" cy="82.5" r="1.5" fill="#ffffff" />
          <circle cx="117.5" cy="82.5" r="1.5" fill="#ffffff" />

          {/* Nose */}
          <path d="M 100 83 L 98 94 L 102 94" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Mouth Expression */}
          {safeCustomization.expression === 'smile' && (
            <path d="M 90 102 Q 100 112 110 102" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}
          {safeCustomization.expression === 'proud' && (
            <path d="M 88 103 Q 100 108 112 103" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}
          {safeCustomization.expression === 'scholarly' && (
            <line x1="92" y1="104" x2="108" y2="104" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
          )}
          {safeCustomization.expression === 'focus' && (
            <path d="M 92 105 Q 100 102 108 105" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" fill="none" />
          )}

          {/* Cheeks Blush */}
          <circle cx="75" cy="92" r="5" fill="#f43f5e" opacity="0.35" />
          <circle cx="125" cy="92" r="5" fill="#f43f5e" opacity="0.35" />

          {/* 👓 Kính Cổ Cận Thị Vintage */}
          {safeCustomization.accessoryId === 'acc_kinh_vintage' && (
            <g>
              <circle cx="84" cy="84" r="9" stroke="#78350f" strokeWidth="2" fill="rgba(255,255,255,0.2)" />
              <circle cx="116" cy="84" r="9" stroke="#78350f" strokeWidth="2" fill="rgba(255,255,255,0.2)" />
              <line x1="93" y1="84" x2="107" y2="84" stroke="#78350f" strokeWidth="2" />
            </g>
          )}
        </g>

        {/* 👒 6. Headwear Overlay */}
        {safeCustomization.headwearId === 'head_non_la' && (
          // Nón Lá Quai Thao
          <g className="animate-subtleTilt">
            <polygon points="100,20 40,68 160,68" fill="url(#goldShimmer)" stroke="#78350f" strokeWidth="2" />
            {/* Weave texture lines */}
            <line x1="100" y1="20" x2="70" y2="68" stroke="#78350f" strokeWidth="0.8" opacity="0.5" />
            <line x1="100" y1="20" x2="130" y2="68" stroke="#78350f" strokeWidth="0.8" opacity="0.5" />
            <line x1="100" y1="20" x2="100" y2="68" stroke="#78350f" strokeWidth="0.8" opacity="0.5" />
            {/* Silk ribbon quai thao */}
            <path d="M 65 68 Q 100 120 135 68" stroke="#f43f5e" strokeWidth="3" fill="none" />
          </g>
        )}

        {safeCustomization.headwearId === 'head_khan_dong' && (
          // Khăn Đóng Hoàng Gia Gia Định (Khăn Xếp)
          <g>
            <ellipse cx="100" cy="56" rx="40" ry="14" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" />
            <ellipse cx="100" cy="52" rx="38" ry="12" fill="#1e293b" stroke="#fbbf24" strokeWidth="1" />
            <ellipse cx="100" cy="48" rx="35" ry="10" fill="#0f172a" />
            {/* Front gold emblem */}
            <circle cx="100" cy="56" r="4" fill="#fbbf24" stroke="#78350f" />
          </g>
        )}

        {safeCustomization.headwearId === 'head_non_tai_beo' && (
          // Nón Tai Bèo Kháng Chiến
          <g>
            <ellipse cx="100" cy="62" rx="46" ry="14" fill="#15803d" stroke="#14532d" strokeWidth="2" />
            <path d="M 68 62 Q 70 42 100 40 Q 130 42 132 62 Z" fill="#166534" stroke="#14532d" strokeWidth="1.5" />
          </g>
        )}

        {safeCustomization.headwearId === 'head_beret_vintage' && (
          // Mũ Beret Ký Giả Sài Gòn Xưa
          <g>
            <path d="M 60 62 Q 70 38 120 40 Q 146 48 140 64 Q 100 66 60 62 Z" fill="#292524" stroke="#0c0a09" strokeWidth="2" />
            <circle cx="112" cy="41" r="2.5" fill="#44403c" />
          </g>
        )}

        {safeCustomization.headwearId === 'head_non_coi' && (
          // Nón Cối Dã Ngoại
          <g>
            <ellipse cx="100" cy="64" rx="44" ry="12" fill="#3f6212" stroke="#1a2e05" strokeWidth="2" />
            <path d="M 70 64 Q 72 40 100 38 Q 128 40 130 64 Z" fill="#4d7c0f" stroke="#1a2e05" strokeWidth="1.5" />
            <circle cx="100" cy="48" r="3.5" fill="#eab308" />
          </g>
        )}

        {safeCustomization.headwearId === 'head_tram_cai_hoa_sen' && (
          // Trâm Cài Bạc Hoa Sen
          <g>
            <line x1="80" y1="40" x2="135" y2="48" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
            <circle cx="135" cy="48" r="6" fill="#38bdf8" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="135" cy="48" r="3" fill="#ffffff" />
          </g>
        )}

        {/* 🖐️ 7. Handheld Held Items & Gear */}
        {/* 🧭 La Bàn Đồng Thau Xoay 3D */}
        {safeCustomization.accessoryId === 'acc_compass' && (
          <g className="animate-spin-slow origin-[162px_180px]">
            <circle cx="162" cy="180" r="16" fill="#78350f" stroke="#fbbf24" strokeWidth="2.5" />
            <circle cx="162" cy="180" r="13" fill="#1c1917" />
            {/* Needle */}
            <polygon points="162,170 165,180 162,176 159,180" fill="#ef4444" />
            <polygon points="162,190 165,180 162,184 159,180" fill="#94a3b8" />
            <circle cx="162" cy="180" r="2.5" fill="#fbbf24" />
          </g>
        )}

        {/* 🔍 Kính Lúp Soi Cổ Vật */}
        {safeCustomization.accessoryId === 'acc_magnifier' && (
          <g>
            <circle cx="160" cy="172" r="14" fill="rgba(56, 189, 248, 0.25)" stroke="#fbbf24" strokeWidth="3" />
            <line x1="150" y1="182" x2="138" y2="198" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
            {/* Optical Glare */}
            <path d="M 152 165 Q 164 165 168 175" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* 📖 Sổ Tay & Bút Tre */}
        {safeCustomization.accessoryId === 'acc_so_tay_but_tre' && (
          <g>
            <rect x="145" y="165" width="24" height="32" rx="3" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" transform="rotate(12 157 181)" />
            <line x1="168" y1="155" x2="160" y2="185" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* 🧴 Bình Inox Tọa Độ */}
        {safeCustomization.accessoryId === 'acc_binh_inox' && (
          <g>
            <rect x="150" y="160" width="16" height="36" rx="4" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
            <rect x="153" y="152" width="10" height="8" rx="2" fill="#475569" stroke="#334155" strokeWidth="1" />
            <line x1="150" y1="175" x2="166" y2="175" stroke="#0284c7" strokeWidth="2" />
          </g>
        )}

        {/* Sparkles / Light Particle Effects */}
        <circle cx="35" cy="45" r="1.5" fill="#fef08a" className="animate-ping" />
        <circle cx="170" cy="65" r="2" fill="#fef08a" className="animate-pulse" />
        <circle cx="180" cy="140" r="1.5" fill="#38bdf8" className="animate-ping" />
      </svg>
    </div>
  );
};
