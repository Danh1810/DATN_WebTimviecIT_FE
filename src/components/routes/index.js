// import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { accountUser } from "../slice/authSlice";

// import { authRoutes } from "./authRoutes";
// import { AdminRoutes } from "./AdminRoutes";
// import { EmployersRoutes } from "./EmployersRoutes";
// import { NtvRoutes } from "./NTV";

// import EmployerLayout from "../layouts/EmployerLayout";
// import AdminLayout from "../layouts/AdminLayout";
// import Layout from "../layouts/BaseLayout";

// import Home from "../pages/Employers/Home";
// import DashboardPage from "../pages/Dashboard/DashboardPage";
// import Example from "../pages/HomePage";

// function App() {
//   const dispatch = useDispatch();

//   // Local state to track authentication and role
//   const [isAuth, setIsAuth] = useState(
//     localStorage.getItem("isAuth") === "true"
//   );
//   console.log("🚀 ~ App ~ isAuth:", isAuth);
//   const [role, setRole] = useState(localStorage.getItem("role"));

//   useEffect(() => {

//     dispatch(accountUser());

//     const handleStorageChange = () => {
//       setIsAuth(localStorage.getItem("isAuth") === "true");
//       setRole(localStorage.getItem("role"));
//     };

//     // Add an event listener for storage changes
//     window.addEventListener("storage", handleStorageChange);

//     // Cleanup on unmount
//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, [dispatch]);

//   // Helper function to render dynamic routes
//   const renderRoutes = (routes, LayoutComponent) =>
//     routes.map((route, index) => (
//       <Route
//         key={index}
//         path={route.path}
//         element={
//           <LayoutComponent>
//             <route.component />
//           </LayoutComponent>
//         }
//       />
//     ));

//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes: Unauthenticated Users */}
//         {!isAuth &&
//           authRoutes.map((route, index) => (
//             <Route
//               key={index}
//               path={route.path}
//               element={
//                 <route.layout>
//                   <route.component />
//                 </route.layout>
//               }
//             />
//           ))}

//         {/* Authenticated Routes: Admin */}
//         {isAuth && role === "admin" && (
//           <>
//             <Route
//               path="/dashboardadmin"
//               element={
//                 <AdminLayout>
//                   <DashboardPage />
//                 </AdminLayout>
//               }
//             />
//             {renderRoutes(AdminRoutes, AdminLayout)}
//           </>
//         )}

//         {/* Authenticated Routes: Employer (ntd) */}
//         {isAuth && role === "ntd" && (
//           <>
//             <Route
//               path="/se"
//               element={
//                 <EmployerLayout>
//                   <Home />
//                 </EmployerLayout>
//               }
//             />
//             {renderRoutes(EmployersRoutes, EmployerLayout)}
//           </>
//         )}

//         {/* Authenticated Routes: Job Seeker (ntv) */}
//         {isAuth && role === "ntv" && (
//           <>
//             <Route
//               path="/homepage"
//               element={
//                 <Layout>
//                   <Example />
//                 </Layout>
//               }
//             />
//             {renderRoutes(NtvRoutes, Layout)}
//           </>
//         )}

//         {/* Fallback Route */}
//         <Route
//           path="*"
//           element={
//             isAuth ? (
//               role === "admin" ? (
//                 <Navigate to="/dashboardadmin" />
//               ) : role === "ntd" ? (
//                 <Navigate to="/se" />
//               ) : (
//                 <Navigate to="/homepage" />
//               )
//             ) : (
//               <Navigate to="/home" />
//             )
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
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
import FilePreview from "../pages/FilePreivew";
import EmployerLayout from "../layouts/EmployerLayout";

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
        {isAuth === "true" && role === "ntd" ? (
          <>
            <Route
              path="/se"
              element={
                <EmployerLayout>
                  <Home />
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
