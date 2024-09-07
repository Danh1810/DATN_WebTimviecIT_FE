import PublicLayout from "@/components/layouts/PublicLayout";
import News from "@/components/publicPages/news";
import NewsDetail from "@/components/publicPages/newsDetail";
export const publicRoutes = [
  { path: "/", component: News, layout: PublicLayout },
  { path: "/news/:key", component: News, layout: PublicLayout },
  { path: "/news/detail/:id", component: NewsDetail, layout: PublicLayout },
];
