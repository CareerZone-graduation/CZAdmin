import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const stats = [
  {
    title: 'Total Users',
    value: '2,543',
    change: '+12%',
    icon: Users,
    trend: 'up'
  },
  {
    title: 'Active Companies',
    value: '187',
    change: '+5%',
    icon: Building2,
    trend: 'up'
  },
  {
    title: 'Job Listings',
    value: '856',
    change: '+18%',
    icon: Briefcase,
    trend: 'up'
  },
  {
    title: 'Monthly Revenue',
    value: '$24,780',
    change: '+23%',
    icon: DollarSign,
    trend: 'up'
  }
];

const recentActivity = [
  {
    id: 1,
    type: 'company_approval',
    message: 'StartupIO submitted company verification',
    time: '2 hours ago',
    status: 'pending'
  },
  {
    id: 2,
    type: 'job_posting',
    message: 'New job posted: Senior Frontend Developer',
    time: '4 hours ago',
    status: 'completed'
  },
  {
    id: 3,
    type: 'user_registration',
    message: '15 new user registrations today',
    time: '6 hours ago',
    status: 'info'
  },
  {
    id: 4,
    type: 'payment',
    message: 'Payment received from TechCorp Solutions',
    time: '1 day ago',
    status: 'completed'
  }
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your recruitment platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and actions on your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'pending' ? 'bg-yellow-500' :
                    activity.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge variant={
                    activity.status === 'pending' ? 'secondary' :
                    activity.status === 'completed' ? 'default' : 'outline'
                  }>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <CheckCircle className="w-4 h-4 mr-2" />
              Review Pending Companies (3)
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertCircle className="w-4 h-4 mr-2" />
              Moderate Job Listings (1)
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              Process Payments (2)
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Generate User Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
