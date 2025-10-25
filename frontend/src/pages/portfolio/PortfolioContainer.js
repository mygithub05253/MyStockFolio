import React, { useEffect, useState } from 'react';
import AssetInsert from './AssetInsert';
import AssetItem from './AssetItem';

const PortfolioContainer = () => {

  const [assets, setAssets] = useState([]);
  const [isTodoUpdate, setIsTodoUpdate] = useState(false);

  const getAssets = async () => {
    const response = await fetch("http://localhost:4000/assets");
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
      <p className='SubTitle'>남은 할일: 🙂<span>{assets && assets.length}</span></p>
      <ul>
        { assets && assets.map((asset, i) => (
          <AssetItem key={i} asset={asset} isTodoUpdate={isTodoUpdate} setIsTodoUpdate={setIsTodoUpdate} />
        ))}
      </ul>
    </div>
  );
};

export default PortfolioContainer;