import './App.css';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import router from './routes/router';
import axiosInstance from './api/axiosInstance';
import { loginSuccess, logout } from './modules/user';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      // OAuth2 콜백/회원가입 페이지에서는 로그인 상태 복원을 건너뜀 (중복 방지)
      if (window.location.pathname === '/oauth2/callback' || window.location.pathname === '/oauth2/signup') {
        return;
      }

      const token = sessionStorage.getItem('accessToken');
      
      if (token) {
        // 실제 백엔드 연동 코드
        try {
          const response = await axiosInstance.get('/api/auth/me');
          const { userId, email, nickname } = response.data;
          // alert 없이 조용히 로그인 상태 복원
          dispatch(loginSuccess({ userId, email, nickname }));
          console.log('로그인 상태 복원:', { userId, email, nickname });
        } catch (error) {
          console.error('토큰 검증 실패:', error);
          sessionStorage.removeItem('accessToken');
          dispatch(logout());
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
