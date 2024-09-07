import MartOfStudent from "@/components/studentPages/markOfStudent";
import AssignmentOfStudent from "@/components/studentPages/assignmentOfStudent";
import DetailAssignment from "@/components/studentPages/assignmentOfStudent/DetailAssignment";
import FeeOfStudent from "@/components/studentPages/feeOfStudent";
import StudentLayout from "@/components/layouts/StudentLayout";
export const studentRoutes = [
  { path: "/student/mark", component: MartOfStudent, layout: StudentLayout },
  {
    path: "/student/assignment",
    component: AssignmentOfStudent,
    layout: StudentLayout,
  },
  {
    path: "/student/assignment/detail/:id",
    component: DetailAssignment,
    layout: StudentLayout,
  },
  { path: "/student/fee", component: FeeOfStudent, layout: StudentLayout },
];
