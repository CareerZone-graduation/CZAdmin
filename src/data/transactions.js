// Mock data for transactions
export const mockTransactions = [
  {
    id: 1,
    type: 'job_posting',
    amount: 99.00,
    currency: 'VNĐ',
    status: 'completed',
    companyName: 'Tech Solutions Inc',
    companyId: 'comp_001',
    description: 'Premium Job Posting - Senior Developer',
    createdAt: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-15T10:30:05Z',
    paymentMethod: 'VNPAY',
    transactionId: 'txn_abc123',
  },
  {
    id: 2,
    type: 'featured_listing',
    amount: 149.00,
    currency: 'VNĐ',
    status: 'completed',
    companyName: 'Innovation Corp',
    companyId: 'comp_002',
    description: 'Featured Job Listing - Product Manager',
    createdAt: '2024-01-14T14:20:00Z',
    completedAt: '2024-01-14T14:20:03Z',
    paymentMethod: 'MOMO',
    transactionId: 'txn_def456',
  },
  {
    id: 3,
    type: 'subscription',
    amount: 299.00,
    currency: 'VNĐ',
    status: 'pending',
    companyName: 'Global Enterprises',
    companyId: 'comp_003',
    description: 'Monthly Premium Subscription',
    createdAt: '2024-01-16T09:15:00Z',
    completedAt: null,
    paymentMethod: 'ZALOPAY',
    transactionId: 'txn_ghi789',
  },
  {
    id: 4,
    type: 'job_posting',
    amount: 99.00,
    currency: 'VNĐ',
    status: 'failed',
    companyName: 'StartUp Hub',
    companyId: 'comp_004',
    description: 'Standard Job Posting - Frontend Developer',
    createdAt: '2024-01-13T16:45:00Z',
    completedAt: null,
    paymentMethod: 'VNPAY',
    transactionId: 'txn_jkl012',
  },
  {
    id: 5,
    type: 'refund',
    amount: -99.00,
    currency: 'VNĐ',
    status: 'completed',
    companyName: 'Digital Agency',
    companyId: 'comp_005',
    description: 'Refund for cancelled job posting',
    createdAt: '2024-01-12T11:30:00Z',
    completedAt: '2024-01-12T11:35:00Z',
    paymentMethod: 'MOMO',
    transactionId: 'txn_mno345',
  },
];

export const TRANSACTION_TYPES = {
  job_posting: { label: 'Job Posting', color: 'bg-blue-100 text-blue-800' },
  featured_listing: { label: 'Featured Listing', color: 'bg-purple-100 text-purple-800' },
  subscription: { label: 'Subscription', color: 'bg-green-100 text-green-800' },
  refund: { label: 'Refund', color: 'bg-red-100 text-red-800' },
};

export const TRANSACTION_STATUSES = {
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
};

import { CreditCard, Building2, Wallet } from 'lucide-react';

export const PAYMENT_METHODS = {
  VNPAY: { label: 'VNPay', icon: CreditCard },
  MOMO: { label: 'MoMo', icon: Wallet },
  ZALOPAY: { label: 'ZaloPay', icon: Building2 }
};
