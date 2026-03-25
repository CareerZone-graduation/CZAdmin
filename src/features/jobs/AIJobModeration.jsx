import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { getAllJobsForAdmin, aiModerateJobLLM, getJobStatistics, resetJobToPending } from '@/services/jobService';
import * as adminService from '@/services/adminService';
import { Sparkles, CheckCircle, XCircle, Clock, Zap, TrendingUp, AlertTriangle, Building2, Calendar, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIResultDetailModal } from '@/components/jobs/AIResultDetailModal';

export function AIJobModeration() {
  const [pendingJobs, setPendingJobs] = useState([]);
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
      // Remove from neutral list
      setNeutralJobs(prev => prev.filter(j => j._id !== jobId));
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể duyệt job');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (jobId) => {
    try {
      setLoading(true);
      await adminService.rejectJob(jobId);
      toast.success('❌ Đã từ chối job');
      // Remove from neutral list
      setNeutralJobs(prev => prev.filter(j => j._id !== jobId));
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể từ chối job');
    } finally {
      setLoading(false);
    }
  };

  // Auto-moderate pending jobs when enabled
  useEffect(() => {
    if (!autoModerationEnabled) return;

    const moderatePendingJobs = async () => {
      if (pendingJobs.length === 0 || processing) return;

      console.log('🤖 Auto-moderation is ON, moderating pending jobs...');
      await handleModerateAll();
    };

    // Check and moderate immediately
    moderatePendingJobs();

    // Then check every 30 seconds
    const interval = setInterval(moderatePendingJobs, 30000);

    return () => clearInterval(interval);
  }, [autoModerationEnabled, pendingJobs.length, processing]);

  const handleToggleAutoModeration = async (enabled) => {
    try {
      setToggleLoading(true);
      const response = await adminService.setAutoModerationStatus(enabled);
      
      if (response.data?.success) {
        setAutoModerationEnabled(enabled);
        
        if (enabled) {
          toast.success('✅ Đã bật tự động duyệt - Đang duyệt tất cả job chờ duyệt...');
          // Will trigger auto-moderation via useEffect
        } else {
          toast.success('⏸️ Đã tắt tự động duyệt');
        }
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
      }
    } catch (error) {
      toast.error('Không thể tải danh sách job chờ duyệt');
    } finally {
      setLoading(false);
    }
  }, []);

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
  }, [fetchPendingJobs, fetchStats, fetchNeutralJobs]);

  const handleModerateAll = async () => {
    if (pendingJobs.length === 0) {
      toast.info('Không có job nào cần duyệt');
      return;
    }

    setProcessing(true);
    setResults([]);
    setCurrentJobIndex(0);

    const moderationResults = [];
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < pendingJobs.length; i++) {
      setCurrentJobIndex(i + 1);
      const job = pendingJobs[i];

      try {
        const response = await aiModerateJobLLM(job._id);
        
        if (response.data?.success) {
          const { aiResult } = response.data.data;
          moderationResults.push({
            jobId: job._id,
            jobTitle: job.title,
            jobDescription: job.description || '',
            jobRequirements: job.requirements || '',
            success: true,
            approved: aiResult.shouldApprove,
            confidence: aiResult.confidence,
            probabilities: aiResult.probabilities || {
              reject: aiResult.shouldApprove ? 1 - aiResult.confidence : aiResult.confidence,
              approve: aiResult.shouldApprove ? aiResult.confidence : 1 - aiResult.confidence
            },
            reasons: aiResult.reasons || [],
            summary: aiResult.summary || '',
            method: aiResult.method || 'LLM'
          });
          successCount++;
        }
      } catch (error) {
        // Job thất bại sẽ được đánh dấu NEUTRAL và bỏ qua
        console.warn(`⚠️ Bỏ qua job "${job.title}" do lỗi:`, error.message);
        moderationResults.push({
          jobId: job._id,
          jobTitle: job.title,
          success: false,
          neutral: true, // Đánh dấu là NEUTRAL
          error: error.message
        });
        failedCount++;
      }

      // Delay nhỏ giữa các request
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setResults(moderationResults);
    setProcessing(false);
    
    // Hiển thị thông báo tổng kết
    if (failedCount > 0) {
      toast.warning(`Hoàn tất: ${successCount} job đã duyệt, ${failedCount} job không xác định (cần duyệt thủ công)`);
    } else {
      toast.success(`✅ Đã duyệt thành công ${successCount} job`);
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
        
        // Remove from pending list and refresh
        setPendingJobs(prev => prev.filter(j => j._id !== job._id));
        
        // Remove from neutral list if it was there
        setNeutralJobs(prev => prev.filter(j => j._id !== job._id));
        
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

  const progress = pendingJobs.length > 0 ? (currentJobIndex / pendingJobs.length) * 100 : 0;

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
                <p className="text-sm font-medium text-green-700">Đã duyệt</p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {results.filter(r => r.success && r.approved).length}
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
                  {results.filter(r => r.success && !r.approved).length}
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
          {loading && pendingJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : pendingJobs.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">Không có job nào cần duyệt</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
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
                  className="flex items-start justify-between p-4 border-2 border-yellow-200 rounded-lg bg-white hover:shadow-md transition-shadow"
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
    </div>
  );
}
