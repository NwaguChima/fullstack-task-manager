import { lazy } from "react";
import App from "./App";
import { ROUTES } from "./shared/constants/routes";

const AuthScreen = lazy(() => import("./features/auth/screen/AuthScreen"));
const TaskScreen = lazy(() => import("./features/task/screen/TaskScreen"));

export const routes = [
  {
    path: ROUTES.AUTH,
    Component: App,
    children: [
      {
        index: true,
        Component: AuthScreen,
      },
      {
        path: ROUTES.TASKS,
        Component: TaskScreen,
      },
    ],
  },
  {
    path: "*",
    Component: null,
  },
];
