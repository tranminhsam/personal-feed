# Personal Dashboard - Full-Stack (React 18 + Node.js Express + SQLite)

Hệ thống Website cá nhân Full-stack quản lý công việc (Tasks), ghi chú (Notes), sự kiện (Events), kho ảnh, bookmarks và **Sổ tay xử lý sự cố IT (Phần cứng, phần mềm, mạng, câu lệnh CMD sửa lỗi)** theo mô hình **dòng thời gian trực quan phong cách Facebook**.

---

## 🏛️ Kiến Trúc Hệ Thống (Full-Stack Architecture)

```
D:\Project\Personal Dashboard\
├── server\                     # BACK-END (Node.js + Express + SQLite)
│   ├── database\
│   │   ├── db.js               # Kết nối SQLite Native (WAL mode, Prepared Statements)
│   │   └── seed.js             # Tự động nạp dữ liệu mẫu ban đầu (Auto-seeding)
│   ├── controllers\
│   │   ├── postController.js   # Xử lý CRUD dòng thời gian, Thích (Like) & Bình luận
│   │   ├── linkController.js   # Xử lý Kho liên kết & Tự động phân loại URL
│   │   ├── userController.js   # Quản lý hồ sơ cá nhân
│   │   ├── statsController.js  # Thống kê tiến độ & Lịch mini
│   │   └── backupController.js # Sao lưu (Export) & Khôi phục (Import) dữ liệu
│   ├── routes\                 # Định tuyến API RESTful
│   └── server.js               # Khởi chạy Express Server (Port 5000, 50MB payload cho ảnh)
├── src\                        # FRONT-END (React 18 + Vite 6 + Tailwind CSS)
│   ├── components\             # Header, Sidebars, FeedCards, Modals, Playbooks
│   ├── context\                # State tập trung & Dual-Mode (Online SQLite / Offline LocalStorage)
│   ├── services\
│   │   ├── api.js              # HTTP Client kết nối trực tiếp đến Backend Express
│   │   └── storage.js          # Bộ nhớ đệm & cơ chế fallback LocalStorage dự phòng
│   └── utils\                  # linkClassifier.js, formatters.js
├── data\                       # Nơi lưu trữ file Database SQLite (dashboard.sqlite)
└── package.json                # Quản lý dependency & script chạy đồng thời full-stack
```

---

## 📡 Danh Sách RESTful API Endpoints (Back-End)

| Phương thức | Endpoint | Chức năng | Tham số / Ghi chú |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Kiểm tra trạng thái máy chủ & CSDL SQLite | Trả về `status: healthy` |
| `GET` | `/api/posts` | Lấy danh sách bài viết trên dòng thời gian | Lọc theo `type`, `tag`, `search`, `pinned`, `sort` |
| `GET` | `/api/posts/:id` | Xem chi tiết 1 bài viết | `:id` của bài viết |
| `POST` | `/api/posts` | Tạo bài viết mới | Task, Note, Event, Status, Troubleshoot (Sửa lỗi IT) |
| `PUT` | `/api/posts/:id` | Cập nhật nội dung / trạng thái | Hỗ trợ cập nhật nhanh Todo -> Doing -> Done |
| `DELETE` | `/api/posts/:id` | Xóa bài viết khỏi cơ sở dữ liệu | Xóa hoàn toàn khỏi SQLite |
| `POST` | `/api/posts/:id/like` | Thả tim / Bỏ thích bài viết | Tăng/giảm biến đếm lượt thích |
| `POST` | `/api/posts/:id/comments` | Đăng bình luận mới vào bài viết | Kèm tên, avatar, nội dung, ngày giờ |
| `DELETE` | `/api/posts/:id/comments/:cId`| Xóa một bình luận cụ thể | Xóa theo ID bình luận |
| `GET` | `/api/links` | Lấy danh sách Bookmarks | Lọc theo `category` và `search` |
| `POST` | `/api/links` | Lưu trữ liên kết mới | Tự động nhận diện nhóm theo domain |
| `DELETE` | `/api/links/:id` | Xóa liên kết khỏi kho | Xóa bookmark |
| `GET` | `/api/user` | Lấy thông tin hồ sơ người dùng | Avatar, ảnh bìa, bio, role, location |
| `PUT` | `/api/user` | Cập nhật hồ sơ cá nhân | Lưu ảnh bìa/avatar base64 vào SQLite |
| `GET` | `/api/stats` | Thống kê số liệu bảng tin | Tổng task, hoàn thành, sự kiện, lỗi IT |
| `GET` | `/api/stats/calendar` | Lấy các mốc deadline / sự kiện theo tháng | Đổ dữ liệu lên Mini Calendar |
| `GET` | `/api/backup/export` | Tải về file JSON sao lưu toàn bộ CSDL | Dump đầy đủ Users, Posts, Links |
| `POST` | `/api/backup/restore` | Khôi phục toàn bộ CSDL từ file JSON | Phục hồi toàn vẹn dữ liệu |
| `POST` | `/api/backup/reset` | Đặt lại CSDL về dữ liệu mẫu ban đầu | Khôi phục demo sạch sẽ |

---

## 🗄️ Thiết Kế Cơ Sở Dữ Liệu SQLite (Native node:sqlite)

Dự án sử dụng module **`node:sqlite`** tích hợp sẵn của Node.js v24 (chế độ **WAL Mode**):
- **Không cần cài đặt C++ Build Tools (node-gyp)**, chạy được ngay lập tức trên mọi máy tính.
- **Bảo mật tuyệt đối**: 100% các câu truy vấn sử dụng **Prepared Statements (`db.prepare(...)`)**, ngăn chặn triệt để lỗ hổng **SQL Injection**.
- File cơ sở dữ liệu được lưu cục bộ tại: `data/dashboard.sqlite`.

---

## 🚀 Hướng Dẫn Khởi Chạy (Chạy Cả 2 Cùng Lúc)

### 1. Khởi chạy toàn bộ hệ thống (Full-stack Server + Client)
Chỉ với 1 câu lệnh duy nhất, hệ thống sẽ tự động khởi chạy cả **Backend Express (Port 5000)** và **Frontend Vite (Port 3000)**:

```bash
npm run dev
# Hoặc: npm start
```

- **Frontend**: `http://localhost:3000` (Có sẵn Proxy chuyển tiếp `/api` đến Backend)
- **Backend**: `http://localhost:5000`

### 2. Các lệnh chạy riêng lẻ (Tùy chọn)
- Chỉ chạy Backend Server: `npm run dev:server` (hoặc `npm run server`)
- Chỉ chạy Frontend: `npm run dev:frontend`
- Đóng gói ứng dụng: `npm run build`
