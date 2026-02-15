import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/custom/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { Projects } from '@/pages/Projects';
import './App.css';

function App() {
  const [currentPath, setCurrentPath] = useState('/');

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar activePath={currentPath} onNavigate={handleNavigate} />

      {/* Main Content */}
      <main className="flex-1 ml-[260px]">
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentPath === '/' && <Dashboard onNavigate={handleNavigate} />}
              {currentPath === '/projects' && <Projects />}
              {currentPath !== '/' && currentPath !== '/projects' && (
                <div className="flex items-center justify-center h-[60vh]">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      Coming Soon
                    </h2>
                    <p className="text-slate-500">
                      This feature is under development.
                    </p>
                    <button
                      onClick={() => handleNavigate('/')}
                      className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Go back to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
