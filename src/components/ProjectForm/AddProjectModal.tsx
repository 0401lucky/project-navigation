import { Modal } from '../Modal/Modal';
import { ProjectForm } from './ProjectForm';
import type { Project } from '../../types/project';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: Project) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const handleSubmit = (project: Project) => {
    onAdd(project);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="添加新项目" size="lg">
      <ProjectForm onSubmit={handleSubmit} onCancel={onClose} isEdit={false} />
    </Modal>
  );
};
