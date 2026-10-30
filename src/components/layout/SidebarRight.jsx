import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Flame,
  CheckSquare2
} from 'lucide-react';
import { triggerConfetti } from '../../utils/formatters';

export default function SidebarRight() {
  const { 
    posts, 
    stats, 
    toggleTaskStatus, 
    selectedDate, 
    setSelectedDate 
  } = useDashboard();

  // Mini Calendar current display month
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Filter tasks that need attention (todo or doing)
  const activeTasks = posts.filter((p) => p.type === 'task' && p.status !== 'done');
  const completedTodayTasks = posts.filter((p) => p.type === 'task' && p.status === 'done');

  // Calendar dates generation
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Shift to start week on Monday (standard for VN)
  const startOffset = (firstDayOfMonth + 6) % 7; 

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // Find which dates have events or tasks in this month
  const datesWithItems = new Set();
  posts.forEach((p) => {
    const dateStr = p.dueDate || p.startTime || p.createdAt;
    if (dateStr) {
      const d = new Date(dateStr);
      if (d.getFullYear() === year && d.getMonth() === month) {
        datesWithItems.add(d.getDate());
      }
    }
  });

  const today = new Date();
  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const handleDateClick = (day) => {
    const clicked = new Date(year, month, day);
    if (isSelected(day)) {
      setSelectedDate(null); // toggle off
    } else {
      setSelectedDate(clicked);
    }
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
      
      {/* Mini Calendar Widget */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {monthNames[month]} {year}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Day Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-semibold text-gray-400 dark:text-gray-500">
          <span>T2</span>
          <span>T3</span>
          <span>T4</span>
          <span>T5</span>
          <span>T6</span>
          <span>T7</span>
          <span className="text-rose-500">CN</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Empty leading cells */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const hasItems = datesWithItems.has(day);
            const currentDaySelected = isSelected(day);
            const todayDay = isToday(day);

            return (
              <button
                key={`day-${day}`}
                onClick={() => handleDateClick(day)}
                className={`h-8 w-8 mx-auto rounded-full text-xs font-medium flex flex-col items-center justify-center relative transition-all ${
                  currentDaySelected
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                    : todayDay
                    ? 'border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{day}</span>
                {hasItems && (
                  <span className={`w-1 h-1 rounded-full -mt-0.5 ${
                    currentDaySelected ? 'bg-white' : 'bg-blue-500'
                  }`} />
                )}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">
              Đang lọc: {selectedDate.toLocaleDateString('vi-VN')}
            </span>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Hủy
            </button>
          </div>
        )}
      </div>

      {/* Quick To-Do List Widget */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckSquare2 className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Cần xử lý ({activeTasks.length})
            </h3>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            Nhanh
          </span>
        </div>

        {activeTasks.length === 0 ? (
          <div className="text-center py-6 px-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5 opacity-80" />
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Tuyệt vời! Không còn việc tồn đọng.
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              Tất cả các công việc đã được hoàn thành.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeTasks.slice(0, 5).map((task) => {
              const isDoing = task.status === 'doing';
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group"
                >
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-0.5 shrink-0 text-gray-400 hover:text-emerald-600 transition-colors"
                    title={isDoing ? "Đang làm -> Bấm để hoàn thành" : "Chờ xử lý -> Bấm để bắt đầu làm"}
                  >
                    {isDoing ? (
                      <Clock className="w-4 h-4 text-amber-500 animate-spin-slow" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-800 dark:text-gray-200 font-medium line-clamp-2 leading-snug">
                      {task.content}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        task.priority === 'high'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          : task.priority === 'medium'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      }`}>
                        {task.priority === 'high' ? 'Ưu tiên cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                      </span>
                      {task.status === 'doing' && (
                        <span className="text-[10px] text-amber-500 font-medium">
                          • Đang làm
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Productivity Stats Widget */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Hiệu suất công việc
            </h3>
          </div>
          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-gray-600 dark:text-gray-400">Tỷ lệ hoàn thành</span>
            <span className="text-blue-600 dark:text-blue-400">{stats.completionRate}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-1">
            <span>Đã xong: <strong className="text-emerald-600 dark:text-emerald-400">{stats.completedTasks}</strong></span>
            <span>Đang làm: <strong className="text-amber-600 dark:text-amber-400">{stats.inProgressTasks}</strong></span>
            <span>Tổng: <strong>{stats.totalTasks}</strong></span>
          </div>
        </div>
      </div>

    </aside>
  );
}
