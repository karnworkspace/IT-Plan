import { motion } from 'framer-motion';
import {
  FolderKanban,
  Clock,
  Users,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/custom/StatCard';
import { ProjectCard } from '@/components/custom/ProjectCard';
import { ActivityItem } from '@/components/custom/ActivityItem';
import type { Project, Activity } from '@/types';

const stats = [
  {
    label: 'Active Projects',
    value: 13,
    icon: FolderKanban,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    label: 'My Pending Tasks',
    value: 0,
    icon: Clock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    label: 'Team Members',
    value: 8,
    icon: Users,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    label: 'Completion Rate',
    value: 65,
    suffix: '%',
    icon: BarChart3,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

const recentProjects: Project[] = [
  {
    id: '1',
    name: 'ohm test',
    projectId: 'test',
    status: 'active',
    progress: 65,
    assignees: ['ธรา'],
    tasksCompleted: 0,
    tasksTotal: 4,
  },
  {
    id: '2',
    name: 'New HR System or Upgrade (New Technology)',
    projectId: 'PP24002-00-00',
    status: 'delay',
    progress: 65,
    assignees: ['ธรา', 'monchiant'],
    tasksCompleted: 0,
    tasksTotal: 4,
  },
  {
    id: '3',
    name: 'Smartify-Backend (สร้างระบบหลังบ้านสำหรับ...)',
    projectId: 'PP26000-00-00',
    status: 'active',
    progress: 65,
    assignees: ['ธรา'],
    tasksCompleted: 0,
    tasksTotal: 3,
  },
  {
    id: '4',
    name: 'SenX-Bot (สำหรับช่วยทำงานเก็บข้อมูลใน Lin...)',
    projectId: 'PP26000-00-00',
    status: 'active',
    progress: 65,
    assignees: ['ธรา'],
    tasksCompleted: 0,
    tasksTotal: 3,
  },
];

const activities: Activity[] = [
  {
    id: '1',
    action: 'updated task',
    projectName: 'SenX-Bot',
    timeAgo: '15 minutes ago',
  },
  {
    id: '2',
    action: 'updated task',
    projectName: 'ระบบบริหารจัดสื่อสารเบื้อง(Smartify)',
    timeAgo: 'a day ago',
  },
  {
    id: '3',
    action: 'updated task',
    projectName: 'ระบบบริหารจัดสื่อสารเบื้อง(Smartify)',
    timeAgo: 'a day ago',
  },
  {
    id: '4',
    action: 'updated task',
    projectName: 'Smartify Backend System',
    timeAgo: 'a day ago',
  },
  {
    id: '5',
    action: 'updated task',
    projectName: 'Smartify Backend System',
    timeAgo: 'a day ago',
  },
  {
    id: '6',
    action: 'updated task',
    projectName: 'ระบบบริหารจัดสื่อสารเบื้อง(Smartify)',
    timeAgo: 'a day ago',
  },
];

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Welcome back, ธรา! 👋
          </h1>
          <p className="text-slate-500">
            Here's what's happening with your projects today.
          </p>
        </div>
        <Button
          onClick={() => onNavigate('/projects')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5"
        >
          View All Projects
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} {...stat} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Projects</h2>
            <button
              onClick={() => onNavigate('/projects')}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium hover:underline transition-colors"
            >
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Recent Activity
          </h2>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            {activities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                index={index}
                isLast={index === activities.length - 1}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* My Active Tasks Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">My Active Tasks</h2>
          <button className="text-sm text-blue-500 hover:text-blue-600 font-medium hover:underline transition-colors">
            View all
          </button>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-center py-8">No active tasks</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
