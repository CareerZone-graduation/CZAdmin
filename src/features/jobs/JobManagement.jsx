import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { toast } from 'sonner';
import { getAllJobsForAdmin, updateJobStatus, activateJob, deactivateJob, approveJob, rejectJob } from '@/services/jobService';
import { getAllCompaniesForAdmin } from '@/services/companyService';
import { JobListSkeleton } from '@/components/common/JobListSkeleton';
import JobDetailModal from '@/components/jobs/JobDetailModal';
import { Pagination } from '@/components/common/Pagination';
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
  X,
  ChevronsUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(''); // Input value
  const [searchTerm, setSearchTerm] = useState(''); // Actual search term for API
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('createdAt_desc');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companySearchOpen, setCompanySearchOpen] = useState(false);
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  // Fetch companies for filter dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompaniesForAdmin({ limit: 1000 });
        if (response.data?.success) {
          const companyList = response.data.data
            .filter(item => item.company && item.company.name)
            .map(item => ({
              id: item._id,
              name: item.company.name
            }));
          setCompanies(companyList);
        }
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch jobs from API
  const fetchJobs = useCallback(async (page = meta.currentPage) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: page,
        limit: meta.limit
      };

      if (searchTerm) queryParams.search = searchTerm;
      if (statusFilter !== 'all') queryParams.status = statusFilter;
      if (companyFilter) queryParams.company = companyFilter;
      if (sortFilter) queryParams.sort = sortFilter;

      const response = await getAllJobsForAdmin(queryParams);
      setJobs(response.data.data || []);
      setMeta(response.data?.meta || meta);
    } catch (error) {
      setError(error.message || 'Không thể tải danh sách công việc');
      toast.error(error.message || 'Không thể tải danh sách công việc');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, companyFilter, sortFilter, meta.limit]);

  const handlePageChange = (newPage) => {
    setMeta((prev) => ({ ...prev, currentPage: newPage }));
    fetchJobs(newPage);
  };

  // Load jobs when filters change - always reset to page 1
  useEffect(() => {
    setMeta((prev) => ({ ...prev, currentPage: 1 }));
    fetchJobs(1);
  }, [searchTerm, statusFilter, companyFilter, sortFilter]);

  // Handle search button click
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


  const handleStatusChange = useCallback(async (jobId, newStatus) => {
    try {
      setLoading(true);
      await updateJobStatus(jobId, newStatus);

      const statusMessages = {
        active: 'Đã phê duyệt công việc',
        inactive: 'Đã từ chối công việc',
        pending: 'Đã đưa công việc về trạng thái chờ duyệt'
      };
      toast.success(statusMessages[newStatus] || 'Đã cập nhật trạng thái công việc');

      // Refresh danh sách công việc từ server để cập nhật số liệu
      await fetchJobs();
    } catch (error) {
      toast.error(error.message || 'Không thể cập nhật trạng thái công việc');
    } finally {
      setLoading(false);
    }
  }, [fetchJobs]);

  const handleActivateJob = useCallback(async (jobId) => {
    try {
      setLoading(true);
      await activateJob(jobId);

      toast.success('Đã kích hoạt lại công việc');

      // Refresh danh sách công việc từ server để cập nhật số liệu
      await fetchJobs();
    } catch (error) {
      toast.error(error.message || 'Không thể kích hoạt lại công việc');
    } finally {
      setLoading(false);
    }
  }, [fetchJobs]);

  const handleDeactivateJob = useCallback(async (jobId) => {
    try {
      setLoading(true);
      await deactivateJob(jobId);

      // Update local state
      setJobs(prev => prev.map(job =>
        job._id === jobId ? { ...job, status: 'INACTIVE' } : job
      ));

      toast.success('Đã vô hiệu hóa công việc');
    } catch (error) {
      toast.error(error.message || 'Không thể vô hiệu hóa công việc');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApproveJob = useCallback(async (jobId) => {
    try {
      setLoading(true);
      await approveJob(jobId);

      // Update local state
      setJobs(prev => prev.map(job =>
        job._id === jobId ? { ...job, approved: true } : job
      ));

      toast.success('Đã phê duyệt công việc');
    } catch (error) {
      toast.error(error.message || 'Không thể phê duyệt công việc');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRejectJob = useCallback(async (jobId) => {
    try {
      setLoading(true);
      await rejectJob(jobId);

      // Update local state
      setJobs(prev => prev.map(job =>
        job._id === jobId ? { ...job, approved: false, status: 'INACTIVE' } : job
      ));

      toast.success('Đã từ chối công việc');
    } catch (error) {
      toast.error(error.message || 'Không thể từ chối công việc');
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

  const getStatusBadge = (status, approved) => {
    // If not approved, show pending badge regardless of status
    if (approved === false) {
      return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>;
    }

    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'INACTIVE':
        return <Badge variant="secondary">Không hoạt động</Badge>;
      case 'EXPIRED':
        return <Badge className="bg-red-100 text-red-800">Hết hạn</Badge>;
      default:
        return null;
    }
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, kỹ năng..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
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
                  Tìm
                </Button>
              </div>
            </div>
            <Popover open={companySearchOpen} onOpenChange={setCompanySearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={companySearchOpen}
                  className="w-full justify-between"
                >
                  {companyFilter
                    ? companies.find((company) => company.id === companyFilter)?.name
                    : "Lọc theo công ty..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Tìm công ty..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy công ty.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          setCompanyFilter('');
                          setCompanySearchOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            companyFilter === '' ? "opacity-100" : "opacity-0"
                          )}
                        />
                        Tất cả công ty
                      </CommandItem>
                      {companies.map((company) => (
                        <CommandItem
                          key={company.id}
                          value={`${company.id}-${company.name}`}
                          keywords={[company.name]}
                          onSelect={() => {
                            setCompanyFilter(company.id);
                            setCompanySearchOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              companyFilter === company.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {company.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                <SelectItem value="EXPIRED">Hết hạn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortFilter} onValueChange={setSortFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt_desc">Mới nhất</SelectItem>
                <SelectItem value="createdAt_asc">Cũ nhất</SelectItem>
                <SelectItem value="title_desc">Tiêu đề (Z-A)</SelectItem>
                <SelectItem value="title_asc">Tiêu đề (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <JobListSkeleton />
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-700 mb-2">{error}</div>
              <Button onClick={() => fetchJobs()} variant="outline">
                Thử lại
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <Card key={job._id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between gap-10">
                      <div className="flex items-start gap-6 flex-1">
                        <div className="flex-shrink-0">
                          <img
                            src={job.recruiterProfileId?.company?.logo || '/placeholder-logo.png'}
                            alt={job.recruiterProfileId?.company?.name || 'Company Logo'}
                            className="w-35 h-20 rounded-lg object-contain border-2 border-gray-300 p-3 bg-white"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            {getStatusBadge(job.status, job.approved)}
                          </div>
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <Building2 className="w-4 h-4 flex-shrink-0" />
                              <span>{job.recruiterProfileId?.company?.name || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-4">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span>Đăng ngày {new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewJob(job._id)}
                          className="whitespace-nowrap px-4 py-2"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem
                        </Button>
                        {job.approved === false && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveJob(job._id)}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={loading}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Phê duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectJob(job._id)}
                              disabled={loading}
                              className="whitespace-nowrap px-4 py-2"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Từ chối
                            </Button>
                          </>
                        )}
                        {job.approved === true && job.status === 'ACTIVE' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeactivateJob(job._id)}
                            disabled={loading}
                            className="whitespace-nowrap px-4 py-2"
                          >
                            Vô hiệu hóa
                          </Button>
                        )}
                        {job.approved === true && job.status === 'INACTIVE' && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap px-4 py-2"
                            onClick={() => handleActivateJob(job._id)}
                            disabled={loading}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Kích hoạt lại
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && jobs.length === 0 && (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy công việc nào phù hợp với tiêu chí.</p>
            </div>
          )}
          <div className="mt-6">
            <Pagination
              currentPage={meta.currentPage}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
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
