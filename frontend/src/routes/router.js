import { createBrowserRouter } from 'react-router-dom';
import Layout from '../pages/layout/Layout.jsx'; 
import Main from '../pages/main/Main.jsx';       
import SignIn from '../pages/signIn/SignIn.jsx'; 
import SignUp from '../pages/signUp/SignUp.jsx'; 
import AdminLayout from '../pages/layout/AdminLayout.jsx'; 
import PageNotFound from '../pages/error/PageNotFound.jsx';
import PortfolioContainer from "../pages/portfolio/PortfolioContainer.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import MyPage from "../pages/myPage/MyPage.jsx";
import Market from "../pages/market/Market.jsx";
import Rewards from "../pages/rewards/Rewards.jsx";

const router = createBrowserRouter([
    // 기본 사용자 레이아웃
    {
        path: '/',
        element: <Layout />, 
        errorElement: <PageNotFound />,
        children: [
            // Layout에서 리다이렉션 로직이 처리됩니다.
            { index: true, element: <Main /> }, 
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/portfolio', element: <PortfolioContainer /> },
            { path: '/market', element: <Market /> },
            { path: '/rewards', element: <Rewards /> },
            { path: '/mypage', element: <MyPage /> },
        ],
    },
    // 로그인/회원가입 경로는 Layout 없이
    {
        path: '/signin',
        element: <SignIn />,
    },
    {
        path: '/signup',
        element: <SignUp />,
    },
    // 관리자 레이아웃 (예시)
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [ /* 관리자 페이지 */ ],
    },
    {
        path: '*',
        element: <PageNotFound />,
    },
]);

export default router;