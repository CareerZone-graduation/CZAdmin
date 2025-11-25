import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Briefcase, 
  CreditCard, 
  LogOut,
  Settings,
  Bell,
  LifeBuoy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logoutUser } from '@/features/auth/authSlice';
import { t } from '@/constants/translations';
import { getAllSupportRequests } from '@/services/supportRequestService';

const menuItems = [
  { id: 'dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard, path: '/dashboard' },
  { id: 'companies', label: t('sidebar.companies'), icon: Building2, path: '/companies', badge: 3 },
  { id: 'users', label: t('sidebar.users'), icon: Users, path: '/users' },
  { id: 'jobs', label: t('sidebar.jobs'), icon: Briefcase, path: '/jobs', badge: 1 },
  { id: 'transactions', label: t('sidebar.transactions'), icon: CreditCard, path: '/transactions' },
  { id: 'support', label: t('sidebar.support'), icon: LifeBuoy, path: '/support', badgeKey: 'pendingSupport' },
];

export function Sidebar({ className }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [pendingSupportCount, setPendingSupportCount] = useState(0);

  // Fetch pending support requests count
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await getAllSupportRequests({ status: 'pending' }, {}, { page: 1, limit: 1 });
        if (response?.data?.pagination?.total) {
          setPendingSupportCount(response.data.pagination.total);
        }
      } catch (error) {
        console.error('Failed to fetch pending support requests count:', error);
      }
    };

    fetchPendingCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = useCallback(async () => {
    await dispatch(logoutUser());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const isActive = (path) => location.pathname === path;
  
  const getBadgeValue = (item) => {
    if (item.badgeKey === 'pendingSupport') {
      return pendingSupportCount > 0 ? pendingSupportCount : null;
    }
    return item.badge;
  };

  return (
    <div className={cn("w-64 bg-white border-r min-h-screen flex flex-col", className)}>
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{t('sidebar.title')}</h2>
            <p className="text-xs text-gray-500">{t('sidebar.subtitle')}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const badgeValue = getBadgeValue(item);
            return (
              <Button
                key={item.id}
                variant={isActive(item.path) ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isActive(item.path) 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
                {badgeValue && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    {badgeValue}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
          <Bell className="w-4 h-4 mr-3" />
          {t('sidebar.notifications')}
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
          <Settings className="w-4 h-4 mr-3" />
          {t('sidebar.settings')}
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          {t('sidebar.logout')}
        </Button>
      </div>
    </div>
  );
}
