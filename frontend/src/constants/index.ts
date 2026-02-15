// ============================================================
// Centralized Constants
// Single source of truth for status/priority configs & labels
// ============================================================

// --- Config Types ---

export interface StatusConfig {
  color: string;       // Ant Design tag color name
  label: string;
  dotColor: string;    // Hex color for dots/badges
  badgeColor: string;  // Hex color for badge backgrounds
  tagColor: string;    // Ant Design tag preset color
}

export interface PriorityConfig {
  color: string;  // Text/icon color
  bg: string;     // Background color
  label: string;
}

// --- Task Status Config ---

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  TODO:        { color: 'default',    label: 'To Do',        dotColor: '#6B7280', badgeColor: '#6B7280', tagColor: 'default' },
  IN_PROGRESS: { color: 'processing', label: 'In Progress',  dotColor: '#3B82F6', badgeColor: '#3B82F6', tagColor: 'processing' },
  DONE:        { color: 'success',    label: 'Done',         dotColor: '#10B981', badgeColor: '#10B981', tagColor: 'success' },
  HOLD:        { color: 'orange',     label: 'Hold',         dotColor: '#F59E0B', badgeColor: '#F59E0B', tagColor: 'warning' },
  CANCELLED:   { color: 'error',      label: 'Cancelled',    dotColor: '#6B7280', badgeColor: '#6B7280', tagColor: 'error' },
};

export const STATUS_COLUMN_ORDER = ['TODO', 'IN_PROGRESS', 'DONE', 'HOLD', 'CANCELLED'] as const;

// --- Priority Config ---

export const PRIORITY_CONFIG: Record<string, PriorityConfig> = {
  URGENT: { color: '#DC2626', bg: '#FEF2F2', label: 'Urgent' },
  HIGH:   { color: '#EA580C', bg: '#FFF7ED', label: 'High' },
  MEDIUM: { color: '#D97706', bg: '#FFFBEB', label: 'Medium' },
  LOW:    { color: '#16A34A', bg: '#F0FDF4', label: 'Low' },
};

// --- Gantt Chart Colors ---

export const GANTT_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  TODO:        { bg: '#F1F5F9', text: '#6B7280' },
  IN_PROGRESS: { bg: '#EFF6FF', text: '#3B82F6' },
  IN_REVIEW:   { bg: '#F5F3FF', text: '#8B5CF6' },
  DONE:        { bg: '#ECFDF5', text: '#10B981' },
};

export const GANTT_PRIORITY_COLORS: Record<string, string> = {
  URGENT: '#EF4444',
  HIGH:   '#F59E0B',
  MEDIUM: '#EAB308',
  LOW:    '#10B981',
};

// --- Label Configs (for Export) ---

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  ACTIVE:    'Active',
  DELAY:     'Delay',
  COMPLETED: 'Completed',
  HOLD:      'Hold',
  CANCELLED: 'Cancelled',
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  TODO:        'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW:   'In Review',
  DONE:        'Done',
  BLOCKED:     'Blocked',
  HOLD:        'Hold',
  CANCELLED:   'Cancelled',
};

export const PRIORITY_LABELS: Record<string, string> = {
  LOW:    'Low',
  MEDIUM: 'Medium',
  HIGH:   'High',
  URGENT: 'Urgent',
};

// --- Project Status Gradient Config ---

export interface ProjectStatusGradient {
  gradient: string;        // Full gradient for header
  lightBg: string;         // Light background for cards
  lightBorder: string;     // Border color for light cards
  textColor: string;       // Text color on light bg
  accentColor: string;     // Primary accent color
}

export const PROJECT_STATUS_GRADIENT: Record<string, ProjectStatusGradient> = {
  ACTIVE: {
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    lightBg: '#ECFDF5',
    lightBorder: '#A7F3D0',
    textColor: '#065F46',
    accentColor: '#10B981',
  },
  DELAY: {
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    lightBg: '#FEF2F2',
    lightBorder: '#FECACA',
    textColor: '#991B1B',
    accentColor: '#EF4444',
  },
  COMPLETED: {
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    lightBg: '#EFF6FF',
    lightBorder: '#BFDBFE',
    textColor: '#1E40AF',
    accentColor: '#3B82F6',
  },
  HOLD: {
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    lightBg: '#FFFBEB',
    lightBorder: '#FDE68A',
    textColor: '#92400E',
    accentColor: '#F59E0B',
  },
  CANCELLED: {
    gradient: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
    lightBg: '#F9FAFB',
    lightBorder: '#D1D5DB',
    textColor: '#374151',
    accentColor: '#6B7280',
  },
};

// --- Project Color Picker ---

export const PROJECT_COLORS = [
  { value: '#3B82F6', label: 'Blue',   class: 'blue' },
  { value: '#10B981', label: 'Green',  class: 'green' },
  { value: '#EF4444', label: 'Red',    class: 'red' },
  { value: '#F59E0B', label: 'Orange', class: 'orange' },
  { value: '#8B5CF6', label: 'Purple', class: 'purple' },
  { value: '#06B6D4', label: 'Cyan',   class: 'cyan' },
  { value: '#EC4899', label: 'Pink',   class: 'pink' },
  { value: '#6366F1', label: 'Indigo', class: 'indigo' },
] as const;
