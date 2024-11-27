import duser from "../pages/User/DashboardNTV";
import Layout from "../layouts/BaseLayout";
import JobDetails from "../pages/Chitiet";
import Example from "../pages/HomePage";
export const NtvRoutes = [
  {
    path: "/user",
    component: duser,
    layout: Layout,
  },
  {
    path: "/tintuyendung/:id",
    component: JobDetails,
    layout: Layout,
  },
  {
    path: "/homepage",
    component: Example,
    layout: Layout,
  },
];
