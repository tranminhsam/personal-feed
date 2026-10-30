import { db } from '../database/db.js';
import { autoCategorizeUrl } from '../../src/utils/linkClassifier.js';

function formatLinkRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    url: row.url,
    title: row.title,
    description: row.description,
    category: row.category,
    tags: row.tags ? JSON.parse(row.tags) : [],
    createdAt: row.created_at,
  };
}

export const linkController = {
  // GET /api/links
  getLinks: (req, res) => {
    try {
      const { category, search } = req.query;
      let query = 'SELECT * FROM links WHERE 1=1';
      const params = [];

      if (category && category !== 'all') {
        query += ' AND category = ?';
        params.push(category);
      }

      if (search) {
        query += ' AND (title LIKE ? OR url LIKE ? OR description LIKE ? OR tags LIKE ?)';
        const s = `%${search}%`;
        params.push(s, s, s, s);
      }

      query += ' ORDER BY created_at DESC';
      const rows = db.prepare(query).all(...params);
      res.json({ success: true, count: rows.length, data: rows.map(formatLinkRow) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/links
  createLink: (req, res) => {
    try {
      const { url, title, description, category, tags } = req.body;
      if (!url) {
        return res.status(400).json({ success: false, message: 'URL không được để trống' });
      }

      const id = `link-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const finalCategory = category && category !== 'auto' ? category : autoCategorizeUrl(url);
      const now = new Date().toISOString();

      const insert = db.prepare(`
        INSERT INTO links (id, url, title, description, category, tags, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      insert.run(
        id,
        url.trim(),
        title ? title.trim() : url.trim(),
        description ? description.trim() : '',
        finalCategory,
        JSON.stringify(Array.isArray(tags) ? tags : []),
        now
      );

      const created = db.prepare('SELECT * FROM links WHERE id = ?').get(id);
      res.status(201).json({ success: true, data: formatLinkRow(created) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // DELETE /api/links/:id
  deleteLink: (req, res) => {
    try {
      const result = db.prepare('DELETE FROM links WHERE id = ?').run(req.params.id);
      if (result.changes === 0) {
        return res.status(404).json({ success: false, message: 'Liên kết không tồn tại' });
      }
      res.json({ success: true, message: 'Đã xóa liên kết' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
