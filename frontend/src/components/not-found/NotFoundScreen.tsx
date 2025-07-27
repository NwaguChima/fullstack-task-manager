import { Link } from "react-router-dom";
import { ROUTES } from "../../shared/constants/routes";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-lg text-gray-600">Oops! Page not found.</p>
      <Link
        to={ROUTES.ROOT}
        className="mt-6 rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
