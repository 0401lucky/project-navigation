import { useState, useEffect } from 'react';
import { Background } from './components/Layout/Background';
import { Header } from './components/Layout/Header';
import { Container } from './components/Layout/Container';
import { Footer } from './components/Layout/Footer';
import { SearchBar } from './components/Search/SearchBar';
import { FilterPanel } from './components/Filter/FilterPanel';
import { SortPanel } from './components/Sort/SortPanel';
import { StatsPanel } from './components/Stats/StatsPanel';
import { ProjectGrid } from './components/ProjectGrid/ProjectGrid';
import { AddProjectModal } from './components/ProjectForm/AddProjectModal';
import { EditProjectModal } from './components/ProjectForm/EditProjectModal';
import { ToastContainer } from './components/Toast/ToastContainer';
import { useFilter } from './hooks/useFilter';
import { useSort } from './hooks/useSort';
import { useToast } from './hooks/useToast';
import { storage } from './utils/storage';
import type { Project, ProjectCategory, ProjectStatus } from './types/project';
import type { SortOption } from './components/Sort/SortPanel';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ProjectCategory[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('createdAt-desc');

  const { toasts, removeToast, success } = useToast();

  // 初始化加载数据
  useEffect(() => {
    storage.init();
    const loadedProjects = storage.load();
    setProjects(loadedProjects);
    setIsLoading(false);
  }, []);

  // 使用筛选 Hook
  const filteredProjects = useFilter(projects, {
    searchQuery,
    selectedCategories,
    selectedStatus,
  });

  // 使用排序 Hook
  const sortedProjects = useSort(filteredProjects, sortOption);

  // 重置筛选
  const handleResetFilter = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedStatus([]);
  };

  // 添加项目
  const handleAdd = (project: Project) => {
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    storage.save(updatedProjects);
    success(`项目"${project.name}"添加成功!`);
  };

  // 更新项目
  const handleUpdate = (updatedProject: Project) => {
    const updatedProjects = projects.map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(updatedProjects);
    storage.save(updatedProjects);
    success(`项目"${updatedProject.name}"更新成功!`);
  };

  // 删除项目
  const handleDelete = (id: string) => {
    const project = projects.find((p) => p.id === id);
    const updatedProjects = projects.filter((p) => p.id !== id);
    setProjects(updatedProjects);
    storage.save(updatedProjects);
    success(`项目"${project?.name}"已删除`);
  };

  // 打开编辑对话框
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  // 导入数据
  const handleImport = (importedProjects: Project[]) => {
    setProjects(importedProjects);
    storage.save(importedProjects);
    success(`成功导入 ${importedProjects.length} 个项目!`);
  };

  // 计算统计数据
  const totalCount = projects.length;
  const activeCount = projects.filter(p => p.status === 'active').length;
  const filteredCount = filteredProjects.length;

  return (
    <>
      <Background />
      <div className="min-h-screen flex flex-col">
        <Header projects={projects} onImport={handleImport} />
        <main className="flex-1">
          <Container>
            {/* 项目统计面板 */}
            {!isLoading && totalCount > 0 && <StatsPanel projects={projects} />}

            {/* 统计信息 */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">我的项目</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  共 {totalCount} 个项目 · {activeCount} 个活跃
                  {filteredCount !== totalCount && ` · 筛选后 ${filteredCount} 个`}
                </p>
              </div>
              <button
                className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-all shadow hover:shadow-md"
                onClick={() => setIsAddModalOpen(true)}
              >
                ✨ 添加项目
              </button>
            </div>

            {/* 搜索栏 */}
            <div className="mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>

            {/* 筛选面板 */}
            <FilterPanel
              selectedCategories={selectedCategories}
              selectedStatus={selectedStatus}
              onCategoryChange={setSelectedCategories}
              onStatusChange={setSelectedStatus}
              onReset={handleResetFilter}
            />

            {/* 排序面板 */}
            <SortPanel value={sortOption} onChange={setSortOption} />

            {/* 项目网格 */}
            <ProjectGrid
              projects={sortedProjects}
              isLoading={isLoading}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onAddClick={() => setIsAddModalOpen(true)}
            />

            {/* 阶段提示 */}
            {!isLoading && totalCount > 0 && (
              <div className="mt-12 card rounded-xl p-6 text-center">
                <p className="text-gray-700 text-sm">
                  🎉 <strong>阶段三完成!</strong> 项目增删改查功能已实现
                  <br />
                  <span className="text-gray-500 text-xs">
                    下一步将在阶段四实现:数据导入导出、UI/UX 精细化等功能
                  </span>
                </p>
              </div>
            )}
          </Container>
        </main>
        <Footer />
      </div>

      {/* 添加项目对话框 */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />

      {/* 编辑项目对话框 */}
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProject(null);
        }}
        onUpdate={handleUpdate}
        project={editingProject}
      />

      {/* Toast通知 */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

export default App;
