import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, MessageSquare, ArrowUpDown } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';

// Status Badge Component
const getStatusBadge = (status) => {
  const statusConfig = {
    'pending': { 
      label: 'Đang chờ', 
      className: 'bg-yellow-500 hover:bg-yellow-600 text-white border-0' 
    },
    'in-progress': { 
      label: 'Đang xử lý', 
      className: 'bg-blue-500 hover:bg-blue-600 text-white border-0' 
    },
    'resolved': { 
      label: 'Đã giải quyết', 
      className: 'bg-green-500 hover:bg-green-600 text-white border-0' 
    },
    'closed': { 
      label: 'Đã đóng', 
      className: 'bg-gray-500 hover:bg-gray-600 text-white border-0' 
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

// Priority Badge Component - shows "Đã giải quyết" for resolved/closed status
const getPriorityBadge = (priority, status) => {
  // If resolved or closed, show "Đã giải quyết" instead of priority
  if (status === 'resolved' || status === 'closed') {
    return (
      <Badge variant="outline" className="bg-green-500 hover:bg-green-600 text-white border-0">
        Đã giải quyết
      </Badge>
    );
  }

  const priorityConfig = {
    urgent: {
      label: 'Khẩn cấp',
      className: 'bg-red-500 hover:bg-red-600 text-white border-0'
    },
    high: {
      label: 'Cao',
      className: 'bg-orange-500 hover:bg-orange-600 text-white border-0'
    },
    medium: {
      label: 'Trung bình',
      className: 'bg-yellow-500 hover:bg-yellow-600 text-white border-0'
    },
    low: {
      label: 'Thấp',
      className: 'bg-gray-500 hover:bg-gray-600 text-white border-0'
    }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

// User Type Badge Component with enhanced styling
const getUserTypeBadge = (userType, isGuest = false) => {
  if (isGuest) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <span className="text-xs font-medium text-gray-600">Khách</span>
        </div>
      </div>
    );
  }

  const typeConfig = {
    'candidate': { 
      label: 'Ứng viên', 
      icon: '👤',
      dotColor: 'bg-purple-500',
      className: 'bg-purple-50 text-purple-700 border-purple-200' 
    },
    'recruiter': { 
      label: 'Nhà tuyển dụng', 
      icon: '🏢',
      dotColor: 'bg-blue-500',
      className: 'bg-blue-50 text-blue-700 border-blue-200' 
    }
  };

  const config = typeConfig[userType] || typeConfig.candidate;
  
  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${config.className}`}>
        <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
        <span className="text-xs font-medium">{config.label}</span>
      </div>
    </div>
  );
};

// Auth Status Indicator Component
const getAuthStatusIndicator = (isGuest) => {
  if (isGuest) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Chưa đăng nhập</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-xs text-green-600">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <span>Đã xác thực</span>
    </div>
  );
};

// Category Label
const getCategoryLabel = (category) => {
  const categoryLabels = {
    'technical-issue': 'Vấn đề kỹ thuật',
    'account-issue': 'Vấn đề tài khoản',
    'payment-issue': 'Vấn đề thanh toán',
    'job-posting-issue': 'Vấn đề đăng tin',
    'application-issue': 'Vấn đề ứng tuyển',
    'general-inquiry': 'Thắc mắc chung'
  };

  return categoryLabels[category] || category;
};

// Loading Skeleton
const TableLoadingSkeleton = () => (
  <TableBody>
    {[...Array(10)].map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
        <TableCell><Skeleton className="h-16 w-20" /></TableCell>
      </TableRow>
    ))}
  </TableBody>
);

// Main SupportRequestTable Component
export const SupportRequestTable = ({ 
  requests = [], 
  loading = false,
  onSort,
  sortField,
  sortOrder
}) => {
  const navigate = useNavigate();

  const handleRowClick = (requestId) => {
    navigate(`/support/${requestId}`);
  };

  const handleQuickRespond = (e, requestId) => {
    e.stopPropagation();
    navigate(`/support/${requestId}?action=respond`);
  };

  const handleSort = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  const renderSortIcon = (field) => {
    if (sortField === field) {
      return (
        <ArrowUpDown className={`h-4 w-4 ml-1 inline ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
      );
    }
    return <ArrowUpDown className="h-4 w-4 ml-1 inline opacity-30" />;
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Người yêu cầu</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('priority')}
              >
                Độ ưu tiên {renderSortIcon('priority')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('createdAt')}
              >
                Ngày tạo {renderSortIcon('createdAt')}
              </TableHead>
              <TableHead className="w-[120px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableLoadingSkeleton />
        </Table>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Người yêu cầu</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('priority')}
              >
                Độ ưu tiên {renderSortIcon('priority')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('createdAt')}
              >
                Ngày tạo {renderSortIcon('createdAt')}
              </TableHead>
              <TableHead className="w-[120px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} className="h-[400px] text-center">
                <div className="space-y-2">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Không có yêu cầu hỗ trợ nào</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Người yêu cầu</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('priority')}
            >
              Độ ưu tiên {renderSortIcon('priority')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('createdAt')}
            >
              Ngày tạo {renderSortIcon('createdAt')}
            </TableHead>
            <TableHead className="w-[120px]">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow 
              key={request._id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(request._id)}
            >
              <TableCell className="font-mono text-xs">
                {request._id.slice(-8)}
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      request.requester?.isGuest 
                        ? 'bg-gray-100 text-gray-600' 
                        : request.requester?.userType === 'recruiter'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                    }`}>
                      {request.requester?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex flex-col">
                      <p className="font-medium text-sm leading-tight">
                        {request.requester?.name || 'Người dùng ẩn danh'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {request.requester?.email || 'Không có email'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {getUserTypeBadge(request.requester?.userType, request.requester?.isGuest)}
                    {getAuthStatusIndicator(request.requester?.isGuest)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-medium line-clamp-2 max-w-md">
                  {request.subject}
                </p>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {getCategoryLabel(request.category)}
                </span>
              </TableCell>
              <TableCell>
                {getStatusBadge(request.status)}
              </TableCell>
              <TableCell>
                {getPriorityBadge(request.priority, request.status)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(request.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(request._id);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => handleQuickRespond(e, request._id)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
