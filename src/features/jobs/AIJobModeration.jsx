import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getAllJobsForAdmin, aiModerateJobLLM, getJobStatistics, resetJobToPending } from '@/services/jobService';
import * as adminService from '@/services/adminService';
import { Sparkles, CheckCircle, XCircle, Clock, Zap, TrendingUp, AlertTriangle, Building2, Calendar, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIResultDetailModal } from '@/components/jobs/AIResultDetailModal';

export function AIJobModeration() {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [filteredPendingJobs, setFilteredPendingJobs] = useState([]);
  const [neutralJobs, setNeutralJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({ pending: 0 });
  const [selectedResult, setSelectedResult] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [autoModerationEnabled, setAutoModerationEnabled] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt:desc');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingJobId, setRejectingJobId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [recentActions, setRecentActions] = useState({}); // { jobId: 'APPROVED' | 'REJECTED' }

  const triggerVisualFeedback = (jobId, status, callback) => {
    setRecentActions(prev => ({ ...prev, [jobId]: status }));
    // Wait for animation to finish before calling callback (removal)
    setTimeout(() => {
      setRecentActions(prev => {
        const newState = { ...prev };
        delete newState[jobId];
        return newState;
      });
      if (callback) callback();
    }, 1500); // Animation duration
  };
  // Always use LLM - PhoBERT is not accurate without training

  // Load auto-moderation status
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await adminService.getAutoModerationStatus();
        if (response.data?.success) {
          setAutoModerationEnabled(response.data.data.enabled);
        }
      } catch (error) {
        console.error('Failed to load auto-moderation status:', error);
      }
    };
    loadStatus();
  }, []);
