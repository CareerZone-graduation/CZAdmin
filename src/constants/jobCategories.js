// User Role Mapping - Backend to Vietnamese
export const USER_ROLES = {
  'Job Seekers': 'Ứng viên',
  'Recruiters': 'Nhà tuyển dụng',
  'Company Admins': 'Quản trị viên công ty',
  'candidate': 'Ứng viên',
  'recruiter': 'Nhà tuyển dụng',
  'admin': 'Quản trị viên'
};

// Helper function to get Vietnamese role label
export const getRoleLabel = (role) => {
  return USER_ROLES[role] || role;
};

// Job Categories Mapping - Backend to Vietnamese
export const JOB_CATEGORIES = {
  'IT': 'Công nghệ thông tin',
  'SOFTWARE_DEVELOPMENT': 'Phát triển phần mềm',
  'DATA_SCIENCE': 'Khoa học dữ liệu',
  'MACHINE_LEARNING': 'Học máy / AI',
  'WEB_DEVELOPMENT': 'Phát triển Web',
  'SALES': 'Kinh doanh / Bán hàng',
  'MARKETING': 'Marketing / Truyền thông',
  'ACCOUNTING': 'Kế toán',
  'GRAPHIC_DESIGN': 'Thiết kế đồ họa',
  'CONTENT_WRITING': 'Biên tập nội dung',
  'MEDICAL': 'Y tế / Chăm sóc sức khỏe',
  'TEACHING': 'Giáo dục / Đào tạo',
  'ENGINEERING': 'Kỹ thuật / Cơ khí',
  'PRODUCTION': 'Sản xuất / Vận hành',
  'LOGISTICS': 'Logistics / Vận chuyển',
  'HOSPITALITY': 'Khách sạn / Nhà hàng',
  'REAL_ESTATE': 'Bất động sản',
  'LAW': 'Luật / Pháp lý',
  'FINANCE': 'Tài chính / Ngân hàng',
  'HUMAN_RESOURCES': 'Nhân sự',
  'CUSTOMER_SERVICE': 'Chăm sóc khách hàng',
  'ADMINISTRATION': 'Hành chính / Văn phòng',
  'MANAGEMENT': 'Quản lý / Điều hành',
  'OTHER': 'Khác'
};

// Helper function to get Vietnamese label
export const getCategoryLabel = (category) => {
  return JOB_CATEGORIES[category] || category;
};

// Get all categories as options for select/dropdown
export const getCategoryOptions = () => {
  return Object.entries(JOB_CATEGORIES).map(([value, label]) => ({
    value,
    label
  }));
};

// Top 10 most popular categories (based on typical job market)
export const TOP_CATEGORIES = [
  'SOFTWARE_DEVELOPMENT',
  'SALES',
  'MARKETING',
  'CUSTOMER_SERVICE',
  'ACCOUNTING',
  'HUMAN_RESOURCES',
  'WEB_DEVELOPMENT',
  'GRAPHIC_DESIGN',
  'ADMINISTRATION',
  'TEACHING'
];
