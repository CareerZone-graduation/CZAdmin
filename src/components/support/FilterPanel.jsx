import React, { useState, useEffect } from 'react';
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
  className = '',
  hideGuestFilter = false
}) => {
  const [localFilters, setLocalFilters] = useState({
    status: filters.status || [],
    category: filters.category || '',
    priority: filters.priority || '',
    keyword: filters.keyword || '',
    dateFrom: filters.dateFrom || null,
    dateTo: filters.dateTo || null,
    userType: filters.userType || '',
    isGuest: filters.isGuest || ''
  });

  // Sync localFilters when filters prop changes (e.g., on reset)
  useEffect(() => {
    setLocalFilters({
      status: filters.status || [],
      category: filters.category || '',
      priority: filters.priority || '',
      keyword: filters.keyword || '',
      dateFrom: filters.dateFrom || null,
      dateTo: filters.dateTo || null,
      userType: filters.userType || '',
      isGuest: filters.isGuest || ''
    });
  }, [filters]);

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

  const userTypeOptions = [
    { value: 'all', label: 'Tất cả loại người dùng', icon: '👥', color: 'gray' },
    { value: 'candidate', label: 'Ứng viên', icon: '👤', color: 'purple' },
    { value: 'recruiter', label: 'Nhà tuyển dụng', icon: '🏢', color: 'blue' }
  ];

  const guestOptions = [
    { value: 'all', label: 'Tất cả', icon: '🔄', description: 'Hiển thị tất cả yêu cầu' },
    { value: 'true', label: 'Khách', icon: '🔓', description: 'Chưa đăng nhập' },
    { value: 'false', label: 'Thành viên', icon: '🔐', description: 'Đã đăng nhập' }
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

  const handleUserTypeChange = (value) => {
    setLocalFilters(prev => ({ ...prev, userType: value === 'all' ? '' : value }));
  };

  const handleGuestChange = (value) => {
    setLocalFilters(prev => ({ ...prev, isGuest: value === 'all' ? '' : value }));
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
    console.log('🎯 Applying filters:', localFilters);
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
      dateTo: null,
      userType: '',
      isGuest: ''
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
    localFilters.dateTo ||
    localFilters.userType ||
    localFilters.isGuest;

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

        {/* User Classification Section - Only show userType filter when hideGuestFilter is true */}
        {!hideGuestFilter ? (
          <div className="space-y-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-semibold text-slate-700">Phân loại người dùng</span>
            </div>

            {/* User Type - Visual Cards */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-500 uppercase tracking-wide">Loại tài khoản</Label>
              <div className="grid grid-cols-1 gap-2">
                {userTypeOptions.map((type) => {
                  const isSelected = (localFilters.userType || 'all') === type.value;
                  const colorClasses = {
                    gray: isSelected ? 'border-slate-400 bg-slate-100' : 'border-slate-200 hover:border-slate-300',
                    purple: isSelected ? 'border-purple-400 bg-purple-50' : 'border-slate-200 hover:border-purple-300',
                    blue: isSelected ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
                  };
                  const dotColors = {
                    gray: 'bg-slate-400',
                    purple: 'bg-purple-500',
                    blue: 'bg-blue-500'
                  };
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleUserTypeChange(type.value)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left ${colorClasses[type.color]} ${isSelected ? 'shadow-sm' : ''}`}
                    >
                      <span className="text-lg">{type.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">{type.label}</span>
                          {isSelected && (
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full ${dotColors[type.color]}`}></div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auth Status - Toggle Cards */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-500 uppercase tracking-wide">Trạng thái xác thực</Label>
              <div className="grid grid-cols-3 gap-2">
                {guestOptions.map((option) => {
                  const isSelected = (localFilters.isGuest || 'all') === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleGuestChange(option.value)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                          : 'border-slate-200 hover:border-indigo-300 bg-white'
                      }`}
                    >
                      <span className="text-xl">{option.icon}</span>
                      <span className={`text-xs font-medium ${isSelected ? 'text-indigo-700' : 'text-slate-600'}`}>
                        {option.label}
                      </span>
                      <span className="text-[10px] text-slate-400 text-center leading-tight">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Filter Summary */}
            {(localFilters.userType || localFilters.isGuest) && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-500">Đang lọc:</span>
                <div className="flex flex-wrap gap-1">
                  {localFilters.userType && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">
                      {userTypeOptions.find(t => t.value === localFilters.userType)?.icon}
                      {userTypeOptions.find(t => t.value === localFilters.userType)?.label}
                    </span>
                  )}
                  {localFilters.isGuest && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                      {guestOptions.find(g => g.value === localFilters.isGuest)?.icon}
                      {guestOptions.find(g => g.value === localFilters.isGuest)?.label}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Simplified User Type Filter when hideGuestFilter is true */
          <div className="space-y-2">
            <Label htmlFor="userType">Loại tài khoản</Label>
            <div className="grid grid-cols-1 gap-2">
              {userTypeOptions.map((type) => {
                const isSelected = (localFilters.userType || 'all') === type.value;
                const colorClasses = {
                  gray: isSelected ? 'border-slate-400 bg-slate-100' : 'border-slate-200 hover:border-slate-300',
                  purple: isSelected ? 'border-purple-400 bg-purple-50' : 'border-slate-200 hover:border-purple-300',
                  blue: isSelected ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
                };
                const dotColors = {
                  gray: 'bg-slate-400',
                  purple: 'bg-purple-500',
                  blue: 'bg-blue-500'
                };
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleUserTypeChange(type.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left ${colorClasses[type.color]} ${isSelected ? 'shadow-sm' : ''}`}
                  >
                    <span className="text-lg">{type.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">{type.label}</span>
                        {isSelected && (
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                      </div>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${dotColors[type.color]}`}></div>
                  </button>
                );
              })}
            </div>
            {localFilters.userType && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-500">Đang lọc:</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">
                  {userTypeOptions.find(t => t.value === localFilters.userType)?.icon}
                  {userTypeOptions.find(t => t.value === localFilters.userType)?.label}
                </span>
              </div>
            )}
          </div>
        )}

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
