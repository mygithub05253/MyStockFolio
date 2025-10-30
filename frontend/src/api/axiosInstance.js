import axios from 'axios';
import store from '../store'; // Redux 스토어 import (경로 확인 필요)
import { logout } from '../modules/user'; // logout 액션 import

// 새로운 axios 인스턴스 생성
const axiosInstance = axios.create({
    // [★★★ 수정: 'localhost' 대신 '127.0.0.1' 명시적 사용 ★★★]
    // Windows 환경에서 localhost 이름 해석 오류를 우회하기 위함
    baseURL: 'http://127.0.0.1:8080', 
    // [★★★ 수정 완료 ★★★]
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 요청 인터셉터 (변경 없음)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 (수정)
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized! Logging out...');
            // 1. sessionStorage에서 토큰 삭제
            sessionStorage.removeItem('accessToken');
            // 2. Redux 스토어 로그아웃 처리
            store.dispatch(logout()); // 스토어 직접 접근하여 디스패치
            // 3. 로그인 페이지로 리다이렉션 또는 알림
            alert('인증 정보가 유효하지 않거나 만료되었습니다. 다시 로그인해주세요.');
            // 현재 페이지가 로그인 페이지가 아닐 경우에만 리다이렉션 (무한 루프 방지)
            if (window.location.pathname !== '/signin') {
                 window.location.href = '/signin';
            }
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;