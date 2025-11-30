import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  CreditCard,
  LogOut,
  LifeBuoy,
  ChevronRight,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logoutUser } from '@/features/auth/authSlice';
import { getAllSupportRequests } from '@/services/supportRequestService';

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Tổng quan hệ thống',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    id: 'companies',
    label: 'Công ty',
    description: 'Quản lý công ty',
    icon: Building2,
    path: '/companies'
  },
  {
    id: 'users',
    label: 'Người dùng',
    description: 'Quản lý người dùng',
    icon: Users,
    path: '/users'
  },
  {
    id: 'jobs',
    label: 'Việc làm',
    description: 'Quản lý tin tuyển dụng',
    icon: Briefcase,
    path: '/jobs'
  },
  {
    id: 'transactions',
    label: 'Giao dịch',
    description: 'Quản lý thanh toán',
    icon: CreditCard,
    path: '/transactions'
  },
  {
    id: 'support',
    label: 'Hỗ trợ',
    description: 'Yêu cầu hỗ trợ',
    icon: LifeBuoy,
    path: '/support',
    badgeKey: 'pendingSupport'
  }
];

export function Sidebar({ className }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingSupportCount, setPendingSupportCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch pending support requests count - only on initial mount
  useEffect(() => {
    let isMounted = true;

    const fetchPendingCount = async () => {
      try {
        const response = await getAllSupportRequests(
          { status: 'pending' },
          {},
          { page: 1, limit: 1 }
        );
        if (isMounted && response?.meta?.totalItems !== undefined) {
          setPendingSupportCount(response.meta.totalItems);
        }
      } catch (error) {
        console.error('Failed to fetch pending support requests count:', error);
      }
    };

    // Only fetch once on mount
    fetchPendingCount();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency - only run once on mount

  const handleLogout = useCallback(async () => {
    await dispatch(logoutUser());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const getBadgeValue = (item) => {
    if (item.badgeKey === 'pendingSupport') {
      return pendingSupportCount > 0 ? pendingSupportCount : null;
    }
    return item.badge;
  };

  return (
    <div
      className={cn(
        'bg-white border-r min-h-screen flex flex-col transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-green-600">CareerZone</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          {isCollapsed ? (
            <PanelLeft className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const badgeValue = getBadgeValue(item);
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all',
                  active
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className={cn('w-5 h-5 flex-shrink-0', active ? 'text-white' : 'text-gray-500')} />

                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-left">
                      <div className={cn('font-medium text-sm', active ? 'text-white' : 'text-gray-900')}>
                        {item.label}
                      </div>
                      <div className={cn('text-xs', active ? 'text-green-100' : 'text-gray-500')}>
                        {item.description}
                      </div>
                    </div>

                    {badgeValue ? (
                      <Badge variant="destructive" className="text-xs">
                        {badgeValue}
                      </Badge>
                    ) : active ? (
                      <ChevronRight className="w-4 h-4 text-white" />
                    ) : null}
                  </>
                )}

                {isCollapsed && badgeValue && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs w-5 h-5 p-0 flex items-center justify-center">
                    {badgeValue}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer - Logout */}
      <div className="p-3 border-t">
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all',
            isCollapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">Đăng xuất</div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
