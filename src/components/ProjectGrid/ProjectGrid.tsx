import { motion } from 'framer-motion';
import type { Project } from '../../types/project';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from '../Loading/LoadingSkeleton';

interface ProjectGridProps {
  projects: Project[];
  isLoading?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onAddClick?: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  isLoading = false,
  onEdit,
  onDelete,
  onAddClick,
}) => {
  if (isLoading) {
    return <LoadingSkeleton count={6} />;
  }

  if (projects.length === 0) {
    return <EmptyState onAddClick={onAddClick} />;
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {projects.map((project) => (
        <motion.div key={project.id} variants={item}>
          <ProjectCard
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
