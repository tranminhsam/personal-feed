import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  LayoutGrid, 
  CheckSquare, 
  FileText, 
  Calendar, 
  Pin, 
  Tag, 
  Bookmark,
  RotateCcw,
  MapPin,
  Briefcase,
  Wrench,
  Terminal,
  ShieldCheck,
  LogIn
} from 'lucide-react';

export default function SidebarLeft() {
  const { 
    user, 
    activeFilter, 
    setActiveFilter, 
    selectedTag, 
    setSelectedTag, 
    allTags, 
    stats,
    resetData,
    setIsProfileModalOpen,
    setIsLinkModalOpen,
    setIsITPlaybookOpen,
    setIsAuthModalOpen,
    currentUser,
    isLoggedIn,
    links
  } = useDashboard();

  const navItems = [
    { id: 'all', label: 'Tất cả dòng thời gian', icon: LayoutGrid, count: stats.totalPosts, color: 'text-blue-500' },
    { id: 'troubleshoot', label: 'Sửa lỗi IT & CMD', icon: Wrench, count: stats.totalTroubleshoot || 0, color: 'text-cyan-500' },
    { id: 'task', label: 'Công việc (Tasks)', icon: CheckSquare, count: stats.totalTasks, badge: stats.pendingTasks + stats.inProgressTasks, color: 'text-emerald-500' },
    { id: 'note', label: 'Ghi chú & Kiến thức', icon: FileText, count: stats.totalNotes, color: 'text-amber-500' },
    { id: 'event', label: 'Sự kiện & Lịch', icon: Calendar, count: stats.totalEvents, color: 'text-purple-500' },
    { id: 'pinned', label: 'Bài viết đã ghim', icon: Pin, count: null, color: 'text-rose-500' },
  ];

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
        {/* Cover image banner */}
        <div className="h-24 w-full relative bg-gradient-to-r from-blue-600 to-indigo-700">
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Profile info */}
        <div className="px-5 pb-5 pt-0 relative">
          <div className="flex justify-between items-end -mt-10 mb-3">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-900 shadow-md"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
                }}
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 ring-2 ring-white dark:ring-gray-900 rounded-full" title="Online"></span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Hồ sơ
              </button>
              {isLoggedIn ? (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="p-1 px-1.5 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800/60"
                  title={`Đang đăng nhập: @${currentUser?.username || 'admin'}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="font-bold text-[10px]">@{currentUser?.username || 'admin'}</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </div>

          <h2 className="text-base font-bold text-gray-900 dark:text-white truncate">
            {user.name}
          </h2>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1.5 mt-0.5">
            <Briefcase className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{user.role}</span>
          </p>

          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2.5 line-clamp-2 leading-relaxed">
            "{user.bio}"
          </p>

          {user.location && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-2">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span>{user.location}</span>
            </p>
          )}

          {/* Micro stats banner */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 text-center">
            <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="block text-sm font-bold text-gray-900 dark:text-white">{stats.totalTasks}</span>
              <span className="block text-[10px] text-gray-500 dark:text-gray-400">Tasks</span>
            </div>
            <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="block text-sm font-bold text-cyan-600 dark:text-cyan-400">{stats.totalTroubleshoot || 0}</span>
              <span className="block text-[10px] text-gray-500 dark:text-gray-400">Lỗi IT</span>
            </div>
            <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="block text-sm font-bold text-emerald-600 dark:text-emerald-400">{stats.completedTasks}</span>
              <span className="block text-[10px] text-gray-500 dark:text-gray-400">Đã xong</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Filter Menu */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-3 transition-colors">
        <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 py-1 mb-1">
          Khám phá
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeFilter === item.id && !selectedTag;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveFilter(item.id);
                  setSelectedTag(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : item.color}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== null && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isActive 
                      ? 'bg-blue-200/60 dark:bg-blue-800 text-blue-700 dark:text-blue-200' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Tools & Playbooks */}
        <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
          {/* IT Emergency Playbook Button */}
          <button
            onClick={() => setIsITPlaybookOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50/70 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Sổ tay lệnh CMD & Sửa lỗi</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-600 text-white font-bold">
              CMD
            </span>
          </button>

          {/* Dedicated Link Manager Button */}
          <button
            onClick={() => setIsLinkModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Kho liên kết & Bookmarks</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
              {links.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tags Cloud */}
      {allTags.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
              <Tag className="w-3.5 h-3.5 text-blue-500" />
              <span>Chủ đề & Thẻ nhãn</span>
            </div>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
              >
                Bỏ chọn
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {allTags.map((t) => {
              const isSelected = selectedTag?.toLowerCase() === t.name.toLowerCase();
              return (
                <button
                  key={t.name}
                  onClick={() => setSelectedTag(isSelected ? null : t.name)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-medium ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>#{t.name}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'}`}>
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Reset & Quick Helper */}
      <div className="px-3 py-2 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>Personal Dashboard v3.0</span>
        <button
          onClick={() => {
            if (window.confirm("Khôi phục toàn bộ dữ liệu mẫu (kèm sổ tay sửa lỗi IT & lệnh CMD)?")) {
              resetData();
            }
          }}
          className="flex items-center gap-1 hover:text-rose-500 transition-colors"
          title="Đặt lại dữ liệu mẫu"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Đặt lại</span>
        </button>
      </div>
    </aside>
  );
}
