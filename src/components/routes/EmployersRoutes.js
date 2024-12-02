import { elements } from "chart.js";
import EmployerLayout from "../layouts/EmployerLayout";
import Dashboard from "../pages/Employers/Home";
import TTDNTD from "../pages/Employers/QuanlyTinTD";
import App from "../pages/Employers/ThemTin";
import EmployerManagement from "../pages/Employers/ThongtinNTD";
import RegisterForm from "../pages/Employers/Dangky";

export const EmployersRoutes = [
  {
    path: "/ntd/thongtin",
    component: EmployerManagement,
    layout: EmployerLayout,
  },
  {
    path: "/ntd/qlttd/tao-bai-dang",
    component: App,
    layout: EmployerLayout,
  },
  {
    path: "/ntd/qlttd/cac-bai-dang",
    component: TTDNTD,
    layout: EmployerLayout,
  },
  {
    path: "/ntd/muabaidang",
    component: RegisterForm,
    layout: EmployerLayout,
  },
];
