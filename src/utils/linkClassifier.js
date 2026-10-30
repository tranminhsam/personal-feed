// Rule-based automatic link categorization
export const LINK_CATEGORIES = {
  DEV_TOOLS: { id: 'dev_tools', label: 'Công cụ & Dev', icon: 'Hammer', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800' },
  DOCS: { id: 'docs', label: 'Tài liệu & Học tập', icon: 'BookOpen', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' },
  NEWS: { id: 'news', label: 'Tin tức & Blog', icon: 'Newspaper', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' },
  MEDIA: { id: 'media', label: 'Video & Giải trí', icon: 'Video', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800' },
  SOCIAL: { id: 'social', label: 'Mạng xã hội & Chat', icon: 'Share2', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800' },
  GENERAL: { id: 'general', label: 'Chung & Khác', icon: 'Globe', color: 'text-gray-500 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' },
};

export function autoCategorizeUrl(url) {
  if (!url) return 'general';
  const cleanUrl = url.toLowerCase();

  // Dev tools
  if (
    cleanUrl.includes('github.com') ||
    cleanUrl.includes('gitlab.com') ||
    cleanUrl.includes('npmjs.com') ||
    cleanUrl.includes('stackoverflow.com') ||
    cleanUrl.includes('docker.com') ||
    cleanUrl.includes('postman.com') ||
    cleanUrl.includes('figma.com') ||
    cleanUrl.includes('vercel.com') ||
    cleanUrl.includes('netlify.com') ||
    cleanUrl.includes('codepen.io')
  ) {
    return 'dev_tools';
  }

  // Documentation & learning
  if (
    cleanUrl.includes('developer.mozilla.org') ||
    cleanUrl.includes('w3schools.com') ||
    cleanUrl.includes('react.dev') ||
    cleanUrl.includes('nextjs.org') ||
    cleanUrl.includes('tailwindcss.com') ||
    cleanUrl.includes('dev.to') ||
    cleanUrl.includes('medium.com') ||
    cleanUrl.includes('coursera.org') ||
    cleanUrl.includes('udemy.com') ||
    cleanUrl.includes('docs.') ||
    cleanUrl.includes('wiki')
  ) {
    return 'docs';
  }

  // Media & Video
  if (
    cleanUrl.includes('youtube.com') ||
    cleanUrl.includes('youtu.be') ||
    cleanUrl.includes('tiktok.com') ||
    cleanUrl.includes('spotify.com') ||
    cleanUrl.includes('netflix.com') ||
    cleanUrl.includes('vimeo.com')
  ) {
    return 'media';
  }

  // Social
  if (
    cleanUrl.includes('facebook.com') ||
    cleanUrl.includes('fb.com') ||
    cleanUrl.includes('twitter.com') ||
    cleanUrl.includes('x.com') ||
    cleanUrl.includes('reddit.com') ||
    cleanUrl.includes('linkedin.com') ||
    cleanUrl.includes('t.me') ||
    cleanUrl.includes('discord.com')
  ) {
    return 'social';
  }

  // News
  if (
    cleanUrl.includes('vnexpress.net') ||
    cleanUrl.includes('dantri.com.vn') ||
    cleanUrl.includes('genk.vn') ||
    cleanUrl.includes('tinhte.vn') ||
    cleanUrl.includes('techcrunch.com') ||
    cleanUrl.includes('theverge.com') ||
    cleanUrl.includes('news')
  ) {
    return 'news';
  }

  return 'general';
}

export function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch (e) {
    return null;
  }
}
