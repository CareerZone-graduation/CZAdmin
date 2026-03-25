import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { getAllJobsForAdmin, getJobStatistics, resetJobToPending } from '@/services/jobService';
import { CheckCircle, XCircle, Building2, Calendar, Info, RotateCcw, Sparkles, Bot, Search, Filter, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIResultDetailModal } from '@/components/jobs/AIResultDetailModal';
import { Pagination } from '@/components/common/Pagination';

export function AIModeratedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, approved, rejected
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [stats, setStats] = useState({ active: 0, inactive: 0 });
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const [dateFilter, setDateFilter] = useState('all'); // all, today, yesterday, last7days, last30days, custom
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  const fetchAIModeratedJobs = useCallback(async (page = meta.currentPage) => {
    try {
      setLoading(true);

      const queryParams = {
        page: page,
        limit: meta.limit,
        sort: 'createdAt_desc'
      };

      if (searchTerm) queryParams.search = searchTerm;

      // Filter by status
      if (statusFilter === 'approved') {
        queryParams.status = 'ACTIVE';
        queryParams.moderationStatus = 'APPROVED';
      } else if (statusFilter === 'rejected') {
        queryParams.moderationStatus = 'REJECTED';
      }

      const response = await getAllJobsForAdmin(queryParams);
      
      // Filter only jobs that have AI moderation result
      const allJobs = response.data.data || [];
      const aiModeratedJobs = allJobs.filter(
        job => job.aiModerationResult && 
               job.aiModerationResult.moderatedAt &&
               job.aiModerationResult.prediction !== null &&
               job.aiModerationResult.prediction !== undefined
      );

      console.log('Total jobs from API:', allJobs.length);
      console.log('AI moderated jobs:', aiModeratedJobs.length);
      console.log('Sample job:', allJobs[0]);

      setJobs(aiModeratedJobs);
      
      // Update meta with filtered count
      setMeta({
        ...response.data.meta,
        totalItems: aiModeratedJobs.length,
        totalPages: Math.ceil(aiModeratedJobs.length / meta.limit)
      });
    } catch (error) {
      console.error('Error fetching AI moderated jobs:', error);
      toast.error('Không thể tải danh sách job đã duyệt bằng AI');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, meta.limit]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getJobStatistics();
      if (response.data?.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchAIModeratedJobs(1);
    fetchStats();
  }, [searchTerm, statusFilter]);

  const handlePageChange = (newPage) => {
    setMeta((prev) => ({ ...prev, currentPage: newPage }));
    fetchAIModeratedJobs(newPage);
  };

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewDetail = (job) => {
    const aiResult = job.aiModerationResult;
    setSelectedJob({
      jobId: job._id,
      jobTitle: job.title,
      jobDescription: job.description || '',
      jobRequirements: job.requirements || '',
      success: true,
      approved: job.moderationStatus === 'APPROVED',
      confidence: aiResult.confidence,
      probabilities: aiResult.probabilities || {
        approve: aiResult.confidence,
        reject: 1 - aiResult.confidence
      },
      reasons: aiResult.reasons || [],
      summary: aiResult.summary || '',
      method: aiResult.method || 'PhoBERT'
    });
    setIsDetailModalOpen(true);
  };

  const handleUndoDecision = async (jobId) => {
    try {
      setLoading(true);
      await resetJobToPending(jobId);
      
      toast.success('Đã hoàn tác: Job được đưa về trạng thái chờ duyệt');
      
      // Remove from list
      setJobs(prev => prev.filter(j => j._id !== jobId));
      setIsDetailModalOpen(false);
      fetchStats();
    } catch (error) {
      toast.error('Không thể hoàn tác quyết định');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (job) => {
    if (job.moderationStatus === 'APPROVED') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đã duyệt
        </Badge>
      );
    }
    if (job.moderationStatus === 'REJECTED') {
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Đã từ chối
        </Badge>
      );
    }
    return <Badge variant="outline">Không xác định</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Bot className="w-8 h-8 text-purple-600" />
          Job Đã Duyệt Bằng AI
        </h1>
        <p className="text-gray-600 mt-2">Xem lại các job đã được AI phân tích và duyệt</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Tổng số job AI duyệt</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{jobs.length}</p>
              </div>
              <Sparkles className="w-12 h-12 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Đã phê duyệt</p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {jobs.filter(j => j.moderationStatus === 'APPROVED').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Đã từ chối</p>
                <p className="text-3xl font-bold text-red-900 mt-2">
                  {jobs.filter(j => j.moderationStatus === 'REJECTED').length}
                </p>
              </div>
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Job</CardTitle>
          <CardDescription>Tất cả job đã được AI phân tích và đưa ra quyết định</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề..."
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
                    <XCircle className="w-3 h-3" />
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo kết quả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="approved">Đã phê duyệt</SelectItem>
                <SelectItem value="rejected">Đã từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job List */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Chưa có job nào được AI duyệt</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job._id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {job.recruiterProfileId?.company?.logo ? (
                            <img
                              src={job.recruiterProfileId.company.logo}
                              alt="Company"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Building2 className="w-7 h-7 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            {getStatusBadge(job)}
                            <Badge variant="outline" className="text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              {job.aiModerationResult?.method || 'AI'}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Building2 className="w-4 h-4" />
                              <span>{job.recruiterProfileId?.company?.name || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>Duyệt: {new Date(job.aiModerationResult.moderatedAt).toLocaleDateString('vi-VN')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                <span>Độ tin cậy: {(job.aiModerationResult.confidence * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                            {job.aiModerationResult.summary && (
                              <p className="text-sm text-gray-600 italic line-clamp-2">
                                "{job.aiModerationResult.summary}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetail(job)}
                        >
                          <Info className="w-4 h-4 mr-1" />
                          Chi tiết
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUndoDecision(job._id)}
                          disabled={loading}
                          className="text-orange-600 border-orange-300 hover:bg-orange-50"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Hoàn tác
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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

      {/* Detail Modal */}
      <AIResultDetailModal
        result={selectedJob}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedJob(null);
        }}
        onUndo={handleUndoDecision}
      />
    </div>
  );
}
