import React from "react";
import { Button } from "../ui/button/Button";
import { useLogout, useUser } from "../../features/auth/api/hooks/use-auth";
import { LogOut, Plus, User } from "lucide-react";

interface NavbarProps {
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setIsCreateModalOpen }) => {
  const { data: user } = useUser();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Task Manager
            </h1>
            <div className="hidden text-sm text-gray-500 sm:block dark:text-gray-400">
              Welcome back, {user?.name || "User"}!
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
            </Button>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 text-sm text-gray-600 sm:flex dark:text-gray-400">
                <User className="h-4 w-4" />
                {user?.email}
              </div>
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="flex items-center gap-2"
                disabled={isPending}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
