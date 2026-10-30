import confetti from 'canvas-confetti';

export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return `Hôm qua lúc ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Exact date & time representation for comments
export function formatCommentTimestamp(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const relative = formatRelativeTime(dateString);

  return `${timeStr} ngày ${dateStr} (${relative})`;
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatEventCountdown(startTimeString) {
  if (!startTimeString) return null;
  const start = new Date(startTimeString);
  const now = new Date();
  const diffInMs = start.getTime() - now.getTime();

  if (diffInMs < 0) {
    const elapsedMinutes = Math.abs(Math.floor(diffInMs / (1000 * 60)));
    if (elapsedMinutes < 120) {
      return { status: 'ongoing', text: 'Đang diễn ra' };
    }
    return { status: 'passed', text: 'Đã diễn ra' };
  }

  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return { status: 'upcoming', text: `Còn ${days} ngày nữa` };
  }
  if (hours > 0) {
    return { status: 'urgent', text: `Còn ${hours} giờ nữa` };
  }
  const minutes = Math.floor(diffInMs / (1000 * 60));
  return { status: 'urgent', text: `Sắp bắt đầu (${minutes} phút)` };
}

export function triggerConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#1877f2', '#10b981', '#f59e0b', '#ec4899', '#6366f1']
  });
}
