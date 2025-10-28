import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../../modules/user'; 
// 아이콘 import (react-icons/fi 설치 가정)
import { FiHome, FiBriefcase, FiTrendingUp, FiGift, FiUser } from 'react-icons/fi';


const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector(state => state.user); 

    // [Redux 상태 초기화 및 라우팅 분기 로직]
    useEffect(() => {
        const checkAuthAndRedirect = () => {
            const token = localStorage.getItem('accessToken');
            
            // 1. 초기 로그인 상태 동기화 (새로고침 대응)
            if (token && !isLoggedIn) {
                // 토큰이 있지만 Redux 상태가 없으면, 로그인 복구 시도
                // **TODO: P2 단계에서 GET /api/user/info API 호출로 대체되어야 함**
                const tempUserInfo = { userId: 1, email: 'restored@user.com', nickname: '복구 사용자' }; 
                dispatch(loginSuccess(tempUserInfo)); 
                
            } else if (!token && isLoggedIn) {
                // 토큰이 없는데 Redux 상태만 남아있다면, 확실하게 로그아웃 처리
                dispatch(logout());
            }

            // 2. 경로별 리다이렉션 처리 (라우팅 제어)
            // [문제 해결] 비로그인 시 메인 화면이 나오도록 경로 제어
            if (location.pathname === '/') {
                if (isLoggedIn) {
                    // 로그인 상태: / -> /dashboard로 리다이렉트
                    navigate('/dashboard', { replace: true });
                }
                // 비로그인 상태: /에 머무름 (Main.jsx 표시)
                
            } else if ((location.pathname === '/signin' || location.pathname === '/signup') && isLoggedIn) {
                 // 로그인/회원가입 페이지에 로그인 상태로 접근 시 대시보드로 리다이렉트
                 navigate('/dashboard', { replace: true });
                 
            } else {
                 // 보호된 경로로 접근 시 비로그인 상태이면 리다이렉트
                 const protectedPaths = ['/dashboard', '/portfolio', '/market', '/rewards', '/mypage'];
                 if (protectedPaths.includes(location.pathname) && !isLoggedIn) {
                     navigate('/', { replace: true });
                 }
            }
        };

        checkAuthAndRedirect();
        
    }, [location.pathname, isLoggedIn, navigate, dispatch]);


    // 네비게이션 아이템 정의 
    const navItems = [
        { path: '/dashboard', icon: FiHome, label: '대시보드' },
        { path: '/portfolio', icon: FiBriefcase, label: '포트폴리오' },
        { path: '/market', icon: FiTrendingUp, label: '시장' },
        { path: '/rewards', icon: FiGift, label: '리워드' },
        { path: '/mypage', icon: FiUser, label: '마이페이지' },
    ];

    // CSS 클래스 생성 (이전과 동일)
    const getLinkClass = (path) => {
        // 모바일 뷰 우선
        let classes = "flex flex-col items-center justify-center flex-1 px-2 py-1 text-xs sm:text-sm text-gray-500 hover:text-indigo-600";
        if (location.pathname === path) {
            classes += " text-indigo-600 font-semibold";
        }
        return classes;
    };

    return (
        // 모바일 뷰 최상위 컨테이너: max-w-md와 mx-auto를 Layout에 적용
        <div className="flex flex-col min-h-screen max-w-md mx-auto shadow-lg bg-gray-50"> 
            {/* 페이지 컨텐츠 영역 */}
            <main className="flex-grow pb-16"> 
                <Outlet />
            </main>

            {/* 하단 네비게이션 바 - 모바일 뷰 고정 */}
            {isLoggedIn && (
                <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md h-16 z-10 max-w-md mx-auto">
                    <div className="h-full flex justify-around items-center">
                        {navItems.map((item) => (
                            <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
                                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>
            )}
        </div>
    );
};

export default Layout;