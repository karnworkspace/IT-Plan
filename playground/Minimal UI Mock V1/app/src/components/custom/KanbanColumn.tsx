import { motion } from 'framer-motion';
import type { Project, ProjectStatus } from '@/types';
import { KanbanCard } from './KanbanCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  title: string;
  status: ProjectStatus;
  count: number;
  projects: Project[];
}

const statusConfig = {
  active: {
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
  },
  delay: {
    dotColor: 'bg-red-500',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700',
  },
  completed: {
    dotColor: 'bg-blue-500',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
  },
  hold: {
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
  },
  cancelled: {
    dotColor: 'bg-slate-500',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
  },
};

export function KanbanColumn({ title, status, count, projects }: KanbanColumnProps) {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col min-w-[280px] max-w-[320px] flex-1"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className={cn('w-2.5 h-2.5 rounded-full', config.dotColor)} />
          <h3 className="font-semibold text-slate-700">{title}</h3>
        </div>
        <span
          className={cn(
            'text-xs font-bold px-2.5 py-1 rounded-full',
            config.badgeBg,
            config.badgeText
          )}
        >
          {count}
        </span>
      </div>

      {/* Cards Container */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1 custom-scrollbar">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <KanbanCard key={project.id} project={project} index={index} />
          ))
        ) : (
          <div className="flex items-center justify-center h-32 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <span className="text-sm text-slate-400">No projects</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
