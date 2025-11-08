import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Briefcase, 
  Users, 
  DollarSign, 
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  MoreHorizontal,
  ExternalLink,
  Activity
} from 'lucide-react';


// Activity icon mapping
const getActivityIcon = (type) => {
  const icons = {
    company_approval: Building2,
    job_posting: Briefcase,
    user_registration: Users,
    payment: DollarSign,
    security: Shield
  };
  return icons[type] || Info;
};

// Priority badge styling
const getPriorityStyle = (priority) => {
  const styles = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800'
  };
  return styles[priority] || styles.low;
};

// Status badge styling
const getStatusStyle = (status) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    info: 'bg-blue-100 text-blue-800'
  };
  return styles[status] || styles.info;
};