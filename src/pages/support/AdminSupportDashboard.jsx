import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SupportRequestTable } from '@/components/support/SupportRequestTable';
import { FilterPanel } from '@/components/support/FilterPanel';
import { getAllSupportRequests } from '@/services/supportRequestService';

export const AdminSupportDashboard = () => {
  const [filters, setFilters] = useState({
    status: [],
    category: '',
    priority: '',
    keyword: '',
    dateFrom: null,
    dateTo: null
  });
  
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Build query params
  const queryParams = useMemo(() => {
    const params = {
      filters: {},
      sort: {
        sortBy: `${sortOrder === 'desc' ? '-' : ''}${sortField}`
      },
      pagination: {
        page: currentPage,
        limit: pageSize
      }
    };

    // Add filters
    if (filters.status.length > 0) {
      params.filters.status = filters.status.join(',');
    }
    if (filters.category) {
      params.filters.category = filters.category;
    }
    if (filters.priority) {
      params.filters.priority = filters.priority;
    }
    if (filters.keyword) {
      params.filters.keyword = filters.keyword;
    }
    if (filters.dateFrom) {
      params.filters.fromDate = filters.dateFrom.toISOString();
    }
    if (filters.dateTo) {
      params.filters.toDate = filters.dateTo.toISOString();
    }

    return params;
  }, [filters, sortField, sortOrder, currentPage]);

  // Fetch support requests
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['admin-support-requests', queryParams],
    queryFn: async () => {
      console.log('🔍 Fetching admin support requests with params:', queryParams);
      const result = await getAllSupportRequests(
        queryParams.filters,
        queryParams.sort,
        queryParams.pagination
      );
      console.log('✅ Admin support requests result:', result);
      return result;
    },
    keepPreviousData: true,
    onError: (err) => {
      console.error('❌ Error fetching admin support requests:', err);
    }
  });

  // Parse backend response structure: { success, message, data: [...], meta: {...} }
  const requests = data?.data || [];
  const meta = data?.meta || {};
  
  // Map meta to pagination format
  const pagination = {
    total: meta.totalItems || 0,
    totalPages: meta.totalPages || 0,
    page: meta.currentPage || 1,
    limit: meta.limit || 10
  };

  // Calculate stats from requests
  const stats = {
    pendingCount: requests.filter(r => r.status === 'pending').length,
    inProgressCount: requests.filter(r => r.status === 'in-progress').length,
    resolvedCount: requests.filter(r => r.status === 'resolved').length,
    closedCount: requests.filter(r => r.status === 'closed').length
  };

  console.log('📊 Dashboard data:', { requests, pagination, stats, rawData: data });

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setFilters({
      status: [],
      category: '',
      priority: '',
      keyword: '',
      dateFrom: null,
      dateTo: null
    });
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Overview cards data
  const overviewCards = [
    {
      title: 'Đang chờ',
      count: stats.pendingCount || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Đang xử lý',
      count: stats.inProgressCount || 0,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Đã giải quyết',
      count: stats.resolvedCount || 0,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Đã đóng',
      count: stats.closedCount || 0,
      icon: XCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Quản lý Yêu cầu Hỗ trợ
        </h1>
        <p className="text-muted-foreground mt-2">
          Xem và quản lý tất cả yêu cầu hỗ trợ từ người dùng
        </p>
      </div>

      {/* Error Alert */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Có lỗi xảy ra khi tải dữ liệu'}
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold mt-2">
                        {card.count}
                      </p>
                    </div>
                    <div className={`${card.bgColor} p-3 rounded-full`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Panel */}
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleFilterReset}
          />
        </div>

        {/* Table Section */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results Summary */}
          {!isLoading && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Hiển thị {requests.length > 0 ? ((currentPage - 1) * pageSize + 1) : 0} - {Math.min(currentPage * pageSize, pagination.total || 0)} trong tổng số {pagination.total || 0} yêu cầu
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                Làm mới
              </Button>
            </div>
          )}

          {/* Support Request Table */}
          <SupportRequestTable
            requests={requests}
            loading={isLoading}
            onSort={handleSort}
            sortField={sortField}
            sortOrder={sortOrder}
          />

          {/* Pagination Controls */}
          {!isLoading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Trang {currentPage} / {pagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === pagination.totalPages || isLoading}
                >
                  Sau
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
};

