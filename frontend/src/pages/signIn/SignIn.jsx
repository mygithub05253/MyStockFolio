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
            // 백엔드 로그인 API 호출
            const response = await axiosInstance.post('/api/auth/login', {
                email: email,
                password: password
            });

            const { accessToken, userId, email: userEmail, nickname } = response.data;

            if (accessToken) {
                sessionStorage.setItem('accessToken', accessToken);
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

    // 소셜 로그인 버튼 클릭 핸들러
    const handleSocialLogin = (provider) => {
        // 백엔드 OAuth2 엔드포인트로 리다이렉트
        const backendUrl = 'http://localhost:8080';
        window.location.href = `${backendUrl}/oauth2/authorization/${provider}`;
    };

    // 지갑 로그인 버튼 클릭 핸들러
    const handleWalletLogin = async () => {
        try {
            // MetaMask 설치 확인
            if (typeof window.ethereum === 'undefined') {
                alert('MetaMask가 설치되어 있지 않습니다. MetaMask를 설치해주세요.');
                window.open('https://metamask.io/download/', '_blank');
                return;
            }

            // 계정 연결 요청
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];

            if (!walletAddress) {
                alert('지갑 주소를 가져올 수 없습니다.');
                return;
            }

            // 1. Nonce 요청
            const nonceResponse = await axiosInstance.post('/api/auth/metamask/nonce', {
                walletAddress: walletAddress
            });

            const { nonce, message } = nonceResponse.data;

            // 2. 사용자에게 서명 요청
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, walletAddress]
            });

            // 3. 서명 검증 및 로그인
            const verifyResponse = await axiosInstance.post('/api/auth/metamask/verify', {
                walletAddress: walletAddress,
                signature: signature,
                nickname: null // 신규 사용자는 별도 입력 받을 수 있음
            });

            const { accessToken, userId, email: userEmail, nickname, isNewUser } = verifyResponse.data;

            // 토큰 저장 및 Redux 업데이트
            sessionStorage.setItem('accessToken', accessToken);
            dispatch(loginSuccess({ userId, email: userEmail, nickname }));

            if (isNewUser) {
                alert(`${nickname}님, 환영합니다! 새로운 계정이 생성되었습니다.`);
            } else {
                alert(`${nickname}님, 다시 오신 것을 환영합니다!`);
            }

            navigate('/dashboard');

        } catch (err) {
            console.error('MetaMask 로그인 실패:', err);
            const errorMessage = err.response?.data?.message || 'MetaMask 로그인 중 오류가 발생했습니다.';
            alert(errorMessage);
        }
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

                {/* 회원가입 링크 */}
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
