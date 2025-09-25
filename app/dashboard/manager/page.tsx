'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarComponent } from '@/components/calendar/CalendarComponent';
import { StatsPanel } from '@/components/dashboard/StatsPanel';
import { UserManagementTable } from '@/components/tables/UserManagementTable';
import { ReportsSection } from '@/components/dashboard/ReportsSection';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartBar as BarChart3, Users, FileText, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCalendarData } from '@/hooks/useCalendarData';
import { useManagerStats } from '@/hooks/useManagerStats';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  });

  const { calendarEvents, loading: calendarLoading } = useCalendarData(undefined, new Date());
  const { managerStats, loading: statsLoading } = useManagerStats(dateRange);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive oversight of all penetration testing operations</p>
          </div>
          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => setDateRange({...dateRange, start: new Date(e.target.value)})}
              className="border rounded-md px-3 py-2 text-sm"
            />
            <span className="flex items-center text-sm text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => setDateRange({...dateRange, end: new Date(e.target.value)})}
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Global Stats */}
        <StatsPanel
          stats={managerStats}
          loading={statsLoading}
          userRole="manager"
        />

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Global Calendar
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                {/* Activity feed would go here */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Web App pentest completed by John Doe</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">New API pentest assigned to Jane Smith</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Mobile app pentest in progress</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
                {/* Performance metrics would go here */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pentests Completed</span>
                    <span className="font-semibold">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Completion Time</span>
                    <span className="font-semibold">8.5 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Team Utilization</span>
                    <span className="font-semibold">87%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Global Pentest Calendar</h2>
              <CalendarComponent
                events={calendarEvents}
                loading={calendarLoading}
                userRole="manager"
                showAllPentesters={true}
                onDateClick={(date) => {
                  console.log('Manager calendar date clicked:', date);
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <UserManagementTable />
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <ReportsSection dateRange={dateRange} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}