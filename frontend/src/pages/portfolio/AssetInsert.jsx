import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import useInput from '../../hooks/useInput';
import BasicButton from '../../components/button/BasicButton.jsx';
import { addAsset } from '../../modules/portfolio'; 

// 블록체인 자산 관리 시스템의 자산 유형 옵션
const ASSET_TYPES = [
    { value: 'STOCK', label: '주식 (Stock)' },
    { value: 'COIN', label: '코인/토큰 (Coin)' },
    { value: 'STABLECOIN', label: '스테이블코인 (Stablecoin)' },
    { value: 'DEFI', label: '디파이 토큰 (DeFi)' },
    { value: 'NFT', label: 'NFT' },
    { value: 'OTHER', label: '기타 블록체인 자산' }
];

const AssetInsert = ({ portfolioId, onInsertSuccess }) => {
    const dispatch = useDispatch();
    const [ticker, onChangeTicker, setTicker] = useInput('');
    const [quantity, onChangeQuantity, setQuantity] = useInput('');
    const [avgBuyPrice, onChangeAvgBuyPrice, setAvgBuyPrice] = useInput('');
    const [assetType, setAssetType] = useState(ASSET_TYPES[0].value); // 기본값 설정
    const [name, onChangeName, setName] = useInput(''); 
    const [error, setError] = useState('');

    const handleAssetTypeChange = (e) => {
        setAssetType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        const parsedQuantity = parseFloat(quantity);
        const parsedAvgBuyPrice = parseFloat(avgBuyPrice);

        if (!ticker.trim()) {
            setError('티커를 입력해주세요.');
            return;
        }

        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            setError('보유 수량은 0보다 커야 합니다.');
            return;
        }

        if (isNaN(parsedAvgBuyPrice) || parsedAvgBuyPrice <= 0) {
            setError('평균 매입 가격은 0보다 커야 합니다.');
            return;
        }

        const requestData = {
            ticker: ticker.toUpperCase(),
            quantity: parsedQuantity,
            avgBuyPrice: parsedAvgBuyPrice,
            assetType: assetType,
            name: name.trim() || null 
        };

        console.log('➕ 자산 추가 요청:', requestData);
        console.log('   Portfolio ID:', portfolioId);

        try {
            // [API 호출]: POST /api/portfolios/{portfolioId}/assets
            const response = await axiosInstance.post(`/api/portfolios/${portfolioId}/assets`, requestData);

            console.log('✅ 자산 추가 성공:', response.data);
            const newAsset = response.data;
            
            // Redux 상태 업데이트
            dispatch(addAsset(portfolioId, newAsset));

            alert(`자산 ${newAsset.name} (${newAsset.ticker})가 포트폴리오에 추가되었습니다.`);
            
            // 성공 후 입력 폼 초기화 및 자산 목록 보기로 전환
            setTicker('');
            setQuantity('');
            setAvgBuyPrice('');
            setName('');
            if (onInsertSuccess) {
                onInsertSuccess();
            }

        } catch (error) {
            console.error("❌ 자산 추가 실패:", error);
            console.error("   응답 데이터:", error.response?.data);
            console.error("   상태 코드:", error.response?.status);
            console.error("   에러 메시지:", error.message);
            
            const errorMessage = error.response?.data?.error || error.message || '자산 추가 중 오류가 발생했습니다.';
            setError(errorMessage);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">새 자산 추가</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 자산 유형 선택 */}
                <div>
                    <label htmlFor="assetType" className="block text-sm font-medium text-gray-700">자산 유형 *</label>
                    <select
                        id="assetType"
                        value={assetType}
                        onChange={handleAssetTypeChange}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {ASSET_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                {/* 티커/심볼 */}
                <div>
                    <label htmlFor="ticker" className="block text-sm font-medium text-gray-700">티커/심볼 *</label>
                    <input
                        id="ticker"
                        type="text"
                        value={ticker}
                        onChange={onChangeTicker}
                        placeholder="AAPL, BTC-USD, SSU001"
                        required
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                
                 {/* 이름 (선택 사항) */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">자산 이름 (선택)</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={onChangeName}
                        placeholder="예: 애플, 비트코인"
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                
                {/* 수량 */}
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">보유 수량 *</label>
                    <input
                        id="quantity"
                        type="number"
                        min="0.000001"
                        step="any"
                        value={quantity}
                        onChange={onChangeQuantity}
                        required
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* 평균 매입 가격 */}
                <div>
                    <label htmlFor="avgBuyPrice" className="block text-sm font-medium text-gray-700">평균 매입 가격 * (₩ 또는 USD)</label>
                    <input
                        id="avgBuyPrice"
                        type="number"
                        min="0.000001"
                        step="any"
                        value={avgBuyPrice}
                        onChange={onChangeAvgBuyPrice}
                        required
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                
                {/* 오류 메시지 */}
                {error && <p className="text-sm text-red-600">{error}</p>}

                <BasicButton type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    자산 등록
                </BasicButton>
            </form>
        </div>
    );
};

export default AssetInsert;