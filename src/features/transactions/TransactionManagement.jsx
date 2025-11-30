import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionAnalytics } from '@/components/transactions/TransactionAnalytics';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { getTransactionsList } from '@/services/analyticsService';
import { toast } from 'sonner';
import { 
  BarChart3,
  List,
  RefreshCw
} from 'lucide-react';

export function TransactionManagement({ className }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });
  
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    paymentMethod: 'all',
    startDate: '',
    endDate: '',
    sort: 'default'
  });

  const [activeTab, setActiveTab] = useState('analytics');

  const fetchTransactions = async (newFilters = filters, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Clean up empty filters
      const cleanFilters = Object.keys(newFilters).reduce((acc, key) => {
        if (newFilters[key] && newFilters[key] !== '' && newFilters[key] !== 'all' && newFilters[key] !== 'default') {
          acc[key] = newFilters[key];
        }
        return acc;
      }, {});

      const params = {
        ...cleanFilters,
        page,
        limit: pagination.limit
      };

      const response = await getTransactionsList(params);
      
      if (response.data.success) {
        setTransactions(response.data.data);
        setPagination({
          currentPage: response.data.meta.currentPage,
          totalPages: response.data.meta.totalPages,
          totalItems: response.data.meta.totalItems,
          limit: response.data.meta.limit
        });
      } else {
        throw new Error(response.datamessage || 'Không thể tải danh sách giao dịch');
      }
    } catch (err) {
      setError(err.message);
      toast.error('Lỗi khi tải danh sách giao dịch');
      console.error('Transaction fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [activeTab]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (searchFilters) => {
    fetchTransactions(searchFilters, 1);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      status: 'all',
      paymentMethod: 'all',
      startDate: '',
      endDate: '',
      sort: 'default'
    };
    setFilters(clearedFilters);
    fetchTransactions(clearedFilters, 1);
  };

  const handlePageChange = (page) => {
    fetchTransactions(filters, page);
  };

  const handleRefresh = () => {
    fetchTransactions(filters, pagination.currentPage);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Giao dịch</h1>
          <p className="text-muted-foreground">
            Theo dõi và phân tích các giao dịch nạp xu của người dùng
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
         
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Phân tích & Thống kê
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Danh sách Giao dịch
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <TransactionAnalytics />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <TransactionFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            onClearFilters={handleClearFilters}
            loading={loading}
            totalResults={pagination.totalItems}
          />

          {/* Transaction Table */}
          <TransactionTable
            transactions={transactions}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            error={error}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
