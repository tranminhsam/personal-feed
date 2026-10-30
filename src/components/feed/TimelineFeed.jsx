import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import FeedCard from './FeedCard';
import { 
  Inbox, 
  Sparkles, 
  FilterX, 
  PlusCircle 
} from 'lucide-react';

export default function TimelineFeed() {
  const { 
    filteredPosts, 
    activeFilter, 
    selectedTag, 
    selectedDate, 
    searchQuery,
    setActiveFilter,
    setSelectedTag,
    setSelectedDate,
    setSearchQuery,
    setIsQuickCreateOpen
  } = useDashboard();

  const hasFilter = activeFilter !== 'all' || selectedTag || selectedDate || searchQuery;

  if (filteredPosts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center transition-colors">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
          {hasFilter ? <FilterX className="w-7 h-7 text-amber-500" /> : <Inbox className="w-7 h-7" />}
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
          {hasFilter ? 'Không tìm thấy bài viết phù hợp' : 'Dòng thời gian đang trống'}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
          {hasFilter
            ? 'Hãy thử thay đổi từ khóa tìm kiếm, nhãn hoặc xóa các bộ lọc hiện tại để xem lại toàn bộ bài viết.'
            : 'Hãy đăng một công việc, ghi chú hoặc sự kiện đầu tiên để bắt đầu dòng thời gian cá nhân của bạn!'}
        </p>

        {hasFilter ? (
          <button
            onClick={() => {
              setActiveFilter('all');
              setSelectedTag(null);
              setSelectedDate(null);
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl transition-all"
          >
            Xóa toàn bộ bộ lọc
          </button>
        ) : (
          <button
            onClick={() => setIsQuickCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tạo bài đăng đầu tiên</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      {/* Visual Timeline Spine Line (left margin line) */}
      <div className="hidden sm:block absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500/30 via-indigo-500/20 to-transparent pointer-events-none -z-0" />

      {filteredPosts.map((post, index) => (
        <div key={post.id} className="relative z-10 transition-all duration-300">
          <FeedCard post={post} />
        </div>
      ))}

      {/* End of timeline indicator */}
      <div className="text-center py-6 text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
        <span>Bạn đã xem hết toàn bộ dòng thời gian</span>
      </div>
    </div>
  );
}
