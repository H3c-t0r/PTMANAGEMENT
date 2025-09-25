'use client';

import { DashboardStats, UserRole } from '@/models';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, CircleCheck as CheckCircle, Clock, CirclePause as PauseCircle, Circle as XCircle, TrendingUp, Users } from 'lucide-react';

interface StatsPanelProps {
  stats: DashboardStats | null;
  loading: boolean;
  userRole: UserRole;
}

export function StatsPanel({ stats, loading, userRole }: StatsPanelProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-center">
              <LoadingSpinner />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const getStatsCards = () => {
    switch (userRole) {
      case 'pentester':
        return [
          {
            title: 'Working Days',
            value: stats.workingDays,
            icon: Calendar,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Pentest Days',
            value: stats.pentestDays,
            icon: Target,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Leave Days',
            value: stats.leaveDays,
            icon: PauseCircle,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
          },
          {
            title: 'Non-Pentest Days',
            value: stats.nonPentestDays,
            icon: Clock,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          }
        ];

      case 'ces':
        return [
          {
            title: 'Total Pentests',
            value: stats.totalPentests,
            icon: Target,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Completed',
            value: stats.completedPentests,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'In Progress',
            value: stats.inProgressPentests,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
          },
          {
            title: 'Planned',
            value: stats.plannedPentests,
            icon: Calendar,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          }
        ];

      case 'manager':
        return [
          {
            title: 'Total Pentests',
            value: stats.totalPentests,
            icon: Target,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Completion Rate',
            value: `${Math.round((stats.completedPentests / stats.totalPentests) * 100)}%`,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Active Pentests',
            value: stats.inProgressPentests,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
          },
          {
            title: 'Team Utilization',
            value: `${Math.round((stats.pentestDays / stats.workingDays) * 100)}%`,
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          }
        ];

      default:
        return [];
    }
  };

  const statsCards = getStatsCards();

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.bgColor} mr-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Stats for Manager */}
      {userRole === 'manager' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pentest Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-sm font-medium">{stats.completedPentests}</span>
                </div>
                <Progress 
                  value={(stats.completedPentests / stats.totalPentests) * 100} 
                  className="h-2"
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="text-sm font-medium">{stats.inProgressPentests}</span>
                </div>
                <Progress 
                  value={(stats.inProgressPentests / stats.totalPentests) * 100} 
                  className="h-2"
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Planned</span>
                  <span className="text-sm font-medium">{stats.plannedPentests}</span>
                </div>
                <Progress 
                  value={(stats.plannedPentests / stats.totalPentests) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Working Days</span>
                  <span className="font-semibold">{stats.workingDays}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pentest Days</span>
                  <span className="font-semibold">{stats.pentestDays}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Leave Days</span>
                  <span className="font-semibold">{stats.leaveDays}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Non-Pentest Days</span>
                  <span className="font-semibold">{stats.nonPentestDays}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}