# Hướng Dẫn Triển Khai Hosting & Môi Trường Deploy (Personal Dashboard)

Hệ thống **Personal Dashboard** được đóng gói theo kiến trúc Full-Stack hiện đại:
- **Frontend**: React 18 (Vite SPA) được biên dịch tối ưu vào thư mục `dist/`.
- **Backend & Database**: Node.js Express server phục vụ cả API (`/api/...`) lẫn giao diện tĩnh (`/`), sử dụng cơ sở dữ liệu **SQLite** lưu tại `data/dashboard.sqlite`.

Vì toàn bộ ứng dụng có thể chạy gói gọn trong **1 cổng duy nhất (Port 5000)**, việc triển khai trở nên cực kỳ tinh gọn, không gặp lỗi CORS và chi phí vận hành bằng 0.

---

## 🎯 Bảng So Sánh Các Phương Án Triển Khai

| Phương Án | Môi Trường | Chi Phí | Độ Khó | Độ Bền Vững Dữ Liệu |
| :--- | :--- | :--- | :--- | :--- |
| **1. Render.com / Railway** | Cloud PaaS | **Miễn phí (Free Tier)** | Rất dễ (1 click) | Rất cao (Persistent Disk) |
| **2. Docker & Compose** | VPS / NAS / Home Server | Chi phí máy chủ sẵn có | Dễ (1 lệnh) | Tuyệt đối (Volume mapping) |
| **3. VPS Linux (Ubuntu)** | Nginx + PM2 | $3 - $5 / tháng | Trung bình | Tự quản lý toàn quyền |
| **4. Fly.io** | Edge Container | Miễn phí | Dễ (CLI) | Rất cao (1GB Mount Volume) |

---

## 🚀 Phương Án 1: Triển Khai Miễn Phí Trên Render.com (Khuyên Dùng)

Render cung cấp hosting miễn phí có hỗ trợ **Persistent Disk** (Ổ đĩa gắn ngoài lưu file SQLite vĩnh viễn):

### Các bước thực hiện:
1. Đẩy mã nguồn dự án lên GitHub của bạn:
   ```bash
   git init
   git add .
   git commit -m "Init Personal Dashboard Fullstack"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan>/personal-dashboard.git
   git push -u origin main
   ```
2. Truy cập [Render.com](https://render.com), đăng nhập bằng tài khoản GitHub.
3. Chọn **New +** -> **Web Service**.
4. Chọn repository `personal-dashboard` vừa đẩy lên.
5. Cấu hình các thông số:
   - **Name**: `my-personal-dashboard`
   - **Region**: `Singapore` (để tốc độ tải từ VN nhanh nhất)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/server.js`
   - **Plan**: `Free`
6. **Quan trọng (Gắn ổ đĩa lưu SQLite)**:
   - Cuộn xuống mục **Advanced** -> Chọn **Add Disk**.
   - **Name**: `dashboard-data`
   - **Mount Path**: `/app/data` (hoặc `data`)
   - **Size**: `1 GB` (Miễn phí)
7. Bấm **Create Web Service**. Render sẽ tự động build và cấp phát tên miền HTTPS miễn phí (ví dụ: `https://my-personal-dashboard.onrender.com`).

*(Dự án đã có sẵn file `render.yaml`, bạn cũng có thể chọn hình thức **Blueprint** để tự động cấu hình).*

---

## 🐳 Phương Án 2: Triển Khai Bằng Docker & Docker Compose (Cho VPS / NAS / Home Server)

Dự án đã có sẵn [`Dockerfile`](file:///d:/Project/Personal%20Dashboard/Dockerfile) (Multi-stage build siêu nhẹ ~150MB) và [`docker-compose.yml`](file:///d:/Project/Personal%20Dashboard/docker-compose.yml).

### Các bước thực hiện:
1. Cài đặt Docker & Docker Compose trên máy chủ của bạn.
2. Sao chép thư mục dự án lên máy chủ.
3. Chạy 1 lệnh duy nhất để build và khởi động:
   ```bash
   docker compose up -d --build
   ```
4. Kiểm tra trạng thái container:
   ```bash
   docker compose ps
   # Xem log: docker compose logs -f
   ```
5. Ứng dụng sẽ chạy tại cổng `http://<IP_MAY_CHU>:5000`.
6. Toàn bộ cơ sở dữ liệu SQLite được mount tự động ra thư mục `./data` trên máy chủ, đảm bảo **không bao giờ bị mất dữ liệu** khi restart hoặc cập nhật code container mới.

---

## 🐧 Phương Án 3: Triển Khai Trên VPS Linux (Ubuntu / Debian) với Nginx & PM2

### Bước 1: Cài đặt Node.js v22/v24 & PM2
```bash
# Cài đặt Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt PM2 toàn cục
sudo npm install -g pm2
```

### Bước 2: Build và khởi chạy ứng dụng
```bash
cd /var/www/personal-dashboard
npm install
npm run build

# Khởi chạy bằng PM2 thông qua file ecosystem có sẵn
pm2 start ecosystem.config.cjs

# Thiết lập PM2 tự khởi động cùng hệ thống khi reboot
pm2 startup
pm2 save
```

### Bước 3: Cấu hình Nginx Reverse Proxy & Tên miền
1. Cài đặt Nginx:
   ```bash
   sudo apt install nginx -y
   ```
2. Copy cấu hình từ file [`nginx.conf`](file:///d:/Project/Personal%20Dashboard/nginx.conf) vào thư mục Nginx:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/personal-dashboard
   sudo ln -s /etc/nginx/sites-available/personal-dashboard /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```
3. Cài đặt chứng chỉ SSL HTTPS miễn phí với Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

---

## ⚡ Phương Án 4: Triển Khai Trên Fly.io

Dự án đã cấu hình sẵn [`fly.toml`](file:///d:/Project/Personal%20Dashboard/fly.toml):
```bash
# Cài đặt Fly CLI
curl -L https://fly.io/install.sh | sh

# Đăng nhập
fly auth login

# Khởi tạo và tạo ổ đĩa gắn ngoài
fly launch
fly volumes create dashboard_data --region sin --size 1

# Triển khai
fly deploy
```

---

## 💾 Chiến Lược Sao Lưu Dữ Liệu Định Kỳ (Backup Strategy)

1. **Sao lưu tự động qua Web UI**:
   - Bấm vào biểu tượng **"Sao lưu & Đồng bộ"** trên thanh Header của ứng dụng bất kỳ lúc nào để tải về file `backup_sqlite_YYYY-MM-DD.json`.
2. **Sao lưu file SQLite vật lý trên Server (Cronjob Linux)**:
   - Thêm dòng sau vào `crontab -e` để tự động copy file database mỗi ngày vào lúc 02:00 sáng:
   ```bash
   0 2 * * * cp /path/to/data/dashboard.sqlite /path/to/backups/dashboard_$(date +\%F).sqlite
   ```
