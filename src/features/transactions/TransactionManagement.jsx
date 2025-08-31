import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  CreditCard,
  Calendar,
  User,
  Building2
} from 'lucide-react';
import { 
  TRANSACTION_TYPES, 
  TRANSACTION_STATUSES, 
  PAYMENT_METHODS 
} from '@/data/transactions';

export function TransactionManagement({ className }) {
  const dispatch = useDispatch();
  const { transactions, searchTerm, statusFilter, typeFilter } = useSelector(state => state.transactions);
  
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionDetail, setShowTransactionDetail] = useState(false);

  // Calculate summary statistics
  const transactionStats = useMemo(() => {
    const completed = transactions.filter(t => t.status === 'completed');
    const totalRevenue = completed.reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0);
    const totalRefunds = Math.abs(completed.reduce((sum, t) => sum + (t.amount < 0 ? t.amount : 0), 0));
    const pendingAmount = transactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalRevenue,
      totalRefunds,
      pendingAmount,
      totalTransactions: transactions.length,
    };
  }, [transactions]);

  // Filter transactions based on search and filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [transactions, searchTerm, statusFilter, typeFilter]);

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetail(true);
  };

  const handleExportTransactions = () => {
    toast.success('Transaction report exported successfully');
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transaction Management</h1>
        <Button onClick={handleExportTransactions} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(transactionStats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">From completed transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(transactionStats.pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(transactionStats.totalRefunds)}
            </div>
            <p className="text-xs text-muted-foreground">Refunded to customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactionStats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => dispatch(setStatusFilter(value))}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(value) => dispatch(setTypeFilter(value))}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="job_posting">Job Posting</SelectItem>
                <SelectItem value="featured_listing">Featured Listing</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No transactions found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.transactionId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{transaction.companyName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={TRANSACTION_TYPES[transaction.type].color}>
                        {TRANSACTION_TYPES[transaction.type].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={TRANSACTION_STATUSES[transaction.status].color}>
                        {TRANSACTION_STATUSES[transaction.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTransaction(transaction)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transaction Detail Dialog */}
      <Dialog open={showTransactionDetail} onOpenChange={setShowTransactionDetail}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Transaction ID</Label>
                  <p className="font-mono text-sm">{selectedTransaction.transactionId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className={`mt-1 ${TRANSACTION_STATUSES[selectedTransaction.status].color}`}>
                    {TRANSACTION_STATUSES[selectedTransaction.status].label}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                <p>{selectedTransaction.companyName}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p>{selectedTransaction.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                  <p className={`font-semibold ${selectedTransaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Payment Method</Label>
                  <div className="flex items-center space-x-2">
                    {React.createElement(PAYMENT_METHODS[selectedTransaction.paymentMethod].icon, {
                      className: "h-4 w-4 text-muted-foreground"
                    })}
                    <span>{PAYMENT_METHODS[selectedTransaction.paymentMethod].label}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p className="text-sm">{formatDate(selectedTransaction.createdAt)}</p>
                </div>
                {selectedTransaction.completedAt && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Completed</Label>
                    <p className="text-sm">{formatDate(selectedTransaction.completedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
