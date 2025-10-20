import type { Project } from '../../types/project';
import { CATEGORY_LABELS, STATUS_LABELS } from '../../constants';
import { format } from 'date-fns';

interface ListViewProps {
  projects: Project[];
  onOpen?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
}

export const ListView: React.FC<ListViewProps> = ({ projects, onOpen, onEdit, onDelete, selectedIds, onToggleSelect, onToggleSelectAll }) => {
  return (
    <div className="card rounded-xl overflow-hidden">
      <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="col-span-4 flex items-center gap-2">
          {selectedIds && (
            <input type="checkbox" checked={projects.every(p => selectedIds.has(p.id)) && projects.length > 0}
              onChange={() => onToggleSelectAll?.()} />
          )}
          名称
        </div>
        <div className="col-span-2">分类</div>
        <div className="col-span-2">状态</div>
        <div className="col-span-2">更新</div>
        <div className="col-span-2 text-right">操作</div>
      </div>

      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {projects.map((p) => (
          <li key={p.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
            <div className="grid grid-cols-12 gap-2 items-center">
              <button
                className="col-span-12 md:col-span-4 text-left text-gray-900 dark:text-white font-medium truncate flex items-center gap-2"
                onClick={() => onOpen?.(p)}
                title="查看详情"
              >
                {selectedIds && (
                  <input type="checkbox" checked={selectedIds.has(p.id)} onChange={(e) => { e.stopPropagation(); onToggleSelect?.(p.id); }} onClick={(e) => e.stopPropagation()} />
                )}
                {p.icon ? (
                  <span className="align-middle">{p.icon}</span>
                ) : null}
                <span className="align-middle">{p.name}</span>
              </button>

              <div className="hidden md:block md:col-span-2 text-gray-700 dark:text-gray-300">{CATEGORY_LABELS[p.category]}</div>

              <div className="hidden md:block md:col-span-2">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  p.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : p.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-700'
                    : p.status === 'planned'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {STATUS_LABELS[p.status]}
                </span>
              </div>

              <div className="hidden md:block md:col-span-2 text-gray-500 dark:text-gray-400 text-sm">
                {format(new Date(p.updatedAt), 'yyyy-MM-dd')}
              </div>

              <div className="col-span-12 md:col-span-2 flex justify-end gap-2">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  访问
                </a>
                {onEdit && (
                  <button
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                    onClick={(e) => { e.stopPropagation(); onEdit(p); }}
                  >编辑</button>
                )}
                {onDelete && (
                  <button
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                    onClick={(e) => { e.stopPropagation(); if (window.confirm('确定要删除这个项目吗?')) onDelete(p.id); }}
                  >删除</button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
