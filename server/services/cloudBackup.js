import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = path.join(__dirname, '../../data/backups');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// In-memory / persisted cloud configuration state
let cloudConfig = {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
  webhookUrl: process.env.BACKUP_WEBHOOK_URL || '',
  autoBackupEnabled: process.env.AUTO_BACKUP_ENABLED !== 'false',
  intervalHours: parseInt(process.env.BACKUP_INTERVAL_HOURS || '24', 10),
  lastBackupTime: null,
  lastStatus: 'idle', // 'idle' | 'success' | 'failed' | 'running'
  lastMessage: '',
  history: []
};

// Generate full backup payload
export function generateBackupData() {
  const user = db.prepare('SELECT * FROM users LIMIT 1').get();
  const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
  const links = db.prepare('SELECT * FROM links ORDER BY created_at DESC').all();

  return {
    version: "3.5",
    exportedAt: new Date().toISOString(),
    stats: {
      totalPosts: posts.length,
      totalLinks: links.length
    },
    user: user ? {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      cover_image: user.cover_image,
      bio: user.bio,
      location: user.location,
      website: user.website,
      updated_at: user.updated_at
    } : null,
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
}

/**
 * Send backup to Telegram Bot Channel / Chat
 */
async function sendToTelegram(token, chatId, backupJson, filename) {
  if (!token || !chatId) return { success: false, reason: 'Chưa cấu hình Telegram Token hoặc Chat ID' };

  try {
    const jsonStr = JSON.stringify(backupJson, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', blob, filename);
    formData.append('caption', `🛡️ [Personal Dashboard] Sao lưu dữ liệu đám mây tự động\n📅 Ngày: ${new Date().toLocaleString('vi-VN')}\n📊 Tổng bài viết: ${backupJson.stats.totalPosts}\n🔗 Tổng liên kết: ${backupJson.stats.totalLinks}\n💾 Kích thước: ${(jsonStr.length / 1024).toFixed(1)} KB`);

    const res = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.description || 'Lỗi gửi tin nhắn Telegram');
    }

    return { success: true, message: 'Đã gửi file sao lưu lên Telegram thành công' };
  } catch (err) {
    return { success: false, reason: err.message };
  }
}

/**
 * Send backup to custom webhook (Discord / Slack / Make / Zapier)
 */
async function sendToWebhook(url, backupJson) {
  if (!url) return { success: false, reason: 'Chưa cấu hình Webhook URL' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'dashboard_backup',
        timestamp: new Date().toISOString(),
        summary: `Sao lưu ngày ${new Date().toLocaleDateString('vi-VN')} (${backupJson.stats.totalPosts} bài viết, ${backupJson.stats.totalLinks} links)`,
        data: backupJson
      })
    });

    if (!res.ok) {
      throw new Error(`Webhook phản hồi mã lỗi HTTP: ${res.status}`);
    }

    return { success: true, message: 'Đã gửi sao lưu tới Webhook thành công' };
  } catch (err) {
    return { success: false, reason: err.message };
  }
}

/**
 * Save snapshot locally and clean old files (keep last 10)
 */
function saveLocalSnapshot(backupJson, filename) {
  try {
    const filePath = path.join(BACKUP_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(backupJson, null, 2), 'utf8');

    // Clean old files
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
      .sort()
      .reverse();

    if (files.length > 10) {
      files.slice(10).forEach(f => {
        try { fs.unlinkSync(path.join(BACKUP_DIR, f)); } catch (_) {}
      });
    }

    return { success: true, path: filePath };
  } catch (err) {
    return { success: false, reason: err.message };
  }
}

/**
 * Perform Cloud Backup Execution
 */
