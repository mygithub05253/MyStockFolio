import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/layout/Layout";
import Main from "../pages/main/Main";
import PageNotFound from '../pages/error/PageNotFound.jsx';
import PortfolioContainer from "../pages/portfolio/PortfolioContainer.jsx";
import SignIn from "../pages/signIn/SignIn.jsx";
import SignUp from "../pages/signUp/SignUp.jsx";
import MyPage from "../pages/myPage/MyPage.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import Market from "../pages/market/Market.jsx";
import Rewards from "../pages/rewards/Rewards.jsx";

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
      { path : "/market", element: <Market /> },
      { path : "/rewards", element: <Rewards /> },
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