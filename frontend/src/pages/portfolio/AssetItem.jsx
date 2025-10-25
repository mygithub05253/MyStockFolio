import React, { useState } from 'react';
import S from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import useInput from '../../hooks/useInput';

const AssetItem = ({asset, isTodoUpdate, setIsTodoUpdate}) => {
  const {id, name, ticker, quantity, avgBuyPrice} = asset;

  // 수정 할 때
  const [isEdit, setIsEdit] = useState(false);
  const [value, onChangeValue, setValue] = useInput(ticker);

  const handleIsEdit = () => {
    setIsEdit(!isEdit)
  }

  // CRUD 수정
  // 체크 상태관리
  const [isChecked, setIsChecked] = useState(asset.isChecked);

  const handleIsChecked = async () => {
    await fetch(`http://localhost:4000/todo/${id}`, {
      method : 'PUT',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        ...asset,
        isChecked : !isChecked
      })
    }).then((response) => {
      console.log('리스폰트', response)
      if(!response.ok) return console.error(`Error ${response}`)
      setIsTodoUpdate(!isTodoUpdate)
      setIsChecked(!isChecked)
    })
  }
  
  // 삭제
  // Todo 리스트 삭제
  const handleRemoveTodo = async () => {
    if(window.confirm("정말 삭제하시겠습니까?")){
      await fetch(`http://localhost:4000/todo/${id}`, {
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
    await fetch(`http://localhost:4000/todo/${id}`, {
      method : 'PUT',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        ...asset,
        title : value
      })
    }).then((response) => {
      console.log("리스폰스", response)
      if(!response.ok) return console.error(`Error ${response}`)
      setIsTodoUpdate(!isTodoUpdate)
      setIsEdit(!isEdit)
    })
  }

  return (
    <S.Li>
      <S.Wrapper>
        {isEdit ? (
          <input className='update-input' type='text' value={value} onChange={onChangeValue}/>
        ) : (
          <S.Title>
            {name} ({ticker}) - {quantity}주 @ ${avgBuyPrice}
          </S.Title>
        )}
      </S.Wrapper>
      <S.Wrapper>
        {isEdit ? (
          <>
            <S.Button onClick={handleUpdateTodo}>
              <FontAwesomeIcon className='check' icon={faCheck}></FontAwesomeIcon>
            </S.Button>
            <S.Button>
              <FontAwesomeIcon className='exit' icon={faX} onClick={handleIsEdit}></FontAwesomeIcon>
            </S.Button>
          </>
        ) : (
          <S.Button>
            <FontAwesomeIcon className='pen' icon={faPen} onClick={handleIsEdit}></FontAwesomeIcon>
          </S.Button>
        )}
        <S.Button onClick={handleRemoveTodo}>
          <FontAwesomeIcon className='trash' icon={faTrash}></FontAwesomeIcon>
        </S.Button>
      </S.Wrapper>
    </S.Li>
  );
};

export default AssetItem;