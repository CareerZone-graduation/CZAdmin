import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AnalyticsCharts } from '@/components/support/AnalyticsCharts';
import { getAnalytics } from '@/services/supportRequestService';
import { toast } from 'sonner';

export const SupportAnalyticsPage = () => {
  const navigate = useNavigate();

  // Date range state - default to last 30 days
  const [dateFrom, setDateFrom] = useState(startOfDay(subDays(new Date(), 30)));
  const [dateTo, setDateTo] = useState(endOfDay(new Date()));

  // Fetch analytics data
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['support-analytics', dateFrom, dateTo],
    queryFn: () => getAnalytics({
      fromDate: dateFrom?.toISOString(),
      toDate: dateTo?.toISOString()
    }),
    keepPreviousData: true
  });

  const analytics = data?.data;

  // Handle date range change
  const handleDateFromChange = (date) => {
    if (date) {
      setDateFrom(startOfDay(date));
    }
  };

  const handleDateToChange = (date) => {
    if (date) {
      setDateTo(endOfDay(date));
    }
  };

  // Quick date range presets
  const handleQuickRange = (days) => {
    setDateFrom(startOfDay(subDays(new Date(), days)));
    setDateTo(endOfDay(new Date()));
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/support')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Phân tích Yêu cầu Hỗ trợ
          </h1>
          <p className="text-muted-foreground mt-2">
            Xem thống kê và phân tích chi tiết về yêu cầu hỗ trợ
          </p>
        </div>
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

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bộ lọc thời gian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Quick Range Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickRange(7)}
              >
                7 ngày qua
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickRange(30)}
              >
                30 ngày qua
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickRange(90)}
              >
                90 ngày qua
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDateFrom(startOfDay(new Date(new Date().getFullYear(), 0, 1)));
                  setDateTo(endOfDay(new Date()));
                }}
              >
                Năm nay
              </Button>
            </div>

            {/* Custom Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date From */}
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Từ ngày</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dateFrom"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? (
                        format(dateFrom, 'dd/MM/yyyy', { locale: vi })
                      ) : (
                        <span className="text-muted-foreground">Chọn ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={handleDateFromChange}
                      initialFocus
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <Label htmlFor="dateTo">Đến ngày</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dateTo"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? (
                        format(dateTo, 'dd/MM/yyyy', { locale: vi })
                      ) : (
                        <span className="text-muted-foreground">Chọn ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={handleDateToChange}
                      initialFocus
                      disabled={(date) => date > new Date() || (dateFrom && date < dateFrom)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => refetch()}
                disabled={isLoading}
                variant="outline"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>

            {/* Date Range Display */}
            {dateFrom && dateTo && (
              <div className="text-sm text-muted-foreground">
                Hiển thị dữ liệu từ{' '}
                <span className="font-medium">
                  {format(dateFrom, 'dd/MM/yyyy', { locale: vi })}
                </span>
                {' '}đến{' '}
                <span className="font-medium">
                  {format(dateTo, 'dd/MM/yyyy', { locale: vi })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="h-20 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="h-64 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : analytics ? (
        <AnalyticsCharts analytics={analytics} loading={isLoading} />
      ) : (
        <Card>
          <CardContent className="p-12">
            <div className="text-center text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <p>Không có dữ liệu phân tích trong khoảng thời gian này</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Insights */}
      {analytics && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Breakdown */}
              <div>
                <h3 className="font-semibold mb-3">Phân bổ theo trạng thái</h3>
                <div className="space-y-2">
                  {analytics.countByStatus?.map((item) => {
                    const statusLabels = {
                      'pending': 'Đang chờ',
                      'in-progress': 'Đang xử lý',
                      'resolved': 'Đã giải quyết',
                      'closed': 'Đã đóng'
                    };
                    const percentage = analytics.totalRequests > 0
                      ? ((item.count / analytics.totalRequests) * 100).toFixed(1)
                      : 0;
                    
                    return (
                      <div key={item._id} className="flex items-center justify-between">
                        <span className="text-sm">{statusLabels[item._id] || item._id}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.count}</span>
                          <span className="text-xs text-muted-foreground">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Breakdown */}
              <div>
                <h3 className="font-semibold mb-3">Phân bổ theo danh mục</h3>
                <div className="space-y-2">
                  {analytics.countByCategory?.map((item) => {
                    const categoryLabels = {
                      'technical-issue': 'Vấn đề kỹ thuật',
                      'account-issue': 'Vấn đề tài khoản',
                      'payment-issue': 'Vấn đề thanh toán',
                      'job-posting-issue': 'Vấn đề đăng tin',
                      'application-issue': 'Vấn đề ứng tuyển',
                      'general-inquiry': 'Thắc mắc chung'
                    };
                    const percentage = analytics.totalRequests > 0
                      ? ((item.count / analytics.totalRequests) * 100).toFixed(1)
                      : 0;
                    
                    return (
                      <div key={item._id} className="flex items-center justify-between">
                        <span className="text-sm">{categoryLabels[item._id] || item._id}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.count}</span>
                          <span className="text-xs text-muted-foreground">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

