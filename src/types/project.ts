export interface Project {
  id: string; // 唯一标识符
  name: string; // 项目名称
  description: string; // 项目描述
  url: string; // 项目访问链接
  githubUrl?: string; // GitHub 仓库链接(可选)
  tags: string[]; // 标签数组
  category: ProjectCategory; // 项目分类
  thumbnail?: string; // 缩略图 URL(可选)
  status: ProjectStatus; // 项目状态
  createdAt: string; // 创建时间(ISO 8601)
  updatedAt: string; // 更新时间(ISO 8601)
  isFeatured?: boolean; // 是否为精选项目
}

export type ProjectCategory =
  | 'web-app'
  | 'mobile-app'
  | 'library'
  | 'tool'
  | 'forked'
  | 'other';

export type ProjectStatus =
  | 'active'
  | 'archived'
  | 'in-progress'
  | 'planned';

export interface ProjectFormData {
  name: string;
  description: string;
  url: string;
  githubUrl?: string;
  tags: string[];
  category: ProjectCategory;
  thumbnail?: string;
  status: ProjectStatus;
  isFeatured?: boolean;
}
