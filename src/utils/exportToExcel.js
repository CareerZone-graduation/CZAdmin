// Utility functions for exporting data to Excel
import * as XLSX from 'xlsx';
import { formatDate } from './formatDate';

/**
 * Export transactions data to Excel
 * @param {Array} transactions - Array of transaction objects
 * @param {String} filename - Name of the file to be downloaded
 */
export const exportTransactionsToExcel = (transactions, filename = 'Danh_sach_giao_dich') => {
  if (!transactions || transactions.length === 0) {
    console.warn('No transactions to export');
    return;
  }

  // Transform data for Excel - Lấy thông tin đầy đủ từ MongoDB
  const excelData = transactions.map((transaction, index) => ({
    'STT': index + 1,
    'Mã giao dịch': transaction.transactionCode || '',
    'Họ tên người giao dịch': transaction.user?.fullname || 'Chưa cập nhật',
    'Email': transaction.user?.email || 'N/A',
    'ID người dùng': transaction.user?._id || transaction.userId || 'N/A',
    'Số tiền thanh toán (VNĐ)': transaction.amountPaid || 0,
    'Số xu nhận được': transaction.coinAmount || 0,
    'Phương thức thanh toán': getPaymentMethodLabel(transaction.paymentMethod),
    'Trạng thái': getStatusLabel(transaction.status),
    'Thời gian tạo': formatDate(transaction.createdAt),
    'Ngày': formatDate(transaction.createdAt, 'date-only'),
  }));

  // Create workbook and worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Danh sách giao dịch');

  // Set column widths
  const columnWidths = [
    { wch: 5 },  // STT
    { wch: 25 }, // Mã giao dịch
    { wch: 25 }, // Họ tên người giao dịch
    { wch: 30 }, // Email
    { wch: 25 }, // ID người dùng
    { wch: 20 }, // Số tiền
    { wch: 15 }, // Số xu
    { wch: 22 }, // Phương thức
    { wch: 15 }, // Trạng thái
    { wch: 20 }, // Thời gian tạo
    { wch: 15 }, // Ngày
  ];
  ws['!cols'] = columnWidths;

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${timestamp}.xlsx`;

  // Download file
  try {
    console.log('Exporting transactions to Excel:', fullFilename);
    XLSX.writeFile(wb, fullFilename);
    console.log('Excel file exported successfully:', fullFilename);
    return true;
  } catch (error) {
    console.error('Error exporting transactions to Excel:', error);
    throw error;
  }
};

/**
 * Export analytics data to Excel
 * @param {Object} analyticsData - Analytics data object
 * @param {String} filename - Name of the file to be downloaded
 */
export const exportAnalyticsToExcel = (analyticsData, filename = 'Phan_tich_giao_dich') => {
  if (!analyticsData) {
    console.warn('No analytics data to export');
    return;
  }

  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary
  if (analyticsData.summary) {
    const summaryData = [
      ['Chỉ số', 'Giá trị'],
      ['Tổng doanh thu (VNĐ)', analyticsData.summary.totalRevenue || 0],
      ['Tổng giao dịch', analyticsData.summary.totalTransactions || 0],
      ['Giao dịch thành công', analyticsData.summary.successfulTransactions || 0],
      ['Giao dịch đang xử lý', analyticsData.summary.pendingTransactions || 0],
      ['Giao dịch thất bại', analyticsData.summary.failedTransactions || 0],
      ['Tỷ lệ thành công (%)', analyticsData.summary.successRate || 0],
      ['Giá trị giao dịch trung bình (VNĐ)', analyticsData.summary.averageTransactionValue || 0],
      ['Tổng xu được nạp', analyticsData.summary.totalCoinsRecharged || 0],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 35 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng quan');
  }

  // Sheet 2: Revenue Over Time
  if (analyticsData.revenueOverTime && analyticsData.revenueOverTime.length > 0) {
    const revenueData = analyticsData.revenueOverTime.map(item => ({
      'Ngày': item.date,
      'Doanh thu (VNĐ)': item.revenue || 0,
      'Số giao dịch': item.transactionCount || 0,
    }));
    const wsRevenue = XLSX.utils.json_to_sheet(revenueData);
    wsRevenue['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsRevenue, 'Doanh thu theo thời gian');
  }

  // Sheet 3: Revenue by Role
  if (analyticsData.revenueByRole && analyticsData.revenueByRole.length > 0) {
    const roleData = analyticsData.revenueByRole.map(item => ({
      'Vai trò': item.name,
      'Doanh thu (VNĐ)': item.value || 0,
      'Số giao dịch': item.transactionCount || 0,
    }));
    const wsRole = XLSX.utils.json_to_sheet(roleData);
    wsRole['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsRole, 'Doanh thu theo vai trò');
  }

  // Sheet 4: Revenue by Payment Method
  if (analyticsData.revenueByPaymentMethod && analyticsData.revenueByPaymentMethod.length > 0) {
    const paymentData = analyticsData.revenueByPaymentMethod.map(item => ({
      'Phương thức': item.name,
      'Doanh thu (VNĐ)': item.value || 0,
      'Số giao dịch': item.transactionCount || 0,
    }));
    const wsPayment = XLSX.utils.json_to_sheet(paymentData);
    wsPayment['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsPayment, 'Doanh thu theo PT thanh toán');
  }

  // Sheet 5: Transaction Status
  if (analyticsData.transactionStatusBreakdown && analyticsData.transactionStatusBreakdown.length > 0) {
    const statusData = analyticsData.transactionStatusBreakdown.map(item => ({
      'Trạng thái': item.name,
      'Số lượng': item.value || 0,
    }));
    const wsStatus = XLSX.utils.json_to_sheet(statusData);
    wsStatus['!cols'] = [{ wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsStatus, 'Phân bố trạng thái');
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${timestamp}.xlsx`;

  // Download file
  try {
    console.log('Exporting analytics to Excel:', fullFilename);
    XLSX.writeFile(wb, fullFilename);
    console.log('Excel file exported successfully:', fullFilename);
    return true;
  } catch (error) {
    console.error('Error exporting analytics to Excel:', error);
    throw error;
  }
};

