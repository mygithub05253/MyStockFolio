import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import useInput from '../../hooks/useInput';

const AssetItem = ({asset, isTodoUpdate, setIsTodoUpdate}) => {
  const {id, name, ticker, quantity, avgBuyPrice} = asset;

  // 수정 할 때
  const [isEdit, setIsEdit] = useState(false);
  const [value, onChangeValue] = useInput(ticker);

  const handleIsEdit = () => {
    setIsEdit(!isEdit)
  }

  // CRUD 수정
  // 체크 상태관리
  // const [isChecked, setIsChecked] = useState(asset.isChecked);

  // const handleIsChecked = async () => {
  //   await fetch(`/api/portfolio/assets/${id}`, {
  //     method : 'PUT',
  //     headers : {
  //       'Content-Type' : 'application/json'
  //     },
  //     body : JSON.stringify({
  //       ...asset,
  //       isChecked : !isChecked
  //     })
  //   }).then((response) => {
  //     console.log('리스폰트', response)
  //     if(!response.ok) return console.error(`Error ${response}`)
  //     setIsTodoUpdate(!isTodoUpdate)
  //     setIsChecked(!isChecked)
  //   })
  // }
  
  // 삭제
  const handleRemoveTodo = async () => {
    if(window.confirm("정말 삭제하시겠습니까?")){
      await fetch(`/api/portfolio/assets/${id}`, {
        method : 'DELETE'
      }).then((response) => {
        console.log("리스폰스 받기", response)
        if(response.ok) {
          setIsTodoUpdate(!isTodoUpdate)
        }
      })
    }
  }
  
  // 수정
  // 타이틀 수정
  const handleUpdateTodo = async () => {
    await fetch(`/api/portfolio/assets/${id}`, {
      method : 'PUT',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        ...asset,
        ticker : value
      })
    }).then((response) => {
      console.log("리스폰스", response)
      if(!response.ok) return console.error(`Error ${response}`)
      setIsTodoUpdate(!isTodoUpdate)
      setIsEdit(!isEdit)
    })
  }

  return (
    <li className="flex justify-between items-center h-10">
      <div className="flex items-center">
        {isEdit ? (
          <input className='update-input' type='text' value={value} onChange={onChangeValue}/>
        ) : (
          <p className="text-base font-normal">
            {name} ({ticker}) - {quantity}주 @ ${avgBuyPrice}
          </p>
        )}
      </div>
      <div className="flex items-center">
        {isEdit ? (
          <>
            <button className="bg-transparent border-none cursor-pointer text-base" onClick={handleUpdateTodo}>
              <FontAwesomeIcon className='check' icon={faCheck}></FontAwesomeIcon>
            </button>
            <button className="bg-transparent border-none cursor-pointer text-base" onClick={handleIsEdit}>
              <FontAwesomeIcon className='exit' icon={faX}></FontAwesomeIcon>
            </button>
          </>
        ) : (
          <button className="bg-transparent border-none cursor-pointer text-base">
            <FontAwesomeIcon className='pen' icon={faPen} onClick={handleIsEdit}></FontAwesomeIcon>
          </button>
        )}
        <button className="bg-transparent border-none cursor-pointer text-base ml-2" onClick={handleRemoveTodo}>
          <FontAwesomeIcon className='trash' icon={faTrash}></FontAwesomeIcon>
        </button>
      </div>
    </li>
  );
};

export default AssetItem;