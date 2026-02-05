import type { Task } from '../types';
import { CheckCircle, Circle, Clock, Edit2, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isEditing: boolean;
  editTitle: string;
  onStatusClick: (task: Task) => void;
  onEditClick: (task: Task) => void;
  onDeleteClick: (id: number) => void;
  onEditTitleChange: (title: string) => void;
  onSaveEdit: (taskId: number) => void;
  onCancelEdit: () => void;
}

const TaskCard = ({
  task,
  isEditing,
  editTitle,
  onStatusClick,
  onEditClick,
  onDeleteClick,
  onEditTitleChange,
  onSaveEdit,
  onCancelEdit,
}: TaskCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-5 h-5" style={{ color: '#8ba880' }} />;
      case 'in_progress':
        return <Clock className="w-5 h-5" style={{ color: '#7a8fa8' }} />;
      default:
        return <Circle className="w-5 h-5" style={{ color: '#c9a962' }} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      done: 'text-[#8ba880] border border-[#8ba880]/40 px-2 py-1',
      in_progress: 'text-[#7a8fa8] border border-[#7a8fa8]/40 px-2 py-1',
      pending: 'text-[#c9a962] border border-[#c9a962]/40 px-2 py-1',
    };
    const labels = {
      done: 'Completada',
      in_progress: 'En Progreso',
      pending: 'Pendiente',
    };
    return { badge: badges[status as keyof typeof badges], label: labels[status as keyof typeof labels] };
  };

  const { badge, label } = getStatusBadge(task.status);

  if (isEditing) {
    return (
      <div className="rounded-lg p-4 border" style={{ backgroundColor: '#1a1f2a', borderColor: '#5a7a9a' }}>
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => onEditTitleChange(e.target.value)}
            className="w-full rounded-md px-3 py-2 placeholder-[#b0b2b8] focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: '#252b38',
              borderColor: '#6b9ac3',
              color: '#e5e7eb',
              borderWidth: '1px',
              outlineColor: '#6b9ac3'
            }}
            placeholder="Título de la tarea"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={onCancelEdit}
              className="px-3 py-1 border rounded-md text-sm font-medium hover:transition-colors"
              style={{
                borderColor: '#5a7a9a',
                color: '#b0b2b8',
                backgroundColor: '#252b38'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1a1f2a')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#252b38')}
            >
              Cancelar
            </button>
            <button
              onClick={() => onSaveEdit(task.id)}
              className="px-3 py-1 border-transparent rounded-md text-sm font-medium focus:outline-none focus:ring-2 transition-colors"
              style={{
                color: '#0f1419',
                backgroundColor: '#6b9ac3'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a9db8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6b9ac3')}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-4 transition-all duration-200 group cursor-pointer border" style={{
      backgroundColor: '#1a1f2a',
      borderColor: '#5a7a9a'
    }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0" onClick={() => onStatusClick(task)}>
          <div className="shrink-0 mt-1">{getStatusIcon(task.status)}</div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-semibold truncate transition-all`}
              style={{
                color: task.status === 'done' ? '#b0b2b8' : '#e5e7eb',
                textDecoration: task.status === 'done' ? 'line-through' : 'none'
              }}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="mt-1 text-xs line-clamp-2" style={{ color: '#b0b2b8' }}>
                {task.description}
              </p>
            )}
            <div className="mt-2">
              <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${badge}`}>
                {label}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEditClick(task)}
            className="p-2 rounded-md transition-colors"
            style={{
              color: '#6b9ac3'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#7a9db8';
              e.currentTarget.style.backgroundColor = '#252b38';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b9ac3';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Editar tarea"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteClick(task.id)}
            className="p-2 rounded-md transition-colors"
            style={{
              color: '#a17171'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#b18c8c';
              e.currentTarget.style.backgroundColor = '#252b38';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#a17171';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Eliminar tarea"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
