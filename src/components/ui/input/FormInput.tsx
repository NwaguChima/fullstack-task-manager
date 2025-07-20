import * as React from "react";
import { cn } from "../../../lib/utils/cn";
import { type FieldError, type UseFormRegisterReturn } from "react-hook-form";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | string;
  registration?: UseFormRegisterReturn;
}

const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", label, id, error, registration, ...props },
    ref,
  ) => {
    const inputId = id || `input-${label?.replace(/\s+/g, "-").toLowerCase()}`;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          ref={ref}
          {...registration}
          className={cn(
            "rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-[#718EBF]",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500",
            className,
          )}
          {...props}
        />
        {error && (
          <span className="mt-0.5 text-xs text-[#f64949fe]">
            {typeof error === "string" ? error : error.message}
          </span>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
export { FormInput };
