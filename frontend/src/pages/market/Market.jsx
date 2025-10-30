import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

// 인기 종목 리스트 (검색 자동완성용)
const popularTickers = [
  { ticker: 'AAPL', name: 'Apple Inc.', type: 'stock' },
  { ticker: 'TSLA', name: 'Tesla Inc.', type: 'stock' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', type: 'stock' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', type: 'stock' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', type: 'stock' },
  { ticker: 'BTC-USD', name: 'Bitcoin', type: 'coin' },
  { ticker: 'ETH-USD', name: 'Ethereum', type: 'coin' },
  { ticker: '005930.KS', name: 'Samsung Electronics', type: 'stock' },
  { ticker: '000660.KS', name: 'SK Hynix', type: 'stock' },
  { ticker: '035420.KS', name: 'NAVER', type: 'stock' },
];

// 숫자 포맷 함수
  const formatCurrency = (value, fractionDigits = 2) => {
  if (value === null || value === undefined) return '-';
  const options = {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  };
    return value.toLocaleString(undefined, options);
  };

  const formatPercentChange = (value) => {
  if (value === null || value === undefined) return '-';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

const formatVolume = (value) => {
  if (value === null || value === undefined) return '-';
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
  return value.toLocaleString();
};

const getFractionDigits = (ticker) => {
  if (!ticker) return 2;
  return ticker.includes('.KS') || ticker.includes('.KQ') ? 0 : 2;
};

const Market = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicker, setSelectedTicker] = useState('AAPL'); // 기본 선택 종목
  const [detailedQuote, setDetailedQuote] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'stock', 'coin'

  // 상세 시세 정보 조회
  const fetchDetailedQuote = async (ticker) => {
      setIsLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get(`http://localhost:8001/api/market/quote?ticker=${ticker}`);
      setDetailedQuote(response.data);
      console.log('상세 시세 조회 성공:', response.data);
    } catch (err) {
      console.error('상세 시세 조회 실패:', err);
      setError(`'${ticker}' 시세 조회 실패: ${err.response?.data?.detail || err.message}`);
      setDetailedQuote(null);
    } finally {
      setIsLoading(false);
    }
    };

  // 차트 데이터 조회
  const fetchChartData = async (ticker) => {
    try {
      const response = await axiosInstance.get(`http://localhost:8001/api/market/chart?ticker=${ticker}&period=1mo`);
      setChartData(response.data.history || []);
      console.log('차트 데이터 조회 성공:', response.data);
    } catch (err) {
      console.error('차트 데이터 조회 실패:', err);
      setChartData([]);
    }
  };

  // 종목 선택 시
  const handleSelectTicker = (ticker) => {
    setSelectedTicker(ticker);
    fetchDetailedQuote(ticker);
    fetchChartData(ticker);
  };

  // 검색 실행
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError('종목 코드를 입력해주세요.');
      return;
    }
    handleSelectTicker(searchTerm.toUpperCase());
  };

  // 초기 로드 (기본 종목)
  useEffect(() => {
    fetchDetailedQuote(selectedTicker);
    fetchChartData(selectedTicker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 필터링된 인기 종목
  const filteredTickers = popularTickers.filter(item => {
    if (activeTab === 'stock') return item.type === 'stock';
    if (activeTab === 'coin') return item.type === 'coin';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">시장 탐색</h1>
      </div>

      {/* 검색 바 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
            placeholder="종목 코드 입력 (예: AAPL, BTC-USD, 005930.KS)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            검색
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
          {error}
        </div>
      )}

      {/* HTS 스타일 레이아웃 - 반응형 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        
        {/* 왼쪽: 인기 종목 리스트 (모바일에서는 상단) */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">인기 종목</h3>
            <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('all')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
        >
          전체
        </button>
        <button
          onClick={() => setActiveTab('stock')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'stock'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
        >
                주식
        </button>
        <button
          onClick={() => setActiveTab('coin')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'coin'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
        >
                코인
        </button>
            </div>
          </div>
          <ul className="divide-y divide-gray-200 max-h-96 lg:max-h-[600px] overflow-y-auto">
            {filteredTickers.map((item) => (
              <li
                key={item.ticker}
                onClick={() => handleSelectTicker(item.ticker)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedTicker === item.ticker
                    ? 'bg-indigo-50 border-l-4 border-indigo-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold text-gray-800 text-sm">{item.ticker}</div>
                <div className="text-xs text-gray-600 mt-1">{item.name}</div>
              </li>
            ))}
          </ul>
      </div>

        {/* 중앙: 상세 시세 정보 */}
        <div className="lg:col-span-6 bg-white rounded-lg shadow-md p-4 md:p-6">
            {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500 text-lg">로딩 중...</div>
            </div>
          ) : detailedQuote ? (
            <>
              {/* 종목 헤더 */}
              <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{detailedQuote.name}</h2>
                <span className="px-3 py-1 bg-gray-100 rounded-md text-sm font-semibold text-gray-700">
                  {detailedQuote.ticker}
                </span>
              </div>

              {/* 현재가 */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 mb-6 text-white">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {formatCurrency(detailedQuote.current_price, getFractionDigits(detailedQuote.ticker))}
                  <span className="text-lg md:text-xl ml-2 opacity-90">{detailedQuote.currency}</span>
                </div>
                <div className={`text-lg md:text-xl font-semibold ${
                  detailedQuote.change >= 0 ? 'text-green-300' : 'text-red-300'
                }`}>
                  {detailedQuote.change >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(detailedQuote.change), getFractionDigits(detailedQuote.ticker))} ({formatPercentChange(detailedQuote.change_percent)})
                </div>
              </div>

              {/* 시세 정보 테이블 */}
              <div className="mb-6 overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 px-2 md:px-4 text-sm font-semibold text-gray-600">시가</td>
                      <td className="py-3 px-2 md:px-4 text-sm text-gray-800">{formatCurrency(detailedQuote.open_price, getFractionDigits(detailedQuote.ticker))}</td>
                      <td className="py-3 px-2 md:px-4 text-sm font-semibold text-gray-600">고가</td>
                      <td className="py-3 px-2 md:px-4 text-sm text-red-600 font-semibold">{formatCurrency(detailedQuote.high_price, getFractionDigits(detailedQuote.ticker))}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 md:px-4 text-sm font-semibold text-gray-600">저가</td>
                      <td className="py-3 px-2 md:px-4 text-sm text-blue-600 font-semibold">{formatCurrency(detailedQuote.low_price, getFractionDigits(detailedQuote.ticker))}</td>
                      <td className="py-3 px-2 md:px-4 text-sm font-semibold text-gray-600">전일 종가</td>
                      <td className="py-3 px-2 md:px-4 text-sm text-gray-800">{formatCurrency(detailedQuote.previous_close, getFractionDigits(detailedQuote.ticker))}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 md:px-4 text-sm font-semibold text-gray-600">거래량</td>
                      <td className="py-3 px-2 md:px-4 text-sm text-gray-800">{formatVolume(detailedQuote.volume)}</td>
                      <td className="py-3 px-2 md:px-4 text-sm font-semibold text-gray-600">시가총액</td>
                      <td className="py-3 px-2 md:px-4 text-sm text-gray-800">{detailedQuote.market_cap ? formatVolume(detailedQuote.market_cap) : '-'}</td>
                    </tr>
                    {detailedQuote.pe_ratio && (
                      <tr>
                        <td className="py-3 px-2 md:px-4 text-sm font-semibold text-gray-600">PER</td>
                        <td className="py-3 px-2 md:px-4 text-sm text-gray-800">{detailedQuote.pe_ratio.toFixed(2)}</td>
                        <td className="py-3 px-2 md:px-4"></td>
                        <td className="py-3 px-2 md:px-4"></td>
                </tr>
            )}
          </tbody>
        </table>
              </div>

              {/* 간단한 차트 */}
              {chartData.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">최근 30일 추이</h3>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl mb-3">📈</p>
                    <p className="text-sm text-gray-700 mb-2">차트 데이터: {chartData.length}개 포인트</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">최저가</p>
                        <p className="text-sm font-semibold text-blue-600">
                          {formatCurrency(Math.min(...chartData.map(d => d.price)), getFractionDigits(detailedQuote.ticker))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">최고가</p>
                        <p className="text-sm font-semibold text-red-600">
                          {formatCurrency(Math.max(...chartData.map(d => d.price)), getFractionDigits(detailedQuote.ticker))}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-amber-700 bg-amber-50 border-l-2 border-amber-500 p-3 mt-4 text-left rounded">
                      💡 실시간 차트 라이브러리(Chart.js, Recharts 등)를 추가하면 시각화된 차트를 볼 수 있습니다.
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              종목을 선택하거나 검색해주세요.
            </div>
          )}
        </div>

        {/* 오른쪽: 호가창 */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b-2 border-gray-200">
            호가 정보
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl mb-3">📊</p>
            <p className="text-sm font-semibold text-gray-700 mb-3">실시간 호가 정보</p>
            <div className="text-xs text-blue-700 bg-blue-50 border-l-2 border-blue-500 p-3 text-left rounded leading-relaxed">
              💡 실시간 호가 데이터는 WebSocket 또는 실시간 API 연동이 필요합니다.
              <br /><br />
              Yahoo Finance는 실시간 호가를 제공하지 않으므로, 향후 다음과 같은 방법으로 구현할 수 있습니다:
              <br /><br />
              • 한국 주식: KIS API (한국투자증권)
              <br />
              • 미국 주식: Alpaca API, IEX Cloud
              <br />
              • 암호화폐: Binance WebSocket, Upbit API
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
