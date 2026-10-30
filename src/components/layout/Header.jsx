import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Search, 
  Sun, 
  Moon, 
  HardDriveDownload, 
  Sparkles, 
  PlusCircle,
  X,
  Bookmark,
  Terminal,
  Database,
  LogIn,
  UserCheck
} from 'lucide-react';

export default function Header() {
  const { 
    user, 
    darkMode, 
    toggleDarkMode, 
    isBackendConnected,
    searchQuery, 
    setSearchQuery, 
    activeFilter, 
    setActiveFilter,
    selectedTag,
    setSelectedTag,
    selectedDate,
    setSelectedDate,
    setIsProfileModalOpen,
    setIsBackupModalOpen,
    setIsQuickCreateOpen,
    setIsLinkModalOpen,
    setIsITPlaybookOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    isLoggedIn,
    links,
    stats
  } = useDashboard();

  const clearAllFilters = () => {
    setActiveFilter('all');
    setSelectedTag(null);
    setSelectedDate(null);
    setSearchQuery('');
  };

  const hasActiveFilters = activeFilter !== 'all' || selectedTag || selectedDate || searchQuery;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            onClick={clearAllFilters}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
                Personal <span className="text-blue-600 dark:text-blue-400 font-extrabold">Feed</span>
              </span>
              <span className="hidden sm:block text-[11px] text-gray-500 dark:text-gray-400 font-medium -mt-1">
                Dòng thời gian • Full-stack SQLite
              </span>
            </div>
          </div>

          {/* Backend Status Badge */}
          <div className="hidden sm:block ml-1">
            {isBackendConnected ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" title="Đang kết nối Backend Express & SQLite">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>SQLite DB</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800" title="Đang chạy chế độ LocalStorage dự phòng">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>LocalStorage</span>
              </span>
            )}
          </div>
        </div>

        {/* Center: Search Bar with Active Filter Badges */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm công việc, sự cố IT, mã lỗi, lệnh CMD, link..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/80 focus:bg-white dark:focus:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 rounded-full border border-transparent focus:border-cyan-500 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Quick Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Quick Create Button */}
          <button
            onClick={() => setIsQuickCreateOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-full shadow-sm hover:shadow transition-all"
            title="Tạo bài đăng mới"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tạo mới</span>
          </button>

          {/* Sổ tay IT & Lệnh CMD Modal Trigger */}
          <button
            onClick={() => setIsITPlaybookOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative"
            title={`Sổ tay xử lý sự cố IT & lệnh CMD (${stats.totalTroubleshoot || 0} bài)`}
          >
            <Terminal className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </button>

          {/* Bookmarks / Link Vault Modal Trigger */}
          <button
            onClick={() => setIsLinkModalOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative"
            title={`Kho liên kết (${links.length} liên kết)`}
          >
            <Bookmark className="w-5 h-5" />
            {links.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500"></span>
            )}
          </button>

          {/* Backup / Export / Import Modal Trigger */}
          <button
            onClick={() => setIsBackupModalOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative"
            title="Sao lưu & Đồng bộ dữ liệu"
          >
            <HardDriveDownload className="w-5 h-5" />
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title={darkMode ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>

          {/* User Profile Avatar / Login Button */}
          {isLoggedIn ? (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700/60"
              title="Hồ sơ tài khoản • Nhấn để tùy chỉnh hoặc đổi mật khẩu"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/50"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
              </div>
              <span className="hidden lg:block text-xs font-semibold text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                {currentUser?.name || user.name}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all active:scale-95"
              title="Đăng nhập tài khoản quản trị"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter strip indicator if filter active */}
      {hasActiveFilters && (
        <div className="bg-blue-50 dark:bg-blue-950/40 border-t border-blue-100 dark:border-blue-900/50 px-4 py-1.5 text-xs text-blue-700 dark:text-blue-300 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">Đang lọc theo:</span>
            {activeFilter !== 'all' && (
              <span className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full font-semibold border border-blue-200 dark:border-blue-800">
                {activeFilter === 'troubleshoot' ? '🛠️ Sửa lỗi IT' : activeFilter === 'task' ? 'Công việc' : activeFilter === 'note' ? 'Ghi chú' : activeFilter === 'event' ? 'Sự kiện' : 'Đã ghim'}
              </span>
            )}
            {selectedTag && (
              <span className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full font-semibold border border-blue-200 dark:border-blue-800">
                #{selectedTag}
              </span>
            )}
            {selectedDate && (
              <span className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full font-semibold border border-blue-200 dark:border-blue-800">
                Ngày: {selectedDate.toLocaleDateString('vi-VN')}
              </span>
            )}
            {searchQuery && (
              <span className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full font-semibold border border-blue-200 dark:border-blue-800">
                Từ khóa: "{searchQuery}"
              </span>
            )}
          </div>
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0 ml-2"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </header>
  );
}
