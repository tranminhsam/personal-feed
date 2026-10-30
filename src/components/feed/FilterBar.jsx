import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  LayoutGrid, 
  CheckSquare, 
  FileText, 
  Calendar, 
  Pin,
  ArrowUpDown,
  Wrench
} from 'lucide-react';

export default function FilterBar() {
  const { 
    activeFilter, 
    setActiveFilter, 
    sortOrder, 
    setSortOrder,
    filteredPosts,
    stats,
    selectedTag,
    setSelectedTag
  } = useDashboard();

  const filterTabs = [
    { id: 'all', label: 'Tất cả', icon: LayoutGrid, count: stats.totalPosts },
    { id: 'troubleshoot', label: 'Sửa lỗi IT', icon: Wrench, count: stats.totalTroubleshoot || 0 },
    { id: 'task', label: 'Công việc', icon: CheckSquare, count: stats.totalTasks },
    { id: 'note', label: 'Ghi chú', icon: FileText, count: stats.totalNotes },
    { id: 'event', label: 'Sự kiện', icon: Calendar, count: stats.totalEvents },
    { id: 'pinned', label: 'Đã ghim', icon: Pin, count: null },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-2 flex items-center justify-between gap-2 overflow-x-auto transition-colors">
      
      {/* Tabs */}
      <div className="flex items-center gap-1 min-w-max">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id);
                setSelectedTag(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-blue-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sort order toggle & result count */}
      <div className="flex items-center gap-2 shrink-0 pr-1">
        <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500">
          {filteredPosts.length} mục
        </span>

        <button
          onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title={`Thứ tự: ${sortOrder === 'newest' ? 'Mới nhất trước' : 'Cũ nhất trước'}`}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span className="hidden md:inline">
            {sortOrder === 'newest' ? 'Mới nhất' : 'Cũ nhất'}
          </span>
        </button>
      </div>

    </div>
  );
}
