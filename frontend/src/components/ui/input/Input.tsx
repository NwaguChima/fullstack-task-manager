import * as React from "react";
import { cn } from "../../../lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  searchIcon?: React.ReactNode; // Optional prop for the search icon
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, searchIcon, type = "text", ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-full border bg-[#F5F7FA] px-5 md:h-[42px]",
          className,
        )}
      >
        {searchIcon && (
          <div className="flex cursor-pointer items-center justify-center">
            {searchIcon}
          </div>
        )}
        <input
          type={type}
          className="h-full flex-1 bg-transparent ring-0 outline-none placeholder:text-[#8BA3CB] hover:ring-0 active:ring-0"
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
