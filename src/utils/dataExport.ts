import type { Project } from '../types/project';

export const dataExport = {
  // 导出为 JSON 文件
  exportToJSON: (projects: Project[], filename?: string): void => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `projects-backup-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // 从 JSON 文件导入
  importFromJSON: (file: File): Promise<Project[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const projects = JSON.parse(content) as Project[];

          // 数据验证
          if (!Array.isArray(projects)) {
            throw new Error('无效的数据格式:必须是数组');
          }

          // 基本字段验证
          projects.forEach((project, index) => {
            if (!project.id || !project.name || !project.url) {
              throw new Error(`项目 ${index + 1} 缺少必要字段`);
            }
          });

          resolve(projects);
        } catch (error) {
          reject(new Error(`导入失败: ${(error as Error).message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };

      reader.readAsText(file);
    });
  },
};
