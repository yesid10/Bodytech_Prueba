import { CheckSquare } from 'lucide-react';
import type { Task } from '../types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  editingTaskId: number | null;
  editTitle: string;
  onStatusClick: (task: Task) => void;
  onEditClick: (task: Task) => void;
  onDeleteClick: (id: number) => void;
  onEditTitleChange: (title: string) => void;
  onSaveEdit: (taskId: number) => void;
  onCancelEdit: () => void;
}

const TaskList = ({
  tasks,
  loading,
  editingTaskId,
  editTitle,
  onStatusClick,
  onEditClick,
  onDeleteClick,
  onEditTitleChange,
  onSaveEdit,
  onCancelEdit,
}: TaskListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="space-y-4 text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{
              borderColor: '#5a7a9a',
              borderTopColor: '#6b9ac3'
            }}></div>
          </div>
          <p style={{ color: '#b0b2b8' }}>Cargando tareas...</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex justify-center items-center py-16 px-4">
        <div className="text-center space-y-4">
          <CheckSquare className="mx-auto w-16 h-16 opacity-50" style={{ color: '#5a7a9a' }} />
          <div>
            <h3 className="text-lg font-semibold" style={{ color: '#b0b2b8' }}>Sin tareas</h3>
            <p className="text-sm mt-1" style={{ color: '#b0b2b8' }}>
              Comienza creando una nueva tarea para ver tu lista aquí
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isEditing={editingTaskId === task.id}
          editTitle={editTitle}
          onStatusClick={onStatusClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onEditTitleChange={onEditTitleChange}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </div>
  );
};

export default TaskList;
