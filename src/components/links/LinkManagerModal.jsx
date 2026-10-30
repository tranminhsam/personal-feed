import React, { useState, useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  X, 
  Plus, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2, 
  Search, 
  Bookmark, 
  Sparkles,
  Tag,
  Globe,
  Hammer,
  BookOpen,
  Newspaper,
  Video,
  Share2
} from 'lucide-react';
import { LINK_CATEGORIES, autoCategorizeUrl, getFaviconUrl } from '../../utils/linkClassifier';

export default function LinkManagerModal() {
  const { isLinkModalOpen, setIsLinkModalOpen, links, addLink, deleteLink } = useDashboard();

  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Form states
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('auto');
  const [tagsInput, setTagsInput] = useState('');
  const [description, setDescription] = useState('');

  if (!isLinkModalOpen) return null;

  const categoryIcons = {
    dev_tools: Hammer,
    docs: BookOpen,
    news: Newspaper,
    media: Video,
    social: Share2,
    general: Globe,
  };

  const handleUrlChange = (val) => {
    setUrl(val);
    if (!title && val.startsWith('http')) {
      try {
        const domain = new URL(val).hostname.replace('www.', '');
        setTitle(domain.charAt(0).toUpperCase() + domain.slice(1));
      } catch (e) {}
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    const tags = tagsInput
      .split(/[,#\s]+/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    addLink({
      url: url.trim(),
      title: title.trim() || url.trim(),
      description: description.trim(),
      category: category === 'auto' ? autoCategorizeUrl(url) : category,
      tags,
    });

    // Reset form
    setUrl('');
    setTitle('');
    setDescription('');
    setTagsInput('');
    setCategory('auto');
    setShowAddForm(false);
  };

  const handleCopy = (id, linkUrl) => {
    navigator.clipboard.writeText(linkUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLinks = links.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchUrl = item.url?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchTag = item.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchUrl && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                Kho Liên Kết & Bookmarks
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold">
                  Tự động phân loại
                </span>
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Lưu trữ và phân nhóm thông minh các công cụ, tài liệu, tin tức & video
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLinkModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search & Add button */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-800/30 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm liên kết theo tiêu đề, tên miền, #tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Đóng' : 'Thêm liên kết'}</span>
          </button>
        </div>

        {/* Add Link Form (Collapsible) */}
        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/40 space-y-3 animate-in fade-in duration-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                  Địa chỉ URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                  Tiêu đề hiển thị
                </label>
                <input
                  type="text"
                  placeholder="Tên trang web hoặc ứng dụng..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                  Nhóm phân loại
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                >
                  <option value="auto">✨ Tự động nhận diện theo URL</option>
                  <option value="dev_tools">🛠️ Công cụ & Dev</option>
                  <option value="docs">📚 Tài liệu & Học tập</option>
                  <option value="news">📰 Tin tức & Blog</option>
                  <option value="media">🎬 Video & Giải trí</option>
                  <option value="social">💬 Mạng xã hội & Chat</option>
                  <option value="general">🌐 Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                  Thẻ nhãn (Tags)
                </label>
                <input
                  type="text"
                  placeholder="#tool, #doc, #react..."
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                Ghi chú thêm (Tùy chọn)
              </label>
              <input
                type="text"
                placeholder="Ghi chú ngắn về liên kết này..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
              >
                Lưu liên kết
              </button>
            </div>
          </form>
        )}

        {/* Category Tabs */}
        <div className="px-4 pt-3 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-1.5 overflow-x-auto min-w-max">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Tất cả ({links.length})
          </button>

          {Object.entries(LINK_CATEGORIES).map(([key, cat]) => {
            const count = links.filter((l) => l.category === cat.id).length;
            const isSelected = activeCategory === cat.id;
            const Icon = categoryIcons[cat.id] || Globe;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 rounded-full ${
                  isSelected ? 'bg-blue-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Links List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filteredLinks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Chưa có liên kết nào trong nhóm này
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Hãy bấm "Thêm liên kết" để bắt đầu lưu trữ tài liệu & công cụ của bạn!
              </p>
            </div>
          ) : (
            filteredLinks.map((item) => {
              const catConfig = Object.values(LINK_CATEGORIES).find((c) => c.id === item.category) || LINK_CATEGORIES.GENERAL;
              const Icon = categoryIcons[item.category] || Globe;
              const favicon = getFaviconUrl(item.url);
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 bg-white dark:bg-gray-800/40 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Favicon / Icon */}
                    <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 p-1.5 shrink-0 flex items-center justify-center ring-1 ring-gray-200/60 dark:ring-gray-700">
                      {favicon ? (
                        <img
                          src={favicon}
                          alt="icon"
                          className="w-5 h-5 rounded object-contain"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <Icon className="w-4 h-4 text-blue-500" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 group-hover:underline truncate"
                        >
                          <span>{item.title}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                        </a>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catConfig.color}`}>
                          {catConfig.label}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5 font-mono">
                        {item.url}
                      </p>

                      {item.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                          {item.tags.map((t) => (
                            <span key={t} className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(item.id, item.url)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Sao chép link"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Xóa liên kết "${item.title}"?`)) {
                          deleteLink(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Xóa liên kết"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Tổng số: {links.length} liên kết đã lưu</span>
          <button
            onClick={() => setIsLinkModalOpen(false)}
            className="px-4 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 rounded-xl"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
