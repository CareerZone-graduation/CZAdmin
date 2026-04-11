import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw, Info, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIResultDetailModal({ result, isOpen, onClose, onUndo }) {
  if (!result) return null;

  const { jobId, jobTitle, jobDescription, jobRequirements, success, approved, confidence, probabilities, reasons, summary, method } = result;

  const rejectProb = probabilities?.reject || (success && !approved ? confidence : 1 - confidence);
  const approveProb = probabilities?.approve || (success && approved ? confidence : 1 - confidence);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {success ? (
              approved ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )
            ) : (
              <Info className="w-6 h-6 text-gray-600" />
            )}
            Chi Tiết Kết Quả AI
          </DialogTitle>
          <DialogDescription>
            Phân tích chi tiết quyết định của AI cho job này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">Tiêu đề Job</label>
            <p className="mt-1 text-lg font-semibold">{jobTitle}</p>
          </div>

          {/* Job Content */}
          {(jobDescription || jobRequirements) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobDescription && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Mô tả công việc</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{jobDescription}</p>
                  </div>
                </div>
              )}
              
              {jobRequirements && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Yêu cầu ứng viên</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{jobRequirements}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Decision */}
          <div>
            <label className="text-sm font-medium text-gray-700">Quyết định của AI</label>
            <div className="mt-2">
              <Badge
                variant={success ? (approved ? "default" : "destructive") : "secondary"}
                className={cn(
                  "text-lg px-4 py-2",
                  approved && "bg-green-600"
                )}
              >
                {success ? (approved ? "✓ Phê duyệt" : "✗ Từ chối") : "Lỗi"}
              </Badge>
            </div>
          </div>

          {/* Confidence Score & Probability Breakdown */}
          {success && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Confidence Score */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Độ tin cậy của quyết định
                </label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {(confidence * 100).toFixed(1)}%
                    </span>
                    <span className="text-sm text-gray-500">
                      {confidence >= 0.8 ? 'Rất cao' : confidence >= 0.6 ? 'Cao' : 'Trung bình'}
                    </span>
                  </div>
                  <Progress value={confidence * 100} className="h-3" />
                </div>
              </div>

              {/* Probability Breakdown */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Phân tích xác suất
                </label>
                <div className="space-y-3">
                  {/* Approve Probability */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Phê duyệt</span>
                      </div>
                      <span className="text-sm font-bold text-green-700">
                        {(approveProb * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={approveProb * 100} 
                      className="h-2 bg-green-100"
                    />
                  </div>

                  {/* Reject Probability */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-700">Từ chối</span>
                      </div>
                      <span className="text-sm font-bold text-red-700">
                        {(rejectProb * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={rejectProb * 100} 
                      className="h-2 bg-red-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Explanation */}
          {success && (
            <>
              {/* Summary from LLM */}
              {summary && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-900 mb-2">
                        Tóm tắt {method === 'LLM' && '(AI LLM)'}
                      </h4>
                      <p className="text-sm text-purple-800">{summary}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Reasons from LLM */}
              {reasons && reasons.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Phân tích chi tiết từ AI
                  </h4>
                  <ul className="space-y-3">
                    {reasons.map((reason, index) => {
                      // Detect issue type from reason text
                      const isSpam = reason.toLowerCase().includes('lặp') || reason.toLowerCase().includes('spam');
                      const isFraud = reason.toLowerCase().includes('lừa đảo') || reason.toLowerCase().includes('bất thường');
                      const isMissing = reason.toLowerCase().includes('thiếu') || reason.toLowerCase().includes('không có');
                      
                      let iconColor = 'text-amber-600';
                      let Icon = AlertTriangle;
                      
                      if (isSpam) {
                        iconColor = 'text-red-600';
                        Icon = XCircle;
                      } else if (isFraud) {
                        iconColor = 'text-orange-600';
                        Icon = AlertTriangle;
                      } else if (isMissing) {
                        iconColor = 'text-yellow-600';
                        Icon = Info;
                      } else if (approved) {
                        iconColor = 'text-green-600';
                        Icon = CheckCircle;
                      }
                      
                      return (
                        <li key={index} className="flex items-start gap-3 text-sm">
                          <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium">Lý do {index + 1}:</span>
                            <p className="text-gray-700 mt-1">{reason}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* General Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-2">Giải thích</h4>
                    <p className="text-sm text-blue-800">
                      {approved ? (
                        <>
                          AI đã phân tích nội dung job và quyết định <strong>phê duyệt</strong> với độ tin cậy{' '}
                          <strong>{(confidence * 100).toFixed(1)}%</strong>. Xác suất phê duyệt ({(approveProb * 100).toFixed(1)}%) 
                          cao hơn xác suất từ chối ({(rejectProb * 100).toFixed(1)}%).
                        </>
                      ) : (
                        <>
                          AI đã phân tích nội dung job và quyết định <strong>từ chối</strong> với độ tin cậy{' '}
                          <strong>{(confidence * 100).toFixed(1)}%</strong>. Xác suất từ chối ({(rejectProb * 100).toFixed(1)}%) 
                          cao hơn xác suất phê duyệt ({(approveProb * 100).toFixed(1)}%).
                        </>
                      )}
                    </p>
                    {confidence < 0.6 && (
                      <p className="text-sm text-amber-700 mt-2">
                        ⚠️ Lưu ý: Độ tin cậy thấp. Nên xem xét lại thủ công.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Đóng
            </Button>
            {success && onUndo && (
              <Button
                onClick={() => onUndo(jobId, approved)}
                variant="outline"
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Hoàn tác quyết định
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
