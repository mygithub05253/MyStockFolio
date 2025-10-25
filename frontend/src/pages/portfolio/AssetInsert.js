import React from 'react';
import useInput from '../../hooks/useInput';
import S from './style';
import BasicButton from '../../components/button/BasicButton';

const AssetInsert = ({isTodoUpdate, setIsTodoUpdate}) => {
  const [ticker, onChangeTicker, setTicker] = useInput("");
  const [quantity, onChangeQuantity, setQuantity] = useInput("");
  const [avgPrice, onChangeAvgPrice, setAvgPrice] = useInput("");

  const onSubmitAsset = async (e) => {
    e.preventDefault();
    if(!window.confirm("이대로 추가 하시겠습니까?")) return;

    await fetch("/api/portfolio/assets", {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },

      body : JSON.stringify({
        ticker: ticker,
        quantity: parseFloat(quantity),
        avgBuyPrice: parseFloat(avgPrice)
      })
    }).then((response) => {
      console.log("리스폰스", response)
      if(!response.ok) return console.log(`Error ${response}`)
      setIsTodoUpdate(!isTodoUpdate);

      setTicker("");
      setQuantity("");
      setAvgPrice("");
    })
  }

  return (
    <form onSubmit={onSubmitAsset} style={{ marginBottom: '50px' }}>
      <S.Input 
        type='text' 
        placeholder='종목 티커 (예: AAPL, BTC-USD)' 
        value={ticker} 
        onChange={onChangeTicker} 
        required 
        style={{ marginBottom: '10px' }}
      />
      <S.Input 
        type='number' 
        placeholder='보유 수량' 
        value={quantity} 
        onChange={onChangeQuantity} 
        required 
        step="any"
        style={{ marginBottom: '10px' }}
      />
      <S.Input 
        type='number' 
        placeholder='평균 매수 단가 ($)' 
        value={avgPrice} 
        onChange={onChangeAvgPrice} 
        required 
        step="any"
        style={{ marginBottom: '10px' }}
      />
      <BasicButton size={"full"} shape={"small"} variant={"black"} color={"white"}> 
        자산 추가
      </BasicButton>
    </form>
  );
};

export default AssetInsert;