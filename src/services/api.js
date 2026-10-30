import { StorageService } from './storage.js';

const API_BASE = '/api';
const TOKEN_KEY = 'dashboard_auth_token';

export const ApiService = {
  // Token helper
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  },
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  getHeaders: () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  },

  // Check if Backend is online
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // ==================== AUTHENTICATION ====================
  login: async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');
      if (data.token) ApiService.setToken(data.token);
      return data;
    } catch (err) {
      // Local fallback for offline mode
      if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
        const fakeToken = `local_token_${Date.now()}`;
        ApiService.setToken(fakeToken);
        const localUser = StorageService.getUser();
        return { success: true, token: fakeToken, user: localUser };
      }
      throw err;
    }
  },

  register: async (username, password, name) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại');
    if (data.token) ApiService.setToken(data.token);
    return data;
  },

  getMe: async () => {
    const token = ApiService.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: ApiService.getHeaders(),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) {
        if (res.status === 401) ApiService.removeToken();
        return null;
      }
      const data = await res.json();
      return data.user;
    } catch (err) {
      return null;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: ApiService.getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Đổi mật khẩu thất bại');
    return data;
  },

  // ==================== POSTS ====================
  getPosts: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/posts?${query}`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('Backend unavailable, using LocalStorage:', e.message);
      return StorageService.getPosts();
    }
  },

  createPost: async (postData) => {
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(postData),
      });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      StorageService.createPost(json.data);
      return json.data;
    } catch (e) {
      console.warn('Falling back to LocalStorage:', e.message);
      return StorageService.createPost(postData);
    }
  },

  updatePost: async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'PUT',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      StorageService.updatePost(id, updates);
      return json.data;
    } catch (e) {
      return StorageService.updatePost(id, updates);
    }
  },

  deletePost: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'DELETE',
        headers: ApiService.getHeaders()
      });
      if (!res.ok) throw new Error('API error');
      StorageService.deletePost(id);
      return true;
    } catch (e) {
      return StorageService.deletePost(id);
    }
  },

  toggleLike: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${id}/like`, {
        method: 'POST',
        headers: ApiService.getHeaders()
      });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      StorageService.toggleLike(id);
      return json.data;
    } catch (e) {
      return StorageService.toggleLike(id);
    }
  },

  togglePin: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${id}/pin`, {
        method: 'POST',
        headers: ApiService.getHeaders()
      });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      StorageService.togglePin(id);
      return json.data;
    } catch (e) {
      return StorageService.togglePin(id);
    }
  },

  addComment: async (id, text, authorName) => {
    try {
      const res = await fetch(`${API_BASE}/posts/${id}/comments`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify({ text, authorName }),
      });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      StorageService.addComment(id, text, authorName);
      return json.data;
    } catch (e) {
      return StorageService.addComment(id, text, authorName);
    }
  },

  // ==================== LINKS ====================
  getLinks: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/links?${query}`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      return json.data;
    } catch (e) {
      return StorageService.getLinks();
    }
  },

  createLink: async (linkData) => {
    try {
      const res = await fetch(`${API_BASE}/links`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(linkData),
      });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      StorageService.createLink(json.data);
      return json.data;
    } catch (e) {
      return StorageService.createLink(linkData);
    }
  },

  updateLink: async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/links/${id}`, {
        method: 'PUT',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      StorageService.updateLink(id, updates);
      return json.data;
    } catch (e) {
      return StorageService.updateLink(id, updates);
    }
  },

  deleteLink: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/links/${id}`, {
        method: 'DELETE',
        headers: ApiService.getHeaders()
      });
      if (!res.ok) throw new Error('API error');
      StorageService.deleteLink(id);
      return true;
    } catch (e) {
      return StorageService.deleteLink(id);
    }
  },

  // ==================== USER PROFILE ====================
  getUser: async () => {
    try {
      const res = await fetch(`${API_BASE}/user`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      return json.data;
    } catch (e) {
      return StorageService.getUser();
    }
  },

  updateUser: async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/user`, {
        method: 'PUT',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      StorageService.saveUser(json.data);
      return json.data;
    } catch (e) {
      StorageService.saveUser(userData);
      return userData;
    }
  },

  // ==================== BACKUP & CLOUD ====================
  exportBackup: async () => {
    try {
      const res = await fetch(`${API_BASE}/backup/export`);
      if (!res.ok) throw new Error('API error');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_sqlite_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      StorageService.exportBackup();
    }
  },

  importBackup: async (backupData) => {
    try {
      const parsed = typeof backupData === 'string' ? JSON.parse(backupData) : backupData;
      const res = await fetch(`${API_BASE}/backup/restore`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(parsed),
      });
      if (!res.ok) throw new Error('API error');
      StorageService.importBackup(backupData);
      return true;
    } catch (e) {
      return StorageService.importBackup(backupData);
    }
  },

  resetData: async () => {
    try {
      const res = await fetch(`${API_BASE}/backup/reset`, { method: 'POST', headers: ApiService.getHeaders() });
      if (!res.ok) throw new Error('API error');
      return StorageService.resetData();
    } catch (e) {
      return StorageService.resetData();
    }
  },

  // Cloud Backup
  getCloudBackupStatus: async () => {
    try {
      const res = await fetch(`${API_BASE}/backup/cloud/status`);
      if (!res.ok) throw new Error('Lỗi lấy trạng thái cloud');
      const json = await res.json();
      return json.data;
    } catch (err) {
      return null;
    }
  },

  triggerCloudBackup: async (customConfig = {}) => {
    const res = await fetch(`${API_BASE}/backup/cloud`, {
      method: 'POST',
      headers: ApiService.getHeaders(),
      body: JSON.stringify(customConfig)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Lỗi sao lưu Cloud');
    return json;
  },

  saveCloudConfig: async (config) => {
    const res = await fetch(`${API_BASE}/backup/cloud/config`, {
      method: 'PUT',
      headers: ApiService.getHeaders(),
      body: JSON.stringify(config)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Lỗi lưu cấu hình Cloud');
    return json;
  }
};
