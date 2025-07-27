import { Check } from "lucide-react";
import type { TaskQuery, TaskStatus } from "../../../../types/tasks";
import { Button } from "../../../../components/ui/button/Button";
import { cn } from "../../../../lib/utils/cn";

interface TaskFilterProps {
  currentFilter: TaskQuery["status"];
  onFilterChange: (status: TaskQuery["status"]) => void;
  taskCounts?: {
    all: number;
    pending: number;
    inProgress: number;
    done: number;
  };
}

export const TaskFilter = ({
  currentFilter,
  onFilterChange,
  taskCounts,
}: TaskFilterProps) => {
  const filters = [
    {
      key: undefined,
      label: "All Tasks",
      count: taskCounts?.all || 0,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      activeColor: "bg-gray-600",
    },
    {
      key: "pending" as const,
      label: "Pending",
      count: taskCounts?.pending || 0,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      activeColor: "bg-yellow-600",
    },
    {
      key: "in-progress" as const,
      label: "In Progress",
      count: taskCounts?.inProgress || 0,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      activeColor: "bg-blue-600",
    },
    {
      key: "done" as const,
      label: "Completed",
      count: taskCounts?.done || 0,
      color: "text-green-600",
      bgColor: "bg-green-100",
      activeColor: "bg-green-600",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = currentFilter === filter.key;

        return (
          <Button
            key={filter.key || "all"}
            onClick={() => onFilterChange(filter.key as TaskStatus)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? `${filter.activeColor} text-white shadow-sm`
                : `${filter.bgColor} ${filter.color} hover:shadow-sm dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600`,
            )}
          >
            {isActive && <Check className="h-3 w-3" />}
            <span>{filter.label}</span>
            <span
              className={cn(
                "min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-xs font-medium",
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-white text-gray-600 dark:bg-slate-600 dark:text-gray-300",
              )}
            >
              {filter.count}
            </span>
          </Button>
        );
      })}
    </div>
  );
};
