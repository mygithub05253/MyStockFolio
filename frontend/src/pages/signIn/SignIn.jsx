import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance'; 
import useInput from '../../hooks/useInput'; 
import BasicButton from '../../components/button/BasicButton.jsx'; 

// Redux 추가
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../modules/user'; 

// 소셜 로그인 아이콘 import
import googleIcon from '../../assets/images/google.png';
import kakaoIcon from '../../assets/images/kakao.png';
import naverIcon from '../../assets/images/naver.png';
import metaMaskIcon from '../../assets/images/metamask.png';

const SignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');
    const [error, setError] = useState(''); 

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        try {
            // [기존 기능 유지] 백엔드 로그인 API 호출
            const response = await axiosInstance.post('/api/auth/login', {
                email: email,
                password: password
            });

            const { accessToken, userId, email: userEmail, nickname } = response.data;

            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                dispatch(loginSuccess({ userId, email: userEmail, nickname }));

                alert(`${nickname || '사용자'}님, 환영합니다!`);
                navigate('/dashboard'); 
            } else {
                 setError('로그인 응답에 액세스 토큰이 없습니다.');
            }

        } catch (err) {
            console.error('로그인 실패:', err.response ? err.response.data : err.message);
            const errorMessage = err.response?.data?.error || '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
            setError(errorMessage); 
        }
    };
    
    // [★★★ 개발자 모드 로그인 핸들러 (유지) ★★★]
    const handleDevLogin = () => {
        // 백엔드 연동 없이 임시 토큰/상태 설정
        localStorage.setItem('accessToken', 'DEV_TOKEN_12345'); 
        dispatch(loginSuccess({ userId: 999, email: 'dev@folio.com', nickname: 'DEV_USER' }));
        alert('개발자 모드로 로그인되었습니다. 기능 확인 후 요청 시 이 버튼은 제거됩니다.');
        navigate('/dashboard');
    };

    // 소셜 로그인 버튼 클릭 핸들러 (이전과 동일)
    const handleSocialLogin = (provider) => {
        alert(`${provider} 로그인은 현재 지원되지 않습니다.`);
    };

    // 지갑 로그인 버튼 클릭 핸들러 (이전과 동일)
    const handleWalletLogin = () => {
        alert('MetaMask 로그인은 현재 지원되지 않습니다.');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">
                    로그인
                </h2>
                <form className="space-y-4" onSubmit={onSubmit}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            이메일 주소
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={onChangeEmail}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            비밀번호
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={onChangePassword}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="********"
                        />
                    </div>

                    {/* 오류 메시지 표시 */}
                    {error && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}


                    <BasicButton type="submit" className="w-full">
                        로그인
                    </BasicButton>
                </form>
                
                {/* [★★★ 개발자 모드 로그인 버튼 ★★★] */}
                <BasicButton onClick={handleDevLogin} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-sm">
                    개발자 모드 (FE 테스트용)
                </BasicButton>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            다른 방법으로 로그인
                        </span>
                    </div>
                </div>

                {/* 소셜 로그인 버튼들 */}
                <div className="flex justify-center space-x-4">
                    {/* Google */}
                    <button onClick={() => handleSocialLogin('google')} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        <img src={googleIcon} alt="Google 로그인" className="w-8 h-8" />
                    </button>
                    {/* Kakao */}
                    <button onClick={() => handleSocialLogin('kakao')} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                        <img src={kakaoIcon} alt="Kakao 로그인" className="w-8 h-8" />
                    </button>
                    {/* Naver */}
                    <button onClick={() => handleSocialLogin('naver')} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <img src={naverIcon} alt="Naver 로그인" className="w-8 h-8" />
                    </button>
                    {/* MetaMask */}
                    <button onClick={handleWalletLogin} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                         <img src={metaMaskIcon} alt="MetaMask 로그인" className="w-8 h-8" />
                    </button>
                </div>

                {/* 회원가입 링크 (로그인 화면 하단에 유지) */}
                <div className="text-sm text-center">
                    <span className="text-gray-600">계정이 없으신가요? </span>
                    <button
                        onClick={() => navigate('/signup')}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignIn;