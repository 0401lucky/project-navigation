import { Modal } from '../Modal/Modal';
import { ProjectForm } from './ProjectForm';
import type { Project } from '../../types/project';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (project: Project) => void;
  project: Project | null;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  project,
}) => {
  const handleSubmit = (updatedProject: Project) => {
    onUpdate(updatedProject);
    onClose();
  };

  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="编辑项目" size="lg">
      <ProjectForm
        initialData={project}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isEdit={true}
      />
    </Modal>
  );
};