export async function executeCloudBackup(customConfig = {}) {
  const cfg = { ...cloudConfig, ...customConfig };
  cloudConfig.lastStatus = 'running';
  cloudConfig.lastMessage = 'Đang tiến hành sao lưu...';

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup_${timestamp}.json`;
  const backupData = generateBackupData();

  const results = {
    timestamp: new Date().toISOString(),
    localSnapshot: null,
    telegram: null,
    webhook: null
  };

  // 1. Local snapshot
  results.localSnapshot = saveLocalSnapshot(backupData, filename);

  // 2. Telegram Cloud
  if (cfg.telegramBotToken && cfg.telegramChatId) {
    results.telegram = await sendToTelegram(cfg.telegramBotToken, cfg.telegramChatId, backupData, filename);
  }

  // 3. Webhook Cloud
  if (cfg.webhookUrl) {
    results.webhook = await sendToWebhook(cfg.webhookUrl, backupData);
  }

  // Determine overall status
  const hasCloudConfig = Boolean((cfg.telegramBotToken && cfg.telegramChatId) || cfg.webhookUrl);
  const cloudSuccess = (results.telegram?.success || results.webhook?.success);

  cloudConfig.lastBackupTime = new Date().toISOString();

  if (hasCloudConfig && !cloudSuccess) {
    cloudConfig.lastStatus = 'failed';
    cloudConfig.lastMessage = results.telegram?.reason || results.webhook?.reason || 'Lỗi gửi lên Cloud';
  } else {
    cloudConfig.lastStatus = 'success';
    cloudConfig.lastMessage = cloudSuccess 
      ? 'Sao lưu thành công lên Cloud và đĩa cục bộ'
      : 'Đã lưu bản chụp snapshot cục bộ (chưa cấu hình Cloud target)';
  }

  // Append history
  cloudConfig.history.unshift({
    timestamp: cloudConfig.lastBackupTime,
    status: cloudConfig.lastStatus,
    message: cloudConfig.lastMessage,
    postsCount: backupData.stats.totalPosts,
    linksCount: backupData.stats.totalLinks
  });
  if (cloudConfig.history.length > 10) cloudConfig.history.pop();

  return {
    success: cloudConfig.lastStatus === 'success',
    message: cloudConfig.lastMessage,
    results,
    config: getCloudConfig()
  };
}

export function getCloudConfig() {
  return {
    hasTelegram: Boolean(cloudConfig.telegramBotToken && cloudConfig.telegramChatId),
    telegramChatIdMasked: cloudConfig.telegramChatId ? `***${cloudConfig.telegramChatId.slice(-4)}` : '',
    hasWebhook: Boolean(cloudConfig.webhookUrl),
    webhookUrlMasked: cloudConfig.webhookUrl ? `${cloudConfig.webhookUrl.slice(0, 18)}...` : '',
    autoBackupEnabled: cloudConfig.autoBackupEnabled,
    intervalHours: cloudConfig.intervalHours,
    lastBackupTime: cloudConfig.lastBackupTime,
    lastStatus: cloudConfig.lastStatus,
    lastMessage: cloudConfig.lastMessage,
    history: cloudConfig.history
  };
}

export function updateCloudConfig(newConfig) {
  if (newConfig.telegramBotToken !== undefined) cloudConfig.telegramBotToken = newConfig.telegramBotToken;
  if (newConfig.telegramChatId !== undefined) cloudConfig.telegramChatId = newConfig.telegramChatId;
  if (newConfig.webhookUrl !== undefined) cloudConfig.webhookUrl = newConfig.webhookUrl;
  if (newConfig.autoBackupEnabled !== undefined) cloudConfig.autoBackupEnabled = Boolean(newConfig.autoBackupEnabled);
  if (newConfig.intervalHours !== undefined) cloudConfig.intervalHours = parseInt(newConfig.intervalHours, 10) || 24;
  return getCloudConfig();
}

/**
 * Initialize automatic background scheduler (runs check every hour)
 */
export function startCloudBackupScheduler() {
  console.log('[Cloud Backup] Initializing background cloud backup scheduler...');

  // Run initial local snapshot if none exists
  try {
    const existingSnapshots = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'));
    if (existingSnapshots.length === 0) {
      saveLocalSnapshot(generateBackupData(), `backup_initial_${Date.now()}.json`);
      console.log('[Cloud Backup] Created initial local database snapshot.');
    }
  } catch (_) {}

  // Check every hour
  const ONE_HOUR = 60 * 60 * 1000;
  setInterval(async () => {
    if (!cloudConfig.autoBackupEnabled) return;

    const intervalMs = cloudConfig.intervalHours * ONE_HOUR;
    const now = Date.now();
    const last = cloudConfig.lastBackupTime ? new Date(cloudConfig.lastBackupTime).getTime() : 0;

    if (now - last >= intervalMs) {
      console.log(`[Cloud Backup] Triggering automated backup cycle (interval: ${cloudConfig.intervalHours}h)...`);
      try {
        await executeCloudBackup();
        console.log(`[Cloud Backup] Cycle finished: ${cloudConfig.lastMessage}`);
      } catch (err) {
        console.error('[Cloud Backup] Cycle error:', err);
      }
    }
  }, ONE_HOUR);
}
