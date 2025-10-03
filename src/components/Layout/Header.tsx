import { motion } from 'framer-motion';
import type { Project } from '../../types/project';
import { DataManagement } from '../DataManagement/DataManagement';
import { ThemeToggle } from '../Theme/ThemeToggle';

interface HeaderProps {
  projects?: Project[];
  onImport?: (projects: Project[]) => void;
}

export const Header: React.FC<HeaderProps> = ({ projects = [], onImport }) => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-xl sm:text-2xl">🚀</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">我的项目导航</h1>
          </div>

          <nav className="flex items-center space-x-1 sm:space-x-2">
            <ThemeToggle />
            {onImport && <DataManagement projects={projects} onImport={onImport} />}
            <button className="hidden sm:block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              关于
            </button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};
