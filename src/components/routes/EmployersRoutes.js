import { elements } from "chart.js";
import EmployerLayout from "../layouts/EmployerLayout";
import Dashboard from "../pages/Employers/Home";
import App from "../pages/Employers/ThemTin";

export const EmployersRoutes = [
  {
    path: "/se",
    component: Dashboard,
    layout: EmployerLayout,
  },
];
