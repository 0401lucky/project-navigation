import { useMemo } from 'react';
import type { Project } from '../types/project';
import type { SortOption } from '../components/Sort/SortPanel';

export const useSort = (projects: Project[], sortOption: SortOption): Project[] => {
  return useMemo(() => {
    const sorted = [...projects];

    switch (sortOption) {
      case 'createdAt-desc':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'createdAt-asc':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'updatedAt-desc':
        return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      case 'updatedAt-asc':
        return sorted.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name, 'zh-CN'));
      default:
        return sorted;
    }
  }, [projects, sortOption]);
};
