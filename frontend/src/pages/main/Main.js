import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import BasicButton from '../../components/button/BasicButton';
import { logout, loginSuccess } from '../../modules/user';

const Main = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    dispatch(logout());
    alert('로그아웃되었습니다.');
  };

  // 🚧 임시 개발용: 백엔드 없이 테스트하기 위한 함수 (추후 제거)
  const handleDevLogin = () => {
    localStorage.setItem('accessToken', 'DEV_TOKEN');
    dispatch(loginSuccess({ 
      userId: 999, 
      email: 'dev@test.com', 
      nickname: '개발자' 
    }));
    alert('🚧 개발 모드: 임시 로그인 완료!');
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-grow flex items-center justify-center">
        <img src={process.env.PUBLIC_URL + "/images/main/penguin.png"} alt="펭귄" className="max-w-[70%] max-h-[70%]" />
      </div>
      <div className="w-full flex flex-col justify-end mb-24 space-y-4">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard">
              <BasicButton size={"full"} shape={"small"} variant={"black"} color={"white"}>대시보드</BasicButton>
            </Link>
            <Link to="/portfolio">
              <BasicButton size={"full"} shape={"small"} variant={"black"} color={"white"}>포트폴리오</BasicButton>
            </Link>
            <BasicButton size={"full"} shape={"small"} variant={"black"} color={"white"} onClick={handleLogout}>로그아웃</BasicButton>
          </>
        ) : (
          <>
            {/* 🚧 임시 개발용 버튼 (추후 제거) */}
            <BasicButton 
              size={"full"} 
              shape={"small"} 
              variant={"black"} 
              color={"white"}
              onClick={handleDevLogin}
            >
              🚧 개발자 모드 로그인
            </BasicButton>
            <Link to={"/signIn"}>
              <BasicButton size={"full"} shape={"small"} variant={"black"} color={"white"}>로그인</BasicButton>
            </Link>
            <Link to={"/signUp"}>
              <BasicButton size={"full"} shape={"small"} variant={"black"} color={"white"}>회원가입</BasicButton>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Main;