# CareerZone - Bảng Điều Khiển Quản Trị

Ứng dụng quản trị cho nền tảng CareerZone, được xây dựng với React, Redux Toolkit, TailwindCSS và shadcn/ui.

## 📋 Tổng Quan

CareerZone Admin là bảng điều khiển dành cho quản trị viên hệ thống. Ứng dụng cung cấp công cụ quản lý toàn diện cho người dùng, công ty, tin tuyển dụng và giao dịch trên nền tảng.

## 🚀 Tính Năng

### Dashboard Tổng Quan
- Thống kê tổng quan hệ thống (users, jobs, companies, revenue)
- Biểu đồ phân tích theo thời gian
- Hoạt động gần đây

### Quản Lý Người Dùng
- Danh sách tất cả người dùng (Candidate, Recruiter)
- Lọc theo vai trò, trạng thái, ngày đăng ký
- Kích hoạt/Vô hiệu hóa tài khoản
- Xem chi tiết thông tin người dùng

### Quản Lý Công Ty
- Danh sách công ty đăng ký
- Duyệt/Từ chối đăng ký công ty mới
- Xác minh thông tin công ty
- Quản lý trạng thái công ty (chờ duyệt, đã duyệt, bị khóa)

### Quản Lý Tin Tuyển Dụng
- Danh sách tất cả tin tuyển dụng
- Duyệt/Từ chối tin đăng mới
- Quản lý tin nổi bật (featured)
- Thống kê theo ngành nghề, khu vực

### Quản Lý Giao Dịch
- Lịch sử thanh toán
- Chi tiết giao dịch
- Báo cáo doanh thu
- Xuất báo cáo


## 🛠️ Công Nghệ Sử Dụng

| Thành phần | Công nghệ |
|------------|-----------|
| Framework | React v19 |
| Build Tool | Vite + SWC |
| State Management | Redux Toolkit |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui, Radix UI |
| Charts | Recharts |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | Sonner |

## 📁 Cấu Trúc Dự Án

```
fe-admin/
├── src/
│   ├── components/       # React components
│   │   ├── analytics/    # Biểu đồ và thống kê
│   │   ├── common/       # Components dùng chung (skeletons)
│   │   ├── jobs/         # Quản lý việc làm
│   │   ├── transactions/ # Quản lý giao dịch
│   │   └── ui/           # shadcn/ui components
│   ├── data/             # Mock data và constants
│   ├── features/         # Logic theo feature
│   │   ├── auth/         # Xác thực
│   │   ├── companies/    # Quản lý công ty
│   │   ├── dashboard/    # Dashboard
│   │   ├── jobs/         # Quản lý việc làm
│   │   ├── transactions/ # Quản lý giao dịch
│   │   └── users/        # Quản lý người dùng
│   ├── layouts/          # Layout components
│   │   ├── DashboardLayout.jsx
│   │   └── AuthLayout.jsx
│   ├── lib/              # Thư viện tiện ích
│   ├── pages/            # Entry points cho pages
│   ├── routes/           # Cấu hình routing
│   ├── services/         # API clients
│   ├── store/            # Redux store
│   └── utils/            # Helper utilities
├── .env.example
├── package.json
└── vite.config.js
```

## 🚦 Hướng Dẫn Cài Đặt

### Yêu Cầu Hệ Thống

- **Node.js**: v18 trở lên
- **pnpm**: Package manager (khuyến nghị)

### Các Bước Cài Đặt

1. **Di chuyển vào thư mục**:
   ```bash
   cd fe-admin
   ```

2. **Cài đặt dependencies**:
   ```bash
   pnpm install
   ```

3. **Cấu hình môi trường**:
   ```bash
   copy .env.example .env
   ```

4. **Chạy development server**:
   ```bash
   pnpm run dev
   ```
   
   Ứng dụng sẽ mở tại `http://localhost:3200`

### Tài Khoản Demo

Sử dụng thông tin sau để đăng nhập:

- **Email**: `admin@careerzone.com`
- **Mật khẩu**: `admin123`


## 📦 Scripts Có Sẵn

| Script | Mô tả |
|--------|-------|
| `pnpm run dev` | Chạy development server |
| `pnpm run build` | Build cho production |
| `pnpm run preview` | Preview bản build |
| `pnpm run lint` | Kiểm tra linting |

## 🎨 UI Components

Dự án sử dụng shadcn/ui components:

- **Cards**: Container hiển thị thông tin
- **Tables**: Bảng dữ liệu với sorting và filtering
- **Buttons**: Các loại button
- **Forms**: Input fields, selects, labels
- **Dialogs**: Modal và overlays
- **Badges**: Status indicators
- **Alerts**: Thông báo success, error, warning
- **Charts**: Biểu đồ với Recharts

## 🔧 State Management

Ứng dụng sử dụng Redux Toolkit với các slices:

- **authSlice**: Trạng thái xác thực
- **companiesSlice**: Quản lý công ty
- **usersSlice**: Quản lý người dùng
- **jobsSlice**: Quản lý việc làm
- **transactionsSlice**: Quản lý giao dịch

## 🔐 Xác Thực

Hệ thống xác thực bao gồm:
- Protected routes yêu cầu đăng nhập
- Form đăng nhập với validation
- Tài khoản demo để test
- Chức năng đăng xuất
- Lưu trạng thái auth

## 🚀 Deployment

### Build cho Production

```bash
pnpm run build
```

Files build sẽ được tạo trong thư mục `dist`.

## 🤝 Đóng Góp

### Quy Trình Đóng Góp

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit changes: `git commit -m "feat: mô tả tính năng"`
4. Push branch: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

## 📄 License

Dự án này được phát triển cho CareerZone Platform.
