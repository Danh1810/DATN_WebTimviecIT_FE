import FeeOfStudent from "@/components/parentPages/feeOfStudent";
import ParentLayout from "@/components/layouts/ParentLayout";
import MarkOfStudent from "@/components/parentPages/markOfStudent";
import MarkOfStudentPage from "@/components/parentPages/markOfStudent/MarkOfStudent";
import ParentDashboard from "@/components/parentPages/dashDoard";
import Profile from "@/components/pages/profile";
export const parentRoutes = [
  { path: "/parent/fee", component: FeeOfStudent, layout: ParentLayout },
  { path: "/parent/mark", component: MarkOfStudent, layout: ParentLayout },
  {
    path: "/parent/mark/:student_id",
    component: MarkOfStudentPage,
    layout: ParentLayout,
  },
  { path: "/parent", component: ParentDashboard, layout: ParentLayout },
  { path: "/user/profile/:user_id", component: Profile, layout: ParentLayout },
];
