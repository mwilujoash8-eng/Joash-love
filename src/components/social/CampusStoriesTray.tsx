import React, { useState, useEffect } from 'react';
import {
  Plus,
  Play,
  Heart,
  Flame,
  ThumbsUp,
  Sparkles,
  Lightbulb,
  GraduationCap,
  Eye,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  Trash2,
  Image as ImageIcon,
  Type,
  Palette,
  Shield,
  Smile
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { StoryItem } from '../../types';

const STORY_GRADIENTS = [
  { id: 'grad_1', label: 'Tech Indigo', value: 'from-blue-600 via-indigo-700 to-purple-800' },
  { id: 'grad_2', label: 'Emerald Campus', value: 'from-emerald-600 via-teal-700 to-cyan-800' },
  { id: 'grad_3', label: 'Sunset Amber', value: 'from-amber-600 via-orange-600 to-red-600' },
  { id: 'grad_4', label: 'Royal Violet', value: 'from-purple-700 via-fuchsia-800 to-slate-950' },
  { id: 'grad_5', label: 'Ocean Blue', value: 'from-sky-600 via-blue-700 to-slate-900' },
  { id: 'grad_6', label: 'Zambian Copper', value: 'from-yellow-600 via-orange-700 to-amber-900' },
];

const PRESET_STORY_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80', caption: 'Science & Math Laboratory Practical' },
  { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80', caption: 'Campus Quad & Academic Hall' },
  { url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80', caption: 'Secondary Library Study Session' },
  { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80', caption: 'Computer Studies Digital Lab' },
];

const STORY_REACTIONS = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '👏', label: 'Applause' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '💡', label: 'Insight' },
  { emoji: '🎓', label: 'Excellence' },
  { emoji: '🙌', label: 'Praise' }
];

export const CampusStoriesTray: React.FC = () => {
  const { stories, currentUser, addStory, likeStory, reactToStory, deleteStory } = useSchool();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);

  // Story Creator State
  const [creatorMode, setCreatorMode] = useState<'text' | 'image'>('text');
  const [textContent, setTextContent] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(STORY_GRADIENTS[0].value);
  const [imageUrl, setImageUrl] = useState(PRESET_STORY_PHOTOS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);

  // Active Story Viewer Timer
  useEffect(() => {
    if (activeStoryIndex === null) return;
    setStoryProgress(0);

    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          // Advance to next story or close if last
          if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2; // ~5 seconds per story
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, stories.length]);

  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    setReplySent(false);
    setReplyText('');
    // Automatically record reaction/view if needed
    const story = stories[index];
    if (story && !story.viewedByUserIds.includes(currentUser.id)) {
      reactToStory(story.id, '👁️');
    }
  };

  const handleNextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (creatorMode === 'text' && !textContent.trim()) return;

    addStory({
      userId: currentUser.id,
      userName: currentUser.fullName,
      userAvatar: currentUser.avatarUrl,
      userRole: currentUser.role,
      mediaType: creatorMode,
      content: creatorMode === 'text' ? textContent.trim() : undefined,
      mediaUrl: creatorMode === 'image' ? (customImageUrl.trim() || imageUrl) : undefined,
      backgroundGradient: creatorMode === 'text' ? selectedGradient : undefined,
      caption: caption.trim() || (creatorMode === 'text' ? 'Campus Update' : 'Photo Story'),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

    // Reset and close
    setTextContent('');
    setCaption('');
    setCustomImageUrl('');
    setIsCreatingStory(false);
  };

  const currentActiveStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm mb-6">
      {/* TRAY HEADER */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <span>Campus Stories</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                24h Daily Feed
              </span>
            </h3>
            <p className="text-xs text-slate-500 hidden sm:block">
              Connect with classmates, subject teachers, and school announcements in real-time
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCreatingStory(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold shadow-sm transition hover:shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add to Story</span>
        </button>
      </div>

      {/* HORIZONTAL STORIES CAROUSEL */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {/* ADD STORY CARD */}
        <div
          onClick={() => setIsCreatingStory(true)}
          className="group relative shrink-0 w-24 sm:w-28 h-36 sm:h-40 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-between p-2.5 transition cursor-pointer hover:shadow-md hover:border-indigo-300"
        >
          <div className="w-full h-20 sm:h-24 rounded-xl overflow-hidden bg-slate-200 relative">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
              alt={currentUser.fullName}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-slate-900/20" />
          </div>

          <div className="absolute top-[68px] sm:top-[82px] w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center border-2 border-white shadow-sm group-hover:scale-110 transition">
            <Plus className="w-4 h-4" />
          </div>

          <span className="text-[11px] font-bold text-slate-800 text-center line-clamp-1 mt-3">
            Add to Story
          </span>
        </div>

        {/* STORY CARDS */}
        {stories.map((story, idx) => {
          const hasViewed = story.viewedByUserIds?.includes(currentUser.id);
          const isOwner = story.userId === currentUser.id;

          return (
            <div
              key={story.id}
              onClick={() => handleOpenStory(idx)}
              className={`group relative shrink-0 w-24 sm:w-28 h-36 sm:h-40 rounded-2xl overflow-hidden border shadow-xs transition duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${
                hasViewed
                  ? 'border-slate-200'
                  : 'border-indigo-400 ring-2 ring-indigo-500/40'
              }`}
            >
              {/* STORY BACKGROUND */}
              {story.mediaType === 'image' && story.mediaUrl ? (
                <img
                  src={story.mediaUrl}
                  alt={story.caption || 'Campus Story'}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${story.backgroundGradient || 'from-indigo-600 to-purple-800'} p-2.5 flex flex-col justify-center text-white`}>
                  <p className="text-[11px] font-bold line-clamp-4 leading-tight text-center drop-shadow-xs">
                    {story.content}
                  </p>
                </div>
              )}

              {/* OVERLAY GRADIENT */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

              {/* USER AVATAR BADGE */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full overflow-hidden p-0.5 border-2 ${hasViewed ? 'border-slate-400 bg-slate-700' : 'border-indigo-400 bg-indigo-600'}`}>
                  <img
                    src={story.userAvatar}
                    alt={story.userName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* STORY FOOTER */}
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-[11px] font-bold text-white truncate drop-shadow-xs">
                  {isOwner ? 'Your Story' : story.userName.split(' ')[0]}
                </p>
                <div className="flex items-center justify-between text-[9px] text-slate-200">
                  <span className="opacity-90">{story.reactions?.length || 0} reacts</span>
                  {isOwner && (
                    <span className="text-emerald-300 font-bold">You</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL-SCREEN STORY VIEWER MODAL */}
      {currentActiveStory && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-md h-[92vh] sm:h-[86vh] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl flex flex-col justify-between border border-slate-800">
            {/* PROGRESS BARS */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
              {stories.map((st, i) => (
                <div key={st.id} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100"
                    style={{
                      width:
                        i < activeStoryIndex!
                          ? '100%'
                          : i === activeStoryIndex
                          ? `${storyProgress}%`
                          : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* STORY HEADER */}
            <div className="relative z-30 p-4 pt-7 flex items-center justify-between text-white bg-gradient-to-b from-black/70 to-transparent">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentActiveStory.userAvatar}
                  alt={currentActiveStory.userName}
                  className="w-9 h-9 rounded-full object-cover border border-white/40"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">{currentActiveStory.userName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-bold capitalize">
                      {currentActiveStory.userRole.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Active Story • {new Date(currentActiveStory.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {currentActiveStory.userId === currentUser.id && (
                  <button
                    type="button"
                    onClick={() => {
                      deleteStory(currentActiveStory.id);
                      setActiveStoryIndex(null);
                    }}
                    className="p-1.5 rounded-full hover:bg-white/20 text-red-400 transition cursor-pointer"
                    title="Delete Story"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveStoryIndex(null)}
                  className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* STORY CONTENT BODY (TAP LEFT/RIGHT TO NAVIGATE) */}
            <div className="relative flex-1 flex items-center justify-center p-6 text-center select-none overflow-hidden">
              {/* LEFT & RIGHT NAVIGATION BUTTONS */}
              <button
                type="button"
                onClick={handlePrevStory}
                disabled={activeStoryIndex === 0}
                className="absolute left-2 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition disabled:opacity-0 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={handleNextStory}
                className="absolute right-2 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* MEDIA RENDER */}
              {currentActiveStory.mediaType === 'image' && currentActiveStory.mediaUrl ? (
                <div className="w-full h-full flex flex-col justify-between">
                  <img
                    src={currentActiveStory.mediaUrl}
                    alt={currentActiveStory.caption || 'Campus Story'}
                    className="w-full h-full object-contain rounded-2xl"
                  />
                  {currentActiveStory.caption && (
                    <div className="absolute bottom-20 left-4 right-4 bg-slate-950/70 backdrop-blur-md p-3 rounded-xl text-white text-xs font-semibold">
                      {currentActiveStory.caption}
                    </div>
                  )}
                </div>
              ) : (
                <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${currentActiveStory.backgroundGradient || 'from-indigo-600 via-indigo-700 to-purple-900'} p-6 sm:p-8 flex flex-col items-center justify-center shadow-inner`}>
                  <p className="text-lg sm:text-xl font-black text-white leading-relaxed tracking-wide drop-shadow-md">
                    {currentActiveStory.content}
                  </p>
                  {currentActiveStory.caption && (
                    <p className="text-xs text-white/80 mt-4 font-medium px-3 py-1 rounded-full bg-black/20">
                      {currentActiveStory.caption}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* STORY FOOTER: REACTIONS & REPLY */}
            <div className="relative z-30 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-2.5">
              {/* REACTION BAR */}
              <div className="flex items-center justify-center gap-2">
                {STORY_REACTIONS.map((rec) => (
                  <button
                    key={rec.emoji}
                    type="button"
                    onClick={() => reactToStory(currentActiveStory.id, rec.emoji)}
                    className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/30 text-lg hover:scale-125 transition cursor-pointer"
                    title={rec.label}
                  >
                    {rec.emoji}
                  </button>
                ))}
              </div>

              {/* REPLY FORM */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Send a reply to ${currentActiveStory.userName.split(' ')[0]}...`}
                  className="flex-1 px-3.5 py-2 rounded-full bg-white/15 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (replyText.trim()) {
                      reactToStory(currentActiveStory.id, '💬');
                      setReplySent(true);
                      setReplyText('');
                      setTimeout(() => setReplySent(false), 2000);
                    }
                  }}
                  className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {replySent && (
                <p className="text-center text-[11px] font-bold text-emerald-400">
                  Reply sent directly to {currentActiveStory.userName}!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STORY CREATOR MODAL */}
      {isCreatingStory && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* HEADER */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Create Campus Story</h3>
                  <p className="text-xs text-slate-300">Visible to school students, teachers & parents for 24 hours</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingStory(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORMAT SELECTOR TABS */}
            <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2">
              <button
                type="button"
                onClick={() => setCreatorMode('text')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  creatorMode === 'text'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Type className="w-4 h-4" />
                <span>Text Story</span>
              </button>

              <button
                type="button"
                onClick={() => setCreatorMode('image')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  creatorMode === 'image'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Photo Story</span>
              </button>
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleCreateSubmit} className="p-4 sm:p-5 space-y-4">
              {creatorMode === 'text' ? (
                <>
                  {/* PREVIEW CANVAS */}
                  <div className={`w-full h-44 rounded-2xl bg-gradient-to-br ${selectedGradient} p-4 flex items-center justify-center text-white text-center shadow-inner transition duration-300`}>
                    <p className="text-base font-bold drop-shadow-sm line-clamp-4">
                      {textContent || 'Type your message or educational update...'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Story Text Message
                    </label>
                    <textarea
                      rows={3}
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Share a study victory, homework tip, sports update, or reminder..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* GRADIENT PALETTE */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Background Color Theme</span>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {STORY_GRADIENTS.map((grad) => (
                        <button
                          key={grad.id}
                          type="button"
                          onClick={() => setSelectedGradient(grad.value)}
                          className={`h-9 rounded-xl bg-gradient-to-br ${grad.value} text-white text-[10px] font-bold flex items-center justify-center border-2 transition ${
                            selectedGradient === grad.value ? 'border-indigo-600 ring-2 ring-indigo-300 scale-105' : 'border-transparent opacity-80 hover:opacity-100'
                          }`}
                        >
                          {selectedGradient === grad.value ? '✓' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* PHOTO PREVIEW */}
                  <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100">
                    <img
                      src={customImageUrl || imageUrl}
                      alt="Story preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* PRESET SELECTION */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Select Campus Photo Preset
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_STORY_PHOTOS.map((ph, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setImageUrl(ph.url);
                            setCustomImageUrl('');
                          }}
                          className={`h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                            (imageUrl === ph.url && !customImageUrl)
                              ? 'border-indigo-600 ring-2 ring-indigo-300 scale-105'
                              : 'border-slate-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={ph.url} alt={ph.caption} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Or Custom Image URL
                    </label>
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Story Caption / Header
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g., Senior Math Prep / PTA Solar Project"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingStory(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                  Share to Campus Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
