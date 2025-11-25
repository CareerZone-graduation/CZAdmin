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

// Priority Badge Component
const getPriorityBadge = (priority) => {
  const priorityConfig = {
    'urgent': { 
      label: 'Khẩn cấp', 
      className: 'bg-red-500 hover:bg-red-600 text-white border-0' 
    },
    'high': { 
      label: 'Cao', 
      className: 'bg-orange-500 hover:bg-orange-600 text-white border-0' 
    },
    'medium': { 
      label: 'Trung bình', 
      className: 'bg-yellow-500 hover:bg-yellow-600 text-white border-0' 
    },
    'low': { 
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

// User Type Badge Component
const getUserTypeBadge = (userType) => {
  const typeConfig = {
    'candidate': { 
      label: 'Ứng viên', 
      className: 'bg-purple-100 text-purple-800 border-purple-200' 
    },
    'recruiter': { 
      label: 'Nhà tuyển dụng', 
      className: 'bg-blue-100 text-blue-800 border-blue-200' 
    }
  };

  const config = typeConfig[userType] || typeConfig.candidate;
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
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
                <div className="space-y-1">
                  <p className="font-medium">{request.requester?.name || 'N/A'}</p>
                  <div className="flex items-center gap-2">
                    {getUserTypeBadge(request.requester?.userType)}
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
                {getPriorityBadge(request.priority)}
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
