import React from 'react'; // React import 추가
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../modules/user'; // logout 액션 import
import BasicButton from '../../components/button/BasicButton'; // BasicButton 컴포넌트 사용

// 아이콘 import (react-icons 예시)
import { FiCopy, FiExternalLink, FiLogOut } from 'react-icons/fi';

const MyPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Redux 스토어에서 사용자 정보 가져오기
    const { userInfo } = useSelector(state => state.user);

    // 로그아웃 핸들러
    const handleLogout = () => {
        // 1. sessionStorage에서 토큰 제거
        sessionStorage.removeItem('accessToken');
        // 2. Redux 스토어 상태 업데이트
        dispatch(logout());
        // 3. (선택) axiosInstance 헤더 초기화 (필수는 아님, 다음 요청 시 어차피 토큰 없음)
        // delete axiosInstance.defaults.headers.common['Authorization'];
        // 4. 메인 페이지 또는 로그인 페이지로 이동
        alert('로그아웃 되었습니다.');
        navigate('/'); // 메인 페이지로 이동
    };

    // 지갑 주소 복사 핸들러 (navigator.clipboard 사용)
    const handleCopyAddress = () => {
        if (userInfo?.walletAddress) {
            navigator.clipboard.writeText(userInfo.walletAddress)
                .then(() => alert('지갑 주소가 복사되었습니다.'))
                .catch(err => console.error('주소 복사 실패:', err));
        }
    };

    // Etherscan 링크 핸들러 (실제 네트워크에 맞는 URL 필요)
    const handleEtherscanLink = () => {
        if (userInfo?.walletAddress) {
            // TODO: 실제 사용하는 네트워크에 맞는 Etherscan URL로 변경 (예: Sepolia 테스트넷)
            const etherscanUrl = `https://etherscan.io/address/${userInfo.walletAddress}`;
            window.open(etherscanUrl, '_blank', 'noopener,noreferrer');
        }
    };

    // TODO: 닉네임, 지갑 주소 수정 로직 구현 필요
    const handleUpdateNickname = () => alert('닉네임 수정 기능은 준비 중입니다.');
    const handleUpdateWalletAddress = () => alert('지갑 주소 수정 기능은 준비 중입니다.');

    // userInfo가 로드되지 않았을 경우 처리 (선택적)
    if (!userInfo) {
         // TODO: 로딩 상태 표시 또는 로그인 페이지로 리다이렉션 고려
        return <div>사용자 정보를 불러오는 중...</div>;
    }


    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

            {/* 사용자 정보 섹션 */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">계정 정보</h2>
                <div className="space-y-3">
                    <p><span className="font-medium">이메일:</span> {userInfo.email}</p>
                    <div className="flex items-center">
                        <span className="font-medium mr-2">닉네임:</span>
                        <span>{userInfo.nickname}</span>
                        <BasicButton onClick={handleUpdateNickname} size="sm" className="ml-auto">수정</BasicButton>
                    </div>
                </div>
            </div>

            {/* 블록체인 정보 섹션 */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">블록체인 정보</h2>
                <div className="space-y-3">
                    <div className="flex items-center">
                        <span className="font-medium mr-2">지갑 주소:</span>
                        <span className="truncate flex-1 mr-2">{userInfo.walletAddress || '등록되지 않음'}</span>
                        {userInfo.walletAddress && (
                            <>
                                <button onClick={handleCopyAddress} className="text-gray-500 hover:text-gray-700 mr-2" title="주소 복사">
                                    <FiCopy />
                                </button>
                                <button onClick={handleEtherscanLink} className="text-gray-500 hover:text-gray-700" title="Etherscan에서 보기">
                                    <FiExternalLink />
                                </button>
                                <BasicButton onClick={handleUpdateWalletAddress} size="sm" className="ml-auto">수정</BasicButton>
                            </>
                        )}
                        {!userInfo.walletAddress && (
                             <BasicButton onClick={handleUpdateWalletAddress} size="sm" className="ml-auto">등록</BasicButton>
                        )}
                    </div>
                    {/* TODO: 실제 API 연동 필요 */}
                    <p><span className="font-medium">Folio Token 잔액:</span> {'0'} FOLIO</p>
                    <p><span className="font-medium">보상 내역:</span> {'준비 중'}</p>
                </div>
            </div>

            {/* 로그아웃 버튼 */}
            <BasicButton onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600">
                <FiLogOut className="inline-block mr-2" /> 로그아웃
            </BasicButton>
        </div>
    );
};

export default MyPage;