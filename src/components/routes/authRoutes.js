import Login from "../pages/LoginPage";
import Singup from "../pages/SingupPage";
import Home from "../pages/HomePage";
import AuthLayout from "../layouts/AuthLayout";
import Base from "../layouts/BaseLayout";
import chitiet from "../pages/Chitiet";
import SearchBar from "../pages/TimkiemPage";
import VerifyEmail from "../pages/verifymail";
import App from "../pages/Congty";
import SignupNTD from "../pages/DangkyNTD";

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
  { path: "/verify", component: VerifyEmail, layout: AuthLayout },
  { path: "/ct/:id", component: App, layout: Base },
  { path: "/se", component: SignupNTD, layout: AuthLayout },

  // { path: "/forgotpassword", component: ForgotPassword, layout: AuthLayout },
];
