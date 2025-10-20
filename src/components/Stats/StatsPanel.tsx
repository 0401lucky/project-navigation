import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { Project } from '../../types/project';
import { CATEGORY_LABELS, STATUS_LABELS } from '../../constants';

interface StatsPanelProps {
  projects: Project[];
  compact?: boolean; // 抽屉内使用，强制单列并放大图表
  defaultExpanded?: boolean; // 默认展开
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ projects, compact = false, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  // 统计数据
  const totalCount = projects.length;
  const activeCount = projects.filter(p => p.status === 'active').length;
  const featuredCount = projects.filter(p => p.isFeatured).length;

  // 按分类统计
  const categoryStats = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    name: label,
    value: projects.filter(p => p.category === key).length,
    color: getCategoryColor(key),
  })).filter(s => s.value > 0);

  // 按状态统计
  const statusStats = Object.entries(STATUS_LABELS).map(([key, label]) => ({
    name: label,
    value: projects.filter(p => p.status === key).length,
    fill: getStatusColor(key),
  })).filter(s => s.value > 0);

  // 最近更新的项目
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full card p-4 rounded-xl flex items-center justify-between hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">📊 项目统计</h2>
          <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>总计: <strong className="text-gray-900 dark:text-white">{totalCount}</strong></span>
            <span>活跃: <strong className="text-green-600 dark:text-green-400">{activeCount}</strong></span>
            <span>精选: <strong className="text-yellow-600 dark:text-yellow-400">{featuredCount}</strong></span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`mt-4 grid ${compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} gap-6`}>
        {/* 概览卡片 */}
        <div className="card p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">项目概览</h3>
          <div className="space-y-4">
            <StatItem label="总项目数" value={totalCount} icon="📦" color="blue" />
            <StatItem label="活跃项目" value={activeCount} icon="✅" color="green" />
            <StatItem label="精选项目" value={featuredCount} icon="⭐" color="yellow" />
            <StatItem label="归档率" value={`${totalCount > 0 ? Math.round((projects.filter(p => p.status === 'archived').length / totalCount) * 100) : 0}%`} icon="📈" color="purple" />
          </div>
        </div>

        {/* 分类分布 */}
        <div className="card p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">分类分布</h3>
          {categoryStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={compact ? 240 : 200}>
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={compact ? 60 : 50}
                  outerRadius={compact ? 100 : 80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400 dark:text-gray-500">
              暂无数据
            </div>
          )}
          <div className="mt-4 space-y-2">
            {categoryStats.map((stat) => (
              <div key={stat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }}></div>
                  <span className="text-gray-700 dark:text-gray-300">{stat.name}</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 状态统计 */}
        <div className="card p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">状态统计</h3>
          {statusStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={compact ? 240 : 200}>
              <BarChart data={statusStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#888" />
                <YAxis tick={{ fontSize: 12 }} stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400 dark:text-gray-500">
              暂无数据
            </div>
          )}
        </div>

        {/* 最近更新 */}
        {recentProjects.length > 0 && (
          <div className="mt-6 card p-6 rounded-xl lg:col-span-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🕒 最近更新</h3>
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{CATEGORY_LABELS[project.category]}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(project.updatedAt).toLocaleDateString('zh-CN')}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor(project.status)}`}>
                      {STATUS_LABELS[project.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 辅助组件
interface StatItemProps {
  label: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
    yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center text-xl`}>
          {icon}
        </div>
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
};

// 辅助函数
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'web-app': '#3b82f6',
    'mobile-app': '#10b981',
    'desktop-app': '#8b5cf6',
    'library': '#f59e0b',
    'tool': '#ef4444',
    'other': '#6b7280',
  };
  return colors[category] || '#6b7280';
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'active': '#10b981',
    'in-progress': '#3b82f6',
    'planned': '#8b5cf6',
    'archived': '#6b7280',
  };
  return colors[status] || '#6b7280';
}

function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    'active': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    'in-progress': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    'planned': 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    'archived': 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}
