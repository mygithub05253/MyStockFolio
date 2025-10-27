import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { ethers } from 'ethers';
import BasicButton from '../../components/button/BasicButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 아이콘 사용 위해 임포트
import { faCopy, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'; // 복사, 외부링크 아이콘 임포트

// 실제 ABI 및 주소로 변경 필요
const FOLIO_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)" // 토큰 심볼 조회 함수 추가
];
// 실제 배포된 토큰 컨트랙트 주소 (Sepolia 테스트넷 예시)
const FOLIO_TOKEN_ADDRESS = "0xYourFolioTokenContractAddressHere";
// 사용할 Infura 또는 Alchemy 프로젝트 ID (Sepolia 테스트넷 예시)
const INFURA_PROJECT_ID = 'YOUR_INFURA_PROJECT_ID';
const ETHERSCAN_BASE_URL = 'https://sepolia.etherscan.io'; // 테스트넷 기준

const MyPage = () => {
  const currentUser = useSelector((state) => state.user.currentUser) || {
    email: "test@example.com",
    nickname: "TestUser",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678"
  };

  const [tokenBalance, setTokenBalance] = useState('로딩 중...');
  const [tokenSymbol, setTokenSymbol] = useState('$FOLIO'); // 기본 심볼 설정
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingWallet, setIsEditingWallet] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(currentUser.nickname);
  const [walletInput, setWalletInput] = useState(currentUser.walletAddress);

  useEffect(() => {
    const fetchBalanceAndSymbol = async () => {
      // 지갑 주소, 컨트랙트 주소, 프로젝트 ID가 모두 유효할 때만 실행
      if (currentUser.walletAddress && FOLIO_TOKEN_ADDRESS !== "0x..." && INFURA_PROJECT_ID !== 'YOUR_INFURA_PROJECT_ID') {
        try {
          const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);
          const contract = new ethers.Contract(FOLIO_TOKEN_ADDRESS, FOLIO_TOKEN_ABI, provider);

          // 잔액과 심볼을 병렬로 조회
          const [balanceWei, symbolResult, decimalsResult] = await Promise.all([
             contract.balanceOf(currentUser.walletAddress),
             contract.symbol(),
             contract.decimals()
          ]);

          const decimals = parseInt(decimalsResult.toString()); // BigInt를 숫자로 변환
          const balanceFormatted = ethers.formatUnits(balanceWei, decimals);
          setTokenBalance(parseFloat(balanceFormatted).toFixed(4));
          setTokenSymbol(symbolResult); // 조회된 실제 토큰 심볼로 업데이트

        } catch (error) {
          console.error("토큰 정보 조회 실패:", error);
          setTokenBalance('조회 실패');
          setTokenSymbol('$FOLIO'); // 실패 시 기본값 유지
        }
      } else if (!currentUser.walletAddress) {
        setTokenBalance('지갑 미등록');
        setTokenSymbol('$FOLIO');
      } else {
         setTokenBalance('설정 필요'); // 컨트랙트 주소나 Infura ID 미설정 시
         setTokenSymbol('$FOLIO');
      }
    };

    fetchBalanceAndSymbol();
    setNicknameInput(currentUser.nickname);
    setWalletInput(currentUser.walletAddress);
  }, [currentUser.walletAddress, currentUser.nickname]);

  // Etherscan 링크 생성 (주소 타입에 따라 분기)
  const getEtherscanLink = (address, type = 'address') => {
    if (!address) return '#';
    const path = type === 'token' ? 'token' : 'address';
    return `${ETHERSCAN_BASE_URL}/${path}/${address}`;
  }

  // 주소 복사 함수
  const copyToClipboard = (text, type) => {
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => alert(`${type} 주소가 복사되었습니다.`))
        .catch(err => console.error(`${type} 주소 복사 실패:`, err));
    }
  }

  // 임시 핸들러 함수들
  const handleNicknameSave = () => { console.log("닉네임 저장 시도:", nicknameInput); setIsEditingNickname(false); };
  const handleWalletSave = () => { console.log("지갑 주소 저장 시도:", walletInput); setIsEditingWallet(false); };
  const handleLogout = () => { console.log("로그아웃 시도"); window.location.href = '/'; };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">마이 페이지</h1>

      {/* 사용자 정보 섹션  */}
      <div className="bg-white p-6 rounded-lg shadow">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">내 정보</h2>
            {!isEditingNickname && !isEditingWallet && (
                 <button onClick={() => setIsEditingNickname(true)} className="text-sm text-blue-500 hover:underline">닉네임 수정</button>
            )}
        </div>
        <div className="space-y-3 text-sm">
           <p><span className="font-medium text-gray-600 w-20 inline-block">이메일:</span> {currentUser.email}</p>
           <div className="flex items-center">
             <span className="font-medium text-gray-600 w-20 inline-block flex-shrink-0">닉네임:</span>
            {isEditingNickname ? (
              <div className="flex items-center space-x-2 w-full">
                <input type="text" value={nicknameInput} onChange={(e) => setNicknameInput(e.target.value)} className="flex-grow px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                <button onClick={handleNicknameSave} className="text-sm text-green-600 hover:underline whitespace-nowrap">저장</button>
                <button onClick={() => setIsEditingNickname(false)} className="text-sm text-red-600 hover:underline whitespace-nowrap">취소</button>
              </div>
            ) : (
              <span>{currentUser.nickname}</span>
            )}
           </div>
        </div>
      </div>

      {/* 블록체인 정보 섹션 (UI 개선) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">블록체인 연동</h2>
             {!isEditingWallet && !isEditingNickname && (
                <button onClick={() => setIsEditingWallet(true)} className="text-sm text-blue-500 hover:underline">지갑 주소 수정</button>
            )}
        </div>
        <div className="space-y-4 text-sm">
          {/* 내 지갑 주소 */}
          <div>
            <p className="font-medium text-gray-600 mb-1">내 지갑 주소:</p>
            {isEditingWallet ? (
               <div className="flex items-center space-x-2">
                <input type="text" value={walletInput || ''} onChange={(e) => setWalletInput(e.target.value)} placeholder="0x..." className="flex-grow px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                <button onClick={handleWalletSave} className="text-sm text-green-600 hover:underline whitespace-nowrap">저장</button>
                <button onClick={() => setIsEditingWallet(false)} className="text-sm text-red-600 hover:underline whitespace-nowrap">취소</button>
              </div>
            ) : (
              currentUser.walletAddress ? (
                <div className="flex items-center space-x-2">
                  <span className="font-mono bg-gray-100 p-1 rounded text-xs truncate flex-grow min-w-0" title={currentUser.walletAddress}>
                    {currentUser.walletAddress}
                  </span>
                  <button onClick={() => copyToClipboard(currentUser.walletAddress, '지갑')} className="text-gray-500 hover:text-blue-500 p-1" title="주소 복사">
                     <FontAwesomeIcon icon={faCopy} />
                  </button>
                  <a href={getEtherscanLink(currentUser.walletAddress, 'address')} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500 p-1" title="Etherscan에서 보기">
                     <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                </div>
              ) : (
                <p className="text-gray-500">지갑 주소가 등록되지 않았습니다.</p>
              )
            )}
          </div>

          {/* 토큰 정보 */}
          <div>
             <p className="font-medium text-gray-600 mb-1">보유 토큰 ({tokenSymbol}):</p>
             <p className="font-semibold text-lg text-indigo-600">{tokenBalance}</p>
          </div>

          {/* 컨트랙트 정보 */}
          {FOLIO_TOKEN_ADDRESS !== "0x..." && ( // 컨트랙트 주소가 설정되었을 때만 표시
            <div>
              <p className="font-medium text-gray-600 mb-1">토큰 컨트랙트:</p>
              <div className="flex items-center space-x-2">
                 <span className="font-mono bg-gray-100 p-1 rounded text-xs truncate flex-grow min-w-0" title={FOLIO_TOKEN_ADDRESS}>
                    {FOLIO_TOKEN_ADDRESS}
                  </span>
                 <button onClick={() => copyToClipboard(FOLIO_TOKEN_ADDRESS, '컨트랙트')} className="text-gray-500 hover:text-blue-500 p-1" title="주소 복사">
                     <FontAwesomeIcon icon={faCopy} />
                  </button>
                  <a href={getEtherscanLink(FOLIO_TOKEN_ADDRESS, 'token')} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500 p-1" title="Etherscan에서 보기">
                     <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
              </div>
            </div>
          )}
        </div>
      </div>

       {/* 로그아웃 버튼 (변경 없음) */}
       <div className="mt-8">
            <BasicButton
                size={"full"} shape={"small"} variant={"black"} color={"white"}
                onClick={handleLogout} className="bg-red-500 hover:bg-red-600"
            >
                로그아웃
            </BasicButton>
       </div>
    </div>
  );
};

export default MyPage;