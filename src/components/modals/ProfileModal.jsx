import React, { useState, useRef } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { ApiService } from '../../services/api';
import { 
  X, 
  Save, 
  User, 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  MapPin, 
  Briefcase,
  CheckCircle2,
  HardDrive,
  KeyRound,
  LogOut,
  ShieldAlert
} from 'lucide-react';

export default function ProfileModal() {
  const { user, updateUser, isProfileModalOpen, setIsProfileModalOpen, currentUser, logout, setIsAuthModalOpen } = useDashboard();

  if (!isProfileModalOpen) return null;

  const [name, setName] = useState(user.name || '');
  const [role, setRole] = useState(user.role || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [coverImage, setCoverImage] = useState(user.coverImage || '');
  const [location, setLocation] = useState(user.location || '');
  const [statusMessage, setStatusMessage] = useState('');

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [changingPass, setChangingPass] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Handle local Avatar upload
  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.target.result);
      setStatusMessage('Đã tải ảnh đại diện từ máy tính! Nhấn "Cập nhật hồ sơ" để lưu.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle local Cover photo upload
  const handleCoverFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImage(event.target.result);
      setStatusMessage('Đã tải ảnh bìa từ máy tính! Nhấn "Cập nhật hồ sơ" để lưu.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({
      name: name.trim(),
      role: role.trim(),
      bio: bio.trim(),
      avatar: avatar.trim(),
      coverImage: coverImage.trim(),
      location: location.trim(),
    });
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Chỉnh sửa hồ sơ cá nhân
            </h3>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Notification if local image selected */}
          {statusMessage && (
            <div className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2 border border-blue-200 dark:border-blue-800">
              <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Interactive Cover & Avatar with Local Upload Buttons */}
          <div className="relative mb-8">
            {/* Cover image banner */}
            <div className="h-32 sm:h-36 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden relative group">
              <img
                src={coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />

              {/* Upload Cover button overlay */}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md group-hover:scale-105"
                title="Tải ảnh bìa mới từ máy tính"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Đổi ảnh bìa</span>
              </button>
            </div>

            {/* Avatar overlapping */}
            <div className="absolute -bottom-6 left-4 flex items-end gap-3">
              <div className="relative group">
                <img
                  src={avatar}
                  alt="Avatar Preview"
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-900 shadow-lg bg-gray-100"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
                  }}
                />

                {/* Upload Avatar button */}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-transform hover:scale-110"
                  title="Tải ảnh đại diện mới từ máy tính"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mb-2 hidden sm:block">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                  <span>Lưu trữ trên LocalStorage</span>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Họ và tên *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Vị trí / Nghề nghiệp
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="VD: Full-stack Developer, IT Helpdesk, Kỹ sư..."
              className="w-full text-sm px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Tiểu sử / Châm ngôn sống
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Mô tả ngắn gọn về bạn..."
              className="w-full text-sm p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Địa điểm
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Hà Nội, Việt Nam"
              className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
            />
          </div>

          {/* Direct URL inputs (Alternative) */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80">
            <span className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Hoặc nhập đường dẫn ảnh trực tuyến (URL)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Đường dẫn Avatar URL
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">
                  Đường dẫn Ảnh bìa URL
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Account Security & Password */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Bảo mật tài khoản</span>
                <p className="text-[11px] text-gray-500">
                  {currentUser ? `Tài khoản: @${currentUser.username || 'admin'}` : 'Chưa đăng nhập'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{showPasswordSection ? 'Thu gọn' : 'Đổi mật khẩu'}</span>
                </button>
                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsProfileModalOpen(false);
                    }}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium ml-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="text-xs text-blue-600 hover:underline font-bold"
                  >
                    Đăng nhập
                  </button>
                )}
              </div>
            </div>

            {showPasswordSection && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                {passwordMsg.text && (
                  <div className={`p-2 rounded-lg text-xs ${
                    passwordMsg.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {passwordMsg.text}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="password"
                    placeholder="Mật khẩu hiện tại"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="text-xs p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  />
                  <input
                    type="password"
                    placeholder="Mật khẩu mới (>= 6 ký tự)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="text-xs p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={changingPass}
                    onClick={async () => {
                      if (!newPassword || newPassword.length < 6) {
                        setPasswordMsg({ type: 'error', text: 'Mật khẩu mới phải từ 6 ký tự trở lên' });
                        return;
                      }
                      setChangingPass(true);
                      try {
                        await ApiService.changePassword(currentPassword, newPassword);
                        setPasswordMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
                        setCurrentPassword('');
                        setNewPassword('');
                      } catch (err) {
                        setPasswordMsg({ type: 'error', text: err.message || 'Lỗi đổi mật khẩu' });
                      } finally {
                        setChangingPass(false);
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg disabled:opacity-50"
                  >
                    {changingPass ? 'Đang lưu...' : 'Xác nhận đổi mật khẩu'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Cập nhật hồ sơ</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
