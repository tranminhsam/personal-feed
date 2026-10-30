import React, { useState, useRef } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { X, Save, AlertCircle, Image as ImageIcon, Plus, ClipboardCheck, Terminal, Trash2 } from 'lucide-react';
import { IT_CATEGORIES } from '../../constants/initialData';

export default function EditPostModal() {
  const { editingPost, setEditingPost, updatePost } = useDashboard();
  const fileInputRef = useRef(null);

  if (!editingPost) return null;

  const [content, setContent] = useState(editingPost.content || '');
  const [title, setTitle] = useState(editingPost.title || '');
  const [priority, setPriority] = useState(editingPost.priority || 'medium');
  const [status, setStatus] = useState(editingPost.status || 'todo');
  const [dueDate, setDueDate] = useState(
    editingPost.dueDate ? editingPost.dueDate.substring(0, 16) : ''
  );
  const [startTime, setStartTime] = useState(
    editingPost.startTime ? editingPost.startTime.substring(0, 16) : ''
  );
  const [endTime, setEndTime] = useState(
    editingPost.endTime ? editingPost.endTime.substring(0, 16) : ''
  );
  const [location, setLocation] = useState(editingPost.location || '');
  const [pinned, setPinned] = useState(editingPost.pinned || false);
  const [images, setImages] = useState(Array.isArray(editingPost.images) ? editingPost.images : []);
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(editingPost.tags) ? editingPost.tags.join(', ') : ''
  );

  // IT Troubleshoot fields
  const [itCategory, setItCategory] = useState(editingPost.itCategory || 'network');
  const [errorTitle, setErrorTitle] = useState(editingPost.errorTitle || '');
  const [errorCode, setErrorCode] = useState(editingPost.errorCode || '');
  const [cause, setCause] = useState(editingPost.cause || '');
  const [solution, setSolution] = useState(editingPost.solution || '');
  const [severity, setSeverity] = useState(editingPost.severity || 'medium');
  const [commands, setCommands] = useState(
    Array.isArray(editingPost.commands) && editingPost.commands.length > 0
      ? editingPost.commands
      : [{ cmd: '', desc: '' }]
  );

  const [error, setError] = useState('');
  const [pasteNotice, setPasteNotice] = useState('');

  // Handle Ctrl+V paste for images in edit modal
  const handlePaste = (e) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData || !clipboardData.items) return;

    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setImages((prev) => [...prev, event.target.result]);
            setPasteNotice('Đã dán ảnh từ Clipboard!');
            setTimeout(() => setPasteNotice(''), 2500);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addCmdRow = () => setCommands((prev) => [...prev, { cmd: '', desc: '' }]);
  const updateCmdRow = (index, field, value) => {
    setCommands((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };
  const removeCmdRow = (index) => setCommands((prev) => prev.filter((_, i) => i !== index));

  const handleSave = (e) => {
    e.preventDefault();

    const tags = tagsInput
      .split(/[,#\s]+/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const updates = {
      content: content.trim(),
      tags,
      pinned,
      images,
    };

    if (editingPost.type === 'troubleshoot') {
      updates.itCategory = itCategory;
      updates.errorTitle = errorTitle.trim();
      updates.errorCode = errorCode.trim();
      updates.cause = cause.trim();
      updates.solution = solution.trim();
      updates.severity = severity;
      updates.commands = commands.filter((c) => c.cmd.trim().length > 0);
      if (!updates.content) updates.content = updates.errorTitle;
    } else if (editingPost.type === 'note') {
      updates.title = title.trim();
    } else if (editingPost.type === 'task') {
      updates.status = status;
      updates.priority = priority;
      updates.dueDate = dueDate ? new Date(dueDate).toISOString() : null;
    } else if (editingPost.type === 'event') {
      updates.startTime = startTime ? new Date(startTime).toISOString() : null;
      updates.endTime = endTime ? new Date(endTime).toISOString() : null;
      updates.location = location.trim();
    }

    updatePost(editingPost.id, updates);
    setEditingPost(null);
  };

  return (
    <div 
      onPaste={handlePaste}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            Chỉnh sửa bài viết
          </h3>
          <button
            onClick={() => setEditingPost(null)}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 flex-1">
          {pasteNotice && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
              <ClipboardCheck className="w-4 h-4 text-emerald-500" />
              <span>{pasteNotice}</span>
            </div>
          )}

          {/* IT Troubleshoot Editor */}
          {editingPost.type === 'troubleshoot' && (
            <div className="space-y-3 bg-cyan-50/40 dark:bg-cyan-950/20 p-3 rounded-xl border border-cyan-100 dark:border-cyan-900/40">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Tên sự cố / Hiện tượng
                </label>
                <input
                  type="text"
                  value={errorTitle}
                  onChange={(e) => setErrorTitle(e.target.value)}
                  className="w-full text-xs font-bold p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Danh mục</label>
                  <select
                    value={itCategory}
                    onChange={(e) => setItCategory(e.target.value)}
                    className="w-full text-xs p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="network">🌐 Mạng</option>
                    <option value="hardware">🖥️ Phần cứng</option>
                    <option value="software">📦 Phần mềm</option>
                    <option value="os_system">💻 Windows</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Mã lỗi</label>
                  <input
                    type="text"
                    value={errorCode}
                    onChange={(e) => setErrorCode(e.target.value)}
                    className="w-full text-xs p-1.5 font-mono bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Mức độ</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full text-xs p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Vừa</option>
                    <option value="high">Nghiêm trọng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Nguyên nhân
                </label>
                <input
                  type="text"
                  value={cause}
                  onChange={(e) => setCause(e.target.value)}
                  className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Cách sửa từng bước
                </label>
                <textarea
                  rows={3}
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white resize-y"
                />
              </div>

              {/* Commands */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Câu lệnh CMD / PowerShell
                  </label>
                  <button
                    type="button"
                    onClick={addCmdRow}
                    className="text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
                  >
                    + Thêm dòng lệnh
                  </button>
                </div>

                <div className="space-y-1.5">
                  {commands.map((cmd, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Câu lệnh: VD: ipconfig /flushdns"
                        value={cmd.cmd}
                        onChange={(e) => updateCmdRow(idx, 'cmd', e.target.value)}
                        className="flex-1 text-xs font-mono p-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-emerald-600 font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Mô tả..."
                        value={cmd.desc}
                        onChange={(e) => updateCmdRow(idx, 'desc', e.target.value)}
                        className="w-1/3 text-xs p-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
                      />
                      {commands.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCmdRow(idx)}
                          className="p-1 text-gray-400 hover:text-rose-500"
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

          {editingPost.type === 'note' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Tiêu đề ghi chú
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {editingPost.type === 'troubleshoot' ? 'Ghi chú bổ sung' : 'Nội dung chính (Có thể Ctrl+V dán ảnh)'}
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-sm p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white resize-y"
            />
          </div>

          {/* Images Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Hình ảnh đính kèm ({images.length})</span>
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tải ảnh lên
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {editingPost.type === 'task' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Trạng thái
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                >
                  <option value="todo">Chờ làm</option>
                  <option value="doing">Đang làm</option>
                  <option value="done">Hoàn thành</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Độ ưu tiên
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Vừa</option>
                  <option value="high">Cao</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Hạn hoàn thành
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {editingPost.type === 'event' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Địa điểm / Link
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Thẻ nhãn (Tags)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="VD: #network, #cmd..."
              className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Ghim lên đầu trang
            </span>
          </label>

          {error && (
            <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </p>
          )}

          {/* Footer actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setEditingPost(null)}
              className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
