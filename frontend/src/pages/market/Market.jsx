import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChartLine, faCoins } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const mockMarketData = [
  { id: 'AAPL', type: 'stock', name: 'Apple Inc.', price: 175.25, changePercent: 0.86 },
  { id: 'TSLA', type: 'stock', name: 'Tesla, Inc.', price: 250.80, changePercent: -0.83 },
  { id: 'BTC-USD', type: 'coin', name: 'Bitcoin', price: 42500.00, changePercent: 1.19 },
  { id: 'ETH-USD', type: 'coin', name: 'Ethereum', price: 2300.50, changePercent: -0.65 },
  { id: '005930.KS', type: 'stock', name: 'Samsung Electronics', price: 72000.00, changePercent: 0.14 },
];

const fetchMarketData = async (type = 'all', search = '') => {
  // TODO: FastAPI 백엔드 구현 후 실제 API 엔드포인트로 변경
  // const apiUrl = `/api/market/list?type=${type}&search=${search}`;
  console.log(`API 호출 시도: type=${type}, search=${search}`);

  try {
    // 임시: 0.5초 딜레이 후 목 데이터 반환 (실제 호출 시 아래 주석 해제)
    // const response = await axios.get(apiUrl);
    // return response.data; // 실제 API 응답 데이터 반환

    return new Promise(resolve => {
      setTimeout(() => {
        const filteredData = mockMarketData.filter(item =>
          (type === 'all' || item.type === type) &&
          (search === '' ||
           item.name.toLowerCase().includes(search.toLowerCase()) ||
           item.id.toLowerCase().includes(search.toLowerCase()))
        );
        resolve(filteredData); // 필터링된 목 데이터 반환
      }, 500);
    });

  } catch (error) {
    console.error("시장 데이터 API 호출 실패:", error);
    // API 호출 실패 시 빈 배열 또는 목 데이터 반환 (선택)
    return [];
  }
};

// 숫자 포맷 함수 (대시보드와 유사)
  const formatCurrency = (value, fractionDigits = 2) => {
    // 한국 주식 등 소수점 없는 경우 고려 (임시)
    const options = tickerSupportsFraction(value)
      ? { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }
      : { minimumFractionDigits: 0, maximumFractionDigits: 0 };
    return value.toLocaleString(undefined, options);
  };
  const formatPercentChange = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  const tickerSupportsFraction = (ticker) => !ticker.includes('.KS');
const getCurrency = (ticker) => (ticker.includes('.KS') ? 'KRW' : 'USD');
const getFractionDigits = (ticker) => (ticker.includes('.KS') ? 0 : 2);

const Market = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'stock', 'coin'
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    // useEffect에서 API 호출 함수 사용
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchMarketData(activeTab, searchTerm);
      setMarketData(data);
      setIsLoading(false);
    };

    loadData();
  }, [activeTab, searchTerm]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">시장 탐색</h1>

      {/* 1. 검색 바 */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="자산 검색 (예: Apple, BTC)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* 2. 자산 유형 탭 */}
      <div className="mb-6 flex space-x-1 border-b">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'all' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          전체
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'stock' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FontAwesomeIcon icon={faChartLine} className="mr-1" /> 주식
        </button>
        <button
          onClick={() => setActiveTab('coin')}
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'coin' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FontAwesomeIcon icon={faCoins} className="mr-1" /> 코인
        </button>
      </div>

      {/* 3. 자산 목록 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {/* ... thead ... */}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan="3" className="text-center py-4 text-gray-500">데이터 로딩 중...</td></tr>
            ) : marketData.length > 0 ? (
              marketData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => alert(`${item.name} 클릭됨 - 상세 보기 구현 예정`)}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.id}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {formatCurrency(item.price, getFractionDigits(item.id), getCurrency(item.id))}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-right text-sm font-medium ${item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentChange(item.changePercent)}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="text-center py-4 text-gray-500">검색 결과가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Market;