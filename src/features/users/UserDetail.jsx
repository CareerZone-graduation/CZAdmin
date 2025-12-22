import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { getUserDetail, updateUserStatus } from '@/services/userService';
import { EntityNavigationLink } from '@/components/common/EntityNavigationLink';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Shield,
  Building2,
  MapPin,
  Phone,
  Globe,
  Briefcase,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  UserCheck,
  Package,
  BarChart3,
  Eye,
  Quote,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

export function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userDetail, setUserDetail] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setLoading(true);
        const response = await getUserDetail(id);
        setUserDetail(response.data.data);
      } catch (error) {
        console.error('Error fetching user detail:', error);
        toast.error('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  const handleToggleStatus = async () => {
    try {
      setUpdating(true);
      const newStatus = userDetail.active ? 'banned' : 'active';
      const response = await updateUserStatus(id, { status: newStatus });

      if (response.data.success) {
        toast.success(userDetail.active ? 'Đã khóa tài khoản' : 'Đã kích hoạt tài khoản');
        setUserDetail(prev => ({ ...prev, active: !prev.active }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái người dùng');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy thông tin người dùng</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case 'recruiter':
        return <Badge className="bg-blue-100 text-blue-800">Nhà tuyển dụng</Badge>;
      case 'candidate':
        return <Badge variant="outline">Ứng viên</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (active) => {
    return active ?
      <Badge className="bg-green-100 text-green-800">Hoạt động</Badge> :
      <Badge variant="destructive">Đã khóa</Badge>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="group pl-0 text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Quay lại danh sách
          </Button>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {userDetail.role === 'recruiter' ? 'Thông tin nhà tuyển dụng' : 'Thông tin ứng viên'}
          </h1>
        </div>

        {/* Quick Actions Placeholder */}
        <div className="flex items-center gap-2">
          {userDetail.role !== 'admin' && (
            userDetail.active ? (
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleToggleStatus}
                disabled={updating}
              >
                {updating ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                Khóa tài khoản
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                onClick={handleToggleStatus}
                disabled={updating}
              >
                {updating ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <UserCheck className="w-4 h-4 mr-2" />}
                Kích hoạt tài khoản
              </Button>
            )
          )}
        </div>
      </div>

      {/* Main Profile Header Section */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-purple-600/10 rounded-3xl blur-3xl -z-10 opacity-50 transition-opacity group-hover:opacity-100" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Identity Card */}
          <Card className="lg:col-span-2 overflow-hidden border-none shadow-xl shadow-blue-500/5 bg-white/80 backdrop-blur-md">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
                <div className="absolute top-12 left-1/4 w-32 h-32 rounded-full bg-indigo-200/20 blur-2xl" />
              </div>
            </div>
            <CardContent className="relative pt-0 px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-end -mt-12 gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-2xl ring-4 ring-white">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      {userDetail.role === 'candidate' ? (
                        userDetail.profile?.avatar ? (
                          <img src={userDetail.profile.avatar} alt={userDetail.profile.fullname} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-50"><User className="w-12 h-12 text-blue-200" /></div>
                        )
                      ) : (
                        userDetail.company?.logo ? (
                          <img src={userDetail.company.logo} alt={userDetail.company?.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-indigo-50"><Building2 className="w-12 h-12 text-indigo-200" /></div>
                        )
                      )}
                    </div>
                  </div>
                  {userDetail.active && (
                    <div className="absolute bottom-1 right-1 w-6 h-6 border-4 border-white bg-green-500 rounded-full" />
                  )}
                </div>

                <div className="flex-1 space-y-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-3xl font-bold text-slate-900">
                      {userDetail.profile?.fullname || 'Chưa cập nhật'}
                    </h2>
                    {getRoleBadge(userDetail.role)}
                    {getStatusBadge(userDetail.active)}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 text-sm">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span>{userDetail.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>Tham gia: <span className="text-slate-700 font-medium">{new Date(userDetail.createdAt).toLocaleDateString('vi-VN')}</span></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {userDetail.role === 'candidate' ? 'Thông tin liên hệ' : 'Liên hệ nhà tuyển dụng'}
                  </h4>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><Phone className="w-4 h-4" /></div>
                      <div className="text-sm">
                        <p className="text-slate-400 text-[11px] leading-tight">Điện thoại</p>
                        <p className="text-slate-700 font-medium">
                          {userDetail.role === 'candidate' ? (userDetail.profile?.phone || 'N/A') : (userDetail.company?.contactInfo?.phone || 'N/A')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600"><MapPin className="w-4 h-4" /></div>
                      <div className="text-sm">
                        <p className="text-slate-400 text-[11px] leading-tight">Địa chỉ</p>
                        <p className="text-slate-700 font-medium truncate max-w-[200px]">
                          {userDetail.role === 'candidate' ? (userDetail.profile?.address || 'Chưa cập nhật') : (userDetail.company?.address || 'Chưa cập nhật')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {userDetail.role === 'candidate' ? 'Hoạt động CV' : 'Tổng quan công việc'}
                  </h4>
                  <div className="grid gap-4">
                    {userDetail.role === 'candidate' ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600"><FileText className="w-4 h-4" /></div>
                        <div className="text-sm">
                          <p className="text-slate-400 text-[11px] leading-tight">Hồ sơ đã tạo</p>
                          <p className="text-slate-700 font-medium">{userDetail.profile?.cvCount || 0} bản ghi</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600"><Briefcase className="w-4 h-4" /></div>
                        <div className="text-sm">
                          <p className="text-slate-400 text-[11px] leading-tight">Tổng số tin đăng</p>
                          <p className="text-slate-700 font-medium">{userDetail.jobStats?.total || 0} tin tuyển dụng</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Summary Card */}
          <div className="space-y-6">
            {userDetail.role === 'candidate' ? (
              <>
                <Card className="border-none shadow-xl shadow-blue-500/5 bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-slate-800">Hiệu suất hồ sơ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-500">Độ hoàn thiện</span>
                        <span className="text-sm font-bold text-blue-600 px-2 py-0.5 bg-blue-100 rounded-lg">{userDetail.profile?.profileCompleteness || 0}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000"
                          style={{ width: `${userDetail.profile?.profileCompleteness || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Ứng tuyển</p>
                          <span title="Tổng số lượt ứng tuyển mà người dùng đã thực hiện" className="cursor-help">
                            <HelpCircle className="w-3 h-3 text-slate-300" />
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 leading-tight">{userDetail.applicationStats?.total || 0}</p>
                      </div>
                      <div className="p-4 bg-blue-600 rounded-2xl shadow-blue-200 shadow-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <p className="text-blue-100 text-[10px] uppercase font-bold tracking-wider">Thành công</p>
                          <span title="Tỉ lệ đơn tuyển được chấp nhận trên tổng số đơn đã nộp" className="cursor-help">
                            <HelpCircle className="w-3 h-3 text-blue-300" />
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-white leading-tight">{userDetail.applicationStats?.acceptanceRate || 0}%</p>
                      </div>
                    </div>

                    {userDetail.applicationStats?.mostRecentApplication && (
                      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm"><Clock className="w-5 h-5" /></div>
                        <div>
                          <p className="text-indigo-400 text-[10px] uppercase font-bold tracking-wider">Gần nhất</p>
                          <p className="text-sm text-indigo-900 font-semibold">{new Date(userDetail.applicationStats.mostRecentApplication).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-default">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                      <p className="font-semibold text-slate-700">CV Tải lên</p>
                    </div>
                    <span className="font-bold text-amber-700">{userDetail.profile?.uploadedCVCount || 0}</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-default">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Package className="w-5 h-5" /></div>
                      <p className="font-semibold text-slate-700">CV Mẫu</p>
                    </div>
                    <span className="font-bold text-emerald-700">{userDetail.profile?.templateCVCount || 0}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Card className="border-none shadow-xl shadow-indigo-500/5 bg-gradient-to-br from-white to-indigo-50/30 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-slate-800">Tổng quan tuyển dụng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Tổng đơn</p>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 leading-tight">{userDetail.applicationStats?.totalApplications || 0}</p>
                      </div>
                      <div className="p-4 bg-indigo-600 rounded-2xl shadow-indigo-200 shadow-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <p className="text-indigo-100 text-[10px] uppercase font-bold tracking-wider">Đang chờ</p>
                        </div>
                        <p className="text-2xl font-bold text-white leading-tight">{userDetail.applicationStats?.pending || 0}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-3">
                      {[
                        { label: 'Chấp nhận', count: userDetail.applicationStats?.accepted, color: 'text-emerald-500', icon: CheckCircle },
                        { label: 'Từ chối', count: userDetail.applicationStats?.rejected, color: 'text-rose-500', icon: XCircle },
                      ].map((stat) => (
                        <div key={stat.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-700">{stat.count || 0}</span>
                        </div>
                      ))}
                    </div>

                    {userDetail.jobStats?.mostRecentJob && (
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><TrendingUp className="w-5 h-5" /></div>
                        <div>
                          <p className="text-blue-400 text-[10px] uppercase font-bold tracking-wider">Tin đăng mới nhất</p>
                          <p className="text-sm text-blue-900 font-semibold">{new Date(userDetail.jobStats.mostRecentJob).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-xl shadow-blue-200 text-white relative overflow-hidden">
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-blue-100 text-[10px] uppercase font-bold tracking-widest">Đang hoạt động</p>
                      <h4 className="text-3xl font-black">{userDetail.jobStats?.active || 0}</h4>
                      <p className="text-xs text-blue-100 font-medium">Tin tuyển dụng</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Detailed Stats */}
        <div className="lg:col-span-1 space-y-6">
          {userDetail.role === 'candidate' ? (
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold text-slate-800">Phân tích ứng tuyển</CardTitle>
                  <CardDescription>Trạng thái chi tiết của tất cả đơn tuyển</CardDescription>
                </div>
                <BarChart3 className="w-5 h-5 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Chờ xử lý', count: userDetail.applicationStats?.pending, color: 'bg-amber-500', icon: Clock, bg: 'bg-amber-50' },
                    { label: 'Đang xem xét', count: userDetail.applicationStats?.reviewing, color: 'bg-blue-500', icon: Eye, bg: 'bg-blue-50' },
                    { label: 'Hẹn phỏng vấn', count: userDetail.applicationStats?.scheduled_interview, color: 'bg-purple-500', icon: Calendar, bg: 'bg-purple-50' },
                    { label: 'Đã phỏng vấn', count: userDetail.applicationStats?.interviewed, color: 'bg-indigo-500', icon: UserCheck, bg: 'bg-indigo-50' },
                    { label: 'Được chấp nhận', count: userDetail.applicationStats?.accepted, color: 'bg-emerald-500', icon: CheckCircle, bg: 'bg-emerald-50' },
                    { label: 'Bị từ chối', count: userDetail.applicationStats?.rejected, color: 'bg-rose-500', icon: XCircle, bg: 'bg-rose-50' },
                    { label: 'Đã rút hồ sơ', count: userDetail.applicationStats?.withdrawn, color: 'bg-slate-400', icon: AlertCircle, bg: 'bg-slate-50' },
                  ].map((stat) => (
                    <div key={stat.label} className="group flex items-center gap-4 transition-all hover:translate-x-1 hover:cursor-default">
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
                        <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-700 leading-none">{stat.label}</span>
                          <span className="text-sm font-extrabold text-slate-900">{stat.count || 0}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${stat.color} transition-all duration-1000`}
                            style={{ width: `${userDetail.applicationStats?.total > 0 ? (stat.count / userDetail.applicationStats.total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
              <CardHeader className="pb-4">
                <div className="space-y-1 text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">Hoạt động tuyển dụng</CardTitle>
                  <CardDescription>Hiệu suất các tin đã đăng</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Trạng thái công việc</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { label: 'Đang hoạt động', count: userDetail.jobStats?.active, color: 'bg-emerald-500', bg: 'bg-emerald-50', icon: CheckCircle },
                      { label: 'Chờ duyệt', count: userDetail.jobStats?.pending, color: 'bg-amber-500', bg: 'bg-amber-50', icon: Clock },
                      { label: 'Hết hạn', count: userDetail.jobStats?.expired, color: 'bg-rose-500', bg: 'bg-rose-50', icon: AlertCircle },
                      { label: 'Đã ẩn', count: userDetail.jobStats?.inactive, color: 'bg-slate-500', bg: 'bg-slate-50', icon: Eye },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-blue-100 transition-colors cursor-default">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color.replace('bg-', 'text-')} flex items-center justify-center`}>
                            <stat.icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-slate-600">{stat.label}</span>
                        </div>
                        <span className="text-lg font-bold text-slate-900">{stat.count || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Thống kê đơn tuyển nhận được</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Chờ xử lý', count: userDetail.applicationStats?.pending, color: 'text-amber-600' },
                      { label: 'Đang xem xét', count: userDetail.applicationStats?.reviewing, color: 'text-blue-600' },
                      { label: 'Hẹn phỏng vấn', count: userDetail.applicationStats?.scheduled_interview, color: 'text-purple-600' },
                      { label: 'Đã phỏng vấn', count: userDetail.applicationStats?.interviewed, color: 'text-indigo-600' },
                      { label: 'Chấp nhận', count: userDetail.applicationStats?.accepted, color: 'text-emerald-600' },
                      { label: 'Từ chối', count: userDetail.applicationStats?.rejected, color: 'text-rose-600' },
                    ].map((app) => (
                      <div key={app.label} className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">{app.label}</span>
                        <span className={`font-bold ${app.color}`}>{app.count || 0}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-indigo-900/60 font-medium italic">Tổng đơn nhận:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-indigo-900 text-lg">{userDetail.applicationStats?.totalApplications || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {userDetail.role === 'candidate' ? (
            userDetail.profile?.profileCompletenessDetails && (
              <Card className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center justify-between px-2">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-800">Checklist hồ sơ</CardTitle>
                      <CardDescription>Các tiêu chí đánh giá độ hoàn thiện</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-white text-slate-400 font-bold text-[10px] uppercase px-3 py-1 border-slate-200 tracking-wider">
                      Cập nhật: {new Date(userDetail.profile.profileCompletenessDetails.lastCalculated).toLocaleDateString('vi-VN')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: 'hasBasicInfo', label: 'Thông tin cơ bản' },
                      { key: 'hasBio', label: 'Giới thiệu bản thân' },
                      { key: 'hasAvatar', label: 'Ảnh đại diện' },
                      { key: 'hasSkills', label: 'Kỹ năng chuyên môn' },
                      { key: 'hasCategories', label: 'Ngành nghề' },
                      { key: 'hasExperience', label: 'Kinh nghiệm' },
                      { key: 'hasEducation', label: 'Học vấn' },
                      { key: 'hasCertificates', label: 'Chứng chỉ' },
                      { key: 'hasProjects', label: 'Dự án đã làm' },
                      { key: 'hasSalary', label: 'Mức lương' },
                      { key: 'hasWorkTypes', label: 'Hình thức làm' },
                      { key: 'hasContractTypes', label: 'Hợp đồng' },
                      { key: 'hasSocialLinks', label: 'Mạng xã hội' },
                      { key: 'hasCV', label: 'File CV đính kèm' },
                    ].map((item) => {
                      const isComplete = userDetail.profile.profileCompletenessDetails[item.key];
                      return (
                        <div
                          key={item.key}
                          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${isComplete ? 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50' : 'bg-slate-50/50 border-slate-100 opacity-60'
                            }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isComplete ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200' : 'bg-slate-200'
                            }`}>
                            {isComplete ? <CheckCircle className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                          </div>
                          <span className={`text-[13px] font-semibold ${isComplete ? 'text-emerald-900' : 'text-slate-500'}`}>
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {userDetail.profile.profileCompletenessDetails.missingFields?.length > 0 && (
                    <div className="mt-8 p-6 bg-amber-50/50 rounded-3xl border border-amber-100/30 border-dashed">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <h5 className="text-[11px] font-bold text-amber-800 uppercase tracking-[0.2em]">Cần hoàn thiện thêm</h5>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {userDetail.profile.profileCompletenessDetails.missingFields.map((field) => (
                          <Badge key={field} variant="secondary" className="bg-white/80 text-amber-700 border-amber-200 font-bold text-[10px] px-4 py-1.5 rounded-xl shadow-sm">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          ) : (
            <div className="space-y-6">
              {/* Company Detailed Info */}
              <Card className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                <div className="h-2 bg-blue-600" />
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Hồ sơ doanh nghiệp
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                  {userDetail.company ? (
                    <div className="space-y-10">
                      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        <div className="w-28 h-28 rounded-3xl bg-white border border-slate-100 p-3 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/5">
                          {userDetail.company.logo ? (
                            <img src={userDetail.company.logo} alt={userDetail.company.name} className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="w-12 h-12 text-slate-200" />
                          )}
                        </div>
                        <div className="space-y-4 flex-1">
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{userDetail.company.name}</h3>
                            <div className="flex gap-2">
                              <Badge className={userDetail.company.verified ? 'bg-emerald-500 text-white border-none' : 'bg-slate-400 text-white border-none text-[10px]'}>
                                {userDetail.company.verified ? '✓ ĐÃ XÁC MINH' : 'CHƯA XÁC MINH'}
                              </Badge>
                              {userDetail.company.status && (
                                <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50 font-bold text-[10px]">
                                  {userDetail.company.status.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="relative">
                            <Quote className="w-8 h-8 text-slate-100 absolute -top-4 -left-4 -z-10" />
                            <p className="text-slate-500 text-base leading-relaxed max-w-2xl italic">
                              {userDetail.company.about || 'Doanh nghiệp chưa cập nhật phần giới thiệu.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100/50">
                        {[
                          { icon: Briefcase, label: 'Lĩnh vực', value: userDetail.company.industry, color: 'text-blue-600', bg: 'bg-blue-100' },
                          { icon: Package, label: 'Quy mô nhân sự', value: userDetail.company.size, color: 'text-indigo-600', bg: 'bg-indigo-100' },
                          { icon: Globe, label: 'Trang web', value: userDetail.company.website, isLink: true, color: 'text-cyan-600', bg: 'bg-cyan-100' },
                          { icon: MapPin, label: 'Trụ sở chính', value: userDetail.company.location ? `${userDetail.company.location.district}, ${userDetail.company.location.province}` : 'N/A', color: 'text-rose-600', bg: 'bg-rose-100' },
                          { icon: Mail, label: 'Email công việc', value: userDetail.company.contactInfo?.email, color: 'text-amber-600', bg: 'bg-amber-100' },
                          { icon: Phone, label: 'Số điện thoại', value: userDetail.company.contactInfo?.phone, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                        ].map((item) => (
                          <div key={item.label} className="group flex gap-5">
                            <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:scale-110`}>
                              <item.icon className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                              {item.isLink && item.value ? (
                                <a href={item.value} target="_blank" rel="noreferrer" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                                  {item.value.replace(/^https?:\/\//, '')}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <p className="text-slate-800 font-bold text-sm">{item.value || 'Đang cập nhật'}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                      <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6">
                        <Building2 className="w-10 h-10 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold text-lg">Chưa thiết lập hồ sơ doanh nghiệp</p>
                      <p className="text-slate-300 text-sm mt-1">Nhà tuyển dụng này chưa đăng ký thông tin công ty</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
