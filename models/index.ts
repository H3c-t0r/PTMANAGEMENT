// Core domain models and interfaces

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'pentester' | 'ces' | 'manager';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Pentest {
  id: string;
  projectName: string;
  type: 'API' | 'Mobile' | 'Infrastructure' | 'Web' | 'Thick Client';
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold' | 'stopped';
  assignedTo: string; // User ID
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  vulnerabilities?: number;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthlyReport {
  id: string;
  userId: string;
  pentestId: string;
  month: number;
  year: number;
  vulnerabilities: number;
  remarks: string;
  submittedAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'pentest' | 'leave' | 'non_pentest';
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold' | 'stopped';
  pentestId?: string;
  userId: string;
  className?: string;
}

export interface DashboardStats {
  workingDays: number;
  pentestDays: number;
  leaveDays: number;
  nonPentestDays: number;
  totalPentests: number;
  completedPentests: number;
  inProgressPentests: number;
  plannedPentests: number;
  onHoldPentests: number;
  stoppedPentests: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'pentester' | 'ces' | 'manager';
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreatePentestRequest {
  projectName: string;
  type: 'API' | 'Mobile' | 'Infrastructure' | 'Web' | 'Thick Client';
  assignedTo: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress';
}

export interface SubmitReportRequest {
  pentestId: string;
  vulnerabilities: number;
  remarks: string;
  startDate: string;
  endDate: string;
}

export type UserRole = 'pentester' | 'ces' | 'manager';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}