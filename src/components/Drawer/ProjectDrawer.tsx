import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../../types/project';
import { CATEGORY_LABELS, STATUS_LABELS } from '../../constants';
import { StatsPanel } from '../Stats/StatsPanel';

interface ProjectDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  allProjects?: Project[];
}

export const ProjectDrawer: React.FC<ProjectDrawerProps> = ({ project, isOpen, onClose, onEdit, onDelete, allProjects = [] }) => {
  return (
    <AnimatePresence>
      {isOpen && project && (
        <div className="fixed inset-0 z-50">
          {/* 遮罩 */}
          <motion.div
            className="absolute inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 抽屉 */}
          <motion.aside
            className="absolute right-0 top-0 h-full w-full sm:w-[520px] md:w-[680px] lg:w-[820px] bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-800 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{project.name}</h3>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                ✖
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
              {project.icon && (
                <div className="text-3xl">{project.icon}</div>
              )}

              <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {project.description || '暂无描述'}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-700 dark:text-gray-300">
                  {CATEGORY_LABELS[project.category]}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  project.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : project.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-700'
                    : project.status === 'planned'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {STATUS_LABELS[project.status]}
                </span>
              </div>

              {project.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span key={t} className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{t}</span>
                  ))}
                </div>
              ) : null}

              <div className="flex gap-2 pt-2">
                <a
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >访问项目</a>
                {project.githubUrl && (
                  <a
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm rounded-lg text-gray-700 dark:text-gray-300"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >GitHub</a>
                )}
              </div>

              {/* 统计（默认折叠，组件内部可展开） */}
              {allProjects.length > 0 && (
                <div className="pt-2">
                  <StatsPanel projects={allProjects} compact />
                </div>
              )}
            </div>

            {(onEdit || onDelete) && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">
                {onEdit && (
                  <button className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm" onClick={() => onEdit(project)}>编辑</button>
                )}
                {onDelete && (
                  <button
                    className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
                    onClick={() => { if (window.confirm('确定要删除这个项目吗?')) onDelete(project.id); }}
                  >删除</button>
                )}
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
