import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import type { Task, TaskQuery, TasksResponse } from "../../../types/tasks";
import { useTasks, useTaskStatusCounts } from "../api/use-task";
import { Button } from "../../../components/ui/button/Button";
import Loader from "../../../components/ui/loader/Loader";
import { TaskCard } from "../components/task-card/TaskCard";
import { InsightCards } from "../components/task-insight-cards/TaskInsightCard";
import { TaskFilter } from "../components/task-filter/TaskFilter";
import { Input } from "../../../components/ui/input/Input";
import Navbar from "../../../components/nav-bar/NavBar";
import { CreateTaskModal } from "../components/task-modal-content/TaskModalContent";
import { cn } from "../../../lib/utils/cn";

const TasksScreen = () => {
  const [currentFilter, setCurrentFilter] =
    useState<TaskQuery["status"]>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: tasksData,
    isLoading: isLoadingTasks,
    error: tasksError,
  } = useTasks({
    status: currentFilter,
    page: currentPage,
    limit: 10,
    sort: "-createdAt",
  });

  const taskCounts = useTaskStatusCounts();

  // to demonstrate frontend filter, but ideally would come from the backend too
  const filteredTasks = useMemo(() => {
    if (!tasksData?.data?.tasks) return [];

    if (!searchQuery.trim()) return tasksData?.data?.tasks;

    const query = searchQuery.toLowerCase();
    return tasksData?.data.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        (Array.isArray(task.extras?.tags) &&
          task.extras.tags.some((tag: string) =>
            tag.toLowerCase().includes(query),
          )),
    );
  }, [tasksData?.data?.tasks, searchQuery]);

  const handleFilterChange = (status: TaskQuery["status"]) => {
    setCurrentFilter(status);
    setCurrentPage(1);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  if (tasksError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {tasksError.message || "Failed to load tasks"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  console.log("tasksData?.pagination", tasksData);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar setIsCreateModalOpen={setIsCreateModalOpen} />

      <main className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-8 sm:px-6 lg:px-8">
        <InsightCards />

        <div>
          <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <TaskFilter
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
                taskCounts={{
                  all: taskCounts.total,
                  pending: taskCounts.pending,
                  inProgress: taskCounts.inProgress,
                  done: taskCounts.done,
                }}
              />
            </div>

            <div className="max-w-full md:max-w-64">
              <Input
                searchIcon={<Search className="h-5 w-5 text-gray-400" />}
                type="text"
                id="search"
                name="search"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg border border-gray-300 py-2 text-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </section>

          {isLoadingTasks ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                {searchQuery
                  ? "No tasks found"
                  : currentFilter
                    ? `No ${currentFilter.replace("-", " ")} tasks`
                    : "No tasks yet"}
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first task"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create Your First Task
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                ))}
              </div>

              {tasksData?.pagination && !searchQuery && (
                <TaskPagination
                  currentPage={currentPage}
                  pagination={tasksData.pagination}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </main>

      <CreateTaskModal
        isOpen={isCreateModalOpen || !!editingTask}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
      />
    </div>
  );
};

interface TaskPaginationProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pagination: TasksResponse["pagination"];
  currentPage: number;
}

// kept here since it is only used here, in an ideal situation, it would be global
function TaskPagination({
  setCurrentPage,
  pagination,
  currentPage,
}: TaskPaginationProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={!pagination.hasPrev}
        variant="secondary"
        className="px-3 py-2"
      >
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {Array.from(
          {
            length: Math.min(5, pagination.totalPages),
          },
          (_, i) => {
            const page = i + 1;
            const isCurrentPage = page === currentPage;

            return (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  isCurrentPage
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600",
                )}
              >
                {page}
              </Button>
            );
          },
        )}
      </div>

      <Button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={!pagination.hasNext}
        variant="secondary"
        className="px-3 py-2"
      >
        Next
      </Button>
    </div>
  );
}

export default TasksScreen;
