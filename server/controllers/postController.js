import { db } from '../database/db.js';

// Helper to deserialize JSON fields from sqlite row to JS object
function formatPostRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    content: row.content,
    tags: row.tags ? JSON.parse(row.tags) : [],
    pinned: Boolean(row.pinned),
    images: row.images ? JSON.parse(row.images) : [],
    likes: row.likes || 0,
    likedByMe: Boolean(row.liked_by_me),
    comments: row.comments ? JSON.parse(row.comments) : [],
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date,
    startTime: row.start_time,
    endTime: row.end_time,
    location: row.location,
    title: row.title,
    itCategory: row.it_category,
    errorTitle: row.error_title,
    errorCode: row.error_code,
    cause: row.cause,
    solution: row.solution,
    severity: row.severity,
    commands: row.commands ? JSON.parse(row.commands) : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const postController = {
  // GET /api/posts
  getPosts: (req, res) => {
    try {
      const { type, tag, search, pinned, sort = 'newest' } = req.query;

      let query = 'SELECT * FROM posts WHERE 1=1';
      const params = [];

      if (type && type !== 'all') {
        query += ' AND type = ?';
        params.push(type);
      }

      if (pinned === 'true') {
        query += ' AND pinned = 1';
      }

      if (search) {
        query += ` AND (
          content LIKE ? OR 
          error_title LIKE ? OR 
          error_code LIKE ? OR 
          title LIKE ? OR 
          tags LIKE ?
        )`;
        const s = `%${search}%`;
        params.push(s, s, s, s, s);
      }

      if (sort === 'oldest') {
        query += ' ORDER BY pinned DESC, created_at ASC';
      } else {
        query += ' ORDER BY pinned DESC, created_at DESC';
      }

      const rows = db.prepare(query).all(...params);
      let posts = rows.map(formatPostRow);

      // In-memory filter for specific tag if requested
      if (tag) {
        const cleanTag = tag.toLowerCase();
        posts = posts.filter(p => p.tags.some(t => t.toLowerCase() === cleanTag));
      }

      res.json({ success: true, count: posts.length, data: posts });
    } catch (err) {
      console.error('getPosts error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /api/posts/:id
  getPostById: (req, res) => {
    try {
      const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
      if (!row) {
        return res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });
      }
      res.json({ success: true, data: formatPostRow(row) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/posts
  createPost: (req, res) => {
    try {
      const p = req.body;
      const id = p.id || `post-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const now = new Date().toISOString();

      const insert = db.prepare(`
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

      insert.run(
        id,
        p.type || 'status',
        p.content || p.errorTitle || '',
        JSON.stringify(p.tags || []),
        p.pinned ? 1 : 0,
        JSON.stringify(p.images || []),
        p.likes || 0,
        0,
        JSON.stringify(p.comments || []),
        p.status || null,
        p.priority || null,
        p.dueDate || null,
        p.startTime || null,
        p.endTime || null,
        p.location || null,
        p.title || null,
        p.itCategory || null,
        p.errorTitle || null,
        p.errorCode || null,
        p.cause || null,
        p.solution || null,
        p.severity || null,
        JSON.stringify(p.commands || []),
        now,
        now
      );

      const created = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
      res.status(201).json({ success: true, data: formatPostRow(created) });
    } catch (err) {
      console.error('createPost error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // PUT /api/posts/:id
  updatePost: (req, res) => {
    try {
      const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });
      }

      const p = req.body;
      const now = new Date().toISOString();

      const update = db.prepare(`
        UPDATE posts SET
          content = COALESCE(?, content),
          tags = COALESCE(?, tags),
          pinned = COALESCE(?, pinned),
          images = COALESCE(?, images),
          status = COALESCE(?, status),
          priority = COALESCE(?, priority),
          due_date = ?,
          start_time = ?,
          end_time = ?,
          location = ?,
          title = COALESCE(?, title),
          it_category = COALESCE(?, it_category),
          error_title = COALESCE(?, error_title),
          error_code = COALESCE(?, error_code),
          cause = COALESCE(?, cause),
          solution = COALESCE(?, solution),
          severity = COALESCE(?, severity),
          commands = COALESCE(?, commands),
          updated_at = ?
        WHERE id = ?
      `);

      update.run(
        p.content !== undefined ? p.content : null,
        p.tags ? JSON.stringify(p.tags) : null,
        p.pinned !== undefined ? (p.pinned ? 1 : 0) : null,
        p.images ? JSON.stringify(p.images) : null,
        p.status || null,
        p.priority || null,
        p.dueDate !== undefined ? p.dueDate : existing.due_date,
        p.startTime !== undefined ? p.startTime : existing.start_time,
        p.endTime !== undefined ? p.endTime : existing.end_time,
        p.location !== undefined ? p.location : existing.location,
        p.title !== undefined ? p.title : null,
        p.itCategory || null,
        p.errorTitle !== undefined ? p.errorTitle : null,
        p.errorCode !== undefined ? p.errorCode : null,
        p.cause !== undefined ? p.cause : null,
        p.solution !== undefined ? p.solution : null,
        p.severity || null,
        p.commands ? JSON.stringify(p.commands) : null,
        now,
        req.params.id
      );

      const updated = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
      res.json({ success: true, data: formatPostRow(updated) });
    } catch (err) {
      console.error('updatePost error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // DELETE /api/posts/:id
  deletePost: (req, res) => {
    try {
      const result = db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
      if (result.changes === 0) {
        return res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });
      }
      res.json({ success: true, message: 'Đã xóa bài viết thành công' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/posts/:id/like
  toggleLike: (req, res) => {
    try {
      const post = db.prepare('SELECT likes, liked_by_me FROM posts WHERE id = ?').get(req.params.id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });
      }

      const isLiked = Boolean(post.liked_by_me);
      const newLiked = !isLiked;
      let newLikes = (post.likes || 0) + (isLiked ? -1 : 1);
      if (newLikes < 0) newLikes = 0;

      db.prepare('UPDATE posts SET likes = ?, liked_by_me = ? WHERE id = ?').run(
        newLikes,
        newLiked ? 1 : 0,
        req.params.id
      );

      res.json({ success: true, likes: newLikes, likedByMe: newLiked });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/posts/:id/comments
  addComment: (req, res) => {
    try {
      const post = db.prepare('SELECT comments FROM posts WHERE id = ?').get(req.params.id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });
      }

      const comments = post.comments ? JSON.parse(post.comments) : [];
      const newComment = {
        id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        author: req.body.author || 'Người dùng',
        avatar: req.body.avatar || '',
        content: req.body.content.trim(),
        createdAt: new Date().toISOString(),
      };

      comments.push(newComment);
      db.prepare('UPDATE posts SET comments = ? WHERE id = ?').run(
        JSON.stringify(comments),
        req.params.id
      );

      res.status(201).json({ success: true, data: newComment });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // DELETE /api/posts/:id/comments/:commentId
  deleteComment: (req, res) => {
    try {
      const post = db.prepare('SELECT comments FROM posts WHERE id = ?').get(req.params.id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });
      }

      let comments = post.comments ? JSON.parse(post.comments) : [];
      comments = comments.filter(c => c.id !== req.params.commentId);

      db.prepare('UPDATE posts SET comments = ? WHERE id = ?').run(
        JSON.stringify(comments),
        req.params.id
      );

      res.json({ success: true, message: 'Đã xóa bình luận' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
