import React, { useEffect, useState } from 'react';
import AssetInsert from './AssetInsert';
import AssetItem from './AssetItem';

const PortfolioContainer = () => {

  const [assets, setAssets] = useState([]);
  const [isTodoUpdate, setIsTodoUpdate] = useState(false);

  const getAssets = async () => {
    const response = await fetch("/api/portfolio/assets");
    const datas = await response.json();
    setAssets(datas);
  }

  useEffect(() => {
    getAssets()
  }, [isTodoUpdate])

  console.log(assets)

  return (
    <div>
      <AssetInsert isTodoUpdate={isTodoUpdate} setIsTodoUpdate={setIsTodoUpdate} assets={assets} />
      <p className="text-base font-semibold mb-6">내 자산 목록: 💎<span className="text-indigo-500">{assets && assets.length}</span></p>
      <ul>
        { assets && assets.map((asset, i) => (
          <AssetItem key={i} asset={asset} isTodoUpdate={isTodoUpdate} setIsTodoUpdate={setIsTodoUpdate} />
        ))}
      </ul>
    </div>
  );
};

export default PortfolioContainer;