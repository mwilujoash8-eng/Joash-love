import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  GraduationCap,
  Sparkles,
  Plus,
  MessageSquare,
  ThumbsUp,
  Pin,
  Send,
  Calendar,
  Clock,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Paperclip,
  Share2,
  ArrowRight,
  Compass,
  Award,
  Layers
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolGroup, GroupPost, SchoolGroupCategory } from '../../types';

export const SchoolGroupsHub: React.FC = () => {
  const {
    groups,
    groupPosts,
    currentUser,
    allUsers,
    createGroup,
    joinGroup,
    leaveGroup,
    addGroupPost,
    likeGroupPost,
    addPostComment
  } = useSchool();

  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || 'grp_pta_general');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Post composer state
  const [postText, setPostText] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [attachmentName, setAttachmentName] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Group creation form state
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    category: 'grade_group' as SchoolGroupCategory,
    grade: '10',
    description: '',
    bannerGradient: 'from-blue-600 via-indigo-700 to-purple-800',
    icon: 'GraduationCap'
  });

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  // Filter groups
  const filteredGroups = groups.filter((g) => {
    if (activeCategoryFilter !== 'all' && g.category !== activeCategoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q);
    }
    return true;
  });

  // Posts for current group
  const currentGroupPosts = groupPosts
    .filter((p) => p.groupId === selectedGroup?.id)
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  // Determine if user is a member
  // (Note: For PTA group, non-students are automatically members by school governance policy)
  const isPtaGroup = selectedGroup?.category === 'pta_group' || selectedGroup?.isAutoJoinedPta;
  const isAutomaticPtaMember = isPtaGroup && currentUser.role !== 'student';
  const isExplicitMember = selectedGroup?.memberIds?.includes(currentUser.id);
  const isCurrentMember = isAutomaticPtaMember || isExplicitMember;

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim() || !selectedGroup) return;

    addGroupPost({
      groupId: selectedGroup.id,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorAvatar: currentUser.avatarUrl,
      authorRole: currentUser.role,
      content: postText.trim(),
      isPinned,
      attachmentName: attachmentName.trim() || undefined,
      attachmentType: attachmentName ? 'notes' : undefined
    });

    setPostText('');
    setIsPinned(false);
    setAttachmentName('');
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupData.name.trim()) return;

    const created = createGroup({
      name: newGroupData.name.trim(),
      category: newGroupData.category,
      grade: newGroupData.grade,
      description: newGroupData.description.trim() || `Official ${newGroupData.name} discussion and study portal.`,
      bannerGradient: newGroupData.bannerGradient,
      icon: newGroupData.icon,
      createdById: currentUser.id,
      createdByName: currentUser.fullName,
      memberIds: [currentUser.id]
    });

    setSelectedGroupId(created.id);
    setIsCreatingGroup(false);
    setNewGroupData({
      name: '',
      category: 'grade_group',
      grade: '10',
      description: '',
      bannerGradient: 'from-blue-600 via-indigo-700 to-purple-800',
      icon: 'GraduationCap'
    });
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId] || '';
    if (!text.trim()) return;
    addPostComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="w-full space-y-6">
      {/* HUB HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Classroom & Grade Communities</span>
              </span>

              {currentUser.role !== 'student' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Auto-Enrolled in PTA Group</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Group Classes, Grade Cohorts & PTA Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Collaborative spaces for specific classes, full grade cohorts (8–12), academic clubs, and the school-wide PTA Assembly where parents and educators collaborate.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreatingGroup(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs sm:text-sm font-black shadow-lg hover:shadow-xl transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Group</span>
          </button>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: GROUPS DIRECTORY & ACTIVE GROUP STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: GROUPS LIST (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          {/* SEARCH & FILTERS */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search groups..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* CATEGORY TABS */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'pta_group', label: 'PTA Assembly' },
                { id: 'grade_group', label: 'Grade Groups' },
                { id: 'class_group', label: 'Class Streams' },
                { id: 'club', label: 'Clubs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategoryFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    activeCategoryFilter === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* GROUPS LIST */}
          <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {filteredGroups.map((grp) => {
              const isSelected = grp.id === selectedGroup?.id;
              const isPta = grp.category === 'pta_group';

              return (
                <div
                  key={grp.id}
                  onClick={() => setSelectedGroupId(grp.id)}
                  className={`p-3.5 rounded-2xl border transition duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grp.bannerGradient} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}>
                      {isPta ? 'PTA' : grp.grade ? `G${grp.grade}` : 'GRP'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-black text-slate-900 truncate">
                          {grp.name}
                        </h4>
                        {isPta && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            Auto PTA
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {grp.description}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{grp.postsCount} posts</span>
                        <span>• Active {grp.recentActivity}</span>
                      </div>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition ${isSelected ? 'text-indigo-600 translate-x-1' : 'text-slate-300'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE GROUP WALL & FEED (8 COLS) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedGroup ? (
            <>
              {/* GROUP HERO BANNER */}
              <div className={`rounded-3xl bg-gradient-to-br ${selectedGroup.bannerGradient} p-6 text-white shadow-md relative overflow-hidden`}>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-white/20 text-white backdrop-blur-xs">
                        {selectedGroup.category.replace('_', ' ')}
                      </span>
                      {selectedGroup.grade && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/20 text-white">
                          Grade {selectedGroup.grade} Cohort
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {selectedGroup.name}
                    </h2>
                    <p className="text-xs text-white/90 leading-relaxed">
                      {selectedGroup.description}
                    </p>
                  </div>

                  {/* JOIN / LEAVE / AUTO BADGE */}
                  <div className="shrink-0">
                    {isAutomaticPtaMember ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/30">
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>PTA Automatic Member</span>
                      </span>
                    ) : isCurrentMember ? (
                      <button
                        type="button"
                        onClick={() => leaveGroup(selectedGroup.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Leave Group
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => joinGroup(selectedGroup.id)}
                        className="px-4 py-2 rounded-xl bg-white text-indigo-900 hover:bg-slate-100 text-xs font-black shadow-md transition cursor-pointer"
                      >
                        + Join Group
                      </button>
                    )}
                  </div>
                </div>

                {/* PTA AUTO-MEMBERSHIP NOTICE IF APPLICABLE */}
                {isPtaGroup && (
                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-2 text-[11px] text-white/90">
                    <Shield className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>
                      School Governance Policy: All Parents, Faculty Teachers, and Administrators are automatically enrolled members of this PTA Council Group.
                    </span>
                  </div>
                )}
              </div>

              {/* POST COMPOSER */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs">
                <form onSubmit={handleCreatePost} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                      alt={currentUser.fullName}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex-1">
                      <textarea
                        rows={2}
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        placeholder={`Share notes, homework questions, or updates with ${selectedGroup.name}...`}
                        className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={attachmentName}
                        onChange={(e) => setAttachmentName(e.target.value)}
                        placeholder="Attach Note / Doc Title (Optional)"
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-700 w-48"
                      />

                      {(currentUser.role === 'head_teacher' || currentUser.role === 'teacher') && (
                        <label className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isPinned}
                            onChange={(e) => setIsPinned(e.target.checked)}
                            className="rounded text-indigo-600"
                          />
                          <span>Pin to top</span>
                        </label>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Update</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* POSTS FEED */}
              <div className="space-y-4">
                {currentGroupPosts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-400">
                    <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-bold text-slate-600">No posts in this group yet</p>
                    <p className="text-[11px] text-slate-400">Be the first to share study notes or start a discussion!</p>
                  </div>
                ) : (
                  currentGroupPosts.map((post) => {
                    const isLiked = post.likes.includes(currentUser.id);

                    return (
                      <div
                        key={post.id}
                        className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3"
                      >
                        {/* POST HEADER */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={post.authorAvatar}
                              alt={post.authorName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-black text-slate-900">{post.authorName}</h4>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold capitalize">
                                  {post.authorRole.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400">
                                {new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>

                          {post.isPinned && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              <Pin className="w-3 h-3 text-amber-600" />
                              <span>Pinned</span>
                            </span>
                          )}
                        </div>

                        {/* CONTENT */}
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                          {post.content}
                        </p>

                        {/* ATTACHMENT CARD IF ANY */}
                        {post.attachmentName && (
                          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-indigo-600" />
                              <span className="font-bold text-indigo-950">{post.attachmentName}</span>
                            </div>
                            <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                              Study Document
                            </span>
                          </div>
                        )}

                        {/* LIKE & COMMENT ACTIONS */}
                        <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs">
                          <button
                            type="button"
                            onClick={() => likeGroupPost(post.id)}
                            className={`inline-flex items-center gap-1.5 font-bold transition cursor-pointer ${
                              isLiked ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-indigo-600' : ''}`} />
                            <span>{post.likes.length} Likes</span>
                          </button>

                          <span className="text-slate-400">
                            {post.comments.length} Comments
                          </span>
                        </div>

                        {/* COMMENTS LIST */}
                        {post.comments.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-slate-50 bg-slate-50/50 p-3 rounded-2xl">
                            {post.comments.map((c) => (
                              <div key={c.id} className="flex items-start gap-2 text-xs">
                                <img
                                  src={c.authorAvatar}
                                  alt={c.authorName}
                                  className="w-6 h-6 rounded-full object-cover mt-0.5"
                                />
                                <div className="flex-1 bg-white p-2 rounded-xl border border-slate-200">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900 text-[11px]">{c.authorName}</span>
                                    <span className="text-[9px] text-slate-400">
                                      {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-slate-700 text-[11px] mt-0.5">{c.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* COMMENT INPUT */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSendComment(post.id);
                            }}
                            placeholder="Write a comment..."
                            className="flex-1 px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleSendComment(post.id)}
                            className="p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">Select a group to view its classroom stream</p>
            </div>
          )}
        </div>
      </div>

      {/* CREATE GROUP MODAL */}
      {isCreatingGroup && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in duration-150">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Create Classroom or Grade Group</h3>
                  <p className="text-xs text-slate-300">Simple setup for classes, study cohorts, and clubs</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingGroup(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  value={newGroupData.name}
                  onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
                  placeholder="e.g., Grade 10 Physical Science Hub / Grade 11A Stream"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newGroupData.category}
                    onChange={(e) => setNewGroupData({ ...newGroupData, category: e.target.value as SchoolGroupCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="grade_group">Full Grade Cohort (8-12)</option>
                    <option value="class_group">Class Stream (e.g. 9A, 10B)</option>
                    <option value="subject_group">Subject Department Hub</option>
                    <option value="club">Academic Club & Society</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Grade Level
                  </label>
                  <select
                    value={newGroupData.grade}
                    onChange={(e) => setNewGroupData({ ...newGroupData, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="All">All Grades / School-wide</option>
                    <option value="8">Grade 8</option>
                    <option value="9">Grade 9 (Junior Secondary)</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12 (Senior Secondary / ECZ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description & Group Purpose
                </label>
                <textarea
                  rows={2}
                  value={newGroupData.description}
                  onChange={(e) => setNewGroupData({ ...newGroupData, description: e.target.value })}
                  placeholder="State the objective, homework posting rules, and study guidelines..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Banner Color Theme
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'b1', val: 'from-blue-600 via-indigo-700 to-purple-800' },
                    { id: 'b2', val: 'from-emerald-600 via-teal-700 to-cyan-800' },
                    { id: 'b3', val: 'from-amber-600 via-orange-600 to-red-600' },
                    { id: 'b4', val: 'from-purple-700 via-pink-700 to-indigo-900' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setNewGroupData({ ...newGroupData, bannerGradient: b.val })}
                      className={`h-8 rounded-xl bg-gradient-to-r ${b.val} border-2 transition ${
                        newGroupData.bannerGradient === b.val ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingGroup(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md transition cursor-pointer"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
