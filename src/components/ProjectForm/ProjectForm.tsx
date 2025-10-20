import { useState } from 'react';
import { nanoid } from 'nanoid';
import type { Project, ProjectCategory, ProjectStatus } from '../../types/project';
import { CATEGORY_LABELS, STATUS_LABELS } from '../../constants';

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (project: Project) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    url: initialData?.url || '',
    githubUrl: initialData?.githubUrl || '',
    tags: initialData?.tags || [],
    category: initialData?.category || 'web-app',
    thumbnail: initialData?.thumbnail || '',
    icon: initialData?.icon || '',
    status: initialData?.status || 'active',
    isFeatured: initialData?.isFeatured || false,
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 验证表单
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '项目名称不能为空';
    }

    if (!formData.description.trim()) {
      newErrors.description = '项目描述不能为空';
    }

    if (!formData.url.trim()) {
      newErrors.url = '项目链接不能为空';
    } else if (!/^https?:\/\/.+/.test(formData.url)) {
      newErrors.url = '请输入有效的 URL(以 http:// 或 https:// 开头)';
    }

    if (formData.githubUrl && !/^https?:\/\/.+/.test(formData.githubUrl)) {
      newErrors.githubUrl = '请输入有效的 GitHub URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const project: Project = {
      id: initialData?.id || nanoid(),
      ...formData,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(project);
  };

  // 添加标签
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setTagInput('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // 处理标签输入回车
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 项目名称 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          项目名称 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="输入项目名称"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* 项目描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          项目描述 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[100px] resize-y ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="简要描述项目的功能和特点"
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      {/* 项目链接 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          项目链接 <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
            errors.url ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="https://example.com"
        />
        {errors.url && <p className="mt-1 text-sm text-red-500">{errors.url}</p>}
      </div>

      {/* GitHub 链接 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          GitHub 链接 (可选)
        </label>
        <input
          type="url"
          value={formData.githubUrl}
          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
            errors.githubUrl ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="https://github.com/username/repo"
        />
        {errors.githubUrl && <p className="mt-1 text-sm text-red-500">{errors.githubUrl}</p>}
      </div>

      {/* 分类和状态 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">项目分类</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">项目状态</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 标签 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="输入标签后按回车或点击添加"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            添加
          </button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-blue-900 transition-colors"
                  title="删除标签"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 缩略图和图标 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            缩略图 URL (可选)
          </label>
          <input
            type="url"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="https://example.com/image.png"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            项目图标 (可选)
          </label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="🚀 Emoji或图片URL"
          />
          {formData.icon && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>预览:</span>
              {formData.icon.startsWith('http') ? (
                <img src={formData.icon} alt="icon" className="w-6 h-6 object-cover rounded" />
              ) : (
                <span className="text-2xl">{formData.icon}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 精选项目 */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isFeatured"
          checked={formData.isFeatured}
          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
          className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
          设为精选项目 ⭐
        </label>
      </div>

      {/* 按钮 */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow hover:shadow-md"
        >
          {isEdit ? '保存修改' : '添加项目'}
        </button>
      </div>
    </form>
  );
};
