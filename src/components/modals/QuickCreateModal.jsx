import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import PostBox from '../feed/PostBox';
import { X } from 'lucide-react';

export default function QuickCreateModal() {
  const { isQuickCreateOpen, setIsQuickCreateOpen } = useDashboard();

  if (!isQuickCreateOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        
        <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            Tạo bài đăng dòng thời gian
          </h3>
          <button
            onClick={() => setIsQuickCreateOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[80vh]">
          <PostBox onCreated={() => setIsQuickCreateOpen(false)} />
        </div>

      </div>
    </div>
  );
}
