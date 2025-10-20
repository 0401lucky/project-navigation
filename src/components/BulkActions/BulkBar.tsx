import type { ProjectCategory, ProjectStatus } from '../../types/project';

interface BulkBarProps {
  selectedCount: number;
  onClear: () => void;
  onDelete: () => void;
  onChangeStatus: (status: ProjectStatus) => void;
  onChangeCategory: (cat: ProjectCategory) => void;
}

export const BulkBar: React.FC<BulkBarProps> = ({
  selectedCount,
  onClear,
  onDelete,
  onChangeStatus,
  onChangeCategory,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="card rounded-xl px-4 py-3 flex items-center gap-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="text-sm text-gray-700 dark:text-gray-300">已选 {selectedCount} 项</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">状态</span>
            <button className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200" onClick={() => onChangeStatus('active')}>活跃</button>
            <button className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200" onClick={() => onChangeStatus('in-progress')}>开发中</button>
            <button className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700 hover:bg-purple-200" onClick={() => onChangeStatus('planned')}>计划中</button>
            <button className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => onChangeStatus('archived')}>归档</button>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">分类</span>
            <select
              className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              onChange={(e) => onChangeCategory(e.target.value as ProjectCategory)}
              defaultValue=""
            >
              <option value="" disabled>选择分类</option>
              <option value="web-app">Web 应用</option>
              <option value="mobile-app">移动应用</option>
              <option value="library">库/框架</option>
              <option value="tool">工具</option>
              <option value="forked">Fork 项目</option>
              <option value="other">其他</option>
            </select>
          </div>
          <button className="px-3 py-1.5 text-sm rounded bg-red-500 hover:bg-red-600 text-white" onClick={onDelete}>删除</button>
          <button className="px-3 py-1.5 text-sm rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClear}>清空选择</button>
        </div>
      </div>
    </div>
  );
};

