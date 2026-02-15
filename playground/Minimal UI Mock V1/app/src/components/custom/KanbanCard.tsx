import { motion } from 'framer-motion';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  project: Project;
  index?: number;
}

const statusColors = {
  active: 'bg-emerald-500',
  delay: 'bg-red-500',
  completed: 'bg-blue-500',
  hold: 'bg-amber-500',
  cancelled: 'bg-slate-500',
};

const statusBgColors = {
  active: 'bg-emerald-50',
  delay: 'bg-red-50',
  completed: 'bg-blue-50',
  hold: 'bg-amber-50',
  cancelled: 'bg-slate-50',
};

export function KanbanCard({ project, index = 0 }: KanbanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}
      className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm cursor-pointer transition-all hover:border-slate-300"
    >
      {/* Status indicator line */}
      <div className={cn('h-1 rounded-full mb-3', statusColors[project.status])} />

      {/* Title */}
      <h4 className="font-semibold text-slate-800 text-sm mb-3 line-clamp-2">
        {project.name}
      </h4>

      {/* Progress */}
      <div className="mb-3">
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', statusColors[project.status])}
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{
              duration: 0.6,
              delay: index * 0.05 + 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-xs font-medium text-slate-500">{project.progress}%</span>
        </div>
      </div>

      {/* Assignees */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.assignees.map((assignee, i) => (
          <span
            key={i}
            className={cn(
              'text-xs px-2 py-0.5 rounded-md font-medium',
              statusBgColors[project.status],
              'text-slate-600'
            )}
          >
            {assignee}
          </span>
        ))}
      </div>

      {/* Task count */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Tasks</span>
        <span className="font-medium">
          {project.tasksCompleted}/{project.tasksTotal}
        </span>
      </div>
    </motion.div>
  );
}
