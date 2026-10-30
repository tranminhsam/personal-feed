export const DEFAULT_USER = {
  name: "Nguyễn Văn Hùng",
  role: "Full-stack Developer & IT Specialist",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  bio: "Quản trị hệ thống, lập trình web & xử lý sự cố IT (Phần cứng, phần mềm, mạng). Tối ưu hóa quy trình làm việc.",
  location: "Hà Nội, Việt Nam",
  website: "https://github.com",
};

export const IT_CATEGORIES = {
  network: { id: 'network', label: 'Mạng & Internet', icon: 'Wifi', color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800' },
  hardware: { id: 'hardware', label: 'Phần cứng & Thiết bị', icon: 'Cpu', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' },
  software: { id: 'software', label: 'Phần mềm & Ứng dụng', icon: 'Package', color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-800' },
  os_system: { id: 'os_system', label: 'Windows & Hệ điều hành', icon: 'Terminal', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800' },
};

// Pre-defined emergency CMD cheatsheet
export const EMERGENCY_CMD_COMMANDS = [
  {
    category: 'network',
    title: 'Khôi phục toàn bộ ngăn xếp mạng (Reset TCP/IP & Winsock)',
    commands: [
      { cmd: 'netsh winsock reset', desc: 'Đặt lại danh mục Winsock về mặc định' },
      { cmd: 'netsh int ip reset', desc: 'Đặt lại toàn bộ ngăn xếp giao thức TCP/IP' },
      { cmd: 'ipconfig /flushdns', desc: 'Xóa sạch bộ nhớ đệm DNS bị nghẽn hoặc sai IP' },
      { cmd: 'ipconfig /release && ipconfig /renew', desc: 'Giải phóng và xin cấp lại IP từ Router DHCP' },
    ]
  },
  {
    category: 'os_system',
    title: 'Kiểm tra & tự động sửa file hệ thống Windows bị hỏng',
    commands: [
      { cmd: 'sfc /scannow', desc: 'Quét toàn bộ tệp hệ thống và tự phục hồi file lỗi' },
      { cmd: 'DISM /Online /Cleanup-Image /RestoreHealth', desc: 'Sửa chữa kho ảnh Windows Component Store qua Windows Update' },
    ]
  },
  {
    category: 'hardware',
    title: 'Kiểm tra sức khỏe ổ cứng & sửa lỗi Bad Sector',
    commands: [
      { cmd: 'wmic diskdrive get status,model', desc: 'Kiểm tra tình trạng SMART của toàn bộ ổ cứng' },
      { cmd: 'chkdsk C: /f /r', desc: 'Quét tìm và sửa lỗi cấu trúc tập tin & định vị bad sector' },
    ]
  },
  {
    category: 'software',
    title: 'Tìm tiến trình chiếm cổng mạng (Port Conflict) & Đóng tiến trình',
    commands: [
      { cmd: 'netstat -ano | findstr :3000', desc: 'Tìm PID của ứng dụng đang chiếm cổng 3000' },
      { cmd: 'taskkill /PID <PID_NUMBER> /F', desc: 'Cưỡng chế đóng tiến trình xung đột cổng' },
    ]
  }
];

export const INITIAL_LINKS = [
  {
    id: "link-1",
    title: "GitHub - Nền tảng lưu trữ mã nguồn & CI/CD",
    url: "https://github.com",
    category: "dev_tools",
    tags: ["git", "code", "cicd"],
    description: "Kho lưu trữ source code chính cho tất cả các dự án cá nhân.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "link-2",
    title: "Tailwind CSS Documentation",
    url: "https://tailwindcss.com/docs",
    category: "docs",
    tags: ["css", "frontend", "ui"],
    description: "Tài liệu tra cứu các utility classes của Tailwind CSS v3 & v4.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "link-3",
    title: "React Official Docs & Learn",
    url: "https://react.dev",
    category: "docs",
    tags: ["react", "frontend"],
    description: "Tài liệu chính thức về React Hooks, Suspense và Component Lifecycle.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: "link-4",
    title: "Vite Next Generation Frontend Tooling",
    url: "https://vitejs.dev",
    category: "dev_tools",
    tags: ["vite", "build-tool"],
    description: "Bộ công cụ bundler siêu tốc cho web app hiện đại.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: "link-5",
    title: "TechCrunch - Tin tức công nghệ thế giới",
    url: "https://techcrunch.com",
    category: "news",
    tags: ["tech", "startup"],
    description: "Cập nhật tin tức công nghệ, đầu tư và startup hàng ngày.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
  {
    id: "link-6",
    title: "YouTube - Kênh học Lập Trình & IT Helpdesk",
    url: "https://youtube.com",
    category: "media",
    tags: ["video", "study"],
    description: "Xem các video hướng dẫn xây dựng dự án và xử lý sự cố mạng.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  }
];

export const INITIAL_POSTS = [
  {
    id: "post-it-1",
    type: "troubleshoot",
    itCategory: "network", // network, hardware, software, os_system
    errorTitle: "Lỗi 'DNS_PROBE_FINISHED_NO_INTERNET' hoặc không tải được trang web dù đã kết nối Wi-Fi",
    errorCode: "DNS_PROBE_FINISHED_NXDOMAIN / ERR_NAME_NOT_RESOLVED",
    cause: "Bộ nhớ đệm DNS máy tính bị phân mảnh hoặc lỗi kết nối đến máy chủ DNS của nhà mạng ISP, xung đột cấu hình IP tĩnh.",
    solution: "1. Mở CMD với quyền Administrator (Run as Administrator).\n2. Lần lượt chạy lệnh xóa cache DNS và đặt lại TCP/IP stack.\n3. Đổi DNS máy tính sang Google DNS (8.8.8.8 / 8.8.4.4) hoặc Cloudflare (1.1.1.1).\n4. Khởi động lại Router nếu vẫn chưa nhận IP mới.",
    commands: [
      { cmd: "ipconfig /flushdns", desc: "Xóa sạch bộ nhớ đệm DNS bị nghẽn" },
      { cmd: "netsh winsock reset", desc: "Đặt lại giao thức socket mạng về trạng thái gốc" },
      { cmd: "netsh int ip reset", desc: "Reset toàn bộ thiết lập cấu hình IP và card mạng" },
      { cmd: "ipconfig /renew", desc: "Yêu cầu Router cấp dải IP mới" }
    ],
    severity: "high", // low, medium, high
    content: "Đã khắc phục thành công sự cố rớt mạng hàng loạt tại văn phòng tầng 2 do xung đột DNS server.",
    tags: ["network", "dns", "cmd", "wifi", "it-support"],
    pinned: true,
    images: [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80"
    ],
    likes: 14,
    likedByMe: true,
    comments: [
      {
        id: "comm-it-1",
        author: "Vũ Tuấn Kiệt (IT Helpdesk)",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        content: "Lệnh netsh winsock reset cực kỳ hiệu nghiệm cho các máy Windows bị mất mạng sau khi update!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "post-it-2",
    type: "troubleshoot",
    itCategory: "os_system",
    errorTitle: "Lỗi màn hình xanh (BSOD) 'CRITICAL_PROCESS_DIED' và file hệ thống Windows bị corrupt",
    errorCode: "0x000000EF / 0x80070002",
    cause: "Tệp tin hệ thống kernel bị lỗi sau khi tắt máy đột ngột do mất điện, hoặc driver phần cứng không tương thích.",
    solution: "1. Khởi động Windows vào chế độ Safe Mode hoặc mở Command Prompt bằng quyền Quản trị.\n2. Chạy lệnh SFC để dò tìm và thay thế file hệ thống bị hỏng.\n3. Nếu SFC báo lỗi không thể sửa, dùng công cụ DISM tải bản vá sạch từ Microsoft Update.\n4. Khởi động lại máy kiểm tra kết quả.",
    commands: [
      { cmd: "sfc /scannow", desc: "Quét và tự động thay thế file hệ thống bị lỗi bằng bản sao sạch" },
      { cmd: "DISM /Online /Cleanup-Image /CheckHealth", desc: "Kiểm tra xem hệ điều hành có bị ghi nhận hỏng hóc không" },
      { cmd: "DISM /Online /Cleanup-Image /RestoreHealth", desc: "Tự động tải và sửa chữa các file bị hỏng từ Microsoft Servers" }
    ],
    severity: "high",
    content: "Quy trình chuẩn xử lý các ca máy bị đơ màn hình xanh hoặc crash liên tục tại công ty.",
    tags: ["bsod", "windows", "sfc", "dism", "system-repair"],
    pinned: false,
    images: [],
    likes: 9,
    likedByMe: false,
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "post-it-3",
    type: "troubleshoot",
    itCategory: "software",
    errorTitle: "Lỗi xung đột cổng mạng 'Port 3000 / 8080 is already in use'",
    errorCode: "EADDRINUSE: address already in use :::3000",
    cause: "Tiến trình Node.js hoặc phần mềm khác chưa được tắt triệt để và đang chiếm dụng port mạng ngầm.",
    solution: "1. Dùng lệnh netstat lọc cổng để tìm Process ID (PID) đang treo.\n2. Dùng lệnh taskkill để đóng cưỡng chế tiến trình đó mà không cần khởi động lại máy tính.",
    commands: [
      { cmd: "netstat -ano | findstr :3000", desc: "Tìm số PID đang chiếm cổng 3000 ở cột cuối cùng" },
      { cmd: "taskkill /PID <PID_NUMBER> /F", desc: "Đóng ngay lập tức tiến trình có PID tương ứng" }
    ],
    severity: "medium",
    content: "Lỗi kinh điển khi dev web app trên Windows mà terminal bị crash ngầm.",
    tags: ["port-conflict", "nodejs", "taskkill", "cmd", "developer"],
    pinned: false,
    images: [],
    likes: 11,
    likedByMe: true,
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "post-1",
    type: "note",
    title: "Kiến thức nền tảng Web: Front-end, Back-end, SEO & Bảo mật",
    content: "Tóm tắt từ buổi thảo luận kiến trúc web:\n1. Front-end: Phần nổi của tảng băng (UI/UX, React, Tailwind CSS, tối ưu tương tác).\n2. Back-end: Xử lý nghiệp vụ, database (PostgreSQL/Node.js), API RESTful và xác thực JWT.\n3. Chuẩn SEO: SSR/SSG, Core Web Vitals, thẻ Heading phân cấp & Schema Markup.\n4. Bảo mật: HTTPS bắt buộc, chống SQL Injection bằng Prepared Statement/ORM, escape chống XSS và rate-limiting.",
    tags: ["kien-thuc", "web-dev", "seo", "security"],
    pinned: true,
    images: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80"
    ],
    likes: 5,
    likedByMe: true,
    comments: [
      {
        id: "comm-1",
        author: "Trần Minh Đức",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        content: "Ghi chú rất đầy đủ và trực quan! Nhớ chú ý thêm việc cấu hình CORS chặt chẽ giữa Front-end và Back-end nhé.",
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "post-2",
    type: "task",
    content: "Thiết kế & hoàn thiện toàn bộ giao diện Front-end cho Personal Dashboard dạng dòng thời gian Facebook",
    status: "doing",
    priority: "high",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    tags: ["frontend", "react", "dashboard", "ui"],
    pinned: false,
    images: [],
    likes: 8,
    likedByMe: false,
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "post-3",
    type: "event",
    content: "Tham gia buổi Workshop trực tuyến: 'Xây dựng Web API chuẩn bảo mật và tối ưu hiệu năng cao với Node.js & Docker'",
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 60 * 4).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 60 * 6).toISOString(),
    location: "Google Meet (meet.google.com/xyz-tech-share)",
    tags: ["workshop", "backend", "event"],
    pinned: false,
    images: [],
    likes: 3,
    likedByMe: false,
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  }
];
