import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { authRoutes } from "./authRoutes";
import Home from "../pages/Employers/Home";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import { Link } from "react-router-dom"; // Import Link for routing
import { AdminRoutes } from "./AdminRoutes";
import { EmployersRoutes } from "./EmployersRoutes";
import Layout from "../layouts/BaseLayout";
import Example from "../pages/HomePage";
import EmployerLayout from "../layouts/EmployerLayout";
import Overview from "../pages/Dashboard/Overview";
import TTDNTD from "../pages/Employers/QuanlyTinTD";
import EmployerManagement from "../pages/Employers/ThongtinNTD";

import AdminLayout from "../layouts/AdminLayout";

import { NtvRoutes } from "./NTV";
import { useSelector, useDispatch } from "react-redux";
import { accountUser } from "../slice/authSlice";
function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const isAuth = localStorage.getItem("isAuth");
  console.log("🚀 ~ isAuth:", isAuth);

  // const isAuth = "false";
  const role = localStorage.getItem("role");
  console.log("🚀 ~ role:", role);
  useEffect(() => {
    dispatch(accountUser()).then((res) => {});
  }, []);

  return (
    <Router>
      <Routes>
        {authRoutes.map((route, index) => {
          // const previousRole = localStorage.getItem("preRole");
          // console.log("🚀 ~ {authRoutes.map ~ previousRole:", previousRole);
          // const currentPath = localStorage.getItem("prePath");
          // console.log("🚀 ~ {authRoutes.map ~ currentPath:", currentPath);
          // console.log("route", isAuth);
          // if (isAuth === "true") {
          //   if (role !== previousRole) {
          //     // Redirect to home page if current role is different from the previous role
          //     return (
          //       <Route key={index} path="*" element={<Navigate to="/home" />} />
          //     );
          //   } else {
          //     // Redirect to the previously stored path if roles match
          //     return (
          //       <Route
          //         key={index}
          //         path="*"
          //         element={<Navigate to={currentPath || "/home"} />}
          //       />
          //     );
          //   }
          // } else {
          // Render the normal route structure if not authenticated
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <route.layout>
                  <route.component />
                </route.layout>
              }
            />
          );
        })}

        {isAuth === "true" && role === "admin" ? (
          <>
            <Route
              path="/dashboard/overview"
              element={
                <AdminLayout>
                  <Overview />
                </AdminLayout>
              }
            />

            {AdminRoutes.map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <route.layout>
                      <route.component />
                    </route.layout>
                  }
                />
              );
            })}
          </>
        ) : (
          <Route path="*" element={<Navigate to={"/home"} />} />
        )}
        {isAuth === "true" && role === "ntd" ? (
          <>
            <Route
              path="/ntd/thongtin"
              element={
                <EmployerLayout>
                  <EmployerManagement />
                </EmployerLayout>
              }
            />

            {EmployersRoutes.map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <route.layout>
                      <route.component />
                    </route.layout>
                  }
                />
              );
            })}
          </>
        ) : (
          <Route path="*" element={<Navigate to={"/home"} />} />
        )}
        {isAuth === "true" && role === "ntv" ? (
          <>
            <Route
              path="/homepage"
              element={
                <Layout>
                  <Example />
                </Layout>
              }
            />

            {NtvRoutes.map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <route.layout>
                      <route.component />
                    </route.layout>
                  }
                />
              );
            })}
          </>
        ) : (
          <Route path="*" element={<Navigate to={"/home"} />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
