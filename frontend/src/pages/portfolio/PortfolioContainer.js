import React, { useEffect, useState } from 'react';
import AssetInsert from './AssetInsert';
import AssetItem from './AssetItem';
import AssetDetailModal from '../../components/modal/AssetDetailModal';

const PortfolioContainer = () => {

  const [assets, setAssets] = useState([]);
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  // 모달 상태 관련
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // 모달 열기 함수
  const handleOpenModal = (asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null); // 선택된 자산 초기화
  };

  const getAssets = async () => {
    const response = await fetch("/api/portfolio/assets");
    const datas = await response.json();
    setAssets(datas);
  }

  useEffect(() => {
    getAssets();
  }, [isDataUpdated]);

  if (assets === null) {
    return <div className="text-center py-4">로딩 중...</div>;
  }

  return (
    <div>
      <AssetInsert isDataUpdated={isDataUpdated} setIsDataUpdated={setIsDataUpdated} />

      <p className="text-base font-semibold mb-6">
        내 자산 목록: <span className="text-indigo-500">{Array.isArray(assets) ? assets.length : 0}</span> 개
      </p>
      <ul>
        { Array.isArray(assets) && assets.length > 0 ? (
          assets.map((asset) => (
            // 5. AssetItem에 onClick prop 추가하여 모달 열기 함수 전달
            <AssetItem
              key={asset.id}
              asset={asset}
              isDataUpdated={isDataUpdated}
              setIsDataUpdated={setIsDataUpdated}
              onClick={() => handleOpenModal(asset)} // 클릭 시 모달 열기
            />
          ))
        ) : (
          <li className="text-gray-500 text-center py-4">등록된 자산이 없습니다.</li>
        )}
      </ul>

      {/* 6. 모달 컴포넌트 렌더링 및 props 전달 */}
      <AssetDetailModal
        asset={selectedAsset}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PortfolioContainer;