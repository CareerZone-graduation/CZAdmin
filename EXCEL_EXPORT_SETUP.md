# Hướng dẫn cài đặt chức năng Xuất Excel

## Cài đặt thư viện

Để sử dụng chức năng xuất Excel, bạn cần cài đặt thư viện `xlsx`:

```bash
npm install xlsx
```

Hoặc nếu dùng yarn:

```bash
yarn add xlsx
```

## Các chức năng đã được implement

### 1. Xuất danh sách giao dịch
- **File**: `TransactionManagement.jsx`
- **Chức năng**: Xuất toàn bộ danh sách giao dịch hiện tại (có thể đã được lọc)
- **Nút**: "Xuất Excel" ở phần header và trong TransactionFilters
- **Dữ liệu xuất**: 
  - STT
  - Mã giao dịch
  - Họ tên
  - Email
  - Vai trò
  - Số tiền thanh toán
  - Số xu nhận được
  - Phương thức thanh toán
  - Trạng thái
  - Thời gian tạo

### 2. Xuất dữ liệu phân tích
- **File**: `TransactionAnalytics.jsx`
- **Chức năng**: Xuất toàn bộ dữ liệu phân tích với nhiều sheet
- **Nút**: "Xuất Excel" ở góc phải phần header
- **Các sheet được xuất**:
  1. **Tổng quan**: Các chỉ số KPI tổng hợp
  2. **Doanh thu theo thời gian**: Biểu đồ doanh thu
  3. **Doanh thu theo vai trò**: Phân bổ theo user role
  4. **Doanh thu theo phương thức thanh toán**: Phân bổ theo payment method
  5. **Phân bố trạng thái**: Số lượng giao dịch theo trạng thái

### 3. Xuất top người dùng chi tiêu
- **File**: `TransactionAnalytics.jsx`
- **Chức năng**: Xuất bảng xếp hạng người dùng
- **Nút**: "Xuất Excel" ở phần "Top Người dùng Chi tiêu"
- **Dữ liệu xuất**:
  - Hạng
  - Email
  - Vai trò
  - Tổng chi tiêu
  - Số giao dịch
  - Trung bình mỗi giao dịch

## Các file đã được tạo/sửa

1. **`src/utils/exportToExcel.js`** (MỚI)
   - Chứa các hàm utility để xuất Excel
   - `exportTransactionsToExcel()`: Xuất danh sách giao dịch
   - `exportAnalyticsToExcel()`: Xuất dữ liệu phân tích
   - `exportTopUsersToExcel()`: Xuất top users

2. **`src/features/transactions/TransactionManagement.jsx`** (ĐÃ SỬA)
   - Import hàm `exportTransactionsToExcel`
   - Cập nhật hàm `handleExport()` để gọi function xuất Excel

3. **`src/components/transactions/TransactionAnalytics.jsx`** (ĐÃ SỬA)
   - Import các hàm xuất Excel
   - Thêm 2 hàm: `handleExportAnalytics()` và `handleExportTopUsers()`
   - Thêm 2 nút "Xuất Excel"

## Định dạng file Excel

- Tên file có dạng: `Ten_file_YYYY-MM-DD.xlsx`
- Ví dụ: `Danh_sach_giao_dich_2025-11-08.xlsx`
- Tự động thêm timestamp để tránh ghi đè file cũ
- Độ rộng cột đã được tối ưu để dễ đọc

## Lưu ý

- File Excel sẽ được tải về thư mục Downloads mặc định của trình duyệt
- Chức năng xuất Excel hoạt động offline, không cần gửi request lên server
- Dữ liệu được format tự động (currency, date, number)
- Hỗ trợ tiếng Việt có dấu đầy đủ

## Kiểm tra

Sau khi cài đặt thư viện `xlsx`, hãy test các chức năng:

1. Vào trang "Quản lý Giao dịch"
2. Tab "Phân tích & Thống kê": Click "Xuất Excel" ở header và phần Top Users
3. Tab "Danh sách Giao dịch": Click "Xuất Excel" 
4. Kiểm tra file Excel đã tải về

## Troubleshooting

Nếu gặp lỗi khi xuất Excel:
- Kiểm tra đã cài đặt thư viện `xlsx` chưa
- Kiểm tra console log xem có lỗi gì
- Đảm bảo có dữ liệu trước khi xuất
