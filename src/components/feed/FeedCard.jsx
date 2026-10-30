import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  CheckSquare, 
  FileText, 
  Calendar, 
  Smile, 
  Pin, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Share2, 
  Send, 
  Check, 
  Sparkles,
  ExternalLink,
  ImageIcon,
  Wrench,
  Terminal,
  Copy,
  AlertTriangle,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { 
  formatRelativeTime, 
  formatDateTime, 
  formatEventCountdown,
  formatCommentTimestamp 
} from '../../utils/formatters';
import { IT_CATEGORIES } from '../../constants/initialData';

export default function FeedCard({ post }) {
  const { 
    user, 
    toggleTaskStatus, 
    togglePin, 
    deletePost, 
    setEditingPost, 
    setSelectedTag,
    toggleLike,
    addComment,
    deleteComment,
    openLightbox
  } = useDashboard();

  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(null);

  // Type metadata
  const typeBadgeMap = {
    troubleshoot: { label: 'Sửa lỗi IT', icon: Wrench, badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800' },
    task: { label: 'Công việc', icon: CheckSquare, badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
    note: { label: 'Ghi chú', icon: FileText, badgeBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
    event: { label: 'Sự kiện', icon: Calendar, badgeBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
    status: { label: 'Trạng thái', icon: Smile, badgeBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  };

  const currentBadge = typeBadgeMap[post.type] || typeBadgeMap.status;
  const TypeIcon = currentBadge.icon;

  const eventCountdown = post.type === 'event' && post.startTime 
    ? formatEventCountdown(post.startTime) 
    : null;

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
    setShowComments(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyCommand = (cmdText) => {
    navigator.clipboard.writeText(cmdText);
    setCopiedCmd(cmdText);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const comments = Array.isArray(post.comments) ? post.comments : [];
  const images = Array.isArray(post.images) ? post.images : [];

  // IT category config
  const itCat = IT_CATEGORIES[post.itCategory] || IT_CATEGORIES.os_system;

  return (
    <article className={`relative bg-white dark:bg-gray-900 rounded-2xl border transition-all shadow-sm hover:shadow-md ${
      post.pinned 
        ? 'border-blue-300 dark:border-blue-700/70 ring-1 ring-blue-500/10' 
        : post.type === 'troubleshoot'
        ? 'border-cyan-200 dark:border-cyan-900/60'
        : 'border-gray-200 dark:border-gray-800'
    }`}>
      
      {/* Pinned Ribbon Indicator */}
      {post.pinned && (
        <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 px-4 pt-3 pb-1 border-b border-blue-50 dark:border-blue-950/40">
          <Pin className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
          <span>Bài viết đã ghim trên đầu dòng thời gian</span>
        </div>
      )}

      {/* Card Header */}
      <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800 shrink-0"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
            }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-gray-900 dark:text-white truncate">
                {user.name}
              </span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${currentBadge.badgeBg}`}>
                <TypeIcon className="w-3 h-3" />
                <span>{currentBadge.label}</span>
              </span>

              {post.type === 'troubleshoot' && post.itCategory && (
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${itCat.color}`}>
                  <span>{itCat.label}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              <span>{formatRelativeTime(post.createdAt)}</span>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <span>• đã sửa</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Menu (Pin, Edit, Delete) */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div 
              className="absolute right-0 top-8 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-30 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => {
                  togglePin(post.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/80 flex items-center gap-2"
              >
                <Pin className="w-3.5 h-3.5" />
                <span>{post.pinned ? 'Bỏ ghim bài' : 'Ghim bài viết'}</span>
              </button>

              <button
                onClick={() => {
                  setEditingPost(post);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/80 flex items-center gap-2"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa nội dung</span>
              </button>

              <div className="border-t border-gray-100 dark:border-gray-700/80 my-1" />

              <button
                onClick={() => {
                  if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
                    deletePost(post.id);
                  }
                  setShowMenu(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa bài viết</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Content Section */}
      <div className="px-4 sm:px-5 pb-3">
        
        {/* Note Title if present */}
        {post.type === 'note' && post.title && (
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">
            {post.title}
          </h3>
        )}

        {/* ========================================================= */}
        {/* IT TROUBLESHOOT / FIX CARD SPECIALIZED PRESENTATION */}
        {/* ========================================================= */}
        {post.type === 'troubleshoot' && (
          <div className="mb-3 space-y-3">
            {/* Error Title & Code Banner */}
            <div className="p-3.5 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/60">
              <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-snug">
                  {post.errorTitle || post.content}
                </h3>

                {post.severity && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    post.severity === 'high'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      : post.severity === 'medium'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  }`}>
                    {post.severity === 'high' ? '⚠️ Nghiêm trọng' : post.severity === 'medium' ? '⚡ Mức vừa' : 'ℹ️ Thấp'}
                  </span>
                )}
              </div>

              {post.errorCode && (
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Mã lỗi:</span>
                  <code className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                    {post.errorCode}
                  </code>
                </div>
              )}
            </div>

            {/* Root Cause (Nguyên nhân) */}
            {post.cause && (
              <div className="text-xs bg-amber-50/60 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-gray-800 dark:text-gray-200">
                <div className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1 mb-0.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Nguyên nhân sự cố:</span>
                </div>
                <p className="leading-relaxed">{post.cause}</p>
              </div>
            )}

            {/* Solution Steps (Cách khắc phục) */}
            {post.solution && (
              <div className="text-xs bg-gray-50 dark:bg-gray-800/50 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700/70 text-gray-800 dark:text-gray-200">
                <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Hướng dẫn cách sửa từng bước:</span>
                </div>
                <div className="whitespace-pre-line leading-relaxed font-sans pl-1">
                  {post.solution}
                </div>
              </div>
            )}

            {/* Terminal Commands Block (CMD / PowerShell Snippets) */}
            {Array.isArray(post.commands) && post.commands.length > 0 && (
              <div className="rounded-xl overflow-hidden border border-gray-800 bg-gray-950 shadow-md">
                {/* Terminal Title Bar */}
                <div className="px-3 py-2 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span className="ml-2 text-[11px] font-mono font-semibold text-gray-400 flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      <span>Command Prompt (Administrator)</span>
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">CMD / PowerShell</span>
                </div>

                {/* Commands list */}
                <div className="p-3 space-y-2 font-mono">
                  {post.commands.map((cmdObj, cIdx) => {
                    const isCmdCopied = copiedCmd === cmdObj.cmd;
                    return (
                      <div
                        key={cIdx}
                        className="bg-black/60 p-2.5 rounded-lg border border-gray-800/80 flex items-start justify-between gap-3 group hover:border-cyan-500/50 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                            <span className="text-gray-500 select-none">C:\&gt;</span>
                            <span className="break-all">{cmdObj.cmd}</span>
                          </div>
                          {cmdObj.desc && (
                            <div className="text-[10px] text-gray-400 font-sans mt-0.5">
                              # {cmdObj.desc}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCommand(cmdObj.cmd)}
                          className="p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors shrink-0 flex items-center gap-1 text-[10px] font-sans font-semibold"
                          title="Sao chép câu lệnh này"
                        >
                          {isCmdCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Task Specific Interaction Banner */}
        {post.type === 'task' && (
          <div className="mb-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={() => toggleTaskStatus(post.id)}
              className="flex items-center gap-2 text-left group select-none"
            >
              {post.status === 'done' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950/60 group-hover:scale-110 transition-transform" />
              ) : post.status === 'doing' ? (
                <Clock className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:scale-110 transition-transform" />
              )}
              <span className={`text-xs font-bold ${
                post.status === 'done'
                  ? 'text-emerald-600 dark:text-emerald-400 line-through opacity-80'
                  : post.status === 'doing'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {post.status === 'done' ? 'Đã hoàn thành' : post.status === 'doing' ? 'Đang thực hiện' : 'Chờ thực hiện'}
              </span>
            </button>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                post.priority === 'high'
                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300'
                  : post.priority === 'medium'
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300'
                  : 'bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300'
              }`}>
                {post.priority === 'high' ? 'Ưu tiên cao' : post.priority === 'medium' ? 'Ưu tiên vừa' : 'Ưu tiên thấp'}
              </span>

              {post.dueDate && (
                <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Hạn: {formatDateTime(post.dueDate)}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Event Specific Banner */}
        {post.type === 'event' && (
          <div className="mb-3 p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>
                  {post.startTime ? formatDateTime(post.startTime) : 'Chưa đặt giờ'} 
                  {post.endTime ? ` - ${formatDateTime(post.endTime)}` : ''}
                </span>
              </div>

              {eventCountdown && (
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  eventCountdown.status === 'ongoing'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 animate-pulse'
                    : eventCountdown.status === 'urgent'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                    : 'bg-purple-200/70 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200'
                }`}>
                  {eventCountdown.text}
                </span>
              )}
            </div>

            {post.location && (
              <div className="flex items-center gap-1.5 text-xs text-purple-800 dark:text-purple-300 font-medium pt-1 border-t border-purple-100 dark:border-purple-900/40">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-purple-500" />
                <span className="truncate">{post.location}</span>
              </div>
            )}
          </div>
        )}

        {/* Main Content Body (If not already shown as errorTitle in troubleshoot) */}
        {post.content && post.type !== 'troubleshoot' && (
          <div className={`text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line ${
            post.type === 'note' ? 'bg-amber-50/30 dark:bg-amber-950/10 p-3.5 rounded-xl border border-amber-100/50 dark:border-amber-900/20 font-sans' : ''
          }`}>
            {post.content}
          </div>
        )}

        {/* Attached Images Gallery Grid */}
        {images.length > 0 && (
          <div className={`mt-3 rounded-xl overflow-hidden gap-1.5 ${
            images.length === 1 
              ? 'block' 
              : images.length === 2 
              ? 'grid grid-cols-2' 
              : images.length === 3
              ? 'grid grid-cols-3'
              : 'grid grid-cols-2'
          }`}>
            {images.slice(0, 4).map((img, idx) => {
              const isLastOfFour = idx === 3 && images.length > 4;
              const remainingCount = images.length - 4;

              return (
                <div
                  key={idx}
                  onClick={() => openLightbox(images, idx)}
                  className={`relative overflow-hidden cursor-pointer group bg-gray-100 dark:bg-gray-800 ${
                    images.length === 1 ? 'max-h-96' : 'aspect-square'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Post attachment ${idx}`}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200"
                  />

                  {/* Overlay for remaining images if > 4 */}
                  {isLastOfFour ? (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white font-bold">
                      <span className="text-xl sm:text-2xl">+{remainingCount}</span>
                      <span className="text-[11px] text-white/80">Xem tất cả</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold px-2.5 py-1 bg-black/60 rounded-xl transition-opacity flex items-center gap-1.5 shadow-md">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Xem {images.length > 1 ? `(${idx + 1}/${images.length})` : 'lớn'}</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tags footer */}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-1">
            {post.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Stats Counter Bar (Likes count & Comments count) */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800/80">
        <div className="flex items-center gap-1.5">
          {(post.likes || 0) > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px]">
                ❤️
              </span>
              <span>{post.likes}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline flex items-center gap-1"
          >
            <span>{comments.length} bình luận</span>
          </button>
        </div>
      </div>

      {/* Action Buttons (Thích, Bình luận, Chia sẻ) */}
      <div className="px-2 py-1 border-t border-gray-100 dark:border-gray-800 flex items-center justify-around">
        <button
          onClick={() => toggleLike(post.id)}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
            post.likedByMe
              ? 'text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{post.likedByMe ? 'Đã thích' : 'Thích'}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
            showComments
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Bình luận</span>
        </button>

        <button
          onClick={handleShare}
          className="flex-1 py-1.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5 transition-colors"
          title="Sao chép liên kết"
        >
          {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          <span>{isCopied ? 'Đã chép link' : 'Chia sẻ'}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 pt-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/30 rounded-b-2xl space-y-3">
          {comments.length > 0 && (
            <div className="space-y-3">
              {comments.map((comm) => (
                <div key={comm.id} className="flex items-start gap-2.5 group">
                  <img
                    src={comm.avatar || user.avatar}
                    alt={comm.author}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="bg-white dark:bg-gray-800 p-2.5 rounded-2xl rounded-tl-xs border border-gray-200/70 dark:border-gray-700/60 shadow-xs inline-block max-w-full">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {comm.author}
                        </span>
                        <button
                          onClick={() => deleteComment(post.id, comm.id)}
                          className="text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                          title="Xóa bình luận này"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed break-words">
                        {comm.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500 ml-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{formatCommentTimestamp(comm.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New Comment Input Box */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover shrink-0"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
              }}
            />
            <div className="flex-1 flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 focus-within:border-blue-500 shadow-xs">
              <input
                type="text"
                placeholder="Viết bình luận của bạn (Enter để gửi)..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full text-xs bg-transparent focus:outline-none text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 disabled:opacity-30 disabled:hover:text-blue-600"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

        </div>
      )}

    </article>
  );
}
