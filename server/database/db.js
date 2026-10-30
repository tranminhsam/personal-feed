import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, '../../data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'dashboard.sqlite');
export const db = new DatabaseSync(DB_PATH);

// Enable WAL mode for performance & concurrent reads
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password_hash TEXT,
      is_admin INTEGER DEFAULT 1,
      name TEXT NOT NULL,
      role TEXT,
      avatar TEXT,
      cover_image TEXT,
      bio TEXT,
      location TEXT,
      website TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT,
      pinned INTEGER DEFAULT 0,
      images TEXT,
      likes INTEGER DEFAULT 0,
      liked_by_me INTEGER DEFAULT 0,
      comments TEXT,
      status TEXT,
      priority TEXT,
      due_date TEXT,
      start_time TEXT,
      end_time TEXT,
      location TEXT,
      title TEXT,
      it_category TEXT,
      error_title TEXT,
      error_code TEXT,
      cause TEXT,
      solution TEXT,
      severity TEXT,
      commands TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      tags TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
    CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
    CREATE INDEX IF NOT EXISTS idx_links_category ON links(category);
  `);

  // Migrate existing schema if needed
  try { db.exec('ALTER TABLE users ADD COLUMN username TEXT;'); } catch (_) {}
  try { db.exec('ALTER TABLE users ADD COLUMN password_hash TEXT;'); } catch (_) {}
  try { db.exec('ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 1;'); } catch (_) {}
}
