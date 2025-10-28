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
    const { list: portfolios, selectedPortfolioId } = useSelector(state => state.portfolio);
    const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId);
    
    // UI 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isInsertMode, setIsInsertMode] = useState(false); // 자산 추가 모드
    const [newPortfolioName, onChangeNewPortfolioName, setNewPortfolioName] = useInput(''); // 포트폴리오 이름 입력

    // [P2-1. 포트폴리오 목록 조회 로직]
    useEffect(() => {
        const fetchPortfolios = async () => {
            // TODO: 로딩 상태 디스패치 추가
            try {
                // JWT가 자동으로 첨부되어 /api/portfolios API 호출
                const response = await axiosInstance.get('/api/portfolios');
                const portfolioList = response.data;

                // Redux 스토어 업데이트
                dispatch(setPortfolios(portfolioList));

            } catch (error) {
                console.error("포트폴리오 목록 로드 실패:", error);
                // 401 오류는 axiosInstance 인터셉터에서 자동 처리되므로,
                // 다른 오류(예: 404 Not Found, 500 Server Error)만 여기서 처리
                alert('포트폴리오 목록을 불러오는 데 실패했습니다.');
                // TODO: 오류 상태 디스패치 추가
            }
        };

        fetchPortfolios();
    }, [dispatch]); // dispatch는 변하지 않으므로 의존성 배열에 포함

    // [P2-1. 포트폴리오 생성 로직]
    const handleCreatePortfolio = async () => {
      if (!newPortfolioName.trim()) {
          alert("포트폴리오 이름을 입력해주세요.");
          return;
      }

      try {
          // POST /api/portfolios 호출
          const response = await axiosInstance.post('/api/portfolios', {
              name: newPortfolioName.trim()
          });

          const newPortfolio = response.data;

          // Redux 상태 업데이트 (목록에 추가)
          dispatch(addPortfolio(newPortfolio));

          alert(`포트폴리오 '${newPortfolio.name}'가 생성되었습니다.`);
          setNewPortfolioName(''); // 입력 필드 초기화
          // 생성 후 자산 추가 모드로 전환할 수도 있음 (선택 사항)
          // setIsInsertMode(true); 

      } catch (error) {
          console.error("포트폴리오 생성 실패:", error.response ? error.response.data : error.message);
          if (error.response && error.response.data.error) {
            alert(`포트폴리오 생성 실패: ${error.response.data.error}`);
          } else {
            alert("포트폴리오 생성 중 오류가 발생했습니다.");
          }
      }
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
    const showCreationForm = portfolios.length === 0 && !isInsertMode;

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
          {portfolios.length > 0 && (
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