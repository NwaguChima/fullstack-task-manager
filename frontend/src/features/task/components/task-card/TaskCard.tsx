import { useState } from "react";
import {
  MoreHorizontal,
  Calendar,
  Tag,
  Edit,
  Trash2,
  Clock,
} from "lucide-react";
import { TaskStatus, type Task } from "../../../../types/tasks";
import { useDeleteTask, useUpdateTask } from "../../api/use-task";
import { Button } from "../../../../components/ui/button/Button";
import { formatDate } from "../../../../shared/utils/format-date";
import { cn } from "../../../../lib/utils/cn";
import { useClickOutside } from "../../../../shared/helpers/use-handle-click-outside";
import { ConfirmDialog } from "../confirm-dialog/ConfirmDialog";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const statusColors = {
  [TaskStatus.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [TaskStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800 border-blue-200",
  [TaskStatus.DONE]: "bg-green-100 text-green-800 border-green-200",
};

const statusIcons = {
  [TaskStatus.PENDING]: "⏳",
  [TaskStatus.IN_PROGRESS]: "🔄",
  [TaskStatus.DONE]: "✅",
};

const taskStatusToTextMap = {
  [TaskStatus.PENDING]: "Pending",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.DONE]: "Done",
};

export const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleStatusChange = (newStatus: Task["status"]) => {
    updateTaskMutation.mutate({
      id: task.id,
      data: { status: newStatus },
    });
  };

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    deleteTaskMutation.mutate(task.id);
    setShowConfirmDialog(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const actionsRef = useClickOutside<HTMLDivElement>(() => {
    setShowActions(false);
  });

  return (
    <div className="group relative flex h-[250px] flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex items-start justify-between">
        <div
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
            statusColors[task.status],
          )}
        >
          <span className="text-sm">{statusIcons[task.status]}</span>
          <span className="text-base">{taskStatusToTextMap[task.status]}</span>
        </div>

        <div className="relative" ref={actionsRef}>
          <Button
            onClick={() => setShowActions(!showActions)}
            className="rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </Button>

          {showActions && (
            <TaskActionDropdown
              handleDelete={handleDelete}
              onEdit={onEdit}
              setShowActions={setShowActions}
              task={task}
            />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="mb-2 line-clamp-1 font-semibold text-gray-900 dark:text-white">
          {task.title}
        </h3>

        {task.description && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {task.description}
          </p>
        )}

        {task.extras && Object.keys(task.extras).length > 0 && (
          <div className="mt-auto mb-3 flex flex-wrap gap-2">
            {task.extras.priority && (
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-medium",
                  getPriorityColor(task.extras.priority),
                )}
              >
                {task.extras.priority} priority
              </span>
            )}

            {task.extras.dueDate && (
              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-slate-700 dark:text-gray-300">
                <Calendar className="h-3 w-3" />
                {formatDate(task.extras.dueDate)}
              </span>
            )}

            {task.extras.tags && Array.isArray(task.extras.tags) && (
              <>
                {task.extras.tags
                  .slice(0, 1)
                  .map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                {task.extras.tags.length > 1 && (
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-slate-700 dark:text-gray-400">
                    +{task.extras.tags.length - 1} more
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex h-[50px] items-center justify-between border-t border-gray-100 pt-3 dark:border-slate-700">
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="h-3 w-3" />
          {formatDate(task.createdAt)}
        </div>

        <div className="flex items-center gap-1">
          {task.status !== TaskStatus.PENDING && (
            <Button
              onClick={() => handleStatusChange(TaskStatus.PENDING)}
              className="h-auto rounded px-2 py-2 text-xs text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              disabled={updateTaskMutation.isPending}
            >
              Pending
            </Button>
          )}
          {task.status !== TaskStatus.IN_PROGRESS && (
            <Button
              onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
              className="h-auto rounded px-2 py-2 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              disabled={updateTaskMutation.isPending}
            >
              In Progress
            </Button>
          )}
          {task.status !== TaskStatus.DONE && (
            <Button
              onClick={() => handleStatusChange(TaskStatus.DONE)}
              className="h-auto rounded px-2 py-2 text-xs text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
              disabled={updateTaskMutation.isPending}
            >
              Done
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmDialog(false)}
        isLoading={deleteTaskMutation.isPending}
        variant="danger"
      />
    </div>
  );
};

interface TaskActionDropdownProps {
  onEdit: (task: Task) => void;
  setShowActions: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  task: Task;
}

function TaskActionDropdown({
  onEdit,
  setShowActions,
  handleDelete,
  task,
}: TaskActionDropdownProps) {
  return (
    <div className="absolute top-8 right-0 z-10 min-w-[120px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-slate-600 dark:bg-slate-800">
      <Button
        onClick={() => {
          onEdit(task);
          setShowActions(false);
        }}
        className="flex w-full items-center justify-start gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-700"
      >
        <Edit className="h-3 w-3" />
        Edit
      </Button>
      <Button
        onClick={() => {
          handleDelete();
          setShowActions(false);
        }}
        className="flex w-full items-center justify-start gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <Trash2 className="h-3 w-3" />
        Delete
      </Button>
    </div>
  );
}
