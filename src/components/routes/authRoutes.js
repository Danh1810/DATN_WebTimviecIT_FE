import Login from "../pages/LoginPage";
import Singup from "../pages/SingupPage";
import Home from "../pages/HomePage";
import Pro from "../pages/Profile";
//import ForgotPassword from "@/components/pages/auth/ForgotPassword";
import AuthLayout from "../layouts/AuthLayout";
import Base from "../layouts/BaseLayout";
import db from "../pages/Dashboard/DashboardPage";
import singupe from "../pages/Employers/Home";
import chitiet from "../pages/Chitiet";
import dl from "../pages/DulieuPage/index";
import dn from "../pages/User/DashboardNTV";
import SearchBar from "../pages/TimkiemPage";

export const authRoutes = [
  { path: "/home", component: Home, layout: Base },
  { path: "/login", component: Login, layout: AuthLayout },
  { path: "/singup", component: Singup, layout: AuthLayout },

  // { path: "/profile", component: Pro, layout: AuthLayout },
  // { path: "/db", component: db, layout: AuthLayout },
  // { path: "/se", component: singupe, layout: AuthLayout },
  { path: "/tintuyendung/:id", component: chitiet, layout: Base },

  // { path: "/dl", component: dl, layout: AuthLayout },
  // { path: "/dn", component: dn, layout: AuthLayout },
  { path: "/ser", component: SearchBar, layout: Base },

  // { path: "/forgotpassword", component: ForgotPassword, layout: AuthLayout },
];
