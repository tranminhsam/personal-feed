# Hướng Dẫn Đẩy Code Lên GitHub (Step-by-Step)

Tài liệu này hướng dẫn chi tiết cách đưa mã nguồn dự án **Personal Dashboard** lên tài khoản **GitHub** của bạn từ đầu đến cuối một cách bảo mật và an toàn.

---

## 📋 Bước 1: Tạo Repository mới trên GitHub

1. Truy cập vào trang tạo repository mới của GitHub: [https://github.com/new](https://github.com/new)
2. Điền các thông tin:
   - **Repository name**: `personal-dashboard` (hoặc tên tùy bạn thích)
   - **Description**: `Personal Timeline Dashboard with IT Knowledge Base & SQLite`
   - **Visibility**: Chọn **Private** (khuyến nghị nếu bạn muốn bảo mật ghi chú cá nhân) hoặc **Public**.
   - ⚠️ **LƯU Ý QUAN TRỌNG**: **KHÔNG** tích chọn bất kỳ ô nào sau đây (vì dự án của bạn đã có sẵn mã nguồn):
     - *Add a README file* (Bỏ chọn)
     - *Add .gitignore* (Bỏ chọn)
     - *Choose a license* (Bỏ chọn)
3. Nhấn nút xanh **Create repository**.
4. GitHub sẽ chuyển bạn sang trang có hiển thị đường dẫn repository, dạng:
   - HTTPS: `https://github.com/<tai-khoan-cua-ban>/personal-dashboard.git`

---

## 💻 Bước 2: Cấu hình thông tin Git trên máy tính (nếu chưa cấu hình)

Mở **Terminal** (hoặc PowerShell tại thư mục dự án `d:\Project\Personal Dashboard`) và chạy:

```bash
git config --global user.name "Tên Của Bạn"
git config --global user.email "email_cua_ban@example.com"
```

---

## 🚀 Bước 3: Thêm mã nguồn và tạo commit đầu tiên

Dự án đã được khởi tạo sẵn git và file `.gitignore` an toàn (tự động loại trừ mật khẩu `.env`, thư mục `node_modules/`, và cơ sở dữ liệu `data/*.sqlite`).

Chạy lần lượt các lệnh sau trong PowerShell/Terminal:

```bash
# 1. Kiểm tra trạng thái các file
git status

# 2. Thêm toàn bộ mã nguồn vào staging
git add .

# 3. Tạo commit đầu tiên
git commit -m "feat: complete personal dashboard with auth, cloud backup & sqlite backend"
```

---

## 🔗 Bước 4: Liên kết với GitHub và Đẩy Code (Push)

Thay `<tai-khoan-cua-ban>` bằng username GitHub của bạn:

```bash
# 1. Đặt nhánh chính là main
git branch -M main

# 2. Thêm remote origin trỏ đến repository GitHub vừa tạo
git remote add origin https://github.com/<tai-khoan-cua-ban>/personal-dashboard.git

# 3. Đẩy code lên GitHub
git push -u origin main
```

> **Mẹo về Mật khẩu GitHub khi push**:  
> Từ năm 2021, GitHub không cho phép nhập mật khẩu thông thường khi chạy qua terminal. Khi được hỏi Password:
> 1. Tạo một **Personal Access Token (classic)** tại: `https://github.com/settings/tokens`
> 2. Chọn quyền `repo`.
> 3. Dán mã token đó làm mật khẩu trong terminal là thành công.

---

## 🔄 Bước 5: Cập nhật code lên GitHub trong các lần làm việc sau

Mỗi khi bạn sửa đổi hoặc viết thêm chức năng mới, chỉ cần chạy 3 lệnh đơn giản:

```bash
git add .
git commit -m "mô tả thay đổi vừa thực hiện"
git push
```

---

## 🛡️ Lưu ý An toàn Dữ liệu (Best Practices)
- File `.gitignore` của dự án đã bảo vệ sẵn các file nhạy cảm:
  - `data/*.sqlite`: Cơ sở dữ liệu chứa dữ liệu riêng tư của bạn không bao giờ bị lộ lên GitHub.
  - `.env`: Các biến môi trường nhạy cảm như Telegram Token, JWT Secret không bị đẩy lên repo.
- Khi triển khai lên server (Docker, Render, VPS), hãy cấu hình biến môi trường trực tiếp trên bảng điều khiển của hosting.
