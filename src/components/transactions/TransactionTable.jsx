import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Eye,
  CreditCard,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/utils/formatDate';
import { Pagination } from '@/components/common/Pagination';

// Transaction Status Badge
const getStatusBadge = (status) => {
  const statusConfig = {
    'SUCCESS': { variant: 'default', label: 'Thành công', className: 'bg-green-500 hover:bg-green-600' },
    'PENDING': { variant: 'secondary', label: 'Đang xử lý', className: 'bg-yellow-500 hover:bg-yellow-600' },
    'FAILED': { variant: 'destructive', label: 'Thất bại', className: 'bg-red-500 hover:bg-red-600' },
    'CANCELLED': { variant: 'outline', label: 'Đã hủy', className: 'bg-gray-500 hover:bg-gray-600' }
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

// Payment Method Badge
const getPaymentMethodBadge = (method) => {
  const methodConfig = {
    'VNPAY': { color: 'bg-blue-500', label: 'VNPAY' },
    'ZALOPAY': { color: 'bg-purple-500', label: 'ZaloPay' },
    'MOMO': { color: 'bg-pink-500', label: 'MoMo' }
  };

  const config = methodConfig[method] || { color: 'bg-gray-500', label: method };
  
  return (
    <Badge variant="outline" className={`${config.color} text-white border-0`}>
      {config.label}
    </Badge>
  );
};

// Transaction Detail Modal
const TransactionDetailModal = ({ transaction }) => {
  if (!transaction) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Chi tiết Giao dịch</DialogTitle>
      </DialogHeader>
      <div className="space-y-8 py-4">
        {/* Transaction Info */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Mã giao dịch</Label>
            <p className="font-mono text-sm">{transaction.transactionCode}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Trạng thái</Label>
            <div>{getStatusBadge(transaction.status)}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Số tiền thanh toán</Label>
            <p className="text-lg font-semibold">{formatCurrency(transaction.amountPaid)}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Số xu nhận được</Label>
            <p className="text-lg font-semibold text-primary">
              {transaction.coinAmount.toLocaleString()} xu
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Phương thức thanh toán</Label>
            <div>{getPaymentMethodBadge(transaction.paymentMethod)}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Thời gian tạo</Label>
            <p>{formatDate(transaction.createdAt)}</p>
          </div>
        </div>

        {/* User Info */}
        {transaction.user && (
          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Thông tin Người dùng</h4>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <p>{transaction.user.email}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Họ tên</Label>
                <p>{transaction.user.fullname || 'Không có thông tin'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

// Loading Skeleton
const TableLoadingSkeleton = () => (
  <TableBody>
    {[...Array(10)].map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
      </TableRow>
    ))}
  </TableBody>
);


// Main TransactionTable Component
export const TransactionTable = ({ 
  transactions = [], 
  loading = false, 
  pagination = {}, 
  onPageChange,
  error = null 
}) => {
  const { currentPage = 1, totalPages = 1, totalItems = 0, limit = 10 } = pagination;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            <div className="text-center">
              <p className="mb-2">Không thể tải danh sách giao dịch</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Danh sách Giao dịch</CardTitle>
          <div className="text-sm text-muted-foreground">
            {totalItems > 0 && `${totalItems.toLocaleString()} giao dịch`}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã giao dịch</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Số xu</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Phương thức</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="w-[50px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              {loading ? (
                <TableLoadingSkeleton />
              ) : transactions.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={8} className="h-[400px] text-center">
                      <div className="space-y-2">
                        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">Không có giao dịch nào</p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell className="font-mono text-sm">
                        {transaction.transactionCode}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{transaction.user?.fullname || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{transaction.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(transaction.amountPaid)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-primary">
                            {transaction.coinAmount.toLocaleString()}
                          </span>
                          <span className="text-xs text-muted-foreground">xu</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell>
                        {getPaymentMethodBadge(transaction.paymentMethod)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <TransactionDetailModal transaction={transaction} />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Trang {currentPage} trên {totalPages}
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                loading={loading}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
