import { db } from '../database/db.js';
import { hashPassword, verifyPassword, signToken } from '../utils/auth.js';

function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    coverImage: user.cover_image,
    bio: user.bio,
    location: user.location,
    website: user.website,
    isAdmin: Boolean(user.is_admin),
    updatedAt: user.updated_at
  };
}

export const authController = {
  // POST /api/auth/login
  login: (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu' });
      }

      // Check user in database
      const user = db.prepare('SELECT * FROM users WHERE username = ? OR id = ? LIMIT 1').get(username, username);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
      }

      // Verify password
      const isValid = verifyPassword(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
      }

      // Generate JWT
      const token = signToken({
        id: user.id,
        username: user.username,
        name: user.name,
        isAdmin: Boolean(user.is_admin)
      });

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        token,
        user: sanitizeUser(user)
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/auth/register
  register: (req, res) => {
    try {
      const { username, password, name } = req.body;
      if (!username || !password || !name) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đủ Tên đăng nhập, Mật khẩu và Tên hiển thị' });
      }

      if (username.length < 3) {
        return res.status(400).json({ success: false, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' });
      }

      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' });
      }

      // Check if username taken
      const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại trên hệ thống' });
      }

      const id = `user-${Date.now()}`;
      const passwordHash = hashPassword(password);
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO users (id, username, password_hash, is_admin, name, role, avatar, cover_image, bio, updated_at)
        VALUES (?, ?, ?, 1, ?, 'Thành viên', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '', '', ?)
      `).run(id, username, passwordHash, name, now);

      const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
      const token = signToken({
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        isAdmin: true
      });

      res.json({
        success: true,
        message: 'Đăng ký tài khoản thành công',
        token,
        user: sanitizeUser(newUser)
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /api/auth/me
  me: (req, res) => {
    try {
      const userId = req.user?.id;
      let user = null;
      if (userId) {
        user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      }
      if (!user) {
        // Fallback to first user in system
        user = db.prepare('SELECT * FROM users LIMIT 1').get();
      }

      if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      }

      res.json({
        success: true,
        user: sanitizeUser(user)
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/auth/change-password
  changePassword: (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập' });
      }

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Mật khẩu mới phải từ 6 ký tự trở lên' });
      }

      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      }

      if (user.password_hash) {
        const isValid = verifyPassword(currentPassword, user.password_hash);
        if (!isValid) {
          return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác' });
        }
      }

      const newHash = hashPassword(newPassword);
      db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?')
        .run(newHash, new Date().toISOString(), userId);

      res.json({ success: true, message: 'Đổi mật khẩu thành công' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
