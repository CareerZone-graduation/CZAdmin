import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const PAYMENT_METHODS = [
  { value: 'all', label: 'Tất cả phương thức' },
  { value: 'VNPAY', label: 'VNPAY' },
  { value: 'ZALOPAY', label: 'ZaloPay' },
  { value: 'MOMO', label: 'MoMo' }
];

const TRANSACTION_STATUSES = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'SUCCESS', label: 'Thành công' },
  { value: 'PENDING', label: 'Đang xử lý' },
  { value: 'FAILED', label: 'Thất bại' },
  { value: 'CANCELLED', label: 'Đã hủy' }
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Mặc định' },
  { value: '-createdAt', label: 'Mới nhất trước' },
  { value: 'createdAt', label: 'Cũ nhất trước' },
  { value: '-amountPaid', label: 'Số tiền cao nhất' },
  { value: 'amountPaid', label: 'Số tiền thấp nhất' }
];

export const TransactionFilters = ({ 
  filters, 
  onFiltersChange, 
  onSearch,
  onClearFilters,
  loading = false,
  totalResults = 0
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearch = () => {
    onSearch(localFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      search: '',
      status: 'all',
      paymentMethod: 'all',
      startDate: '',
      endDate: '',
      sort: 'default'
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.search) count++;
    if (localFilters.status && localFilters.status !== 'all') count++;
    if (localFilters.paymentMethod && localFilters.paymentMethod !== 'all') count++;
    if (localFilters.startDate || localFilters.endDate) count++;
    if (localFilters.sort && localFilters.sort !== 'default') count++;
    return count;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Bộ lọc & Tìm kiếm</CardTitle>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFiltersCount()} bộ lọc đang áp dụng
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Ẩn' : 'Hiện'} bộ lọc nâng cao
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo email, tên, mã giao dịch..."
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Tìm kiếm
          </Button>
          {getActiveFiltersCount() > 0 && (
            <Button variant="outline" onClick={handleClearAll}>
              <X className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status-filter">Trạng thái</Label>
            <Select 
              value={localFilters.status || 'all'} 
              onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-filter">Phương thức thanh toán</Label>
            <Select 
              value={localFilters.paymentMethod || 'all'} 
              onValueChange={(value) => handleFilterChange('paymentMethod', value === 'all' ? '' : value)}
            >
              <SelectTrigger id="payment-filter">
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort-filter">Sắp xếp</Label>
            <Select 
              value={localFilters.sort || 'default'} 
              onValueChange={(value) => handleFilterChange('sort', value === 'default' ? '' : value)}
            >
              <SelectTrigger id="sort-filter">
                <SelectValue placeholder="Chọn cách sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="pt-4 border-t space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Bộ lọc nâng cao
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Từ ngày</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={localFilters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  max={localFilters.endDate || undefined}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">Đến ngày</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={localFilters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  min={localFilters.startDate || undefined}
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {totalResults > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Tìm thấy <span className="font-medium text-foreground">{totalResults.toLocaleString()}</span> giao dịch
              {getActiveFiltersCount() > 0 && (
                <> với <span className="font-medium text-foreground">{getActiveFiltersCount()}</span> bộ lọc được áp dụng</>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
