import { motion } from 'framer-motion';
import type { Project } from '../../types/project';
import { TagBadge } from './TagBadge';
import { CATEGORY_LABELS, STATUS_LABELS } from '../../constants';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group relative h-full"
    >
      {/* 白色卡片 */}
      <div className="card rounded-xl p-6 h-full flex flex-col transition-all duration-200">
        {/* 精选标记 */}
        {project.isFeatured && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-sm">⭐</span>
          </div>
        )}

        {/* 卡片头部 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 pr-2">
            {project.icon && (
              <div className="flex-shrink-0">
                {project.icon.startsWith('http') ? (
                  <img src={project.icon} alt={project.name} className="w-8 h-8 object-cover rounded" />
                ) : (
                  <span className="text-2xl">{project.icon}</span>
                )}
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
              {project.name}
            </h3>
          </div>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap flex-shrink-0">
            {CATEGORY_LABELS[project.category]}
          </span>
        </div>

        {/* 状态标签 */}
        <div className="mb-3">
          <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
            project.status === 'active' ? 'bg-green-100 text-green-700' :
            project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
            project.status === 'planned' ? 'bg-purple-100 text-purple-700' :
            'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}>
            {STATUS_LABELS[project.status]}
          </span>
        </div>

        {/* 项目描述 */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1 line-clamp-3">
          {project.description}
        </p>

        {/* 标签 */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {project.tags.length > 3 && (
              <span className="text-gray-500 dark:text-gray-400 text-xs self-center">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 底部按钮 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              访问项目
            </a>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="查看 GitHub"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            )}
          </div>

          {/* 操作按钮(仅悬停时显示) */}
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(project);
                  }}
                  className="w-8 h-8 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                  title="编辑"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('确定要删除这个项目吗?')) {
                      onDelete(project.id);
                    }
                  }}
                  className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                  title="删除"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
