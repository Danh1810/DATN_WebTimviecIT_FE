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
import FilePreview from "../pages/FilePreivew";

import AdminLayout from "../layouts/AdminLayout";

import { useSelector, useDispatch } from "react-redux";
import { accountUser } from "../slice/authSlice";
function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const isAuth = localStorage.getItem("isAuth");
  console.log("route", isAuth);
  //  const isAuth ="false";
  const role = localStorage.getItem("role");
  useEffect(() => {
    dispatch(accountUser()).then((res) => {});
  }, []);

  return (
    <Router>
      <Routes>
        {authRoutes.map((route, index) => {
          const previousRole = localStorage.getItem("preRole");
          const currentPath = localStorage.getItem("prePath");
          console.log("route", isAuth);
          if (isAuth === "true") {
            if (role !== previousRole) {
              // Redirect to home page if current role is different from the previous role
              return (
                <Route key={index} path="*" element={<Navigate to="/home" />} />
              );
            } else {
              // Redirect to the previously stored path if roles match
              return (
                <Route
                  key={index}
                  path="*"
                  element={<Navigate to={currentPath || "/home"} />}
                />
              );
            }
          } else {
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
          }
        })}

        {isAuth === "true" && role === "admin" ? (
          <>
            <Route
              path="/dashboardadmin"
              element={
                <AdminLayout>
                  <DashboardPage />
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
      </Routes>
    </Router>
  );
}

export default App;
