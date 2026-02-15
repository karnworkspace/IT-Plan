import type { LucideIcon } from 'lucide-react';

export type ProjectStatus = 'active' | 'delay' | 'completed' | 'hold' | 'cancelled';

export interface Project {
  id: string;
  name: string;
  projectId: string;
  status: ProjectStatus;
  progress: number;
  assignees: string[];
  tasksCompleted: number;
  tasksTotal: number;
}

export interface Activity {
  id: string;
  action: string;
  projectName: string;
  timeAgo: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}
