import React from 'react';
import { faBell, faHouse, faListCheck, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPreviousUrl } from '../../modules/user';

const Layout = () => {
  const location = useLocation();

  // --- 임시 로그인 상태 ---
  const isLoggedIn = location.pathname !== '/'; // 루트 경로가 아니면 로그인했다고 가정

  // 비로그인 상태이고 메인 페이지('/')가 아니면 로그인 페이지로 리다이렉트 (선택 사항)
  // if (!isLoggedIn && location.pathname !== '/') {
  //   return <Navigate to="/signIn" replace />;
  // }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      <div className="flex flex-col w-full max-w-md h-[800px] md:h-screen bg-white shadow-lg p-7">
        <header className="flex items-center w-full h-24">
          <Link to={"/"} className="text-2xl font-semibold">MyStockFolio</Link> {/* 이름 변경 */}
        </header>

        {/* 메인 콘텐츠 영역: 로그인 상태에 따라 스타일 변경 */}
        <main className={`flex-1 overflow-y-auto ${isLoggedIn ? '' : 'flex'}`}>
          {/* 비로그인 상태이고 루트 경로일 때만 Main 컴포넌트 렌더링 */}
          {/* <Outlet /> 대신 아래 로직 사용 */}
          {isLoggedIn ? <Outlet /> : (location.pathname === '/' ? <Outlet /> : null)}
        </main>

        {/* 하단 네비게이션: 로그인 상태일 때만 보이도록 함 */}
        {isLoggedIn && (
          <nav className="flex items-center justify-between w-full h-24">
            <NavLink to={"/dashboard"} className="text-center">
              <FontAwesomeIcon icon={faHouse} className="text-2xl p-1 text-gray-400" />
              <p className="text-gray-400">대시보드</p>
            </NavLink>
            <NavLink to={"/portfolio"} className="text-center">
              <FontAwesomeIcon icon={faListCheck} className="text-2xl p-1 text-gray-400" />
              <p className="text-gray-400">포트폴리오</p>
            </NavLink>
            <NavLink to={"/rewards"} className="text-center">
              <FontAwesomeIcon icon={faBell} className="text-2xl p-1 text-gray-400" />
              <p className="text-gray-400">리워드</p> {/* 이름 변경 */}
            </NavLink>
            <NavLink to={"/my"} className="text-center">
              <FontAwesomeIcon icon={faUser} className="text-2xl p-1 text-gray-400" />
              <p className="text-gray-400">My</p>
            </NavLink>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Layout;