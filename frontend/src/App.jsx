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
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        // 🚧 임시 개발용: 백엔드 없이 테스트하기 위한 코드 (추후 제거)
        // 토큰이 'DEV_TOKEN'이면 더미 데이터로 로그인 처리
        if (token === 'DEV_TOKEN') {
          dispatch(loginSuccess({ 
            userId: 999, 
            email: 'dev@test.com', 
            nickname: '개발자' 
          }));
          console.log('🚧 개발 모드: 임시 로그인 완료');
          return;
        }
        
        // 실제 백엔드 연동 코드 (백엔드 완성 후 사용)
        try {
          const response = await axiosInstance.get('/api/auth/me');
          const { userId, email, nickname } = response.data;
          dispatch(loginSuccess({ userId, email, nickname }));
        } catch (error) {
          console.error('토큰 검증 실패:', error);
          localStorage.removeItem('accessToken');
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
