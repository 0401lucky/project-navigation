import type { Project } from '../types/project';

export const STORAGE_KEY = 'project-navigation-data';
export const STORAGE_VERSION = '1.0.0';

export const CATEGORY_LABELS: Record<string, string> = {
  'web-app': 'Web 应用',
  'mobile-app': '移动应用',
  'library': '库/框架',
  'tool': '工具',
  'forked': 'Fork 项目',
  'other': '其他',
};

export const STATUS_LABELS: Record<string, string> = {
  'active': '活跃',
  'archived': '归档',
  'in-progress': '开发中',
  'planned': '计划中',
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'example-1',
    name: '示例项目 1',
    description: '这是一个示例项目描述,用于展示项目导航站的功能',
    url: 'https://example.com',
    githubUrl: 'https://github.com/username/repo',
    tags: ['React', 'TypeScript', 'Vite'],
    category: 'web-app',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: true,
  },
  {
    id: 'example-2',
    name: '示例项目 2',
    description: '另一个示例项目,展示不同的项目类型',
    url: 'https://example2.com',
    tags: ['Vue', 'JavaScript'],
    category: 'tool',
    status: 'in-progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFeatured: false,
  },
];
