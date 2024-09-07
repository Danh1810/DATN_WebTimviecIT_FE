import Login from "../pages/LoginPage";
//import ForgotPassword from "@/components/pages/auth/ForgotPassword";
import AuthLayout from "../layouts/AuthLayout";
export const authRoutes = [
  { path: "/login", component: Login, layout: AuthLayout },
  // { path: "/forgotpassword", component: ForgotPassword, layout: AuthLayout },
];