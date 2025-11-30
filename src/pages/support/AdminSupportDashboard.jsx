import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX
} from 'lucide-react';
import { SupportRequestTable } from '@/components/support/SupportRequestTable';
import { FilterPanel } from '@/components/support/FilterPanel';
import { getAllSupportRequests } from '@/services/supportRequestService';

export const AdminSupportDashboard = () => {
  // Tab state: 'authenticated' or 'guest'
  const [activeTab, setActiveTab] = useState('authenticated');

  const [filters, setFilters] = useState({
    status: [],
    category: '',
    priority: '',
    keyword: '',
    dateFrom: null,
    dateTo: null,
    userType: ''
  });

  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Build query params - isGuest is determined by activeTab
  const queryParams = useMemo(() => {
    const params = {
      filters: {
        // Tab determines isGuest filter
        isGuest: activeTab === 'guest' ? 'true' : 'false'
      },
      sort: {
        sortBy: `${sortOrder === 'desc' ? '-' : ''}${sortField}`
      },
      pagination: {
        page: currentPage,
        limit: pageSize
      }
    };

    // Add other filters
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
    if (filters.userType) {
      params.filters.userType = filters.userType;
    }

    return params;
  }, [filters, sortField, sortOrder, currentPage, activeTab]);

  // Fetch authenticated users' requests for stats
  const { data: authData, isLoading: isLoadingAuthStats } = useQuery({
    queryKey: ['admin-support-requests-stats-auth'],
    queryFn: async () => {
      const result = await getAllSupportRequests(
        { isGuest: 'false' },
        { sortBy: '-createdAt' },
        { page: 1, limit: 100 }
      );
      return result;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false
  });

  // Fetch guest users' requests for stats
  const { data: guestData, isLoading: isLoadingGuestStats } = useQuery({
    queryKey: ['admin-support-requests-stats-guest'],
    queryFn: async () => {
      const result = await getAllSupportRequests(
        { isGuest: 'true' },
        { sortBy: '-createdAt' },
        { page: 1, limit: 100 }
      );
      return result;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false
  });

  const isLoadingStats = isLoadingAuthStats || isLoadingGuestStats;

  // Calculate total stats from BOTH authenticated and guest requests
  const authRequests = authData?.data || [];
  const guestRequests = guestData?.data || [];
  const allRequests = [...authRequests, ...guestRequests];
  const stats = {
    pendingCount: allRequests.filter((r) => r.status === 'pending').length,
    inProgressCount: allRequests.filter((r) => r.status === 'in-progress').length,
    resolvedCount: allRequests.filter((r) => r.status === 'resolved').length,
    closedCount: allRequests.filter((r) => r.status === 'closed').length
  };

  // Fetch support requests for current tab
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['admin-support-requests', JSON.stringify(queryParams)],
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
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false
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

  console.log('📊 Dashboard data:', { requests, pagination, stats, rawData: data });

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when switching tabs
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    console.log('🔄 Filter changed:', newFilters);
    setFilters({ ...newFilters });
    setCurrentPage(1);
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setFilters({
      status: [],
      category: '',
      priority: '',
      keyword: '',
      dateFrom: null,
      dateTo: null,
      userType: ''
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
          Quản lý yêu cầu hỗ trợ
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

      {/* Overview Cards - Shows TOTAL stats from both tabs */}
      {isLoadingStats ? (
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

      {/* Tabs for User Type */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
          <TabsTrigger
            value="authenticated"
            className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
          >
            <UserCheck className="h-4 w-4" />
            <span>Thành viên</span>
          </TabsTrigger>
          <TabsTrigger
            value="guest"
            className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700"
          >
            <UserX className="h-4 w-4" />
            <span>Khách vãng lai</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content - Same layout for both tabs */}
        <TabsContent value={activeTab} className="mt-0">
          {/* Tab Description */}
          <div className="mb-4 p-3 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2">
              {activeTab === 'authenticated' ? (
                <>
                  <div className="p-2 rounded-full bg-green-100">
                    <UserCheck className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Yêu cầu từ thành viên</p>
                    <p className="text-xs text-muted-foreground">
                      Các yêu cầu hỗ trợ từ người dùng đã đăng nhập (Ứng viên hoặc Nhà tuyển dụng)
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 rounded-full bg-gray-100">
                    <UserX className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Yêu cầu từ khách</p>
                    <p className="text-xs text-muted-foreground">
                      Các yêu cầu hỗ trợ từ người dùng chưa đăng nhập (khách vãng lai)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Panel */}
            <div className="lg:col-span-1">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleFilterReset}
                hideGuestFilter={true}
              />
            </div>

            {/* Table Section */}
            <div className="lg:col-span-3 space-y-4">
              {/* Results Summary */}
              {!isLoading && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Hiển thị{' '}
                    {requests.length > 0
                      ? (currentPage - 1) * pageSize + 1
                      : 0}{' '}
                    - {Math.min(currentPage * pageSize, pagination.total || 0)}{' '}
                    trong tổng số {pagination.total || 0} yêu cầu
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
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
};

