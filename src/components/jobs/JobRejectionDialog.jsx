import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { XCircle } from 'lucide-react';

export function JobRejectionDialog({
  isOpen,
  onOpenChange,
  rejectionReason,
  onReasonChange,
  onConfirm,
  onCancel,
  loading
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              onChange={(e) => onReasonChange(e.target.value)}
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
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading || !rejectionReason.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
