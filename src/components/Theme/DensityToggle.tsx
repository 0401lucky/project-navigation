import { motion } from 'framer-motion';
import { useDensity } from '../../contexts/DensityContext';

export const DensityToggle: React.FC = () => {
  const { density, cycleDensity } = useDensity();

  const title =
    density === 'comfortable'
      ? '切换到紧凑'
      : density === 'compact'
      ? '切换到极致紧凑'
      : '切换到舒适';

  const label = density === 'comfortable' ? '舒适' : density === 'compact' ? '紧凑' : '极致';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={cycleDensity}
      className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm text-gray-700 dark:text-gray-300"
      title={`界面密度：${title}`}
    >
      <span className="mr-1">↕️</span>
      {label}
    </motion.button>
  );
};

