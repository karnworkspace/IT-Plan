import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Download,
  FileText,
  Plus,
  Search,
  Grid3X3,
  List,
  SlidersHorizontal,
  Folder,
  CheckCircle2,
  AlertTriangle,
  Pause,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { KanbanColumn } from '@/components/custom/KanbanColumn';
import type { Project, ProjectStatus } from '@/types';
import { cn } from '@/lib/utils';

const projectStats = [
  { label: 'Total', value: 20, icon: Folder, color: 'bg-slate-100 text-slate-600' },
  { label: 'Active', value: 13, icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Delay', value: 3, icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  { label: 'Completed', value: 2, icon: CheckCircle2, color: 'bg-blue-100 text-blue-600' },
  { label: 'Hold', value: 2, icon: Pause, color: 'bg-amber-100 text-amber-600' },
  { label: 'Cancelled', value: 0, icon: XCircle, color: 'bg-slate-800 text-white' },
];

const allProjects: Project[] = [
  // Active
  {
    id: '1',
    name: 'CMS-POJJAMAN 2026',
    projectId: 'PP26001-00-00',
    status: 'active',
    progress: 0,
    assignees: ['ธรา', 'อดินันท์(OHM)', 'nattapongm'],
    tasksCompleted: 0,
    tasksTotal: 4,
  },
  {
    id: '2',
    name: 'ohm test',
    projectId: 'PP26002-00-00',
    status: 'active',
    progress: 20,
    assignees: ['อดินันท์(OHM)'],
    tasksCompleted: 0,
    tasksTotal: 5,
  },
  {
    id: '3',
    name: 'REM Improvement',
    projectId: 'PP26003-00-00',
    status: 'active',
    progress: 0,
    assignees: ['ธรา'],
    tasksCompleted: 0,
    tasksTotal: 3,
  },
  // Delay
  {
    id: '4',
    name: 'New HR System or Upgrade (New Technology)',
    projectId: 'PP24002-00-00',
    status: 'delay',
    progress: 25,
    assignees: ['ธรา', 'monchiant'],
    tasksCompleted: 0,
    tasksTotal: 4,
  },
  {
    id: '5',
    name: 'Product Single View',
    projectId: 'PP26004-00-00',
    status: 'delay',
    progress: 0,
    assignees: ['ธรา', 'monchiant'],
    tasksCompleted: 0,
    tasksTotal: 2,
  },
  {
    id: '6',
    name: 'Referral - RentNex,LivNex',
    projectId: 'PP26005-00-00',
    status: 'delay',
    progress: 0,
    assignees: ['ธรา'],
    tasksCompleted: 0,
    tasksTotal: 2,
  },
  // Completed
  {
    id: '7',
    name: 'Corporate OKR System',
    projectId: 'PP26006-00-00',
    status: 'completed',
    progress: 0,
    assignees: ['ธรา', 'Pending to search...'],
    tasksCompleted: 0,
    tasksTotal: 3,
  },
  {
    id: '8',
    name: 'Master Customer Profiles & Customer Single View',
    projectId: 'PP26007-00-00',
    status: 'completed',
    progress: 0,
    assignees: ['ธรา', 'nattapongm'],
    tasksCompleted: 0,
    tasksTotal: 2,
  },
  // Hold
  {
    id: '9',
    name: 'E-Contract',
    projectId: 'PP26008-00-00',
    status: 'hold',
    progress: 0,
    assignees: ['ธรา', 'nattapongm'],
    tasksCompleted: 0,
    tasksTotal: 3,
  },
  {
    id: '10',
    name: 'REM LivNex/RentNex Improvement 2026',
    projectId: 'PP26009-00-00',
    status: 'hold',
    progress: 0,
    assignees: ['ธรา', 'nattapongm'],
    tasksCompleted: 0,
    tasksTotal: 3,
  },
];

const statusFilters: { label: string; value: ProjectStatus; color: string }[] = [
  { label: 'Active', value: 'active', color: 'text-emerald-600' },
  { label: 'Delay', value: 'delay', color: 'text-red-600' },
  { label: 'Completed', value: 'completed', color: 'text-blue-600' },
  { label: 'Hold', value: 'hold', color: 'text-amber-600' },
  { label: 'Cancelled', value: 'cancelled', color: 'text-slate-600' },
];

export function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<ProjectStatus[]>([
    'active',
    'delay',
    'completed',
    'hold',
    'cancelled',
  ]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toggleStatus = (status: ProjectStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredProjects = allProjects.filter(
    (project) =>
      selectedStatuses.includes(project.status) &&
      (searchQuery === '' ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.projectId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const projectsByStatus = {
    active: filteredProjects.filter((p) => p.status === 'active'),
    delay: filteredProjects.filter((p) => p.status === 'delay'),
    completed: filteredProjects.filter((p) => p.status === 'completed'),
    hold: filteredProjects.filter((p) => p.status === 'hold'),
    cancelled: filteredProjects.filter((p) => p.status === 'cancelled'),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-slate-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          </div>
          <p className="text-slate-500 ml-13">Manage and track all your projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Save PDF
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {projectStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm cursor-pointer transition-colors hover:border-slate-300"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">{stat.label}</span>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', stat.color.split(' ')[0])}>
                <stat.icon className={cn('w-4 h-4', stat.color.split(' ')[1])} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort & View */}
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Name (A → Z)
            </Button>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100">
          {statusFilters.map((filter) => (
            <label
              key={filter.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Checkbox
                checked={selectedStatuses.includes(filter.value)}
                onCheckedChange={() => toggleStatus(filter.value)}
              />
              <span className={cn('text-sm font-medium', filter.color)}>
                {filter.label}
              </span>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Kanban Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-x-auto pb-4"
      >
        <div className="flex gap-6 min-w-max">
          <KanbanColumn
            title="Active"
            status="active"
            count={projectsByStatus.active.length}
            projects={projectsByStatus.active}
          />
          <KanbanColumn
            title="Delay"
            status="delay"
            count={projectsByStatus.delay.length}
            projects={projectsByStatus.delay}
          />
          <KanbanColumn
            title="Completed"
            status="completed"
            count={projectsByStatus.completed.length}
            projects={projectsByStatus.completed}
          />
          <KanbanColumn
            title="Hold"
            status="hold"
            count={projectsByStatus.hold.length}
            projects={projectsByStatus.hold}
          />
          <KanbanColumn
            title="Cancelled"
            status="cancelled"
            count={projectsByStatus.cancelled.length}
            projects={projectsByStatus.cancelled}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
