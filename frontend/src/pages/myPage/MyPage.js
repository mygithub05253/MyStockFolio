import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux"; // 사용자 정보 가져오기 위해 필요
// import { useSearchParams, Navigate } from 'react-router-dom'; // 더 이상 Navigate 사용 안 함

// ethers.js 임포트 (잔액 조회용)
import { ethers } from 'ethers';

import BasicButton from '../../components/button/BasicButton';

// TODO: 나중에 실제 ABI와 컨트랙트 주소로 변경
const FOLIO_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];
const FOLIO_TOKEN_ADDRESS = "0x..."; // 실제 배포된 토큰 컨트랙트 주소

const MyPage = () => {
  // const [searchParams] = useSearchParams(); // 더 이상 사용 안 함
  // const login = searchParams.get("login"); // 더 이상 사용 안 함
  // const previousUrl = useSelector((state) => state.user.previousUrl); // 리다이렉트 제거

  // TODO: 실제 Redux 스토어에서 사용자 정보 가져오기
  const currentUser = useSelector((state) => state.user.currentUser) || {
    // 임시 사용자 데이터
    email: "test@example.com",
    nickname: "TestUser",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678" // 임시 지갑 주소
  };

  const [tokenBalance, setTokenBalance] = useState('로딩 중...');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingWallet, setIsEditingWallet] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(currentUser.nickname);
  const [walletInput, setWalletInput] = useState(currentUser.walletAddress);

  useEffect(() => {
    const fetchBalance = async () => {
      // 지갑 주소가 유효하고, MetaMask 같은 프로바이더가 있을 경우 잔액 조회 시도
      if (currentUser.walletAddress && typeof window.ethereum !== 'undefined') {
        try {
          // 참고: 사용자의 MetaMask에 직접 연결하지 않고, 공개 RPC를 통해 잔액 조회
          // 실제 서비스에서는 백엔드(blockchain-minter)를 통해 조회하는 것이 더 안전하고 안정적입니다.
          const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'); // TODO: 실제 Infura ID 사용
          const contract = new ethers.Contract(FOLIO_TOKEN_ADDRESS, FOLIO_TOKEN_ABI, provider);
          const balanceWei = await contract.balanceOf(currentUser.walletAddress);
          const decimals = await contract.decimals(); // 보통 18
          const balanceFormatted = ethers.formatUnits(balanceWei, decimals);
          setTokenBalance(parseFloat(balanceFormatted).toFixed(4)); // 소수점 4자리까지 표시
        } catch (error) {
          console.error("토큰 잔액 조회 실패:", error);
          setTokenBalance('조회 실패');
        }
      } else if (currentUser.walletAddress) {
        setTokenBalance('MetaMask 없음'); // MetaMask 확장 프로그램이 없을 경우
      } else {
        setTokenBalance('지갑 미등록'); // 지갑 주소가 등록되지 않았을 경우
      }
    };

    fetchBalance();
    setNicknameInput(currentUser.nickname);
    setWalletInput(currentUser.walletAddress);
  }, [currentUser.walletAddress, currentUser.nickname]); // 지갑 주소가 변경될 때마다 잔액 다시 조회

  // Etherscan 링크 생성 함수
  const getEtherscanLink = (address) => {
    // TODO: 메인넷 사용 시 sepolia 제거
    return `https://sepolia.etherscan.io/address/${address}`;
  }

  // 지갑 주소 복사 함수 (선택 사항)
  const copyAddress = () => {
    if (currentUser.walletAddress) {
      navigator.clipboard.writeText(currentUser.walletAddress)
        .then(() => alert('지갑 주소가 복사되었습니다.'))
        .catch(err => console.error('주소 복사 실패:', err));
    }
  }

  // --- 임시 핸들러 함수 ---
  const handleNicknameSave = () => {
    console.log("닉네임 저장 시도:", nicknameInput);
    // TODO: 백엔드 API 호출 (PUT /api/user/nickname)
    setIsEditingNickname(false); // 임시: 저장 후 수정 모드 종료
    // currentUser.nickname = nicknameInput; // 실제로는 Redux 상태 업데이트 필요
  };

  const handleWalletSave = () => {
    console.log("지갑 주소 저장 시도:", walletInput);
    // TODO: 백엔드 API 호출 (PUT /api/user/wallet)
    setIsEditingWallet(false); // 임시: 저장 후 수정 모드 종료
    // currentUser.walletAddress = walletInput; // 실제로는 Redux 상태 업데이트 필요
  };

  const handleLogout = () => {
    console.log("로그아웃 시도");
    // TODO: 실제 로그아웃 로직 구현 (Redux 상태 변경, 토큰 삭제 등)
    // 임시: 메인 페이지로 이동 (실제로는 로그인 페이지로 보내야 함)
    window.location.href = '/';
  };

  // 관리자 페이지 로직 (기존 코드 유지 또는 수정)
  // if(login) {
  //   return (
  //     <div>관리자 페이지</div>
  //   )
  // }

  // 리다이렉트 로직 제거
  // return <Navigate to={previousUrl} replace={true} />

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">마이 페이지</h1>

      {/* 사용자 정보 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">내 정보</h2>
            {/* 닉네임 수정 버튼 */}
            {!isEditingNickname && !isEditingWallet && (
                 <button onClick={() => setIsEditingNickname(true)} className="text-sm text-blue-500 hover:underline">닉네임 수정</button>
            )}
        </div>
        <div className="space-y-3 text-sm">
          <p><span className="font-medium text-gray-600 w-20 inline-block">이메일:</span> {currentUser.email}</p>
          <div>
            <span className="font-medium text-gray-600 w-20 inline-block">닉네임:</span>
            {isEditingNickname ? (
              <div className="inline-flex items-center space-x-2 mt-1">
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button onClick={handleNicknameSave} className="text-sm text-green-600 hover:underline">저장</button>
                <button onClick={() => setIsEditingNickname(false)} className="text-sm text-red-600 hover:underline">취소</button>
              </div>
            ) : (
              <span>{currentUser.nickname}</span>
            )}
          </div>
        </div>
      </div>

      {/* 블록체인 정보 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">블록체인 연동</h2>
             {/* 지갑 주소 수정 버튼 */}
            {!isEditingWallet && !isEditingNickname && (
                <button onClick={() => setIsEditingWallet(true)} className="text-sm text-blue-500 hover:underline">지갑 주소 수정</button>
            )}
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium text-gray-600 mb-1">내 지갑 주소:</p>
            {isEditingWallet ? (
               <div className="flex items-center space-x-2 mt-1">
                <input
                  type="text"
                  value={walletInput || ''}
                  onChange={(e) => setWalletInput(e.target.value)}
                  placeholder="0x..."
                  className="flex-grow px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button onClick={handleWalletSave} className="text-sm text-green-600 hover:underline whitespace-nowrap">저장</button>
                <button onClick={() => setIsEditingWallet(false)} className="text-sm text-red-600 hover:underline whitespace-nowrap">취소</button>
              </div>
            ) : (
              currentUser.walletAddress ? (
                <div className="flex items-center space-x-2">
                  <span className="font-mono bg-gray-100 p-1 rounded text-xs truncate flex-grow min-w-0">
                    {currentUser.walletAddress}
                  </span>
                  <button onClick={copyAddress} className="text-blue-500 hover:text-blue-700 text-xs p-1" title="주소 복사">복사</button>
                  <a href={getEtherscanLink(currentUser.walletAddress)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-xs p-1 whitespace-nowrap" title="Etherscan에서 보기">Etherscan</a>
                </div>
              ) : (
                <p className="text-gray-500">지갑 주소가 등록되지 않았습니다.</p>
              )
            )}
          </div>
          <div>
            <p className="font-medium text-gray-600">보유 $FOLIO 토큰:</p>
            <p className="font-semibold text-lg text-indigo-600">{tokenBalance}</p>
          </div>
        </div>
      </div>

       {/* 로그아웃 버튼 */}
       <div className="mt-8">
            <BasicButton
                size={"full"}
                shape={"small"}
                variant={"black"} // 색상 변경 필요 시 Tailwind 클래스 직접 추가 or BasicButton 수정
                color={"white"}
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600" // 기본 스타일 오버라이드 예시
            >
                로그아웃
            </BasicButton>
       </div>
    </div>
  );
};

export default MyPage;