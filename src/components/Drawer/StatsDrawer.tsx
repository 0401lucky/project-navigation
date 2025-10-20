import { AnimatePresence, motion } from 'framer-motion';
import type { Project } from '../../types/project';
import { StatsPanel } from '../Stats/StatsPanel';

interface StatsDrawerProps {
  isOpen: boolean;
  projects: Project[];
  onClose: () => void;
}

export const StatsDrawer: React.FC<StatsDrawerProps> = ({ isOpen, projects, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div className="absolute inset-0 bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="absolute right-0 top-0 h-full w-full sm:w-[680px] lg:w-[960px] xl:w-[1200px] 2xl:w-[1400px] bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-800 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">📊 项目统计</h3>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">✖</button>
            </div>
            <div className="p-4 overflow-y-auto">
              <StatsPanel projects={projects} defaultExpanded compact={false} />
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

