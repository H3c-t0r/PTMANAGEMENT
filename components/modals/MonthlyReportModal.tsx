'use client';

import { useState } from 'react';
import { Pentest } from '@/models';
import { pentestService } from '@/services/pentestService';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validatePositiveNumber, validateTextLength } from '@/utils/validation';
import { useToast } from '@/hooks/use-toast';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  pentests: Pentest[];
  userId?: string;
}

export function MonthlyReportModal({ isOpen, onClose, pentests, userId }: MonthlyReportModalProps) {
  const [selectedPentest, setSelectedPentest] = useState<string>('');
  const [vulnerabilities, setVulnerabilities] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();

  const selectedPentestData = pentests.find(p => p.id === selectedPentest);

  // Auto-fill dates when pentest is selected
  const handlePentestChange = (pentestId: string) => {
    setSelectedPentest(pentestId);
    const pentest = pentests.find(p => p.id === pentestId);
    if (pentest) {
      setStartDate(pentest.startDate.toISOString().split('T')[0]);
      setEndDate(pentest.endDate.toISOString().split('T')[0]);
    }
    // Clear errors when pentest changes
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedPentest) {
      newErrors.pentest = 'Please select a pentest';
    }

    const vulnCount = parseInt(vulnerabilities);
    if (!vulnerabilities || !validatePositiveNumber(vulnCount)) {
      newErrors.vulnerabilities = 'Please enter a valid number of vulnerabilities (0 or greater)';
    }

    if (!remarks || !validateTextLength(remarks, 1000)) {
      newErrors.remarks = 'Please enter remarks (maximum 1000 characters)';
    }

    if (!startDate) {
      newErrors.startDate = 'Please select a start date';
    }

    if (!endDate) {
      newErrors.endDate = 'Please select an end date';
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await pentestService.submitReport({
        pentestId: selectedPentest,
        vulnerabilities: parseInt(vulnerabilities),
        remarks,
        startDate,
        endDate
      });

      toast({
        title: "Report Submitted",
        description: "Your monthly report has been submitted successfully.",
      });

      // Reset form
      setSelectedPentest('');
      setVulnerabilities('');
      setRemarks('');
      setStartDate('');
      setEndDate('');
      setErrors({});
      
      onClose();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : 'Failed to submit report',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const availablePentests = pentests.filter(p => 
    p.status === 'completed' || p.status === 'in_progress'
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Monthly Report</DialogTitle>
          <DialogDescription>
            Provide details about your pentest findings and progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(errors).length > 0 && (
            <Alert className="border-destructive">
              <AlertDescription className="text-destructive">
                Please fix the errors below before submitting.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="pentest">Associated Pentest</Label>
            <Select value={selectedPentest} onValueChange={handlePentestChange}>
              <SelectTrigger className={errors.pentest ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a pentest" />
              </SelectTrigger>
              <SelectContent>
                {availablePentests.map((pentest) => (
                  <SelectItem key={pentest.id} value={pentest.id}>
                    {pentest.projectName} ({pentest.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pentest && (
              <p className="text-sm text-red-500">{errors.pentest}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vulnerabilities">Number of Vulnerabilities</Label>
            <Input
              id="vulnerabilities"
              type="number"
              min="0"
              placeholder="Enter number of vulnerabilities found"
              value={vulnerabilities}
              onChange={(e) => setVulnerabilities(e.target.value)}
              className={errors.vulnerabilities ? 'border-red-500' : ''}
            />
            {errors.vulnerabilities && (
              <p className="text-sm text-red-500">{errors.vulnerabilities}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Enter your remarks and findings..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className={errors.remarks ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.remarks && (
              <p className="text-sm text-red-500">{errors.remarks}</p>
            )}
            <p className="text-xs text-gray-500">
              {remarks.length}/1000 characters
            </p>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}