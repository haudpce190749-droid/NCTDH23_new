# EduJob - Cổng Thông Tin Việc Làm Sinh Viên (NCTDH23)

![EduJob Platform](https://img.shields.io/badge/Platform-Student%20Job%20Marketplace-sky)
![Tech Stack](https://img.shields.io/badge/Tech-Node.js%20%7C%20Express%20%7C%20React%20%7C%20SQLite%20%7C%20Tailwind-blue)
![License](https://img.shields.io/badge/License-MIT-green)

EduJob là nền tảng tuyển dụng và kết nối việc làm số 1 dành riêng cho sinh viên và cựu sinh viên các trường đại học tại Việt Nam. Hệ thống kết nối ứng viên trẻ với các tập đoàn công nghệ, doanh nghiệp lớn (FPT Software, VNG, Viettel Digital, Shopee, MoMo...) với giao diện hiện đại, trực quan, hỗ trợ quy trình nộp ứng tuyển 1-click và quản lý hồ sơ theo thời gian thực.

---

## 🚀 Tính Năng Chính (Implemented Features)

### 🎓 Dành Cho Sinh Viên / Người Tìm Việc
- **Đăng ký / Đăng nhập**: Phân quyền tài khoản sinh viên với JWT Auth bảo mật.
- **Hồ sơ cá nhân & CV**:
  - Tự động tính tỷ lệ hoàn thiện hồ sơ (`Completion %`).
  - Quản lý Học vấn (Đại học, Ngành, GPA), Kỹ năng, Kinh nghiệm làm việc, Dự án cá nhân (Project portfolio).
  - Tải lên, thay thế, xem trực tiếp và tải về tệp CV bản mềm (PDF, DOC, DOCX).
- **Tìm kiếm & Lọc việc làm**:
  - Lọc đa tiêu chí: Từ khóa, Địa điểm (Hà Nội, TP.HCM, Đà Nẵng...), Ngành nghề, Hình thức (Full-time, Part-time, Internship, Freelance), Mức lương, Môi trường (Tại văn phòng, Remote, Hybrid).
  - Sắp xếp theo ngày mới nhất, lương cao nhất.
- **Ứng tuyển & Theo dõi**:
  - Nộp ứng tuyển 1-click lựa chọn giữa CV có sẵn trong hồ sơ hoặc đính kèm CV mới.
  - Điền thư giới thiệu (Cover Letter) & link Portfolio.
  - Bảng theo dõi tiến độ ứng tuyển realtime (`Đã nộp`, `Đang xem xét`, `Phù hợp`, `Mời phỏng vấn`, `Trúng tuyển`, `Từ chối`).
- **Lưu công việc**: Đánh dấu / bỏ lưu các vị trí yêu thích.

### 🏢 Dành Cho Nhà Tuyển Dụng / Doanh Nghiệp
- **Đăng ký / Quản lý Doanh nghiệp**:
  - Tạo hồ sơ công ty, tải lên logo đại diện, địa chỉ, website, quy mô nhân sự.
- **Quản lý Tin tuyển dụng**:
  - Đăng tin tuyển dụng mới với đầy đủ thông tin: Tiêu đề, Mức lương (hoặc thỏa thuận), Mô tả, Yêu cầu, Quyền lợi, Hạn nộp.
  - Quản lý trạng thái bài đăng (`Đang hiển thị`, `Bản nháp`, `Tạm đóng`).
  - Chỉnh sửa & Xóa tin tuyển dụng.
- **Quản lý Hồ sơ Ứng viên**:
  - Dashboard tổng quan số lượng ứng viên và tin đăng.
  - Lọc ứng viên theo vị trí tuyển dụng và trạng thái xử lý.
  - Xem chi tiết hồ sơ cá nhân ứng viên (Học vấn, Kỹ năng, Dự án) & Tải CV bản mềm.
  - Cập nhật tiến độ vòng tuyển dụng và thêm ghi chú phản hồi cho ứng viên.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS v3, Lucide React (Icons), Axios, React Router DOM v6 |
| **Backend** | Node.js, Express.js RESTful API, JWT Authentication, Multer (Upload CV & Logo) |
| **CSDL (Database)** | SQLite3 (Database nhúng đơn tệp, không cần cài đặt SQL Server ngoài) |
| **Bảo mật** | Bcrypt.js (Mã hóa mật khẩu), Role-Based Access Control (RBAC) |

---

## 🔑 Tài Khoản Thử Nghiệm (Demo Accounts)

Hệ thống được tự động nạp dữ liệu mẫu (Seed Data) gồm 5+ doanh nghiệp và 20+ vị trí tuyển dụng thực tế ngay khi khởi chạy:

| Vai trò | Địa chỉ Email | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Sinh Viên** | `student@example.com` | `student123` | Tìm việc, Nộp CV, Đánh dấu lưu việc làm, Quản lý hồ sơ |
| **Sinh Viên 2** | `nguyenvana@example.com` | `student123` | Tìm việc, Nộp CV thiết kế UI/UX |
| **Doanh Nghiệp (FPT)** | `company@example.com` | `company123` | Đăng tin, Sửa/Xóa tin, Quản lý ứng viên nộp hồ sơ |
| **Doanh Nghiệp (VNG)** | `hr@vng.com.vn` | `company123` | Quản lý tin tuyển dụng VNG Campus |
| **Quản trị viên** | `admin@example.com` | `admin123` | Quản trị hệ thống |

---

## 💻 Hướng Dẫn Chạy Cục Bộ & Test Cùng Wi-Fi (Local & Wi-Fi LAN Setup)

### Yêu cầu hệ thống:
- Đã cài đặt **Node.js (v18+)** và **npm**.

### Bước 1: Cài đặt thư viện tự động
Chạy tập tin batch cài đặt ở thư mục gốc dự án:
```cmd
install.bat
```
*(Kịch bản sẽ tự động chạy `npm install` cho cả 2 thư mục `backend` và `frontend`)*

### Bước 2: Khởi chạy ứng dụng
Chạy tập tin batch khởi động:
```cmd
start.bat
```

### 📱 Đường dẫn truy cập (Website Links):
- **Trang chủ trên máy tính cục bộ**: `http://localhost:3000`
- **Link test trên điện thoại / thiết bị khác cùng Wi-Fi**: `http://<IP-NET-CỦA-MÁY>:3000` *(Ví dụ: http://10.64.173.3:3000)*
- **API Health Check**: `http://localhost:5000/api/health`

---

## 🌐 Hướng Dẫn Push Lên GitHub (Git & GitHub Setup)

```bash
git init
git add .
git commit -m "feat: initial commit for student job marketplace platform (NCTDH23)"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/NCTDH23.git
git push -u origin main
```
