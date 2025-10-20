import { ViewSwitcher, type ViewMode } from '../ViewSwitcher/ViewSwitcher';

interface QuickToolbarProps {
  showSearch: boolean;
  showFilter: boolean;
  showSort: boolean;
  onToggleSearch: () => void;
  onToggleFilter: () => void;
  onToggleSort: () => void;
  viewMode: ViewMode;
  onChangeView: (v: ViewMode) => void;
  onOpenStats?: () => void;
}

const Btn: React.FC<{ active?: boolean; onClick: () => void; title: string; children: React.ReactNode }> = ({ active, onClick, title, children }) => (
  <button
    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
      active ? 'bg-blue-500 text-white shadow' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
    onClick={onClick}
    title={title}
  >
    {children}
  </button>
);

export const QuickToolbar: React.FC<QuickToolbarProps> = ({
  showSearch,
  showFilter,
  showSort,
  onToggleSearch,
  onToggleFilter,
  onToggleSort,
  viewMode,
  onChangeView,
  onOpenStats,
}) => {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Btn active={showSearch} onClick={onToggleSearch} title={showSearch ? '隐藏搜索' : '显示搜索'}>🔍 搜索</Btn>
        <Btn active={showFilter} onClick={onToggleFilter} title={showFilter ? '隐藏筛选' : '显示筛选'}>🧰 筛选</Btn>
        <Btn active={showSort} onClick={onToggleSort} title={showSort ? '隐藏排序' : '显示排序'}>↕️ 排序</Btn>
        {onOpenStats && (
          <Btn active={false} onClick={onOpenStats} title="打开项目统计">📊 统计</Btn>
        )}
      </div>
      <ViewSwitcher value={viewMode} onChange={onChangeView} />
    </div>
  );
};
