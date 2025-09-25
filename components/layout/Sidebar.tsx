'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { UserRole } from '@/models';
import { ChartBar as BarChart3, Calendar, FileText, Shield, Users, ChevronLeft, ChevronRight, Target, Settings } from 'lucide-react';

interface SidebarProps {
  userRole: UserRole;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard/pentester',
    icon: BarChart3,
    roles: ['pentester']
  },
  {
    label: 'Dashboard',
    href: '/dashboard/ces',
    icon: BarChart3,
    roles: ['ces']
  },
  {
    label: 'Dashboard',
    href: '/dashboard/manager',
    icon: BarChart3,
    roles: ['manager']
  },
  {
    label: 'Calendar',
    href: '/calendar',
    icon: Calendar,
    roles: ['pentester', 'ces', 'manager']
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: FileText,
    roles: ['pentester', 'ces', 'manager']
  },
  {
    label: 'User Management',
    href: '/users',
    icon: Users,
    roles: ['manager']
  },
  {
    label: 'Pentests',
    href: '/pentests',
    icon: Target,
    roles: ['ces', 'manager']
  }
];

export function Sidebar({ userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className={cn(
      'bg-white border-r border-gray-200 flex flex-col transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">PentestPro</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className={cn('h-5 w-5', collapsed && 'mx-auto')} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Role Badge */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="px-3 py-2 bg-gray-100 rounded-lg">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Role</div>
            <div className="text-sm font-medium text-gray-900 capitalize">{userRole}</div>
          </div>
        </div>
      )}
    </div>
  );
}