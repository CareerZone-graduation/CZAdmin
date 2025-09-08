# User Management System

## Tổng quan

Hệ thống quản lý người dùng cho phép admin xem, tìm kiếm, lọc và quản lý trạng thái của tất cả người dùng trong hệ thống.

## API Endpoint

```
GET /api/admin/users
```

### Tham số truy vấn:

- `status`: Trạng thái người dùng (`active`, `banned`)
- `page`: Số trang (mặc định: 1)
- `limit`: Số item mỗi trang (mặc định: 10)
- `search`: Từ khóa tìm kiếm trong tên hoặc email
- `sort`: Sắp xếp (`-createdAt`, `createdAt`, `fullname`, `-fullname`)
- `role`: Vai trò (`candidate`, `recruiter`)

### Ví dụ API call:

```bash
curl --location 'localhost:5000/api/admin/users?status=active&page=1&limit=10&search=Bùi&sort=-createdAt&role=candidate' \
--header 'Authorization: Bearer YOUR_TOKEN'
```

### Response format:

```json
{
    "success": true,
    "message": "Lấy danh sách người dùng thành công.",
    "meta": {
        "currentPage": 1,
        "totalPages": 1,
        "totalItems": 1,
        "limit": 10
    },
    "data": [
        {
            "_id": "68707c8026cd47e3b30d70e2",
            "email": "c10@gmail.com",
            "role": "candidate",
            "active": true,
            "createdAt": "2023-03-19T19:00:00Z",
            "fullname": "Bùi Minh Khôi"
        }
    ]
}
```

## Tính năng

### 1. Hiển thị danh sách người dùng
- Hiển thị thông tin cơ bản: tên, email, vai trò, trạng thái, ngày tạo
- Phân trang với điều hướng
- Loading skeleton khi đang tải dữ liệu
- Hiển thị số lượng kết quả và thông tin phân trang
- Indicator cho các filter đang được áp dụng

### 2. Tìm kiếm và lọc
- **Tìm kiếm**: 
  - Nhập từ khóa vào ô tìm kiếm
  - Nhấn Enter hoặc click nút "Search" để thực hiện tìm kiếm
  - Click nút X để xóa từ khóa tìm kiếm
  - Tìm kiếm theo tên hoặc email người dùng
- **Lọc theo vai trò**: All, Candidate, Recruiter
- **Lọc theo trạng thái**: All, Active, Banned
- **Sắp xếp**: Newest First, Oldest First, Name A-Z, Name Z-A
- **Hiển thị filter đang áp dụng**: Hiển thị các filter đang được sử dụng với khả năng xóa nhanh

### 3. Quản lý trạng thái
- Kích hoạt/cấm tài khoản người dùng
- Hiển thị badge trạng thái với màu sắc phù hợp (Active = xanh, Banned = đỏ)

### 4. Responsive design
- Tương thích với mobile và desktop
- UI thân thiện với người dùng

## Files liên quan

### Service Layer
- `src/services/userService.js`: Chứa function `getUsers()` để gọi API

### Components
- `src/features/users/UserManagement.jsx`: Component chính quản lý người dùng
- `src/components/common/UserListSkeleton.jsx`: Loading skeleton

### Pages
- `src/pages/UserManagementPage.jsx`: Page wrapper

## Cách sử dụng

1. **Import service**:
```javascript
import { getUsers } from '@/services/userService';
```

2. **Gọi API với parameters**:
```javascript
const params = {
  page: 1,
  limit: 10,
  search: 'john',
  role: 'candidate',
  status: 'active',
  sort: '-createdAt'
};

const response = await getUsers(params);
```

3. **Xử lý response**:
```javascript
if (response.success) {
  const users = response.data.data;
  const meta = response.data.meta;
  // Cập nhật state
}
```

## Lưu ý

- API yêu cầu token xác thực trong header Authorization
- Tất cả parameters đều optional
- API tự động áp dụng filter, search và sort ở backend
- Component sử dụng `sonner` cho toast notifications
- Loading state được xử lý bằng skeleton UI
