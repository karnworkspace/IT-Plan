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
  TODO:        { color: 'default',    label: 'To Do',        dotColor: '#77787B', badgeColor: '#77787B', tagColor: 'default' },
  IN_PROGRESS: { color: 'processing', label: 'In Progress',  dotColor: '#32BCAD', badgeColor: '#32BCAD', tagColor: 'processing' },
  DONE:        { color: 'success',    label: 'Done',         dotColor: '#2E7D9B', badgeColor: '#2E7D9B', tagColor: 'cyan' },
  HOLD:        { color: 'warning',    label: 'Hold',         dotColor: '#E8A838', badgeColor: '#E8A838', tagColor: 'warning' },
  CANCELLED:   { color: 'error',      label: 'Cancelled',    dotColor: '#77787B', badgeColor: '#77787B', tagColor: 'default' },
};

export const STATUS_COLUMN_ORDER = ['TODO', 'IN_PROGRESS', 'DONE', 'HOLD', 'CANCELLED'] as const;

// --- Priority Config ---

export const PRIORITY_CONFIG: Record<string, PriorityConfig> = {
  URGENT: { color: '#D94F4F', bg: 'rgba(217,79,79,0.10)', label: 'Urgent' },
  HIGH:   { color: '#E8A838', bg: '#FFF3DC', label: 'High' },
  MEDIUM: { color: '#E8A838', bg: '#FFF3DC', label: 'Medium' },
  LOW:    { color: '#32BCAD', bg: 'rgba(50,188,173,0.05)', label: 'Low' },
};

// --- Gantt Chart Colors ---

export const GANTT_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  TODO:        { bg: '#F1F5F9', text: '#77787B' },
  IN_PROGRESS: { bg: 'rgba(50,188,173,0.05)', text: '#32BCAD' },
  IN_REVIEW:   { bg: '#F5F3FF', text: '#8B5CF6' },
  DONE:        { bg: 'rgba(46,125,155,0.08)', text: '#2E7D9B' },
};

export const GANTT_PRIORITY_COLORS: Record<string, string> = {
  URGENT: '#D94F4F',
  HIGH:   '#E8A838',
  MEDIUM: '#E8A838',
  LOW:    '#32BCAD',
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
    gradient: 'linear-gradient(135deg, #32BCAD 0%, #1a7a6e 100%)',
    lightBg: 'rgba(50,188,173,0.05)',
    lightBorder: '#89D0C8',
    textColor: '#1a7a6e',
    accentColor: '#32BCAD',
  },
  DELAY: {
    gradient: 'linear-gradient(135deg, #D94F4F 0%, #9B2C2C 100%)',
    lightBg: 'rgba(217,79,79,0.10)',
    lightBorder: '#F5A3A3',
    textColor: '#9B2C2C',
    accentColor: '#D94F4F',
  },
  COMPLETED: {
    gradient: 'linear-gradient(135deg, #2E7D9B 0%, #1a5a6e 100%)',
    lightBg: 'rgba(46,125,155,0.08)',
    lightBorder: '#89C4D8',
    textColor: '#1a5a6e',
    accentColor: '#2E7D9B',
  },
  HOLD: {
    gradient: 'linear-gradient(135deg, #E8A838 0%, #8B6914 100%)',
    lightBg: '#FFF3DC',
    lightBorder: '#F5D88A',
    textColor: '#8B6914',
    accentColor: '#E8A838',
  },
  CANCELLED: {
    gradient: 'linear-gradient(135deg, #77787B 0%, #4B4C4E 100%)',
    lightBg: '#F5F5F5',
    lightBorder: '#D1D1D2',
    textColor: '#4B4C4E',
    accentColor: '#77787B',
  },
};

// --- Project Type Config ---

export const PROJECT_TYPE_CONFIG: Record<string, { label: string; color: string; description: string }> = {
  PROJECT:  { label: 'Project',  color: '#32BCAD', description: 'Report ผู้บริหาร / คำนวณ KPI' },
  INTERNAL: { label: 'Internal', color: '#77787B', description: 'งานภายใน / ไม่นับ KPI' },
};

// --- Project Color Picker ---

export const PROJECT_COLORS = [
  { value: '#32BCAD', label: 'Green',  class: 'green' },
  { value: '#2E7D9B', label: 'Teal',   class: 'teal' },
  { value: '#D94F4F', label: 'Red',    class: 'red' },
  { value: '#E8A838', label: 'Amber',  class: 'amber' },
  { value: '#8B5CF6', label: 'Purple', class: 'purple' },
  { value: '#06B6D4', label: 'Cyan',   class: 'cyan' },
  { value: '#EC4899', label: 'Pink',   class: 'pink' },
  { value: '#6366F1', label: 'Indigo', class: 'indigo' },
] as const;
