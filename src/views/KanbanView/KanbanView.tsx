import { useMemo, type DragEvent } from 'react';
import { motion } from 'framer-motion';
import type { Project, ProjectStatus } from '../../types/project';
import { STATUS_LABELS } from '../../constants';
import { ProjectCard } from '../../components/ProjectCard/ProjectCard';

interface KanbanViewProps {
  projects: Project[];
  onOpen?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: ProjectStatus) => void;
}

const COLUMNS: ProjectStatus[] = ['planned', 'in-progress', 'active', 'archived'];

export const KanbanView: React.FC<KanbanViewProps> = ({
  projects,
  onOpen,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const grouped = useMemo(() => {
    const map: Record<ProjectStatus, Project[]> = {
      planned: [],
      'in-progress': [],
      active: [],
      archived: [],
    };
    for (const p of projects) map[p.status].push(p);
    return map;
  }, [projects]);

  const onDropTo = (status: ProjectStatus, e: DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) onStatusChange?.(id, status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {COLUMNS.map((status) => (
        <div
          key={status}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex flex-col min-h-[280px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDropTo(status, e)}
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {STATUS_LABELS[status]}
            </div>
            <div className="text-xs text-gray-500">{grouped[status].length}</div>
          </div>
          <div className="p-3 space-y-3 flex-1">
            {grouped[status].length === 0 ? (
              <div className="text-center text-xs text-gray-400 py-4">拖拽项目到这里</div>
            ) : (
              grouped[status].map((p) => (
                <motion.div key={p.id} layout>
                  <div
                    draggable
                    onDragStart={(e: DragEvent<HTMLDivElement>) => {
                      e.dataTransfer.setData('text/plain', p.id);
                    }}
                  >
                    <ProjectCard project={p} onEdit={onEdit} onDelete={onDelete} onOpen={onOpen} />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
