import React, { useCallback } from 'react';
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
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logoutUser } from '@/features/auth/authSlice';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'companies', label: 'Companies', icon: Building2, path: '/companies', badge: 3 },
  { id: 'users', label: 'Users', icon: Users, path: '/users' },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/jobs', badge: 1 },
  { id: 'transactions', label: 'Transactions', icon: CreditCard, path: '/transactions' },
];

export function Sidebar({ className }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const handleNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const isActive = (path) => location.pathname === path;

  return (
    <div className={cn("w-64 bg-white border-r min-h-screen flex flex-col", className)}>
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">CareerZone</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
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
              {item.badge && (
                <Badge variant="destructive" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
          <Bell className="w-4 h-4 mr-3" />
          Notifications
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
