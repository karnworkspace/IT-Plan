import * as XLSX from 'xlsx';

interface ExportColumn {
  header: string;
  key: string;
  width?: number;
  transform?: (value: any, row: any) => string;
}

/**
 * Export data to Excel file
 */
export function exportToExcel(
  data: any[],
  columns: ExportColumn[],
  fileName: string,
  sheetName = 'Sheet1'
) {
  // Build header row
  const headers = columns.map((col) => col.header);

  // Build data rows
  const rows = data.map((item) =>
    columns.map((col) => {
      const value = getNestedValue(item, col.key);
      return col.transform ? col.transform(value, item) : (value ?? '');
    })
  );

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Set column widths
  ws['!cols'] = columns.map((col) => ({ wch: col.width || 15 }));

  // Create workbook and export
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

// ============================================
// Pre-built export configs
// ============================================

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  DELAY: 'Delay',
  COMPLETED: 'Completed',
  HOLD: 'Hold',
  CANCELLED: 'Cancelled',
  POSTPONE: 'Postpone',
  ARCHIVED: 'Archived',
};

const TASK_STATUS_LABELS: Record<string, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  DONE: 'Done',
  BLOCKED: 'Blocked',
  HOLD: 'Hold',
  CANCELLED: 'Cancelled',
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

function formatDate(val: string | undefined): string {
  if (!val) return '-';
  return new Date(val).toLocaleDateString('th-TH');
}

export function exportProjects(projects: any[]) {
  const columns: ExportColumn[] = [
    { header: 'No.', key: '_index', width: 5, transform: (_v, _r) => '' },
    { header: 'Project Name', key: 'name', width: 25 },
    { header: 'Description', key: 'description', width: 35 },
    { header: 'Status', key: 'status', width: 12, transform: (v) => STATUS_LABELS[v] || v },
    { header: 'Tasks', key: '_count.tasks', width: 8 },
    { header: 'Members', key: '_count.members', width: 10 },
    {
      header: 'Progress',
      key: 'stats',
      width: 10,
      transform: (_v, row) => {
        const stats = row.stats;
        if (!stats || stats.total === 0) return '0%';
        return `${Math.round((stats.completed / stats.total) * 100)}%`;
      },
    },
    { header: 'Start Date', key: 'startDate', width: 14, transform: (v) => formatDate(v) },
    { header: 'End Date', key: 'endDate', width: 14, transform: (v) => formatDate(v) },
    { header: 'Created', key: 'createdAt', width: 14, transform: (v) => formatDate(v) },
  ];

  // Add row numbers
  const numberedData = projects.map((p, i) => ({ ...p, _index: i + 1 }));
  const rows = numberedData.map((item, i) =>
    columns.map((col) => {
      if (col.key === '_index') return i + 1;
      const value = getNestedValue(item, col.key);
      return col.transform ? col.transform(value, item) : (value ?? '');
    })
  );

  const headers = columns.map((col) => col.header);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws['!cols'] = columns.map((col) => ({ wch: col.width || 15 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Projects');

  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `TaskFlow_Projects_${today}.xlsx`);
}

export function exportTasks(tasks: any[], projectName: string) {
  const columns: ExportColumn[] = [
    { header: 'No.', key: '_index', width: 5 },
    { header: 'Task Title', key: 'title', width: 30 },
    { header: 'Description', key: 'description', width: 35 },
    { header: 'Status', key: 'status', width: 14, transform: (v) => TASK_STATUS_LABELS[v] || v },
    { header: 'Priority', key: 'priority', width: 10, transform: (v) => PRIORITY_LABELS[v] || v },
    { header: 'Assignee', key: 'assignee.name', width: 18 },
    { header: 'Progress', key: 'progress', width: 10, transform: (v) => `${v || 0}%` },
    { header: 'Start Date', key: 'startDate', width: 14, transform: (v) => formatDate(v) },
    { header: 'Finish Date', key: 'dueDate', width: 14, transform: (v) => formatDate(v) },
    { header: 'Created', key: 'createdAt', width: 14, transform: (v) => formatDate(v) },
  ];

  const rows = tasks.map((item, i) =>
    columns.map((col) => {
      if (col.key === '_index') return i + 1;
      const value = getNestedValue(item, col.key);
      return col.transform ? col.transform(value, item) : (value ?? '');
    })
  );

  const headers = columns.map((col) => col.header);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws['!cols'] = columns.map((col) => ({ wch: col.width || 15 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tasks');

  const safeName = projectName.replace(/[^a-zA-Z0-9\u0E00-\u0E7F]/g, '_');
  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `TaskFlow_Tasks_${safeName}_${today}.xlsx`);
}
