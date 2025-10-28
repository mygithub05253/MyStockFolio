import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';

// MyPage에서 사용했던 상수 재활용 또는 별도 파일로 분리 필요
const FOLIO_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];
const FOLIO_TOKEN_ADDRESS = "0xYourFolioTokenContractAddressHere";
const INFURA_PROJECT_ID = 'YOUR_INFURA_PROJECT_ID';
const ETHERSCAN_BASE_URL = 'https://sepolia.etherscan.io';

const Rewards = () => {
  const currentUser = useSelector((state) => state.user.currentUser) || {
     walletAddress: "0x1234567890abcdef1234567890abcdef12345678" // 임시
  };
  const [tokenBalance, setTokenBalance] = useState('로딩 중...');
  const [tokenSymbol, setTokenSymbol] = useState('$FOLIO');

  useEffect(() => {
    // MyPage와 유사한 잔액/심볼 조회 로직
    const fetchTokenInfo = async () => {
       if (currentUser.walletAddress && FOLIO_TOKEN_ADDRESS !== "0x..." && INFURA_PROJECT_ID !== 'YOUR_INFURA_PROJECT_ID') {
        try {
          const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);
          const contract = new ethers.Contract(FOLIO_TOKEN_ADDRESS, FOLIO_TOKEN_ABI, provider);
          const [balanceWei, symbolResult, decimalsResult] = await Promise.all([
             contract.balanceOf(currentUser.walletAddress),
             contract.symbol(),
             contract.decimals()
          ]);
          const decimals = parseInt(decimalsResult.toString());
          const balanceFormatted = ethers.formatUnits(balanceWei, decimals);
          setTokenBalance(parseFloat(balanceFormatted).toFixed(4));
          setTokenSymbol(symbolResult);
        } catch (error) {
          console.error("토큰 정보 조회 실패:", error);
          setTokenBalance('조회 실패');
        }
      } else if (!currentUser.walletAddress) {
        setTokenBalance('지갑 미등록');
      } else {
         setTokenBalance('설정 필요');
      }
    };
    fetchTokenInfo();
  }, [currentUser.walletAddress]);

   const getEtherscanLink = (address, type = 'address') => {
    if (!address) return '#';
    const path = type === 'token' ? 'token' : 'address';
    return `${ETHERSCAN_BASE_URL}/${path}/${address}`;
  }


  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">리워드 센터</h1>

      {/* 보유 토큰 현황 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">내 {tokenSymbol} 잔액</h2>
        <p className="font-semibold text-3xl text-indigo-600 mb-4">{tokenBalance}</p>
        {currentUser.walletAddress && FOLIO_TOKEN_ADDRESS !== "0x..." && (
             <a
              href={getEtherscanLink(FOLIO_TOKEN_ADDRESS, 'token')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
             >
                {tokenSymbol} 컨트랙트 정보 보기
             </a>
        )}
      </div>

       {/* 토큰 획득 방법 안내 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">토큰 획득 방법</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>포트폴리오에 새 자산 등록 시 +10 {tokenSymbol}</li>
            <li>매일 출석 시 +1 {tokenSymbol} (구현 예정)</li>
            <li>친구 초대 시 +50 {tokenSymbol} (구현 예정)</li>
        </ul>
      </div>

       {/* 토큰 거래 내역 */}
       <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">최근 활동 내역</h2>
        {/* TODO: 백엔드 또는 블록체인에서 실제 거래 내역 조회 API 연동 */}
        <p className="text-sm text-gray-500">아직 활동 내역이 없습니다.</p>
        {/* 예시:
        <ul className="space-y-2 text-sm">
            <li className="flex justify-between border-b pb-1"><span>자산 등록 보상</span> <span className="text-green-600">+10 {tokenSymbol}</span></li>
            <li className="flex justify-between border-b pb-1"><span>출석 보상</span> <span className="text-green-600">+1 {tokenSymbol}</span></li>
        </ul>
        */}
      </div>
    </div>
  );
};

export default Rewards;