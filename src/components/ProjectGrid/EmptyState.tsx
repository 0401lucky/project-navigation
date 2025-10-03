import { motion } from 'framer-motion';

interface EmptyStateProps {
  onAddClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="card rounded-2xl p-12 text-center max-w-md">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          还没有项目
        </h3>
        <p className="text-gray-600 mb-6">
          点击下方按钮开始添加您的第一个项目吧!
        </p>
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-semibold transition-all shadow hover:shadow-md"
          >
            ✨ 添加项目
          </button>
        )}
      </div>
    </motion.div>
  );
};
