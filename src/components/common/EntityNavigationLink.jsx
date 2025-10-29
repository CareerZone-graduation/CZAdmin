import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, User, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

const entityConfig = {
  user: {
    icon: User,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
    path: (id) => `/users/${id}`
  },
  company: {
    icon: Building2,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100',
    path: (id) => `/companies/${id}`
  },
  job: {
    icon: Briefcase,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100',
    path: (id) => `/jobs/${id}`
  }
};

export function EntityNavigationLink({
  entityType,
  entityId,
  entityName,
  icon: CustomIcon,
  variant = 'link',
  className,
  children
}) {
  const config = entityConfig[entityType];
  const Icon = CustomIcon || config.icon;
  const path = config.path(entityId);

  if (variant === 'badge') {
    return (
      <Link to={path}>
        <Badge 
          variant="outline" 
          className={cn(
            'cursor-pointer transition-colors',
            config.hoverColor,
            className
          )}
        >
          <Icon className={cn('w-3 h-3 mr-1', config.color)} />
          {entityName || children}
        </Badge>
      </Link>
    );
  }

  if (variant === 'button') {
    return (
      <Link to={path}>
        <Button 
          variant="outline" 
          size="sm"
          className={cn('transition-colors', className)}
        >
          <Icon className={cn('w-4 h-4 mr-2', config.color)} />
          {entityName || children}
        </Button>
      </Link>
    );
  }

  // Default: link variant
  return (
    <Link 
      to={path}
      className={cn(
        'inline-flex items-center space-x-2 text-sm font-medium transition-colors',
        config.color,
        'hover:underline',
        className
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{entityName || children}</span>
    </Link>
  );
}
