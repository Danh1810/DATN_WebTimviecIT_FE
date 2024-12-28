import duser from "../pages/User/DashboardNTV";
import Layout from "../layouts/SeekersLayout";
import JobDetails from "../pages/Chitiet";
import Example from "../pages/HomePage";
import ProfileForm from "../pages/Profile";
import CVManagement from "../pages/User/hoso";
import Luucongviec from "../pages/User/Luucongviec";
import JobApplicationForm from "../pages/User/Congviecungtuyen";
import SearchBar from "../pages/TimkiemPage";
import Thanhtoan from "../pages/User/Mua";
import TransactionHistory from "../pages/Employers/thanhtoandone";
export const NtvRoutes = [
  {
    path: "/profile",
    component: ProfileForm,
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
  { path: "/ser", component: SearchBar, layout: Layout },
  {
    path: "/hoso",
    component: CVManagement,
    layout: Layout,
  },
  {
    path: "/luucv",
    component: Luucongviec,
    layout: Layout,
  },
  {
    path: "/vieclamut",
    component: JobApplicationForm,
    layout: Layout,
  },
  {
    path: "/tt",
    component: Thanhtoan,
    layout: Layout,
  },
  {
    path: "ntd/thanhcong/:id",
    component: TransactionHistory,
    layout: Layout,
  },
];
