import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { getCompanyJobs } from '@/services/companyService';
import { activateJob, deactivateJob } from '@/services/jobService';
import JobDetailModal from '@/components/jobs/JobDetailModal';
import {
  Briefcase,
  Search,
  Eye,
  Edit,
  Power,
  PowerOff,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '@/utils/formatDate';

export function CompanyJobsSection({ companyId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt_desc');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 5, // Changed from 20 to 5
        status: activeTab,
        search: search || undefined,
        sort
      };

      const response = await getCompanyJobs(companyId, params);
      setJobs(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error('Error fetching company jobs:', error);
      toast.error('Không thể tải danh sách tin tuyển dụng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [companyId, activeTab, page, sort]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (page === 1) {
        fetchJobs();
      } else {
        setPage(1);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleActivate = async (jobId) => {
    try {
      setActionLoading(jobId);
      await activateJob(jobId);
      toast.success('Kích hoạt tin tuyển dụng thành công');
      fetchJobs();
    } catch (error) {
      console.error('Error activating job:', error);
      toast.error('Không thể kích hoạt tin tuyển dụng');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (jobId) => {
    try {
      setActionLoading(jobId);
      await deactivateJob(jobId);
      toast.success('Vô hiệu hóa tin tuyển dụng thành công');
      fetchJobs();
    } catch (error) {
      console.error('Error deactivating job:', error);
      toast.error('Không thể vô hiệu hóa tin tuyển dụng');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewJob = (jobId) => {
    setSelectedJobId(jobId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedJobId(null);
  };

  const getStatusBadge = (job) => {
    if (!job.approved) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Chờ duyệt</Badge>;
    }

    switch (job.status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Đang hoạt động</Badge>;
      case 'EXPIRED':
        return <Badge variant="outline" className="bg-gray-100 text-gray-600">Hết hạn</Badge>;
      case 'INACTIVE':
        return <Badge variant="destructive">Không hoạt động</Badge>;
      default:
        return null;
    }
  };

  const renderJobCard = (job) => (
    <Card key={job._id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              {getStatusBadge(job)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Đăng: {formatDate(job.createdAt)}</span>
              </div>
              {job.expiresAt && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Hết hạn: {formatDate(job.expiresAt)}</span>
                </div>
              )}
              {job.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {[job.location.province, job.location.district]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>
                    {job.salary.min && job.salary.max
                      ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} VNĐ`
                      : 'Thỏa thuận'}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{job.applicationCount || 0} ứng tuyển</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewJob(job._id)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem chi tiết
              </Button>

              {job.status === 'ACTIVE' && job.approved && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeactivate(job._id)}
                  disabled={actionLoading === job._id}
                >
                  <PowerOff className="w-4 h-4 mr-2" />
                  Vô hiệu hóa
                </Button>
              )}

              {(job.status === 'EXPIRED' || job.status === 'INACTIVE') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleActivate(job._id)}
                  disabled={actionLoading === job._id}
                >
                  <Power className="w-4 h-4 mr-2" />
                  Kích hoạt
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5" />
            <span>Quản lý tin tuyển dụng</span>
          </CardTitle>
          <CardDescription>
            Danh sách tất cả tin tuyển dụng của công ty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
              <TabsTrigger value="expired">Hết hạn</TabsTrigger>
              <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
              <TabsTrigger value="inactive">Không hoạt động</TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tiêu đề..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt_desc">Mới nhất</SelectItem>
                  <SelectItem value="createdAt_asc">Cũ nhất</SelectItem>
                  <SelectItem value="expiresAt_desc">Hết hạn muộn nhất</SelectItem>
                  <SelectItem value="expiresAt_asc">Hết hạn sớm nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value={activeTab} className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-48" />
                  ))}
                </div>
              ) : jobs.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {jobs.map(renderJobCard)}
                  </div>

                  {meta && meta.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-gray-600">
                        Hiển thị {((page - 1) * meta.itemsPerPage) + 1} - {Math.min(page * meta.itemsPerPage, meta.totalItems)} trong tổng số {meta.totalItems} tin
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                        >
                          Trước
                        </Button>
                        <span className="text-sm">
                          Trang {page} / {meta.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(page + 1)}
                          disabled={page === meta.totalPages}
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không tìm thấy tin tuyển dụng nào</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Job Detail Modal */}
      <JobDetailModal
        jobId={selectedJobId}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </>
  );
}
