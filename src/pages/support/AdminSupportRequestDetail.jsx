import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Paperclip,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react';
import { AdminResponseForm } from '@/components/support/AdminResponseForm';
import {
  getSupportRequestById,
  respondToRequest,
  updateStatus,
  reopenRequest
} from '@/services/supportRequestService';
import { formatDate } from '@/utils/formatDate';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';

// Status Badge Component
const getStatusBadge = (status) => {
  const statusConfig = {
    'pending': { label: 'Đang chờ', className: 'bg-yellow-500 text-white' },
    'in-progress': { label: 'Đang xử lý', className: 'bg-blue-500 text-white' },
    'resolved': { label: 'Đã giải quyết', className: 'bg-green-500 text-white' },
    'closed': { label: 'Đã đóng', className: 'bg-gray-500 text-white' }
  };
  const config = statusConfig[status] || statusConfig.pending;
  return <Badge className={config.className}>{config.label}</Badge>;
};

// Priority Badge Component - shows "Đã giải quyết" for resolved/closed status
const getPriorityBadge = (priority, status) => {
  // If resolved or closed, show "Đã giải quyết" instead of priority
  if (status === 'resolved' || status === 'closed') {
    return (
      <Badge className="bg-green-500 text-white">
        Đã giải quyết
      </Badge>
    );
  }

  const priorityConfig = {
    urgent: { label: 'Khẩn cấp', className: 'bg-red-500 text-white' },
    high: { label: 'Cao', className: 'bg-orange-500 text-white' },
    medium: { label: 'Trung bình', className: 'bg-yellow-500 text-white' },
    low: { label: 'Thấp', className: 'bg-gray-500 text-white' }
  };
  const config = priorityConfig[priority] || priorityConfig.medium;
  return <Badge className={config.className}>{config.label}</Badge>;
};

// User Type Badge Component
const getUserTypeBadge = (userType) => {
  const typeConfig = {
    'candidate': { label: 'Ứng viên', className: 'bg-purple-100 text-purple-800' },
    'recruiter': { label: 'Nhà tuyển dụng', className: 'bg-blue-100 text-blue-800' }
  };
  const config = typeConfig[userType] || typeConfig.candidate;
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
};

// Category Label
const getCategoryLabel = (category) => {
  const categoryLabels = {
    'technical-issue': 'Vấn đề kỹ thuật',
    'account-issue': 'Vấn đề tài khoản',
    'payment-issue': 'Vấn đề thanh toán',
    'job-posting-issue': 'Vấn đề đăng tin',
    'application-issue': 'Vấn đề ứng tuyển',
    'general-inquiry': 'Thắc mắc chung'
  };
  return categoryLabels[category] || category;
};

// Status Label
const getStatusLabel = (status) => {
  const statusLabels = {
    'pending': 'Đang chờ',
    'in-progress': 'Đang xử lý',
    'resolved': 'Đã giải quyết',
    'closed': 'Đã đóng'
  };
  return statusLabels[status] || status;
};

// Priority Label
const getPriorityLabel = (priority) => {
  const priorityLabels = {
    'urgent': 'Khẩn cấp',
    'high': 'Cao',
    'medium': 'Trung bình',
    'low': 'Thấp'
  };
  return priorityLabels[priority] || priority;
};

