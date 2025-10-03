import type { Project } from '../types/project';
import { STORAGE_KEY, STORAGE_VERSION, DEFAULT_PROJECTS } from '../constants';

interface StorageData {
  version: string;
  projects: Project[];
  lastUpdated: string;
}

export const storage = {
  // 初始化存储(首次访问时)
  init: (): void => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      storage.save(DEFAULT_PROJECTS);
    }
  },

  // 读取所有项目
  load: (): Project[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_PROJECTS;

      const parsed: StorageData = JSON.parse(data);

      // 版本检查(未来可用于数据迁移)
      if (parsed.version !== STORAGE_VERSION) {
        console.warn('Storage version mismatch, using default projects');
        return DEFAULT_PROJECTS;
      }

      return parsed.projects;
    } catch (error) {
      console.error('Failed to load projects from storage:', error);
      return DEFAULT_PROJECTS;
    }
  },

  // 保存所有项目
  save: (projects: Project[]): void => {
    try {
      const data: StorageData = {
        version: STORAGE_VERSION,
        projects,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save projects to storage:', error);
      throw new Error('保存失败,可能存储空间不足');
    }
  },

  // 清空所有数据
  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // 获取存储使用情况
  getUsage: (): { used: number; total: number; percentage: number } => {
    const data = localStorage.getItem(STORAGE_KEY) || '';
    const used = new Blob([data]).size;
    const total = 5 * 1024 * 1024; // 假设 5MB 限制
    return {
      used,
      total,
      percentage: (used / total) * 100,
    };
  },
};
