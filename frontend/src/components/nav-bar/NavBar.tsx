import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../shared/constants/routes";
import { Button } from "../ui/button/Button";
import { useClickOutside } from "../../shared/helpers/use-handle-click-outside";
import { getInitials } from "../../shared/utils/get-initials";

interface User {
  name: string;
  avatar?: string;
  email?: string;
}

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsDropdownOpen(false);
  });

  const handleLogout = () => {
    onLogout();
    setIsDropdownOpen(false);
  };

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link
              to={ROUTES.AUTH}
              className="flex items-center text-3xl font-bold transition-opacity hover:opacity-80"
            >
              <span className="text-offpista-brown">Offp</span>
              <span className="text-offpista-yellow">ista</span>
            </Link>
          </div>

          <div className="relative flex items-center" ref={dropdownRef}>
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  {user.email && (
                    <p className="text-xs text-gray-500">{user.email}</p>
                  )}
                </div>

                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full border-2 border-gray-200 object-cover"
                  />
                ) : (
                  <div className="from-offpista-brown to-offpista-yellow flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-gradient-to-br">
                    <span className="text-sm font-medium text-white">
                      {getInitials(user.name)}
                    </span>
                  </div>
                )}

                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </Button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 z-50 mt-2 w-56 rounded-md bg-white py-1 shadow-lg focus:outline-none">
                <div className="block px-4 py-2 sm:hidden">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  {user.email && (
                    <p className="text-xs text-gray-500">{user.email}</p>
                  )}
                  <hr className="my-2 border-gray-100" />
                </div>

                <Button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-red-700 transition-colors hover:bg-red-50"
                >
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
