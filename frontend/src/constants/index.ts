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
  TODO:        { color: 'default',    label: 'To Do',        dotColor: '#8c8c8c', badgeColor: '#8c8c8c', tagColor: 'default' },
  IN_PROGRESS: { color: 'processing', label: 'In Progress',  dotColor: '#1890ff', badgeColor: '#1890ff', tagColor: 'processing' },
  DONE:        { color: 'success',    label: 'Done',         dotColor: '#52c41a', badgeColor: '#52c41a', tagColor: 'success' },
  HOLD:        { color: 'orange',     label: 'Hold',         dotColor: '#fa8c16', badgeColor: '#fa8c16', tagColor: 'warning' },
  CANCELLED:   { color: 'error',      label: 'Cancelled',    dotColor: '#595959', badgeColor: '#595959', tagColor: 'error' },
};

export const STATUS_COLUMN_ORDER = ['TODO', 'IN_PROGRESS', 'DONE', 'HOLD', 'CANCELLED'] as const;

// --- Priority Config ---

export const PRIORITY_CONFIG: Record<string, PriorityConfig> = {
  URGENT: { color: '#cf1322', bg: '#fff1f0', label: 'Urgent' },
  HIGH:   { color: '#d4380d', bg: '#fff2e8', label: 'High' },
  MEDIUM: { color: '#d48806', bg: '#fffbe6', label: 'Medium' },
  LOW:    { color: '#389e0d', bg: '#f6ffed', label: 'Low' },
};

// --- Gantt Chart Colors ---

export const GANTT_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  TODO:        { bg: '#f0f0f0', text: '#595959' },
  IN_PROGRESS: { bg: '#e6f4ff', text: '#1677ff' },
  IN_REVIEW:   { bg: '#f9f0ff', text: '#722ed1' },
  DONE:        { bg: '#f6ffed', text: '#52c41a' },
};

export const GANTT_PRIORITY_COLORS: Record<string, string> = {
  URGENT: '#ff4d4f',
  HIGH:   '#fa8c16',
  MEDIUM: '#fadb14',
  LOW:    '#52c41a',
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
