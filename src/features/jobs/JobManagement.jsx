import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { getAllJobsForAdmin, updateJobStatus } from '@/services/jobService';
import { JobListSkeleton } from '@/components/common/JobListSkeleton';
import JobDetailModal from '@/components/jobs/JobDetailModal';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Building2,
  Users,
  Calendar,
  DollarSign,
  Eye,
  Check,
  X
} from 'lucide-react';

export function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  // Fetch jobs from API
  const fetchJobs = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        page: meta.currentPage,
        limit: meta.limit,
        ...params
      };

      if (searchTerm) queryParams.search = searchTerm;
      if (statusFilter !== 'all') queryParams.status = statusFilter;
      if (typeFilter !== 'all') queryParams.type = typeFilter;

      const response = await getAllJobsForAdmin(queryParams);
      setJobs(response.data || []);
      setMeta(response.meta || meta);
    } catch (error) {
      setError(error.message || 'Không thể tải danh sách công việc');
      toast.error(error.message || 'Không thể tải danh sách công việc');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, typeFilter, meta.currentPage, meta.limit]);

  // Load jobs on component mount and when filters change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusChange = useCallback(async (jobId, newStatus) => {
    try {
      setLoading(true);
      await updateJobStatus(jobId, newStatus);
      
      // Update local state
      setJobs(prev => prev.map(job => 
        job._id === jobId ? { ...job, status: newStatus } : job
      ));
      
      const statusMessages = {
        active: 'Đã phê duyệt công việc',
        inactive: 'Đã từ chối công việc',
        pending: 'Đã đưa công việc về trạng thái chờ duyệt'
      };
      toast.success(statusMessages[newStatus] || 'Đã cập nhật trạng thái công việc');
    } catch (error) {
      toast.error(error.message || 'Không thể cập nhật trạng thái công việc');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleViewJob = (jobId) => {
    setSelectedJobId(jobId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedJobId(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Không hoạt động</Badge>;
      case 'pending':
        return <Badge variant="outline">Chờ duyệt</Badge>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type) => {
    const colors = {
      'full-time': 'bg-blue-100 text-blue-800',
      'part-time': 'bg-purple-100 text-purple-800',
      'contract': 'bg-orange-100 text-orange-800',
      'remote': 'bg-green-100 text-green-800'
    };

    const labels = {
      'full-time': 'Toàn thời gian',
      'part-time': 'Bán thời gian',
      'contract': 'Hợp đồng',
      'remote': 'Từ xa'
    };
    
    return <Badge className={colors[type]}>{labels[type] || type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Công việc</h1>
        <p className="text-gray-600">Giám sát và kiểm duyệt các tin tuyển dụng</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Công việc</CardTitle>
          <CardDescription>
            Xem xét và quản lý tất cả các tin tuyển dụng trên nền tảng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, công ty hoặc địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Lọc theo loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="full-time">Toàn thời gian</SelectItem>
                <SelectItem value="part-time">Bán thời gian</SelectItem>
                <SelectItem value="contract">Hợp đồng</SelectItem>
                <SelectItem value="remote">Từ xa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <JobListSkeleton />
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">{error}</div>
              <Button onClick={() => fetchJobs()} variant="outline">
                Thử lại
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job._id} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            {getStatusBadge(job.status)}
                            {getTypeBadge(job.type)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-2">
                              <Building2 className="w-4 h-4" />
                              <span>{job.company?.name || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4" />
                              <span>{job.salary || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>{job.applicants?.length || 0} ứng viên</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>Đăng ngày {new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewJob(job._id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </Button>
                        {job.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(job._id, 'active')}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={loading}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Phê duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusChange(job._id, 'inactive')}
                              disabled={loading}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Từ chối
                            </Button>
                          </>
                        )}
                        {job.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(job._id, 'inactive')}
                            disabled={loading}
                          >
                            Vô hiệu hóa
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy công việc nào phù hợp với tiêu chí.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Detail Modal */}
      <JobDetailModal
        jobId={selectedJobId}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
}
