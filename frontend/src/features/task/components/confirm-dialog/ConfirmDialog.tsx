import { AlertTriangle } from "lucide-react";
import { Button } from "../../../../components/ui/button/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "warning",
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: "text-red-600 bg-red-50 dark:bg-red-900/20",
    warning: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    info: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  };

  const buttonStyles = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-orange-600 hover:bg-orange-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative mx-4 w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-slate-800">
        <div className="p-6">
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${variantStyles[variant]}`}
          >
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="text-center">
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">{message}</p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="secondary"
              className="flex-1"
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              className={`flex-1 text-white ${buttonStyles[variant]}`}
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
