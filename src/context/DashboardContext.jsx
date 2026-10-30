import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ApiService } from '../services/api.js';
import { StorageService } from '../services/storage.js';
import { triggerConfetti } from '../utils/formatters.js';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [posts, setPosts] = useState(() => StorageService.getPosts());
  const [user, setUser] = useState(() => StorageService.getUser());
  const [links, setLinks] = useState(() => StorageService.getLinks());
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('personal_dashboard_theme');
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Filters and queries
  const [activeFilter, setActiveFilter] = useState('all'); // all, task, note, event, troubleshoot, pinned
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest

  // Modals state
  const [editingPost, setEditingPost] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isITPlaybookOpen, setIsITPlaybookOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(null);

  // Multi-image Lightbox gallery state
  const [lightboxGallery, setLightboxGallery] = useState(null);

  // Initial Sync from Backend and Auth check on mount
  useEffect(() => {
    async function initApp() {
      const isOnline = await ApiService.checkHealth();
      setIsBackendConnected(isOnline);

      // Check current session
      const me = await ApiService.getMe();
      if (me) {
        setCurrentUser(me);
        setUser(me);
      }

      if (isOnline) {
        try {
          const [backendPosts, backendUser, backendLinks] = await Promise.all([
            ApiService.getPosts(),
            ApiService.getUser(),
            ApiService.getLinks(),
          ]);
          if (backendPosts && backendPosts.length > 0) setPosts(backendPosts);
          if (backendUser) setUser(backendUser);
          if (backendLinks && backendLinks.length > 0) setLinks(backendLinks);
        } catch (e) {
          console.warn('Initial sync error, keeping local data:', e);
        }
      }
    }
    initApp();
  }, []);

  const login = async (username, password) => {
    const res = await ApiService.login(username, password);
    if (res.user) {
      setCurrentUser(res.user);
      setUser(res.user);
    }
    return res;
  };

  const register = async (username, password, name) => {
    const res = await ApiService.register(username, password, name);
    if (res.user) {
      setCurrentUser(res.user);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    ApiService.removeToken();
    setCurrentUser(null);
  };

  const openLightbox = (images, index = 0) => {
    if (!images || images.length === 0) return;
    setLightboxGallery({ images, index });
  };

  const closeLightbox = () => setLightboxGallery(null);

  const nextLightboxImage = () => {
    if (!lightboxGallery) return;
    const { images, index } = lightboxGallery;
    const nextIdx = (index + 1) % images.length;
    setLightboxGallery({ images, index: nextIdx });
  };

  const prevLightboxImage = () => {
    if (!lightboxGallery) return;
    const { images, index } = lightboxGallery;
    const prevIdx = (index - 1 + images.length) % images.length;
    setLightboxGallery({ images, index: prevIdx });
  };

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('personal_dashboard_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('personal_dashboard_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Post operations
  const addPost = async (postData) => {
    // Optimistic UI update
    const tempId = `post-${Date.now()}`;
    const newPost = { ...postData, id: tempId, createdAt: new Date().toISOString() };
    setPosts((prev) => [newPost, ...prev]);

    const created = await ApiService.createPost(postData);
    if (created && created.id) {
      setPosts((prev) => prev.map((p) => (p.id === tempId ? created : p)));
    }
    return created;
  };

  const updatePost = async (id, updates) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    const updated = await ApiService.updatePost(id, updates);
    return updated;
  };

  const deletePost = async (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    await ApiService.deletePost(id);
  };

  const toggleTaskStatus = (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post || post.type !== 'task') return;

    let nextStatus = 'doing';
    if (post.status === 'todo') nextStatus = 'doing';
    else if (post.status === 'doing') {
      nextStatus = 'done';
      triggerConfetti();
    } else if (post.status === 'done') nextStatus = 'todo';

    updatePost(id, { status: nextStatus });
  };

  const togglePin = (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    updatePost(id, { pinned: !post.pinned });
  };

  // Likes & Comments
  const toggleLike = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const isLiked = post.likedByMe || false;
    const newLikes = (post.likes || 0) + (isLiked ? -1 : 1);

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: newLikes, likedByMe: !isLiked } : p
      )
    );

    await ApiService.toggleLike(postId);
  };

  const addComment = async (postId, commentContent) => {
    const newComment = {
      id: `comm-${Date.now()}`,
      author: user.name,
      avatar: user.avatar,
      content: commentContent,
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...(p.comments || []), newComment] }
          : p
      )
    );

    const created = await ApiService.addComment(postId, {
      author: user.name,
      avatar: user.avatar,
      content: commentContent,
    });
    return created || newComment;
  };

  const deleteComment = async (postId, commentId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: (p.comments || []).filter((c) => c.id !== commentId) }
          : p
      )
    );
    await ApiService.deleteComment(postId, commentId);
  };

  // Link Management
  const addLink = async (linkData) => {
    const tempId = `link-${Date.now()}`;
    const newLink = { ...linkData, id: tempId, createdAt: new Date().toISOString() };
    setLinks((prev) => [newLink, ...prev]);

    const created = await ApiService.createLink(linkData);
    if (created && created.id) {
      setLinks((prev) => prev.map((l) => (l.id === tempId ? created : l)));
    }
    return created;
  };

  const deleteLink = async (linkId) => {
    setLinks((prev) => prev.filter((l) => l.id !== linkId));
    await ApiService.deleteLink(linkId);
  };

  // User Profile
  const updateUser = async (newUserData) => {
    const updated = { ...user, ...newUserData };
    setUser(updated);
    await ApiService.updateUser(newUserData);
  };

  const resetData = async () => {
    const result = await ApiService.resetData();
    setPosts(result.posts);
    setUser(result.user);
    setLinks(result.links);
    setActiveFilter('all');
    setSelectedTag(null);
    setSearchQuery('');
  };

  const importBackup = async (jsonData) => {
    const ok = await ApiService.importBackup(jsonData);
    if (ok) {
      const [backendPosts, backendUser, backendLinks] = await Promise.all([
        ApiService.getPosts(),
        ApiService.getUser(),
        ApiService.getLinks(),
      ]);
      setPosts(backendPosts);
      setUser(backendUser);
      setLinks(backendLinks);
    }
    return ok;
  };

  // Extract all distinct tags from posts & links
  const allTags = useMemo(() => {
    const tagCountMap = {};
    posts.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((t) => {
          const clean = t.trim().toLowerCase();
          if (clean) tagCountMap[clean] = (tagCountMap[clean] || 0) + 1;
        });
      }
    });
    return Object.entries(tagCountMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  // Computed stats
  const stats = useMemo(() => StorageService.getStats(posts, links), [posts, links]);

  // Filtered & sorted posts list
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        if (activeFilter === 'pinned') {
          if (!post.pinned) return false;
        } else if (activeFilter !== 'all' && post.type !== activeFilter) {
          return false;
        }

        if (selectedTag) {
          if (!post.tags || !post.tags.map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase())) {
            return false;
          }
        }

        if (selectedDate) {
          const postDateStr = post.dueDate || post.startTime || post.createdAt;
          const postDate = new Date(postDateStr).toDateString();
          if (postDate !== selectedDate.toDateString()) {
            return false;
          }
        }

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchContent = post.content?.toLowerCase().includes(query);
          const matchTitle = post.title?.toLowerCase().includes(query);
          const matchErrorTitle = post.errorTitle?.toLowerCase().includes(query);
          const matchErrorCode = post.errorCode?.toLowerCase().includes(query);
          const matchSolution = post.solution?.toLowerCase().includes(query);
          const matchCause = post.cause?.toLowerCase().includes(query);
          const matchCommands = post.commands?.some((c) =>
            c.cmd.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query)
          );
          const matchTags = post.tags?.some((t) => t.toLowerCase().includes(query));
          const matchLocation = post.location?.toLowerCase().includes(query);

          if (
            !matchContent &&
            !matchTitle &&
            !matchErrorTitle &&
            !matchErrorCode &&
            !matchSolution &&
            !matchCause &&
            !matchCommands &&
            !matchTags &&
            !matchLocation
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (activeFilter === 'all' && a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [posts, activeFilter, selectedTag, selectedDate, searchQuery, sortOrder]);

  return (
    <DashboardContext.Provider
      value={{
        posts,
        filteredPosts,
        user,
        links,
        stats,
        allTags,
        darkMode,
        toggleDarkMode,
        isBackendConnected,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        selectedTag,
        setSelectedTag,
        selectedDate,
        setSelectedDate,
        sortOrder,
        setSortOrder,
        addPost,
        updatePost,
        deletePost,
        toggleTaskStatus,
        togglePin,
        toggleLike,
        addComment,
        deleteComment,
        addLink,
        deleteLink,
        updateUser,
        resetData,
        importBackup,
        editingPost,
        setEditingPost,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isBackupModalOpen,
        setIsBackupModalOpen,
        isQuickCreateOpen,
        setIsQuickCreateOpen,
        isLinkModalOpen,
        setIsLinkModalOpen,
        isITPlaybookOpen,
        setIsITPlaybookOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        currentUser,
        isLoggedIn: Boolean(currentUser),
        login,
        register,
        logout,
        lightboxGallery,
        openLightbox,
        closeLightbox,
        nextLightboxImage,
        prevLightboxImage,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
