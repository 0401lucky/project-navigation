import { useMemo } from 'react';
import type { Project } from '../../types/project';
import { CATEGORY_LABELS, STATUS_LABELS } from '../../constants';
import { format, parseISO } from 'date-fns';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface TimelineViewProps {
  projects: Project[];
  onOpen?: (project: Project) => void;
}

const monthKey = (iso: string) => format(parseISO(iso), 'yyyy-MM');

export const TimelineView: React.FC<TimelineViewProps> = ({ projects, onOpen }) => {
  const { groups, chart } = useMemo(() => {
    const map = new Map<string, Project[]>();
    for (const p of projects) {
      const key = monthKey(p.updatedAt || p.createdAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    // 排序：按月份倒序
    const groups = Array.from(map.entries())
      .sort((a, b) => (a[0] > b[0] ? -1 : 1))
      .map(([m, list]) => ({ month: m, list }));

    // 最近12个月数据
    const now = new Date();
    const months: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(format(d, 'yyyy-MM'));
    }
    const chart = months.map((m) => ({ month: m, count: map.get(m)?.length ?? 0 }));
    return { groups, chart };
  }, [projects]);

  return (
    <div className="space-y-6">
      <div className="card rounded-xl p-4">
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">最近 12 个月项目活跃度</div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart} margin={{ left: 6, right: 6, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#93c5fd" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card rounded-xl p-4">
        {groups.map(({ month, list }) => (
          <div key={month} className="mb-6 last:mb-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-gray-900 dark:text-white font-semibold">{month}</h4>
              <span className="text-xs text-gray-500">{list.length} 个更新</span>
            </div>
            <ul className="space-y-2">
              {list
                .slice()
                .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
                .map((p) => (
                  <li key={p.id} className="px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <button className="w-full text-left" onClick={() => onOpen?.(p)}>
                      <div className="flex items-center justify-between">
                        <div className="truncate">
                          <span className="mr-2">{p.icon ?? '📁'}</span>
                          <span className="text-gray-900 dark:text-white font-medium">{p.name}</span>
                          <span className="ml-2 text-xs text-gray-500">{CATEGORY_LABELS[p.category]}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(parseISO(p.updatedAt || p.createdAt), 'MM-dd')}
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                        {STATUS_LABELS[p.status]} · {p.description}
                      </div>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

