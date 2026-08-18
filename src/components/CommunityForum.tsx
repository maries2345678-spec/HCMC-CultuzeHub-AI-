import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Heart, 
  Send, 
  Plus, 
  Search, 
  Award, 
  MapPin, 
  Sparkles, 
  HelpCircle, 
  Coffee, 
  BookOpen, 
  User, 
  Share2,
  X,
  Clock,
  Smile,
  MessageCircle,
  Users,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ForumPost, UserProfile, Location3D, DirectMessage, HeritageSticker } from '../types';
import { INITIAL_FORUM_POSTS } from '../data/forumData';
import { HERITAGE_STICKERS } from '../data/stickers';
import { sound } from '../utils/audio';

interface CommunityForumProps {
  user?: UserProfile;
  currentUser?: UserProfile;
  initialPosts?: ForumPost[];
  locations?: Location3D[];
  onOpenAI?: (contextText?: string) => void;
}

export const CommunityForum: React.FC<CommunityForumProps> = ({
  user,
  currentUser,
  initialPosts,
  locations,
  onOpenAI
}) => {
  const activeUser: UserProfile = user || currentUser || {
    id: 'user_sg_01',
    name: 'Lữ Khách Phương Nam',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    lpPoints: 450,
    level: 2,
    exp: 180,
    title: 'Học Giả Nam Bộ',
    badgesUnlocked: ['badge_ben_thanh'],
    completedQuests: ['quest_ben_thanh_01'],
    joinedDate: '2026'
  };

  const [activeTab, setActiveTab] = useState<'forum' | 'direct_messages'>('forum');
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    if (initialPosts && Array.isArray(initialPosts) && initialPosts.length > 0) {
      return initialPosts;
    }
    return INITIAL_FORUM_POSTS || [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});
  const [selectedCommentSticker, setSelectedCommentSticker] = useState<{ [postId: string]: HeritageSticker | null }>({});
  const [showStickerPickerForPost, setShowStickerPickerForPost] = useState<string | null>(null);

  // New Post Modal State
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'hints' | 'history' | 'cuisine' | 'general' | 'showcase'>('hints');
  const [newLocationTag, setNewLocationTag] = useState<string>('');
  const [newPostSticker, setNewPostSticker] = useState<HeritageSticker | null>(null);
  const [showPostStickerPicker, setShowPostStickerPicker] = useState<boolean>(false);

  // Direct Messaging State
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([
    {
      id: 'dm_1',
      senderId: 'user_sg_02',
      senderName: 'Trần Văn Kiệt',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
      recipientId: activeUser.id,
      recipientName: activeUser.name,
      text: 'Chào bạn! Bạn đã giải được mật thư số 1886 ở Bưu Điện Sài Gòn chưa? Mình chia sẻ manh mối nhé!',
      sticker: HERITAGE_STICKERS[0],
      timestamp: '10:15'
    },
    {
      id: 'dm_2',
      senderId: 'user_sg_03',
      senderName: 'Lê Thảo My',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
      recipientId: activeUser.id,
      recipientName: activeUser.name,
      text: 'Cố vấn Ba Son vừa hướng dẫn mình kiến trúc vòm tháp Nhà Thờ Đức Bà rất hay luôn!',
      sticker: HERITAGE_STICKERS[8],
      timestamp: '11:42'
    }
  ]);
  const [selectedRecipient, setSelectedRecipient] = useState<{ id: string; name: string; avatar: string; title: string }>({
    id: 'user_sg_02',
    name: 'Trần Văn Kiệt',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    title: 'Nhà Nghiên Cứu Ba Son'
  });
  const [dmInputText, setDmInputText] = useState<string>('');
  const [dmSelectedSticker, setDmSelectedSticker] = useState<HeritageSticker | null>(null);
  const [showDmStickerPicker, setShowDmStickerPicker] = useState<boolean>(false);

  // Fetch latest posts and direct messages
  useEffect(() => {
    fetch('/api/forum/posts')
      .then(res => res.json())
      .then(data => {
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      })
      .catch(() => {});

    fetch('/api/forum/direct-messages')
      .then(res => res.json())
      .then(data => {
        if (data.messages && Array.isArray(data.messages)) {
          setDirectMessages(data.messages);
        }
      })
      .catch(() => {});
  }, []);

  const handleLikePost = async (postId: string) => {
    sound.playClick();
    try {
      const res = await fetch(`/api/forum/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: data.likes, isLiked: data.isLiked } : p));
      }
    } catch {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1, isLiked: true } : p));
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = (commentInput[postId] || '').trim();
    const sticker = selectedCommentSticker[postId] || undefined;
    if (!text && !sticker) return;

    sound.playClick();
    setCommentInput(prev => ({ ...prev, [postId]: '' }));
    setSelectedCommentSticker(prev => ({ ...prev, [postId]: null }));
    setShowStickerPickerForPost(null);

    try {
      const res = await fetch(`/api/forum/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: activeUser.name,
          authorAvatar: activeUser.avatar,
          authorTitle: activeUser.title,
          content: text || (sticker ? `[Sticker: ${sticker.name}]` : ''),
          sticker: sticker
        })
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              commentsCount: p.commentsCount + 1,
              comments: [...p.comments, data.comment]
            };
          }
          return p;
        }));
      }
    } catch {
      const fallbackComment = {
        id: `c_${Date.now()}`,
        authorName: activeUser.name,
        authorAvatar: activeUser.avatar,
        authorTitle: activeUser.title,
        content: text || (sticker ? `[Sticker: ${sticker.name}]` : ''),
        timestamp: 'Vừa xong',
        likes: 0,
        sticker: sticker
      };
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, fallbackComment]
          };
        }
        return p;
      }));
    }
  };

  const handleSendDirectMessage = async () => {
    const text = dmInputText.trim();
    const sticker = dmSelectedSticker;
    if (!text && !sticker) return;

    sound.playClick();
    setDmInputText('');
    setDmSelectedSticker(null);
    setShowDmStickerPicker(false);

    const payload = {
      senderId: activeUser.id,
      senderName: activeUser.name,
      senderAvatar: activeUser.avatar,
      recipientId: selectedRecipient.id,
      recipientName: selectedRecipient.name,
      text: text || (sticker ? `[Đã gửi nhãn dán: ${sticker.name}]` : ''),
      sticker: sticker || undefined
    };

    try {
      const res = await fetch('/api/forum/direct-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.message) {
        setDirectMessages(prev => [...prev, data.message]);
      }
    } catch {
      const fallbackMsg: DirectMessage = {
        id: `dm_${Date.now()}`,
        ...payload,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setDirectMessages(prev => [...prev, fallbackMsg]);
    }
  };

  const handleOpenDmWithUser = (userName: string, userAvatar: string, userTitle: string) => {
    sound.playClick();
    setSelectedRecipient({
      id: `user_${userName.toLowerCase().replace(/\s+/g, '_')}`,
      name: userName,
      avatar: userAvatar,
      title: userTitle
    });
    setActiveTab('direct_messages');
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    sound.playSuccess();
    try {
      const res = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: newCategory,
          locationTag: newLocationTag || undefined,
          authorName: activeUser.name,
          authorAvatar: activeUser.avatar,
          authorTitle: activeUser.title,
          sticker: newPostSticker || undefined
        })
      });
      const data = await res.json();
      if (data.success && data.post) {
        setPosts(prev => [data.post, ...prev]);
      }
    } catch {
      const fallbackPost: ForumPost = {
        id: `post_${Date.now()}`,
        title: newTitle,
        content: newContent,
        category: newCategory,
        locationTag: newLocationTag || undefined,
        authorName: activeUser.name,
        authorAvatar: activeUser.avatar,
        authorTitle: activeUser.title,
        likes: 0,
        commentsCount: 0,
        comments: [],
        timestamp: 'Vừa xong',
        sticker: newPostSticker || undefined
      };
      setPosts(prev => [fallbackPost, ...prev]);
    }

    setNewTitle('');
    setNewContent('');
    setNewPostSticker(null);
    setIsNewPostModalOpen(false);
  };

  const filteredPosts = posts.filter(post => {
    const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.locationTag && post.locationTag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn text-stone-100">
      
      {/* Top Banner & Tab Navigation */}
      <div className="p-6 rounded-3xl bg-stone-900 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Cinzel',serif] font-bold text-xl text-amber-200">
                Diễn Đàn & Tin Nhắn Lữ Khách
              </h2>
              <p className="text-xs text-stone-400">
                Giao lưu thảo luận, nhắn tin trực tiếp với nhãn dán di sản Ba Son
              </p>
            </div>
          </div>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-2xl bg-stone-950 border border-stone-800">
            <button
              onClick={() => { sound.playClick(); setActiveTab('forum'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'forum'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Diễn Đàn Thảo Luận</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveTab('direct_messages'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'direct_messages'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Tin Nhắn Trực Tiếp & Stickers</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>

          {activeTab === 'forum' && (
            <button
              onClick={() => { sound.playClick(); setIsNewPostModalOpen(true); }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng Bài Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: FORUM POSTS */}
      {activeTab === 'forum' && (
        <div className="space-y-6">
          {/* Category Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết, bí kíp, địa danh..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 focus:border-amber-500/50 text-xs text-stone-100 placeholder-stone-500 outline-none shadow-md"
              />
            </div>

            {/* Quick Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
              {[
                { id: 'all', label: 'Tất Cả' },
                { id: 'hints', label: 'Bí Kíp Mật Thư' },
                { id: 'history', label: 'Sử Liệu Cố Vấn' },
                { id: 'cuisine', label: 'Ẩm Thực' },
                { id: 'showcase', label: 'Vinh Danh' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { sound.playClick(); setSelectedCategory(cat.id); }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map(post => {
              const isExpanded = expandedPostId === post.id;
              return (
                <div 
                  key={post.id} 
                  className="p-5 rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-500/30 transition-all shadow-xl space-y-4"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={post.authorAvatar} 
                        alt={post.authorName} 
                        className="w-10 h-10 rounded-2xl object-cover border border-amber-500/30 shadow-md" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-stone-100">{post.authorName}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                            {post.authorTitle}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-stone-500" />
                          <span>{post.timestamp}</span>
                          {post.locationTag && (
                            <>
                              <span>•</span>
                              <span className="text-amber-400 font-medium">{post.locationTag}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Direct Message Button to Author */}
                    {post.authorName !== activeUser.name && (
                      <button
                        onClick={() => handleOpenDmWithUser(post.authorName, post.authorAvatar, post.authorTitle)}
                        className="px-2.5 py-1 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-amber-300 text-xs flex items-center gap-1.5 transition-colors"
                        title="Nhắn tin riêng với tác giả này"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Nhắn Tin</span>
                      </button>
                    )}
                  </div>

                  {/* Post Body */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-amber-200">{post.title}</h3>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Sticker if present */}
                    {post.sticker && (
                      <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-stone-950 border border-amber-500/30 text-xs text-amber-200">
                        <span className="text-xl">{post.sticker.icon}</span>
                        <span className="font-bold">{post.sticker.name}</span>
                        <span className="text-[10px] text-stone-400">({post.sticker.meaning})</span>
                      </div>
                    )}
                  </div>

                  {/* Post Actions & Comments Bar */}
                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                          post.isLiked 
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold' 
                            : 'hover:bg-stone-800 text-stone-300'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                        <span>{post.likes} Thích</span>
                      </button>

                      <button
                        onClick={() => {
                          sound.playClick();
                          setExpandedPostId(isExpanded ? null : post.id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-stone-800 text-stone-300 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-amber-400" />
                        <span>{post.commentsCount} Bình Luận</span>
                      </button>
                    </div>

                    {onOpenAI && (
                      <button
                        onClick={() => onOpenAI(`Giải thích chuyên sâu và khảo cứu sử liệu về: ${post.title}`)}
                        className="flex items-center gap-1 text-amber-400 hover:text-yellow-300 text-[11px] font-semibold transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Hỏi Cố Vấn Ba Son</span>
                      </button>
                    )}
                  </div>

                  {/* Expanded Comments Section */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-stone-800 space-y-3 animate-fadeIn">
                      {/* Comments stream */}
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {post.comments && post.comments.length > 0 ? (
                          post.comments.map(c => (
                            <div key={c.id} className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80 flex items-start gap-2.5">
                              <img 
                                src={c.authorAvatar} 
                                alt={c.authorName} 
                                className="w-7 h-7 rounded-xl object-cover border border-amber-500/20 shrink-0" 
                              />
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-bold text-amber-300">{c.authorName}</span>
                                  <span className="text-stone-500">{c.timestamp}</span>
                                </div>
                                <p className="text-xs text-stone-200">{c.content}</p>
                                {c.sticker && (
                                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-900 border border-amber-500/20 text-[11px] text-amber-300 mt-1">
                                    <span>{c.sticker.icon}</span>
                                    <span>{c.sticker.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-xs text-stone-500 py-2">Chưa có bình luận nào. Hãy là người đầu tiên trao đổi!</p>
                        )}
                      </div>

                      {/* Add comment with stickers */}
                      <div className="space-y-2 pt-2">
                        {/* Sticker picker dropdown */}
                        {showStickerPickerForPost === post.id && (
                          <div className="p-3 rounded-2xl bg-stone-950 border border-amber-500/40 shadow-xl space-y-2 animate-fadeIn">
                            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                              <span>Chọn Nhãn Dán Di Sản Ba Son:</span>
                              <button onClick={() => setShowStickerPickerForPost(null)} className="text-stone-400 hover:text-stone-200">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                              {HERITAGE_STICKERS.map(stk => (
                                <button
                                  key={stk.id}
                                  type="button"
                                  onClick={() => {
                                    sound.playClick();
                                    setSelectedCommentSticker(prev => ({ ...prev, [post.id]: stk }));
                                    setShowStickerPickerForPost(null);
                                  }}
                                  className="p-2 rounded-xl bg-stone-900 hover:bg-amber-500/20 border border-stone-800 hover:border-amber-500/50 flex flex-col items-center gap-1 transition-all"
                                  title={stk.meaning}
                                >
                                  <span className="text-2xl">{stk.icon}</span>
                                  <span className="text-[10px] text-stone-300 truncate w-full text-center">{stk.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Selected sticker preview */}
                        {selectedCommentSticker[post.id] && (
                          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                            <span className="text-lg">{selectedCommentSticker[post.id]?.icon}</span>
                            <span>Đã gắn: {selectedCommentSticker[post.id]?.name}</span>
                            <button
                              onClick={() => setSelectedCommentSticker(prev => ({ ...prev, [post.id]: null }))}
                              className="ml-auto p-1 text-stone-400 hover:text-stone-200"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Input bar */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowStickerPickerForPost(showStickerPickerForPost === post.id ? null : post.id)}
                            className="p-2.5 rounded-2xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-amber-300 transition-colors"
                            title="Gắn nhãn dán"
                          >
                            <Smile className="w-4 h-4" />
                          </button>

                          <input
                            type="text"
                            value={commentInput[post.id] || ''}
                            onChange={(e) => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            placeholder="Viết phản hồi hoặc chia sẻ bí kíp..."
                            className="flex-1 px-4 py-2 rounded-2xl bg-stone-950 border border-stone-800 focus:border-amber-500/50 text-xs text-stone-100 outline-none"
                          />

                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all shadow-md"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: DIRECT MESSAGES (1-on-1 User Messaging with Stickers) */}
      {activeTab === 'direct_messages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl overflow-hidden">
          {/* User List Sidebar */}
          <div className="md:col-span-1 border-r border-stone-800 p-4 flex flex-col space-y-3 bg-stone-950/60">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="font-bold text-xs text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Users className="w-4 h-4 text-amber-400" />
                Lữ Khách Đang Online
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* List of contacts */}
            <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
              {[
                { id: 'user_sg_02', name: 'Trần Văn Kiệt', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80', title: 'Nhà Nghiên Cứu Ba Son', lastMsg: 'Chào bạn! Manh mối 1886...' },
                { id: 'user_sg_03', name: 'Lê Thảo My', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80', title: 'Họa Sĩ Gốm Lái Thiêu', lastMsg: 'Kiến trúc vòm tháp...' },
                { id: 'user_sg_04', name: 'Hoàng Long', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80', title: 'Thủy Thủ Côn Đảo', lastMsg: 'Đã hoàn thành 5 nhiệm vụ!' }
              ].map(contact => {
                const isSelected = selectedRecipient.id === contact.id;
                return (
                  <button
                    key={contact.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedRecipient({
                        id: contact.id,
                        name: contact.name,
                        avatar: contact.avatar,
                        title: contact.title
                      });
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-left ${
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-500/40 text-stone-100 shadow-md'
                        : 'bg-stone-900/60 hover:bg-stone-900 border border-transparent text-stone-300'
                    }`}
                  >
                    <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-2xl object-cover border border-amber-400/30" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs truncate text-stone-100">{contact.name}</h4>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                      <p className="text-[10px] text-amber-400 truncate">{contact.title}</p>
                      <p className="text-[11px] text-stone-400 truncate mt-0.5">{contact.lastMsg}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversation Chat Panel */}
          <div className="md:col-span-2 flex flex-col h-full bg-stone-900/40">
            {/* Direct Message Header */}
            <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={selectedRecipient.avatar} alt={selectedRecipient.name} className="w-9 h-9 rounded-2xl object-cover border border-amber-500/40" />
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-amber-200">{selectedRecipient.name}</h3>
                  <p className="text-[10px] text-stone-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Trực tuyến • {selectedRecipient.title}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {directMessages
                .filter(m => (m.recipientId === selectedRecipient.id && m.senderId === activeUser.id) || (m.senderId === selectedRecipient.id && m.recipientId === activeUser.id) || (m.recipientId === activeUser.id && m.senderName === selectedRecipient.name))
                .map(dm => {
                  const isMe = dm.senderName === activeUser.name || dm.senderId === activeUser.id;
                  return (
                    <div key={dm.id} className={`flex items-start gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <img src={dm.senderAvatar} alt={dm.senderName} className="w-8 h-8 rounded-full object-cover border border-amber-500/30 shrink-0" />
                      <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`flex items-center gap-2 text-[10px] text-stone-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <span>{dm.senderName}</span>
                          <span>•</span>
                          <span>{dm.timestamp}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-medium rounded-tr-none shadow-md'
                            : 'bg-stone-950 border border-stone-800 text-stone-100 rounded-tl-none shadow-md'
                        }`}>
                          <p>{dm.text}</p>
                          {dm.sticker && (
                            <div className="mt-2 p-2 rounded-xl bg-stone-950/80 border border-amber-500/30 flex items-center gap-2 text-xs">
                              <span className="text-2xl">{dm.sticker.icon}</span>
                              <div>
                                <div className="font-bold text-amber-300 text-[11px]">{dm.sticker.name}</div>
                                <div className="text-[10px] text-stone-300">{dm.sticker.meaning}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Direct Message Input with Sticker Picker */}
            <div className="p-3 bg-stone-950 border-t border-stone-800 space-y-2">
              {/* Sticker Picker Box */}
              {showDmStickerPicker && (
                <div className="p-3 rounded-2xl bg-stone-900 border border-amber-500/40 shadow-2xl space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span>Gửi Nhãn Dán Di Sản Ba Son:</span>
                    <button onClick={() => setShowDmStickerPicker(false)} className="text-stone-400 hover:text-stone-200">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {HERITAGE_STICKERS.map(stk => (
                      <button
                        key={stk.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setDmSelectedSticker(stk);
                          setShowDmStickerPicker(false);
                        }}
                        className="p-2 rounded-xl bg-stone-950 hover:bg-amber-500/20 border border-stone-800 hover:border-amber-500/40 flex flex-col items-center gap-1 transition-all"
                        title={stk.meaning}
                      >
                        <span className="text-2xl">{stk.icon}</span>
                        <span className="text-[10px] text-stone-300 truncate w-full text-center">{stk.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Sticker Tag */}
              {dmSelectedSticker && (
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                  <span className="text-lg">{dmSelectedSticker.icon}</span>
                  <span>Nhãn dán đã chọn: {dmSelectedSticker.name}</span>
                  <button onClick={() => setDmSelectedSticker(null)} className="ml-auto p-1 text-stone-400 hover:text-stone-200">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDmStickerPicker(!showDmStickerPicker)}
                  className="p-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-400 transition-colors"
                  title="Mở bảng nhãn dán"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={dmInputText}
                  onChange={(e) => setDmInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendDirectMessage()}
                  placeholder={`Nhắn tin trực tiếp cho ${selectedRecipient.name}...`}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 focus:border-amber-500/50 text-xs text-stone-100 outline-none"
                />

                <button
                  onClick={handleSendDirectMessage}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW POST MODAL */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-stone-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-['Cinzel',serif] font-bold text-base text-amber-200">
                Đăng Bài Viết & Chia Sẻ Di Sản Mới
              </h3>
              <button onClick={() => setIsNewPostModalOpen(false)} className="p-1 rounded-xl text-stone-400 hover:text-stone-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">Tiêu Đề Bài Viết</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Bí quyết giải câu đố Địa Đạo Củ Chi..."
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-xs text-stone-100 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-300">Chủ Đề</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 outline-none"
                  >
                    <option value="hints">Bí Kíp Mật Thư</option>
                    <option value="history">Sử Liệu Cố Vấn</option>
                    <option value="cuisine">Ẩm Thực Phương Nam</option>
                    <option value="showcase">Vinh Danh & Huy Hiệu</option>
                    <option value="general">Thảo Luận Chung</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-300">Gắn Thẻ Địa Danh (Tùy chọn)</label>
                  <input
                    type="text"
                    value={newLocationTag}
                    onChange={(e) => setNewLocationTag(e.target.value)}
                    placeholder="Ví dụ: Bến Nhà Rồng, Chợ Bến Thành..."
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">Nội Dung Bài Viết</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Chia sẻ kiến thức, lời khuyên hoặc kinh nghiệm thám hiểm..."
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-xs text-stone-100 outline-none"
                  required
                />
              </div>

              {/* Sticker selection */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-300">Gắn Nhãn Dán Di Sản</label>
                  <button
                    type="button"
                    onClick={() => setShowPostStickerPicker(!showPostStickerPicker)}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    {showPostStickerPicker ? 'Đóng bảng nhãn dán' : 'Chọn nhãn dán'}
                  </button>
                </div>

                {showPostStickerPicker && (
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 grid grid-cols-6 gap-1.5 max-h-36 overflow-y-auto">
                    {HERITAGE_STICKERS.map(stk => (
                      <button
                        key={stk.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setNewPostSticker(stk);
                          setShowPostStickerPicker(false);
                        }}
                        className={`p-1.5 rounded-lg border text-center ${
                          newPostSticker?.id === stk.id ? 'border-amber-400 bg-amber-500/20' : 'border-stone-800 bg-stone-900'
                        }`}
                        title={stk.name}
                      >
                        <span className="text-xl">{stk.icon}</span>
                      </button>
                    ))}
                  </div>
                )}

                {newPostSticker && (
                  <div className="flex items-center gap-2 p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                    <span className="text-lg">{newPostSticker.icon}</span>
                    <span>{newPostSticker.name}</span>
                    <button type="button" onClick={() => setNewPostSticker(null)} className="ml-auto">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold text-xs"
                >
                  Đăng Bài Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
