import { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import { Background } from './components/Layout/Background';
import { Header } from './components/Layout/Header';
import { Container } from './components/Layout/Container';
import { Footer } from './components/Layout/Footer';
import { SearchBar } from './components/Search/SearchBar';
import { FilterPanel } from './components/Filter/FilterPanel';
import { SortPanel } from './components/Sort/SortPanel';
// 统计面板已移入右侧抽屉
import { ProjectGrid } from './components/ProjectGrid/ProjectGrid';
import { ListView } from './views/ListView/ListView';
const KanbanView = lazy(() => import('./views/KanbanView/KanbanView').then(m => ({ default: m.KanbanView })));
const TimelineView = lazy(() => import('./views/TimelineView/TimelineView').then(m => ({ default: m.TimelineView })));
import { AddProjectModal } from './components/ProjectForm/AddProjectModal';
import { EditProjectModal } from './components/ProjectForm/EditProjectModal';
import { ToastContainer } from './components/Toast/ToastContainer';
import { ProjectDrawer } from './components/Drawer/ProjectDrawer';
import { StatsDrawer } from './components/Drawer/StatsDrawer';
import { useFilter } from './hooks/useFilter';
import { useSort } from './hooks/useSort';
import { useToast } from './hooks/useToast';
import { storage } from './utils/storage';
import type { Project, ProjectCategory, ProjectStatus } from './types/project';
import type { SortOption } from './components/Sort/SortPanel';
import { ViewSwitcher, type ViewMode } from './components/ViewSwitcher/ViewSwitcher';
import { QuickToolbar } from './components/Controls/QuickToolbar';
import { BulkBar } from './components/BulkActions/BulkBar';
import { CommandPalette, type CommandItem } from './components/CommandPalette/CommandPalette';
import { useTheme } from './contexts/ThemeContext';
import { useDensity } from './contexts/DensityContext';

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
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('view-mode');
    return saved === 'list' || saved === 'kanban' || saved === 'timeline' ? (saved as ViewMode) : 'card';
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isCmdOpen, setCmdOpen] = useState(false);
  const [isStatsOpen, setStatsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toggleTheme } = useTheme();
  const { cycleDensity } = useDensity();
  const [showSearch, setShowSearch] = useState<boolean>(() => localStorage.getItem('ui-show-search') === '1');
  const [showFilter, setShowFilter] = useState<boolean>(() => localStorage.getItem('ui-show-filter') === '1');
  const [showSort, setShowSort] = useState<boolean>(() => localStorage.getItem('ui-show-sort') === '1');

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

  // 视图模式持久化
  useEffect(() => {
    localStorage.setItem('view-mode', viewMode);
  }, [viewMode]);

  // 面板可见性持久化
  useEffect(() => { localStorage.setItem('ui-show-search', showSearch ? '1' : '0'); }, [showSearch]);
  useEffect(() => { localStorage.setItem('ui-show-filter', showFilter ? '1' : '0'); }, [showFilter]);
  useEffect(() => { localStorage.setItem('ui-show-sort', showSort ? '1' : '0'); }, [showSort]);

  // 看板：更改项目状态
  const handleChangeStatus = (id: string, status: ProjectStatus) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    handleUpdate({ ...project, status, updatedAt: new Date().toISOString() });
  };

  // 多选逻辑
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleSelectAll = () => {
    setSelectedIds(prev => {
      if (filteredProjects.length > 0 && filteredProjects.every(p => prev.has(p.id))) {
        return new Set();
      }
      return new Set(filteredProjects.map(p => p.id));
    });
  };
  const clearSelection = () => setSelectedIds(new Set());

  // 批量操作
  const bulkChangeStatus = (status: ProjectStatus) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const updated = projects.map(p => ids.includes(p.id) ? { ...p, status, updatedAt: new Date().toISOString() } : p);
    setProjects(updated);
    storage.save(updated);
    success(`已将 ${ids.length} 个项目状态改为 ${status}`);
    clearSelection();
  };
  const bulkChangeCategory = (category: ProjectCategory) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const updated = projects.map(p => ids.includes(p.id) ? { ...p, category, updatedAt: new Date().toISOString() } : p);
    setProjects(updated);
    storage.save(updated);
    success(`已将 ${ids.length} 个项目分类改为 ${category}`);
    clearSelection();
  };
  const bulkDelete = () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!window.confirm(`确定删除选中的 ${ids.length} 个项目吗?`)) return;
    const updated = projects.filter(p => !ids.includes(p.id));
    setProjects(updated);
    storage.save(updated);
    success(`已删除 ${ids.length} 个项目`);
    clearSelection();
  };

  // 快捷键：Ctrl/Cmd+K 打开命令面板，/ 聚焦搜索
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMetaK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
      if (isMetaK) {
        e.preventDefault();
        setCmdOpen(true);
        return;
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        if (!showSearch) setShowSearch(true);
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 暴露命令到全局，供 CommandPalette 执行
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__appCommands = {
      add: () => setIsAddModalOpen(true),
      setView: (v: ViewMode) => setViewMode(v),
      focusSearch: () => searchInputRef.current?.focus(),
      toggleTheme,
      cycleDensity,
      clearSelection,
    };
  }, [toggleTheme, cycleDensity]);

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
        <Header projects={projects} onImport={handleImport} onOpenStats={() => setStatsOpen(true)} />
        <main className="flex-1">
          <Container>
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

            {/* 快速工具栏（小体积，默认只显示一行按钮） */}
            <QuickToolbar
              showSearch={showSearch}
              showFilter={showFilter}
              showSort={showSort}
              onToggleSearch={() => setShowSearch(v => !v)}
              onToggleFilter={() => setShowFilter(v => !v)}
              onToggleSort={() => setShowSort(v => !v)}
              viewMode={viewMode}
              onChangeView={setViewMode}
              onOpenStats={() => setStatsOpen(true)}
            />

            {/* 项目网格 */}
            {viewMode === 'card' ? (
              <ProjectGrid
                projects={sortedProjects}
                isLoading={isLoading}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onAddClick={() => setIsAddModalOpen(true)}
                onOpen={(p) => setSelectedProject(p)}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
              />
            ) : viewMode === 'list' ? (
              <ListView
                projects={sortedProjects}
                onOpen={(p) => setSelectedProject(p)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
              />
            ) : viewMode === 'kanban' ? (
              <Suspense fallback={<div className="text-center text-gray-500">加载看板视图...</div>}>
                <KanbanView
                  projects={sortedProjects}
                  onOpen={(p) => setSelectedProject(p)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleChangeStatus}
                />
              </Suspense>
            ) : (
              <Suspense fallback={<div className="text-center text-gray-500">加载时间轴视图...</div>}>
                <TimelineView projects={sortedProjects} onOpen={(p) => setSelectedProject(p)} />
              </Suspense>
            )}

            {/* 可折叠的面板：默认不显示，让“项目列表”优先出现 */}
            {showSearch && (
              <div className="mt-6">
                <SearchBar value={searchQuery} onChange={setSearchQuery} inputRef={searchInputRef} />
              </div>
            )}
            {showFilter && (
              <FilterPanel
                selectedCategories={selectedCategories}
                selectedStatus={selectedStatus}
                onCategoryChange={setSelectedCategories}
                onStatusChange={setSelectedStatus}
                onReset={handleResetFilter}
              />
            )}
            {showSort && <SortPanel value={sortOption} onChange={setSortOption} />}

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

      {/* 右侧详情抽屉 */}
      <ProjectDrawer
        isOpen={!!selectedProject}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onEdit={(p) => {
          setSelectedProject(null);
          handleEdit(p);
        }}
        onDelete={(id) => {
          setSelectedProject(null);
          handleDelete(id);
        }}
        allProjects={projects}
      />

      {/* 全局统计抽屉 */}
      <StatsDrawer isOpen={isStatsOpen} projects={projects} onClose={() => setStatsOpen(false)} />

      {/* 批量操作条 */}
      <BulkBar
        selectedCount={selectedIds.size}
        onClear={clearSelection}
        onDelete={bulkDelete}
        onChangeStatus={bulkChangeStatus}
        onChangeCategory={bulkChangeCategory}
      />

      {/* 命令面板 */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setCmdOpen(false)} commands={useCommands()} />

      {/* Toast通知 */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

export default App;

// hooks/commands within the same file for simplicity
function useCommands(): CommandItem[] {
  // 由于 hooks 需要在组件内，这里通过闭包从 window 中取得一些方法
  // 在 App 中我们将这些方法挂在到 window.__appCommands。
  // 这种做法简单直接，避免在此处引入更多上下文传递。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref: any = (window as any).__appCommands;
  const items: CommandItem[] = [
    { id: 'add', title: '添加项目', run: () => ref?.add?.(), shortcut: 'A' },
    { id: 'view-card', title: '切换到 卡片视图', run: () => ref?.setView?.('card') },
    { id: 'view-list', title: '切换到 列表视图', run: () => ref?.setView?.('list') },
    { id: 'view-kanban', title: '切换到 看板视图', run: () => ref?.setView?.('kanban') },
    { id: 'view-timeline', title: '切换到 时间轴视图', run: () => ref?.setView?.('timeline') },
    { id: 'focus-search', title: '聚焦搜索框', run: () => ref?.focusSearch?.(), shortcut: '/' },
    { id: 'toggle-theme', title: '切换主题（浅/深）', run: () => ref?.toggleTheme?.() },
    { id: 'cycle-density', title: '切换界面密度', run: () => ref?.cycleDensity?.() },
    { id: 'clear-selection', title: '清空多选', run: () => ref?.clearSelection?.() },
  ];
  return items;
}
