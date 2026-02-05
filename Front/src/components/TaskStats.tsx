import { CheckCircle, Clock, Circle, ListTodo } from 'lucide-react';
import type { Task } from '../types';

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats = ({ tasks }: TaskStatsProps) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const stats = [
    {
      label: 'Total',
      value: totalTasks,
      icon: ListTodo,
      color: '#1a1f2a',
      borderColor: '#5a7a9a',
      textColor: '#e5e7eb',
      iconColor: '#6b9ac3',
    },
    {
      label: 'Pendientes',
      value: pendingTasks,
      icon: Circle,
      color: '#1a1f2a',
      borderColor: '#c9a962',
      textColor: '#c9a962',
      iconColor: '#c9a962',
    },
    {
      label: 'En Progreso',
      value: inProgressTasks,
      icon: Clock,
      color: '#1a1f2a',
      borderColor: '#7a8fa8',
      textColor: '#7a8fa8',
      iconColor: '#7a8fa8',
    },
    {
      label: 'Completadas',
      value: completedTasks,
      icon: CheckCircle,
      color: '#1a1f2a',
      borderColor: '#8ba880',
      textColor: '#8ba880',
      iconColor: '#8ba880',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-lg p-4 transition-transform hover:shadow-lg border"
              style={{
                backgroundColor: stat.color,
                borderColor: stat.borderColor
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: '#b0b2b8' }}>{stat.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: stat.textColor }}>{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 opacity-80" style={{ color: stat.iconColor }} />
              </div>
            </div>
          );
        })}
      </div>

      {totalTasks > 0 && (
        <div className="border rounded-lg p-4" style={{
          backgroundColor: '#1a1f2a',
          borderColor: '#5a7a9a'
        }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: '#b0b2b8' }}>Progreso General</span>
            <span className="text-sm font-bold" style={{ color: '#6b9ac3' }}>{completionRate}%</span>
          </div>
          <div className="w-full rounded-full h-2.5 overflow-hidden border" style={{
            backgroundColor: '#252b38',
            borderColor: '#5a7a9a'
          }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${completionRate}%`,
                background: 'linear-gradient(90deg, #6b9ac3 0%, #8ba880 100%)'
              }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: '#b0b2b8' }}>
            {completedTasks} de {totalTasks} tareas completadas
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskStats;
