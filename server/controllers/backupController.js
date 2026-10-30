import { db } from '../database/db.js';
import { seedInitialData } from '../database/seed.js';
import { executeCloudBackup, getCloudConfig, updateCloudConfig } from '../services/cloudBackup.js';

export const backupController = {
  // GET /api/backup
  exportBackup: (req, res) => {
    try {
      const user = db.prepare('SELECT * FROM users LIMIT 1').get();
      const posts = db.prepare('SELECT * FROM posts').all();
      const links = db.prepare('SELECT * FROM links').all();

      const payload = {
        version: "3.0",
        exportedAt: new Date().toISOString(),
        user,
        posts: posts.map(p => ({
          ...p,
          tags: p.tags ? JSON.parse(p.tags) : [],
          images: p.images ? JSON.parse(p.images) : [],
          comments: p.comments ? JSON.parse(p.comments) : [],
          commands: p.commands ? JSON.parse(p.commands) : [],
        })),
        links: links.map(l => ({
          ...l,
          tags: l.tags ? JSON.parse(l.tags) : []
        }))
      };

      res.setHeader('Content-Disposition', `attachment; filename=backup_${new Date().toISOString().split('T')[0]}.json`);
      res.setHeader('Content-Type', 'application/json');
      res.json(payload);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/restore
  restoreBackup: (req, res) => {
    try {
      const { user, posts, links } = req.body;
      if (!posts || !Array.isArray(posts)) {
        return res.status(400).json({ success: false, message: 'Dữ liệu khôi phục không hợp lệ' });
      }

      db.exec('DELETE FROM users; DELETE FROM posts; DELETE FROM links;');

      if (user) {
        db.prepare(`
          INSERT INTO users (id, name, role, avatar, cover_image, bio, location, website, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          user.id || 'user-1',
          user.name || '',
          user.role || '',
          user.avatar || '',
          user.coverImage || user.cover_image || '',
          user.bio || '',
          user.location || '',
          user.website || '',
          new Date().toISOString()
        );
      }

      const insertPost = db.prepare(`
        INSERT INTO posts (
          id, type, content, tags, pinned, images, likes, liked_by_me, comments,
          status, priority, due_date, start_time, end_time, location, title,
          it_category, error_title, error_code, cause, solution, severity, commands,
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?
        )
      `);

      for (const p of posts) {
        insertPost.run(
          p.id,
          p.type || 'status',
          p.content || p.errorTitle || '',
          JSON.stringify(p.tags || []),
          p.pinned ? 1 : 0,
          JSON.stringify(p.images || []),
          p.likes || 0,
          p.likedByMe || p.liked_by_me ? 1 : 0,
          JSON.stringify(p.comments || []),
          p.status || null,
          p.priority || null,
          p.dueDate || p.due_date || null,
          p.startTime || p.start_time || null,
          p.endTime || p.end_time || null,
          p.location || null,
          p.title || null,
          p.itCategory || p.it_category || null,
          p.errorTitle || p.error_title || null,
          p.errorCode || p.error_code || null,
          p.cause || null,
          p.solution || null,
          p.severity || null,
          JSON.stringify(p.commands || []),
          p.createdAt || p.created_at || new Date().toISOString(),
          p.updatedAt || p.updated_at || new Date().toISOString()
        );
      }

      if (Array.isArray(links)) {
        const insertLink = db.prepare(`
          INSERT INTO links (id, url, title, description, category, tags, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        for (const l of links) {
          insertLink.run(
            l.id,
            l.url,
            l.title,
            l.description || '',
            l.category,
            JSON.stringify(l.tags || []),
            l.createdAt || l.created_at || new Date().toISOString()
          );
        }
      }

      res.json({ success: true, message: 'Đã khôi phục dữ liệu thành công' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/reset
  resetData: (req, res) => {
    try {
      seedInitialData(true);
      res.json({ success: true, message: 'Đã đặt lại dữ liệu mẫu thành công' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/backup/cloud
  triggerCloudBackup: async (req, res) => {
    try {
      const result = await executeCloudBackup(req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /api/backup/cloud/status
  getCloudBackupStatus: (req, res) => {
    try {
      const config = getCloudConfig();
      res.json({ success: true, data: config });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // PUT /api/backup/cloud/config
  saveCloudConfig: (req, res) => {
    try {
      const config = updateCloudConfig(req.body);
      res.json({ success: true, message: 'Cập nhật cấu hình sao lưu Cloud thành công', data: config });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