export const AdminSupportRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [showResponseForm, setShowResponseForm] = useState(
    searchParams.get('action') === 'respond'
  );
  const [selectedStatus, setSelectedStatus] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [confirmReopenOpen, setConfirmReopenOpen] = useState(false);

  // Fetch support request details
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['admin-support-request', id],
    queryFn: () => getSupportRequestById(id),
    enabled: !!id
  });

  const request = data?.data;

  // Update local state when data loads
  useEffect(() => {
    if (request) {
      setSelectedStatus(request.status);
    }
  }, [request]);

  // Respond mutation
  const respondMutation = useMutation({
    mutationFn: ({ response, statusUpdate, priorityUpdate }) =>
      respondToRequest(id, response, statusUpdate, priorityUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-support-request', id]);
      queryClient.invalidateQueries(['admin-support-requests']);
      toast.success('Đã gửi phản hồi thành công');
      setShowResponseForm(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi gửi phản hồi');
    }
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (status) => updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-support-request', id]);
      queryClient.invalidateQueries(['admin-support-requests']);
      toast.success('Đã cập nhật trạng thái thành công');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
      setSelectedStatus(request?.status);
    }
  });

  // Reopen mutation
  const reopenMutation = useMutation({
    mutationFn: () => reopenRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-support-request', id]);
      queryClient.invalidateQueries(['admin-support-requests']);
      toast.success('Đã mở lại yêu cầu thành công');
      setConfirmReopenOpen(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi mở lại yêu cầu');
      setConfirmReopenOpen(false);
    }
  });

  // Handlers
  const handleRespond = async (data) => {
    await respondMutation.mutateAsync(data);
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus !== request?.status) {
      setSelectedStatus(newStatus);
      updateStatusMutation.mutate(newStatus);
    }
  };

  const handleReopen = () => {
    setConfirmReopenOpen(true);
  };

  const executeReopen = () => {
    reopenMutation.mutate();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/support')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Có lỗi xảy ra khi tải dữ liệu'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/support')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Không tìm thấy yêu cầu hỗ trợ</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/support')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {request.subject}
            </h1>
            <div className="flex items-center gap-2">
              {getStatusBadge(request.status)}
              {getPriorityBadge(request.priority, request.status)}
              <span className="text-sm text-muted-foreground">
                ID: {request._id.slice(-8)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Request Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Requester Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin người yêu cầu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tên</p>
                    <p className="font-medium">{request.requester?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{request.requester?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Loại người dùng</p>
                    <div className="mt-1">
                      {getUserTypeBadge(request.requester?.userType)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chi tiết yêu cầu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Danh mục</p>
                  <p className="font-medium">{getCategoryLabel(request.category)}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mô tả</p>
                  <p className="whitespace-pre-wrap">{request.description}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ngày tạo</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{formatDate(request.createdAt)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cập nhật lần cuối</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{formatDate(request.updatedAt)}</p>
                    </div>
                  </div>
                </div>
                {request.resolvedAt && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ngày giải quyết</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <p className="text-sm">{formatDate(request.resolvedAt)}</p>
                      </div>
                    </div>
                  </>
                )}
                {request.closedAt && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ngày đóng</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-gray-600" />
                        <p className="text-sm">{formatDate(request.closedAt)}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Attachments */}
            {request.attachments && request.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Paperclip className="h-5 w-5" />
                    Tệp đính kèm ({request.attachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {request.attachments.map((attachment, index) => {
                      const isImage = attachment.fileType?.startsWith('image/');

                      return (
                        <div
                          key={index}
                          className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          {isImage ? (
                            <div className="relative group cursor-pointer" onClick={() => setPreviewImage(attachment)}>
                              <img
                                src={attachment.url}
                                alt={attachment.filename}
                                className="w-full h-48 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewImage(attachment);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Xem
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  asChild
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <a
                                    href={attachment.url}
                                    download={attachment.filename}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Tải về
                                  </a>
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-48 bg-muted">
                              <Paperclip className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          <div className="p-3 bg-background">
                            <p className="text-sm font-medium truncate">{attachment.filename}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-muted-foreground">
                                {(attachment.fileSize / 1024).toFixed(2)} KB
                              </p>
                              {!isImage && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                >
                                  <a
                                    href={attachment.url}
                                    download={attachment.filename}
                                  >
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Message History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Lịch sử tin nhắn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Combined Message History */}
                  {(() => {
                    const combinedMessages = [
                      ...(request.messages || []).map(m => ({ ...m, type: 'user' })),
                      ...(request.adminResponses || []).map(r => ({ ...r, type: 'admin' }))
                    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                    if (combinedMessages.length === 0) {
                      return (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Chưa có tin nhắn nào
                        </p>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        {combinedMessages.map((item, index) => {
                          if (item.type === 'user') {
                            return (
                              <div key={`user-${index}`} className="border-l-4 border-blue-500 pl-4 py-2">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{item.sender?.name}</p>
                                    {getUserTypeBadge(item.sender?.userType)}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(item.createdAt)}
                                  </p>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{item.content}</p>
                                {item.attachments && item.attachments.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {item.attachments.map((att, attIndex) => (
                                      <a
                                        key={attIndex}
                                        href={att.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                      >
                                        <Paperclip className="h-3 w-3" />
                                        {att.filename}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          } else {
                            return (
                              <div key={`admin-${index}`} className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{item.adminName}</p>
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      Admin
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(item.createdAt)}
                                  </p>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{item.response}</p>
                                {(item.statusChange || item.priorityChange) && (
                                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                    {item.statusChange && (
                                      <span>
                                        Trạng thái: {getStatusLabel(item.statusChange.from)} → {getStatusLabel(item.statusChange.to)}
                                      </span>
                                    )}
                                    {item.priorityChange && (
                                      <span>
                                        Độ ưu tiên: {getPriorityLabel(item.priorityChange.from)} → {getPriorityLabel(item.priorityChange.to)}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          }
                        })}
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Admin Response Form */}
            {showResponseForm ? (
              <AdminResponseForm
                onSubmit={handleRespond}
                onCancel={() => setShowResponseForm(false)}
                loading={respondMutation.isPending}
                currentStatus={request.status}
                currentPriority={request.priority}
              />
            ) : (
              <Button
                onClick={() => setShowResponseForm(true)}
                className="w-full"
                size="lg"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Phản hồi yêu cầu
              </Button>
            )}
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            {/* Status Update */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cập nhật trạng thái</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={selectedStatus}
                    onValueChange={handleStatusChange}
                    disabled={updateStatusMutation.isPending}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {/* pending: chỉ có thể chuyển sang in-progress, resolved, closed */}
                      <SelectItem
                        value="pending"
                        disabled={request.status !== 'pending'}
                        className={request.status !== 'pending' ? 'opacity-50' : ''}
                      >
                        Đang chờ
                      </SelectItem>
                      {/* in-progress: có thể từ pending, hoặc giữ nguyên */}
                      <SelectItem
                        value="in-progress"
                        disabled={request.status === 'resolved' || request.status === 'closed'}
                        className={request.status === 'resolved' || request.status === 'closed' ? 'opacity-50' : ''}
                      >
                        Đang xử lý
                      </SelectItem>
                      {/* resolved: có thể từ pending, in-progress */}
                      <SelectItem
                        value="resolved"
                        disabled={request.status === 'closed'}
                        className={request.status === 'closed' ? 'opacity-50' : ''}
                      >
                        Đã giải quyết
                      </SelectItem>
                      {/* closed: có thể từ bất kỳ trạng thái nào */}
                      <SelectItem value="closed">Đã đóng</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Hint text */}
                  <p className="text-xs text-muted-foreground">
                    {request.status === 'resolved' && 'Yêu cầu đã giải quyết chỉ có thể đóng.'}
                    {request.status === 'closed' && 'Yêu cầu đã đóng. Sử dụng nút "Mở lại" bên dưới.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reopen Button */}
            {request.status === 'closed' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mở lại yêu cầu</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleReopen}
                    disabled={reopenMutation.isPending}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Mở lại yêu cầu
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Image Preview Dialog */}
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{previewImage?.filename}</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <img
                src={previewImage?.url}
                alt={previewImage?.filename}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  asChild
                >
                  <a
                    href={previewImage?.url}
                    download={previewImage?.filename}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Tải về
                  </a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                >
                  <a
                    href={previewImage?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Mở tab mới
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <ConfirmationDialog
          open={confirmReopenOpen}
          onOpenChange={setConfirmReopenOpen}
          title="Mở lại yêu cầu?"
          description="Bạn có chắc chắn muốn mở lại yêu cầu hỗ trợ này?"
          onConfirm={executeReopen}
          confirmText="Mở lại"
          cancelText="Hủy"
          isLoading={reopenMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

