import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ReasonDialog = ({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    variant = 'default',
    isLoading = false,
    placeholder = 'Nhập lý do tại đây...',
}) => {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (open) {
            setReason('');
        }
    }, [open]);

    const handleConfirm = (e) => {
        e.preventDefault();
        if (!reason.trim()) return;
        onConfirm(reason);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                    <DialogDescription className="text-slate-500">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reason" className="font-semibold">
                            Lý do <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder={placeholder}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="h-32 resize-none focus-visible:ring-blue-500"
                            autoFocus
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="hover:bg-slate-100"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading || !reason.trim()}
                        variant={variant === 'destructive' ? 'destructive' : 'default'}
                        className={variant === 'default' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                    >
                        {isLoading ? 'Đang xử lý...' : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReasonDialog;
