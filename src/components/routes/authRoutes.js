import Login from "../pages/LoginPage";
import Singup from "../pages/SingupPage";
import Home from "../pages/HomePage";
import Pro from "../pages/Profile";
//import ForgotPassword from "@/components/pages/auth/ForgotPassword";
import AuthLayout from "../layouts/AuthLayout";
import db from "../pages/Dashboard/DashboardPage";
import singupe from "../pages/Employers/Dangky";
import chitiet from "../pages/TimKiem";
export const authRoutes = [
  { path: "/login", component: Login, layout: AuthLayout },
  { path: "/singup", component: Singup, layout: AuthLayout },
  { path: "/home", component: Home, layout: AuthLayout },
  { path: "/profile", component: Pro, layout: AuthLayout },
  { path: "/db", component: db, layout: AuthLayout },
  { path: "/se", component: singupe, layout: AuthLayout },
  { path: "/ct", component: chitiet, layout: AuthLayout },

  // { path: "/forgotpassword", component: ForgotPassword, layout: AuthLayout },
];
