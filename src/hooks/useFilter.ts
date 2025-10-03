import { useMemo } from 'react';
import type { Project, ProjectCategory, ProjectStatus } from '../types/project';

interface FilterOptions {
  searchQuery: string;
  selectedCategories: ProjectCategory[];
  selectedStatus: ProjectStatus[];
}

export const useFilter = (projects: Project[], options: FilterOptions): Project[] => {
  return useMemo(() => {
    let filtered = [...projects];

    // 搜索过滤
    if (options.searchQuery.trim()) {
      const query = options.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // 分类过滤
    if (options.selectedCategories.length > 0) {
      filtered = filtered.filter((project) =>
        options.selectedCategories.includes(project.category)
      );
    }

    // 状态过滤
    if (options.selectedStatus.length > 0) {
      filtered = filtered.filter((project) =>
        options.selectedStatus.includes(project.status)
      );
    }

    return filtered;
  }, [projects, options]);
};
