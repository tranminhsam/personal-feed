import React, { useRef, useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { StorageService } from '../../services/storage';
import { ApiService } from '../../services/api';
import { 
  X, 
  Download, 
  Upload, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Cloud,
  Send,
  Radio,
  Clock,
  ExternalLink,
  RefreshCw,
  Sliders,
  ShieldCheck
} from 'lucide-react';

export default function BackupModal() {
  const { 
    isBackupModalOpen, 
    setIsBackupModalOpen, 
    importBackup, 
    resetData,
    posts,
    links
  } = useDashboard();

  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('cloud'); // 'cloud' | 'local'
  const [message, setMessage] = useState(null);

  // Cloud backup state
  const [cloudStatus, setCloudStatus] = useState(null);
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [intervalHours, setIntervalHours] = useState('24');
  const [triggeringCloud, setTriggeringCloud] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  // Fetch cloud backup status on open
  useEffect(() => {
    if (isBackupModalOpen) {
      loadCloudStatus();
    }
  }, [isBackupModalOpen]);

  const loadCloudStatus = async () => {
    try {
      const data = await ApiService.getCloudBackupStatus();
      if (data) {
        setCloudStatus(data);
        setAutoBackupEnabled(data.autoBackupEnabled);
        setIntervalHours(String(data.intervalHours || 24));
      }
    } catch (e) {
      console.warn('Failed to fetch cloud backup status:', e);
    }
  };

  if (!isBackupModalOpen) return null;

  const handleExport = () => {
    ApiService.exportBackup();
    setMessage({ type: 'success', text: 'Đã xuất file sao lưu JSON thành công!' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const success = await ApiService.importBackup(text);
        if (success) {
          setMessage({ type: 'success', text: 'Nhập dữ liệu thành công! Dòng thời gian đã được cập nhật.' });
        } else {
          setMessage({ type: 'error', text: 'File sao lưu không đúng định dạng.' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Lỗi đọc file: ' + err.message });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleTriggerCloudBackup = async () => {
    setTriggeringCloud(true);
    setMessage(null);
    try {
      const payload = {};
      if (telegramToken.trim()) payload.telegramBotToken = telegramToken.trim();
      if (telegramChatId.trim()) payload.telegramChatId = telegramChatId.trim();
      if (webhookUrl.trim()) payload.webhookUrl = webhookUrl.trim();

      const result = await ApiService.triggerCloudBackup(payload);
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Đã sao lưu lên Cloud thành công!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Lỗi sao lưu Cloud' });
      }
      await loadCloudStatus();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Lỗi kết nối máy chủ' });
    } finally {
      setTriggeringCloud(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const payload = {
        autoBackupEnabled,
        intervalHours: parseInt(intervalHours, 10)
      };
      if (telegramToken.trim()) payload.telegramBotToken = telegramToken.trim();
      if (telegramChatId.trim()) payload.telegramChatId = telegramChatId.trim();
      if (webhookUrl.trim()) payload.webhookUrl = webhookUrl.trim();

      await ApiService.saveCloudConfig(payload);
      setMessage({ type: 'success', text: 'Đã lưu cấu hình tự động sao lưu Cloud!' });
      await loadCloudStatus();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Lỗi lưu cấu hình' });
    } finally {
      setSavingConfig(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Sao lưu & Tự động đẩy Cloud
              </h3>
              <p className="text-[11px] text-gray-500">Bảo toàn vĩnh viễn bài viết ({posts.length}) & liên kết ({links?.length || 0})</p>
            </div>
          </div>
          <button
            onClick={() => {
              setMessage(null);
              setIsBackupModalOpen(false);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-5 pt-3 border-b border-gray-100 dark:border-gray-800 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('cloud')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'cloud'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Tự động Cloud (Telegram / Webhook)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('local')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'local'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>File cục bộ (JSON)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {message && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 font-medium ${
              message.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          {activeTab === 'cloud' ? (
            <div className="space-y-4">
              {/* Cloud Status Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Trạng thái sao lưu Cloud:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    cloudStatus?.lastStatus === 'success' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                      : cloudStatus?.lastStatus === 'failed'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {cloudStatus?.lastStatus === 'success' ? '● Đã đồng bộ' : cloudStatus?.lastStatus === 'failed' ? '● Thất bại' : '○ Chờ cấu hình'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <div>Lần sao lưu gần nhất: <span className="font-medium text-slate-700 dark:text-slate-300">{cloudStatus?.lastBackupTime ? new Date(cloudStatus.lastBackupTime).toLocaleString('vi-VN') : 'Chưa có'}</span></div>
                  {cloudStatus?.lastMessage && (
                    <div className="text-slate-600 dark:text-slate-400 italic">"{cloudStatus.lastMessage}"</div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-500">Mục tiêu Cloud:</span>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${cloudStatus?.hasTelegram ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-gray-200/70 text-gray-400'}`}>
                      Telegram: {cloudStatus?.hasTelegram ? 'Đã bật' : 'Chưa'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${cloudStatus?.hasWebhook ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : 'bg-gray-200/70 text-gray-400'}`}>
                      Webhook: {cloudStatus?.hasWebhook ? 'Đã bật' : 'Chưa'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant Trigger Button */}
              <button
                type="button"
                disabled={triggeringCloud}
                onClick={handleTriggerCloudBackup}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {triggeringCloud ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Sao lưu lên Cloud ngay bây giờ</span>
              </button>

              {/* Telegram / Webhook Config form */}
              <form onSubmit={handleSaveConfig} className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-500" />
                    Cấu hình Telegram Bot & Tự động
                  </h4>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={autoBackupEnabled}
                      onChange={(e) => setAutoBackupEnabled(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">Bật hẹn giờ</span>
                  </label>
                </div>

                {/* Telegram Bot Token */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Telegram Bot Token:
                  </label>
                  <input
                    type="password"
                    value={telegramToken}
                    onChange={(e) => setTelegramToken(e.target.value)}
                    placeholder={cloudStatus?.hasTelegram ? '•••••••••••••••• (Đã cấu hình)' : '123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ'}
                    className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Tạo bot miễn phí bằng cách chat với <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-blue-500 underline">@BotFather</a></p>
                </div>

                {/* Telegram Chat ID */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Telegram Chat ID / Kênh riêng tư:
                  </label>
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder={cloudStatus?.telegramChatIdMasked || '987654321 hoặc @ten_channel'}
                    className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Lấy ID cá nhân qua bot <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-blue-500 underline">@userinfobot</a></p>
                </div>

                {/* Webhook URL */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Webhook URL tùy chọn (Discord, Make, Zapier):
                  </label>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder={cloudStatus?.webhookUrlMasked || 'https://discord.com/api/webhooks/...'}
                    className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>

                {/* Interval selection */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Chu kỳ tự động:</span>
                  </div>
                  <select
                    value={intervalHours}
                    onChange={(e) => setIntervalHours(e.target.value)}
                    className="text-xs p-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-medium"
                  >
                    <option value="6">Mỗi 6 tiếng</option>
                    <option value="12">Mỗi 12 tiếng</option>
                    <option value="24">Mỗi 24 tiếng (Hàng ngày)</option>
                    <option value="48">Mỗi 48 tiếng (2 ngày)</option>
                  </select>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
                  >
                    {savingConfig ? 'Đang lưu...' : 'Lưu cấu hình Cloud'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Xuất hoặc nhập toàn bộ bài viết, nhiệm vụ, lỗi IT và liên kết dưới định dạng JSON độc lập để lưu trữ máy tính cá nhân.
              </p>

              {/* Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Export Card */}
                <button
                  onClick={handleExport}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 bg-gray-50/50 dark:bg-gray-800/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/30 text-left transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Download className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Xuất file sao lưu (JSON)</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Tải về toàn bộ bài viết ({posts.length}) & liên kết ({links?.length || 0})</p>
                </button>

                {/* Import Card */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-gray-50/50 dark:bg-gray-800/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 text-left transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Upload className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Nhập khôi phục</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Khôi phục từ file JSON đã xuất trước đó</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </button>
              </div>

              {/* Reset button */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (window.confirm("Thao tác này sẽ xóa toàn bộ thay đổi và nạp lại dữ liệu bài viết mẫu. Bạn có chắc không?")) {
                      resetData();
                      setMessage({ type: 'success', text: 'Đã nạp lại dữ liệu bài viết mẫu ban đầu.' });
                    }
                  }}
                  className="text-xs text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục dữ liệu demo</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer close */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <button
              onClick={() => {
                setMessage(null);
                setIsBackupModalOpen(false);
              }}
              className="px-4 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg"
            >
              Đóng
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
