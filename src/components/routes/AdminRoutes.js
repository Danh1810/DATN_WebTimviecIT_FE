// import TeacherLayout from "@/components/layouts/TeacherLayout";
// import TeacherMark from "@/components/teacherPages/mark";
// import TeacherAssignment from "@/components/teacherPages/assignment";
// import AssignmentDetail from "@/components/teacherPages/assignment/DetailAssignment";
// import News from "@/components/teacherPages/news";
// import NewsDetail from "@/components/teacherPages/detailNews";
// import CreateNews from "@/components/teacherPages/news/createNews";

// export const teacherRoutes = [
//   { path: "/teacher/mark", component: TeacherMark, layout: TeacherLayout },
//   {
//     path: "/teacher/assignment",
//     component: TeacherAssignment,
//     layout: TeacherLayout,
//   },
//   {
//     path: "/teacher/assignment/detail/:id",
//     component: AssignmentDetail,
//     layout: TeacherLayout,
//   },
//   {
//     path: "/teacher/news",
//     component: News,
//     layout: TeacherLayout,
//   },
//   {
//     path: "/teacher/news",
//     component: News,
//     layout: TeacherLayout,
//   },
//   {
//     path: "/teacher/news/detail/:id",
//     component: NewsDetail,
//     layout: TeacherLayout,
//   },
//   {
//     path: "/teacher/news/create",
//     component: CreateNews,
//     layout: TeacherLayout,
//   },
// ];

import AdminLayout from "../layouts/AdminLayout";
import UserManagement from "../pages/Dashboard/QLND";
import App from "../pages/Dashboard/QLTintd";
import Overview from "../pages/Dashboard/Overview";

export const AdminRoutes = [
  {
    path: "/dashboard/overview",
    component: Overview,
    layout: AdminLayout,
  },
  {
    path: "/dashboard/admin/tintuyendung",
    component: App,
    layout: AdminLayout,
  },
  {
    path: "/dashboard/admin/nguoidung",
    component: UserManagement,
    layout: AdminLayout,
  },
];
