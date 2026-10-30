import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  X, 
  Terminal, 
  Copy, 
  Check, 
  Search, 
  Wrench, 
  Wifi, 
  Cpu, 
  Package, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  PlusCircle,
  FileCode2,
  ShieldAlert
} from 'lucide-react';
import { IT_CATEGORIES, EMERGENCY_CMD_COMMANDS } from '../../constants/initialData';

export default function ITPlaybookModal() {
  const { 
    isITPlaybookOpen, 
    setIsITPlaybookOpen, 
    posts, 
    setIsQuickCreateOpen,
    setActiveFilter
  } = useDashboard();

  const [activeTab, setActiveTab] = useState('all'); // all, network, hardware, software, os_system
  const [search, setSearch] = useState('');
  const [copiedCmd, setCopiedCmd] = useState(null);

  if (!isITPlaybookOpen) return null;

  const handleCopy = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const categoryIcons = {
    network: Wifi,
    hardware: Cpu,
    software: Package,
    os_system: Terminal,
  };

  // Filter emergency commands
  const filteredEmergencyCmds = EMERGENCY_CMD_COMMANDS.filter((group) => {
    if (activeTab !== 'all' && group.category !== activeTab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = group.title.toLowerCase().includes(q);
      const matchCmd = group.commands.some(c => c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
      if (!matchTitle && !matchCmd) return false;
    }
    return true;
  });

  // Extract all troubleshoot posts from user
  const troubleshootPosts = posts.filter((p) => p.type === 'troubleshoot').filter((p) => {
    if (activeTab !== 'all' && p.itCategory !== activeTab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = p.errorTitle?.toLowerCase().includes(q);
      const matchCode = p.errorCode?.toLowerCase().includes(q);
      const matchSol = p.solution?.toLowerCase().includes(q);
      const matchCmd = p.commands?.some(c => c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
      if (!matchTitle && !matchCode && !matchSol && !matchCmd) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                Sổ Tay Xử Lý Sự Cố IT & Lệnh CMD
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold">
                  Phần cứng • Phần mềm • Mạng
                </span>
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Tra cứu nhanh mã lỗi, cách sửa chữa và các câu lệnh Command Prompt / PowerShell
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsITPlaybookOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search & Category tabs */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-800/30 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm mã lỗi (DNS_PROBE, BSOD, 0x800...), câu lệnh (flushdns, chkdsk, sfc)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500 text-gray-900 dark:text-white placeholder:text-gray-400"
              />
            </div>

            <button
              onClick={() => {
                setIsITPlaybookOpen(false);
                setIsQuickCreateOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Ghi chú lỗi mới</span>
            </button>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto min-w-max pt-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Tất cả sự cố ({troubleshootPosts.length + filteredEmergencyCmds.length})
            </button>

            {Object.entries(IT_CATEGORIES).map(([key, cat]) => {
              const Icon = categoryIcons[cat.id] || Terminal;
              const count = troubleshootPosts.filter((p) => p.itCategory === cat.id).length;
              const isSelected = activeTab === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 rounded-full ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body: Emergency Commands Cheat-sheet & Troubleshoot Posts */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Section 1: Emergency Terminal Cheatsheet */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                <FileCode2 className="w-4 h-4 text-cyan-500" />
                <span>Lệnh CMD & PowerShell Cứu Hộ Nhanh</span>
              </div>
              <span className="text-[11px] text-gray-400">Bấm nút sao chép để dán vào Command Prompt</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredEmergencyCmds.map((group, idx) => (
                <div 
                  key={idx}
                  className="bg-gray-900 dark:bg-black rounded-xl p-3 border border-gray-800 shadow-sm flex flex-col justify-between"
                >
                  <div className="mb-2">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                      {group.title}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {group.commands.map((c, cIdx) => {
                      const isCopied = copiedCmd === c.cmd;
                      return (
                        <div
                          key={cIdx}
                          className="bg-gray-950 p-2 rounded-lg border border-gray-800/70 flex items-start justify-between gap-2 group hover:border-cyan-500/50 transition-colors"
                        >
                          <div className="min-w-0">
                            <code className="text-xs text-emerald-400 font-mono font-semibold block truncate">
                              {c.cmd}
                            </code>
                            <span className="text-[10px] text-gray-400 block mt-0.5 line-clamp-1">
                              {c.desc}
                            </span>
                          </div>

                          <button
                            onClick={() => handleCopy(c.cmd)}
                            className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors shrink-0"
                            title="Sao chép lệnh"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: User's Troubleshoot Articles & Case Studies */}
          <div>
            <div className="flex items-center justify-between mb-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                <Wrench className="w-4 h-4 text-amber-500" />
                <span>Nhật Ký Các Ca Sửa Lỗi Chi Tiết ({troubleshootPosts.length})</span>
              </div>
              <button
                onClick={() => {
                  setActiveFilter('troubleshoot');
                  setIsITPlaybookOpen(false);
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Xem trên Dòng thời gian →
              </button>
            </div>

            {troubleshootPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                <ShieldAlert className="w-8 h-8 mx-auto mb-1 opacity-50" />
                <p className="text-xs font-semibold">Chưa có bài viết sửa lỗi nào phù hợp tiêu chí</p>
              </div>
            ) : (
              <div className="space-y-3">
                {troubleshootPosts.map((post) => {
                  const catConfig = IT_CATEGORIES[post.itCategory] || IT_CATEGORIES.os_system;
                  const Icon = categoryIcons[post.itCategory] || Terminal;

                  return (
                    <div
                      key={post.id}
                      className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catConfig.color} flex items-center gap-1`}>
                              <Icon className="w-3 h-3" />
                              <span>{catConfig.label}</span>
                            </span>

                            {post.errorCode && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-900">
                                Mã lỗi: {post.errorCode}
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                            {post.errorTitle || post.content}
                          </h4>
                        </div>
                      </div>

                      {post.cause && (
                        <div className="text-xs text-gray-600 dark:text-gray-300 mb-2 bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200/50 dark:border-amber-900/40">
                          <strong className="text-amber-700 dark:text-amber-400">Nguyên nhân: </strong>
                          {post.cause}
                        </div>
                      )}

                      {post.solution && (
                        <div className="text-xs text-gray-700 dark:text-gray-200 mb-3 whitespace-pre-line leading-relaxed">
                          <strong className="text-blue-600 dark:text-blue-400 block mb-0.5">Cách khắc phục:</strong>
                          {post.solution}
                        </div>
                      )}

                      {/* Commands snippet */}
                      {Array.isArray(post.commands) && post.commands.length > 0 && (
                        <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800 space-y-1.5 font-mono">
                          {post.commands.map((c, i) => {
                            const isCopied = copiedCmd === c.cmd;
                            return (
                              <div key={i} className="flex items-center justify-between gap-2 text-xs">
                                <div className="min-w-0">
                                  <span className="text-emerald-400 font-bold">$ {c.cmd}</span>
                                  {c.desc && <span className="text-gray-500 text-[10px] block font-sans"># {c.desc}</span>}
                                </div>
                                <button
                                  onClick={() => handleCopy(c.cmd)}
                                  className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
                                  title="Sao chép lệnh"
                                >
                                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Tổng số: {troubleshootPosts.length} ghi chú sự cố IT</span>
          <button
            onClick={() => setIsITPlaybookOpen(false)}
            className="px-4 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 rounded-xl"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
