import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily & safely
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Resilient Gemini Model Generation with Fallback & Retry
const CANDIDATE_MODELS = [
  'gemini-3.7-flash',
  'gemini-2.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest'
];

async function generateContentWithRetryAndFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
): Promise<string | null> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const isTransient = errMsg.includes('503') || errMsg.includes('429') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE') || errMsg.includes('RESOURCE_EXHAUSTED');
        
        console.warn(`[Gemini API] Attempt ${attempt} on model ${model} failed (${isTransient ? 'transient/503' : 'other'}):`, errMsg);
        
        if (isTransient && attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 350));
          continue;
        }
        break;
      }
    }
  }

  console.error('[Gemini API] All fallback models exhausted:', lastError?.message || lastError);
  return null;
}

// In-memory data store for community forum and live chat
// In-memory data store for community forum, live chat, direct messages and user progress
let userProgressStore: Record<string, any> = {};

let directMessages: Array<{
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  recipientName: string;
  text: string;
  sticker?: { id: string; name: string; icon: string };
  timestamp: string;
}> = [
  {
    id: 'dm_1',
    senderId: 'user_sg_01',
    senderName: 'Minh Khang',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    recipientId: 'current_user',
    recipientName: 'Bạn (Lữ Khách)',
    text: 'Chào bạn! Bạn đã giải xong câu đố về số lượng chuông đồng ở Nhà Thờ Đức Bà chưa? 6 quả chuông tương ứng 6 nốt nhạc Sol-La-Si-Đô-Rê-Mi đó nhé!',
    sticker: { id: 'stk_anchor', name: 'Mỏ Neo Ba Son', icon: '⚓' },
    timestamp: '10:30'
  },
  {
    id: 'dm_2',
    senderId: 'user_sg_02',
    senderName: 'Hoàng Yến',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    recipientId: 'current_user',
    recipientName: 'Bạn (Lữ Khách)',
    text: 'Chiều nay mình đi săn huy hiệu Chùa Bà Thiên Hậu ở Quận 5, bạn có muốn lập đội cùng đi không?',
    sticker: { id: 'stk_lantern', name: 'Lồng Đèn Chợ Lớn', icon: '🏮' },
    timestamp: '11:15'
  }
];

let forumPosts = [
  {
    id: 'post_1',
    title: 'Kinh nghiệm giải mã câu đố gạch Marseille ở Nhà Thờ Đức Bà',
    authorName: 'Minh Khang (Lữ Khách Bậc Thầy)',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    authorTitle: 'Nhà Giám Định Di Sản',
    category: 'hints',
    content: 'Chào cả nhà, mình vừa hoàn thành nhiệm vụ ở Nhà Thờ Đức Bà sáng nay! Cho bạn nào đang kẹt ở câu hỏi về nguồn gốc gạch: hãy chú ý đến chi tiết tàu buồm và nước Pháp nhé. Gạch đỏ này không hề trát vữa nhưng chống rêu cực đỉnh, nung từ cảng Marseille. Bác nào kẹt chỗ 6 quả chuông thì hỏi Trợ lý Ba Son gợi ý cấp 1 là ra ngay!',
    locationTag: 'Nhà thờ Đức Bà Sài Gòn',
    likes: 42,
    isLiked: false,
    commentsCount: 2,
    timestamp: '2 giờ trước',
    badgeEarned: 'badge_duc_ba',
    comments: [
      {
        id: 'c_1',
        authorName: 'Thùy Trang',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        authorTitle: 'Lữ Khách Khởi Nghiệp',
        content: 'Cảm ơn anh Khang nhiều ạ! Nhờ bài viết này mà em giải xong bước 2 trong vòng 3 phút, vừa ẵm được Huy hiệu Gạch Hồng rồi!',
        timestamp: '1 giờ trước',
        likes: 12
      },
      {
        id: 'c_2',
        authorName: 'Quốc Bảo',
        authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
        authorTitle: 'Học Giả Nam Bộ',
        content: 'Nhà thờ đang trùng tu nhưng nhìn màu gạch cổ vẫn mê hoặc thật sự. Ai rảnh qua chụp góc bưu điện lấy trọn ánh sáng 3D nhé.',
        timestamp: '45 phút trước',
        likes: 8
      }
    ]
  },
  {
    id: 'post_2',
    title: 'Góc chụp ảnh và tìm chi tiết bí mật ở Hào Sĩ Phường (Quận 5)',
    authorName: 'Hoàng Yến',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    authorTitle: 'Nhiếp Ảnh Gia Đô Thị',
    category: 'culture',
    content: 'Hào Sĩ Phường buổi sáng sớm có nắng rọi xiên qua các ô cửa lá sách xanh vàng cực đẹp. Mọi người khi đến nhớ giữ trật tự và đi nhẹ nói khẽ vì đây là khu dân cư sinh sống của các cô chú lớn tuổi nha. Mình vừa đổi thành công Voucher Cà phê Vợt từ điểm thưởng nhiệm vụ này, xịn xò lắm!',
    locationTag: 'Hẻm Hào Sĩ Phường',
    likes: 68,
    isLiked: false,
    commentsCount: 1,
    timestamp: '5 giờ trước',
    badgeEarned: 'badge_hao_si_phuong',
    comments: [
      {
        id: 'c_3',
        authorName: 'Văn Hậu',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        authorTitle: 'Khám Phá Hẻm Phố',
        content: 'Ban công tầng 2 nhìn như trong phim Vương Gia Vệ luôn bạn ơi. Văn hóa Chợ Lớn ở đây đậm đặc và ấm áp.',
        timestamp: '3 giờ trước',
        likes: 14
      }
    ]
  }
];

