import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { getJobDetailForAdmin, approveJob, rejectJob } from '@/services/jobService';
import { formatDate } from '@/utils/formatDate';
import { cn } from '@/lib/utils';
import { DialogFooter } from '@/components/ui/dialog';

const JobDetailModal = ({ jobId, isOpen, onClose }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchJobDetail();
    }
  }, [isOpen, jobId]);

  const fetchJobDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getJobDetailForAdmin(jobId);
      setJob(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải chi tiết công việc');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await approveJob(jobId);
      toast.success('Đã phê duyệt công việc');
      fetchJobDetail(); // Refresh data
    } catch (error) {
      toast.error(error.message || 'Không thể phê duyệt công việc');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      await rejectJob(jobId);
      toast.success('Đã từ chối công việc');
      fetchJobDetail(); // Refresh data
    } catch (error) {
      toast.error(error.message || 'Không thể từ chối công việc');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (job) => {
    const { status, moderationStatus } = job;

    if (moderationStatus === 'PENDING') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Chờ duyệt
        </Badge>
      );
    }
    if (moderationStatus === 'REJECTED') {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Đã từ chối
        </Badge>
      );
    }

    switch (status) {
      case 'ACTIVE':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Đang tuyển
          </Badge>
        );
      case 'INACTIVE':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Ngừng tuyển dụng
          </Badge>
        );
      case 'EXPIRED':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Hết hạn
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getJobTypeBadge = (type) => {
    const typeMap = {
      FULL_TIME: 'Toàn thời gian',
      PART_TIME: 'Bán thời gian',
      CONTRACT: 'Hợp đồng',
      INTERNSHIP: 'Thực tập'
    };
    return typeMap[type] || type;
  };

  const getWorkTypeBadge = (workType) => {
    const workTypeMap = {
      ONSITE: 'Tại văn phòng',
      REMOTE: 'Làm việc từ xa',
      HYBRID: 'Lai'
    };
    return workTypeMap[workType] || workType;
  };

  const getExperienceLevel = (experience) => {
    const experienceMap = {
      INTERN: 'Thực tập sinh',
      ENTRY_LEVEL: 'Mới đi làm',
      MID_LEVEL: 'Nhân viên',
      SENIOR_LEVEL: 'Quản lý',
      EXECUTIVE: 'Giám đốc'
    };
    return experienceMap[experience] || experience;
  };

  const getCategoryLabel = (category) => {
    const categoryMap = {
      SOFTWARE_ENGINEERING: 'Kỹ thuật phần mềm',
      DATA_SCIENCE: 'Khoa học dữ liệu',
      MACHINE_LEARNING: 'Học máy',
      DESIGN: 'Thiết kế',
      MARKETING: 'Marketing',
      SALES: 'Kinh doanh',
      BUSINESS_ANALYSIS: 'Phân tích kinh doanh',
      PROJECT_MANAGEMENT: 'Quản lý dự án',
      OTHER: 'Khác'
    };
    return categoryMap[category] || category;
  };

  const formatSalary = (minSalary, maxSalary) => {
    if (!minSalary && !maxSalary) return 'Thỏa thuận';

    const formatNumber = (num) => {
      if (!num) return '';
      const value = parseFloat(num.$numberDecimal || num);
      return value.toLocaleString('vi-VN');
    };

    if (minSalary && maxSalary) {
      return `${formatNumber(minSalary)} - ${formatNumber(maxSalary)} VNĐ`;
    }
    return `${formatNumber(minSalary || maxSalary)} VNĐ`;
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết công việc</DialogTitle>
            <DialogDescription>Đang tải thông tin chi tiết về công việc này</DialogDescription>
            <Skeleton className="h-8 w-3/4" />
          </DialogHeader>
          <div className="space-y-6 animate-pulse">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Lỗi</DialogTitle>
            <DialogDescription>Đã xảy ra lỗi khi tải thông tin công việc</DialogDescription>
          </DialogHeader>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={onClose} className="mt-4">
            Đóng
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{job.title}</DialogTitle>
          <DialogDescription>Thông tin chi tiết về vị trí công việc và yêu cầu tuyển dụng</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header với thông tin cơ bản */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={job.recruiterProfileId?.company?.logo || '/placeholder-logo.svg'}
                    alt={job.recruiterProfileId?.company?.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{job.recruiterProfileId?.company?.name}</h3>
                    <p className="text-muted-foreground">{job.recruiterProfileId?.company?.industry}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* Action Buttons */}
                  {job.moderationStatus === 'PENDING' && (
                    <>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleReject}
                        disabled={actionLoading}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Từ chối
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleApprove}
                        disabled={actionLoading}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Phê duyệt
                      </Button>
                    </>
                  )}

                  {job.moderationStatus === 'REJECTED' && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleApprove}
                      disabled={actionLoading}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Duyệt lại
                    </Button>
                  )}

                  {getStatusBadge(job)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {job.location?.ward}, {job.location?.province}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{getJobTypeBadge(job.type)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{formatSalary(job.minSalary, job.maxSalary)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Hết hạn: {formatDate(job.deadline)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content: Description, Requirements, Benefits */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mô tả công việc */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mô tả công việc</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {job.description}
                  </div>
                </CardContent>
              </Card>

              {/* Yêu cầu */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Yêu cầu công việc</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {job.requirements}
                  </div>
                </CardContent>
              </Card>

              {/* Quyền lợi */}
              {job.benefits && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quyền lợi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {job.benefits}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar: Additional Info & Recruiter Info */}
            <div className="space-y-6">
              {/* Thông tin bổ sung */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin bổ sung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Danh mục:</span>
                    <span className="font-medium text-right">{getCategoryLabel(job.category)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kinh nghiệm:</span>
                    <span className="font-medium text-right">{getExperienceLevel(job.experience)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hình thức:</span>
                    <span className="font-medium text-right">{getWorkTypeBadge(job.workType)}</span>
                  </div>
                  {job.address && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Địa chỉ:</span>
                      <span className="font-medium text-right truncate ml-2">{job.address}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày đăng:</span>
                    <span className="font-medium text-right">{formatDate(job.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cập nhật:</span>
                    <span className="font-medium text-right">{formatDate(job.updatedAt)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Thống kê ứng tuyển */}
              {job.analytics?.applicationStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Thống kê đơn ứng tuyển</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <p className="text-xl font-bold">{job.analytics.applicationStats.total || 0}</p>
                        <p className="text-xs text-muted-foreground">Tổng cộng</p>
                      </div>
                      <div className="p-2 rounded-lg bg-yellow-50">
                        <p className="text-xl font-bold">{job.analytics.applicationStats.pending || 0}</p>
                        <p className="text-xs text-muted-foreground">Chờ duyệt</p>
                      </div>
                      <div className="p-2 rounded-lg bg-purple-50">
                        <p className="text-xl font-bold">{job.analytics.applicationStats.scheduled_interview || 0}</p>
                        <p className="text-xs text-muted-foreground">Đã hẹn</p>
                      </div>
                      <div className="p-2 rounded-lg bg-green-50">
                        <p className="text-xl font-bold">{job.analytics.applicationStats.accepted || 0}</p>
                        <p className="text-xs text-muted-foreground">Chấp nhận</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Thông tin nhà tuyển dụng */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nhà tuyển dụng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-muted-foreground">Người liên hệ</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{job.recruiterProfileId?.fullname}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{job.recruiterProfileId?.userId?.email}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-muted-foreground">Giới thiệu công ty</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                      {job.recruiterProfileId?.company?.about}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailModal;
