import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance'; // axiosInstance 사용
import useInput from '../../hooks/useInput'; // useInput hook 사용
import BasicButton from '../../components/button/BasicButton'; // BasicButton 컴포넌트 사용

// Redux 추가
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../modules/user'; // loginSuccess 액션 import

// 소셜 로그인 아이콘 import
import googleIcon from '../../assets/images/google.png';
import kakaoIcon from '../../assets/images/kakao.png';
import naverIcon from '../../assets/images/naver.png';
import metaMaskIcon from '../../assets/images/metamask.png';

const SignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // useDispatch 훅 사용
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

        // 🚧 임시 개발용: dev@test.com / dev123 으로 로그인하면 개발 모드 로그인 (추후 제거)
        if (email === 'dev@test.com' && password === 'dev123') {
            localStorage.setItem('accessToken', 'DEV_TOKEN');
            dispatch(loginSuccess({ userId: 999, email: 'dev@test.com', nickname: '개발자' }));
            alert('🚧 개발 모드: 임시 로그인 완료!');
            navigate('/dashboard');
            return;
        }

        try {
            const response = await axiosInstance.post('/api/auth/login', {
                email: email,
                password: password
            });

            // 응답 데이터에서 필요한 정보 추출
            const { accessToken, userId, email: userEmail, nickname } = response.data;

            if (accessToken) {
                // 1. localStorage에 accessToken 저장
                localStorage.setItem('accessToken', accessToken);

                // 2. Redux 스토어에 로그인 성공 상태 및 사용자 정보 저장
                dispatch(loginSuccess({ userId, email: userEmail, nickname }));

                console.log('로그인 성공:', response.data);
                alert(`${nickname || '사용자'}님, 환영합니다!`);
                navigate('/dashboard');
            } else {
                 setError('로그인 응답에 액세스 토큰이 없습니다.');
            }

        } catch (err) {
            console.error('로그인 실패:', err.response ? err.response.data : err.message);
            // 🚧 개발 모드 안내 추가
            const errorMessage = err.response?.data?.error || '백엔드 서버가 실행되지 않았습니다. 개발 모드를 사용하려면 이메일: dev@test.com / 비밀번호: dev123 으로 로그인하세요.';
            setError(errorMessage);
        }
    };

    // ... (소셜/지갑 로그인 핸들러 및 JSX는 이전과 동일) ...
     // 소셜 로그인 버튼 클릭 핸들러 (현재는 기능 없음)
    const handleSocialLogin = (provider) => {
        alert(`${provider} 로그인은 현재 지원되지 않습니다.`);
        // TODO: 각 소셜 로그인 API 연동 구현
        // window.location.href = `/oauth2/authorization/${provider}`; // 백엔드 OAuth2 엔드포인트로 리다이렉션
    };

    // 지갑 로그인 버튼 클릭 핸들러 (현재는 기능 없음)
    const handleWalletLogin = () => {
        alert('MetaMask 로그인은 현재 지원되지 않습니다.');
        // TODO: MetaMask 연동 및 백엔드 지갑 인증 API 호출 구현
    };

    return (
        <div className="flex flex-col w-full h-full justify-center py-8">
            <div className="w-full space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-900">
                    로그인
                </h2>
                <form className="space-y-6" onSubmit={onSubmit}>
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