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
  ExternalLink
} from 'lucide-react';
import { enhancedRecentActivity } from '@/data/analyticsData';

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

// Enhanced Recent Activity Component
export const EnhancedRecentActivity = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and actions requiring attention</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enhancedRecentActivity.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.status === 'warning' ? 'bg-orange-100 text-orange-600' :
                  activity.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                  activity.status === 'completed' ? 'bg-green-100 text-green-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={getPriorityStyle(activity.priority)}
                      >
                        {activity.priority}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={getStatusStyle(activity.status)}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {activity.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{activity.time}</span>
                      </div>
                      {activity.user && (
                        <span>by {activity.user}</span>
                      )}
                      {activity.company && (
                        <span>• {activity.company}</span>
                      )}
                      {activity.amount && (
                        <span>• ${activity.amount.toLocaleString()}</span>
                      )}
                    </div>
                    
                    {activity.action_required && (
                      <Button variant="outline" size="sm">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Top Companies Performance
export const TopCompaniesCard = () => {
  const topCompanies = [
    {
      name: 'TechCorp Solutions',
      jobs: 45,
      applications: 1234,
      revenue: 5500,
      rating: 4.8,
      trend: 'up'
    },
    {
      name: 'StartupIO',
      jobs: 32,
      applications: 987,
      revenue: 3800,
      rating: 4.6,
      trend: 'up'
    },
    {
      name: 'Digital Dynamics',
      jobs: 28,
      applications: 756,
      revenue: 3200,
      rating: 4.7,
      trend: 'stable'
    },
    {
      name: 'Innovation Labs',
      jobs: 23,
      applications: 654,
      revenue: 2750,
      rating: 4.5,
      trend: 'down'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Companies</CardTitle>
        <CardDescription>Companies generating the most revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCompanies.map((company, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{company.name}</p>
                  <p className="text-xs text-gray-500">
                    {company.jobs} jobs • {company.applications} applications
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ${company.revenue.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">★ {company.rating}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    company.trend === 'up' ? 'bg-green-500' :
                    company.trend === 'down' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};