const handleApprove = async (jobId) => {
    try {
      setLoading(true);
      await adminService.approveJob(jobId);
      toast.success('✅ Đã duyệt job thành công');
      
      triggerVisualFeedback(jobId, 'APPROVED', () => {
        // Remove from neutral list after animation
        setNeutralJobs(prev => prev.filter(j => j._id !== jobId));
      });
      
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể duyệt job');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClick = (jobId) => {
    setRejectingJobId(jobId);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      setLoading(true);
      await adminService.rejectJob(rejectingJobId, rejectionReason.trim());
      toast.success('❌ Đã từ chối job');
      
      const jobId = rejectingJobId;
      triggerVisualFeedback(jobId, 'REJECTED', () => {
        // Remove from neutral list after animation
        setNeutralJobs(prev => prev.filter(j => j._id !== jobId));
      });
      
      setRejectDialogOpen(false);
      setRejectingJobId(null);
      setRejectionReason('');
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể từ chối job');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (jobId) => {
    // Deprecated - use handleRejectClick instead
    handleRejectClick(jobId);
  };

  // Auto-moderate pending jobs when enabled
  useEffect(() => {
    if (!autoModerationEnabled) return;

    let isFirstRun = true;
    let isRunning = false;
    let hasModeratedThisBatch = false; // Flag để tránh moderate lại cùng 1 batch

    const moderatePendingJobs = async () => {
      // Lấy pending jobs mới nhất từ state
      if (pendingJobs.length === 0 || processing || isRunning) return;

      // Nếu đã moderate batch này rồi, chỉ chạy lại sau 30s
      if (hasModeratedThisBatch) return;

      isRunning = true;
      hasModeratedThisBatch = true; // Đánh dấu đã moderate batch này
      console.log('🤖 Auto-moderation is ON, moderating pending jobs...');
      
      try {
        // Chỉ hiển thị toast lần đầu tiên, các lần sau chạy im lặng
        await handleModerateAll(!isFirstRun);
        isFirstRun = false;
      } finally {
        isRunning = false;
      }
    };

    // Check and moderate immediately
    moderatePendingJobs();

    // Then check every 30 seconds
    const interval = setInterval(() => {
      hasModeratedThisBatch = false; // Reset flag để cho phép moderate batch mới
      moderatePendingJobs();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [autoModerationEnabled, pendingJobs.length]); // Thêm lại pendingJobs.length

  const handleToggleAutoModeration = async (enabled) => {
    try {
      setToggleLoading(true);
      const response = await adminService.setAutoModerationStatus(enabled);
      
      if (response.data?.success) {
        setAutoModerationEnabled(enabled);
        
        if (!enabled) {
          toast.success('⏸️ Đã tắt tự động duyệt');
        }
        // Không hiển thị toast khi bật, để handleModerateAll hiển thị kết quả
      }
    } catch (error) {
      toast.error('Không thể thay đổi cài đặt tự động duyệt');
      setAutoModerationEnabled(!enabled);
    } finally {
      setToggleLoading(false);
    }
  };

  const fetchPendingJobs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllJobsForAdmin({ status: 'PENDING', limit: 100 });
      if (response.data?.success) {
        // Lọc bỏ các job có moderationStatus = 'NEUTRAL' (đã thất bại trước đó)
        const validPendingJobs = (response.data.data || []).filter(
          job => job.moderationStatus !== 'NEUTRAL'
        );
        setPendingJobs(validPendingJobs);
        setFilteredPendingJobs(validPendingJobs);
      }
    } catch (error) {
      toast.error('Không thể tải danh sách job chờ duyệt');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort pending jobs
  useEffect(() => {
    let filtered = [...pendingJobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.recruiterProfileId?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt:desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'createdAt:asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title:asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title:desc':
          return (b.title || '').localeCompare(a.title || '');
        default:
          return 0;
      }
    });

    setFilteredPendingJobs(filtered);
  }, [pendingJobs, searchTerm, sortBy]);

  const fetchNeutralJobs = useCallback(async () => {
    try {
      const response = await getAllJobsForAdmin({ status: 'NEUTRAL', limit: 100 });
      if (response.data?.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch neutral jobs:', error);
      return [];
    }
  }, []);

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
    fetchPendingJobs();
    fetchStats();
    
    // Load neutral jobs
    fetchNeutralJobs().then(jobs => setNeutralJobs(jobs));

    // Auto-refresh mỗi 10 giây để cập nhật job mới
    const refreshInterval = setInterval(() => {
      fetchPendingJobs();
      fetchStats();
      fetchNeutralJobs().then(jobs => setNeutralJobs(jobs));
    }, 10000); // 10 seconds

    return () => clearInterval(refreshInterval);
  }, [fetchPendingJobs, fetchStats, fetchNeutralJobs]);

  const handleModerateAll = async (silent = false) => {
    if (pendingJobs.length === 0) {
      if (!silent) toast.info('Không có job nào cần duyệt');
      return;
    }

    setProcessing(true);
    setResults([]);
    setCurrentJobIndex(0);

    const moderationResults = [];
    let successCount = 0;
    let failedCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;
    
    // Lưu số lượng job ban đầu để tránh bị thay đổi khi fetch
    const totalJobs = pendingJobs.length;

    for (let i = 0; i < totalJobs; i++) {
      setCurrentJobIndex(i + 1);
      const job = pendingJobs[i];

      try {
        const response = await aiModerateJobLLM(job._id);
        
        console.log('AI Moderation Response:', response); // Debug log
        
        if (response.data?.success) {
          const { aiResult } = response.data.data;
          
          if (!aiResult) {
            console.error('aiResult is undefined for job:', job._id);
            throw new Error('AI result is missing');
          }
          
          const isApproved = aiResult.shouldApprove;
          
          moderationResults.push({
            jobId: job._id,
            jobTitle: job.title,
            jobDescription: job.description || '',
            jobRequirements: job.requirements || '',
            success: true,
            approved: isApproved,
            confidence: aiResult.confidence,
            probabilities: aiResult.probabilities || {
              reject: isApproved ? 1 - aiResult.confidence : aiResult.confidence,
              approve: isApproved ? aiResult.confidence : 1 - aiResult.confidence
            },
            reasons: aiResult.reasons || [],
            summary: aiResult.summary || '',
            method: aiResult.method || 'LLM'
          });
          
          successCount++;
          if (isApproved) {
            approvedCount++;
          } else {
            rejectedCount++;
          }
        }
      } catch (error) {
        // Job thất bại sẽ được đánh dấu NEUTRAL và bỏ qua
        console.error(`❌ Error moderating job "${job.title}":`, error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        moderationResults.push({
          jobId: job._id,
          jobTitle: job.title,
          success: false,
          neutral: true, // Đánh dấu là NEUTRAL
          error: error.message || 'Unknown error'
        });
        failedCount++;
      }

      // Delay nhỏ giữa các request
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setResults(moderationResults);
    setProcessing(false);
    setCurrentJobIndex(0); // Reset về 0
    
    // Hiển thị thông báo đơn giản (chỉ khi không phải auto-moderate)
    if (!silent && totalJobs > 0) {
      toast.success(`✅ AI đã xem xét thành công ${totalJobs} job`);
    }
    
    // Refresh data silently - wait for backend to update
    setTimeout(() => {
      fetchPendingJobs();
      fetchStats();
      fetchNeutralJobs().then(jobs => setNeutralJobs(jobs));
    }, 1500);
  };

  const handleModerateSingle = async (job) => {
    try {
      setLoading(true);
      const response = await aiModerateJobLLM(job._id);
      
      if (response.data?.success) {
        const { aiResult } = response.data.data;
        
        triggerVisualFeedback(job._id, aiResult.shouldApprove ? 'APPROVED' : 'REJECTED', () => {
          // Remove from list after animation
          setPendingJobs(prev => prev.filter(j => j._id !== job._id));
          setNeutralJobs(prev => prev.filter(j => j._id !== job._id));
        });
        
        fetchStats();
        
        // Show success message
        if (aiResult.shouldApprove) {
          toast.success(`✅ Đã phê duyệt: ${job.title}`);
        } else {
          toast.warning(`❌ Đã từ chối: ${job.title}`);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Không thể duyệt job');
      
      // Refresh neutral jobs to show the failed job
      fetchNeutralJobs().then(jobs => setNeutralJobs(jobs));
    } finally {
      setLoading(false);
    }
  };

  const handleUndoDecision = async (jobId, wasApproved) => {
    try {
      setLoading(true);
      
      // Hoàn tác: Đưa job về trạng thái PENDING (chờ duyệt)
      await resetJobToPending(jobId);
      
      toast.success('Đã hoàn tác: Job được đưa về trạng thái chờ duyệt');
      
      // Remove from results và add back to pending list
      setResults(prev => prev.filter(r => r.jobId !== jobId));
      
      // Refresh pending jobs
      fetchPendingJobs();
      
      setIsDetailModalOpen(false);
      fetchStats();
    } catch (error) {
      toast.error('Không thể hoàn tác quyết định');
    } finally {
      setLoading(false);
    }
  };

  const progress = pendingJobs.length > 0 && currentJobIndex > 0 
    ? (currentJobIndex / pendingJobs.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-600" />
          AI Duyệt Job Tự Động
        </h1>
        <p className="text-gray-600 mt-2">Sử dụng AI để tự động phân tích và duyệt tin tuyển dụng</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Job chờ duyệt</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{stats.pending || 0}</p>
              </div>
              <Clock className="w-12 h-12 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Không xác định</p>
                <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.neutral || 0}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
         <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">AI đã duyệt</p>
                        <p className="text-3xl font-bold text-green-900 mt-2">
                          {stats.aiApproved -1 || 0}
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
                        <p className="text-sm font-medium text-red-700">AI đã từ chối</p>
                        <p className="text-3xl font-bold text-red-900 mt-2">
                          {stats.aiRejected-1 || 0}
                        </p>
                      </div>
                      <XCircle className="w-12 h-12 text-red-400" />
                    </div>
                  </CardContent>
                </Card>
       
      </div>

      {/* Auto Moderation Control */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Duyệt Tự Động
          </CardTitle>
          <CardDescription>
            AI sẽ tự động phân tích và duyệt tất cả job đang chờ
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {processing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Đang xử lý với LLM (GPT)...</span>
                <span className="text-gray-600">
                  {currentJobIndex} / {pendingJobs.length}
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-center text-sm text-gray-500">
                Vui lòng đợi, AI đang phân tích các job...
              </p>
            </div>
          ) : (
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Zap className={`w-8 h-8 ${autoModerationEnabled ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-bold text-lg text-gray-900">Tự động duyệt bằng AI</p>
                    <p className="text-sm text-gray-600">
                      {autoModerationEnabled 
                        ? '✅ Đang hoạt động - Tự động duyệt tất cả job chưa duyệt' 
                        : '⏸️ Đã tắt - Job cần duyệt thủ công'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={autoModerationEnabled}
                  onCheckedChange={handleToggleAutoModeration}
                  disabled={toggleLoading || processing}
                  className="scale-125"
                />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-purple-200">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${autoModerationEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {pendingJobs.length} job đang chờ duyệt
                  </span>
                </div>
                {autoModerationEnabled && pendingJobs.length > 0 && (
                  <span className="text-xs text-green-700 font-medium">
                    🤖 Đang tự động duyệt...
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

   

      {/* Pending Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Job Chờ Duyệt</CardTitle>
          <CardDescription>
            Bạn có thể duyệt từng job riêng lẻ hoặc dùng chức năng duyệt tự động ở trên
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên job hoặc công ty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="createdAt:desc">Mới nhất</option>
              <option value="createdAt:asc">Cũ nhất</option>
              <option value="title:asc">Tên A-Z</option>
              <option value="title:desc">Tên Z-A</option>
            </select>
          </div>

          {loading && filteredPendingJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : filteredPendingJobs.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">
                {searchTerm ? 'Không tìm thấy job phù hợp' : 'Không có job nào cần duyệt'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPendingJobs.map((job) => (
                <div
                  key={job._id}
                  className={cn(
                    "flex items-start justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-300",
                    recentActions[job._id] === 'APPROVED' && "animate-moderate-approve ring-2 ring-green-500",
                    recentActions[job._id] === 'REJECTED' && "animate-moderate-reject ring-2 ring-red-500"
                  )}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {job.recruiterProfileId?.company?.logo ? (
                        <img
                          src={job.recruiterProfileId.company.logo}
                          alt="Company"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {job.recruiterProfileId?.company?.name || 'N/A'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Đăng ngày {new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleModerateSingle(job)}
                    disabled={loading || processing}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Duyệt
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Neutral Jobs List - Jobs that failed AI moderation */}
      {neutralJobs.length > 0 && (
        <Card className="border-2 border-yellow-200 bg-yellow-50/30">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Job Không Xác Định ({neutralJobs.length})
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Các job này không thể được AI phân tích tự động. Click "Thử Lại" để duyệt thủ công.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {neutralJobs.map((job) => (
                <div
                  key={job._id}
                  className={cn(
                    "flex items-start justify-between p-4 border-2 border-yellow-200 rounded-lg bg-white hover:shadow-md transition-all duration-300",
                    recentActions[job._id] === 'APPROVED' && "animate-moderate-approve ring-2 ring-green-500 border-green-500",
                    recentActions[job._id] === 'REJECTED' && "animate-moderate-reject ring-2 ring-red-500 border-red-500"
                  )}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {job.recruiterProfileId?.company?.logo ? (
                        <img
                          src={job.recruiterProfileId.company.logo}
                          alt="Company"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          Không xác định
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {job.recruiterProfileId?.company?.name || 'N/A'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>Đăng ngày {new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      
                      {/* Error Reason */}
                      {job.aiModerationResult?.summary && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-yellow-900 mb-1">Lý do không duyệt được:</p>
                              <p className="text-xs text-yellow-800">{job.aiModerationResult.summary}</p>
                              {job.aiModerationResult.reasons && job.aiModerationResult.reasons.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                  {job.aiModerationResult.reasons.map((reason, idx) => (
                                    <li key={idx} className="text-xs text-yellow-700 flex items-start gap-1">
                                      <span className="text-yellow-500">•</span>
                                      <span>{reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleApprove(job._id)}
                    disabled={loading || processing}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Chấp nhận
                  </Button>
                 
                   <Button
                    onClick={() => handleReject(job._id)}
                    disabled={loading || processing}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Từ chối
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Result Detail Modal */}
      <AIResultDetailModal
        result={selectedResult}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedResult(null);
        }}
        onUndo={handleUndoDecision}
      />

      {/* Rejection Reason Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              Từ chối tin tuyển dụng
            </DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối để nhà tuyển dụng có thể cải thiện tin đăng của họ.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="rejection-reason" className="text-sm font-medium">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="rejection-reason"
                placeholder="Ví dụ: Nội dung công việc không rõ ràng, thiếu thông tin về yêu cầu ứng viên..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Lý do này sẽ được gửi đến nhà tuyển dụng qua thông báo
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectingJobId(null);
                setRejectionReason('');
              }}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleRejectConfirm}
              disabled={loading || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
