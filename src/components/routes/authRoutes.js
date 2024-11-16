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
export const authRoutes = [
  { path: "/login", component: Login, layout: AuthLayout },
  { path: "/singup", component: Singup, layout: AuthLayout },
  { path: "/home", component: Home, layout: Base },
  { path: "/profile", component: Pro, layout: AuthLayout },
  { path: "/db", component: db, layout: AuthLayout },
  { path: "/se", component: singupe, layout: AuthLayout },
  { path: "/ct", component: chitiet, layout: AuthLayout },
  { path: "/dl", component: dl, layout: AuthLayout },

  // { path: "/forgotpassword", component: ForgotPassword, layout: AuthLayout },
];
