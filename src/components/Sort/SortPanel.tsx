import { motion } from 'framer-motion';

export type SortOption = 'createdAt-desc' | 'createdAt-asc' | 'updatedAt-desc' | 'updatedAt-asc' | 'name-asc' | 'name-desc';

interface SortPanelProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string; icon: string }[] = [
  { value: 'createdAt-desc', label: '创建时间 ↓', icon: '🆕' },
  { value: 'createdAt-asc', label: '创建时间 ↑', icon: '📅' },
  { value: 'updatedAt-desc', label: '更新时间 ↓', icon: '🔄' },
  { value: 'updatedAt-asc', label: '更新时间 ↑', icon: '⏰' },
  { value: 'name-asc', label: '名称 A-Z', icon: '🔤' },
  { value: 'name-desc', label: '名称 Z-A', icon: '🔡' },
];

export const SortPanel: React.FC<SortPanelProps> = ({ value, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 mb-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">排序:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                value === option.value
                  ? 'bg-blue-500 text-white shadow'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
