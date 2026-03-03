import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { ActivityForm } from "./pages/ActivityForm";
import { DietForm } from "./pages/DietForm";
import { History } from "./pages/History";
import { Trends } from "./pages/Trends";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "activity", Component: ActivityForm },
      { path: "diet", Component: DietForm },
      { path: "history", Component: History },
      { path: "trends", Component: Trends },
    ],
  },
]);
