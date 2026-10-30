import { db } from '../database/db.js';

function formatUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    avatar: row.avatar,
    coverImage: row.cover_image,
    bio: row.bio,
    location: row.location,
    website: row.website,
    updatedAt: row.updated_at,
  };
}

export const userController = {
  // GET /api/user
  getUser: (req, res) => {
    try {
      const user = db.prepare('SELECT * FROM users LIMIT 1').get();
      if (!user) {
        return res.status(404).json({ success: false, message: 'Chưa có thông tin người dùng' });
      }
      res.json({ success: true, data: formatUserRow(user) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // PUT /api/user
  updateUser: (req, res) => {
    try {
      const user = db.prepare('SELECT * FROM users LIMIT 1').get();
      const p = req.body;
      const now = new Date().toISOString();

      if (!user) {
        // Insert new
        const insert = db.prepare(`
          INSERT INTO users (id, name, role, avatar, cover_image, bio, location, website, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        insert.run('user-1', p.name, p.role, p.avatar, p.coverImage, p.bio, p.location, p.website, now);
      } else {
        const update = db.prepare(`
          UPDATE users SET
            name = COALESCE(?, name),
            role = COALESCE(?, role),
            avatar = COALESCE(?, avatar),
            cover_image = COALESCE(?, cover_image),
            bio = COALESCE(?, bio),
            location = COALESCE(?, location),
            website = COALESCE(?, website),
            updated_at = ?
          WHERE id = ?
        `);
        update.run(
          p.name !== undefined ? p.name : null,
          p.role !== undefined ? p.role : null,
          p.avatar !== undefined ? p.avatar : null,
          p.coverImage !== undefined ? p.coverImage : null,
          p.bio !== undefined ? p.bio : null,
          p.location !== undefined ? p.location : null,
          p.website !== undefined ? p.website : null,
          now,
          user.id
        );
      }

      const updated = db.prepare('SELECT * FROM users LIMIT 1').get();
      res.json({ success: true, data: formatUserRow(updated) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
