// frontend/src/pages/portfolio/PortfolioContainer.jsx

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import { addPortfolio, setPortfolios } from '../../modules/portfolio'; // Redux 액션 import
import AssetItem from './AssetItem.jsx'; // .jsx 확장자 사용 확인

// 모달 컴포넌트 import (확장자 .jsx로 통일 권장)
import AssetDetailModal from '../../components/modal/AssetDetailModal.jsx';
import AssetInsert from './AssetInsert.jsx';
import BasicButton from '../../components/button/BasicButton.jsx';
import useInput from '../../hooks/useInput.js';


const PortfolioContainer = () => {
    const dispatch = useDispatch();
    // Redux에서 포트폴리오 목록과 선택된 포트폴리오 ID 가져오기
    const portfolioState = useSelector(state => state.portfolio);
    
    // 안전한 기본값 설정
    const portfolios = (portfolioState && Array.isArray(portfolioState.list)) ? portfolioState.list : [];
    const selectedPortfolioId = portfolioState?.selectedPortfolioId || null;
    const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId) || null;
    
    // 디버깅을 위한 로그
    console.log('PortfolioContainer - portfolioState:', portfolioState);
    console.log('PortfolioContainer - portfolios:', portfolios);
    console.log('PortfolioContainer - selectedPortfolioId:', selectedPortfolioId);
    
    // UI 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isInsertMode, setIsInsertMode] = useState(false); // 자산 추가 모드
    const [newPortfolioName, onChangeNewPortfolioName, setNewPortfolioName] = useInput(''); // 포트폴리오 이름 입력

    // [P2-1. 포트폴리오 목록 조회 로직]
    useEffect(() => {
        // 임시로 테스트 데이터 사용 (API 문제 해결 전까지)
        const testPortfolios = [
            {
                id: 1,
                name: "내 첫 포트폴리오",
                assets: [
                    {
                        id: 1,
                        ticker: "AAPL",
                        name: "Apple Inc.",
                        quantity: 10,
                        avgBuyPrice: 150.00,
                        assetType: "STOCK"
                    },
                    {
                        id: 2,
                        ticker: "BTC-USD",
                        name: "Bitcoin",
                        quantity: 0.5,
                        avgBuyPrice: 45000.00,
                        assetType: "COIN"
                    }
                ]
            },
            {
                id: 2,
                name: "테스트 포트폴리오",
                assets: [
                    {
                        id: 3,
                        ticker: "TSLA",
                        name: "Tesla Inc.",
                        quantity: 5,
                        avgBuyPrice: 200.00,
                        assetType: "STOCK"
                    }
                ]
            }
        ];
        
        console.log("테스트 데이터 사용:", testPortfolios);
        dispatch(setPortfolios(testPortfolios));
        
        // API 호출은 일시적으로 비활성화
        /*
        const fetchPortfolios = async () => {
            try {
                const response = await axiosInstance.get('/api/portfolios');
                const portfolioList = response.data;
                console.log('API Response:', response.data);
                dispatch(setPortfolios(portfolioList));
            } catch (error) {
                console.error("포트폴리오 목록 로드 실패:", error);
                console.error("Error details:", error.response?.data);
                
                const testPortfolios = [
                    {
                        id: 1,
                        name: "테스트 포트폴리오",
                        assets: []
                    }
                ];
                console.log("테스트 데이터 사용:", testPortfolios);
                dispatch(setPortfolios(testPortfolios));
            }
        };
        fetchPortfolios();
        */
    }, [dispatch]);

    // [P2-1. 포트폴리오 생성 로직]
    const handleCreatePortfolio = async () => {
      if (!newPortfolioName.trim()) {
          alert("포트폴리오 이름을 입력해주세요.");
          return;
      }

      // 임시로 로컬 상태만 업데이트 (API 호출 없이)
      const newPortfolio = {
          id: Date.now(), // 임시 ID
          name: newPortfolioName.trim(),
          assets: []
      };

      // Redux 상태 업데이트 (목록에 추가)
      dispatch(addPortfolio(newPortfolio));

      alert(`포트폴리오 '${newPortfolio.name}'가 생성되었습니다.`);
      setNewPortfolioName(''); // 입력 필드 초기화
      
      // API 호출은 일시적으로 비활성화
      /*
      try {
          const response = await axiosInstance.post('/api/portfolios', {
              name: newPortfolioName.trim()
          });
          const newPortfolio = response.data;
          dispatch(addPortfolio(newPortfolio));
          alert(`포트폴리오 '${newPortfolio.name}'가 생성되었습니다.`);
          setNewPortfolioName('');
      } catch (error) {
          console.error("포트폴리오 생성 실패:", error.response ? error.response.data : error.message);
          if (error.response && error.response.data.error) {
            alert(`포트폴리오 생성 실패: ${error.response.data.error}`);
          } else {
            alert("포트폴리오 생성 중 오류가 발생했습니다.");
          }
      }
      */
    };

    const handleAssetClick = (asset) => {
      setSelectedAsset(asset);
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedAsset(null);
    };
    
    const toggleInsertMode = () => {
        setIsInsertMode(prev => !prev);
    };

    // 포트폴리오가 없을 때 생성 폼을 먼저 보여줌
    const showCreationForm = Array.isArray(portfolios) && portfolios.length === 0 && !isInsertMode;

    // 모바일 뷰 중앙 정렬 및 너비 제한은 Layout.jsx에서 처리
    return (
      <div className="container mx-auto p-4 max-w-md"> 
          <h1 className="text-2xl font-bold mb-6">내 포트폴리오</h1>

          {/* 포트폴리오 생성 섹션 */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-3">새 포트폴리오 생성</h2>
              <div className="flex space-x-2">
                  <input 
                      type="text" 
                      value={newPortfolioName}
                      onChange={onChangeNewPortfolioName}
                      placeholder="포트폴리오 이름을 입력하세요"
                      className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <BasicButton onClick={handleCreatePortfolio} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4">
                      생성
                  </BasicButton>
              </div>
          </div>

          {/* 포트폴리오 선택 UI 영역 (TODO: 추후 여러 개일 때 선택 기능 구현 필요) */}
          {Array.isArray(portfolios) && portfolios.length > 0 && (
              <div className="mb-4">
                  <select className="w-full p-2 border rounded-md shadow-sm">
                      {portfolios.map(p => (
                          <option key={p.id} value={p.id}>
                              {p.name}
                          </option>
                      ))}
                  </select>
              </div>
          )}


          {/* 자산 추가 버튼 */}
          {selectedPortfolioId && (
              <BasicButton onClick={toggleInsertMode} className="w-full mb-4 bg-green-500 hover:bg-green-600">
                  {isInsertMode ? '자산 목록 보기' : '자산 추가'}
              </BasicButton>
          )}

          {/* 자산 추가 폼 or 자산 목록 */}
          {isInsertMode ? (
                <AssetInsert 
                    portfolioId={selectedPortfolioId} 
                    onInsertSuccess={() => { 
                        toggleInsertMode(); 
                        // TODO: 자산 목록 새로고침 로직 호출 필요 
                    }} 
                />
            ) : (
                <div className="space-y-4">
                    {selectedPortfolio ? (
                        selectedPortfolio.assets && selectedPortfolio.assets.length > 0 ? (
                            selectedPortfolio.assets.map(asset => (
                                <AssetItem 
                                    key={asset.id} 
                                    asset={asset} 
                                    portfolioId={selectedPortfolioId} // portfolioId 전달
                                    onClick={() => handleAssetClick(asset)} // 클릭 시 상세 모달 열기
                                />
                            ))
                        ) : (
                            // ... (자산 없음 메시지 유지) ...
                             <p className="text-center text-gray-500 mt-10 p-4 bg-white rounded-lg shadow-sm">
                                포트폴리오 '{selectedPortfolio.name}'에 등록된 자산이 없습니다.
                            </p>
                        )
                    ) : (
                         <p className="text-center text-gray-500 mt-10 p-4 bg-white rounded-lg shadow-sm">
                            포트폴리오를 생성하여 투자를 시작하세요.
                         </p>
                    )}
                </div>
            )}
            

            {/* 자산 상세 모달 */}
            {selectedAsset && (
                <AssetDetailModal 
                    isOpen={isModalOpen} 
                    onClose={closeModal} 
                    asset={selectedAsset} 
                    portfolioId={selectedPortfolioId} // <-- portfolioId 전달
                />
            )}
        </div>
  );
};

export default PortfolioContainer;