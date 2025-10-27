import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import useInput from '../../hooks/useInput';

// props에 onClick 추가
const AssetItem = ({asset, isDataUpdated, setIsDataUpdated, onClick}) => {
  const {id, name, ticker, quantity, avgBuyPrice} = asset || {};

  const [isEdit, setIsEdit] = useState(false);
  const [value, onChangeValue] = useInput(ticker || '');

  const handleIsEdit = (e) => {
    e.stopPropagation(); // 이벤트 버블링 중단
    setIsEdit(!isEdit);
  }

  const handleRemoveAsset = async (e) => {
    e.stopPropagation(); // 이벤트 버블링 중단
    if(!asset || !asset.id) return;
    if(window.confirm("정말 삭제하시겠습니까?")){
      await fetch(`/api/portfolio/assets/${id}`, {
        method : 'DELETE'
      }).then((response) => {
        console.log("리스폰스 받기", response);
        setIsDataUpdated(!isDataUpdated);
      })
    }
  }

  const handleUpdateAsset = async (e) => {
    e.stopPropagation(); // 이벤트 버블링 중단
    if(!asset || !asset.id) return;
    await fetch(`/api/portfolio/assets/${id}`, {
      method : 'PUT',
      headers : { 'Content-Type' : 'application/json' },
      body : JSON.stringify({
        ...asset,
        ticker: value
      })
    }).then((response) => {
      console.log("리스폰스", response);
      setIsDataUpdated(!isDataUpdated);
      setIsEdit(!isEdit);
    })
  }

  if (!asset) {
    return null;
  }

  // avgBuyPrice가 숫자인지 확인하고 toFixed 적용
  const formattedAvgPrice = typeof avgBuyPrice === 'number' ? avgBuyPrice.toFixed(2) : 'N/A';

  return (
    // li 태그에 onClick 이벤트 핸들러 추가 및 스타일 변경
    <li
      className="flex justify-between items-center h-10 mb-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 p-2 rounded transition duration-150 ease-in-out"
      onClick={onClick} // 부모 컴포넌트의 handleOpenModal 호출
    >
      <div className="flex items-center flex-grow min-w-0">
        {isEdit ? (
          // 수정 시 이벤트 버블링 중단
          <input className='w-full h-8 px-4 bg-gray-100 border-none rounded-lg text-sm' type='text' value={value} onChange={onChangeValue} onClick={(e) => e.stopPropagation()}/>
        ) : (
          <p className="text-sm sm:text-base font-normal truncate pr-2">
            {name || 'Unknown'} ({ticker}) - {quantity}주 @ ${formattedAvgPrice}
          </p>
        )}
      </div>

      {/* 버튼 영역 */}
      <div className="flex flex-shrink-0 ml-2">
        {isEdit ? (
          <>
            {/* 버튼 클릭 시 이벤트 버블링 중단 */}
            <button className="bg-transparent border-none cursor-pointer text-base text-purple-500 hover:text-purple-700 p-1" onClick={handleUpdateAsset}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button className="bg-transparent border-none cursor-pointer text-base text-gray-500 hover:text-gray-700 p-1 ml-1" onClick={handleIsEdit}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </>
        ) : (
          <button className="bg-transparent border-none cursor-pointer text-base text-blue-500 hover:text-blue-700 p-1" onClick={handleIsEdit}>
            <FontAwesomeIcon icon={faPen} />
          </button>
        )}
        <button className="bg-transparent border-none cursor-pointer text-base text-red-500 hover:text-red-700 p-1 ml-1" onClick={handleRemoveAsset}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </li>
  );
};

export default AssetItem;