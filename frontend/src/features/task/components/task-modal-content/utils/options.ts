import { TaskStatus } from "../../../../../types/tasks";

export const statusColorMap = {
  [TaskStatus.PENDING]: {
    backgroundColor: "#FEF3C7",
    textColor: "#92400E",
  },
  [TaskStatus.IN_PROGRESS]: {
    backgroundColor: "#DBEAFE",
    textColor: "#1E40AF",
  },
  [TaskStatus.DONE]: {
    backgroundColor: "#DCFCE7",
    textColor: "#166534",
  },
};

export const statusOptions = [
  {
    label: "Pending",
    value: TaskStatus.PENDING,
    color: statusColorMap[TaskStatus.PENDING].textColor,
    backgroundColor: statusColorMap[TaskStatus.PENDING].backgroundColor,
  },
  {
    label: "In Progress",
    value: TaskStatus.IN_PROGRESS,
    color: statusColorMap[TaskStatus.IN_PROGRESS].textColor,
    backgroundColor: statusColorMap[TaskStatus.IN_PROGRESS].backgroundColor,
  },
  {
    label: "Done",
    value: TaskStatus.DONE,
    color: statusColorMap[TaskStatus.DONE].textColor,
    backgroundColor: statusColorMap[TaskStatus.DONE].backgroundColor,
  },
];

export const priorityOptions = [
  {
    label: "Low",
    value: "low",
    backgroundColor: "#dcfce7",
    color: "#15803d",
  },
  {
    label: "Medium",
    value: "medium",
    backgroundColor: "#fff7ed",
    color: "#c2410c",
  },
  {
    label: "High",
    value: "high",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
  },
];
