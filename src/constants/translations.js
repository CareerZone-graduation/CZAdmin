/**
 * Translations for Admin Panel
 * Vietnamese translations with proper backend field mapping
 */

export const TRANSLATIONS = {
  // Common
  common: {
    search: 'Tìm kiếm',
    filter: 'Lọc',
    sort: 'Sắp xếp',
   
    refresh: 'Làm mới',
    loading: 'Đang tải...',
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    edit: 'Chỉnh sửa',
    view: 'Xem',
    approve: 'Phê duyệt',
    reject: 'Từ chối',
    close: 'Đóng',
    noData: 'Không có dữ liệu',
    actions: 'Hành động',
    status: 'Trạng thái',
    dateRange: 'Khoảng thời gian',
   
  },

  // Sidebar Navigation
  sidebar: {
    title: 'CareerZone',
    subtitle: 'Bảng điều khiển Quản trị',
    dashboard: 'Tổng quan',
    companies: 'Công ty',
    users: 'Người dùng',
    jobs: 'Công việc',
    transactions: 'Giao dịch',
    support: 'Yêu cầu hỗ trợ',
    notifications: 'Thông báo',
    settings: 'Cài đặt',
    logout: 'Đăng xuất',
  },

  // Login Page
  login: {
    welcomeBack: 'Chào mừng trở lại',
    signInDescription: 'Đăng nhập vào bảng điều khiển quản trị',
    email: 'Email',
    emailPlaceholder: 'admin@careerzone.com',
    password: 'Mật khẩu',
    passwordPlaceholder: 'Nhập mật khẩu của bạn',
    signIn: 'Đăng nhập',
    signingIn: 'Đang đăng nhập...',
    platformDescription: 'Nền tảng quản lý tuyển dụng toàn diện',
    fullDescription: 'Tối ưu hóa quy trình tuyển dụng với các công cụ quản trị mạnh mẽ để quản lý công ty, người dùng, tin tuyển dụng và giao dịch tất cả trong một nơi.',
    companyManagement: 'Quản lý Công ty',
    companyManagementDesc: 'Xem xét và phê duyệt đăng ký công ty',
    userAdministration: 'Quản trị Người dùng',
    userAdministrationDesc: 'Quản lý tài khoản và quyền người dùng',
    jobOversight: 'Giám sát Công việc',
    jobOversightDesc: 'Theo dõi và kiểm duyệt tin tuyển dụng',
  },

  // Dashboard
  dashboard: {
    title: 'Tổng quan Nâng cao',
    description: 'Phân tích và thông tin chi tiết toàn diện cho nền tảng tuyển dụng của bạn',
    overview: 'Tổng quan',
    analytics: 'Phân tích',
    performance: 'Hiệu suất',
    systemHealth: 'Trạng thái Hệ thống',
    realTimeActivity: 'Theo dõi Hoạt động Thời gian thực',
    onlineUsers: 'Người dùng Trực tuyến',
    apiCallsToday: 'Lượt gọi API Hôm nay',
    avgResponse: 'Thời gian phản hồi TB',
    errorRate: 'Tỷ lệ Lỗi',
    databasePerformance: 'Hiệu suất Cơ sở dữ liệu',
    databaseHealth: 'Hiệu suất truy vấn và tình trạng cơ sở dữ liệu',
    queryResponseTime: 'Thời gian Phản hồi Truy vấn',
    connectionPool: 'Pool Kết nối',
    cacheHitRate: 'Tỷ lệ Trúng Cache',
    diskUsage: 'Sử dụng Đĩa',
    securityOverview: 'Tổng quan Bảo mật',
    securityEvents: 'Sự kiện bảo mật và phát hiện mối đe dọa',
    securityStatus: 'Trạng thái Bảo mật',
    secure: 'An toàn',
    failedLoginAttempts: 'Lượt đăng nhập thất bại (24h)',
    blockedIPAddresses: 'Địa chỉ IP bị chặn',
    lastSecurityScan: 'Lần quét bảo mật cuối',
    hoursAgo: 'giờ trước',
    excellent: 'Xuất sắc',
    good: 'Tốt',
    warning: 'Cảnh báo',
    systemHealthTitle: 'Trạng thái Hệ thống',
    platformPerformance: 'Số liệu hiệu suất nền tảng thời gian thực',
    uptime: 'Thời gian hoạt động',
    serverLoad: 'Tải máy chủ',
    responseTime: 'Thời gian phản hồi',
    activeUsers: 'Người dùng hoạt động',
    totalUsers: 'Tổng số Người dùng',
    activeCompanies: 'Công ty Hoạt động',
    jobListings: 'Tin tuyển dụng',
    monthlyRevenue: 'Doanh thu Hàng tháng',
    totalApplications: 'Tổng số Ứng tuyển',
    totalInterviews: 'Tổng số Phỏng vấn',
    fromLastMonth: 'so với tháng trước',
    failedToFetchStats: 'Không thể tải dữ liệu thống kê.',
  },

  // User Management
  users: {
    title: 'Quản lý Người dùng',
    description: 'Quản lý tài khoản và quyền người dùng',
    directory: 'Danh bạ Người dùng',
    directoryDescription: 'Xem và quản lý tất cả người dùng đã đăng ký trên nền tảng',
    searchPlaceholder: 'Tìm kiếm người dùng theo tên hoặc email...',
    filterByRole: 'Lọc theo vai trò',
    filterByStatus: 'Lọc theo trạng thái',
    sortBy: 'Sắp xếp theo',
    allRoles: 'Tất cả Vai trò',
    allStatus: 'Tất cả Trạng thái',
    newestFirst: 'Mới nhất',
    oldestFirst: 'Cũ nhất',
    nameAZ: 'Tên A-Z',
    nameZA: 'Tên Z-A',
    joined: 'Tham gia',
    banUser: 'Cấm Người dùng',
    activate: 'Kích hoạt',
    noUsersFound: 'Không tìm thấy người dùng phù hợp với tiêu chí của bạn.',
    showing: 'Hiển thị',
    to: 'đến',
    of: 'trên',
    filtered: '(đã lọc)',
    page: 'Trang',
    activeFilters: 'Bộ lọc đang áp dụng:',

    // Roles
    admin: 'Quản trị viên',
    recruiter: 'Nhà tuyển dụng',
    candidate: 'Ứng viên',

    // Status
    active: 'Hoạt động',
    banned: 'Đã cấm',

    // Backend field mapping
    roleField: 'role', // Maps to backend field name
    statusField: 'status', // Maps to backend field name
    activeField: 'active', // Maps to backend field name
  },

  // Company Management
  companies: {
    title: 'Quản lý Công ty',
    description: 'Xem xét, xác minh và quản lý đăng ký công ty với các công cụ nâng cao',
    applications: 'Đơn đăng ký Công ty',
    applicationsDescription: 'Xem xét các yêu cầu đăng ký và xác minh công ty đang chờ',
    searchPlaceholder: 'Tìm kiếm theo tên, email, v.v...',
    filterByStatus: 'Lọc theo trạng thái',
    filterByIndustry: 'Lọc theo ngành',
    allStatuses: 'Tất cả Trạng thái',
    allIndustries: 'Tất cả Ngành',
    newest: 'Mới nhất',
    oldest: 'Cũ nhất',
    nameAZ: 'Tên (A-Z)',
    nameZA: 'Tên (Z-A)',
    totalCompanies: 'Tổng số Công ty',
    pendingReview: 'Chờ xem xét',
    approved: 'Đã phê duyệt',
    rejected: 'Đã từ chối',
    verified: 'Đã xác minh',
    bulkApprove: 'Phê duyệt Hàng loạt',
    bulkReject: 'Từ chối Hàng loạt',
    selected: 'đã chọn',
    advancedFilters: 'Bộ lọc Nâng cao',
    viewDetails: 'Xem thông tin cơ bản',
    viewCompanyPage: 'Xem chi tiết công ty',
    companyDetails: 'Thông tin chi tiết về công ty và người đăng ký',
    recruiterInfo: 'Thông tin Nhà tuyển dụng',
    fullname: 'Họ tên',
    email: 'Email',
    userCreatedAt: 'Ngày tạo Tài khoản',
    companyInfo: 'Thông tin Công ty',
    industry: 'Ngành',
    size: 'Quy mô',
    taxCode: 'Mã số thuế',
    website: 'Website',
    contactLocation: 'Liên hệ & Địa điểm',
    phone: 'Điện thoại',
    address: 'Địa chỉ',
    jobStats: 'Thống kê Công việc',
    totalJobs: 'Tổng số việc',
    recruitingJobs: 'Đang tuyển',
    pendingJobs: 'Chờ duyệt',
    expiredJobs: 'Đã hết hạn',
    applicationStats: 'Thống kê Ứng tuyển',
    total: 'Tổng',
    pending: 'Chờ',
    accepted: 'Chấp nhận',
    rechargeStats: 'Thống kê Nạp tiền',
    totalPaid: 'Tổng thanh toán',
    totalCoins: 'Tổng Coins',
    count: 'Số lần',
    lastRecharge: 'Lần nạp cuối',
    documentVerification: 'Xác minh Tài liệu',
    viewBusinessRegistration: 'Xem Giấy đăng ký Kinh doanh',
    reconsider: 'Xem xét lại',
    rejectionReason: 'Lý do từ chối',
    enterRejectionReason: 'Nhập lý do từ chối...',
    confirmReapproval: 'Xác nhận Phê duyệt lại',
    reapprovalMessage: 'Bạn có chắc chắn muốn phê duyệt lại công ty này không? Công ty đã bị từ chối trước đó.',
    reapprove: 'Phê duyệt lại',

    // Status
    statusPending: 'Chờ duyệt',
    statusApproved: 'Đã phê duyệt',
    statusRejected: 'Đã từ chối',

    // Backend field mapping
    statusField: 'status', // Maps to backend field name
    verifiedField: 'verified', // Maps to backend field name
  },

  // Job Management
  jobs: {
    title: 'Quản lý Công việc',
    description: 'Giám sát và kiểm duyệt các tin tuyển dụng',
    list: 'Danh sách Công việc',
    listDescription: 'Xem xét và quản lý tất cả các tin tuyển dụng trên nền tảng',
    searchPlaceholder: 'Tìm kiếm theo tiêu đề, kỹ năng...',
    filterByCompany: 'Lọc theo công ty...',
    filterByStatus: 'Lọc theo trạng thái',
    allStatuses: 'Tất cả trạng thái',
    newest: 'Mới nhất',
    oldest: 'Cũ nhất',
    titleZA: 'Tiêu đề (Z-A)',
    titleAZ: 'Tiêu đề (A-Z)',
    postedOn: 'Đăng ngày',
    view: 'Xem',
    approve: 'Phê duyệt',
    reject: 'Từ chối',
    deactivate: 'Vô hiệu hóa',
    noJobsFound: 'Không tìm thấy công việc nào phù hợp với tiêu chí.',
    tryAgain: 'Thử lại',

    // Status
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
    pending: 'Chờ duyệt',
    expired: 'Hết hạn',

    // Toast messages
    approveSuccess: 'Đã phê duyệt công việc',
    rejectSuccess: 'Đã từ chối công việc',
    pendingSuccess: 'Đã đưa công việc về trạng thái chờ duyệt',
    updateSuccess: 'Đã cập nhật trạng thái công việc',
    updateError: 'Không thể cập nhật trạng thái công việc',
    loadError: 'Không thể tải danh sách công việc',

    // Backend field mapping  
    statusField: 'status', // Maps to backend field name
  },

  // Transactions
  transactions: {
    title: 'Quản lý Giao dịch',
    description: 'Theo dõi và quản lý tất cả các giao dịch tài chính',
    list: 'Danh sách Giao dịch',
    searchPlaceholder: 'Tìm kiếm theo ID, email...',
    allTypes: 'Tất cả Loại',
    allStatuses: 'Tất cả Trạng thái',

    // Types
    recharge: 'Nạp tiền',
    payment: 'Thanh toán',
    refund: 'Hoàn tiền',

    // Status
    completed: 'Hoàn thành',
    pending: 'Chờ xử lý',
    failed: 'Thất bại',
    cancelled: 'Đã hủy',
  },

  // Status mapping for API
  statusMapping: {
    // User status
    userActive: { api: 'active', display: 'Hoạt động' },
    userBanned: { api: 'banned', display: 'Đã cấm' },

    // Company status
    companyPending: { api: 'pending', display: 'Chờ duyệt' },
    companyApproved: { api: 'approved', display: 'Đã phê duyệt' },
    companyRejected: { api: 'rejected', display: 'Đã từ chối' },

    // Job status
    jobActive: { api: 'ACTIVE', display: 'Hoạt động' },
    jobInactive: { api: 'INACTIVE', display: 'Không hoạt động' },
    jobPending: { api: 'PENDING', display: 'Chờ duyệt' },
    jobExpired: { api: 'EXPIRED', display: 'Hết hạn' },
  },
};

// Helper function to get translation
export const t = (key) => {
  const keys = key.split('.');
  let value = TRANSLATIONS;

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return key;
  }

  return value;
};

// Helper to map display status to API status
export const getApiStatus = (category, displayStatus) => {
  const mapping = TRANSLATIONS.statusMapping;
  for (const key in mapping) {
    if (key.startsWith(category) && mapping[key].display === displayStatus) {
      return mapping[key].api;
    }
  }
  return displayStatus;
};

// Helper to map API status to display status
export const getDisplayStatus = (category, apiStatus) => {
  const mapping = TRANSLATIONS.statusMapping;
  for (const key in mapping) {
    if (key.startsWith(category) && mapping[key].api === apiStatus) {
      return mapping[key].display;
    }
  }
  return apiStatus;
};
