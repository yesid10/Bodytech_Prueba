import { useEffect, useState } from "react";
import api from "../services/api";
import type { Task } from "../types";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import TaskStats from "../components/TaskStats";
import TaskFilter from "../components/TaskFilter";
import ConfirmDialog from "../components/ConfirmDialog";

interface CreateTaskFormInputs {
  title: string;
  description: string;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "in_progress" | "done"
  >("all");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; taskId: number | null }>({
    isOpen: false,
    taskId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter((task) => task.status === statusFilter));
    }
  }, [tasks, statusFilter]);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData: CreateTaskFormInputs) => {
    try {
      const response = await api.post("/tasks", {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: "pending",
      });
      setTasks([response.data, ...tasks]);
      setIsFormOpen(false);
      toast.success("Tarea creada exitosamente ✨");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo crear la tarea");
    }
  };

  const handleDeleteTask = async (id: number) => {
    // Abrir modal de confirmación
    setDeleteConfirm({ isOpen: true, taskId: id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.taskId) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/tasks/${deleteConfirm.taskId}`);
      setTasks(tasks.filter((t) => t.id !== deleteConfirm.taskId));
      toast.success("Tarea eliminada exitosamente");
      setDeleteConfirm({ isOpen: false, taskId: null });
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar la tarea");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ isOpen: false, taskId: null });
  };

  const handleUpdateStatus = async (task: Task) => {
    const statusFlow: Record<string, Task["status"]> = {
      pending: "in_progress",
      in_progress: "done",
      done: "pending",
    };

    const nextStatus = statusFlow[task.status];
    try {
      const response = await api.put(`/tasks/${task.id}`, {
        status: nextStatus,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)));
      const statusLabels: Record<string, string> = {
        pending: "Pendiente",
        in_progress: "En Progreso",
        done: "Completada",
      };
      toast.success(`Tarea marcada como ${statusLabels[nextStatus]}`);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el estado de la tarea");
    }
  };

  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updates);
      setTasks(tasks.map((t) => (t.id === taskId ? response.data : t)));
      setEditingTask(null);
      toast.success("Tarea actualizada exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar la tarea");
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const saveEditing = async (taskId: number) => {
    if (!editTitle.trim()) {
      toast.error("El título no puede estar vacío");
      return;
    }
    await handleUpdateTask(taskId, { 
      title: editTitle.trim(),
      description: editDescription.trim()
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f1419' }}>
      {/* Header */}
      <div className="border-b sticky top-0 z-40 backdrop-blur-md" style={{
        backgroundColor: '#1a1f2a',
        borderColor: '#5a7a9a'
      }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{
                background: 'linear-gradient(135deg, #6b9ac3 0%, #8ba880 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Mis Tareas
              </h1>
              <p className="text-sm mt-1" style={{ color: '#b0b2b8' }}>Gestiona tu productividad</p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #6b9ac3 0%, #7a8fa8 100%)',
                color: '#0f1419'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #7a9db8 0%, #8ba9ba 100%)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #6b9ac3 0%, #7a8fa8 100%)'}
            >
              <Plus className="w-5 h-5" />
              Nueva Tarea
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats */}
          <TaskStats tasks={tasks} />

          {/* Filter */}
          <TaskFilter
            selectedFilter={statusFilter}
            taskCount={filteredTasks.length}
            onFilterChange={setStatusFilter}
          />

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            loading={loading}
            editingTaskId={editingTask?.id || null}
            editTitle={editTitle}
            editDescription={editDescription}
            onStatusClick={handleUpdateStatus}
            onEditClick={startEditing}
            onDeleteClick={handleDeleteTask}
            onEditTitleChange={setEditTitle}
            onEditDescriptionChange={setEditDescription}
            onSaveEdit={saveEditing}
            onCancelEdit={() => setEditingTask(null)}
          />
        </div>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        isSubmitting={false}
        onSubmit={handleCreateTask}
        onClose={() => setIsFormOpen(false)}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Eliminar tarea"
        message="¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
