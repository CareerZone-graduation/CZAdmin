import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserListSkeleton } from '@/components/common/UserListSkeleton';
import { toast } from 'sonner';
import { getUsers, updateUserStatus } from '@/services/userService';
import { UserStats } from './UserStats'; // <-- IMPORT COMPONENT MỚI
import { Pagination } from '@/components/common/Pagination';
import { t } from '@/constants/translations';
import {
  Search,
  User,
  Mail,
  Calendar,
  MoreHorizontal,
  UserCheck,
  UserX,
  Shield,
  X,
  Eye,
  Building2,
  AlertCircle
} from 'lucide-react';

export function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Separate state for input value
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyRegistrationFilter, setCompanyRegistrationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('-createdAt');
  const limit = 10;

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        sort: sortBy
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (roleFilter !== 'all') {
        params.role = roleFilter;
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (companyRegistrationFilter !== 'all' && roleFilter === 'recruiter') {
        params.companyRegistration = companyRegistrationFilter;
      }

      const response = await getUsers(params);
      
      setUsers(response.data.data || []);
      setTotalPages(response.data?.meta?.totalPages || 1);
      setTotalItems(response.data?.meta?.totalItems || 0);
      setCurrentPage(response.data?.meta?.currentPage || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, roleFilter, statusFilter, companyRegistrationFilter, sortBy]);

  // Load users on component mount and when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, roleFilter, statusFilter, companyRegistrationFilter, sortBy]);

  // Handle search action
  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const handleStatusChange = useCallback(async (userId, newStatus) => {
    try {
      // Optimistically update UI
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, active: newStatus === 'active' } : user
      ));

      // Call API to update status
      await updateUserStatus(userId, { status: newStatus });
      
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'banned'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
      // Revert the change on error
      fetchUsers();
    }
  }, [fetchUsers]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">{t('users.admin')}</Badge>;
      case 'recruiter':
        return <Badge className="bg-blue-100 text-blue-800">{t('users.recruiter')}</Badge>;
      case 'candidate':
        return <Badge variant="outline">{t('users.candidate')}</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (active) => {
    return active ? 
      <Badge className="bg-green-100 text-green-800">{t('users.active')}</Badge> :
      <Badge variant="destructive">{t('users.banned')}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('users.title')}</h1>
        <p className="text-gray-600">{t('users.description')}</p>
      </div>

      {/* THÊM COMPONENT THỐNG KÊ TẠI ĐÂY */}
      <UserStats />

      <Card>
        <CardHeader>
          <CardTitle>{t('users.directory')}</CardTitle>
          <CardDescription>
            {t('users.directoryDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('users.searchPlaceholder')}
                value={searchInput}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
                className="pl-10 pr-20"
              />
              <div className="absolute right-2 top-2 flex gap-1">
                {searchInput && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClearSearch}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleSearch}
                  disabled={loading}
                  className="h-6 px-2 text-xs"
                >
                  {t('common.search')}
                </Button>
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t('users.filterByRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('users.allRoles')}</SelectItem>
                <SelectItem value="candidate">{t('users.candidate')}</SelectItem>
                <SelectItem value="recruiter">{t('users.recruiter')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t('users.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('users.allStatus')}</SelectItem>
                <SelectItem value="active">{t('users.active')}</SelectItem>
                <SelectItem value="banned">{t('users.banned')}</SelectItem>
              </SelectContent>
            </Select>
            {roleFilter === 'recruiter' && (
              <Select value={companyRegistrationFilter} onValueChange={setCompanyRegistrationFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Trạng thái công ty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="registered">Đã đăng ký công ty</SelectItem>
                  <SelectItem value="not-registered">Chưa đăng ký công ty</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t('users.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-createdAt">{t('users.newestFirst')}</SelectItem>
                <SelectItem value="createdAt">{t('users.oldestFirst')}</SelectItem>
                <SelectItem value="fullname">{t('users.nameAZ')}</SelectItem>
                <SelectItem value="-fullname">{t('users.nameZA')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active filters indicator */}
          {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all' || companyRegistrationFilter !== 'all') && (
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700 font-medium">{t('users.activeFilters')}</span>
              {searchTerm && (
                <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  <span>{t('common.search')}: "{searchTerm}"</span>
                  <button
                    onClick={handleClearSearch}
                    className="ml-1 hover:bg-blue-200 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {roleFilter !== 'all' && (
                <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  <span>Vai trò: {roleFilter}</span>
                  <button
                    onClick={() => setRoleFilter('all')}
                    className="ml-1 hover:bg-blue-200 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {statusFilter !== 'all' && (
                <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  <span>{t('common.status')}: {statusFilter}</span>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="ml-1 hover:bg-blue-200 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {companyRegistrationFilter !== 'all' && (
                <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  <span>Công ty: {companyRegistrationFilter === 'registered' ? 'Đã đăng ký' : 'Chưa đăng ký'}</span>
                  <button
                    onClick={() => setCompanyRegistrationFilter('all')}
                    className="ml-1 hover:bg-blue-200 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {loading ? (
            <UserListSkeleton />
          ) : (
            <>
              {/* Results count */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  {totalItems > 0 ? (
                    <>
                      {t('users.showing')} {((currentPage - 1) * limit) + 1} {t('users.to')} {Math.min(currentPage * limit, totalItems)} {t('users.of')} {totalItems} người dùng
                      {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all' || companyRegistrationFilter !== 'all') && (
                        <span className="text-blue-600 ml-1">{t('users.filtered')}</span>
                      )}
                    </>
                  ) : (
                    t('users.noUsersFound')
                  )}
                </div>
                {totalItems > 0 && (
                  <div className="text-sm text-gray-500">
                    {t('users.page')} {currentPage} {t('users.of')} {totalPages}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {users.map((user) => (
                  <Card key={user._id} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{user.fullname || 'Chưa cập nhật'}</h3>
                              {getRoleBadge(user.role)}
                              {getStatusBadge(user.active)}
                              {user.role === 'recruiter' && user.hasCompany === false && (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Chưa đăng ký công ty
                                </Badge>
                              )}
                              {user.role === 'recruiter' && user.hasCompany === true && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <Building2 className="w-3 h-3 mr-1" />
                                  Có công ty
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{t('users.joined')} {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/users/${user._id}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Xem chi tiết
                          </Button>
                          {user.active ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(user._id, 'banned')}
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              {t('users.banUser')}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(user._id, 'active')}
                            >
                              <UserCheck className="w-4 h-4 mr-1" />
                              {t('users.activate')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {users.length === 0 && !loading && (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('users.noUsersFound')}</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Trang {currentPage} trên {totalPages}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    loading={loading}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
