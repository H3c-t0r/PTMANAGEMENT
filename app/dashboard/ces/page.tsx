'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarComponent } from '@/components/calendar/CalendarComponent';
import { StatsPanel } from '@/components/dashboard/StatsPanel';
import { AssignPentestModal } from '@/components/modals/AssignPentestModal';
import { PentesterSelector } from '@/components/dashboard/PentesterSelector';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { useCalendarData } from '@/hooks/useCalendarData';
import { usePentestStats } from '@/hooks/usePentestStats';

export default function CESTeamDashboard() {
  const { user } = useAuth();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPentester, setSelectedPentester] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { users: pentesters, loading: usersLoading } = useUsers('pentester');
  const { calendarEvents, stats, loading: calendarLoading } = useCalendarData(
    selectedPentester === 'all' ? undefined : selectedPentester, 
    new Date()
  );
  const { pentestStats, loading: statsLoading } = usePentestStats(selectedPentester, statusFilter);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CES Team Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage pentest assignments and team coordination</p>
          </div>
          <Button onClick={() => setIsAssignModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Assign Pentest
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Pentester:</span>
              <Select value={selectedPentester} onValueChange={setSelectedPentester}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select pentester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pentesters</SelectItem>
                  {pentesters.map((pentester) => (
                    <SelectItem key={pentester.id} value={pentester.id}>
                      {pentester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="stopped">Stopped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <StatsPanel
          stats={pentestStats}
          loading={statsLoading}
          userRole="ces"
        />

        {/* Calendar Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Assignment Calendar</h2>
          
          <CalendarComponent
            events={calendarEvents}
            loading={calendarLoading}
            userRole="ces"
            onDateClick={(date) => {
              console.log('Date clicked:', date);
            }}
          />
        </div>

        {/* Assign Pentest Modal */}
        <AssignPentestModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          pentesters={pentesters}
        />
      </div>
    </DashboardLayout>
  );
}