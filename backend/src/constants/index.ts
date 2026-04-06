// ========== Task Statuses ==========
export const TASK_STATUSES = [
  'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED', 'HOLD', 'CANCELLED',
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

// Daily Update uses a subset of task statuses
export const DAILY_UPDATE_STATUSES = [
  'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED',
] as const;
export type DailyUpdateStatus = (typeof DAILY_UPDATE_STATUSES)[number];

// Status → Default Progress mapping
export const STATUS_PROGRESS: Record<string, number> = {
  TODO: 0,
  IN_PROGRESS: 25,
  IN_REVIEW: 75,
  DONE: 100,
  BLOCKED: 0,
  HOLD: 0,
  CANCELLED: 0,
};

// ========== Priorities ==========
export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
export type Priority = (typeof PRIORITIES)[number];

// ========== Project Statuses ==========
export const PROJECT_STATUSES = [
  'ACTIVE', 'DELAY', 'COMPLETED', 'HOLD', 'CANCELLED', 'POSTPONE', 'ARCHIVED',
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

// ========== Roles ==========
export const MEMBER_ROLES = ['OWNER', 'ADMIN', 'MEMBER'] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

export const USER_ROLES = ['ADMIN', 'MANAGER', 'MEMBER'] as const;
export type UserRole = (typeof USER_ROLES)[number];

// ========== Project Types ==========
export const PROJECT_TYPES = ['PROJECT', 'INTERNAL'] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const isValidProjectType = (s: string): s is ProjectType =>
  (PROJECT_TYPES as readonly string[]).includes(s);

// ========== Group Types ==========
export const GROUP_TYPES = ['USER_GROUP', 'PROJECT_GROUP'] as const;
export type GroupType = (typeof GROUP_TYPES)[number];

// ========== Validation Helpers ==========
export const isValidTaskStatus = (s: string): s is TaskStatus =>
  (TASK_STATUSES as readonly string[]).includes(s);

export const isValidDailyUpdateStatus = (s: string): s is DailyUpdateStatus =>
  (DAILY_UPDATE_STATUSES as readonly string[]).includes(s);

export const isValidPriority = (s: string): s is Priority =>
  (PRIORITIES as readonly string[]).includes(s);

export const isValidProjectStatus = (s: string): s is ProjectStatus =>
  (PROJECT_STATUSES as readonly string[]).includes(s);

export const isValidGroupType = (s: string): s is GroupType =>
  (GROUP_TYPES as readonly string[]).includes(s);
