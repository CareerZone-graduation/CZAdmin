# Hướng dẫn Việt hóa Admin Panel

## Tổng quan

Admin Panel đã được việt hóa hoàn toàn với hệ thống translation tập trung. Tất cả các text hiển thị trên giao diện đều được quản lý tại file `src/constants/translations.js`.

## Cấu trúc Translation

### File chính: `src/constants/translations.js`

File này chứa:
- **TRANSLATIONS**: Object chứa tất cả các bản dịch tiếng Việt
- **t()**: Helper function để lấy translation
- **getApiStatus()**: Helper để chuyển từ display status sang API status
- **getDisplayStatus()**: Helper để chuyển từ API status sang display status

### Cấu trúc TRANSLATIONS

```javascript
TRANSLATIONS = {
  common: {},        // Các từ dùng chung (search, filter, save, cancel...)
  sidebar: {},       // Sidebar navigation
  login: {},         // Trang đăng nhập
  dashboard: {},     // Dashboard
  users: {},         // Quản lý người dùng
  companies: {},     // Quản lý công ty
  jobs: {},          // Quản lý công việc
  transactions: {}, // Quản lý giao dịch
  statusMapping: {} // Ánh xạ giữa hiển thị và API
}
```

## Cách sử dụng

### 1. Import translation helper

```javascript
import { t } from '@/constants/translations';
```

### 2. Sử dụng trong component

```javascript
// Ví dụ đơn giản
<h1>{t('users.title')}</h1>

// Trong attributes
<Input placeholder={t('users.searchPlaceholder')} />

// Trong conditional rendering
{loading ? t('common.loading') : t('common.refresh')}
```

### 3. Ánh xạ Status với Backend

Hệ thống có 2 helper functions để chuyển đổi giữa status hiển thị và API:

```javascript
import { getApiStatus, getDisplayStatus } from '@/constants/translations';

// Chuyển từ display sang API (khi gửi request)
const apiStatus = getApiStatus('job', 'Hoạt động'); // Returns 'ACTIVE'

// Chuyển từ API sang display (khi nhận response)
const displayStatus = getDisplayStatus('job', 'ACTIVE'); // Returns 'Hoạt động'
```

## Status Mapping

### User Status
- **Display**: "Hoạt động" → **API**: "active"
- **Display**: "Đã cấm" → **API**: "banned"

### Company Status
- **Display**: "Chờ duyệt" → **API**: "pending"
- **Display**: "Đã phê duyệt" → **API**: "approved"
- **Display**: "Đã từ chối" → **API**: "rejected"

### Job Status
- **Display**: "Hoạt động" → **API**: "ACTIVE"
- **Display**: "Không hoạt động" → **API**: "INACTIVE"
- **Display**: "Chờ duyệt" → **API**: "PENDING"
- **Display**: "Hết hạn" → **API**: "EXPIRED"

## Components đã được việt hóa

✅ **Sidebar** (`src/components/Sidebar.jsx`)
- Navigation menu items
- Title và subtitle
- Settings và logout buttons

✅ **User Management** (`src/features/users/UserManagement.jsx`)
- Tất cả labels, filters, buttons
- Status badges (Admin, Recruiter, Candidate, Active, Banned)
- Search placeholders
- Toast messages

✅ **Company Management** (`src/features/companies/EnhancedCompanyManagement.jsx`)
- Headers và descriptions
- Status badges với icons
- Filters và sort options
- Modal dialogs (rejection, approval)
- Bulk actions

✅ **Job Management** (`src/features/jobs/JobManagement.jsx`)
- Đã có sẵn tiếng Việt trong code

✅ **Dashboard** (`src/features/dashboard/EnhancedDashboard.jsx`)
- Tab navigation
- Stats cards
- Real-time activity metrics

✅ **Login Form** (`src/features/auth/LoginForm.jsx`)
- Form labels và placeholders
- Feature highlights
- Loading states

## Thêm Translation mới

### Bước 1: Thêm vào file translations.js

```javascript
export const TRANSLATIONS = {
  // ... existing translations
  newSection: {
    title: 'Tiêu đề mới',
    description: 'Mô tả mới',
    button: 'Nút bấm',
  }
};
```

### Bước 2: Sử dụng trong component

```javascript
import { t } from '@/constants/translations';

function MyComponent() {
  return (
    <div>
      <h1>{t('newSection.title')}</h1>
      <p>{t('newSection.description')}</p>
      <button>{t('newSection.button')}</button>
    </div>
  );
}
```

## Best Practices

### 1. Nhóm translations theo feature
Đặt translations vào các object tương ứng với feature/page

### 2. Sử dụng nested keys
```javascript
users: {
  title: 'Quản lý Người dùng',
  filters: {
    role: 'Lọc theo vai trò',
    status: 'Lọc theo trạng thái'
  }
}
```

### 3. Đảm bảo consistency
- Dùng cùng một từ cho cùng một khái niệm
- Ví dụ: luôn dùng "Tìm kiếm" cho search, không đổi thành "Tra cứu"

### 4. Backend Field Mapping
Khi cần gửi data lên backend, đảm bảo sử dụng đúng field name:
```javascript
// Sai - gửi text hiển thị
{ status: 'Hoạt động' }

// Đúng - gửi API field
{ status: 'ACTIVE' }
```

## Testing

### Kiểm tra translations
1. Khởi động dev server: `npm run dev`
2. Kiểm tra từng page:
   - Login page: `/login`
   - Dashboard: `/dashboard`
   - Users: `/users`
   - Companies: `/companies`
   - Jobs: `/jobs`

### Kiểm tra API calls
1. Mở DevTools Network tab
2. Thực hiện actions (filter, search, update status)
3. Verify request payload sử dụng đúng field names (không phải display text)

## Troubleshooting

### Translation không hiển thị
1. Kiểm tra key có đúng không: `t('section.key')`
2. Kiểm tra đã import t() chưa
3. Check console có error không

### Status không map đúng
1. Verify bạn đang dùng đúng category: 'user', 'company', 'job'
2. Kiểm tra API response format
3. Xem lại statusMapping trong translations.js

### Lỗi "key is not defined"
Thêm key vào TRANSLATIONS object trong translations.js

## Maintenance

### Khi thêm feature mới
1. Thêm section mới vào TRANSLATIONS
2. Import t() vào component
3. Replace hardcoded text với t()
4. Test thoroughly

### Khi backend thay đổi field names
1. Update statusMapping nếu cần
2. Kiểm tra tất cả API calls
3. Update helper functions nếu cần

## Lưu ý quan trọng

⚠️ **Backend Communication**
- Luôn gửi API field names, không phải display text
- Sử dụng getApiStatus() khi cần chuyển đổi
- Validate response data format

⚠️ **Date Formatting**
- Sử dụng `.toLocaleDateString('vi-VN')` cho ngày tháng
- Đảm bảo timezone đúng

⚠️ **Number Formatting**
- Sử dụng `.toLocaleString('vi-VN')` cho số
- Giữ nguyên số cho API calls

## Support

Nếu có vấn đề với translation system:
1. Check file `translations.js` xem key có tồn tại không
2. Verify import statement
3. Check console errors
4. Review component code

---

**Version**: 1.0.0  
**Last Updated**: 2025-01-29  
**Maintainer**: Development Team
