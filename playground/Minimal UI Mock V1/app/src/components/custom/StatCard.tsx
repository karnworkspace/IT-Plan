import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  index?: number;
}

export function StatCard({
  label,
  value,
  suffix = '',
  icon: Icon,
  color,
  bgColor,
  index = 0,
}: StatCardProps) {
  const [count] = useCountUp(value, 1000);

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
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
          <motion.p
            className="text-3xl font-bold text-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {count}
            {suffix}
          </motion.p>
        </div>
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            bgColor
          )}
        >
          <Icon className={cn('w-5 h-5', color)} />
        </div>
      </div>
    </motion.div>
  );
}
