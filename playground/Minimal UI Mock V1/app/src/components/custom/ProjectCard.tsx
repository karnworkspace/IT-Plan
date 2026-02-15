import { motion } from 'framer-motion';
import { Folder } from 'lucide-react';
import type { Project } from '@/types';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
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

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -2,
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
      }}
      className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm cursor-pointer transition-colors hover:border-slate-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            project.status === 'active' ? 'bg-emerald-100' : 'bg-blue-100'
          )}
        >
          <Folder
            className={cn(
              'w-5 h-5',
              project.status === 'active' ? 'text-emerald-600' : 'text-blue-600'
            )}
          />
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Content */}
      <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">
        {project.name}
      </h3>
      <p className="text-sm text-slate-500 mb-4">Project ID: {project.projectId}</p>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Progress</span>
          <span className="font-medium text-slate-700">{project.progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', statusColors[project.status])}
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{
              duration: 0.8,
              delay: index * 0.1 + 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
