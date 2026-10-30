import { db } from './db.js';
import { hashPassword } from '../utils/auth.js';
import { DEFAULT_USER, INITIAL_POSTS, INITIAL_LINKS } from '../../src/constants/initialData.js';

export function seedInitialData(force = false) {
  const userCheck = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCheck.count > 0 && !force) {
    // If user exists but username/password_hash is null, update default admin
    const currentUser = db.prepare('SELECT * FROM users LIMIT 1').get();
    if (currentUser && (!currentUser.username || !currentUser.password_hash)) {
      const defaultHash = hashPassword('admin123');
      db.prepare(`
        UPDATE users SET 
          username = COALESCE(username, 'admin'),
          password_hash = COALESCE(password_hash, ?),
          is_admin = 1
        WHERE id = ?
      `).run(defaultHash, currentUser.id);
    }
    return; // Already seeded
  }

  if (force) {
    db.exec('DELETE FROM users; DELETE FROM posts; DELETE FROM links;');
  }

  // 1. Seed user with default login: admin / admin123
  const defaultHash = hashPassword('admin123');
  const insertUser = db.prepare(`
    INSERT INTO users (id, username, password_hash, is_admin, name, role, avatar, cover_image, bio, location, website, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertUser.run(
    'user-1',
    'admin',
    defaultHash,
    1,
    DEFAULT_USER.name,
    DEFAULT_USER.role,
    DEFAULT_USER.avatar,
    DEFAULT_USER.coverImage,
    DEFAULT_USER.bio,
    DEFAULT_USER.location,
    DEFAULT_USER.website,
    new Date().toISOString()
  );

  // 2. Seed posts
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

  for (const post of INITIAL_POSTS) {
    insertPost.run(
      post.id,
      post.type,
      post.content || post.errorTitle || '',
      JSON.stringify(post.tags || []),
      post.pinned ? 1 : 0,
      JSON.stringify(post.images || []),
      post.likes || 0,
      post.likedByMe ? 1 : 0,
      JSON.stringify(post.comments || []),
      post.status || null,
      post.priority || null,
      post.dueDate || null,
      post.startTime || null,
      post.endTime || null,
      post.location || null,
      post.title || null,
      post.itCategory || null,
      post.errorTitle || null,
      post.errorCode || null,
      post.cause || null,
      post.solution || null,
      post.severity || null,
      JSON.stringify(post.commands || []),
      post.createdAt,
      post.updatedAt || post.createdAt
    );
  }

  // 3. Seed links
  const insertLink = db.prepare(`
    INSERT INTO links (id, url, title, description, category, tags, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const link of INITIAL_LINKS) {
    insertLink.run(
      link.id,
      link.url,
      link.title,
      link.description || '',
      link.category,
      JSON.stringify(link.tags || []),
      link.createdAt
    );
  }

  console.log('✅ Initial database successfully seeded!');
}
