import { INITIAL_POSTS, DEFAULT_USER, INITIAL_LINKS } from '../constants/initialData';
import { autoCategorizeUrl } from '../utils/linkClassifier';

const STORAGE_KEYS = {
  POSTS: 'personal_dashboard_posts_v3',
  USER: 'personal_dashboard_user_v3',
  LINKS: 'personal_dashboard_links_v3',
  THEME: 'personal_dashboard_theme_v3',
};

export const StorageService = {
  // Posts CRUD
  getPosts: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
        return INITIAL_POSTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to load posts from storage:", e);
      return INITIAL_POSTS;
    }
  },

  savePosts: (posts) => {
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    } catch (e) {
      console.error("Failed to save posts:", e);
    }
  },

  createPost: (post) => {
    const posts = StorageService.getPosts();
    const newPost = {
      ...post,
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      images: Array.isArray(post.images) ? post.images : [],
      likes: post.likes || 0,
      likedByMe: false,
      comments: Array.isArray(post.comments) ? post.comments : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: post.pinned || false,
    };
    const updated = [newPost, ...posts];
    StorageService.savePosts(updated);
    return newPost;
  },

  updatePost: (id, updates) => {
    const posts = StorageService.getPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updatedPost = {
      ...posts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    posts[index] = updatedPost;
    StorageService.savePosts(posts);
    return updatedPost;
  },

  deletePost: (id) => {
    const posts = StorageService.getPosts();
    const filtered = posts.filter((p) => p.id !== id);
    StorageService.savePosts(filtered);
    return true;
  },

  // Comments & Likes
  addComment: (postId, comment) => {
    const posts = StorageService.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return null;

    const newComment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      author: comment.author,
      avatar: comment.avatar,
      content: comment.content.trim(),
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(post.comments)) post.comments = [];
    post.comments.push(newComment);
    StorageService.savePosts(posts);
    return newComment;
  },

  deleteComment: (postId, commentId) => {
    const posts = StorageService.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post || !Array.isArray(post.comments)) return false;

    post.comments = post.comments.filter((c) => c.id !== commentId);
    StorageService.savePosts(posts);
    return true;
  },

  toggleLike: (postId) => {
    const posts = StorageService.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return null;

    const isLiked = post.likedByMe || false;
    post.likedByMe = !isLiked;
    post.likes = (post.likes || 0) + (isLiked ? -1 : 1);
    if (post.likes < 0) post.likes = 0;

    StorageService.savePosts(posts);
    return { likes: post.likes, likedByMe: post.likedByMe };
  },

  // Link Management with Auto-Categorization
  getLinks: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LINKS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(INITIAL_LINKS));
        return INITIAL_LINKS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to load links:", e);
      return INITIAL_LINKS;
    }
  },

  saveLinks: (links) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
    } catch (e) {
      console.error("Failed to save links:", e);
    }
  },

  createLink: (linkData) => {
    const links = StorageService.getLinks();
    const category = linkData.category && linkData.category !== 'auto'
      ? linkData.category
      : autoCategorizeUrl(linkData.url);

    const newLink = {
      id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      url: linkData.url.trim(),
      title: linkData.title?.trim() || linkData.url.trim(),
      description: linkData.description?.trim() || '',
      category,
      tags: Array.isArray(linkData.tags) ? linkData.tags : [],
      createdAt: new Date().toISOString(),
    };

    const updated = [newLink, ...links];
    StorageService.saveLinks(updated);
    return newLink;
  },

  deleteLink: (id) => {
    const links = StorageService.getLinks();
    const filtered = links.filter((l) => l.id !== id);
    StorageService.saveLinks(filtered);
    return true;
  },

  // User Profile
  getUser: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
        return DEFAULT_USER;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to load user:", e);
      return DEFAULT_USER;
    }
  },

  saveUser: (user) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save user:", e);
    }
  },

  getStats: (posts, links = []) => {
    const taskPosts = posts.filter((p) => p.type === 'task');
    const totalTasks = taskPosts.length;
    const completedTasks = taskPosts.filter((p) => p.status === 'done').length;
    const inProgressTasks = taskPosts.filter((p) => p.status === 'doing').length;
    const pendingTasks = taskPosts.filter((p) => p.status === 'todo').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const eventPosts = posts.filter((p) => p.type === 'event');
    const notePosts = posts.filter((p) => p.type === 'note');
    const troubleshootPosts = posts.filter((p) => p.type === 'troubleshoot');

    return {
      totalPosts: posts.length,
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionRate,
      totalEvents: eventPosts.length,
      totalNotes: notePosts.length,
      totalTroubleshoot: troubleshootPosts.length,
      totalLinks: links.length,
    };
  },

  exportBackup: () => {
    const posts = StorageService.getPosts();
    const user = StorageService.getUser();
    const links = StorageService.getLinks();
    const backupData = {
      version: "3.0",
      exportedAt: new Date().toISOString(),
      user,
      posts,
      links,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `personal_dashboard_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importBackup: (jsonData) => {
    try {
      const parsed = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
      if (parsed.posts && Array.isArray(parsed.posts)) {
        StorageService.savePosts(parsed.posts);
      }
      if (parsed.user) {
        StorageService.saveUser(parsed.user);
      }
      if (parsed.links && Array.isArray(parsed.links)) {
        StorageService.saveLinks(parsed.links);
      }
      return true;
    } catch (e) {
      console.error("Invalid backup format:", e);
      return false;
    }
  },

  resetData: () => {
    localStorage.removeItem(STORAGE_KEYS.POSTS);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LINKS);
    return { posts: INITIAL_POSTS, user: DEFAULT_USER, links: INITIAL_LINKS };
  }
};
