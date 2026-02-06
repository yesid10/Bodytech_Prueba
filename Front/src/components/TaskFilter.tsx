import { Filter } from 'lucide-react';

interface TaskFilterProps {
  selectedFilter: 'all' | 'pending' | 'in_progress' | 'done';
  taskCount: number;
  onFilterChange: (filter: 'all' | 'pending' | 'in_progress' | 'done') => void;
}

const TaskFilter = ({ selectedFilter, taskCount, onFilterChange }: TaskFilterProps) => {
  const filters = [
    { value: 'all' as const, label: 'Todas', icon: '📋' },
    { value: 'pending' as const, label: 'Pendientes', icon: '⏳' },
    { value: 'in_progress' as const, label: 'En Progreso', icon: '⚙️' },
    { value: 'done' as const, label: 'Completadas', icon: '✅' },
  ];

  return (
    <div className="border rounded-lg p-4" style={{
      backgroundColor: '#1a1f2a',
      borderColor: '#5a7a9a'
    }}>
      <div className="flex items-center gap-3 mb-3">
        <Filter className="w-4 h-4" style={{ color: '#6b9ac3' }} />
        <span className="text-sm font-semibold" style={{ color: '#e5e7eb' }}>Filtro de Tareas</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className="px-3 cursor-pointer py-2 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center justify-center gap-2"
            style={{
              backgroundColor: selectedFilter === filter.value ? '#6b9ac3' : '#252b38',
              color: selectedFilter === filter.value ? '#0f1419' : '#b0b2b8',
              borderColor: selectedFilter === filter.value ? '#6b9ac3' : '#5a7a9a'
            }}
          >
            <span>{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>

      <p className="text-xs mt-3" style={{ color: '#b0b2b8' }}>
        Mostrando <span className="font-semibold" style={{ color: '#6b9ac3' }}>{taskCount}</span> {taskCount === 1 ? 'tarea' : 'tareas'}
      </p>
    </div>
  );
};

export default TaskFilter;
