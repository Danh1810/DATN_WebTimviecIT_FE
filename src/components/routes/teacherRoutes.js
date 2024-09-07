import TeacherLayout from "@/components/layouts/TeacherLayout";
import TeacherMark from "@/components/teacherPages/mark";
import TeacherAssignment from "@/components/teacherPages/assignment";
import AssignmentDetail from "@/components/teacherPages/assignment/DetailAssignment";
import News from "@/components/teacherPages/news";
import NewsDetail from "@/components/teacherPages/detailNews";
import CreateNews from "@/components/teacherPages/news/createNews";

export const teacherRoutes = [
  { path: "/teacher/mark", component: TeacherMark, layout: TeacherLayout },
  {
    path: "/teacher/assignment",
    component: TeacherAssignment,
    layout: TeacherLayout,
  },
  {
    path: "/teacher/assignment/detail/:id",
    component: AssignmentDetail,
    layout: TeacherLayout,
  },
  {
    path: "/teacher/news",
    component: News,
    layout: TeacherLayout,
  },
  {
    path: "/teacher/news",
    component: News,
    layout: TeacherLayout,
  },
  {
    path: "/teacher/news/detail/:id",
    component: NewsDetail,
    layout: TeacherLayout,
  },
  {
    path: "/teacher/news/create",
    component: CreateNews,
    layout: TeacherLayout,
  },
];
