'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Filter } from 'lucide-react';
import { managerService } from '@/services/managerService';
import { useToast } from '@/hooks/use-toast';

interface DateRange {
  start: Date;
  end: Date;
}

interface ReportsSectionProps {
  dateRange: DateRange;
}

// Mock report data - replace with actual API call
const mockReports = [
  {
    id: '1',
    pentesterName: 'John Doe',
    projectName: 'E-commerce API Security Test',
    vulnerabilities: 5,
    status: 'completed',
    submittedDate: new Date('2024-01-15'),
    month: 'January 2024'
  },
  {
    id: '2',
    pentesterName: 'Jane Smith',
    projectName: 'Mobile Banking App Test',
    vulnerabilities: 3,
    status: 'completed',
    submittedDate: new Date('2024-01-20'),
    month: 'January 2024'
  },
  {
    id: '3',
    pentesterName: 'Mike Wilson',
    projectName: 'Web Portal Security Assessment',
    vulnerabilities: 7,
    status: 'completed',
    submittedDate: new Date('2024-01-25'),
    month: 'January 2024'
  }
];

export function ReportsSection({ dateRange }: ReportsSectionProps) {
  const [reports] = useState(mockReports);
  const [pentesterFilter, setPentesterFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [exporting, setExporting] = useState(false);
  
  const { toast } = useToast();

  const filteredReports = reports.filter(report => {
    const matchesPentester = pentesterFilter === 'all' || report.pentesterName.includes(pentesterFilter);
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesPentester && matchesStatus;
  });

  const handleExport = async (format: 'csv' | 'pdf') => {
    setExporting(true);
    
    try {
      const filters = {
        dateRange,
        pentesterFilter,
        statusFilter,
        selectedMonth
      };
      
      const blob = await managerService.exportReports(format, filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `pentest-reports-${new Date().toISOString().split('T')[0]}.${format}`;
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: `Reports exported as ${format.toUpperCase()} file.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : 'Failed to export reports',
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Export Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Report Filters & Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Month</Label>
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Pentester</Label>
              <Select value={pentesterFilter} onValueChange={setPentesterFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Pentesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pentesters</SelectItem>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Export</Label>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('csv')}
                  disabled={exporting}
                >
                  <Download className="h-4 w-4 mr-1" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('pdf')}
                  disabled={exporting}
                >
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Monthly Reports ({filteredReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pentester</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Vulnerabilities</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No reports found for the selected filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.pentesterName}</TableCell>
                      <TableCell>{report.projectName}</TableCell>
                      <TableCell>
                        <Badge variant={report.vulnerabilities > 5 ? 'destructive' : report.vulnerabilities > 2 ? 'secondary' : 'default'}>
                          {report.vulnerabilities} vulnerabilities
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.month}</TableCell>
                      <TableCell>
                        {report.submittedDate.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredReports.length}
              </div>
              <div className="text-sm text-gray-600">Total Reports</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredReports.reduce((sum, report) => sum + report.vulnerabilities, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Vulnerabilities</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((filteredReports.reduce((sum, report) => sum + report.vulnerabilities, 0) / filteredReports.length) * 10) / 10 || 0}
              </div>
              <div className="text-sm text-gray-600">Avg. per Report</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}