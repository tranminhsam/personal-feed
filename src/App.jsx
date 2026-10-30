import React from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import Header from './components/layout/Header';
import SidebarLeft from './components/layout/SidebarLeft';
import SidebarRight from './components/layout/SidebarRight';
import PostBox from './components/feed/PostBox';
import FilterBar from './components/feed/FilterBar';
import TimelineFeed from './components/feed/TimelineFeed';
import EditPostModal from './components/modals/EditPostModal';
import ProfileModal from './components/modals/ProfileModal';
import BackupModal from './components/modals/BackupModal';
import QuickCreateModal from './components/modals/QuickCreateModal';
import LinkManagerModal from './components/links/LinkManagerModal';
import LightboxModal from './components/common/LightboxModal';
import ITPlaybookModal from './components/troubleshoot/ITPlaybookModal';
import AuthModal from './components/modals/AuthModal';
import { Plus } from 'lucide-react';

function DashboardContent() {
  const { setIsQuickCreateOpen } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col font-sans">
      {/* Sticky Header */}
      <Header />

      {/* Main 3-Column Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row gap-5 items-start justify-center">
          
          {/* Left Sidebar (Profile & Navigation) */}
          <div className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-20">
            <SidebarLeft />
          </div>

          {/* Center Main Feed (Facebook-style Timeline) */}
          <div className="flex-1 w-full max-w-2xl space-y-4">
            {/* Post Box */}
            <PostBox />

            {/* Filter Bar */}
            <FilterBar />

            {/* Timeline Feed Cards */}
            <TimelineFeed />
          </div>

          {/* Right Sidebar (Mini Calendar & Widgets) */}
          <div className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-20">
            <SidebarRight />
          </div>

        </div>
      </main>

      {/* Mobile Floating Action Button (FAB) */}
      <div className="lg:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsQuickCreateOpen(true)}
          className="w-13 h-13 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all"
          title="Tạo bài đăng nhanh"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* All Dialogs & Modals */}
      <EditPostModal />
      <ProfileModal />
      <BackupModal />
      <QuickCreateModal />
      <LinkManagerModal />
      <LightboxModal />
      <ITPlaybookModal />
      <AuthModal />

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-400 dark:text-gray-500">
        <p>Personal Dashboard • Dòng thời gian Facebook • Sổ tay sửa lỗi IT & Lệnh CMD Cứu Hộ</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