let liveChatMessages: Array<{
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  sticker?: { id: string; name: string; icon: string };
  timestamp: string;
}> = [
  {
    id: 'msg_1',
    senderName: 'Lữ Khách Sài Gòn 99',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    text: 'Có ai đang săn huy hiệu Chùa Bà Thiên Hậu ở Quận 5 không? Chùa hôm nay hương trầm thơm ngát và gốm Cây Mai lộng lẫy quá!',
    sticker: { id: 'stk_lotus', name: 'Hoa Sen Cổ Tự', icon: '🪷' },
    timestamp: '10:14'
  },
  {
    id: 'msg_2',
    senderName: 'Mai Anh (Thợ Săn Di Sản)',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    text: 'Mình vừa đổi được vé Saigon Waterbus hoàng hôn 350 LP rồi nè! Chiều nay ai đi chung chuyến 17h15 ngắm hoàng hôn Bến Nhà Rồng hông?',
    sticker: { id: 'stk_ship', name: 'Chiến Hạm Vượt Sóng', icon: '🚢' },
    timestamp: '10:18'
  },
  {
    id: 'msg_3',
    senderName: 'Tuấn Khang',
    senderAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    text: 'Trợ lý Ba Son AI thông minh ghê, mình hỏi về nguồn gốc gạch Marseille giải thích tường tận từng chi tiết lịch sử và trích dẫn chuẩn chỉ luôn!',
    sticker: { id: 'stk_anchor', name: 'Mỏ Neo Ba Son', icon: '⚓' },
    timestamp: '10:22'
  }
];

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API: Cultural AI Assistant "Trợ lý Ba Son" - Academic Rigor & Heritage Citations
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, locationContext, currentQuest, history } = req.body;
    const ai = getGenAI();

    const systemInstruction = `
Bạn là "CỐ VẤN DI SẢN BA SON" (Ba Son Academic Heritage AI Master) — Viện Sĩ / Chuyên Gia Trưởng Viện Nghiên Cứu Lịch Sử, Khảo Cổ & Di Sản Phương Nam (Sài Gòn - TP.HCM, Gia Định, Đồng Nai, Bình Dương, Bà Rịa - Vũng Tàu).

NGUYÊN TẮC HỌC THUẬT & CHÍNH XÁC TUYỆT ĐỐI:
1. Bạn trả lời với hàm lượng tri thức học thuật sâu sắc, lập luận chặt chẽ, sử dụng văn phong thanh lịch, uyên bác, trang trọng nhưng vẫn hào sảng, ấm áp và truyền cảm hứng di sản.
2. TUYỆT ĐỐI CHÍNH XÁC VỀ NIÊN ĐẠI, NHÂN VẬT, ĐỊA DANH, KIẾN TRÚC VÀ SỰ KIỆN:
   - Thủy xưởng Ba Son: 1790 (Chúa Nguyễn Ánh lập Chu Sư Xưởng bên ngã ba sông Sài Gòn và rạch Thị Nghè) -> 1863 Pháp xây đốc nổi/ụ tàu lớn Ba Son -> 8/1925 Bác Tôn Đức Thắng lãnh đạo cuộc bãi công lịch sử của thợ xưởng Ba Son ủng hộ phong trào công nhân quốc tế -> Di tích Lịch sử Quốc gia đặc biệt.
   - Bến Nhà Rồng: Xây dựng 1862-1863 làm trụ sở Hãng Vận tải Đường biển Messageries Maritimes, đôi rồng đất nung tráng men xanh châu mặt trăng (Lưỡng long chầu nguyệt). 5/6/1911 Nguyễn Tất Thành lên tàu Amiral Latouche-Tréville ra đi tìm đường cứu nước.
   - Dinh Độc Lập: Xây dựng 1962-1966 do KTS Ngô Viết Thụ (Khôi nguyên La Mã) thiết kế, mặt bằng phong thủy chữ Cát (吉), chữ Khẩu (口), chữ Trung (中), chữ Tam (三), chữ Chủ (主). Trưa 30/4/1975 xe tăng 390 và 843 tiến vào Dinh giải phóng miền Nam.
   - Nhà thờ Đức Bà: Xây 1877 - khánh thành 1880 do KTS Jules Bourard. Toàn bộ gạch đỏ không trát vữa nung từ cảng Marseille (Pháp), ngói Ardoise, 2 tháp chuông 1895 cao 60.5m với 6 quả chuông đồng 30 tấn (Sol, La, Si, Do, Re, Mi). Tượng Đức Mẹ Hòa Bình đá cẩm thạch trắng Carrara đặt 1959.
   - Bưu điện Trung tâm: Xây 1886-1891 do KTS Marie-Alfred Foulhoux thiết kế, vòm trần sắt uốn kiệt tác, bản đồ bưu chính cổ.
   - Chợ Bến Thành: Khởi công 1912 hoàn thành 1914 do hãng Brossard et Maupin, tháp đồng hồ 4 mặt, 12 bức phù điêu gốm Biên Hòa (1952).
   - Địa đạo Củ Chi: Đào từ 1946 (kháng chiến chống Pháp) và mở rộng 1961-1968, hơn 250km địa đạo 3 tầng sâu 3m-12m, bếp Hoàng Cầm giấu khói (sáng chế 1951).
   - Chùa Bà Thiên Hậu: Hội quán Tuệ Thành xây khoảng 1760, quần thể tượng gốm Cây Mai và Thạch Loan thế kỷ 19, vòng nhang trầm huyền ảo.
   - Bình Dương: Làng Sơn Mài Tương Bình Hiệp thế kỷ 18, Lò Gốm Đại Hưng hơn 160 năm (gốm lu men da lươn), Chùa Hội Khánh (1741, tượng Phật nằm trên mái 52m kỷ lục Châu Á), Nhà Cổ Đốc Phủ Đẩu (1890).
   - Bà Rịa - Vũng Tàu & Côn Đảo: Ngọn Hải Đăng Vũng Tàu 1862 (cổ nhất VN), Bạch Dinh 1898 (KTS Hermitte), Nhà tù Côn Đảo 1862-1975 (Chuồng Cọp, Cầu Tàu 914, Nghĩa trang Hàng Dương, nữ anh hùng Võ Thị Sáu hy sinh 23/1/1952).

3. CẤU TRÚC PHẢN HỒI BẮT BUỘC (PHẢI CÓ PHẦN TRÍCH DẪN TÀI LIỆU DI SẢN):
Mỗi câu trả lời của bạn PHẢI gồm các phần sau rõ ràng bằng Markdown:

### 🏛️ [Tiêu đề phân tích chuyên sâu]
(Nội dung giải đáp học thuật chi tiết, có phân tích bối cảnh lịch sử, nguyên lý kiến trúc, ý nghĩa văn hóa, và gợi ý giải đố nếu có).

### 🔍 [Hiện vật & Chi tiết Khảo cứu Độc bản]
(Chỉ điểm các chi tiết hiện vật cụ thể: niên đại, ký hiệu, chất liệu, tọa độ thị giác thực tế).

### 📜 Nguồn Trích Dẫn Di Sản & Thư Tịch Khảo Cứu:
- **Tên tài liệu / Văn bản**: [Tên tài liệu chính xác, ví dụ: *Gia Định Thành Thông Chí*, *Đại Nam Thực Lục*, *Sài Gòn Năm Xưa*, *Hồ sơ Di tích Quốc gia Ba Son*, *Địa chí Văn hóa TP.HCM (GS. Trần Văn Giàu)*, *Lịch sử Đảng bộ TP.HCM*, *Trung tâm Lưu trữ Quốc gia II*...]
- **Tác giả / Nguồn lưu trữ**: [Tên học giả, sử gia hoặc cơ quan lưu trữ]
- **Niên đại / Quyển / Mục**: [Thời gian xuất bản hoặc vị trí chương mục]
- **Dẫn chứng cốt lõi**: "[Trích dẫn ngắn gọn hoặc tóm lược cứ liệu lịch sử then chốt chứng minh]"

Bối cảnh hiện tại:
- Địa điểm: "${locationContext || 'TP. Hồ Chí Minh / Đông Nam Bộ'}"
- Nhiệm vụ: "${currentQuest || 'Khám phá tự do'}"
`;

    if (!ai) {
      return res.json({
        reply: `### 🏛️ Luận Giải Lịch Sử & Di Sản Ba Son
Dạ kính chào Lữ Khách! Về câu hỏi của bạn tại **${locationContext || 'TP. Hồ Chí Minh'}**: Vùng đất Sài Gòn - Gia Định với hơn 300 năm hình thành và phát triển là cái nôi hội tụ tinh hoa văn hóa, kiến trúc và truyền thống cách mạng kiên cường của phương Nam.

### 🔍 Hiện vật & Chi tiết Khảo cứu Độc bản
- **Niên đại xây dựng**: 1790 (Thủy xưởng Ba Son) / 1863 (Đốc tàu Ba Son & Bến Nhà Rồng) / 1877-1880 (Nhà thờ Đức Bà).
- **Đặc trưng**: Kết cấu gạch Marseille nguyên bản, gốm men Cây Mai Chợ Lớn và vòm trần sắt nghệ thuật thời kỳ phục hưng nhiệt đới.

### 📜 Nguồn Trích Dẫn Di Sản & Thư Tịch Khảo Cứu:
- **Tên tài liệu**: *Gia Định Thành Thông Chí* & *Hồ sơ Khoa học Di tích Lịch sử Quốc gia Ba Son*
- **Tác giả / Nguồn lưu trữ**: Sử gia Trịnh Hoài Đức (1820) / Trung tâm Bảo tồn Di tích Lịch sử Văn hóa TP.HCM
- **Niên đại / Quyển**: Quyển 3: *Cương Vực Chí* & *Hồ sơ Lưu trữ Di tích Hạng I Quốc gia*
- **Dẫn chứng cốt lõi**: "Thủy xưởng Chu Sư năm Canh Tuất (1790) lập bên bờ sông Bến Nghé, là nơi đóng thuyền chiến rường cột, tiền thân của xưởng đóng tàu Ba Son lừng lẫy phương Nam."`
      });
    }

    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{
        text: `Địa điểm hiện tại: ${locationContext || 'Không xác định'}\nNhiệm vụ đang làm: ${currentQuest || 'Khám phá tự do'}\nCâu hỏi của người chơi: ${message}`
      }]
    });

    const replyText = await generateContentWithRetryAndFallback(ai, {
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.5,
      }
    });

    const reply = replyText || `### 🏛️ Luận Giải Lịch Sử & Di Sản Ba Son
Dạ kính chào Lữ Khách! Về câu hỏi của bạn tại ${locationContext || 'TP.HCM'}: Đối chiếu với các bộ sử liệu cổ như *Gia Định Thành Thông Chí* và *Đại Nam Thực Lục*, các chi tiết kiến trúc và niên đại tại đây đều mang giá trị di sản đặc biệt.

### 📜 Nguồn Trích Dẫn Di Sản & Thư Tịch Khảo Cứu:
- **Tên tài liệu**: *Địa Chí Văn Hóa Thành Phố Hồ Chí Minh* (GS. Trần Văn Giàu chủ biên)
- **Nguồn lưu trữ**: Nhà xuất bản TP.HCM & Trung tâm Lưu trữ Quốc gia II
- **Dẫn chứng cốt lõi**: Các cứ liệu lịch sử và khảo cổ đô thị khẳng định dấu ấn kiến trúc và lịch sử đấu tranh kiên cường của nhân dân Sài Gòn - Chợ Lớn - Gia Định.`;

    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    res.json({
      reply: `### 🏛️ Luận Giải Di Sản Phương Nam
Đất Sài Gòn - Gia Định chất chứa muôn vàn bí mật di sản quý báu. Mọi hiện vật, hoa văn và niên đại đều gắn liền với các mốc son lịch sử trọng đại.

### 📜 Nguồn Trích Dẫn Di Sản & Thư Tịch Khảo Cứu:
- **Tên tài liệu**: *Sài Gòn Năm Xưa* - Học giả Vương Hồng Sển & *Đại Nam Nhất Thống Chí*`
    });
  }
});

