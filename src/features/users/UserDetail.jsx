import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { getUserDetail } from '@/services/userService';
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
  BarChart3
} from 'lucide-react';

export function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userDetail, setUserDetail] = useState(null);

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
        <Button variant="ghost" onClick={() => navigate('/users')}>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/users')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chi tiết người dùng</h1>
            <p className="text-gray-600">Thông tin chi tiết và thống kê hoạt động</p>
          </div>
        </div>
      </div>

      {/* Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h2 className="text-2xl font-semibold">
                  {userDetail.role === 'candidate' 
                    ? userDetail.profile?.fullname || 'Chưa cập nhật'
                    : userDetail.profile?.fullname || 'Chưa cập nhật'}
                </h2>
                {getRoleBadge(userDetail.role)}
                {getStatusBadge(userDetail.active)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{userDetail.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Tham gia: {new Date(userDetail.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Specific Info */}
      {userDetail.role === 'candidate' && (
        <>
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin hồ sơ</CardTitle>
              <CardDescription>Thông tin cá nhân và độ hoàn thiện hồ sơ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    {userDetail.profile?.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{userDetail.profile.phone}</span>
                      </div>
                    )}
                    {userDetail.profile?.dateOfBirth && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Sinh nhật: {new Date(userDetail.profile.dateOfBirth).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                    {userDetail.profile?.gender && (
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>Giới tính: {userDetail.profile.gender}</span>
                      </div>
                    )}
                    {userDetail.profile?.address && (
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{userDetail.profile.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Độ hoàn thiện hồ sơ</div>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                          {userDetail.profile?.profileCompleteness || 0}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                      <div
                        style={{ width: `${userDetail.profile?.profileCompleteness || 0}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      ></div>
                    </div>
                  </div>
                  
                  {/* Profile Completeness Details */}
                  {userDetail.profile?.profileCompletenessDetails && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs space-y-2">
                      <div className="font-medium text-gray-700">Trạng thái các phần:</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-1">
                          {userDetail.profile.profileCompletenessDetails.hasBasicInfo ? 
                            <CheckCircle className="w-3 h-3 text-green-500" /> : 
                            <XCircle className="w-3 h-3 text-gray-400" />}
                          <span>Thông tin cơ bản</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {userDetail.profile.profileCompletenessDetails.hasSkills ? 
                            <CheckCircle className="w-3 h-3 text-green-500" /> : 
                            <XCircle className="w-3 h-3 text-gray-400" />}
                          <span>Kỹ năng</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {userDetail.profile.profileCompletenessDetails.hasPreferences ? 
                            <CheckCircle className="w-3 h-3 text-green-500" /> : 
                            <XCircle className="w-3 h-3 text-gray-400" />}
                          <span>Mong muốn việc làm</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {userDetail.profile.profileCompletenessDetails.hasExperience ? 
                            <CheckCircle className="w-3 h-3 text-green-500" /> : 
                            <XCircle className="w-3 h-3 text-gray-400" />}
                          <span>Kinh nghiệm</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {userDetail.profile.profileCompletenessDetails.hasEducation ? 
                            <CheckCircle className="w-3 h-3 text-green-500" /> : 
                            <XCircle className="w-3 h-3 text-gray-400" />}
                          <span>Học vấn</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {userDetail.profile.profileCompletenessDetails.hasCV ? 
                            <CheckCircle className="w-3 h-3 text-green-500" /> : 
                            <XCircle className="w-3 h-3 text-gray-400" />}
                          <span>CV đã tải lên</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-2 text-sm font-medium">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>Tổng số CV: {userDetail.profile?.cvCount || 0}</span>
                    </div>
                    {userDetail.profile?.cvCount > 0 && (
                      <div className="ml-6 text-xs text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>CV đã tải lên: {userDetail.profile?.uploadedCVCount || 0}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>CV tạo từ template: {userDetail.profile?.templateCVCount || 0}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Thống kê ứng tuyển</span>
              </CardTitle>
              <CardDescription>Lịch sử và tỷ lệ ứng tuyển thành công</CardDescription>
            </CardHeader>
            <CardContent>
              {userDetail.applicationStats?.total > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{userDetail.applicationStats.total}</div>
                      <div className="text-xs text-gray-600 mt-1">Tổng đơn</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{userDetail.applicationStats.accepted}</div>
                      <div className="text-xs text-gray-600 mt-1">Được chấp nhận</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{userDetail.applicationStats.rejected}</div>
                      <div className="text-xs text-gray-600 mt-1">Bị từ chối</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{userDetail.applicationStats.acceptanceRate}%</div>
                      <div className="text-xs text-gray-600 mt-1">Tỷ lệ thành công</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-sm font-medium mb-3">Chi tiết trạng thái</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span>Chờ xử lý: {userDetail.applicationStats.pending}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span>Đang xem xét: {userDetail.applicationStats.reviewing}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span>Hẹn phỏng vấn: {userDetail.applicationStats.scheduled_interview}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <UserCheck className="w-4 h-4 text-indigo-500" />
                        <span>Đã phỏng vấn: {userDetail.applicationStats.interviewed}</span>
                      </div>
                    </div>
                  </div>

                  {userDetail.applicationStats.mostRecentApplication && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Ứng tuyển gần nhất:</span>{' '}
                      {new Date(userDetail.applicationStats.mostRecentApplication).toLocaleDateString('vi-VN')}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có đơn ứng tuyển nào</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Recruiter Specific Info */}
      {userDetail.role === 'recruiter' && (
        <>
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Thông tin công ty</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userDetail.company ? (
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    {userDetail.company.logo && (
                      <img
                        src={userDetail.company.logo}
                        alt={userDetail.company.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold">{userDetail.company.name}</h3>
                        {userDetail.recruiterProfileId && (
                          <EntityNavigationLink
                            entityType="company"
                            entityId={userDetail.recruiterProfileId}
                            entityName="Xem chi tiết công ty"
                            variant="button"
                          />
                        )}
                        {userDetail.company.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Đã xác minh
                          </Badge>
                        )}
                        {userDetail.company.status && (
                          <Badge variant="outline">
                            {userDetail.company.status === 'approved' ? 'Đã duyệt' : 
                             userDetail.company.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                          </Badge>
                        )}
                      </div>
                      {userDetail.company.about && (
                        <p className="text-sm text-gray-600 mb-4">{userDetail.company.about}</p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {userDetail.company.industry && (
                          <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4 text-gray-500" />
                            <span>{userDetail.company.industry}</span>
                          </div>
                        )}
                        {userDetail.company.size && (
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4 text-gray-500" />
                            <span>Quy mô: {userDetail.company.size}</span>
                          </div>
                        )}
                        {userDetail.company.website && (
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-gray-500" />
                            <a href={userDetail.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {userDetail.company.website}
                            </a>
                          </div>
                        )}
                        {userDetail.company.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>
                              {[
                                userDetail.company.location.commune,
                                userDetail.company.location.district,
                                userDetail.company.location.province
                              ].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                        {userDetail.company.contactInfo?.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span>{userDetail.company.contactInfo.email}</span>
                          </div>
                        )}
                        {userDetail.company.contactInfo?.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{userDetail.company.contactInfo.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700 mb-2">Chưa đăng ký thông tin công ty</p>
                  <p className="text-sm text-gray-500">Nhà tuyển dụng chưa hoàn tất đăng ký thông tin công ty</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Posting Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Thống kê tin tuyển dụng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{userDetail.jobStats?.total || 0}</div>
                    <div className="text-xs text-gray-600 mt-1">Tổng tin</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{userDetail.jobStats?.active || 0}</div>
                    <div className="text-xs text-gray-600 mt-1">Đang hoạt động</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{userDetail.jobStats?.pending || 0}</div>
                    <div className="text-xs text-gray-600 mt-1">Chờ duyệt</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{userDetail.jobStats?.inactive || 0}</div>
                    <div className="text-xs text-gray-600 mt-1">Không hoạt động</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{userDetail.jobStats?.expired || 0}</div>
                    <div className="text-xs text-gray-600 mt-1">Hết hạn</div>
                  </div>
                </div>

                {userDetail.jobStats?.mostRecentJob && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Tin tuyển dụng gần nhất:</span>{' '}
                    {new Date(userDetail.jobStats.mostRecentJob).toLocaleDateString('vi-VN')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Application Statistics for Recruiter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Thống kê ứng tuyển nhận được</span>
              </CardTitle>
              <CardDescription>Tổng quan về đơn ứng tuyển cho các tin tuyển dụng</CardDescription>
            </CardHeader>
            <CardContent>
              {userDetail.applicationStats?.totalApplications > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{userDetail.applicationStats.totalApplications}</div>
                      <div className="text-xs text-gray-600 mt-1">Tổng đơn</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{userDetail.applicationStats.pending}</div>
                      <div className="text-xs text-gray-600 mt-1">Chờ xử lý</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{userDetail.applicationStats.accepted}</div>
                      <div className="text-xs text-gray-600 mt-1">Đã chấp nhận</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{userDetail.applicationStats.rejected}</div>
                      <div className="text-xs text-gray-600 mt-1">Đã từ chối</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có đơn ứng tuyển nào</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
