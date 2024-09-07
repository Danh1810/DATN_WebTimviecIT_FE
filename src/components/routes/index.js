import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { authRoutes } from "./authRoutes";
// import { publicRoutes } from "./publicRoutes";
// import { privateRoutes } from "./privateRoutes";
// import { studentRoutes } from "./studentRoutes";
// import { parentRoutes } from "./parentRoutes";
// import { teacherRoutes } from "./teacherRoutes";
// import { commonRoutes } from "./commonRoutes";

import { useSelector, useDispatch } from "react-redux";
import { accountUser } from "../slice/authSlice";
function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const isAuth = localStorage.getItem("isAuth");
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
          if (isAuth === "true") {
            if (role !== previousRole) {
              // Redirect to home page if current role is different from the previous role
              return (
                <Route key={index} path="*" element={<Navigate to="/" />} />
              );
            } else {
              // Redirect to the previously stored path if roles match
              return (
                <Route
                  key={index}
                  path="*"
                  element={<Navigate to={currentPath || "/"} />}
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

        {/* {privateRoutes.map((route, index) => {
          if (isAuth === "true") {
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
          return (
            <Route key={index} path="*" element={<Navigate to={"/login"} />} />
          );
        })} */}
        {/* {isAuth === "true" && role === "admin" ? (
          privateRoutes.map((route, index) => {
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
          })
        ) : (
          <Route path="*" element={<Navigate to={"/login"} />} />
        )}
        {isAuth === "true" && role === "student" ? (
          studentRoutes.map((route, index) => {
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
          })
        ) : (
          <Route path="*" element={<Navigate to={"/login"} />} />
        )}
        {isAuth === "true" && role === "parent" ? (
          parentRoutes.map((route, index) => {
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
          })
        ) : (
          <Route path="*" element={<Navigate to={"/login"} />} />
        )}
        {isAuth === "true" && role === "teacher" ? (
          teacherRoutes.map((route, index) => {
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
          })
        ) : (
          <Route path="*" element={<Navigate to={"/login"} />} />
        )}
        {isAuth === "true" ? (
          commonRoutes.map((route, index) => {
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
          })
        ) : (
          <Route path="*" element={<Navigate to={"/login"} />} />
        )}
        {publicRoutes.map((route, index) => {
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
        })} */}
      </Routes>
    </Router>
  );
}

export default App;