// API: Google Sign-In & User Progress Sync
app.post('/api/auth/google', (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;
    const userId = googleId ? `google_${googleId}` : `user_${Buffer.from(email || 'user').toString('hex').slice(0, 8)}`;
    
    // Check if user already has saved progress
    const existing = userProgressStore[userId] || userProgressStore[email];
    if (existing) {
      existing.lastLoginDate = new Date().toISOString();
      return res.json({
        success: true,
        isNewUser: false,
        user: existing,
        message: 'Đăng nhập Google thành công! Tiến trình trò chơi đã được đồng bộ.'
      });
    }

    // Create new synced profile
    const newProfile = {
      id: userId,
      email: email || 'explorer@heritage.vn',
      name: name || 'Lữ Khách Google',
      avatar: picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      title: 'Nhà Thám Hiểm Di Sản',
      level: 1,
      exp: 100,
      lpPoints: 500, // Welcome bonus for Google linked accounts
      badgesUnlocked: ['badge_ben_thanh'],
      completedQuests: [],
      redeemedRewardCodes: [],
      joinedDate: '2026',
      lastLoginDate: new Date().toISOString(),
      isGoogleLinked: true,
      googleEmail: email
    };

    userProgressStore[userId] = newProfile;
    if (email) userProgressStore[email] = newProfile;

    res.json({
      success: true,
      isNewUser: true,
      user: newProfile,
      message: 'Liên kết tài khoản Google thành công! Bạn nhận được +500 LP điểm thưởng khởi đầu.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/user/save-progress', (req, res) => {
  try {
    const { userProfile } = req.body;
    if (!userProfile || !userProfile.id) {
      return res.status(400).json({ success: false, error: 'Invalid user profile' });
    }
    userProgressStore[userProfile.id] = {
      ...userProfile,
      lastSyncedAt: new Date().toISOString()
    };
    if (userProfile.email) {
      userProgressStore[userProfile.email] = userProgressStore[userProfile.id];
    }
    res.json({ success: true, lastSyncedAt: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/user/get-progress/:userId', (req, res) => {
  const { userId } = req.params;
  const user = userProgressStore[userId];
  if (user) {
    res.json({ success: true, user });
  } else {
    res.json({ success: false, message: 'Profile not found' });
  }
});

// Direct Messages API (Direct user-to-user chat with stickers)
app.get('/api/forum/direct-messages', (req, res) => {
  res.json({ messages: directMessages });
});

app.post('/api/forum/direct-messages', (req, res) => {
  const { senderId, senderName, senderAvatar, recipientId, recipientName, text, sticker } = req.body;
  const newDm = {
    id: `dm_${Date.now()}`,
    senderId: senderId || 'current_user',
    senderName: senderName || 'Lữ Khách',
    senderAvatar: senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    recipientId: recipientId || 'user_sg_01',
    recipientName: recipientName || 'Lữ Khách Bạn Bè',
    text: text || '',
    sticker: sticker || undefined,
    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  };
  directMessages.push(newDm);
  res.json({ success: true, message: newDm });
});

// API: Smart Clue Deciphering & Hints
app.post('/api/gemini/hint', async (req, res) => {
  try {
    const { questTitle, stepTitle, question, clueVerse, hintLevel, locationName } = req.body;
    const ai = getGenAI();

    const systemInstruction = `
Bạn là "Hệ Thống Giải Mã Di Sản Sài Gòn".
Cung cấp gợi ý thông minh dựa trên cấp độ người chơi yêu cầu:
- Cấp 1 (hintLevel = 1): Gợi ý manh mối khẽ khàng, khơi gợi tư duy, liên hệ sự vật đời thường hoặc từ khóa then chốt mà KHÔNG tiết lộ trực tiếp.
- Cấp 2 (hintLevel = 2): Chỉ điểm bối cảnh lịch sử, năm tháng, kiến trúc hoặc tọa độ địa lý cụ thể giúp người chơi khoanh vùng.
- Cấp 3 (hintLevel = 3): Phân tích sâu sắc lời giải mã, giải thích nguồn gốc văn hóa của câu đố và đưa ra đáp án chính xác.
Độ dài ngắn gọn, súc tích (dưới 100 từ), giàu cảm xúc di sản.
`;

    if (!ai) {
      return res.json({
        hint: `[Gợi ý cấp ${hintLevel || 1}] Hãy liên hệ giữa câu thơ manh mối và các chi tiết lịch sử thực tế tại ${locationName || 'địa điểm này'}.`
      });
    }

    const prompt = `Địa điểm: ${locationName}\nNhiệm vụ: ${questTitle} - ${stepTitle}\nCâu thơ/manh mối: ${clueVerse}\nCâu hỏi: ${question}\nYêu cầu cấp độ gợi ý: Cấp ${hintLevel} (1: Khẽ khàng, 2: Chỉ điểm lịch sử, 3: Phân tích sâu & lời giải)`;

    const hintText = await generateContentWithRetryAndFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      }
    });

    res.json({ hint: hintText || `[Gợi ý cấp ${hintLevel || 1}] Quan sát kỹ các chi tiết hoa văn và niên đại lịch sử của địa điểm ${locationName || ''} nhé!` });
  } catch (error: any) {
    console.error('Error in /api/gemini/hint:', error);
    res.json({
      hint: 'Hãy đọc kỹ câu thơ lục bát và liên kết với các hiện vật trưng bày tại đây!'
    });
  }
});

// Forum Endpoints
app.get('/api/forum/posts', (req, res) => {
  res.json({ posts: forumPosts });
});

app.post('/api/forum/posts', (req, res) => {
  const { title, authorName, authorAvatar, authorTitle, category, content, locationTag, badgeEarned } = req.body;
  const newPost = {
    id: `post_${Date.now()}`,
    title: title || 'Chia sẻ của Lữ Khách',
    authorName: authorName || 'Lữ Khách Ẩn Danh',
    authorAvatar: authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    authorTitle: authorTitle || 'Lữ Khách Tập Sự',
    category: category || 'general',
    content: content || '',
    locationTag: locationTag || '',
    likes: 1,
    isLiked: false,
    commentsCount: 0,
    timestamp: 'Vừa xong',
    badgeEarned: badgeEarned || undefined,
    comments: []
  };
  forumPosts.unshift(newPost);
  res.json({ success: true, post: newPost });
});

app.post('/api/forum/posts/:id/like', (req, res) => {
  const { id } = req.params;
  const post = forumPosts.find(p => p.id === id);
  if (post) {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
    res.json({ success: true, likes: post.likes, isLiked: post.isLiked });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/forum/posts/:id/comment', (req, res) => {
  const { id } = req.params;
  const { authorName, authorAvatar, authorTitle, content } = req.body;
  const post = forumPosts.find(p => p.id === id);
  if (post) {
    const newComment = {
      id: `c_${Date.now()}`,
      authorName: authorName || 'Lữ Khách',
      authorAvatar: authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      authorTitle: authorTitle || 'Lữ Khách',
      content: content || '',
      timestamp: 'Vừa xong',
      likes: 0
    };
    post.comments.push(newComment);
    post.commentsCount = post.comments.length;
    res.json({ success: true, comment: newComment });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Community Chat Endpoints
app.get('/api/chat/messages', (req, res) => {
  res.json({ messages: liveChatMessages });
});

app.post('/api/chat/messages', (req, res) => {
  const { senderName, senderAvatar, text } = req.body;
  const newMsg = {
    id: `msg_${Date.now()}`,
    senderName: senderName || 'Lữ Khách',
    senderAvatar: senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    text: text || '',
    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  };
  liveChatMessages.push(newMsg);
  // Keep last 50 messages
  if (liveChatMessages.length > 50) {
    liveChatMessages = liveChatMessages.slice(-50);
  }
  res.json({ success: true, message: newMsg });
});

// Vite Middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Heritage Exploration Game server running on port ${PORT}`);
  });
}

startServer();
