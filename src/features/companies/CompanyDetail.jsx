import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { getCompanyProfile, approveCompany, rejectCompany } from '@/services/companyService';
import { EntityNavigationLink } from '@/components/common/EntityNavigationLink';
import { CompanyJobsSection } from './CompanyJobsSection';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  TrendingUp,
  DollarSign,
  ExternalLink
} from 'lucide-react';
import { formatDate } from '@/utils/formatDate';

export function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompanyDetail = async () => {
      try {
        setLoading(true);
        const response = await getCompanyProfile(id);
        setCompany(response.data.data);
      } catch (error) {
        console.error('Error fetching company detail:', error);
        toast.error('Không thể tải thông tin công ty');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetail();
  }, [id]);

  const handleApprove = async () => {
    try {
      await approveCompany(id);
      toast.success('Phê duyệt công ty thành công');
      // Refresh data
      const response = await getCompanyProfile(id);
      setCompany(response.data.data);
    } catch (error) {
      console.error('Error approving company:', error);
      toast.error('Không thể phê duyệt công ty');
    }
  };

  const handleReject = async () => {
    const reason = prompt('Nhập lý do từ chối:');
    if (!reason) return;

    try {
      await rejectCompany(id, reason);
      toast.success('Từ chối công ty thành công');
      // Refresh data
      const response = await getCompanyProfile(id);
      setCompany(response.data.data);
    } catch (error) {
      console.error('Error rejecting company:', error);
      toast.error('Không thể từ chối công ty');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/companies')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy thông tin công ty</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Đã duyệt</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Chờ duyệt</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/companies')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chi tiết công ty</h1>
            <p className="text-gray-600">Thông tin chi tiết và quản lý tin tuyển dụng</p>
          </div>
        </div>
        {company.company?.status === 'pending' && (
          <div className="flex items-center space-x-2">
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Phê duyệt
            </Button>
            <Button onClick={handleReject} variant="destructive">
              <XCircle className="w-4 h-4 mr-2" />
              Từ chối
            </Button>
          </div>
        )}
      </div>

      {/* Company Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Thông tin công ty</CardTitle>
            {company.company?.name && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/companies/${id}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Xem trang công ty
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            {company.company?.logo && (
              <img
                src={company.company.logo}
                alt={company.company.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h2 className="text-2xl font-semibold">{company.company?.name || 'Chưa cập nhật'}</h2>
                {company.company?.verified && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Đã xác minh
                  </Badge>
                )}
                {company.company?.status && getStatusBadge(company.company.status)}
              </div>
              
              {company.company?.about && (
                <p className="text-gray-600 mb-4">{company.company.about}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {company.company?.industry && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{company.company.industry}</span>
                  </div>
                )}
                {company.company?.size && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>Quy mô: {company.company.size}</span>
                  </div>
                )}
                {company.company?.taxCode && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>Mã số thuế: {company.company.taxCode}</span>
                  </div>
                )}
                {company.company?.website && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <a href={company.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {company.company.website}
                    </a>
                  </div>
                )}
                {company.company?.location && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {[
                        company.company.location.commune,
                        company.company.location.district,
                        company.company.location.province
                      ].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
                {company.company?.contactInfo?.email && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{company.company.contactInfo.email}</span>
                  </div>
                )}
                {company.company?.contactInfo?.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{company.company.contactInfo.phone}</span>
                  </div>
                )}
              </div>

              {/* Business Registration Document */}
              {company.company?.businessRegistrationUrl && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-semibold mb-2">Giấy đăng ký kinh doanh</h3>
                  <a 
                    href={company.company.businessRegistrationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:underline text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Xem giấy đăng ký kinh doanh</span>
                  </a>
                </div>
              )}

              {/* Rejection Reason */}
              {company.company?.status === 'rejected' && company.company?.rejectReason && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-semibold mb-2 text-red-600">Lý do từ chối</h3>
                  <p className="text-sm text-gray-700 bg-red-50 p-3 rounded-lg">
                    {company.company.rejectReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recruiter Info Card */}
      {company.recruiterInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Thông tin nhà tuyển dụng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Họ tên</div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{company.recruiterInfo.fullname}</span>
                  <EntityNavigationLink
                    entityType="user"
                    entityId={company.recruiterInfo.userId}
                    entityName="Xem chi tiết"
                    variant="badge"
                  />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Email</div>
                <div className="font-medium">{company.recruiterInfo.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Trạng thái tài khoản</div>
                <Badge className={company.recruiterInfo.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {company.recruiterInfo.active ? 'Hoạt động' : 'Đã khóa'}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Ngày tạo tài khoản</div>
                <div className="font-medium">{formatDate(company.recruiterInfo.userCreatedAt)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Thống kê</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{company.jobStats?.totalJobs || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Tổng tin tuyển dụng</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{company.jobStats?.recruitingJobs || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Đang tuyển dụng</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{company.jobStats?.pendingJobs || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Chờ duyệt</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{company.jobStats?.expiredJobs || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Hết hạn</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{company.applicationStats?.total || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Tổng ứng tuyển</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{company.applicationStats?.pending || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Chờ xử lý</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{company.applicationStats?.accepted || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Đã chấp nhận</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{company.applicationStats?.rejected || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Đã từ chối</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Section */}
      <CompanyJobsSection companyId={id} />
    </div>
  );
}
