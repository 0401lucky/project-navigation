import { motion } from 'framer-motion';
import type { ProjectCategory, ProjectStatus } from '../../types/project';
import { CATEGORY_LABELS, STATUS_LABELS } from '../../constants';

interface FilterPanelProps {
  selectedCategories: ProjectCategory[];
  selectedStatus: ProjectStatus[];
  onCategoryChange: (categories: ProjectCategory[]) => void;
  onStatusChange: (status: ProjectStatus[]) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategories,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
  onReset,
}) => {
  const toggleCategory = (category: ProjectCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const toggleStatus = (status: ProjectStatus) => {
    if (selectedStatus.includes(status)) {
      onStatusChange(selectedStatus.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatus, status]);
    }
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedStatus.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card rounded-xl p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          筛选
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded-lg transition-all"
          >
            重置
          </button>
        )}
      </div>

      {/* 分类筛选 */}
      <div className="mb-4">
        <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-3 font-medium">项目分类</h4>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_LABELS) as ProjectCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategories.includes(category)
                  ? 'bg-blue-500 text-white border-2 border-blue-500 scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
              }`}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>
      </div>

      {/* 状态筛选 */}
      <div>
        <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-3 font-medium">项目状态</h4>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(STATUS_LABELS) as ProjectStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedStatus.includes(status)
                  ? 'bg-blue-500 text-white border-2 border-blue-500 scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
              }`}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
