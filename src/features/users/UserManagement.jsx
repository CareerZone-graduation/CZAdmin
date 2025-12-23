import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import ReasonDialog from '@/components/common/ReasonDialog';
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
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL parameters
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || 'all');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [companyRegistrationFilter, setCompanyRegistrationFilter] = useState(searchParams.get('company') || 'all');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-createdAt');
  const limit = 10;

  // States for ReasonDialog
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [statusChangingUser, setStatusChangingUser] = useState(null);
  const [newStatusPending, setNewStatusPending] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (roleFilter !== 'all') params.set('role', roleFilter);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (companyRegistrationFilter !== 'all') params.set('company', companyRegistrationFilter);
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (sortBy !== '-createdAt') params.set('sort', sortBy);

    setSearchParams(params, { replace: true });
  }, [searchTerm, roleFilter, statusFilter, companyRegistrationFilter, currentPage, sortBy, setSearchParams]);

  // Handle external search params changes (e.g. browser back button)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const role = searchParams.get('role') || 'all';
    const status = searchParams.get('status') || 'all';
    const company = searchParams.get('company') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;
    const sort = searchParams.get('sort') || '-createdAt';

    if (q !== searchTerm) setSearchTerm(q);
    if (q !== searchInput) setSearchInput(q);
    if (role !== roleFilter) setRoleFilter(role);
    if (status !== statusFilter) setStatusFilter(status);
    if (company !== companyRegistrationFilter) setCompanyRegistrationFilter(company);
    if (page !== currentPage) setCurrentPage(page);
    if (sort !== sortBy) setSortBy(sort);
  }, [searchParams]); // Only run when URL params change

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

  const isFirstRender = useRef(true);

  // Reset to first page when filters change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCurrentPage(1);
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

  const handleStatusChangeClick = (userId, newStatus) => {
    setStatusChangingUser(users.find(u => u._id === userId));
    setNewStatusPending(newStatus);
    setReasonDialogOpen(true);
  };

  const confirmStatusChange = async (reason) => {
    if (!statusChangingUser) return;

    try {
      setIsUpdatingStatus(true);
      const userId = statusChangingUser._id;

      // Call API to update status with reason
      await updateUserStatus(userId, { status: newStatusPending, reason });

      // Update UI after success
      setUsers(prev => prev.map(user =>
        user._id === userId ? { ...user, active: newStatusPending === 'active' } : user
      ));

      toast.success(newStatusPending === 'active' ? 'Đã kích hoạt người dùng thành công' : 'Đã khóa người dùng thành công');
      setReasonDialogOpen(false);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Không thể cập nhật trạng thái người dùng');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('users.title')}</h1>
        <p className="text-slate-500">{t('users.description')}</p>
      </div>

      {/* THÊM COMPONENT THỐNG KÊ TẠI ĐÂY */}
      <UserStats />

      <Card className="border-none shadow-xl shadow-slate-200/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{t('users.directory')}</CardTitle>
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
                className="pl-10 pr-20 focus-visible:ring-blue-500"
              />
              <div className="absolute right-2 top-2 flex gap-1">
                {searchInput && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClearSearch}
                    className="h-6 w-6 p-0 hover:bg-slate-100"
                  >
                    <X className="w-3 h-3 text-slate-500" />
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleSearch}
                  disabled={loading}
                  className="h-6 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                >
                  {t('common.search')}
                </Button>
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-white border-slate-200 focus:ring-blue-500">
                <SelectValue placeholder={t('users.filterByRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('users.allRoles')}</SelectItem>
                <SelectItem value="candidate">{t('users.candidate')}</SelectItem>
                <SelectItem value="recruiter">{t('users.recruiter')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-white border-slate-200 focus:ring-blue-500">
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
                <SelectTrigger className="w-full sm:w-48 bg-white border-slate-200 focus:ring-blue-500">
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
              <SelectTrigger className="w-full sm:w-40 bg-white border-slate-200 focus:ring-blue-500">
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
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
              <span className="text-sm text-blue-700 font-semibold mr-2">{t('users.activeFilters')}</span>
              {searchTerm && (
                <div className="flex items-center gap-1 bg-white text-blue-800 px-3 py-1 rounded-xl text-xs border border-blue-200 shadow-sm">
                  <span>{t('common.search')}: <span className="font-bold">"{searchTerm}"</span></span>
                  <button
                    onClick={handleClearSearch}
                    className="ml-1 hover:bg-slate-100 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {roleFilter !== 'all' && (
                <div className="flex items-center gap-1 bg-white text-blue-800 px-3 py-1 rounded-xl text-xs border border-blue-200 shadow-sm">
                  <span>Vai trò: <span className="font-bold">{roleFilter}</span></span>
                  <button
                    onClick={() => setRoleFilter('all')}
                    className="ml-1 hover:bg-slate-100 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {statusFilter !== 'all' && (
                <div className="flex items-center gap-1 bg-white text-blue-800 px-3 py-1 rounded-xl text-xs border border-blue-200 shadow-sm">
                  <span>{t('common.status')}: <span className="font-bold">{statusFilter}</span></span>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="ml-1 hover:bg-slate-100 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {companyRegistrationFilter !== 'all' && (
                <div className="flex items-center gap-1 bg-white text-blue-800 px-3 py-1 rounded-xl text-xs border border-blue-200 shadow-sm">
                  <span>Công ty: <span className="font-bold">{companyRegistrationFilter === 'registered' ? 'Đã đăng ký' : 'Chưa đăng ký'}</span></span>
                  <button
                    onClick={() => setCompanyRegistrationFilter('all')}
                    className="ml-1 hover:bg-slate-100 rounded-full p-0.5"
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
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-slate-500">
                  {totalItems > 0 ? (
                    <>
                      {t('users.showing')} <span className="font-bold text-slate-900">{((currentPage - 1) * limit) + 1}</span> {t('users.to')} <span className="font-bold text-slate-900">{Math.min(currentPage * limit, totalItems)}</span> {t('users.of')} <span className="font-bold text-slate-900">{totalItems}</span> người dùng
                      {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all' || companyRegistrationFilter !== 'all') && (
                        <span className="text-blue-600 ml-1 font-medium">{t('users.filtered')}</span>
                      )}
                    </>
                  ) : (
                    t('users.noUsersFound')
                  )}
                </div>
                {totalItems > 0 && (
                  <div className="text-sm font-medium text-slate-400">
                    {t('users.page')} <span className="text-slate-900">{currentPage}</span> / {totalPages}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {users.map((user) => (
                  <Card key={user._id} className="border border-slate-100 hover:shadow-lg hover:shadow-slate-200/50 transition-all group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="relative">
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 shadow-inner group-hover:scale-110 transition-transform">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.fullname} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-7 h-7 text-slate-400" />
                              )}
                            </div>
                            {user.active && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full" />}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-bold text-slate-900 text-lg">{user.fullname || 'Chưa cập nhật'}</h3>
                              {getRoleBadge(user.role)}
                              {getStatusBadge(user.active)}
                              {user.role === 'recruiter' && user.hasCompany === false && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-bold text-[10px] uppercase">
                                  Chưa đăng ký công ty
                                </Badge>
                              )}
                              {user.role === 'recruiter' && user.hasCompany === true && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-[10px] uppercase">
                                  <Building2 className="w-3 h-3 mr-1" />
                                  Có công ty
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
                              <div className="flex items-center space-x-1.5">
                                <Mail className="w-4 h-4 text-slate-300" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <Calendar className="w-4 h-4 text-slate-300" />
                                <span>{t('users.joined')} <span className="font-medium text-slate-700">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span></span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/users/${user._id}`)}
                            className="h-10 px-4 rounded-xl border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all font-semibold"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Chi tiết
                          </Button>
                          {user.active ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChangeClick(user._id, 'banned')}
                              className="h-10 px-4 rounded-xl border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all font-semibold"
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              {t('users.banUser')}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChangeClick(user._id, 'active')}
                              className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200/50 transition-all font-semibold"
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
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
                <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6">
                    <User className="w-10 h-10 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-bold text-lg">{t('users.noUsersFound')}</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-10">
                  <div className="text-sm text-slate-400 font-medium">
                    Trang <span className="text-slate-900 font-bold">{currentPage}</span> / {totalPages}
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

      {/* Status Change Reason Dialog */}
      <ReasonDialog
        open={reasonDialogOpen}
        onOpenChange={setReasonDialogOpen}
        title={newStatusPending === 'active' ? t('users.unlockTitle') : t('users.lockTitle')}
        description={
          newStatusPending === 'active'
            ? `${t('users.unlockDescription')} (${statusChangingUser?.fullname || statusChangingUser?.email})`
            : `${t('users.lockDescription')} (${statusChangingUser?.fullname || statusChangingUser?.email})`
        }
        confirmText={newStatusPending === 'active' ? t('users.confirmUnlock') : t('users.confirmLock')}
        variant={newStatusPending === 'active' ? 'default' : 'destructive'}
        placeholder={t('users.reasonPlaceholder')}
        isLoading={isUpdatingStatus}
        onConfirm={confirmStatusChange}
      />
    </div>
  );
}
