import React, { useState, useRef } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  CheckSquare, 
  FileText, 
  Calendar, 
  Smile, 
  Send, 
  Tag as TagIcon, 
  MapPin, 
  Clock, 
  AlertCircle, 
  Pin,
  X,
  Image as ImageIcon,
  Link2,
  ClipboardCheck,
  Terminal,
  Plus,
  Trash2,
  Wrench
} from 'lucide-react';
import { IT_CATEGORIES } from '../../constants/initialData';

export default function PostBox({ onCreated }) {
  const { user, addPost, addLink } = useDashboard();
  const fileInputRef = useRef(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [postType, setPostType] = useState('task'); // 'task', 'note', 'event', 'status', 'troubleshoot'
  
  // Standard Form fields
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [taskStatus, setTaskStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [pinned, setPinned] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');
  const [pasteNotification, setPasteNotification] = useState('');

  // IT Troubleshoot specific fields
  const [itCategory, setItCategory] = useState('network'); // network, hardware, software, os_system
  const [errorTitle, setErrorTitle] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [cause, setCause] = useState('');
  const [solution, setSolution] = useState('');
  const [severity, setSeverity] = useState('medium'); // low, medium, high
  const [commandsList, setCommandsList] = useState([
    { cmd: '', desc: '' }
  ]);

  // Image Upload & Clipboard state
  const [images, setImages] = useState([]);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const typeConfig = [
    { id: 'troubleshoot', label: 'Sửa lỗi IT', icon: Wrench, color: 'text-cyan-500', activeBg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 text-cyan-600 dark:text-cyan-400' },
    { id: 'task', label: 'Công việc', icon: CheckSquare, color: 'text-emerald-500', activeBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-600 dark:text-emerald-400' },
    { id: 'note', label: 'Ghi chú', icon: FileText, color: 'text-amber-500', activeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-600 dark:text-amber-400' },
    { id: 'event', label: 'Sự kiện', icon: Calendar, color: 'text-purple-500', activeBg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-600 dark:text-purple-400' },
    { id: 'status', label: 'Trạng thái', icon: Smile, color: 'text-blue-500', activeBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400' },
  ];

  // Clipboard Paste Handler (Ctrl + V for images)
  const handlePaste = (e) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData || !clipboardData.items) return;

    let foundImage = false;
    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          foundImage = true;
          const reader = new FileReader();
          reader.onload = (event) => {
            setImages((prev) => [...prev, event.target.result]);
            setPasteNotification('Đã dán ảnh từ bộ nhớ tạm (Clipboard)!');
            setTimeout(() => setPasteNotification(''), 3000);
          };
          reader.readAsDataURL(file);
        }
      }
    }

    if (foundImage) {
      setIsExpanded(true);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
    setIsExpanded(true);
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, imageUrl.trim()]);
    setImageUrl('');
    setShowImageUrlInput(false);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Commands list helpers
  const addCommandRow = () => {
    setCommandsList((prev) => [...prev, { cmd: '', desc: '' }]);
  };

  const updateCommandRow = (index, field, value) => {
    setCommandsList((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const removeCommandRow = (index) => {
    setCommandsList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (postType === 'troubleshoot') {
      if (!errorTitle.trim() && !content.trim()) {
        setError('Vui lòng nhập tên lỗi hoặc mô tả sự cố');
        return;
      }
    } else {
      if (!content.trim() && images.length === 0) {
        setError('Vui lòng nhập nội dung bài đăng hoặc chọn ảnh');
        return;
      }
    }

    // Process tags
    const tags = tagsInput
      .split(/[,#\s]+/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const postPayload = {
      type: postType,
      content: content.trim(),
      tags,
      pinned,
      images,
      likes: 0,
      comments: [],
    };

    if (postType === 'troubleshoot') {
      postPayload.itCategory = itCategory;
      postPayload.errorTitle = errorTitle.trim() || content.trim();
      postPayload.errorCode = errorCode.trim();
      postPayload.cause = cause.trim();
      postPayload.solution = solution.trim();
      postPayload.severity = severity;
      postPayload.commands = commandsList.filter((c) => c.cmd.trim().length > 0);
      if (!postPayload.content) {
        postPayload.content = postPayload.errorTitle;
      }
    } else if (postType === 'task') {
      postPayload.status = taskStatus;
      postPayload.priority = priority;
      if (dueDate) postPayload.dueDate = new Date(dueDate).toISOString();
    } else if (postType === 'note') {
      postPayload.title = title.trim();
    } else if (postType === 'event') {
      if (startTime) postPayload.startTime = new Date(startTime).toISOString();
      if (endTime) postPayload.endTime = new Date(endTime).toISOString();
      if (location) postPayload.location = location.trim();
    }

    addPost(postPayload);

    // If content contains URLs, auto-bookmark them
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const detectedUrls = (content + ' ' + solution).match(urlRegex);
    if (detectedUrls && detectedUrls.length > 0) {
      detectedUrls.forEach((u) => {
        addLink({
          url: u,
          title: `Tài liệu từ: ${postType === 'troubleshoot' ? errorTitle || 'Sửa lỗi IT' : 'bài đăng'}`,
          tags,
        });
      });
    }

    // Reset form
    setContent('');
    setTitle('');
    setErrorTitle('');
    setErrorCode('');
    setCause('');
    setSolution('');
    setCommandsList([{ cmd: '', desc: '' }]);
    setDueDate('');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setTagsInput('');
    setPinned(false);
    setImages([]);
    setError('');
    setIsExpanded(false);

    if (onCreated) onCreated();
  };

  return (
    <div 
      onPaste={handlePaste}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 transition-all"
    >
      <form onSubmit={handleSubmit}>
        
        {/* Top header of post box */}
        <div className="flex items-start gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
            }}
          />

          <div className="flex-1 min-w-0">
            {/* Note title field if type is note */}
            {postType === 'note' && isExpanded && (
              <input
                type="text"
                placeholder="Tiêu đề ghi chú (tùy chọn)..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-2 px-3 py-1.5 text-sm font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-amber-500 text-gray-900 dark:text-white"
              />
            )}

            {/* Error title field if type is troubleshoot */}
            {postType === 'troubleshoot' && isExpanded && (
              <div className="space-y-2 mb-2">
                <input
                  type="text"
                  placeholder="Tên lỗi / Hiện tượng (VD: Mất kết nối Wi-Fi, Màn hình xanh BSOD...)*"
                  value={errorTitle}
                  onChange={(e) => setErrorTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500 text-gray-900 dark:text-white"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-0.5">Phân loại sự cố</label>
                    <select
                      value={itCategory}
                      onChange={(e) => setItCategory(e.target.value)}
                      className="w-full text-xs p-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-medium"
                    >
                      <option value="network">🌐 Mạng & Internet</option>
                      <option value="hardware">🖥️ Phần cứng & Thiết bị</option>
                      <option value="software">📦 Phần mềm & Ứng dụng</option>
                      <option value="os_system">💻 Windows & Hệ thống</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-0.5">Mã lỗi (Error Code)</label>
                    <input
                      type="text"
                      placeholder="VD: 0x80070005, DNS_PROBE..."
                      value={errorCode}
                      onChange={(e) => setErrorCode(e.target.value)}
                      className="w-full text-xs p-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-0.5">Mức độ nghiêm trọng</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="w-full text-xs p-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-medium"
                    >
                      <option value="low">Thấp (Cảnh báo)</option>
                      <option value="medium">Trung bình</option>
                      <option value="high">Nghiêm trọng (Critical)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <textarea
              rows={isExpanded ? 3 : 1}
              placeholder={
                postType === 'troubleshoot'
                  ? 'Ghi chú mô tả thêm về tình trạng máy, log lỗi hoặc hoàn cảnh xảy ra lỗi...'
                  : postType === 'task'
                  ? 'Nhập nội dung công việc (hoặc Ctrl+V dán ảnh)...'
                  : postType === 'note'
                  ? 'Ghi lại ý tưởng, kiến thức (hoặc Ctrl+V dán ảnh)...'
                  : postType === 'event'
                  ? 'Nhập tên sự kiện hoặc cuộc hẹn...'
                  : 'Hôm nay bạn thế nào? Chia sẻ trạng thái hoặc Ctrl+V dán ảnh nhanh...'
              }
              value={content}
              onFocus={() => setIsExpanded(true)}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100/70 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 rounded-xl p-3 border border-gray-200/80 dark:border-gray-700/60 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Paste Notification Banner */}
        {pasteNotification && (
          <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
            <ClipboardCheck className="w-4 h-4 shrink-0 text-emerald-500" />
            <span className="font-medium">{pasteNotification}</span>
          </div>
        )}

        {/* Image Previews Grid */}
        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden group aspect-video bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <img
                  src={img}
                  alt={`Upload ${idx}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                  title="Xóa ảnh này"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Image URL Input Form */}
        {showImageUrlInput && (
          <div className="mt-2.5 flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <input
              type="url"
              placeholder="Dán đường dẫn ảnh trực tuyến (https://...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 text-xs bg-transparent focus:outline-none text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
            >
              Thêm ảnh
            </button>
            <button
              type="button"
              onClick={() => setShowImageUrlInput(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-500 mt-2 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </p>
        )}

        {/* Post Type Selector Tabs & Media Upload Buttons */}
        <div className="flex items-center justify-between gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex-wrap">
          <div className="flex items-center gap-1 flex-wrap">
            {typeConfig.map((item) => {
              const Icon = item.icon;
              const isSelected = postType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setPostType(item.id);
                    setIsExpanded(true);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? item.activeBg
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Image & URL Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl transition-colors"
              title="Tải ảnh từ máy tính (hoặc Ctrl+V để dán trực tiếp)"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Tải ảnh lên</span>
            </button>

            <span 
              className="hidden lg:inline text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg select-none"
              title="Bạn có thể sao chép ảnh bất kỳ và nhấn phím Ctrl+V để dán nhanh vào đây"
            >
              Ctrl+V dán ảnh
            </span>

            <button
              type="button"
              onClick={() => {
                setShowImageUrlInput(!showImageUrlInput);
                setIsExpanded(true);
              }}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl transition-colors"
              title="Dán link ảnh từ Internet"
            >
              <Link2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Fields (When Expanded) */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80 space-y-3">
            
            {/* IT Troubleshoot Specialized Fields */}
            {postType === 'troubleshoot' && (
              <div className="space-y-3 bg-cyan-50/30 dark:bg-cyan-950/20 p-3.5 rounded-xl border border-cyan-100 dark:border-cyan-900/50">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Nguyên nhân gây ra sự cố
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Do cache DNS bị xung đột sau khi đổi router, cập nhật Windows bị lỗi..."
                    value={cause}
                    onChange={(e) => setCause(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Các bước khắc phục (Solution Steps)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="1. Mở CMD quyền Administrator...&#10;2. Chạy lệnh reset mạng...&#10;3. Khởi động lại máy kiểm tra..."
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                </div>

                {/* Commands list builder */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Các câu lệnh CMD / PowerShell sửa lỗi</span>
                    </label>
                    <button
                      type="button"
                      onClick={addCommandRow}
                      className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Thêm câu lệnh
                    </button>
                  </div>

                  <div className="space-y-2">
                    {commandsList.map((row, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Câu lệnh: VD: ipconfig /flushdns"
                            value={row.cmd}
                            onChange={(e) => updateCommandRow(idx, 'cmd', e.target.value)}
                            className="text-xs px-2.5 py-1.5 font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-emerald-600 dark:text-emerald-400 font-semibold focus:outline-none focus:border-cyan-500"
                          />
                          <input
                            type="text"
                            placeholder="Mô tả tác dụng câu lệnh..."
                            value={row.desc}
                            onChange={(e) => updateCommandRow(idx, 'desc', e.target.value)}
                            className="text-xs px-2.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        {commandsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCommandRow(idx)}
                            className="p-1.5 text-gray-400 hover:text-rose-500"
                            title="Xóa dòng lệnh này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Task specific fields */}
            {postType === 'task' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="w-full text-xs py-1.5 px-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="todo">Chờ làm (Todo)</option>
                    <option value="doing">Đang làm (Doing)</option>
                    <option value="done">Hoàn thành (Done)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Mức độ ưu tiên
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full text-xs py-1.5 px-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Thấp (Low)</option>
                    <option value="medium">Trung bình (Medium)</option>
                    <option value="high">Cao (High)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Hạn hoàn thành (Deadline)
                  </label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs py-1.5 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Event specific fields */}
            {postType === 'event' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-xs py-1.5 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full text-xs py-1.5 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Địa điểm / Link họp
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Google Meet, Zoom, Văn phòng..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs py-1.5 px-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Tags & Pin Row */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px] flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 rounded-lg">
                <TagIcon className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Thêm thẻ (cách nhau bởi dấu phẩy, vd: #network, #cmd, #bsod)..."
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-transparent text-xs text-gray-800 dark:text-gray-200 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                />
                <Pin className="w-3.5 h-3.5 text-rose-500" />
                <span>Ghim bài viết</span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Thu gọn
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Đăng lên dòng thời gian</span>
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
