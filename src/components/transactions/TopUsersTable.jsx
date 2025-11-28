import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/formatDate';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
};

const formatNumber = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number);
};

export const TopUsersTable = ({ users, loading, period }) => {
  const getPeriodText = (period) => {
    switch (period) {
      case '7d': return '7 ngày qua';
      case '30d': return '30 ngày qua';
      case '90d': return '3 tháng qua';
      case '1y': return '1 năm qua';
      default: return 'khoảng thời gian đã chọn';
    }
  };
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-64" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-96" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">Hạng</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead className="text-right">Tổng chi tiêu</TableHead>
                  <TableHead className="text-center">Số GD</TableHead>
                  <TableHead className="text-right">Chi tiêu TB</TableHead>
                  <TableHead>Giao dịch cuối</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-4 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-8 mx-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Người dùng Chi tiêu</CardTitle>
          <CardDescription>
            Danh sách người dùng có tổng chi tiêu cao nhất trong {getPeriodText(period)}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Không có dữ liệu người dùng trong {getPeriodText(period)}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top {users.length} Người dùng Chi tiêu Nhiều nhất</CardTitle>
        <CardDescription>
          Danh sách người dùng có tổng chi tiêu cao nhất trong {getPeriodText(period)}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] text-center">Hạng</TableHead>
                <TableHead className="min-w-[250px]">Người dùng</TableHead>
                <TableHead className="text-right min-w-[120px]">Tổng chi tiêu</TableHead>
                <TableHead className="text-center w-[80px]">Số GD</TableHead>
                <TableHead className="text-right min-w-[120px]">Chi tiêu TB</TableHead>
                <TableHead className="min-w-[120px]">Giao dịch cuối</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.userId} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-center">
                    <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                      index === 1 ? 'bg-gray-100 text-gray-800 border border-gray-300' :
                      index === 2 ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{user.email}</span>
                        {!user.isActive && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                            Không hoạt động
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={user.role === 'Nhà tuyển dụng' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {user.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatNumber(user.totalCoinsRecharged)} xu
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-semibold text-primary">
                      {formatCurrency(user.totalSpent)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{formatNumber(user.transactionCount)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium">
                      {formatCurrency(user.averageTransactionValue)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(user.lastTransaction, { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
