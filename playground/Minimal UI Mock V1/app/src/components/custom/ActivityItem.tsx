import { motion } from 'framer-motion';
import type { Activity } from '@/types';

interface ActivityItemProps {
  activity: Activity;
  index?: number;
  isLast?: boolean;
}

export function ActivityItem({ activity, index = 0, isLast = false }: ActivityItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative pl-6 pb-5 group cursor-pointer"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[7px] top-3 bottom-0 w-[2px] bg-slate-100 group-hover:bg-slate-200 transition-colors" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
      </div>

      {/* Content */}
      <div className="group-hover:bg-slate-50 -mx-3 px-3 py-2 rounded-lg transition-colors">
        <p className="text-sm">
          <span className="text-slate-500">{activity.action}</span>{' '}
          <span className="font-medium text-slate-700">{activity.projectName}</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">{activity.timeAgo}</p>
      </div>
    </motion.div>
  );
}
