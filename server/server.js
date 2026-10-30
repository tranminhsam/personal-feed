import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { initDatabase } from './database/db.js';
import { seedInitialData } from './database/seed.js';

import postRoutes from './routes/postRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import userRoutes from './routes/userRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import backupRoutes from './routes/backupRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { startCloudBackupScheduler } from './services/cloudBackup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database & Seed data if necessary
initDatabase();
seedInitialData();

// Start Background Cloud Backup Scheduler
startCloudBackupScheduler();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with 50MB limit to handle base64 image uploads smoothly
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Personal Dashboard Backend',
    database: 'SQLite (Native node:sqlite)'
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/user', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/backup', backupRoutes);

// Serve static frontend in production (Single Container / Full-Stack Mode)
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // All other GET requests serve index.html for SPA client-side routing
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Lỗi hệ thống máy chủ'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`🚀 Personal Dashboard Full-Stack Server running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🗄️ Database: SQLite (Native WAL mode)`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Static assets: ${fs.existsSync(distPath) ? 'Served from /dist' : 'Development mode (Vite dev server)'}`);
  console.log(`===============================================`);
});

export default app;
