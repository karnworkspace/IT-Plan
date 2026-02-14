// ============================================================
// Centralized TypeScript Types
// Single source of truth for all entity & response types
// ============================================================

// --- Status & Priority Types ---

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED' | 'HOLD' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ProjectStatus = 'ACTIVE' | 'DELAY' | 'COMPLETED' | 'HOLD' | 'CANCELLED';
export type DailyUpdateStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED';
export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'TASK_DUE_SOON'
  | 'TASK_OVERDUE'
  | 'TASK_COMPLETED'
  | 'COMMENT_ADDED'
  | 'PROJECT_INVITE'
  | 'DAILY_REMINDER';
export type GroupType = 'USER_GROUP' | 'PROJECT_GROUP';
export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER';

// --- Common Nested Types ---

export interface UserRef {
  id: string;
  name: string;
  email: string;
}

export interface ProjectRef {
  id: string;
  name: string;
  color?: string;
}

export interface TaskRef {
  id: string;
  title: string;
}

// --- Entity Types ---

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  pinSetAt?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  projectId: string;
  assigneeId?: string;
  createdById: string;
  parentTaskId?: string;
  dueDate?: string;
  startDate?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  assignee?: UserRef;
  project?: ProjectRef;
  parentTask?: TaskRef;
  subTasks?: Task[];
  _count?: {
    subTasks?: number;
    comments?: number;
    dailyUpdates?: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  members?: ProjectMember[];
  _count?: {
    tasks: number;
    members: number;
  };
}

export interface ProjectMember {
  id: string;
  role: string;
  user: UserRef;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: UserRef;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  commentId: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  projectId?: string;
  taskId?: string;
  createdAt: string;
  task?: TaskRef;
  project?: { id: string; name: string };
}

export interface DailyUpdate {
  id: string;
  taskId: string;
  date: string;
  progress: number;
  status: DailyUpdateStatus;
  notes?: string;
  createdAt: string;
  task?: TaskRef;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: string;
  projectId?: string;
  taskId?: string;
  createdAt: string;
  user?: { id: string; name: string };
  project?: { id: string; name: string };
  task?: TaskRef;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  type: GroupType;
  color: string;
  createdAt: string;
  updatedAt: string;
  members?: {
    id: string;
    user: UserRef;
  }[];
  projects?: {
    id: string;
    project: { id: string; name: string; color: string; status: string };
  }[];
  _count?: {
    members: number;
    projects: number;
  };
}

// --- Response Types ---

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  pageSize: number;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  pageSize: number;
}

// --- Stats Types ---

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  inReview: number;
  done: number;
  blocked: number;
  overdue: number;
}

export interface ProjectStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}
