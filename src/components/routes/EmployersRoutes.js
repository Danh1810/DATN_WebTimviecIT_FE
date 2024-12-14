import { elements } from "chart.js";
import EmployerLayout from "../layouts/EmployerLayout";
import TTDNTD from "../pages/Employers/QuanlyTinTD";
import App from "../pages/Employers/ThemTin";
import EmployerManagement from "../pages/Employers/ThongtinNTD";
import Thanhtoan from "../pages/Employers/Dangky";
import TransactionHistory from "../pages/Employers/thanhtoandone";
import Layout from "../layouts/AuthLayout";
import App1 from "../pages/Employers/TKUV";
import PaymentHistory from "../pages/Employers/Lstt";

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
    component: Thanhtoan,
    layout: EmployerLayout,
  },
  {
    path: "/ntd/thanhcong/:id",
    component: TransactionHistory,
    layout: Layout,
  },
  {
    path: "/ntd/tkuv",
    component: App1,
    layout: EmployerLayout,
  },
  {
    path: "/ntd/lstt",
    component: PaymentHistory,
    layout: EmployerLayout,
  },
];
