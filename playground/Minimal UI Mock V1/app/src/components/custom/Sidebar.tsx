import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  Clock,
  Users,
  LogOut,
  Bell,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Projects', icon: FolderKanban, path: '/projects' },
  { label: 'My Tasks', icon: CheckSquare, path: '/tasks' },
  { label: 'Calendar', icon: Calendar, path: '/calendar' },
  { label: 'Timeline', icon: Clock, path: '/timeline' },
  { label: 'Groups', icon: Users, path: '/groups' },
];

export function Sidebar({ activePath, onNavigate }: SidebarProps) {
  const [, setHoveredItem] = useState<string | null>(null);

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-slate-900 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 pb-8">
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ opacity: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SENA</span>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activePath === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <motion.button
                  onClick={() => onNavigate(item.path)}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative',
                    isActive
                      ? 'text-blue-400 bg-blue-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  )}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-blue-500 rounded-r-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-colors duration-200',
                      isActive ? 'text-blue-400' : 'text-slate-400'
                    )}
                  />
                  <span>{item.label}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-800">
        {/* User Profile */}
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
            ธ
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">ธรา</p>
          </div>
          <motion.button
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Logout Button */}
        <motion.button
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-slate-700 hover:border-slate-600 transition-all duration-200"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </motion.button>
      </div>
    </aside>
  );
}
