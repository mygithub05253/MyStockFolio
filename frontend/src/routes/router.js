import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/layout/Layout";
import Main from "../pages/main/Main";
import PageNotFound from "../pages/error/PageNotFound";
import PortfolioContainer from "../pages/portfolio/PortfolioContainer";
import SignIn from "../pages/signIn/SignIn";
import SignUp from "../pages/signUp/SignUp";
import MyPage from "../pages/myPage/MyPage";
import AdminLayout from "../pages/layout/AdminLayout";
import Dashboard from "../pages/dashboard/Dashboard";

const router = createBrowserRouter([
  {
    path : "/",
    element : <Layout />,
    children : [
      { path : "/", element : <Main /> },
      { path: "/portfolio", element : <PortfolioContainer /> },
      { path : "/signIn", element : <SignIn /> },
      { path : "/signUp", element : <SignUp /> },
      { path : "/dashboard", element: <Dashboard /> },
      { path : "/my", element : <MyPage /> },
      // TODO: /rewards 경로 추가 필요
    ]
  },
  {
    path : "*",
    element : <PageNotFound />
  }
])

export default router;