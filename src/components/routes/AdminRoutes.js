import AdminLayout from "../layouts/AdminLayout";
import UserManagement from "../pages/Dashboard/QLND";
import App from "../pages/Dashboard/QLTintd";
import Overview from "../pages/Dashboard/Overview";
import JobLevelManagement from "../pages/Dashboard/QLCB";
import EmployerManagement from "../pages/Dashboard/QLNTD";

export const AdminRoutes = [
  {
    path: "/dashboard/overview",
    component: Overview,
    layout: AdminLayout,
  },
  {
    path: "/dashboard/admin/tintuyendung",
    component: App,
    layout: AdminLayout,
  },
  {
    path: "/dashboard/admin/nguoidung",
    component: UserManagement,
    layout: AdminLayout,
  },
  {
    path: "/dashboard/admin/capbac",
    component: JobLevelManagement,
    layout: AdminLayout,
  },
  {
    path: "/dashboard/admin/ntd",
    component: EmployerManagement,
    layout: AdminLayout,
  },
];