/**
 * Export top users data to Excel
 * @param {Array} users - Array of user spending data
 * @param {String} filename - Name of the file to be downloaded
 */
export const exportTopUsersToExcel = (users, filename = 'Top_nguoi_dung_chi_tieu') => {
  if (!users || users.length === 0) {
    console.warn('No users data to export');
    return;
  }

  const excelData = users.map((user, index) => ({
    'Hạng': index + 1,
    'Email': user.email || '',
    'Vai trò': user.role || '',
    'Tổng chi tiêu (VNĐ)': user.totalSpent || 0,
    'Số giao dịch': user.transactionCount || 0,
    'Trung bình mỗi giao dịch (VNĐ)': user.totalSpent && user.transactionCount 
      ? Math.round(user.totalSpent / user.transactionCount) 
      : 0,
  }));

  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Top người dùng');

  ws['!cols'] = [
    { wch: 8 },  // Hạng
    { wch: 30 }, // Email
    { wch: 20 }, // Vai trò
    { wch: 20 }, // Tổng chi tiêu
    { wch: 15 }, // Số giao dịch
    { wch: 25 }, // Trung bình
  ];

  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${timestamp}.xlsx`;

  try {
    console.log('Exporting top users to Excel:', fullFilename);
    XLSX.writeFile(wb, fullFilename);
    console.log('Excel file exported successfully:', fullFilename);
    return true;
  } catch (error) {
    console.error('Error exporting top users to Excel:', error);
    throw error;
  }
};

// Helper functions
const getStatusLabel = (status) => {
  const statusMap = {
    'SUCCESS': 'Thành công',
    'PENDING': 'Đang xử lý',
    'FAILED': 'Thất bại',
    'CANCELLED': 'Đã hủy',
  };
  return statusMap[status] || status;
};

const getPaymentMethodLabel = (method) => {
  const methodMap = {
    'VNPAY': 'VNPAY',
    'ZALOPAY': 'ZaloPay',
    'MOMO': 'MoMo',
    'BANK_TRANSFER': 'Chuyển khoản',
  };
  return methodMap[method] || method;
};

const getRoleLabel = (role) => {
  const roleMap = {
    'candidate': 'Ứng viên',
    'recruiter': 'Nhà tuyển dụng',
    'admin': 'Quản trị viên',
  };
  return roleMap[role] || role;
};
