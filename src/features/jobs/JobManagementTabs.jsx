import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { JobManagement } from './JobManagement';
import { AIJobModeration } from './AIJobModeration';
import { AIModeratedJobs } from './AIModeratedJobsEnhanced';
import { Briefcase, Sparkles, Bot, Zap } from 'lucide-react';
import * as adminService from '@/services/adminService';

export function JobManagementTabs() {
  const [activeTab, setActiveTab] = useState('manual');
  const [autoModerationEnabled, setAutoModerationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load auto-moderation status on mount
  useEffect(() => {
    const loadAutoModerationStatus = async () => {
      try {
        const response = await adminService.getAutoModerationStatus();
        if (response.data?.success) {
          setAutoModerationEnabled(response.data.data.enabled);
        }
      } catch (error) {
        console.error('Failed to load auto-moderation status:', error);
      }
    };
    loadAutoModerationStatus();
  }, []);

  const handleToggleAutoModeration = async (enabled) => {
    try {
      setLoading(true);
      const response = await adminService.setAutoModerationStatus(enabled);
      
      if (response.data?.success) {
        setAutoModerationEnabled(enabled);
        toast.success(
          enabled 
            ? '✅ Đã bật chế độ tự động duyệt job bằng AI' 
            : '⏸️ Đã tắt chế độ tự động duyệt job'
        );
      }
    } catch (error) {
      toast.error('Không thể thay đổi cài đặt tự động duyệt');
      setAutoModerationEnabled(!enabled); // Revert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Công việc</h1>
        <p className="text-gray-600 mt-2">Giám sát và kiểm duyệt các tin tuyển dụng</p>
      </div>

      {/* Auto-Moderation Status Banner */}
      {autoModerationEnabled && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div className="flex-1">
              <p className="font-semibold text-green-900">
                🤖 Chế độ tự động duyệt đang BẬT
              </p>
              <p className="text-sm text-green-700 mt-1">
                Tất cả job mới sẽ được AI tự động phân tích và duyệt ngay khi recruiter đăng tin.
                Bạn có thể xem kết quả trong tab "Job AI Đã Duyệt".
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger 
            value="manual" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Briefcase className="w-4 h-4" />
            <div className="text-left">
              <div className="font-semibold">Duyệt Thủ Công</div>
              <div className="text-xs opacity-80">Quản lý tất cả job</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="ai-moderate" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Sparkles className="w-4 h-4" />
            <div className="text-left">
              <div className="font-semibold">AI Duyệt Job</div>
              <div className="text-xs opacity-80">Duyệt tự động bằng AI</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="ai-moderated" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Bot className="w-4 h-4" />
            <div className="text-left">
              <div className="font-semibold">Job AI Đã Duyệt</div>
              <div className="text-xs opacity-80">Xem lịch sử AI</div>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <JobManagement />
        </TabsContent>

        <TabsContent value="ai-moderate" className="space-y-6">
          <AIJobModeration />
        </TabsContent>

        <TabsContent value="ai-moderated" className="space-y-6">
          <AIModeratedJobs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
