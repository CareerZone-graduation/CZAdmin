import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { Send, X, Loader2 } from 'lucide-react';

export const AdminResponseForm = ({ 
  onSubmit, 
  onCancel,
  loading = false,
  currentStatus,
  currentPriority
}) => {
  const [response, setResponse] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [priorityUpdate, setPriorityUpdate] = useState('');
  const [error, setError] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Đang chờ' },
    { value: 'in-progress', label: 'Đang xử lý' },
    { value: 'resolved', label: 'Đã giải quyết' },
    { value: 'closed', label: 'Đã đóng' }
  ];

  const priorityOptions = [
    { value: 'urgent', label: 'Khẩn cấp' },
    { value: 'high', label: 'Cao' },
    { value: 'medium', label: 'Trung bình' },
    { value: 'low', label: 'Thấp' }
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submit
    if (isSubmitting || loading) {
      return;
    }
    
    setError('');

    // Validation
    if (!response.trim()) {
      setError('Vui lòng nhập nội dung phản hồi');
      return;
    }

    if (response.trim().length < 10) {
      setError('Nội dung phản hồi phải có ít nhất 10 ký tự');
      return;
    }

    if (response.trim().length > 5000) {
      setError('Nội dung phản hồi không được vượt quá 5000 ký tự');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        response: response.trim(),
        statusUpdate: statusUpdate || undefined,
        priorityUpdate: priorityUpdate || undefined
      });

      // Reset form on success
      setResponse('');
      setStatusUpdate('');
      setPriorityUpdate('');
      setError('');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi gửi phản hồi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setResponse('');
    setStatusUpdate('');
    setPriorityUpdate('');
    setError('');
    if (onCancel) {
      onCancel();
    }
  };

  const characterCount = response.length;
  const isOverLimit = characterCount > 5000;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <p className="text-sm">{error}</p>
            </Alert>
          )}

          {/* Response Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="response">
                Nội dung phản hồi <span className="text-red-500">*</span>
              </Label>
              <span 
                className={`text-xs ${
                  isOverLimit 
                    ? 'text-red-500 font-semibold' 
                    : characterCount > 4500 
                    ? 'text-orange-500' 
                    : 'text-muted-foreground'
                }`}
              >
                {characterCount}/5000
              </span>
            </div>
            <Textarea
              id="response"
              placeholder="Nhập nội dung phản hồi cho người dùng..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              disabled={loading}
              className={`min-h-[150px] ${isOverLimit ? 'border-red-500' : ''}`}
            />
            <p className="text-xs text-muted-foreground">
              Tối thiểu 10 ký tự, tối đa 5000 ký tự
            </p>
          </div>

          {/* Status Update */}
          <div className="space-y-2">
            <Label htmlFor="statusUpdate">Cập nhật trạng thái (Tùy chọn)</Label>
            <Select 
              value={statusUpdate || undefined} 
              onValueChange={setStatusUpdate}
              disabled={loading}
            >
              <SelectTrigger id="statusUpdate">
                <SelectValue placeholder="Không thay đổi" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem 
                    key={status.value} 
                    value={status.value}
                    disabled={status.value === currentStatus}
                  >
                    {status.label}
                    {status.value === currentStatus && ' (Hiện tại)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Update */}
          <div className="space-y-2">
            <Label htmlFor="priorityUpdate">Cập nhật độ ưu tiên (Tùy chọn)</Label>
            <Select 
              value={priorityUpdate || undefined} 
              onValueChange={setPriorityUpdate}
              disabled={loading}
            >
              <SelectTrigger id="priorityUpdate">
                <SelectValue placeholder="Không thay đổi" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((priority) => (
                  <SelectItem 
                    key={priority.value} 
                    value={priority.value}
                    disabled={priority.value === currentPriority}
                  >
                    {priority.label}
                    {priority.value === currentPriority && ' (Hiện tại)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={loading || isSubmitting || !response.trim() || isOverLimit}
              className="flex-1"
            >
              {(loading || isSubmitting) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Gửi phản hồi
                </>
              )}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
            >
              <X className="mr-2 h-4 w-4" />
              Hủy
            </Button>
          </div>
        </form>
  );
};
