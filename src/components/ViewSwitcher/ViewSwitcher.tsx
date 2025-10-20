import { motion } from 'framer-motion';

export type ViewMode = 'card' | 'list' | 'kanban' | 'timeline';

interface ViewSwitcherProps {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}

const BTN =
  'px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1';

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ value, onChange }) => {
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2">
      <button
        className={`${BTN} ${
          value === 'card'
            ? 'bg-blue-500 text-white shadow'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        onClick={() => onChange('card')}
        title="卡片视图"
      >
        <span>🗂️</span> 卡片
      </button>
      <button
        className={`${BTN} ${
          value === 'list'
            ? 'bg-blue-500 text-white shadow'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        onClick={() => onChange('list')}
        title="列表视图"
      >
        <span>📋</span> 列表
      </button>
      <button
        className={`${BTN} ${
          value === 'kanban'
            ? 'bg-blue-500 text-white shadow'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        onClick={() => onChange('kanban')}
        title="看板视图"
      >
        <span>🗃️</span> 看板
      </button>
      <button
        className={`${BTN} ${
          value === 'timeline'
            ? 'bg-blue-500 text-white shadow'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        onClick={() => onChange('timeline')}
        title="时间轴视图"
      >
        <span>🕒</span> 时间轴
      </button>
    </motion.div>
  );
};
