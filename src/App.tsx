import { Outlet, Link } from "react-router-dom";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="bg-indigo-600 p-4 text-white shadow-md">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">
              Auth (Login/Signup)
            </Link>
          </li>
          <li>
            <Link to="/tasks" className="hover:underline">
              Tasks
            </Link>
          </li>
        </ul>
      </nav>

      <main className="flex-grow">
        <Outlet />{" "}
      </main>

      <footer className="bg-gray-800 p-4 text-center text-white">
        &copy; 2025 My App
      </footer>
    </div>
  );
}

export default App;
