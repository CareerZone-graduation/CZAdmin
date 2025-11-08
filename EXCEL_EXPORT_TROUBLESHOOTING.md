# Hướng dẫn khắc phục lỗi không tải được file Excel

## Vấn đề: File Excel không được tải về

Nếu bạn thấy thông báo "Xuất Excel thành công" nhưng không thấy file được tải về, hãy thử các cách sau:

### 1. Kiểm tra thư mục Downloads
- Mở thư mục **Downloads** (Tải xuống) trên máy tính
- Tìm file có tên dạng: `Danh_sach_giao_dich_2025-11-08.xlsx`
- Sắp xếp theo thời gian để tìm file mới nhất

### 2. Kiểm tra trình duyệt có chặn download không
- **Chrome/Edge**: Nhìn vào góc phải trên cùng của thanh địa chỉ, xem có biểu tượng download bị chặn không
- Nếu có, click vào và chọn "Luôn cho phép downloads từ trang này"
- Thử xuất lại

### 3. Kiểm tra Console Log
- Nhấn **F12** để mở Developer Tools
- Chuyển sang tab **Console**
- Khi click nút "Xuất Excel", xem có lỗi gì hiển thị không
- Bạn sẽ thấy các log như:
  ```
  Starting export, transactions count: 10
  Exporting transactions to Excel: Danh_sach_giao_dich_2025-11-08.xlsx
  Excel file exported successfully: Danh_sach_giao_dich_2025-11-08.xlsx
  ```

### 4. Kiểm tra quyền truy cập thư mục Downloads
- Đảm bảo trình duyệt có quyền ghi file vào thư mục Downloads
- Trong Windows: Chuột phải vào thư mục Downloads > Properties > Security

### 5. Thử với trình duyệt khác
- Nếu dùng Chrome không được, thử với Edge hoặc Firefox
- Đôi khi trình duyệt có cài đặt bảo mật chặn download

### 6. Xóa cache và cookies
- Xóa cache của trình duyệt
- Reload lại trang (Ctrl + Shift + R)
- Thử xuất Excel lại

### 7. Kiểm tra phần mềm Antivirus
- Một số phần mềm diệt virus có thể chặn download tự động
- Tạm tắt antivirus và thử lại

## Debug bằng Console

Mở Console (F12) và chạy lệnh sau để test trực tiếp:

```javascript
// Test export một file đơn giản
import('xlsx').then(XLSX => {
  const ws = XLSX.utils.aoa_to_sheet([['Test', 'Data'], ['1', '2']]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Test');
  XLSX.writeFile(wb, 'test.xlsx');
  console.log('Test file exported');
});
```

Nếu lệnh này không tạo file, có vấn đề với thư viện xlsx hoặc quyền của trình duyệt.

## Giải pháp thay thế

Nếu vẫn không được, bạn có thể:

1. **Copy dữ liệu**: Select và copy dữ liệu từ bảng, paste vào Excel
2. **Print to PDF**: Sử dụng chức năng in và chọn "Save as PDF"
3. **Screenshot**: Chụp màn hình để lưu lại dữ liệu

## Liên hệ hỗ trợ

Nếu vẫn gặp vấn đề, hãy cung cấp:
- Trình duyệt và phiên bản đang dùng
- Hệ điều hành (Windows/Mac/Linux)
- Ảnh chụp Console log (F12)
- Thông báo lỗi nếu có
