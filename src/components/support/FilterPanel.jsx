import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const FilterPanel = ({ 
  filters = {}, 
  onFilterChange, 
  onReset,
  className = ''
}) => {
  const [localFilters, setLocalFilters] = useState({
    status: filters.status || [],
    category: filters.category || '',
    priority: filters.priority || '',
    keyword: filters.keyword || '',
    dateFrom: filters.dateFrom || null,
    dateTo: filters.dateTo || null
  });

  const statusOptions = [
    { value: 'pending', label: 'Đang chờ' },
    { value: 'in-progress', label: 'Đang xử lý' },
    { value: 'resolved', label: 'Đã giải quyết' },
    { value: 'closed', label: 'Đã đóng' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Tất cả danh mục' },
    { value: 'technical-issue', label: 'Vấn đề kỹ thuật' },
    { value: 'account-issue', label: 'Vấn đề tài khoản' },
    { value: 'payment-issue', label: 'Vấn đề thanh toán' },
    { value: 'job-posting-issue', label: 'Vấn đề đăng tin' },
    { value: 'application-issue', label: 'Vấn đề ứng tuyển' },
    { value: 'general-inquiry', label: 'Thắc mắc chung' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'Tất cả độ ưu tiên' },
    { value: 'urgent', label: 'Khẩn cấp' },
    { value: 'high', label: 'Cao' },
    { value: 'medium', label: 'Trung bình' },
    { value: 'low', label: 'Thấp' }
  ];

  const handleStatusToggle = (statusValue) => {
    const newStatus = localFilters.status.includes(statusValue)
      ? localFilters.status.filter(s => s !== statusValue)
      : [...localFilters.status, statusValue];
    
    setLocalFilters(prev => ({ ...prev, status: newStatus }));
  };

  const handleCategoryChange = (value) => {
    // Convert 'all' to empty string for API
    setLocalFilters(prev => ({ ...prev, category: value === 'all' ? '' : value }));
  };

  const handlePriorityChange = (value) => {
    // Convert 'all' to empty string for API
    setLocalFilters(prev => ({ ...prev, priority: value === 'all' ? '' : value }));
  };

  const handleKeywordChange = (e) => {
    setLocalFilters(prev => ({ ...prev, keyword: e.target.value }));
  };

  const handleDateFromChange = (date) => {
    setLocalFilters(prev => ({ ...prev, dateFrom: date }));
  };

  const handleDateToChange = (date) => {
    setLocalFilters(prev => ({ ...prev, dateTo: date }));
  };

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange(localFilters);
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      status: [],
      category: '',
      priority: '',
      keyword: '',
      dateFrom: null,
      dateTo: null
    };
    setLocalFilters(resetFilters);
    if (onReset) {
      onReset();
    }
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };

  const hasActiveFilters = 
    localFilters.status.length > 0 ||
    localFilters.category ||
    localFilters.priority ||
    localFilters.keyword ||
    localFilters.dateFrom ||
    localFilters.dateTo;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleResetFilters}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="keyword">Tìm kiếm</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="keyword"
              placeholder="Tìm trong tiêu đề hoặc mô tả..."
              value={localFilters.keyword}
              onChange={handleKeywordChange}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Checkboxes */}
        <div className="space-y-2">
          <Label>Trạng thái</Label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((status) => (
              <label
                key={status.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localFilters.status.includes(status.value)}
                  onChange={() => handleStatusToggle(status.value)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{status.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Category Select */}
        <div className="space-y-2">
          <Label htmlFor="category">Danh mục</Label>
          <Select value={localFilters.category || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority Select */}
        <div className="space-y-2">
          <Label htmlFor="priority">Độ ưu tiên</Label>
          <Select value={localFilters.priority || 'all'} onValueChange={handlePriorityChange}>
            <SelectTrigger id="priority">
              <SelectValue placeholder="Chọn độ ưu tiên" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Picker */}
        <div className="space-y-2">
          <Label>Khoảng thời gian</Label>
          <div className="grid grid-cols-2 gap-2">
            {/* Date From */}
            <div className="space-y-1">
              <Label htmlFor="dateFrom" className="text-xs text-muted-foreground">
                Từ ngày
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dateFrom"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.dateFrom ? (
                      format(localFilters.dateFrom, 'dd/MM/yyyy', { locale: vi })
                    ) : (
                      <span className="text-muted-foreground">Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateFrom}
                    onSelect={handleDateFromChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-1">
              <Label htmlFor="dateTo" className="text-xs text-muted-foreground">
                Đến ngày
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dateTo"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.dateTo ? (
                      format(localFilters.dateTo, 'dd/MM/yyyy', { locale: vi })
                    ) : (
                      <span className="text-muted-foreground">Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateTo}
                    onSelect={handleDateToChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <Button 
          onClick={handleApplyFilters} 
          className="w-full"
        >
          Áp dụng bộ lọc
        </Button>
      </CardContent>
    </Card>
  );
};
