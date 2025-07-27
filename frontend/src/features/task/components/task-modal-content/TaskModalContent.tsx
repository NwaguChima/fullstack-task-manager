import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import {
  TaskStatus,
  type CreateTaskRequest,
  type Task,
} from "../../../../types/tasks";
import { useCreateTask, useUpdateTask } from "../../api/use-task";
import { FormInput } from "../../../../components/ui/input/FormInput";
import { Button } from "../../../../components/ui/button/Button";
import CustomSelect from "../../../../components/ui/select/CustomSelect";
import { priorityOptions, statusOptions } from "./utils/options";

type StatusOption = {
  label: string;
  value: TaskStatus;
  color: string;
};

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  dueDate: string;
  tags: string;
}

export const CreateTaskModal = ({
  isOpen,
  onClose,
  task,
}: CreateTaskModalProps) => {
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TaskFormData>();

  const isEditMode = !!task;

  useEffect(() => {
    if (isOpen) {
      if (task) {
        reset({
          title: task.title,
          description: task.description || "",
          status: task.status,
          priority:
            (task.extras?.priority as "low" | "medium" | "high") || "medium",
          dueDate: task.extras?.dueDate
            ? new Date(task.extras.dueDate).toISOString().split("T")[0]
            : "",
          tags: Array.isArray(task.extras?.tags)
            ? task.extras.tags.join(", ")
            : "",
        });
      } else {
        reset({
          title: "",
          description: "",
          status: TaskStatus.PENDING,
          priority: "medium",
          dueDate: "",
          tags: "",
        });
      }
    }
  }, [isOpen, task, reset]);

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const taskData: CreateTaskRequest = {
        title: data.title.trim(),
        description: data.description.trim() || undefined,
        status: data.status,
        extras: {
          priority: data.priority,
          dueDate: data.dueDate || undefined,
          tags: data.tags
            ? data.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            : [],
        },
      };

      if (isEditMode && task) {
        await updateTaskMutation.mutateAsync({
          id: task.id,
          data: taskData,
        });
      } else {
        await createTaskMutation.mutateAsync(taskData);
      }

      onClose();
      reset();
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-slate-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <FormInput
            label="Task Title"
            placeholder="Enter task title"
            registration={register("title", {
              required: "Task title is required",
              minLength: {
                value: 1,
                message: "Title must be at least 1 character",
              },
              maxLength: {
                value: 100,
                message: "Title cannot exceed 100 characters",
              },
            })}
            error={errors.title?.message}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Description cannot exceed 500 characters",
                },
              })}
              placeholder="Enter task description (optional)"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <CustomSelect<StatusOption>
                  {...field}
                  options={statusOptions}
                  value={
                    statusOptions.find((opt) => opt.value === field.value) ??
                    null
                  }
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  options={priorityOptions}
                  value={
                    priorityOptions.find((opt) => opt.value === field.value) ??
                    null
                  }
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </div>

          <FormInput
            label="Due Date (Optional)"
            type="date"
            registration={register("dueDate")}
          />

          <FormInput
            label="Tags (Optional)"
            placeholder="Enter tags separated by commas"
            registration={register("tags")}
            error={errors.tags?.message}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Task"
                  : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
