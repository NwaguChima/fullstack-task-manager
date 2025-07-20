import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-800 p-4 text-center text-white">
        &copy; 2025 My App
      </footer>
    </div>
  );
}

export default App;
