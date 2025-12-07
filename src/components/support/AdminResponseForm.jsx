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
  const [error, setError] = useState('');

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
        response: response.trim()
      });

      // Reset form on success
      setResponse('');
      setError('');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi gửi phản hồi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setResponse('');
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

      {/* Quick Responses */}
      <div className="space-y-2">
        <Label>Phản hồi nhanh</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Chào hỏi', text: 'Chào bạn,\n' },
            { label: 'Đã nhận', text: 'Chúng tôi đã nhận được yêu cầu của bạn và đang tiến hành kiểm tra.\n' },
            { label: 'Cần thêm thông tin', text: 'Vui lòng cung cấp thêm thông tin chi tiết hoặc hình ảnh lỗi để chúng tôi có thể hỗ trợ tốt hơn.\n' },
            { label: 'Đã giải quyết', text: 'Vấn đề của bạn đã được giải quyết. Hãy kiểm tra lại nhé.\n' },
            { label: 'Đóng yêu cầu', text: 'Vấn đề đã được giải quyết nên chúng tôi xin phép đóng yêu cầu tại đây. Cảm ơn bạn đã sử dụng dịch vụ!\n' }
          ].map((item, index) => (
            <Button
              key={index}
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-7 bg-muted/50 hover:bg-muted"
              onClick={() => setResponse(prev => prev + (prev ? '\n' : '') + item.text)}
            >
              + {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Response Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="response">
            Nội dung phản hồi <span className="text-red-500">*</span>
          </Label>
          <span
            className={`text-xs ${isOverLimit
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
