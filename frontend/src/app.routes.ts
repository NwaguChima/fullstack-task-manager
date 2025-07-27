import { lazy } from "react";
import App from "./App";
import { ROUTES } from "./shared/constants/routes";
import { withAuthGuard } from "./shared/helpers/with-auth-guard";
import NotFoundPage from "./components/not-found/NotFoundScreen";
import { isAuthenticated } from "./shared/helpers/is-authenticated";

const AuthScreen = lazy(() => import("./features/auth/screen/AuthScreen"));
const TaskScreen = lazy(() => import("./features/task/screen/TaskScreen"));

export const routes = [
  {
    path: ROUTES.ROOT,
    Component: App,
    children: [
      {
        index: true,
        Component: withAuthGuard(TaskScreen),
      },
      {
        path: ROUTES.AUTH,
        Component: isAuthenticated(AuthScreen),
      },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
];
