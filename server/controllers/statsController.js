import { db } from '../database/db.js';

export const statsController = {
  // GET /api/stats
  getStats: (req, res) => {
    try {
      const totalPosts = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
      const totalTasks = db.prepare("SELECT COUNT(*) as count FROM posts WHERE type = 'task'").get().count;
      const completedTasks = db.prepare("SELECT COUNT(*) as count FROM posts WHERE type = 'task' AND status = 'done'").get().count;
      const inProgressTasks = db.prepare("SELECT COUNT(*) as count FROM posts WHERE type = 'task' AND status = 'doing'").get().count;
      const pendingTasks = db.prepare("SELECT COUNT(*) as count FROM posts WHERE type = 'task' AND status = 'todo'").get().count;
      
      const totalNotes = db.prepare("SELECT COUNT(*) as count FROM posts WHERE type = 'note'").get().count;
      const totalEvents = db.prepare("SELECT COUNT(*) as count FROM posts WHERE type = 'event'").get().count;
      const totalTroubleshoot = db.prepare("SELECT COUNT(*) as count FROM posts WHERE type = 'troubleshoot'").get().count;
      const totalLinks = db.prepare('SELECT COUNT(*) as count FROM links').get().count;

      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      res.json({
        success: true,
        data: {
          totalPosts,
          totalTasks,
          completedTasks,
          inProgressTasks,
          pendingTasks,
          completionRate,
          totalNotes,
          totalEvents,
          totalTroubleshoot,
          totalLinks,
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /api/events/calendar
  getCalendar: (req, res) => {
    try {
      const { year, month } = req.query; // e.g. 2026, 10
      let query = `
        SELECT id, type, content, title, error_title, due_date, start_time, created_at 
        FROM posts 
        WHERE due_date IS NOT NULL OR start_time IS NOT NULL OR type IN ('event', 'task', 'troubleshoot')
      `;
      const rows = db.prepare(query).all();

      res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
