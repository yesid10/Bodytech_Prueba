import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../services/api";
import type { Task } from "../types";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Clock,
  Edit2,
  X,
  Filter,
  CheckSquare,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface CreateTaskFormInputs {
  title: string;
  description: string;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "in_progress" | "done"
  >("all");
  const [editTitle, setEditTitle] = useState("");
  useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskFormInputs>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

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
      toast.error("Failed to fetch tasks");
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
      setIsCreating(false);
      reset();
      toast.success("Task created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task");
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
      toast.success("Task deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    }
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
      toast.success(`Task marked as ${nextStatus.replace("_", " ")}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task status");
    }
  };

  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updates);
      setTasks(tasks.map((t) => (t.id === taskId ? response.data : t)));
      setEditingTask(null);
      toast.success("Task updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
  };

  const saveEditing = async (taskId: number) => {
    if (!editTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    await handleUpdateTask(taskId, { title: editTitle.trim() });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as "all" | "pending" | "in_progress" | "done",
            )
          }
          className="border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <span className="text-sm text-gray-500">
          ({filteredTasks.length}{" "}
          {filteredTasks.length === 1 ? "task" : "tasks"})
        </span>
      </div>

      {/* Create Task Form */}
      {isCreating && (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <form onSubmit={handleSubmit(handleCreateTask)} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="title"
                  placeholder="What needs to be done?"
                  disabled={isSubmitting}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${
                    errors.title
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters",
                    },
                    maxLength: {
                      value: 255,
                      message: "Title must be no more than 255 characters",
                    },
                  })}
                />
              </div>
              {errors.title && (
                <div className="mt-1 flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.title.message}</span>
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Add some details..."
                disabled={isSubmitting}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${
                  errors.description
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                {...register("description", {
                  maxLength: {
                    value: 1000,
                    message: "Description must be no more than 1000 characters",
                  },
                })}
              />
              {errors.description && (
                <div className="mt-1 flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.description.message}</span>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  reset();
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Clock className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {statusFilter === "all"
              ? "No tasks"
              : `No ${statusFilter.replace("_", " ")} tasks`}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new task.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <li key={task.id}>
                {editingTask?.id === task.id ? (
                  /* Edit Mode */
                  <div className="px-4 py-4 sm:px-6 bg-gray-50">
                    <div className="space-y-3">
                      <input
                        type="text"
                        defaultValue={editingTask.title}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Task title"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingTask(null)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEditing(task.id)}
                          className="px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                    <div
                      className="flex items-center min-w-0 flex-1 cursor-pointer"
                      onClick={() => handleUpdateStatus(task)}
                    >
                      <div className="shrink-0 mr-4">
                        {getStatusIcon(task.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-medium truncate ${task.status === "done" ? "text-gray-500 line-through" : "text-indigo-600"}`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="mt-1 text-sm text-gray-500 truncate">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                        <div className="ml-4 shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(task)}
                        className="p-1 text-gray-400 hover:text-indigo-500 transition-colors"
                        title="Edit task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
